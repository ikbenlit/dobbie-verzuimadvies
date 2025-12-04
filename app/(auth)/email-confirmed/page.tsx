'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuthContent } from '@/lib/content';
import { Check, Gift, Loader2 } from 'lucide-react';

// Check if free access mode is enabled (Cyber Monday / promotional period)
const FREE_ACCESS_MODE = false; // Cyber Monday actie - zet op false om uit te schakelen

export default function EmailConfirmedPage() {
  const { emailConfirmed: content } = getAuthContent();
  const router = useRouter();
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-activate free access when in FREE_ACCESS_MODE
  useEffect(() => {
    if (FREE_ACCESS_MODE && !activated && !activating) {
      activateFreeAccess();
    }
  }, []);

  const activateFreeAccess = async () => {
    try {
      setActivating(true);
      setError(null);
      const response = await fetch('/api/auth/activate-free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (data.success) {
        setActivated(true);
        // Redirect to chat after short delay
        setTimeout(() => {
          router.push('/chat');
        }, 2000);
      } else {
        setError(data.error || 'Er ging iets mis bij het activeren');
      }
    } catch (err) {
      console.error('Error activating free access:', err);
      setError('Er ging iets mis. Probeer het later opnieuw.');
    } finally {
      setActivating(false);
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

      {/* Rechterkant - Success Message (md:w-3/5) */}
      <div className="relative w-full md:w-3/5 bg-[#F5F2EB] flex items-center justify-center p-8 order-1 md:order-2 overflow-hidden">
        {/* Achtergrond decoratie */}
        <div className="absolute -top-20 -left-24 w-72 h-72 bg-[#771138] rounded-full opacity-10 blur-3xl -z-10 animate-pulse-slow" />
        <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-[#E9B046] rounded-full opacity-20 blur-3xl -z-10 animate-pulse-slower" />

        <div className="relative z-10 max-w-md w-full bg-white p-8 md:p-10 rounded-lg shadow-lg">
          {/* Success content */}
          <div className="text-center py-8">
            {/* FREE ACCESS MODE: Show activation state */}
            {FREE_ACCESS_MODE ? (
              <>
                {activating ? (
                  <>
                    <div className="mx-auto w-20 h-20 bg-[#E9B046]/20 rounded-full flex items-center justify-center mb-6">
                      <Loader2 className="h-10 w-10 text-[#E9B046] animate-spin" />
                    </div>
                    <h1 className="font-serif text-[28px] font-bold text-[#771138] mb-3">
                      Account activeren...
                    </h1>
                    <p className="text-[#707070] text-[15px]">
                      Een moment geduld, je gratis toegang wordt geactiveerd.
                    </p>
                  </>
                ) : activated ? (
                  <>
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <Check className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="font-serif text-[28px] font-bold text-[#771138] mb-3">
                      Je account is geactiveerd!
                    </h1>
                    <p className="text-[#707070] text-[15px] mb-4">
                      Je wordt automatisch doorgestuurd naar DoBbie...
                    </p>
                    <div className="flex items-center justify-center gap-2 text-[#E9B046]">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Doorsturen...</span>
                    </div>
                  </>
                ) : error ? (
                  <>
                    <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                      <span className="text-3xl">!</span>
                    </div>
                    <h1 className="font-serif text-[28px] font-bold text-[#771138] mb-3">
                      Oeps, er ging iets mis
                    </h1>
                    <p className="text-red-600 text-[15px] mb-6">{error}</p>
                    <button
                      onClick={activateFreeAccess}
                      className="inline-block w-full font-bold text-[16px] rounded-full py-[14px] px-[28px] text-white transition-all duration-300 ease-in-out bg-[#771138] hover:bg-[#5A0D29] text-center"
                    >
                      Opnieuw proberen
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mx-auto w-20 h-20 bg-[#E9B046]/20 rounded-full flex items-center justify-center mb-6">
                      <Gift className="h-10 w-10 text-[#E9B046]" />
                    </div>
                    <h1 className="font-serif text-[28px] font-bold text-[#771138] mb-3">
                      Email bevestigd!
                    </h1>
                    <p className="text-[#707070] text-[15px] mb-6">
                      Klik hieronder om je gratis toegang te activeren.
                    </p>
                    <button
                      onClick={activateFreeAccess}
                      className="inline-block w-full font-bold text-[16px] rounded-full py-[14px] px-[28px] text-white transition-all duration-300 ease-in-out bg-[#E9B046] hover:bg-[#D4A03A] text-center flex items-center justify-center gap-2"
                    >
                      <Gift className="h-5 w-5" />
                      Gratis toegang activeren
                    </button>
                  </>
                )}
              </>
            ) : (
              /* Normal flow: Show login button */
              <>
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="font-serif text-[28px] font-bold text-[#771138] mb-3">
                  {content.title}
                </h1>
                <p className="text-[#3D3D3D] text-[15px] mb-2">
                  {content.subtitle}
                </p>
                <p className="text-[#707070] text-[14px] mb-8">
                  {content.description}
                </p>

                <Link
                  href="/login"
                  className="inline-block w-full font-bold text-[16px] rounded-full py-[14px] px-[28px] text-white transition-all duration-300 ease-in-out bg-[#771138] hover:bg-[#5A0D29] text-center"
                >
                  {content.loginButton}
                </Link>
              </>
            )}

            <div className="mt-6">
              <Link
                href="/"
                className="text-[14px] text-[#707070] hover:text-[#3D3D3D] transition-colors duration-200"
              >
                {content.links.backToHome}
              </Link>
            </div>
          </div>
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
