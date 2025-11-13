'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getAuthContent } from '@/lib/content';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';

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
  const router = useRouter();
  const supabase = createClient();

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
      // Register user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            organization: organization,
          },
        },
      });

      if (signUpError) throw signUpError;

      // E2.S1 & E2.S2: Auto-login check en redirect naar checkout
      if (data.session) {
        // Automatisch ingelogd - redirect naar checkout
        router.push('/checkout?new=true');
      } else {
        // Email confirmation vereist - redirect naar login met return URL
        router.push('/login?redirect=/checkout&new=true');
      }
    } catch (err: any) {
      console.error('Registration error:', err);

      // User-friendly error messages
      if (err.message?.includes('User already registered')) {
        setError(content.errors.userExists);
      } else if (err.message?.includes('Password should be')) {
        setError(content.errors.passwordRequirements);
      } else {
        setError(err.message || content.errors.genericError);
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

      {/* Rechterkant - Registratie Formulier (md:w-3/5) */}
      <div className="relative w-full md:w-3/5 bg-[#F5F2EB] flex items-center justify-center p-8 order-1 md:order-2 overflow-hidden">
        {/* Achtergrond decoratie */}
        <div className="absolute -top-20 -left-24 w-72 h-72 bg-[#771138] rounded-full opacity-10 blur-3xl -z-10 animate-pulse-slow" />
        <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-[#E9B046] rounded-full opacity-20 blur-3xl -z-10 animate-pulse-slower" />

        <div className="relative z-10 max-w-md w-full bg-white p-8 md:p-10 rounded-lg shadow-lg">
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
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-800 p-4 rounded-md">
              <div className="flex items-center">
                <Check className="h-5 w-5 mr-2" />
                <p className="text-[14px] font-medium">
                  {content.form.successMessage}
                </p>
              </div>
            </div>
          )}

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
              disabled={loading || success}
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
