import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/auth/activate-free
 *
 * Activates a user's subscription for free during promotional periods.
 * Only works when FREE_ACCESS_MODE environment variable is enabled.
 *
 * This endpoint:
 * 1. Checks if free access mode is enabled
 * 2. Verifies the user is authenticated
 * 3. Creates a free subscription record
 * 4. Updates the user's profile to active status
 */
export async function POST(_request: NextRequest) {
  try {
    // Check if free access mode is enabled
    const freeAccessMode = process.env.NEXT_PUBLIC_FREE_ACCESS_MODE === 'true';

    if (!freeAccessMode) {
      return NextResponse.json(
        { success: false, error: 'Gratis toegang is niet beschikbaar' },
        { status: 403 }
      );
    }

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

    // Check if user already has an active subscription
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (existingSubscription) {
      // User already has active subscription, just return success
      return NextResponse.json({
        success: true,
        message: 'Je hebt al een actief abonnement',
        alreadyActive: true,
      });
    }

    // Calculate dates for free subscription
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1); // 1 month free access

    // Create free subscription record
    const { error: subError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        mollie_reference_id: `promo_free_${Date.now()}`,
        status: 'active',
        amount: 0,
        currency: 'EUR',
        start_date: now.toISOString(),
        next_billing_date: endDate.toISOString(),
        is_recurring: false,
        discount_code: 'PROMO_FREE_ACCESS',
        discount_amount: 0,
        original_price: 0,
      });

    if (subError) {
      console.error('[Free Activation] Error creating subscription:', subError);
      return NextResponse.json(
        { success: false, error: 'Fout bij het activeren van je account' },
        { status: 500 }
      );
    }

    // Update profile subscription status
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'active',
        updated_at: now.toISOString(),
      })
      .eq('id', user.id);

    if (profileError) {
      console.error('[Free Activation] Error updating profile:', profileError);
      // Don't fail - subscription is already created
    }

    console.log(`[Free Activation] Successfully activated free access for user ${user.id}`);

    return NextResponse.json({
      success: true,
      message: 'Je account is geactiveerd!',
      alreadyActive: false,
    });
  } catch (error) {
    console.error('[Free Activation] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Er ging iets mis. Probeer het later opnieuw.' },
      { status: 500 }
    );
  }
}
