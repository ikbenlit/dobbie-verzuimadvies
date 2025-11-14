import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { mollieClient } from '@/lib/mollie/client';
import { SequenceType } from '@mollie/api-client';
import { createClient } from '@/lib/supabase/server';
import { validateDiscountCode, getBasePrice } from '@/lib/payment';
import { calculateContractDates } from '@/lib/payment/contract';
import { createMollieCustomer } from '@/lib/mollie/customer';
import type { PlanType, BillingPeriod } from '@/lib/payment/types';
import type { User } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Request body schema voor payment creation
 */
const createPaymentSchema = z.object({
  plan: z.enum(['solo', 'team'], {
    message: 'Plan moet solo of team zijn',
  }),
  billing: z.enum(['monthly', 'yearly'], {
    message: 'Billing moet monthly of yearly zijn',
  }),
  discountCode: z.string().optional(),
});

/**
 * POST /api/payment/create
 * 
 * Maakt een Mollie payment aan voor een abonnement
 * 
 * Request body:
 * {
 *   plan: 'solo' | 'team',
 *   billing: 'monthly' | 'yearly',
 *   discountCode?: string
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   paymentUrl?: string,
 *   error?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Check user authentication
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Niet geautoriseerd. Log eerst in om te betalen.' },
        { status: 401 }
      );
    }

    // 2. Parse en valideer request body
    const body = await request.json();
    const validation = createPaymentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || 'Ongeldige request data',
        },
        { status: 400 }
      );
    }

    const { plan, billing, discountCode } = validation.data;

    // 3. Valideer kortingscode (indien aanwezig) - dubbele validatie voor security
    let finalPrice: number;
    const originalPrice = getBasePrice(plan as PlanType, billing as BillingPeriod);
    let discountAmount = 0;
    let appliedDiscountCode: string | null = null;

    if (discountCode && discountCode.trim()) {
      const normalizedCode = discountCode.trim().toUpperCase();
      const validationResult = await validateDiscountCode(
        normalizedCode,
        plan as PlanType,
        billing as BillingPeriod
      );

      if (!validationResult.valid || !validationResult.discount) {
        return NextResponse.json(
          {
            success: false,
            error: validationResult.error || 'Kortingscode is ongeldig',
          },
          { status: 400 }
        );
      }

      // Gebruik de gevalideerde korting
      finalPrice = validationResult.discount.finalPrice;
      discountAmount = validationResult.discount.discountAmount;
      appliedDiscountCode = normalizedCode;
    } else {
      // Geen kortingscode, gebruik originele prijs
      finalPrice = originalPrice;
    }

    // 4. Bepaal SITE_URL voor redirect URLs
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    'http://localhost:3000');

    // 5. Prepare metadata voor beide flows
    const metadata = {
      userId: user.id,
      plan,
      billing,
      discountCode: appliedDiscountCode || '',
      discountAmount: discountAmount.toString(),
      originalPrice: originalPrice.toString(),
      finalPrice: finalPrice.toString(),
    };

    // 6. Route based on billing type
    // E3.S1: Split payment flow tussen monthly (subscription) en yearly (one-time)
    if (billing === 'monthly') {
      return await createMonthlySubscription(
        user,
        plan as PlanType,
        finalPrice,
        metadata,
        siteUrl,
        supabase
      );
    } else {
      return await createYearlyPayment(
        user,
        plan as PlanType,
        finalPrice,
        metadata,
        siteUrl,
        supabase
      );
    }
  } catch (error) {
    console.error('Error creating payment:', error);

    // Mollie API errors
    if (error && typeof error === 'object' && 'message' in error) {
      return NextResponse.json(
        {
          success: false,
          error: `Betalingsfout: ${error.message}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Er ging iets mis bij het aanmaken van de betaling. Probeer het later opnieuw.',
      },
      { status: 500 }
    );
  }
}

/**
 * Metadata type voor payment creation
 */
interface PaymentMetadata {
  userId: string;
  plan: string;
  billing: string;
  discountCode: string;
  discountAmount: string;
  originalPrice: string;
  finalPrice: string;
}

/**
 * E3.S2: Routing functie voor monthly subscription payment
 * 
 * Deze functie maakt een eerste payment aan voor een monthly subscription.
 * De eerste payment creëert een SEPA mandate via sequenceType: 'first'.
 * 
 * Flow:
 * 1. Create/get Mollie customer
 * 2. Create first payment met sequenceType: 'first' (creates mandate)
 * 3. Store payment in database
 * 4. Return payment URL
 * 
 * @param user - Authenticated user
 * @param plan - Plan type (solo/team)
 * @param finalPrice - Final price after discount
 * @param metadata - Payment metadata
 * @param siteUrl - Site URL for redirects
 * @param supabase - Supabase client
 */
