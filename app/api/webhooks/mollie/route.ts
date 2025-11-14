import { NextRequest, NextResponse } from 'next/server';
import { mollieClient } from '@/lib/mollie/client';
import { createClient } from '@/lib/supabase/server';
import {
  createOneTimeSubscription,
  subscriptionExistsForPayment,
} from '@/lib/payment/subscription';
import { createRecurringSubscription } from '@/lib/payment/recurring-subscription';
import { incrementDiscountCodeUses } from '@/lib/payment/discount-increment';
import { sendWelcomeEmail } from '@/lib/emails/send-welcome';

/**
 * POST /api/webhooks/mollie
 * 
 * Mollie webhook handler voor payment en subscription events
 * 
 * Mollie stuurt een POST request met:
 * {
 *   id: "tr_xxx" // Payment ID (tr_ prefix)
 *   // of
 *   id: "sub_xxx" // Subscription ID (sub_ prefix)
 * }
 * 
 * E4.S1: Event routing op basis van ID prefix
 * - tr_xxxxx  = Payment (transaction)
 * - sub_xxxxx = Subscription
 * - cst_xxxxx = Customer (niet gebruikt, alleen loggen)
 * - mdt_xxxxx = Mandate (niet gebruikt, alleen loggen)
 * 
 * We moeten altijd de resource ophalen bij Mollie om de actuele status te krijgen
 * (security best practice: vertrouw nooit op de status in de webhook body)
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const resourceId = body.id;

    if (!resourceId || typeof resourceId !== 'string') {
      console.error('[Webhook] No resource ID in request body:', body);
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      );
    }

    console.log(`[Webhook] Received webhook for resource: ${resourceId}`);

    // E4.S1: Route based on ID prefix
    if (resourceId.startsWith('tr_')) {
      // Payment event (transaction)
      return await handlePaymentWebhook(resourceId);
    } else if (resourceId.startsWith('sub_')) {
      // Subscription event
      return await handleSubscriptionWebhook(resourceId);
    } else if (resourceId.startsWith('cst_')) {
      // Customer event (not used, but log for monitoring)
      console.log(`[Webhook] Received customer event (not handled): ${resourceId}`);
      return NextResponse.json({ received: true });
    } else if (resourceId.startsWith('mdt_')) {
      // Mandate event (not used, but log for monitoring)
      console.log(`[Webhook] Received mandate event (not handled): ${resourceId}`);
      return NextResponse.json({ received: true });
    } else {
      // Unknown event type
      console.warn(`[Webhook] Unknown event type for resource: ${resourceId}`);
      return NextResponse.json({ received: true });
    }
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

/**
 * Handle payment webhook events (tr_ prefix)
 * 
 * Verwerkt payment status updates en activeert subscriptions bij 'paid' status
 */
