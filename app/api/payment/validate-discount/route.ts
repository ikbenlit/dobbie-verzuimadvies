import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateDiscountCode } from '@/lib/payment';
import type { PlanType, BillingPeriod } from '@/lib/payment/types';

/**
 * Request body schema voor discount code validatie
 */
const validateDiscountSchema = z.object({
  code: z.string().min(1, 'Kortingscode is verplicht').max(50),
  plan: z.enum(['solo', 'team'], {
    errorMap: () => ({ message: 'Plan moet solo of team zijn' }),
  }),
  billing: z.enum(['monthly', 'yearly'], {
    errorMap: () => ({ message: 'Billing moet monthly of yearly zijn' }),
  }),
});

/**
 * POST /api/payment/validate-discount
 * 
 * Valideert een kortingscode en retourneert korting informatie
 * 
 * Request body:
 * {
 *   code: string,
 *   plan: 'solo' | 'team',
 *   billing: 'monthly' | 'yearly'
 * }
 * 
 * Response:
 * {
 *   valid: boolean,
 *   discount?: {
 *     code: string,
 *     type: 'percentage' | 'amount',
 *     value: number,
 *     discountAmount: number,
 *     originalPrice: number,
 *     finalPrice: number
 *   },
 *   error?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse en valideer request body
    const body = await request.json();
    const validation = validateDiscountSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          valid: false,
          error: validation.error.issues[0]?.message || 'Ongeldige request data',
        },
        { status: 400 }
      );
    }

    const { code, plan, billing } = validation.data;

    // Valideer discount code
    const result = await validateDiscountCode(
      code,
      plan as PlanType,
      billing as BillingPeriod
    );

    // Return validatie resultaat
    if (result.valid && result.discount) {
      return NextResponse.json({
        valid: true,
        discount: result.discount,
      });
    } else {
      return NextResponse.json({
        valid: false,
        error: result.error || 'Kortingscode is ongeldig',
      });
    }
  } catch (error) {
    console.error('Error validating discount code:', error);
    
    return NextResponse.json(
      {
        valid: false,
        error:
          error instanceof Error
            ? error.message
            : 'Er ging iets mis bij het valideren van de kortingscode',
      },
      { status: 500 }
    );
  }
}

