'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();

      // Get parameters from URL
      const code = searchParams.get('code');
      const token = searchParams.get('token') || searchParams.get('token_hash');
      const type = searchParams.get('type');
      const next = searchParams.get('next') || searchParams.get('redirect');

      console.log('Auth callback params:', { code, token: token?.substring(0, 20) + '...', type, next });

      try {
        // Handle code-based flow (OAuth, etc.)
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error('Auth callback error:', error.message, error);

            // Check if user is already logged in (code was already used)
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              console.log('User already authenticated, redirecting...');
              router.push(next || '/checkout?plan=solo&billing=yearly');
              return;
            }

            setError('Authenticatie mislukt. Probeer opnieuw in te loggen.');
            setTimeout(() => router.push('/login'), 3000);
            return;
          }

          console.log('Session exchange success:', data.user?.email);

          // For password recovery, redirect to reset-password page
          if (type === 'recovery') {
            router.push('/reset-password');
            return;
          }

          // For email confirmation (signup), redirect to email-confirmed page
          if (type === 'signup' || type === 'email') {
            router.push('/email-confirmed');
            return;
          }

          // Success - redirect to checkout for new registrations, or specified destination
          router.push(next || '/checkout?plan=solo&billing=yearly');
          return;
        }

        // Handle token-based flow (email confirmation, magic links)
        if (token && type) {
          console.log('Attempting verifyOtp with token type:', type);

          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: type as 'signup' | 'recovery' | 'email',
          });

          if (error) {
            console.error('Token verification error:', error.message, error);
            setError(`Verificatie mislukt: ${error.message}`);
            setTimeout(() => router.push('/login'), 3000);
            return;
          }

          console.log('verifyOtp success:', data?.user?.email);

          // For password recovery, redirect to reset-password page
          if (type === 'recovery') {
            router.push('/reset-password');
            return;
          }

          // For email confirmation (signup), redirect to email-confirmed page
          if (type === 'signup' || type === 'email') {
            router.push('/email-confirmed');
            return;
          }

          // Success - redirect to checkout for new registrations, or specified destination
          router.push(next || '/checkout?plan=solo&billing=yearly');
          return;
        }

        // No valid parameters found
        console.warn('No valid auth parameters found in callback');
        router.push('/login');
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        setError('Er ging iets mis tijdens authenticatie.');
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          {error ? (
            <>
              <div className="mx-auto h-12 w-12 text-red-500 mb-4">
                <svg
                  className="h-full w-full"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Authenticatie mislukt
              </h2>
              <p className="text-gray-600">{error}</p>
              <p className="text-sm text-gray-500 mt-2">
                Je wordt doorgestuurd naar de login pagina...
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto h-12 w-12 text-blue-500 mb-4 animate-spin">
                <svg
                  className="h-full w-full"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Account verifiëren...
              </h2>
              <p className="text-gray-600">
                Een moment geduld terwijl we je account verifiëren.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-blue-500 mb-4 animate-spin">
            <svg className="h-full w-full" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Laden...</h2>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