async function createMonthlySubscription(
  user: User,
  plan: PlanType,
  finalPrice: number,
  metadata: PaymentMetadata,
  siteUrl: string,
  supabase: SupabaseClient
): Promise<NextResponse> {
  try {
    // 1. Create/get Mollie customer (E2.S1)
    console.log(`[Monthly Subscription] Creating/getting customer for user ${user.id}`);
    const customerId = await createMollieCustomer(user.id);

    // 2. Create first payment met sequenceType: 'first' (creates SEPA mandate)
    const description = `${plan === 'solo' ? 'Solo' : 'Team'} Maandelijks Abonnement - Eerste maand`;

    // Check if running on localhost (webhooks won't work locally)
    const isLocalhost = siteUrl.includes('localhost') || siteUrl.includes('127.0.0.1');

    if (isLocalhost) {
      console.log(`[Monthly Subscription] Running on localhost - webhooks will be skipped`);
    }

    console.log(`[Monthly Subscription] Creating first payment for customer ${customerId}`);
    const firstPayment = await mollieClient.customerPayments.create({
      customerId,
      amount: {
        value: finalPrice.toFixed(2),
        currency: 'EUR',
      },
      description,
      redirectUrl: `${siteUrl}/checkout/success`,
      cancelUrl: `${siteUrl}/checkout/cancel`,
      // Only add webhook URL if not running on localhost
      ...(isLocalhost ? {} : { webhookUrl: `${siteUrl}/api/webhooks/mollie` }),
      sequenceType: SequenceType.first, // Creates SEPA mandate!
      metadata: {
        ...metadata,
        subscriptionType: 'monthly', // Markeer als monthly subscription
      },
    });

    console.log(`[Monthly Subscription] First payment created: ${firstPayment.id}`);

    // 3. Store payment in database
    const { error: dbError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        mollie_payment_id: firstPayment.id,
        amount: finalPrice,
        currency: 'EUR',
        status: 'open',
        description,
      });

    if (dbError) {
      console.error('[Monthly Subscription] Error saving payment to database:', dbError);
      // Payment is al aangemaakt bij Mollie, maar niet opgeslagen in DB
      // Dit is niet ideaal, maar we kunnen de gebruiker nog steeds doorsturen
      // De webhook kan dit later oplossen
    } else {
      console.log(`[Monthly Subscription] Payment ${firstPayment.id} saved to database`);
    }

    // 4. Return payment URL voor redirect
    return NextResponse.json({
      success: true,
      paymentUrl: firstPayment.getCheckoutUrl(),
      paymentId: firstPayment.id,
    });
  } catch (error) {
    console.error('[Monthly Subscription] Error creating monthly subscription:', error);

    // Mollie API errors
    if (error && typeof error === 'object' && 'message' in error) {
      return NextResponse.json(
        {
          success: false,
          error: `Betalingsfout: ${error.message}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Er ging iets mis bij het aanmaken van de maandelijkse betaling. Probeer het later opnieuw.',
      },
      { status: 500 }
    );
  }
}

/**
 * E3.S3: Routing functie voor yearly one-time payment
 * 
 * Deze functie bevat de bestaande one-time payment logica met contract dates.
 * Yearly payments hebben ook een 12-maanden contractperiode met 14-dagen opt-out.
 * 
 * @param user - Authenticated user
 * @param plan - Plan type (solo/team)
 * @param finalPrice - Final price after discount
 * @param metadata - Payment metadata
 * @param siteUrl - Site URL for redirects
 * @param supabase - Supabase client
 */
async function createYearlyPayment(
  user: User,
  plan: PlanType,
  finalPrice: number,
  metadata: PaymentMetadata,
  siteUrl: string,
  supabase: SupabaseClient
): Promise<NextResponse> {
  try {
    // E3.S3: Bereken contract dates voor yearly payment
    // Contract start = vandaag (bij succesvolle betaling)
    const contractStartDate = new Date();
    const contractDates = calculateContractDates(contractStartDate);

    // Maak Mollie payment aan (one-time payment)
    const description = `${plan === 'solo' ? 'Solo' : 'Team'} Jaarlijks Abonnement`;

    // Check if running on localhost (webhooks won't work locally)
    const isLocalhost = siteUrl.includes('localhost') || siteUrl.includes('127.0.0.1');

    if (isLocalhost) {
      console.log(`[Yearly Payment] Running on localhost - webhooks will be skipped`);
    }

    console.log(`[Yearly Payment] Creating yearly payment for user ${user.id} with contract dates`);
    const payment = await mollieClient.payments.create({
      amount: {
        value: finalPrice.toFixed(2),
        currency: 'EUR',
      },
      description,
      redirectUrl: `${siteUrl}/checkout/success`,
      cancelUrl: `${siteUrl}/checkout/cancel`,
      // Only add webhook URL if not running on localhost
      ...(isLocalhost ? {} : { webhookUrl: `${siteUrl}/api/webhooks/mollie` }),
      metadata: {
        ...metadata,
        subscriptionType: 'yearly', // Markeer als yearly one-time payment
        // E3.S3: Contract dates toevoegen aan metadata
        contractStartDate: contractDates.contract_start_date.toISOString(),
        contractEndDate: contractDates.contract_end_date.toISOString(),
        optOutDeadline: contractDates.opt_out_deadline.toISOString(),
      },
    });

    console.log(`[Yearly Payment] Payment created: ${payment.id}`);

    // Sla payment referentie op in database
    const { error: dbError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        mollie_payment_id: payment.id,
        amount: finalPrice,
        currency: 'EUR',
        status: 'open',
        description,
      });

    if (dbError) {
      console.error('Error saving payment to database:', dbError);
      // Payment is al aangemaakt bij Mollie, maar niet opgeslagen in DB
      // Dit is niet ideaal, maar we kunnen de gebruiker nog steeds doorsturen
      // De webhook kan dit later oplossen
    }

    // Return payment URL voor redirect
    return NextResponse.json({
      success: true,
      paymentUrl: payment.getCheckoutUrl(),
      paymentId: payment.id,
    });
  } catch (error) {
    console.error('Error creating yearly payment:', error);

    // Mollie API errors
    if (error && typeof error === 'object' && 'message' in error) {
      return NextResponse.json(
        {
          success: false,
          error: `Betalingsfout: ${error.message}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Er ging iets mis bij het aanmaken van de betaling. Probeer het later opnieuw.',
      },
      { status: 500 }
    );
  }
}

