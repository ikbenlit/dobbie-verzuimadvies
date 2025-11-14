/**
 * Types voor discount code validatie en prijsberekening
 */

export type PlanType = 'solo' | 'team';
export type BillingPeriod = 'monthly' | 'yearly';

export interface DiscountCode {
  id: string;
  code: string;
  discount_percentage: number | null;
  discount_amount: number | null;
  valid_from: string;
  valid_until: string | null;
  max_uses: number | null;
  current_uses: number;
  is_active: boolean;
  created_at: string;
}

export interface DiscountValidation {
  valid: boolean;
  discount?: {
    code: string;
    type: 'percentage' | 'amount';
    value: number;
    discountAmount: number; // Hoeveel korting in euro's
    originalPrice: number;
    finalPrice: number;
  };
  error?: string;
}

export interface PricingCalculation {
  basePrice: number;
  discountAmount: number;
  finalPrice: number;
  discountCode?: string;
  originalPrice: number;
}

/**
 * Subscription status types
 */
export type SubscriptionStatus = 'pending' | 'active' | 'canceled' | 'suspended' | 'completed';

/**
 * Basis Subscription interface (backwards compatible)
 * Bevat alleen de core fields die altijd aanwezig zijn
 */
export interface Subscription {
  id: number;
  user_id: string;
  status: SubscriptionStatus;
  start_date: string;
  next_billing_date: string | null;
  amount: number;
  currency: string;
  mollie_reference_id: string;
  created_at: string;
  updated_at: string;
  discount_code?: string | null;
  discount_amount?: number | null;
  original_price?: number | null;
}

/**
 * Subscription met contract tracking fields
 * Uitgebreide interface voor subscriptions met contract periode en opt-out tracking
 * 
 * Volgens Epic 0 migratie:
 * - contract_start_date: Start van 12-maanden contractperiode
 * - contract_end_date: Einde van 12-maanden contractperiode (contract_start_date + 12 maanden)
 * - opt_out_deadline: Deadline voor 14-dagen bedenktijd (contract_start_date + 14 dagen)
 * - can_cancel: Boolean computed field (true als opt_out_deadline > NOW())
 * - is_recurring: true voor monthly subscriptions (SEPA), false voor yearly (one-time)
 * - mollie_customer_id: Mollie Customer ID voor recurring subscriptions
 * - mollie_mandate_id: Mollie Mandate ID voor SEPA Direct Debit authorization
 * - mollie_reference_id: Mollie reference (subscription ID voor recurring, payment ID voor one-time)
 */
export interface SubscriptionWithContract extends Subscription {
  // Contract tracking fields
  contract_start_date: string | null;
  contract_end_date: string | null;
  opt_out_deadline: string | null;
  can_cancel: boolean | null;
  
  // Recurring subscription fields
  is_recurring: boolean | null;
  mollie_customer_id: string | null;
  mollie_mandate_id: string | null;
}

