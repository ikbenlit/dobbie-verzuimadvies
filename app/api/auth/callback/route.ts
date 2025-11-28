import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type');
  // E3.S4: Ondersteun zowel 'next' als 'redirect' parameter voor backward compatibility
  const next = requestUrl.searchParams.get('next') || requestUrl.searchParams.get('redirect') || '/chat';

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

      // For email confirmation (signup), redirect to email-confirmed page
      if (type === 'signup' || type === 'email') {
        return NextResponse.redirect(`${requestUrl.origin}/email-confirmed`);
      }

      // For password recovery, redirect to reset-password page
      if (type === 'recovery') {
        return NextResponse.redirect(`${requestUrl.origin}/reset-password`);
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
