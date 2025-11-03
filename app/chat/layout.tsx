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

  console.log('✅ [ChatLayout] User authenticated, rendering chat');

  // Convert Supabase user to app User format
  const userData = {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name,
    account_type: user.user_metadata?.account_type,
    organization_id: user.user_metadata?.organization_id,
    subscription_status: user.user_metadata?.subscription_status,
    role: user.user_metadata?.role ?? 'user',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F2EB]">
      <ChatSidebar user={userData} />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
