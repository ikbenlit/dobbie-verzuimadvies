'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/landing/Header';
import FooterNew from '@/components/landing/FooterNew';
import { CheckCircle, Loader2, XCircle, ArrowRight } from 'lucide-react';

interface PaymentData {
  id: string;
  status: string;
  amount: number;
  currency: string;
  description: string;
  metadata?: {
    userId?: string;
    plan?: string;
    billing?: string;
    discountCode?: string;
    discountAmount?: string;
    originalPrice?: string;
    finalPrice?: string;
  };
  paidAt?: string | null;
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentId = searchParams.get('payment_id') || searchParams.get('paymentId');
  
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentId) {
      setError('Geen payment ID gevonden in de URL');
      setLoading(false);
      return;
    }

    // Haal payment status op
    const fetchPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/payment/status?paymentId=${paymentId}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Kon payment status niet ophalen');
        }

        setPayment(data.payment);
      } catch (err) {
        console.error('Error fetching payment status:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Er ging iets mis bij het ophalen van de betalingsinformatie'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [paymentId]);

  // Format plan naam
  const getPlanName = (plan?: string, billing?: string) => {
    if (!plan || !billing) return 'Abonnement';
    
    const planName = plan === 'solo' ? 'Solo' : 'Team';
    const billingName = billing === 'monthly' ? 'Maandelijks' : 'Jaarlijks';
    return `${planName} ${billingName}`;
  };

  // Format prijs
  const formatPrice = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  // Check of payment succesvol is
  const isPaymentSuccessful = payment?.status === 'paid';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bordeaux/5 via-gold/5 to-teal/5">
      <Header />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto max-w-2xl px-4">
          {loading && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Loader2 className="w-16 h-16 text-bordeaux mx-auto mb-4 animate-spin" />
              <h2 className="font-serif text-2xl font-bold text-bordeaux-hover mb-2">
                Betaling verwerken...
              </h2>
              <p className="text-brand-text">
                Even geduld, we controleren je betaling.
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="font-serif text-2xl font-bold text-bordeaux-hover mb-2">
                Oeps, er ging iets mis
              </h2>
              <p className="text-brand-text mb-6">{error}</p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/checkout"
                  className="px-6 py-3 bg-bordeaux text-white rounded-lg font-semibold hover:bg-bordeaux-hover transition-colors"
                >
                  Terug naar checkout
                </Link>
                <Link
                  href="/chat"
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Naar dashboard
                </Link>
              </div>
            </div>
          )}

          {payment && !loading && !error && (
            <div className="space-y-6">
              {/* Success Header */}
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                {isPaymentSuccessful ? (
                  <>
                    <div className="mb-6">
                      <div className="relative inline-block">
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
                        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                      </div>
                    </div>
                    <h1 className="font-serif text-4xl font-bold text-bordeaux-hover mb-2">
                      Betaling succesvol!
                    </h1>
                    <p className="text-lg text-brand-text">
                      Je betaling is verwerkt en je abonnement is geactiveerd.
                    </p>
                  </>
                ) : (
                  <>
                    <XCircle className="w-20 h-20 text-orange-500 mx-auto mb-4" />
                    <h1 className="font-serif text-4xl font-bold text-bordeaux-hover mb-2">
                      Betaling in behandeling
                    </h1>
                    <p className="text-lg text-brand-text">
                      Je betaling heeft status: <strong>{payment.status}</strong>
                    </p>
                  </>
                )}
              </div>

              {/* Payment Details */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="font-serif text-2xl font-bold text-bordeaux-hover mb-6">
                  Betalingsdetails
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-brand-text font-medium">Abonnement</span>
                    <span className="text-bordeaux-hover font-semibold">
                      {getPlanName(payment.metadata?.plan, payment.metadata?.billing)}
                    </span>
                  </div>

                  {payment.metadata?.originalPrice && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-brand-text font-medium">Originele prijs</span>
                    <span className="text-gray-700">
                      {formatPrice(parseFloat(payment.metadata.originalPrice))}
                    </span>
                  </div>
                  )}

                  {payment.metadata?.discountCode && payment.metadata?.discountAmount && (
                    <>
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-brand-text font-medium">
                          Korting ({payment.metadata.discountCode})
                        </span>
                        <span className="text-green-600 font-semibold">
                          -{formatPrice(parseFloat(payment.metadata.discountAmount))}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between items-center py-3 border-b-2 border-bordeaux">
                    <span className="text-brand-text font-semibold text-lg">Betaald bedrag</span>
                    <span className="text-bordeaux-hover font-bold text-xl">
                      {formatPrice(payment.amount, payment.currency)}
                    </span>
                  </div>

                  {payment.paidAt && (
                    <div className="flex justify-between items-center py-3">
                      <span className="text-brand-text font-medium">Betaald op</span>
                      <span className="text-gray-700">
                        {new Date(payment.paidAt).toLocaleDateString('nl-NL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-3">
                    <span className="text-brand-text font-medium">Payment ID</span>
                    <span className="text-gray-500 text-sm font-mono">
                      {payment.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              {isPaymentSuccessful && (
                <div className="bg-gradient-to-r from-bordeaux/10 to-teal/10 rounded-lg p-8 border border-bordeaux/20">
                  <h3 className="font-serif text-xl font-bold text-bordeaux-hover mb-4">
                    Wat nu?
                  </h3>
                  <ul className="space-y-3 text-brand-text mb-6">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Je abonnement is geactiveerd</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Je hebt nu volledige toegang tot DOBbie</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Je ontvangt een bevestigingsmail met alle details</span>
                    </li>
                  </ul>
                  
                  <Link
                    href="/chat"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-bordeaux text-white rounded-lg font-semibold hover:bg-bordeaux-hover transition-colors shadow-md hover:shadow-lg"
                  >
                    Start met DOBbie
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              )}

              {/* Help Section */}
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-brand-text mb-4">
                  Vragen over je betaling of abonnement?
                </p>
                <Link
                  href="/contact"
                  className="text-bordeaux-hover hover:underline font-medium"
                >
                  Neem contact met ons op
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <FooterNew />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-bordeaux/5 via-gold/5 to-teal/5">
        <Header />
        <main className="flex-grow pt-32 pb-20">
          <div className="container mx-auto max-w-2xl px-4">
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Loader2 className="w-16 h-16 text-bordeaux mx-auto mb-4 animate-spin" />
              <p className="text-brand-text">Laden...</p>
            </div>
          </div>
        </main>
        <FooterNew />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

