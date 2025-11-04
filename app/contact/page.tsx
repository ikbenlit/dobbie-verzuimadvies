'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/landing/Header';
import FooterNew from '@/components/landing/FooterNew';

export default function ContactPage() {
  const router = useRouter();
  const [subject, setSubject] = useState('Vraag over DoBbie');
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bordeaux/5 via-gold/5 to-teal/5">
      <Header />

      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto max-w-2xl px-4">
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
            <h1 className="font-serif text-4xl font-bold tracking-tight text-bordeaux-hover">
              Klaar voor de volgende stap?
            </h1>
            {isExpired ? (
              <p className="mt-3 text-lg text-brand-text">
                Je proefperiode is verlopen. Vul het formulier in om je account te reactiveren en
                toegang te krijgen tot DoBbie Pro.
              </p>
            ) : (
              <p className="mt-3 text-lg text-brand-text">
                Laat ons weten dat je geïnteresseerd bent in een DoBbie Pro abonnement. We nemen zo
                snel mogelijk contact met je op.
              </p>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl bg-white p-8 shadow-xl border border-gold/20"
          >
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-brand-dark mb-2">
                Onderwerp
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-brand-dark shadow-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-brand-dark mb-2">
                Bericht
              </label>
              <div className="mt-1">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-brand-dark shadow-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all"
                  placeholder="Vertel ons over je ervaring met DoBbie en je wensen..."
                  required
                />
              </div>
            </div>

            {success && (
              <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-600"
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
                    <p className="text-sm font-medium text-green-800">
                      Bericht succesvol verzonden!
                    </p>
                    <p className="mt-1 text-sm text-green-700">
                      We nemen zo snel mogelijk contact met je op.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl border border-transparent bg-gradient-to-r from-bordeaux to-bordeaux-hover hover:from-bordeaux-hover hover:to-bordeaux px-8 py-3 text-base font-bold text-white focus:outline-none focus:ring-2 focus:ring-bordeaux focus:ring-offset-2 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300"
              >
                {loading ? 'Bezig...' : 'Verstuur Bericht'}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center text-sm text-brand-text">
            <p className="mb-1">Je kunt ook direct contact opnemen:</p>
            <a href="mailto:talar@dobbie.nl" className="font-semibold text-teal hover:text-teal-dark transition-colors">
              talar@dobbie.nl
            </a>
          </div>
        </div>
      </main>

      <FooterNew />
    </div>
  );
}
