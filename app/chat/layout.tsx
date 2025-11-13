import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ChatSidebar } from '@/components/layout/ChatSidebar';

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
    console.log(`🚫 [ChatLayout] User ${user.id} subscription_status: ${profile?.subscription_status || 'unknown'}, redirecting to checkout`);
    redirect('/checkout?renew=true');
  }

  console.log('✅ [ChatLayout] User authenticated and subscription active, rendering chat');

  // Convert Supabase user to app User format
  // subscription_status komt nu uit database (niet user_metadata)
  const userData = {
    id: user.id,
    email: user.email ?? (user.user_metadata?.email as string | undefined) ?? '',
    full_name: user.user_metadata?.full_name,
    account_type: user.user_metadata?.account_type,
    organization_id: user.user_metadata?.organization_id,
    subscription_status: profile?.subscription_status, // Gebruik database waarde
    role: user.user_metadata?.role ?? 'user',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F2EB]">
      <ChatSidebar user={userData} />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
