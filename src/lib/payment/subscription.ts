/**
 * Subscription management functies
 */

import { createClient } from '@/lib/supabase/server';
import type { PlanType, BillingPeriod } from './types';

interface CreateSubscriptionParams {
  userId: string;
  plan: PlanType;
  billing: BillingPeriod;
  amount: number;
  currency: string;
  molliePaymentId: string;
  discountCode?: string | null;
  discountAmount?: number | null;
  originalPrice?: number | null;
}

/**
 * Bereken end date op basis van billing period
 */
function calculateEndDate(billing: BillingPeriod): Date {
  const now = new Date();
  if (billing === 'monthly') {
    // 30 dagen voor monthly
    return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  } else {
    // 365 dagen voor yearly
    return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
  }
}

/**
 * Bereken next billing date op basis van billing period
 */
function calculateNextBillingDate(billing: BillingPeriod): Date {
  const now = new Date();
  if (billing === 'monthly') {
    // Volgende maand
    return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  } else {
    // Volgend jaar
    return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  }
}

/**
 * Maak een subscription aan in de database na succesvolle betaling
 */
export async function createSubscription(params: CreateSubscriptionParams) {
  const supabase = await createClient();

  const startDate = new Date();
  const endDate = calculateEndDate(params.billing);
  const nextBillingDate = calculateNextBillingDate(params.billing);

  // Voor subscriptions tabel gebruiken we mollie_payment_id als mollie_subscription_id
  // omdat we een eenmalige payment hebben, geen recurring subscription
  const subscriptionData = {
    user_id: params.userId,
    mollie_subscription_id: params.molliePaymentId, // Gebruik payment ID als subscription ID
    status: 'active',
    start_date: startDate.toISOString(),
    next_billing_date: nextBillingDate.toISOString(),
    amount: params.amount,
    currency: params.currency,
    discount_code: params.discountCode || null,
    discount_amount: params.discountAmount || null,
    original_price: params.originalPrice || null,
  };

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .insert(subscriptionData)
    .select()
    .single();

  if (error) {
    console.error('[Subscription] Error creating subscription:', error);
    throw new Error(`Failed to create subscription: ${error.message}`);
  }

  console.log(`[Subscription] Created subscription ${subscription.id} for user ${params.userId}`);
  
  return subscription;
}

/**
 * Check of er al een subscription bestaat voor deze payment
 * Voorkomt dubbele subscriptions bij webhook retries
 */
export async function subscriptionExistsForPayment(molliePaymentId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('mollie_subscription_id', molliePaymentId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = not found, dat is ok
    console.error('[Subscription] Error checking subscription existence:', error);
  }

  return !!data;
}

