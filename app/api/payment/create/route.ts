import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { mollieClient } from '@/lib/mollie/client';
import { createClient } from '@/lib/supabase/server';
import { validateDiscountCode, getBasePrice } from '@/lib/payment';
import type { PlanType, BillingPeriod } from '@/lib/payment/types';

/**
 * Request body schema voor payment creation
 */
const createPaymentSchema = z.object({
  plan: z.enum(['solo', 'team'], {
    errorMap: () => ({ message: 'Plan moet solo of team zijn' }),
  }),
  billing: z.enum(['monthly', 'yearly'], {
    errorMap: () => ({ message: 'Billing moet monthly of yearly zijn' }),
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
    let originalPrice: number;
    let discountAmount = 0;
    let appliedDiscountCode: string | null = null;

    originalPrice = getBasePrice(plan as PlanType, billing as BillingPeriod);

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

    // 5. Maak Mollie payment aan
    const description = `${plan === 'solo' ? 'Solo' : 'Team'} ${billing === 'monthly' ? 'Maandelijks' : 'Jaarlijks'} Abonnement`;

    const payment = await mollieClient.payments.create({
      amount: {
        value: finalPrice.toFixed(2),
        currency: 'EUR',
      },
      description,
      redirectUrl: `${siteUrl}/checkout/success`,
      cancelUrl: `${siteUrl}/checkout/cancel`,
      webhookUrl: `${siteUrl}/api/webhooks/mollie`,
      metadata: {
        userId: user.id,
        plan,
        billing,
        discountCode: appliedDiscountCode || '',
        discountAmount: discountAmount.toString(),
        originalPrice: originalPrice.toString(),
        finalPrice: finalPrice.toString(),
      },
    });

    // 6. Sla payment referentie op in database
    const { error: dbError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        mollie_payment_id: payment.id,
        amount: finalPrice,
        currency: 'EUR',
        status: 'open', // Mollie payment status: open, canceled, pending, authorized, expired, failed, paid
        description,
      });

    if (dbError) {
      console.error('Error saving payment to database:', dbError);
      // Payment is al aangemaakt bij Mollie, maar niet opgeslagen in DB
      // Dit is niet ideaal, maar we kunnen de gebruiker nog steeds doorsturen
      // De webhook kan dit later oplossen
    }

    // 7. Return payment URL voor redirect
    return NextResponse.json({
      success: true,
      paymentUrl: payment.getCheckoutUrl(),
      paymentId: payment.id,
    });
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

