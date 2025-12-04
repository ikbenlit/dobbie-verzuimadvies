'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { getAuthContent } from '@/lib/content';
import { Eye, EyeOff, Loader2, Check, Gift } from 'lucide-react';

// Check if free access mode is enabled (Cyber Monday / promotional period)
const FREE_ACCESS_MODE = true; // Cyber Monday actie - zet op false om uit te schakelen

// Debug logging voor Vercel deployment
console.log('🎁 [Register] FREE_ACCESS_MODE:', FREE_ACCESS_MODE);

export default function RegisterPage() {
  const { register: content } = getAuthContent();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activatingFree, setActivatingFree] = useState(false);
  const supabase = createClient();

  // Helper function to activate free access
  const activateFreeAccess = async (): Promise<boolean> => {
    try {
      setActivatingFree(true);
      const response = await fetch('/api/auth/activate-free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      return data.success;
    } catch (err) {
      console.error('Error activating free access:', err);
      return false;
    } finally {
      setActivatingFree(false);
    }
  };

  // Check if user is already logged in and redirect accordingly
  // Also clears stale sessions to prevent auth conflicts
  useEffect(() => {
    const checkExistingUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // User exists, check if they have a valid profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('subscription_status')
            .eq('id', user.id)
            .single();

          if (profileError) {
            // Profile doesn't exist or error - clear stale session and show register form
            console.log('No valid profile found, clearing session for fresh registration');
            await supabase.auth.signOut();
            setCheckingAuth(false);
            return;
          }

          // Valid profile exists - redirect based on subscription status
          if (profile?.subscription_status === 'active') {
            window.location.href = '/chat';
          } else {
            window.location.href = '/checkout?renew=true';
          }
        } else {
          // No user logged in, show registration form
          setCheckingAuth(false);
        }
      } catch (err) {
        console.error('Error checking auth status:', err);
        // Clear any potentially stale session data
        await supabase.auth.signOut();
        setCheckingAuth(false);
      }
    };

    checkExistingUser();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !fullName) {
      setError(content.errors.fillAllFields);
      return;
    }

    if (password.length < 8) {
      setError(content.errors.passwordTooShort);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Build the callback URL for email confirmation
      const origin = window.location.origin;
      const callbackUrl = `${origin}/auth/callback`;

      console.log('[Register] Using emailRedirectTo:', callbackUrl);

      // Register user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            organization: organization,
          },
          emailRedirectTo: callbackUrl,
        },
      });

      if (signUpError) throw signUpError;

      // E2.S1 & E2.S2: Auto-login check en redirect naar checkout
      // Behoud plan en billing parameters uit URL
      const urlParams = new URLSearchParams(window.location.search);
      const plan = urlParams.get('plan') || 'solo';
      const billing = urlParams.get('billing') || 'yearly';

      if (data.session) {
        // Automatisch ingelogd - wacht even zodat session cookies zijn gezet
        await new Promise(resolve => setTimeout(resolve, 500));

        // FREE ACCESS MODE: Skip checkout en activeer direct
        if (FREE_ACCESS_MODE) {
          const activated = await activateFreeAccess();
          if (activated) {
            window.location.href = '/chat';
            return;
          }
          // Fallback naar checkout als activatie faalt
        }

        // Normale flow: redirect naar checkout met plan parameters
        window.location.href = `/checkout?plan=${plan}&billing=${billing}&new=true`;
      } else {
        // Email confirmation vereist - toon succes melding
        setSuccess(true);
        setLoading(false);
        // Niet automatisch doorsturen - gebruiker moet eerst email bevestigen
      }
    } catch (err: any) {
      // Detailed logging for debugging
      console.error('Registration error:', {
        message: err.message,
        status: err.status,
        code: err.code,
        details: err.details,
        hint: err.hint,
        fullError: err,
      });

      // User-friendly error messages
      if (err.message?.includes('User already registered')) {
        setError(content.errors.userExists);
      } else if (err.message?.includes('Password should be')) {
        setError(content.errors.passwordRequirements);
      } else if (err.message?.includes('confirmation email') || err.message?.includes('sending email')) {
        setError('Er kon geen bevestigingsmail worden verstuurd. Probeer het later opnieuw of neem contact op met support.');
        console.error('Email sending failed - check Supabase SMTP configuration');
      } else if (err.message?.includes('rate limit')) {
        setError('Te veel registratiepogingen. Wacht een paar minuten en probeer opnieuw.');
      } else {
        setError(err.message || content.errors.genericError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F2EB]">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-[#771138] mx-auto mb-4" />
          <p className="text-[#3D3D3D]">Laden...</p>
        </div>
      </div>
    );
  }

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

      {/* Rechterkant - Registratie Formulier (md:w-3/5) */}
      <div className="relative w-full md:w-3/5 bg-[#F5F2EB] flex items-center justify-center p-8 order-1 md:order-2 overflow-hidden">
        {/* Achtergrond decoratie */}
        <div className="absolute -top-20 -left-24 w-72 h-72 bg-[#771138] rounded-full opacity-10 blur-3xl -z-10 animate-pulse-slow" />
        <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-[#E9B046] rounded-full opacity-20 blur-3xl -z-10 animate-pulse-slower" />

        <div className="relative z-10 max-w-md w-full bg-white p-8 md:p-10 rounded-lg shadow-lg">
          {/* FREE ACCESS BANNER */}
{/* FREE ACCESS BANNER
         {FREE_ACCESS_MODE && (
            <div className="mb-6 p-4 bg-gradient-to-r from-[#E9B046] to-[#D4A03A] rounded-lg text-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-full p-2">
                  <Gift className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-lg">Cyber Monday Actie!</p>
                  <p className="text-sm opacity-90">Tijdelijk gratis toegang - geen betaling nodig</p>
                </div>
              </div>
            </div>
          )}
*/}
          {/* Logo en welkomstbericht */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-[28px] font-bold text-[#771138] mb-2">
              {content.title}
            </h1>
            <p className="text-[#3D3D3D] text-[15px]">
              {FREE_ACCESS_MODE ? 'Maak een account aan en krijg direct gratis toegang' : content.subtitle}
            </p>
          </div>

          {/* Success Banner - Email bevestiging vereist */}
          {success ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-[#3D3D3D] mb-3">
                {content.successBanner.title}
              </h2>
              <p className="text-[#707070] mb-6">
                {content.successBanner.message} <strong>{email}</strong>.
                <br />
                {content.successBanner.instruction}
              </p>
              <div className="bg-[#F5F2EB] rounded-lg p-4 text-sm text-[#707070]">
                <p>{content.successBanner.noEmail}</p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="text-[#771138] hover:text-[#5A0D29] font-semibold mt-1"
                >
                  {content.successBanner.tryAgain}
                </button>
              </div>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="fullName"
                className="block text-[15px] font-semibold text-[#3D3D3D] mb-2"
              >
                {content.form.fullNameLabel}
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-white border border-[#D1D5DB] rounded-md px-4 py-3 w-full focus:border-[#771138] focus:outline-none focus:ring-2 focus:ring-[#771138]/20 transition-all duration-300 ease-in-out"
                placeholder={content.form.fullNamePlaceholder}
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-[15px] font-semibold text-[#3D3D3D] mb-2"
              >
                {content.form.emailLabel}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border border-[#D1D5DB] rounded-md px-4 py-3 w-full focus:border-[#771138] focus:outline-none focus:ring-2 focus:ring-[#771138]/20 transition-all duration-300 ease-in-out"
                placeholder={content.form.emailPlaceholder}
                required
              />
            </div>

            <div>
              <label
                htmlFor="organization"
                className="block text-[15px] font-semibold text-[#3D3D3D] mb-2"
              >
                {content.form.organizationLabel}
              </label>
              <input
                type="text"
                id="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="bg-white border border-[#D1D5DB] rounded-md px-4 py-3 w-full focus:border-[#771138] focus:outline-none focus:ring-2 focus:ring-[#771138]/20 transition-all duration-300 ease-in-out"
                placeholder={content.form.organizationPlaceholder}
              />
            </div>

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
                  minLength={8}
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

            <button
              type="submit"
              disabled={loading || success || activatingFree}
              className="w-full font-bold text-[16px] rounded-full py-[14px] px-[28px] text-white transition-all duration-300 ease-in-out disabled:opacity-70 bg-[#771138] hover:bg-[#5A0D29] flex items-center justify-center"
            >
              {loading || activatingFree ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  {activatingFree ? 'Account activeren...' : content.form.submitButtonLoading}
                </>
              ) : FREE_ACCESS_MODE ? (
                <>
                  <Gift className="-ml-1 mr-2 h-5 w-5" />
                  Gratis registreren
                </>
              ) : (
                content.form.submitButton
              )}
            </button>

            {error && (
              <p className="mt-2 text-center text-[14px] text-red-600">{error}</p>
            )}

            <div className="text-center space-y-2">
              <p className="text-[14px] text-[#707070]">
                {content.links.hasAccount}{' '}
                <Link
                  href="/login"
                  className="text-[#771138] hover:text-[#5A0D29] font-semibold transition-colors duration-200"
                >
                  {content.links.login}
                </Link>
              </p>
              <Link
                href="/"
                className="block text-[14px] text-[#707070] hover:text-[#3D3D3D] transition-colors duration-200"
              >
                {content.links.backToHome}
              </Link>
            </div>

            <p className="text-center text-[12px] text-[#707070] pt-4">
              {content.links.termsPrefix}{' '}
              <Link href="/terms" className="text-[#771138] hover:text-[#5A0D29] underline">
                {content.links.termsLink}
              </Link>{' '}
              {content.links.termsAnd}{' '}
              <Link href="/privacy" className="text-[#771138] hover:text-[#5A0D29] underline">
                {content.links.privacyLink}
              </Link>
            </p>
          </form>
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
