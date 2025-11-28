/**
 * Discount code validatie logica
 */

import { createClient } from '@/lib/supabase/server';
import type {
  PlanType,
  BillingPeriod,
  DiscountCode,
  DiscountValidation,
} from './types';
import { calculateDiscountAmount, getBasePrice } from './pricing';

/**
 * Valideer een discount code volgens alle regels
 * 
 * Validatie volgorde:
 * 1. Code bestaat? (case-insensitive)
 * 2. Code is actief? (is_active = true)
 * 3. Code niet verlopen? (valid_from <= now <= valid_until)
 * 4. Code niet over limiet? (current_uses < max_uses of max_uses IS NULL)
 */
export async function validateDiscountCode(
  code: string,
  plan: PlanType,
  billing: BillingPeriod
): Promise<DiscountValidation> {
  // Normaliseer code (uppercase, trim whitespace)
  const normalizedCode = code.trim().toUpperCase();
  
  if (!normalizedCode) {
    return {
      valid: false,
      error: 'Kortingscode mag niet leeg zijn',
    };
  }
  
  // Haal Supabase client op
  const supabase = await createClient();
  
  // Zoek code in database (case-insensitive via UPPER index)
  const { data: discountCode, error } = await supabase
    .from('discount_codes')
    .select('*')
    .eq('code', normalizedCode)
    .single();
  
  // Check 1: Code bestaat?
  if (error || !discountCode) {
    return {
      valid: false,
      error: 'Kortingscode niet gevonden',
    };
  }
  
  const codeData = discountCode as DiscountCode;
  
  // Check 2: Code is actief?
  if (!codeData.is_active) {
    return {
      valid: false,
      error: 'Deze kortingscode is niet meer actief',
    };
  }
  
  // Check 3: Code niet verlopen?
  const now = new Date();
  const validFrom = new Date(codeData.valid_from);
  
  if (now < validFrom) {
    return {
      valid: false,
      error: 'Deze kortingscode is nog niet geldig',
    };
  }
  
  if (codeData.valid_until) {
    const validUntil = new Date(codeData.valid_until);
    if (now > validUntil) {
      return {
        valid: false,
        error: 'Deze kortingscode is verlopen',
      };
    }
  }
  
  // Check 4: Code niet over limiet?
  if (codeData.max_uses !== null) {
    if (codeData.current_uses >= codeData.max_uses) {
      return {
        valid: false,
        error: 'Deze kortingscode is al maximaal gebruikt',
      };
    }
  }
  
  // Alle checks geslaagd - bereken korting
  const originalPrice = getBasePrice(plan, billing);
  const discountAmount = calculateDiscountAmount(originalPrice, codeData);
  // Allow €0 for 100% discount codes (free activation)
  const finalPrice = Math.max(0, originalPrice - discountAmount);
  
  // Bepaal discount type
  const discountType = codeData.discount_percentage !== null ? 'percentage' : 'amount';
  const discountValue = codeData.discount_percentage ?? codeData.discount_amount ?? 0;
  
  return {
    valid: true,
    discount: {
      code: normalizedCode,
      type: discountType,
      value: discountValue,
      discountAmount: Math.round(discountAmount * 100) / 100,
      originalPrice,
      finalPrice: Math.round(finalPrice * 100) / 100,
    },
  };
}

