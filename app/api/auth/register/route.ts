import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  account_type: 'individual' | 'organization_member';
  organization_code?: string;
}

export async function POST(request: NextRequest) {
  try {
    const registrationData: RegistrationData = await request.json();

    // Validatie van verplichte velden
    if (!registrationData.email || !registrationData.email.includes('@')) {
      return NextResponse.json(
        { error: 'Geldig e-mailadres is verplicht' },
        { status: 400 }
      );
    }

    if (!registrationData.password || registrationData.password.length < 6) {
      return NextResponse.json(
        { error: 'Wachtwoord moet minimaal 6 karakters bevatten' },
        { status: 400 }
      );
    }

    if (registrationData.password !== registrationData.confirmPassword) {
      return NextResponse.json(
        { error: 'Wachtwoorden komen niet overeen' },
        { status: 400 }
      );
    }

    if (!registrationData.full_name || registrationData.full_name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Volledige naam is verplicht' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    let organizationId: string | null = null;

    // Validatie voor organisatieleden
    if (registrationData.account_type === 'organization_member') {
      if (!registrationData.organization_code) {
        return NextResponse.json(
          { error: 'Organisatiecode is verplicht voor organisatieleden' },
          { status: 400 }
        );
      }

      // Valideer organisatiecode
      try {
        const { data, error: orgError } = await supabase.rpc(
          'validate_organization_code',
          {
            org_code_to_check: registrationData.organization_code,
          } as any
        );

        const orgData = data as unknown as any[];

        if (orgError || !orgData || orgData.length === 0 || !orgData[0]?.is_valid) {
          return NextResponse.json(
            { error: 'Ongeldige organisatiecode' },
            { status: 400 }
          );
        }

        organizationId = orgData[0].organization_id;
      } catch (error) {
        console.error('Organization validation error:', error);
        return NextResponse.json(
          { error: 'Fout bij valideren organisatiecode' },
          { status: 500 }
        );
      }
    }

    // Get the origin from the request headers
    const origin =
      request.headers.get('origin') ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'http://localhost:3000';

    const redirectTo = `${origin}/auth/callback`;
    console.log('Registration redirect URL:', redirectTo);

    // Prepare user metadata
    const userMetadata: Record<string, any> = {
      full_name: registrationData.full_name,
      account_type: registrationData.account_type,
    };

    if (registrationData.account_type === 'organization_member' && organizationId) {
      userMetadata.organization_id = organizationId;
    }

    // Register user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: registrationData.email,
      password: registrationData.password,
      options: {
        data: userMetadata,
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      console.error('Registration error:', error);
      return NextResponse.json(
        { error: getLocalizedErrorMessage(error.message) },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Er is een onbekende fout opgetreden tijdens registratie' },
        { status: 500 }
      );
    }

    // Check if email confirmation is required
    if (!data.session) {
      return NextResponse.json({
        message: 'Controleer uw e-mail voor een bevestigingslink voordat u kunt inloggen',
        requiresConfirmation: true,
        userId: data.user.id,
      });
    }

    // If user is immediately signed in
    return NextResponse.json({
      message: 'Registratie succesvol',
      requiresConfirmation: false,
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name,
      },
    });
  } catch (error) {
    console.error('Server error during registration:', error);
    return NextResponse.json(
      { error: 'Server fout tijdens registratie' },
      { status: 500 }
    );
  }
}

function getLocalizedErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'Invalid login credentials': 'Ongeldige inloggegevens.',
    'Email not confirmed': 'E-mailadres nog niet bevestigd.',
    'User already registered': 'Dit e-mailadres is al geregistreerd.',
    'Password should be at least 6 characters': 'Wachtwoord moet minimaal 6 karakters bevatten.',
    'Unable to validate email address: invalid format': 'Ongeldig e-mailadres formaat.',
    'Signup is disabled': 'Registratie is momenteel uitgeschakeld.',
    'Email rate limit exceeded': 'Te veel e-mails verzonden. Probeer het later opnieuw.',
    'For security purposes, you can only request this once every 60 seconds':
      'Voor de veiligheid kunt u dit maar één keer per minuut aanvragen.',
    'weak password': 'Wachtwoord is te zwak.',
    'invalid email': 'Ongeldig e-mailadres.',
    'Failed to fetch': 'Geen internetverbinding.',
  };

  // Check for exact match
  if (errorMessages[errorCode]) {
    return errorMessages[errorCode];
  }

  // Check for partial matches
  const lowerErrorCode = errorCode.toLowerCase();
  for (const [key, message] of Object.entries(errorMessages)) {
    if (
      lowerErrorCode.includes(key.toLowerCase()) ||
      key.toLowerCase().includes(lowerErrorCode)
    ) {
      return message;
    }
  }

  return errorCode || 'Er is een onbekende fout opgetreden.';
}
