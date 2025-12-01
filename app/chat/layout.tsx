import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ChatSidebar } from '@/components/layout/ChatSidebar';

// Check if free access mode is enabled (Cyber Monday / promotional period)
const FREE_ACCESS_MODE = process.env.NEXT_PUBLIC_FREE_ACCESS_MODE === 'true';

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('👤 [ChatLayout] User from getUser():', user?.email || 'NO USER');

  if (!user) {
    console.log('🚫 [ChatLayout] No user found, redirecting to /login');
    redirect('/login');
  }

  // E5.S1 - Check subscription_status uit database (niet user_metadata)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single();

  // E5.S2 - Redirect als niet actief
  // Database error handling: bij error laten we user door (fail-open voor UX)
  if (profileError) {
    console.error(`⚠️ [ChatLayout] Database error checking subscription_status for user ${user.id}:`, profileError);
    // Fail-open: laat user door bij database errors (monitoring alert wordt gestuurd)
    // Dit voorkomt dat users geblokkeerd worden bij database downtime
  } else if (!profile || profile.subscription_status !== 'active') {
    // FREE ACCESS MODE: Auto-activate user instead of redirecting to checkout
    if (FREE_ACCESS_MODE) {
      console.log(`🎁 [ChatLayout] FREE_ACCESS_MODE enabled, activating user ${user.id}`);

      // Calculate dates for free subscription
      const now = new Date();
      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + 1); // 1 month free access

      // Create free subscription
      const { error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          mollie_reference_id: `promo_free_${Date.now()}`,
          status: 'active',
          plan_type: 'solo',
          billing_period: 'monthly',
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
        console.error(`⚠️ [ChatLayout] Error creating free subscription:`, subError);
      }

      // Update profile subscription status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          updated_at: now.toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        console.error(`⚠️ [ChatLayout] Error updating profile:`, updateError);
      } else {
        console.log(`✅ [ChatLayout] Successfully activated free access for user ${user.id}`);
      }
    } else {
      console.log(`🚫 [ChatLayout] User ${user.id} subscription_status: ${profile?.subscription_status || 'unknown'}, redirecting to checkout`);
      redirect('/checkout?renew=true');
    }
  }

  console.log('✅ [ChatLayout] User authenticated and subscription active, rendering chat');

  // Convert Supabase user to app User format
  // subscription_status komt nu uit database (niet user_metadata)
  // In FREE_ACCESS_MODE, user was just activated so status is 'active'
  const userData = {
    id: user.id,
    email: user.email ?? (user.user_metadata?.email as string | undefined) ?? '',
    full_name: user.user_metadata?.full_name,
    account_type: user.user_metadata?.account_type,
    organization_id: user.user_metadata?.organization_id,
    subscription_status: FREE_ACCESS_MODE ? 'active' : profile?.subscription_status, // In FREE_ACCESS_MODE always active
    role: user.user_metadata?.role ?? 'user',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F2EB]">
      <ChatSidebar user={userData} />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
