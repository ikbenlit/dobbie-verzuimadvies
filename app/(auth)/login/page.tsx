'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useSupabaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/chat');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is iets misgegaan bij het inloggen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-bordeaux">
            Inloggen bij DoBbie
          </h2>
          <p className="mt-2 text-center text-sm text-gray-dark">
            Of{' '}
            <Link
              href="/register"
              className="font-medium text-bordeaux hover:text-bordeaux-hover"
            >
              maak een nieuw account aan
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
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
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-light px-3 py-2 text-gray-dark placeholder-gray-500 focus:z-10 focus:border-bordeaux focus:outline-none focus:ring-bordeaux sm:text-sm"
                placeholder="E-mailadres"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Wachtwoord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-light px-3 py-2 text-gray-dark placeholder-gray-500 focus:z-10 focus:border-bordeaux focus:outline-none focus:ring-bordeaux sm:text-sm"
                placeholder="Wachtwoord"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-bordeaux hover:text-bordeaux-hover"
              >
                Wachtwoord vergeten?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-bordeaux px-4 py-2 text-sm font-medium text-white hover:bg-bordeaux-hover focus:outline-none focus:ring-2 focus:ring-bordeaux focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Bezig met inloggen...' : 'Inloggen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}