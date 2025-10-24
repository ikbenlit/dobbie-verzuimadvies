'use client';

import { useState } from 'react';
import Link from 'next/link';

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

      setMessage(data.message);
      setEmail('');
    } catch (err) {
      setError('Er is een fout opgetreden. Probeer het later opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-bordeaux">
            Wachtwoord vergeten
          </h2>
          <p className="mt-2 text-center text-sm text-gray-dark">
            Voer je e-mailadres in en we sturen je een link om je wachtwoord te resetten.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {message && (
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-800">{message}</p>
            </div>
          )}

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
              placeholder="jouw@email.nl"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-bordeaux px-4 py-2 text-sm font-medium text-white hover:bg-bordeaux-hover focus:outline-none focus:ring-2 focus:ring-bordeaux focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Bezig...' : 'Verstuur reset link'}
            </button>
          </div>

          <div className="text-center text-sm">
            <Link
              href="/login"
              className="font-medium text-bordeaux hover:text-bordeaux-hover"
            >
              Terug naar inloggen
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
