'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/landing/Header';
import FooterNew from '@/components/landing/FooterNew';
import { getBasePrice } from '@/lib/payment/pricing';
import type { PlanType, BillingPeriod } from '@/lib/payment/types';
import { CreditCard, Check } from 'lucide-react';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Haal query parameters op (plan, billing, coupon)
  const planParam = searchParams.get('plan') as PlanType | null;
  const billingParam = searchParams.get('billing') as BillingPeriod | null;
  const couponParam = searchParams.get('coupon') || null;
  
  // State voor plan en billing
  const [plan, setPlan] = useState<PlanType>(planParam || 'solo');
  const [billing, setBilling] = useState<BillingPeriod>(billingParam || 'yearly');
  
  // Update URL wanneer plan of billing verandert
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('plan', plan);
    params.set('billing', billing);
    if (couponParam) {
      params.set('coupon', couponParam);
    }
    router.replace(`/checkout?${params.toString()}`, { scroll: false });
  }, [plan, billing, couponParam, router]);
  
  // Bereken basisprijs
  const basePrice = getBasePrice(plan, billing);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bordeaux/5 via-gold/5 to-teal/5">
      <Header />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-bordeaux-hover mb-2">
              Kies je abonnement
            </h1>
            <p className="text-lg text-brand-text">
              Selecteer je plan en betaal veilig via Mollie
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Links: Plan Selectie */}
            <div className="space-y-6">
              {/* Plan Selectie */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="font-serif text-2xl font-bold text-bordeaux-hover mb-4">
                  Plan Selectie
                </h2>
                
                <div className="space-y-3">
                  {/* Solo Plan */}
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-cream/50"
                    style={{
                      borderColor: plan === 'solo' ? '#771138' : '#D1D5DB',
                      backgroundColor: plan === 'solo' ? '#F5F0E8' : 'transparent',
                    }}>
                    <input
                      type="radio"
                      name="plan"
                      value="solo"
                      checked={plan === 'solo'}
                      onChange={(e) => setPlan(e.target.value as PlanType)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-lg text-bordeaux-hover">Solo</div>
                          <div className="text-sm text-brand-text">Voor individuele professionals</div>
                        </div>
                        {plan === 'solo' && (
                          <Check className="w-5 h-5 text-bordeaux" />
                        )}
                      </div>
                    </div>
                  </label>
                  
                  {/* Team Plan */}
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-cream/50"
                    style={{
                      borderColor: plan === 'team' ? '#771138' : '#D1D5DB',
                      backgroundColor: plan === 'team' ? '#F5F0E8' : 'transparent',
                    }}>
                    <input
                      type="radio"
                      name="plan"
                      value="team"
                      checked={plan === 'team'}
                      onChange={(e) => setPlan(e.target.value as PlanType)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-lg text-bordeaux-hover">Team</div>
                          <div className="text-sm text-brand-text">Voor teams vanaf 2 gebruikers</div>
                        </div>
                        {plan === 'team' && (
                          <Check className="w-5 h-5 text-bordeaux" />
                        )}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              
              {/* Billing Period Toggle */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="font-serif text-2xl font-bold text-bordeaux-hover mb-4">
                  Betaalperiode
                </h2>
                
                <div className="flex gap-4">
                  {/* Monthly */}
                  <button
                    type="button"
                    onClick={() => setBilling('monthly')}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all font-semibold ${
                      billing === 'monthly'
                        ? 'border-bordeaux bg-bordeaux text-white'
                        : 'border-gray-300 bg-white text-bordeaux-hover hover:bg-cream'
                    }`}
                  >
                    Maandelijks
                  </button>
                  
                  {/* Yearly */}
                  <button
                    type="button"
                    onClick={() => setBilling('yearly')}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all font-semibold ${
                      billing === 'yearly'
                        ? 'border-bordeaux bg-bordeaux text-white'
                        : 'border-gray-300 bg-white text-bordeaux-hover hover:bg-cream'
                    }`}
                  >
                    Jaarlijks
                    <span className="block text-xs font-normal mt-1 opacity-90">
                      (Bespaar meer)
                    </span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Rechts: Prijs Overzicht (placeholder voor E4.S3) */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-serif text-2xl font-bold text-bordeaux-hover mb-4">
                Prijs Overzicht
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-brand-text">Plan:</span>
                  <span className="font-semibold text-bordeaux-hover">
                    {plan === 'solo' ? 'Solo' : 'Team'} {billing === 'monthly' ? 'Maandelijks' : 'Jaarlijks'}
                  </span>
                </div>
                
                <div className="flex justify-between text-lg">
                  <span className="text-brand-text">Prijs:</span>
                  <span className="font-semibold">€{basePrice.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-xl font-bold text-bordeaux-hover">
                    <span>Totaal:</span>
                    <span>€{basePrice.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Betaal knop (disabled voor nu, wordt geactiveerd in E5) */}
                <button
                  type="button"
                  disabled
                  className="w-full mt-6 bg-bordeaux text-white py-4 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-bordeaux-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-5 h-5" />
                  Betaal met Mollie
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <FooterNew />
    </div>
  );
}

