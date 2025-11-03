'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';

export default function RegisterPage() {
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
      setError('Vul alle verplichte velden in.');
      return;
    }

    if (password.length < 8) {
      setError('Wachtwoord moet minimaal 8 karakters bevatten.');
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

      // Show success message
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Registration error:', err);

      // User-friendly error messages
      if (err.message?.includes('User already registered')) {
        setError('Dit e-mailadres is al geregistreerd. Probeer in te loggen.');
      } else if (err.message?.includes('Password should be')) {
        setError('Wachtwoord voldoet niet aan de vereisten.');
      } else {
        setError(err.message || 'Er is een fout opgetreden. Probeer het opnieuw.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Linkerkant - Registratie Formulier (md:w-2/5) */}
      <div className="relative w-full md:w-2/5 bg-[#F5F2EB] flex items-center justify-center p-8 order-2 md:order-1 overflow-hidden">
        {/* Achtergrond decoratie */}
        <div className="absolute -top-20 -left-24 w-72 h-72 bg-[#771138] rounded-full opacity-10 blur-3xl -z-10 animate-pulse-slow" />
        <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-[#E9B046] rounded-full opacity-20 blur-3xl -z-10 animate-pulse-slower" />

        <div className="relative z-10 max-w-md w-full bg-white p-8 md:p-10 rounded-lg shadow-lg">
          {/* Logo en welkomstbericht */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-[28px] font-bold text-[#771138] mb-2">
              Start je gratis trial
            </h1>
            <p className="text-[#3D3D3D] text-[15px]">
              30 dagen gratis toegang tot DOBbie - De Online Bedrijfsarts
            </p>
          </div>

          {/* Success Banner */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-800 p-4 rounded-md">
              <div className="flex items-center">
                <Check className="h-5 w-5 mr-2" />
                <p className="text-[14px] font-medium">
                  Account succesvol aangemaakt! Je wordt doorgestuurd naar de login pagina...
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
                Volledige naam *
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-white border border-[#D1D5DB] rounded-md px-4 py-3 w-full focus:border-[#771138] focus:outline-none focus:ring-2 focus:ring-[#771138]/20 transition-all duration-300 ease-in-out"
                placeholder="Jan Jansen"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-[15px] font-semibold text-[#3D3D3D] mb-2"
              >
                E-mailadres *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border border-[#D1D5DB] rounded-md px-4 py-3 w-full focus:border-[#771138] focus:outline-none focus:ring-2 focus:ring-[#771138]/20 transition-all duration-300 ease-in-out"
                placeholder="naam@bedrijf.nl"
                required
              />
            </div>

            <div>
              <label
                htmlFor="organization"
                className="block text-[15px] font-semibold text-[#3D3D3D] mb-2"
              >
                Organisatie
              </label>
              <input
                type="text"
                id="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="bg-white border border-[#D1D5DB] rounded-md px-4 py-3 w-full focus:border-[#771138] focus:outline-none focus:ring-2 focus:ring-[#771138]/20 transition-all duration-300 ease-in-out"
                placeholder="Naam van je organisatie (optioneel)"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[15px] font-semibold text-[#3D3D3D] mb-2"
              >
                Wachtwoord *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border border-[#D1D5DB] rounded-md px-4 py-3 w-full pr-12 focus:border-[#771138] focus:outline-none focus:ring-2 focus:ring-[#771138]/20 transition-all duration-300 ease-in-out"
                  placeholder="Minimaal 8 karakters"
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
                  Account aanmaken...
                </>
              ) : (
                'Start gratis trial'
              )}
            </button>

            {error && (
              <p className="mt-2 text-center text-[14px] text-red-600">{error}</p>
            )}

            <div className="text-center space-y-2">
              <p className="text-[14px] text-[#707070]">
                Al een account?{' '}
                <Link
                  href="/login"
                  className="text-[#771138] hover:text-[#5A0D29] font-semibold transition-colors duration-200"
                >
                  Inloggen
                </Link>
              </p>
              <Link
                href="/"
                className="block text-[14px] text-[#707070] hover:text-[#3D3D3D] transition-colors duration-200"
              >
                Terug naar home
              </Link>
            </div>

            <p className="text-center text-[12px] text-[#707070] pt-4">
              Door je aan te melden ga je akkoord met onze{' '}
              <Link href="/terms" className="text-[#771138] hover:text-[#5A0D29] underline">
                algemene voorwaarden
              </Link>{' '}
              en{' '}
              <Link href="/privacy" className="text-[#771138] hover:text-[#5A0D29] underline">
                privacybeleid
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Rechterkant - Feature Showcase (md:w-3/5) */}
      <div className="w-full md:w-3/5 text-white p-8 md:p-12 flex items-center relative overflow-hidden order-1 md:order-2 bg-[#771138]">
        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center justify-center h-full">
          <h2 className="font-serif text-[28px] font-bold mb-4 text-center md:text-left text-white">
            Start vandaag nog met DOBbie
          </h2>
          <p className="text-[15px] mb-8 text-center md:text-left text-white opacity-90">
            Krijg direct toegang tot professioneel advies over verzuim,
            Wet Poortwachter en personeelsbeleid. Geen creditcard nodig.
          </p>

          <div className="space-y-4 mb-8 w-full max-w-md">
            <div className="flex items-center p-4 rounded-md bg-white/10 backdrop-blur-md">
              <div className="bg-[#E9B046] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                <Check className="h-5 w-5 text-white" />
              </div>
              <p className="text-[15px] text-white">
                30 dagen gratis proberen
              </p>
            </div>
            <div className="flex items-center p-4 rounded-md bg-white/10 backdrop-blur-md">
              <div className="bg-[#E9B046] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                <Check className="h-5 w-5 text-white" />
              </div>
              <p className="text-[15px] text-white">
                Directe toegang tot alle functionaliteiten
              </p>
            </div>
            <div className="flex items-center p-4 rounded-md bg-white/10 backdrop-blur-md">
              <div className="bg-[#E9B046] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                <Check className="h-5 w-5 text-white" />
              </div>
              <p className="text-[15px] text-white">
                Geen creditcard nodig tijdens trial
              </p>
            </div>
            <div className="flex items-center p-4 rounded-md bg-white/10 backdrop-blur-md">
              <div className="bg-[#E9B046] rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                <Check className="h-5 w-5 text-white" />
              </div>
              <p className="text-[15px] text-white">
                Cancel op elk moment zonder verplichtingen
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
