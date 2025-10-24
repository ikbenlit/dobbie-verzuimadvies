'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      alert('Registratie succesvol! Controleer je e-mail voor verificatie.');
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is iets misgegaan bij het registreren');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-bordeaux">
            Start je gratis trial
          </h2>
          <p className="mt-2 text-center text-sm text-gray-dark">
            30 dagen gratis toegang tot DoBbie
          </p>
          <p className="mt-2 text-center text-sm text-gray-dark">
            Of{' '}
            <Link
              href="/login"
              className="font-medium text-bordeaux hover:text-bordeaux-hover"
            >
              log in met een bestaand account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-dark">
                Volledige naam
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-light px-3 py-2 text-gray-dark placeholder-gray-500 focus:border-bordeaux focus:outline-none focus:ring-bordeaux sm:text-sm"
                placeholder="Jan Jansen"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-dark">
                E-mailadres
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-light px-3 py-2 text-gray-dark placeholder-gray-500 focus:border-bordeaux focus:outline-none focus:ring-bordeaux sm:text-sm"
                placeholder="jan@bedrijf.nl"
              />
            </div>

            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-dark">
                Organisatie
              </label>
              <input
                id="organization"
                name="organization"
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-light px-3 py-2 text-gray-dark placeholder-gray-500 focus:border-bordeaux focus:outline-none focus:ring-bordeaux sm:text-sm"
                placeholder="Naam van je organisatie"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-dark">
                Wachtwoord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-light px-3 py-2 text-gray-dark placeholder-gray-500 focus:border-bordeaux focus:outline-none focus:ring-bordeaux sm:text-sm"
                placeholder="Minimaal 8 karakters"
                minLength={8}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-bordeaux px-4 py-2 text-sm font-medium text-white hover:bg-bordeaux-hover focus:outline-none focus:ring-2 focus:ring-bordeaux focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Account aanmaken...' : 'Start gratis trial'}
            </button>
          </div>

          <p className="text-center text-xs text-gray-500">
            Door je aan te melden ga je akkoord met onze{' '}
            <Link href="/terms" className="text-bordeaux hover:text-bordeaux-hover">
              algemene voorwaarden
            </Link>{' '}
            en{' '}
            <Link href="/privacy" className="text-bordeaux hover:text-bordeaux-hover">
              privacybeleid
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}