/**
 * Discount code increment functies
 * 
 * Gebruikt de atomic database functie om race conditions te voorkomen
 */

import { createClient } from '@/lib/supabase/server';

/**
 * Verhoog het current_uses veld van een kortingscode atomic
 * 
 * Deze functie gebruikt de database functie `increment_discount_code_uses`
 * die een row lock gebruikt om race conditions te voorkomen.
 * 
 * @param code - De kortingscode (case-insensitive)
 * @returns true als increment succesvol was, false als code niet gevonden of max_uses bereikt
 */
export async function incrementDiscountCodeUses(code: string): Promise<boolean> {
  if (!code || !code.trim()) {
    console.warn('[Discount] No code provided for increment');
    return false;
  }

  // Normaliseer code (uppercase, trim)
  const normalizedCode = code.trim().toUpperCase();

  const supabase = await createClient();

  // Roep de database functie aan via RPC
  const { data, error } = await supabase.rpc('increment_discount_code_uses', {
    code_text: normalizedCode,
  });

  if (error) {
    console.error(
      `[Discount] Error incrementing uses for code ${normalizedCode}:`,
      error
    );
    return false;
  }

  // De functie retourneert een boolean
  const success = data === true;

  if (success) {
    console.log(
      `[Discount] Successfully incremented uses for code ${normalizedCode}`
    );
  } else {
    console.warn(
      `[Discount] Failed to increment uses for code ${normalizedCode} - code not found or max_uses reached`
    );
  }

  return success;
}

