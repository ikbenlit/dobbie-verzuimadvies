/**
 * Recurring Subscription Management
 * 
 * Deze module beheert het aanmaken van recurring subscriptions voor monthly billing.
 * Recurring subscriptions gebruiken Mollie Subscriptions API met SEPA Direct Debit.
 */

import { mollieClient } from '@/lib/mollie/client';
import { createClient } from '@/lib/supabase/server';
import { calculateContractDates } from './contract';
import { addMonths } from 'date-fns';
import { incrementDiscountCodeUses } from './discount-increment';
import { sendWelcomeEmail } from '@/lib/emails/send-welcome';
import type { PlanType } from './types';

/**
 * Parameters voor het aanmaken van een recurring subscription
 */
interface CreateRecurringSubscriptionParams {
  payment: {
    id: string;
    customerId: string | null;
    mandateId: string | null;
    amount: {
      value: string;
      currency: string;
    };
    metadata: {
      userId: string;
      plan: string;
      billing?: string;
      discountCode?: string;
      discountAmount?: string;
      originalPrice?: string;
      finalPrice?: string;
    };
  };
  siteUrl: string;
}

/**
 * E4.S2: Maak een recurring subscription aan na succesvolle eerste betaling
 * 
 * Deze functie:
 * 1. Checkt idempotency (voorkomt dubbele subscriptions)
 * 2. Maakt Mollie subscription aan (start volgende maand)
 * 3. Maakt database subscription record aan met contract fields
 * 4. Update profile status naar 'active'
 * 5. Increment discount code uses (als gebruikt)
 * 6. Verstuurt welcome email
 * 
 * @param params - Parameters voor subscription creation
 * @throws Error als subscription creation faalt
 * 
 * @example
 * ```typescript
 * await createRecurringSubscription({
 *   payment: {
 *     id: 'tr_xxxxx',
 *     customerId: 'cst_xxxxx',
 *     mandateId: 'mdt_xxxxx',
 *     amount: { value: '29.99', currency: 'EUR' },
 *     metadata: { userId: '...', plan: 'solo', billing: 'monthly' }
 *   },
 *   siteUrl: 'https://dobbie.app'
 * });
 * ```
 */
