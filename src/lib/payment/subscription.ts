/**
 * Subscription management functies
 */

import { createClient } from '@/lib/supabase/server';
import { calculateContractDates } from './contract';
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
 * E4.S3: Maak een one-time subscription aan in de database na succesvolle betaling
 * 
 * Deze functie wordt gebruikt voor yearly subscriptions (one-time payments).
 * Contract dates worden toegevoegd voor 12-maanden contractperiode met 14-dagen opt-out.
 * 
 * @param params - Parameters voor subscription creation
 * @returns Created subscription record
 */
export async function createOneTimeSubscription(params: CreateSubscriptionParams) {
  const supabase = await createClient();

  const startDate = new Date();
  const endDate = calculateEndDate(params.billing);
  const nextBillingDate = calculateNextBillingDate(params.billing);

  // E4.S3: Bereken contract dates voor yearly subscriptions
  const contractDates = calculateContractDates(startDate);

  // Voor subscriptions tabel gebruiken we mollie_payment_id als mollie_reference_id
  // omdat we een eenmalige payment hebben, geen recurring subscription
  const subscriptionData = {
    user_id: params.userId,
    mollie_reference_id: params.molliePaymentId, // Gebruik payment ID als reference ID
    mollie_customer_id: null, // One-time subscriptions hebben geen customer
    mollie_mandate_id: null, // One-time subscriptions hebben geen mandate
    is_recurring: false, // Yearly subscriptions zijn niet recurring

    // E4.S3: Contract fields voor yearly subscriptions
    contract_start_date: contractDates.contract_start_date.toISOString(),
    contract_end_date: contractDates.contract_end_date.toISOString(),
    opt_out_deadline: contractDates.opt_out_deadline.toISOString(),

    // Subscription fields
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
    console.error('[One-Time Subscription] Error creating subscription:', error);
    throw new Error(`Failed to create one-time subscription: ${error.message}`);
  }

  console.log(
    `[One-Time Subscription] Created subscription ${subscription.id} for user ${params.userId}`
  );

  return subscription;
}

/**
 * Legacy functie - gebruik createOneTimeSubscription() in plaats daarvan
 * 
 * @deprecated Gebruik createOneTimeSubscription() voor nieuwe code
 */
export async function createSubscription(params: CreateSubscriptionParams) {
  console.warn(
    '[Subscription] createSubscription() is deprecated, use createOneTimeSubscription() instead'
  );
  return createOneTimeSubscription(params);
}

/**
 * Check of er al een subscription bestaat voor deze payment
 * Voorkomt dubbele subscriptions bij webhook retries
 */
export async function subscriptionExistsForPayment(molliePaymentId: string): Promise<boolean> {
  const supabase = await createClient();

  // Check op mollie_reference_id (naam na migratie E0.S2)
  // Dit werkt voor zowel recurring (subscription ID) als one-time (payment ID) subscriptions
  const { data, error } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('mollie_reference_id', molliePaymentId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = not found, dat is ok
    console.error('[Subscription] Error checking subscription existence:', error);
  }

  return !!data;
}

