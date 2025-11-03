'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Check, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Er is iets misgegaan');
        return;
      }

      setMessage(data.message || 'We hebben een reset link naar je e-mailadres gestuurd.');
      setEmail('');
    } catch (err) {
      setError('Er is een fout opgetreden. Probeer het later opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
        {/* Linkerkant - Forgot Password Formulier (md:w-2/5) */}
        <div className="relative w-full md:w-2/5 bg-[#F5F2EB] flex items-center justify-center p-8 order-2 md:order-1 overflow-hidden">
          {/* Achtergrond decoratie */}
          <div className="absolute -top-20 -left-24 w-72 h-72 bg-[#771138] rounded-full opacity-10 blur-3xl -z-10 animate-pulse-slow" />
          <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-[#E9B046] rounded-full opacity-20 blur-3xl -z-10 animate-pulse-slower" />

          <div className="relative z-10 max-w-md w-full bg-white p-8 md:p-10 rounded-lg shadow-lg">
            {/* Logo en welkomstbericht */}
            <div className="text-center mb-8">
              <h1 className="font-serif text-[28px] font-bold text-[#771138] mb-2">
                Wachtwoord vergeten?
              </h1>
              <p className="text-[#3D3D3D] text-[15px]">
                Geen probleem. Voer je e-mailadres in en we sturen je een link om je wachtwoord te resetten.
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
                  htmlFor="email"
                  className="block text-[15px] font-semibold text-[#3D3D3D] mb-2"
                >
                  E-mailadres
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border border-[#D1D5DB] rounded-md px-4 py-3 w-full focus:border-[#771138] focus:outline-none focus:ring-2 focus:ring-[#771138]/20 transition-all duration-300 ease-in-out"
                  placeholder="naam@voorbeeld.nl"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full font-bold text-[16px] rounded-md py-[14px] px-[28px] text-white transition-all duration-300 ease-in-out disabled:opacity-70 bg-[#771138] hover:bg-[#5A0D29] flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Bezig met versturen...
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5 mr-2" />
                    Verstuur reset link
                  </>
                )}
              </button>

              <div className="text-center space-y-2">
                <Link
                  href="/login"
                  className="block text-[14px] text-[#771138] hover:text-[#5A0D29] font-semibold transition-colors duration-200"
                >
                  Terug naar inloggen
                </Link>
                <Link
                  href="/"
                  className="block text-[14px] text-[#707070] hover:text-[#3D3D3D] transition-colors duration-200"
                >
                  Terug naar home
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Rechterkant - Feature Showcase (md:w-3/5) */}
        <div className="w-full md:w-3/5 text-white p-8 md:p-12 flex items-center relative overflow-hidden order-1 md:order-2 bg-[#771138]">
          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center justify-center h-full">
            <h2 className="font-serif text-[28px] font-bold mb-4 text-center md:text-left text-white">
              We helpen je graag verder
            </h2>
            <p className="text-[15px] mb-8 text-center md:text-left text-white opacity-90">
              Je krijgt binnen enkele minuten een e-mail met instructies om je wachtwoord te resetten.
            </p>

            <div className="space-y-4 mb-8 w-full max-w-md">
              <div className="flex items-center p-4 rounded-md bg-white/10 backdrop-blur-md">
                <div className="bg-[#E9B046] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <p className="text-[15px] text-white">
                  Veilig en betrouwbaar reset proces
                </p>
              </div>
              <div className="flex items-center p-4 rounded-md bg-white/10 backdrop-blur-md">
                <div className="bg-[#E9B046] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <p className="text-[15px] text-white">
                  Direct weer toegang tot je account
                </p>
              </div>
              <div className="flex items-center p-4 rounded-md bg-white/10 backdrop-blur-md">
                <div className="bg-[#E9B046] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <p className="text-[15px] text-white">
                  Hulp nodig? Neem contact met ons op
                </p>
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
