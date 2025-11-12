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