export async function createRecurringSubscription(
  params: CreateRecurringSubscriptionParams
): Promise<void> {
  const { payment, siteUrl } = params;
  const supabase = await createClient();

  const metadata = payment.metadata;
  const userId = metadata.userId;
  const plan = metadata.plan as PlanType;

  // Valideer vereiste metadata
  if (!userId || !plan) {
    throw new Error(
      `Missing required metadata: userId=${userId}, plan=${plan}`
    );
  }

  // Valideer customer ID en mandate ID
  if (!payment.customerId) {
    throw new Error(
      `Payment ${payment.id} does not have a customerId. Cannot create recurring subscription.`
    );
  }

  if (!payment.mandateId) {
    throw new Error(
      `Payment ${payment.id} does not have a mandateId. Cannot create recurring subscription.`
    );
  }

  console.log(
    `[Recurring Subscription] Creating subscription for user ${userId}, payment ${payment.id}`
  );

  try {
    // 1. Check idempotency - voorkomt dubbele subscriptions bij webhook retries
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('id, mollie_reference_id')
      .eq('user_id', userId)
      .eq('is_recurring', true)
      .single();

    if (existingSubscription) {
      console.log(
        `[Recurring Subscription] Subscription already exists for user ${userId}: ${existingSubscription.id}`
      );
      return; // Subscription bestaat al, skip creation
    }

    // 2. Parse bedragen
    const amount = parseFloat(payment.amount.value);
    const originalPrice = metadata.originalPrice
      ? parseFloat(metadata.originalPrice)
      : amount;
    const discountAmount = metadata.discountAmount
      ? parseFloat(metadata.discountAmount)
      : null;

    // 3. Maak Mollie subscription aan
    // Subscription start volgende maand (na eerste betaling)
    const subscriptionStartDate = addMonths(new Date(), 1);
    const planName = plan === 'solo' ? 'Solo' : 'Team';
    const description = `${planName} Maandabonnement`;

    console.log(
      `[Recurring Subscription] Creating Mollie subscription for customer ${payment.customerId}`
    );

    const mollieSubscription = await mollieClient.customerSubscriptions.create({
      customerId: payment.customerId,
      amount: {
        value: payment.amount.value,
        currency: payment.amount.currency,
      },
      interval: '1 month',
      description,
      webhookUrl: `${siteUrl}/api/webhooks/mollie`,
      startDate: subscriptionStartDate.toISOString(),
      metadata: {
        userId,
        plan,
        billing: 'monthly',
      },
    });

    console.log(
      `[Recurring Subscription] Mollie subscription created: ${mollieSubscription.id}`
    );

    // 4. Bereken contract dates
    const now = new Date();
    const contractDates = calculateContractDates(now);

    // 5. Maak database subscription record aan
    const subscriptionData = {
      user_id: userId,
      mollie_reference_id: mollieSubscription.id, // Mollie subscription ID
      mollie_customer_id: payment.customerId,
      mollie_mandate_id: payment.mandateId,
      is_recurring: true,

      // Contract fields
      contract_start_date: contractDates.contract_start_date.toISOString(),
      contract_end_date: contractDates.contract_end_date.toISOString(),
      opt_out_deadline: contractDates.opt_out_deadline.toISOString(),

      // Subscription fields
      status: 'active',
      start_date: now.toISOString(),
      next_billing_date: subscriptionStartDate.toISOString(),
      amount,
      currency: payment.amount.currency,
      discount_code: metadata.discountCode || null,
      discount_amount: discountAmount,
      original_price: originalPrice,
    };

    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert(subscriptionData)
      .select()
      .single();

    if (subscriptionError) {
      console.error(
        `[Recurring Subscription] Error creating database subscription:`,
        subscriptionError
      );
      throw new Error(
        `Failed to create database subscription: ${subscriptionError.message}`
      );
    }

    console.log(
      `[Recurring Subscription] Database subscription created: ${subscription.id}`
    );

    // 6. Update profile status naar 'active'
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (profileError) {
      console.error(
        `[Recurring Subscription] Error updating profile status:`,
        profileError
      );
      // Continue - subscription is al aangemaakt, maar log error voor monitoring
    } else {
      console.log(
        `[Recurring Subscription] Updated profile ${userId} subscription_status to 'active'`
      );
    }

    // 7. Increment discount code uses (als gebruikt)
    if (metadata.discountCode && metadata.discountCode.trim()) {
      try {
        const incrementSuccess = await incrementDiscountCodeUses(
          metadata.discountCode
        );

        if (incrementSuccess) {
          console.log(
            `[Recurring Subscription] Successfully incremented uses for discount code ${metadata.discountCode}`
          );
        } else {
          console.warn(
            `[Recurring Subscription] Failed to increment uses for discount code ${metadata.discountCode} - code may not exist or max_uses reached`
          );
        }
      } catch (incrementError) {
        console.error(
          `[Recurring Subscription] Error incrementing discount code uses:`,
          incrementError
        );
        // Continue - increment failure is niet kritiek
      }
    }

    // 8. Send welcome email
    try {
      // Haal user email en naam op uit database
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', userId)
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
        plan,
        billing: 'monthly',
        amount,
        currency: payment.amount.currency,
        discountCode: metadata.discountCode || null,
        discountAmount,
        originalPrice,
      });

      if (emailSent) {
        console.log(
          `[Recurring Subscription] Successfully sent welcome email to ${userEmail}`
        );
      } else {
        console.warn(
          `[Recurring Subscription] Failed to send welcome email to ${userEmail}`
        );
      }
    } catch (emailError) {
      console.error(
        `[Recurring Subscription] Error sending welcome email:`,
        emailError
      );
      // Continue - email failure is niet kritiek
    }

    console.log(
      `[Recurring Subscription] Successfully created recurring subscription for user ${userId}`
    );
  } catch (error) {
    console.error(
      `[Recurring Subscription] Error creating recurring subscription:`,
      error
    );
    throw error;
  }
}

