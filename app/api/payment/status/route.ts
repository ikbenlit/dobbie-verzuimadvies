import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { mollieClient } from '@/lib/mollie/client';

/**
 * GET /api/payment/status?paymentId=xxx
 * 
 * Haalt payment status op uit database en/of Mollie
 * 
 * Query parameters:
 * - paymentId: Mollie payment ID
 * 
 * Response:
 * {
 *   success: boolean,
 *   payment?: {
 *     id: string,
 *     status: string,
 *     amount: number,
 *     description: string,
 *     metadata?: {
 *       userId: string,
 *       plan: string,
 *       billing: string,
 *       discountCode?: string,
 *       discountAmount?: string,
 *       originalPrice?: string,
 *       finalPrice?: string
 *     }
 *   },
 *   error?: string
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Check user authentication
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Niet geautoriseerd' },
        { status: 401 }
      );
    }

    // Haal payment ID uit query parameters
    const searchParams = request.nextUrl.searchParams;
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: 'Payment ID is verplicht' },
        { status: 400 }
      );
    }

    // Haal payment op uit database
    const { data: dbPayment, error: dbError } = await supabase
      .from('payments')
      .select('*')
      .eq('mollie_payment_id', paymentId)
      .eq('user_id', user.id)
      .single();

    if (dbError && dbError.code !== 'PGRST116') {
      // PGRST116 = not found, dat is ok
      console.error('Error fetching payment from database:', dbError);
    }

    // Haal payment ook op bij Mollie voor meest actuele status
    try {
      const molliePayment = await mollieClient.payments.get(paymentId);

      // Combineer database en Mollie data
      const paymentData = {
        id: molliePayment.id,
        status: molliePayment.status,
        amount: parseFloat(molliePayment.amount.value),
        currency: molliePayment.amount.currency,
        description: molliePayment.description || '',
        metadata: molliePayment.metadata || {},
        createdAt: molliePayment.createdAt,
        paidAt: molliePayment.paidAt || null,
      };

      return NextResponse.json({
        success: true,
        payment: paymentData,
      });
    } catch (mollieError) {
      console.error('Error fetching payment from Mollie:', mollieError);
      
      // Als Mollie call faalt maar we hebben database data, gebruik die
      if (dbPayment) {
        return NextResponse.json({
          success: true,
          payment: {
            id: dbPayment.mollie_payment_id,
            status: dbPayment.status,
            amount: parseFloat(dbPayment.amount.toString()),
            currency: dbPayment.currency,
            description: dbPayment.description || '',
            metadata: {},
          },
        });
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Payment niet gevonden',
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error fetching payment status:', error);
    
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Er ging iets mis bij het ophalen van de payment status',
      },
      { status: 500 }
    );
  }
}