async function handlePaymentWebhook(paymentId: string): Promise<NextResponse> {
  try {
    console.log(`[Webhook] Processing payment webhook: ${paymentId}`);

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
          // Haal metadata uit payment
          const metadata = payment.metadata as {
            userId?: string;
            plan?: string;
            billing?: string;
            subscriptionType?: string;
            discountCode?: string;
            discountAmount?: string;
            originalPrice?: string;
            finalPrice?: string;
          };

          if (!metadata.userId || !metadata.plan) {
            throw new Error(
              `Missing required metadata: userId=${metadata.userId}, plan=${metadata.plan}`
            );
          }

          // E4.S2: Route naar recurring of one-time subscription creation
          const isMonthly =
            metadata.subscriptionType === 'monthly' ||
            metadata.billing === 'monthly';

          if (isMonthly) {
            // E4.S2: Recurring subscription (monthly)
            console.log(
              `[Webhook] Payment ${paymentId} is for monthly subscription - creating recurring subscription`
            );

            // Check of subscription al bestaat (idempotency check gebeurt in createRecurringSubscription)
            const subscriptionExists = await subscriptionExistsForPayment(paymentId);
            if (subscriptionExists) {
              console.log(
                `[Webhook] Subscription already exists for payment ${paymentId}, skipping creation`
              );
              break;
            }

            // Haal siteUrl op voor webhook URL
            const siteUrl =
              process.env.NEXT_PUBLIC_SITE_URL ||
              (process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : 'http://localhost:3000');

            // Haal customerId en mandateId op uit payment
            // Voor customerPayments heeft payment een customerId property
            // Voor mandateId moeten we de mandates ophalen via customer API
            const customerId =
              (payment as any).customerId || (payment as any).customer?.id || null;

            let mandateId: string | null = null;
            if (customerId) {
              try {
                // Haal actieve mandates op voor deze customer
                const mandates = await mollieClient.customerMandates.list({
                  customerId,
                });
                // Neem de eerste actieve mandate
                const activeMandate = mandates.find(
                  (m) => m.status === 'valid' || m.status === 'pending'
                );
                if (activeMandate) {
                  mandateId = activeMandate.id;
                }
              } catch (mandateError) {
                console.error(
                  `[Webhook] Error fetching mandates for customer ${customerId}:`,
                  mandateError
                );
                // Continue - mandateId kan later worden opgehaald indien nodig
              }
            }

            // Maak recurring subscription aan
            await createRecurringSubscription({
              payment: {
                id: paymentId,
                customerId,
                mandateId,
                amount: payment.amount,
                metadata: {
                  userId: metadata.userId,
                  plan: metadata.plan,
                  billing: metadata.billing || 'monthly',
                  discountCode: metadata.discountCode,
                  discountAmount: metadata.discountAmount,
                  originalPrice: metadata.originalPrice,
                  finalPrice: metadata.finalPrice,
                },
              },
              siteUrl,
            });

            console.log(
              `[Webhook] Successfully created recurring subscription for payment ${paymentId}`
            );
          } else {
            // E4.S3: One-time subscription (yearly) - gebruik bestaande flow
            console.log(
              `[Webhook] Payment ${paymentId} is for yearly subscription - creating one-time subscription`
            );

            // Check of subscription al bestaat (voorkomt dubbele subscriptions bij webhook retries)
            const subscriptionExists = await subscriptionExistsForPayment(paymentId);

            if (subscriptionExists) {
              console.log(
                `[Webhook] Subscription already exists for payment ${paymentId}, skipping creation`
              );
              break;
            }

            if (!metadata.billing) {
              throw new Error(
                `Missing billing metadata for one-time subscription: userId=${metadata.userId}`
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

            // E4.S3: Maak one-time subscription aan met contract dates
            await createOneTimeSubscription({
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

            console.log(
              `[Webhook] Successfully created one-time subscription for payment ${paymentId}`
            );

            // Update subscription_status naar 'active'
            const { error: profileError } = await supabase
              .from('profiles')
              .update({
                subscription_status: 'active',
                updated_at: new Date().toISOString(),
              })
              .eq('id', metadata.userId);

            if (profileError) {
              console.error('[Webhook] Error updating profile status:', profileError);
            } else {
              console.log(
                `[Webhook] Updated profile ${metadata.userId} subscription_status to 'active'`
              );
            }

            // Increment discount code uses (als er een code is gebruikt)
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
                }
              } catch (incrementError) {
                console.error(
                  `[Webhook] Error incrementing discount code uses:`,
                  incrementError
                );
              }
            }

            // Send welcome email
            try {
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
              }
            } catch (emailError) {
              console.error(
                `[Webhook] Error sending welcome email for payment ${paymentId}:`,
                emailError
              );
            }
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
    console.error(`[Webhook] Error handling payment webhook ${paymentId}:`, error);
    // Return 200 OK anyway to prevent Mollie retries
    return NextResponse.json(
      {
        received: true,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 }
    );
  }
}

/**
 * Handle subscription webhook events (sub_ prefix)
 * 
 * E4.S4: Verwerkt subscription status updates van Mollie
 * 
 * Status updates:
 * - 'active': Maandelijkse betaling geslaagd - subscription blijft actief
 * - 'canceled': User heeft geannuleerd (alleen na contractperiode)
 * - 'suspended': Betaling mislukt - grace period
 */
async function handleSubscriptionWebhook(subscriptionId: string): Promise<NextResponse> {
  try {
    console.log(`[Webhook] Processing subscription webhook: ${subscriptionId}`);

    const supabase = await createClient();

    // 1. Haal subscription op uit database om customer ID te krijgen
    const { data: dbSubscription, error: dbError } = await supabase
      .from('subscriptions')
      .select('id, user_id, mollie_customer_id, status')
      .eq('mollie_reference_id', subscriptionId)
      .single();

    if (dbError || !dbSubscription) {
      console.error(
        `[Webhook] Subscription ${subscriptionId} not found in database:`,
        dbError?.message || 'Not found'
      );
      // Return 200 OK anyway - voorkomt Mollie retries
      return NextResponse.json({ received: true });
    }

    if (!dbSubscription.mollie_customer_id) {
      console.error(
        `[Webhook] Subscription ${subscriptionId} has no customer ID in database`
      );
      return NextResponse.json({ received: true });
    }

    // 2. Haal subscription op bij Mollie (altijd de source of truth)
    const mollieSubscription = await mollieClient.customerSubscriptions.get(
      dbSubscription.mollie_customer_id,
      subscriptionId
    );

    console.log(
      `[Webhook] Subscription ${subscriptionId} status: ${mollieSubscription.status}`
    );

    // 3. Update database subscription status
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: mollieSubscription.status,
        updated_at: new Date().toISOString(),
      })
      .eq('mollie_reference_id', subscriptionId);

    if (updateError) {
      console.error(
        `[Webhook] Error updating subscription status:`,
        updateError
      );
      // Continue anyway - webhook moet altijd 200 retourneren
    } else {
      console.log(
        `[Webhook] Updated subscription ${subscriptionId} status to: ${mollieSubscription.status}`
      );
    }

    // 4. Verwerk verschillende subscription statussen
    switch (mollieSubscription.status) {
      case 'active':
        // Maandelijkse betaling geslaagd - subscription blijft actief
        await handleActiveSubscription(mollieSubscription, dbSubscription.user_id);
        break;

      case 'canceled':
        // User heeft geannuleerd (alleen na contractperiode)
        await handleCanceledSubscription(
          mollieSubscription,
          dbSubscription.user_id
        );
        break;

      case 'suspended':
        // Betaling mislukt - grace period
        await handleSuspendedSubscription(
          mollieSubscription,
          dbSubscription.user_id
        );
        break;

      default:
        console.log(
          `[Webhook] Subscription ${subscriptionId} has unknown status: ${mollieSubscription.status}`
        );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(
      `[Webhook] Error handling subscription webhook ${subscriptionId}:`,
      error
    );
    // Return 200 OK anyway to prevent Mollie retries
    return NextResponse.json(
      {
        received: true,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 }
    );
  }
}

