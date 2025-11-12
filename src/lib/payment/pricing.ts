/**
 * Prijsberekening functies voor abonnementen
 */

import type { PlanType, BillingPeriod, DiscountCode, PricingCalculation } from './types';

/**
 * Basis prijzen voor abonnementen (in euro's)
 */
export const BASE_PRICES: Record<PlanType, Record<BillingPeriod, number>> = {
  solo: {
    monthly: 49,
    yearly: 349,
  },
  team: {
    monthly: 39,
    yearly: 269,
  },
};

/**
 * Haal basisprijs op voor een plan en billing period
 */
export function getBasePrice(
  plan: PlanType,
  billing: BillingPeriod
): number {
  return BASE_PRICES[plan][billing];
}

/**
 * Bereken korting op basis van discount code
 */
export function calculateDiscountAmount(
  originalPrice: number,
  discountCode: DiscountCode
): number {
  if (discountCode.discount_percentage !== null) {
    // Percentage korting
    const discount = (originalPrice * discountCode.discount_percentage) / 100;
    return Math.round(discount * 100) / 100; // Rond af op 2 decimalen
  } else if (discountCode.discount_amount !== null) {
    // Vast bedrag korting
    return discountCode.discount_amount;
  }
  
  return 0;
}

/**
 * Bereken finale prijs met korting
 */
export function calculateFinalPrice(
  plan: PlanType,
  billing: BillingPeriod,
  discountCode?: DiscountCode
): PricingCalculation {
  const originalPrice = getBasePrice(plan, billing);
  
  if (!discountCode) {
    return {
      basePrice: originalPrice,
      discountAmount: 0,
      finalPrice: originalPrice,
      originalPrice,
    };
  }
  
  const discountAmount = calculateDiscountAmount(originalPrice, discountCode);
  const finalPrice = Math.max(0.01, originalPrice - discountAmount); // Minimaal €0.01
  
  return {
    basePrice: originalPrice,
    discountAmount,
    finalPrice: Math.round(finalPrice * 100) / 100, // Rond af op 2 decimalen
    discountCode: discountCode.code,
    originalPrice,
  };
}

