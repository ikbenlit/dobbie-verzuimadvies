import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Geldig e-mailadres is verplicht' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get the origin from the request headers
    const origin =
      request.headers.get('origin') ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'http://localhost:3000';

    const redirectTo = `${origin}/reset-password`;
    console.log('Password reset redirect URL:', redirectTo);

    // Generate password reset with Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      console.error('Forgot password error:', error);
      return NextResponse.json(
        { error: 'Er is een fout opgetreden bij het verzenden van de reset e-mail' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Reset link is verzonden naar je e-mailadres',
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server fout' }, { status: 500 });
  }
}
