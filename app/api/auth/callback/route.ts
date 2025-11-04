import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/chat';

  if (code) {
    const supabase = await createClient();

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=${encodeURIComponent(error.message)}`
        );
      }

      // Successful authentication, redirect to next URL
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    } catch (error) {
      console.error('Unexpected error in auth callback:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=authentication_failed`
      );
    }
  }

  // No code provided, redirect to home
  return NextResponse.redirect(requestUrl.origin);
}
