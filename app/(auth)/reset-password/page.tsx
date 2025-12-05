'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getAuthContent } from '@/lib/content';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';

function ResetPasswordForm() {
  const { resetPassword: content } = getAuthContent();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Handle the recovery code and verify session on mount
  useEffect(() => {
    const handleRecoveryFlow = async () => {
      setVerifying(true);

      // Check for code parameter (from Supabase recovery email)
      const code = searchParams.get('code');

      if (code) {
        console.log('[ResetPassword] Exchanging code for session...');
        try {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error('[ResetPassword] Code exchange error:', exchangeError);
            // Don't show error yet - check if session already exists (from callback)
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              console.log('[ResetPassword] Session already exists, continuing...');
              setVerifying(false);
              return;
            }
            setError(content.errors.invalidToken);
            setVerifying(false);
            return;
          }

          console.log('[ResetPassword] Code exchanged successfully for:', data.user?.email);
          setVerifying(false);
          return;
        } catch (err) {
          console.error('[ResetPassword] Unexpected error:', err);
          // Don't show error yet - check if session already exists
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            console.log('[ResetPassword] Session already exists after error, continuing...');
            setVerifying(false);
            return;
          }
          setError(content.errors.invalidToken);
          setVerifying(false);
          return;
        }
      }

      // No code - check if we already have a valid session
      let { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // Retry after short delay (session may still be loading from callback)
        await new Promise(resolve => setTimeout(resolve, 500));
        const retryResult = await supabase.auth.getSession();
        session = retryResult.data.session;
      }

      if (!session) {
        setError(content.errors.invalidToken);
      }

      setVerifying(false);
    };

    handleRecoveryFlow();
  }, [supabase, searchParams, content.errors.invalidToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Validation
    if (!password || !confirmPassword) {
      setError(content.errors.fillAllFields);
      return;
    }

    if (password.length < 8) {
      setError(content.errors.passwordTooShort);
      return;
    }

    if (password !== confirmPassword) {
      setError(content.errors.passwordsDontMatch);
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      setMessage(content.form.successMessage || 'Wachtwoord succesvol bijgewerkt!');
      setPassword('');
      setConfirmPassword('');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: unknown) {
      console.error('Reset password error:', err);

      const errorMessage = err instanceof Error ? err.message : '';
      if (errorMessage.includes('session_not_found') || errorMessage.includes('invalid')) {
        setError(content.errors.invalidToken);
      } else {
        setError(content.errors.genericError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Linkerkant - Feature Showcase (md:w-2/5) */}
      <div className="w-full md:w-2/5 p-8 md:p-12 flex items-center relative overflow-hidden order-2 md:order-1 bg-cover bg-center" style={{backgroundImage: 'url(/images/demo-dobbie.webp)'}}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 z-0" />

        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center justify-center h-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
            <h2 className="font-serif text-[28px] font-bold mb-4 text-center md:text-left text-white drop-shadow-lg">
              {content.features.title}
            </h2>
            <p className="text-[15px] mb-8 text-center md:text-left text-white drop-shadow-md">
              {content.features.description}
            </p>

            <div className="space-y-4 w-full">
              {content.features.items.map((item, index) => (
                <div key={index} className="flex items-center p-4 rounded-md bg-white/90 backdrop-blur-md shadow-lg">
                  <div className="bg-[#E9B046] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-[15px] text-brand-text">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rechterkant - Reset Password Formulier (md:w-3/5) */}
      <div className="relative w-full md:w-3/5 bg-[#F5F2EB] flex items-center justify-center p-8 order-1 md:order-2 overflow-hidden">
        {/* Achtergrond decoratie */}
        <div className="absolute -top-20 -left-24 w-72 h-72 bg-[#771138] rounded-full opacity-10 blur-3xl -z-10 animate-pulse-slow" />
        <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-[#E9B046] rounded-full opacity-20 blur-3xl -z-10 animate-pulse-slower" />

        <div className="relative z-10 max-w-md w-full bg-white p-8 md:p-10 rounded-lg shadow-lg">
          {/* Loading state during verification */}
          {verifying ? (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-[#771138] mx-auto mb-4" />
              <p className="text-[#3D3D3D]">Link verifiëren...</p>
            </div>
          ) : (
            <>
              {/* Logo en welkomstbericht */}
              <div className="text-center mb-8">
                <h1 className="font-serif text-[28px] font-bold text-[#771138] mb-2">
                  {content.title}
                </h1>
                <p className="text-[#3D3D3D] text-[15px]">
                  {content.subtitle}
                </p>
              </div>

              {/* Success Banner */}
              {message && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-800 p-4 rounded-md">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 mr-2 flex-shrink-0" />
                    <p className="text-[14px]">{message}</p>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
                  <p className="text-[14px]">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-[15px] font-semibold text-[#3D3D3D] mb-2"
                  >
                    {content.form.passwordLabel}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white border border-[#D1D5DB] rounded-md px-4 py-3 w-full pr-12 focus:border-[#771138] focus:outline-none focus:ring-2 focus:ring-[#771138]/20 transition-all duration-300 ease-in-out"
                      placeholder={content.form.passwordPlaceholder}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#707070] hover:text-[#3D3D3D] transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-[15px] font-semibold text-[#3D3D3D] mb-2"
                  >
                    {content.form.confirmPasswordLabel}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-white border border-[#D1D5DB] rounded-md px-4 py-3 w-full pr-12 focus:border-[#771138] focus:outline-none focus:ring-2 focus:ring-[#771138]/20 transition-all duration-300 ease-in-out"
                      placeholder={content.form.confirmPasswordPlaceholder}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#707070] hover:text-[#3D3D3D] transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-bold text-[16px] rounded-md py-[14px] px-[28px] text-white transition-all duration-300 ease-in-out disabled:opacity-70 bg-[#771138] hover:bg-[#5A0D29] flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      {content.form.submitButtonLoading}
                    </>
                  ) : (
                    content.form.submitButton
                  )}
                </button>

                <div className="text-center space-y-2">
                  <Link
                    href="/login"
                    className="block text-[14px] text-[#771138] hover:text-[#5A0D29] font-semibold transition-colors duration-200"
                  >
                    {content.links.backToLogin}
                  </Link>
                  <Link
                    href="/"
                    className="block text-[14px] text-[#707070] hover:text-[#3D3D3D] transition-colors duration-200"
                  >
                    {content.links.backToHome}
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.05);
          }
        }
        @keyframes pulse-slower {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.03);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }
        .animate-pulse-slower {
          animation: pulse-slower 10s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F2EB]">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#771138] mx-auto mb-4" />
        <p className="text-[#3D3D3D]">Laden...</p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
