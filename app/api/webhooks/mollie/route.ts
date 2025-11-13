import { NextRequest, NextResponse } from 'next/server';
import { mollieClient } from '@/lib/mollie/client';
import { createClient } from '@/lib/supabase/server';
import {
  createSubscription,
  subscriptionExistsForPayment,
} from '@/lib/payment/subscription';
import { incrementDiscountCodeUses } from '@/lib/payment/discount-increment';
import { sendWelcomeEmail } from '@/lib/emails/send-welcome';

/**
 * POST /api/webhooks/mollie
 * 
 * Mollie webhook handler voor payment events
 * 
 * Mollie stuurt een POST request met:
 * {
 *   id: "tr_xxx" // Payment ID
 * }
 * 
 * We moeten de payment ophalen bij Mollie om de actuele status te krijgen
 * (security best practice: vertrouw nooit op de status in de webhook body)
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const paymentId = body.id;

    if (!paymentId) {
      console.error('[Webhook] No payment ID in request body:', body);
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    console.log(`[Webhook] Received webhook for payment: ${paymentId}`);

    // Haal payment op bij Mollie (altijd de source of truth)
    // Dit voorkomt dat kwaadwillenden de status kunnen manipuleren
    const payment = await mollieClient.payments.get(paymentId);

    console.log(`[Webhook] Payment ${paymentId} status: ${payment.status}`);

    // Haal Supabase client op
    const supabase = await createClient();

    // Update payment status in database
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: payment.status,
        updated_at: new Date().toISOString(),
      })
      .eq('mollie_payment_id', paymentId);

    if (updateError) {
      console.error('[Webhook] Error updating payment status:', updateError);
      // Continue anyway - webhook moet altijd 200 retourneren
      // Anders blijft Mollie proberen
    } else {
      console.log(`[Webhook] Updated payment ${paymentId} status to: ${payment.status}`);
    }

    // Verwerk verschillende payment statussen
    switch (payment.status) {
      case 'paid':
        console.log(`[Webhook] Payment ${paymentId} is paid - processing subscription activation`);
        
        try {
          // Check of subscription al bestaat (voorkomt dubbele subscriptions bij webhook retries)
          const subscriptionExists = await subscriptionExistsForPayment(paymentId);
          
          if (subscriptionExists) {
            console.log(`[Webhook] Subscription already exists for payment ${paymentId}, skipping creation`);
            break;
          }

          // Haal metadata uit payment
          const metadata = payment.metadata as {
            userId?: string;
            plan?: string;
            billing?: string;
            discountCode?: string;
            discountAmount?: string;
            originalPrice?: string;
            finalPrice?: string;
          };

          if (!metadata.userId || !metadata.plan || !metadata.billing) {
            throw new Error(
              `Missing required metadata: userId=${metadata.userId}, plan=${metadata.plan}, billing=${metadata.billing}`
            );
          }

          // Parse bedragen
          const amount = parseFloat(payment.amount.value);
          const originalPrice = metadata.originalPrice
            ? parseFloat(metadata.originalPrice)
            : amount;
          const discountAmount = metadata.discountAmount
            ? parseFloat(metadata.discountAmount)
            : null;

          // Maak subscription aan (E6.S2)
          await createSubscription({
            userId: metadata.userId,
            plan: metadata.plan as 'solo' | 'team',
            billing: metadata.billing as 'monthly' | 'yearly',
            amount,
            currency: payment.amount.currency,
            molliePaymentId: paymentId,
            discountCode: metadata.discountCode || null,
            discountAmount,
            originalPrice,
          });

          console.log(`[Webhook] Successfully created subscription for payment ${paymentId}`);
          
          // E4.S1 - Update subscription_status naar 'active'
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ 
              subscription_status: 'active',
              updated_at: new Date().toISOString()
            })
            .eq('id', metadata.userId);

          if (profileError) {
            console.error('[Webhook] Error updating profile status:', profileError);
            // Continue - subscription is al aangemaakt, maar log error voor monitoring
          } else {
            console.log(`[Webhook] Updated profile ${metadata.userId} subscription_status to 'active'`);
          }
          
          // E6.S3 - Increment discount code uses (als er een code is gebruikt)
          if (metadata.discountCode && metadata.discountCode.trim()) {
            try {
              const incrementSuccess = await incrementDiscountCodeUses(
                metadata.discountCode
              );
              
              if (incrementSuccess) {
                console.log(
                  `[Webhook] Successfully incremented uses for discount code ${metadata.discountCode}`
                );
              } else {
                console.warn(
                  `[Webhook] Failed to increment uses for discount code ${metadata.discountCode} - code may not exist or max_uses reached`
                );
                // Dit is niet kritiek - subscription is al aangemaakt
                // We loggen alleen een warning
              }
            } catch (incrementError) {
              console.error(
                `[Webhook] Error incrementing discount code uses:`,
                incrementError
              );
              // Continue - subscription is al aangemaakt, increment failure is niet kritiek
            }
          } else {
            console.log(
              `[Webhook] No discount code used for payment ${paymentId}, skipping increment`
            );
          }
          
          // E6.S4 - Send welcome email
          try {
            // Haal user email en naam op uit database
            const { data: userProfile, error: profileError } = await supabase
              .from('profiles')
              .select('email, full_name')
              .eq('id', metadata.userId)
              .single();

            if (profileError || !userProfile) {
              throw new Error(
                `Failed to fetch user profile: ${profileError?.message || 'Profile not found'}`
              );
            }

            const userEmail = userProfile.email;
            const userName = userProfile.full_name || 'Gebruiker';

            if (!userEmail) {
              throw new Error('User email not found');
            }

            // Verstuur welkomstmail
            const emailSent = await sendWelcomeEmail({
              userEmail,
              userName,
              plan: metadata.plan as 'solo' | 'team',
              billing: metadata.billing as 'monthly' | 'yearly',
              amount,
              currency: payment.amount.currency,
              discountCode: metadata.discountCode || null,
              discountAmount,
              originalPrice,
            });

            if (emailSent) {
              console.log(
                `[Webhook] Successfully sent welcome email to ${userEmail} for payment ${paymentId}`
              );
            } else {
              console.warn(
                `[Webhook] Failed to send welcome email to ${userEmail} for payment ${paymentId}`
              );
              // Niet kritiek - subscription is al aangemaakt
            }
          } catch (emailError) {
            console.error(
              `[Webhook] Error sending welcome email for payment ${paymentId}:`,
              emailError
            );
            // Continue - email failure is niet kritiek, subscription is al aangemaakt
          }
        } catch (subscriptionError) {
          console.error(
            `[Webhook] Error creating subscription for payment ${paymentId}:`,
            subscriptionError
          );
          // Continue - webhook moet altijd 200 retourneren
          // Subscription creation kan later worden herhaald indien nodig
        }
        break;

      case 'failed':
        console.log(`[Webhook] Payment ${paymentId} failed`);
        // Optioneel: notify user of failed payment
        // Voor nu alleen loggen
        break;

      case 'canceled':
        console.log(`[Webhook] Payment ${paymentId} was canceled`);
        // Payment is al geannuleerd, geen actie nodig
        break;

      case 'expired':
        console.log(`[Webhook] Payment ${paymentId} expired`);
        // Payment is verlopen, geen actie nodig
        break;

      case 'pending':
        console.log(`[Webhook] Payment ${paymentId} is still pending`);
        // Payment is nog in behandeling, wachten op volgende webhook
        break;

      case 'authorized':
        console.log(`[Webhook] Payment ${paymentId} is authorized`);
        // Voor credit cards kan dit voorkomen, maar voor nu wachten we op 'paid'
        break;

      default:
        console.log(`[Webhook] Payment ${paymentId} has unknown status: ${payment.status}`);
    }

    // Altijd 200 OK retourneren aan Mollie
    // Als we een error retourneren, blijft Mollie proberen
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error);

    // Log de error maar retourneer altijd 200 OK
    // Anders blijft Mollie proberen en krijgen we spam
    // We kunnen later een retry mechanisme toevoegen als nodig
    return NextResponse.json(
      {
        received: true,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 }
    );
  }
}

