'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ContactPage() {
  const router = useRouter();
  const [subject, setSubject] = useState('Doorberekening DoBbie Abonnement');
  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'high'>('normal');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);

  // Check user status on mount
  useEffect(() => {
    const checkUserStatus = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email || '');

        // Get user profile to check subscription status
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_status')
          .eq('id', user.id)
          .single();

        const profileData = profile as any;
        if (profileData?.subscription_status === 'expired') {
          setIsExpired(true);
          setUrgency('high');
          setSubject('Mijn DoBbie account is verlopen, graag reactiveren');
        }
      }
    };

    checkUserStatus();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message, urgency }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Er is iets misgegaan');
        return;
      }

      setSuccess(true);
      setMessage('');
      setSubject('Doorberekening DoBbie Abonnement');
      setUrgency('normal');

      // Redirect to chat after 2 seconds
      setTimeout(() => {
        router.push('/chat');
      }, 2000);
    } catch (err) {
      console.error('Contact form error:', err);
      setError('Er is een fout opgetreden. Probeer het later opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bordeaux/10">
          <svg
            className="h-8 w-8 text-bordeaux"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-dark dark:text-white">
          Klaar voor de volgende stap?
        </h1>
        {isExpired ? (
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Je proefperiode is verlopen. Vul het formulier in om je account te reactiveren en
            toegang te krijgen tot DoBbie Pro.
          </p>
        ) : (
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Laat ons weten dat je geïnteresseerd bent in een DoBbie Pro abonnement. We nemen zo
            snel mogelijk contact met je op.
          </p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800"
      >
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-dark dark:text-gray-200">
            Onderwerp
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="subject"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="block w-full rounded-md border border-gray-light px-3 py-2 shadow-sm focus:border-bordeaux focus:outline-none focus:ring-bordeaux dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-400"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-dark dark:text-gray-200">
            Bericht
          </label>
          <div className="mt-1">
            <textarea
              id="message"
              name="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="block w-full rounded-md border border-gray-light px-3 py-2 shadow-sm focus:border-bordeaux focus:outline-none focus:ring-bordeaux dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-400"
              placeholder="Vertel ons over je ervaring met DoBbie en je wensen..."
              required
            />
          </div>
        </div>

        {success && (
          <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Bericht succesvol verzonden!
                </p>
                <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                  We nemen zo snel mogelijk contact met je op.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md border border-transparent bg-bordeaux px-4 py-2 text-sm font-medium text-white hover:bg-bordeaux-hover focus:outline-none focus:ring-2 focus:ring-bordeaux focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Bezig...' : 'Verstuur Bericht'}
          </button>
        </div>
      </form>

      <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Je kunt ook direct contact opnemen:</p>
        <p className="font-medium">talar@dobbie.nl</p>
      </div>
    </div>
  );
}
