'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/landing/Header';
import FooterNew from '@/components/landing/FooterNew';
import { XCircle, ArrowRight, CreditCard, HelpCircle } from 'lucide-react';

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
}

function CheckoutCancelContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id') || searchParams.get('paymentId');
  
  const [loading, setLoading] = useState(!!paymentId);
  const [payment, setPayment] = useState<PaymentData | null>(null);

  useEffect(() => {
    if (!paymentId) {
      setLoading(false);
      return;
    }

    // Haal payment status op (optioneel, voor context)
    const fetchPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/payment/status?paymentId=${paymentId}`);
        const data = await response.json();

        if (response.ok && data.success && data.payment) {
          setPayment(data.payment);
        }
      } catch (err) {
        console.error('Error fetching payment status:', err);
        // Niet kritiek, gewoon doorgaan zonder payment data
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bordeaux/5 via-gold/5 to-teal/5">
      <Header />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="space-y-6">
            {/* Cancel Header */}
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="mb-6">
                <div className="relative inline-block">
                  <XCircle className="w-20 h-20 text-orange-500 mx-auto" />
                  <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-pulse"></div>
                </div>
              </div>
              <h1 className="font-serif text-4xl font-bold text-bordeaux-hover mb-2">
                Betaling geannuleerd
              </h1>
              <p className="text-lg text-brand-text">
                Je hebt de betaling geannuleerd. Geen zorgen, je kunt altijd opnieuw proberen.
              </p>
            </div>

            {/* Payment Info (als beschikbaar) */}
            {loading && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-brand-text">Betaling informatie ophalen...</p>
              </div>
            )}

            {payment && !loading && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="font-serif text-xl font-bold text-bordeaux-hover mb-4">
                  Betalingsdetails
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-brand-text font-medium">Abonnement</span>
                    <span className="text-bordeaux-hover font-semibold">
                      {getPlanName(payment.metadata?.plan, payment.metadata?.billing)}
                    </span>
                  </div>

                  {payment.metadata?.originalPrice && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-brand-text font-medium">Prijs</span>
                      <span className="text-gray-700">
                        {formatPrice(parseFloat(payment.metadata.originalPrice))}
                      </span>
                    </div>
                  )}

                  {payment.metadata?.discountCode && payment.metadata?.discountAmount && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-brand-text font-medium">
                        Korting ({payment.metadata.discountCode})
                      </span>
                      <span className="text-green-600 font-semibold">
                        -{formatPrice(parseFloat(payment.metadata.discountAmount))}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-2">
                    <span className="text-brand-text font-medium">Status</span>
                    <span className="text-orange-600 font-semibold capitalize">
                      {payment.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Helpful Information */}
            <div className="bg-gradient-to-r from-bordeaux/10 to-teal/10 rounded-lg p-8 border border-bordeaux/20">
              <h3 className="font-serif text-xl font-bold text-bordeaux-hover mb-4 flex items-center gap-2">
                <HelpCircle className="w-6 h-6" />
                Wat nu?
              </h3>
              <ul className="space-y-3 text-brand-text mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-bordeaux font-bold">•</span>
                  <span>Je betaling is niet verwerkt en er zijn geen kosten in rekening gebracht</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-bordeaux font-bold">•</span>
                  <span>Je kunt op elk moment opnieuw proberen te betalen</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-bordeaux font-bold">•</span>
                  <span>Je kortingscode blijft geldig (indien van toepassing)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-bordeaux font-bold">•</span>
                  <span>Heb je vragen? Neem gerust contact met ons op</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/checkout"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-bordeaux text-white rounded-lg font-semibold hover:bg-bordeaux-hover transition-colors shadow-md hover:shadow-lg"
              >
                <CreditCard className="w-5 h-5" />
                Opnieuw proberen
              </Link>
            </div>

            {/* Contact Section */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-brand-text mb-4">
                Had je problemen met de betaling of heb je vragen?
              </p>
              <Link
                href="/contact"
                className="text-bordeaux-hover hover:underline font-medium inline-flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                Neem contact met ons op
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <FooterNew />
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-bordeaux/5 via-gold/5 to-teal/5">
        <Header />
        <main className="flex-grow pt-32 pb-20">
          <div className="container mx-auto max-w-2xl px-4">
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-brand-text">Laden...</p>
            </div>
          </div>
        </main>
        <FooterNew />
      </div>
    }>
      <CheckoutCancelContent />
    </Suspense>
  );
}