/**
 * Handle active subscription status
 * 
 * Maandelijkse betaling geslaagd - subscription blijft actief
 * Update next_billing_date voor volgende maand
 */
async function handleActiveSubscription(
  subscription: Awaited<
    ReturnType<typeof mollieClient.customerSubscriptions.get>
  >,
  userId: string
): Promise<void> {
  console.log(
    `[Webhook] Subscription ${subscription.id} is active - monthly payment succeeded`
  );

  const supabase = await createClient();

  // Update next_billing_date naar volgende maand
  const nextBillingDate = subscription.nextPaymentDate
    ? new Date(subscription.nextPaymentDate)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Fallback: 30 dagen

  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({
      next_billing_date: nextBillingDate.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('mollie_reference_id', subscription.id);

  if (updateError) {
    console.error(
      `[Webhook] Error updating next_billing_date for subscription ${subscription.id}:`,
      updateError
    );
  } else {
    console.log(
      `[Webhook] Updated next_billing_date for subscription ${subscription.id} to ${nextBillingDate.toISOString()}`
    );
  }

  // Profile status blijft 'active' (geen update nodig)
}

/**
 * Handle canceled subscription status
 * 
 * User heeft geannuleerd (alleen na contractperiode)
 * Update profile status naar 'inactive'
 */
async function handleCanceledSubscription(
  subscription: Awaited<
    ReturnType<typeof mollieClient.customerSubscriptions.get>
  >,
  userId: string
): Promise<void> {
  console.log(
    `[Webhook] Subscription ${subscription.id} is canceled - user canceled subscription`
  );

  const supabase = await createClient();

  // Update profile status naar 'inactive'
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'inactive',
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (profileError) {
    console.error(
      `[Webhook] Error updating profile status for canceled subscription:`,
      profileError
    );
  } else {
    console.log(
      `[Webhook] Updated profile ${userId} subscription_status to 'inactive' (subscription canceled)`
    );
  }

  // Optioneel: Email notification naar user over cancellation
  // TODO: Implement email notification if needed
}

/**
 * Handle suspended subscription status
 * 
 * Betaling mislukt - grace period
 * Profile status blijft 'active' maar subscription is suspended
 * Optioneel: Email notification naar user over failed payment
 */
async function handleSuspendedSubscription(
  subscription: Awaited<
    ReturnType<typeof mollieClient.customerSubscriptions.get>
  >,
  userId: string
): Promise<void> {
  console.log(
    `[Webhook] Subscription ${subscription.id} is suspended - payment failed`
  );

  // Profile status blijft 'active' tijdens grace period
  // Subscription status is al geüpdatet naar 'suspended' in database

  // Optioneel: Email notification naar user over failed payment
  // TODO: Implement email notification if needed
  console.log(
    `[Webhook] Subscription ${subscription.id} suspended - user ${userId} should be notified`
  );
}

