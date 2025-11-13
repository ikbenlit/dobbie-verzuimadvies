'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSupabaseAuth } from '@/lib/supabase/client';
import { getAuthContent } from '@/lib/content';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';

export default function LoginPage() {
  const { login: content } = getAuthContent();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useSupabaseAuth();
  
  // E3.S3: Haal redirect parameter op
  const redirectParam = searchParams.get('redirect');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError(content.errors.fillAllFields);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      // E3.S3: Gebruik redirect parameter of default naar /chat
      const redirectUrl = redirectParam || '/chat';
      // Force full page reload to ensure cookies are set before middleware runs
      window.location.href = redirectUrl;
    } catch (err: any) {
      console.error('Login error:', err);

      // User-friendly error messages
      if (err.message?.includes('Invalid login credentials')) {
        setError(content.errors.invalidCredentials);
      } else if (err.message?.includes('Email not confirmed')) {
        setError(content.errors.emailNotConfirmed);
      } else if (err.message?.includes('Too many requests')) {
        setError(content.errors.tooManyRequests);
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

      {/* Rechterkant - Login Formulier (md:w-3/5) */}
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

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 h-4 w-4 accent-[#771138] border-[#D1D5DB] rounded"
                />
                <label htmlFor="remember" className="text-[14px] text-[#707070]">
                  {content.form.rememberMe}
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-[14px] font-semibold text-[#771138] hover:text-[#5A0D29] transition-colors duration-200"
              >
                {content.form.forgotPassword}
              </Link>
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

            {error && (
              <p className="mt-2 text-center text-[14px] text-red-600">{error}</p>
            )}

            <div className="text-center space-y-2">
              <p className="text-[14px] text-[#707070]">
                {content.links.noAccount}{' '}
                <Link
                  href="/register"
                  className="text-[#771138] hover:text-[#5A0D29] font-semibold transition-colors duration-200"
                >
                  {content.links.register}
                </Link>
              </p>
              <Link
                href="/"
                className="block text-[14px] text-[#707070] hover:text-[#3D3D3D] transition-colors duration-200"
              >
                {content.links.backToHome}
              </Link>
            </div>
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
