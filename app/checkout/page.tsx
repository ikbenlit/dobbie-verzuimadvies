'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/landing/Header';
import FooterNew from '@/components/landing/FooterNew';
import { getBasePrice } from '@/lib/payment/pricing';
import type { PlanType, BillingPeriod } from '@/lib/payment/types';
import { CreditCard, Check, X, Loader2, Tag } from 'lucide-react';
import PriceDisplay from '@/components/checkout/PriceDisplay';
import ContractInfo from '@/components/checkout/ContractInfo';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();
  
  // Haal query parameters op (plan, billing, coupon)
  const planParam = searchParams.get('plan') as PlanType | null;
  const billingParam = searchParams.get('billing') as BillingPeriod | null;
  const couponParam = searchParams.get('coupon') || null;
  
  // State voor plan en billing
  const [plan, setPlan] = useState<PlanType>(planParam || 'solo');
  const [billing, setBilling] = useState<BillingPeriod>(billingParam || 'yearly');
  
  // State voor kortingscode
  const [discountCode, setDiscountCode] = useState<string>(couponParam || '');
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    type: 'percentage' | 'amount';
    value: number;
    discountAmount: number;
    originalPrice: number;
    finalPrice: number;
  } | null>(null);
  const [validating, setValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // State voor payment creation
  const [creatingPayment, setCreatingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  // E3.S1 & E3.S2: Auth check bij mount - redirect naar login als niet ingelogd
  useEffect(() => {
    const checkAuth = async () => {
      // Wacht kort bij nieuwe users zodat session cookies kunnen laden
      const isNewUser = searchParams.get('new') === 'true';
      if (isNewUser) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Behoud alle query parameters bij redirect
        const checkoutParams = new URLSearchParams();
        checkoutParams.set('plan', plan);
        checkoutParams.set('billing', billing);
        if (discountCode) {
          checkoutParams.set('coupon', discountCode);
        }
        if (searchParams.get('new')) {
          checkoutParams.set('new', 'true');
        }
        if (searchParams.get('renew')) {
          checkoutParams.set('renew', 'true');
        }

        // Build login redirect URL
        const loginParams = new URLSearchParams();
        loginParams.set('redirect', `/checkout?${checkoutParams.toString()}`);
        router.push(`/login?${loginParams.toString()}`);
      }
    };
    checkAuth();
  }, [plan, billing, discountCode, searchParams, router, supabase]);
  
  // Update URL wanneer plan of billing verandert
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('plan', plan);
    params.set('billing', billing);
    if (discountCode) {
      params.set('coupon', discountCode);
    }
    router.replace(`/checkout?${params.toString()}`, { scroll: false });
  }, [plan, billing, discountCode, router]);
  
  // Valideer kortingscode functie
  const validateDiscount = useCallback(async (code: string, currentPlan: PlanType, currentBilling: BillingPeriod) => {
    if (!code.trim()) {
      setAppliedDiscount(null);
      setValidationError(null);
      return;
    }
    
    setValidating(true);
    setValidationError(null);
    
    try {
      const response = await fetch('/api/payment/validate-discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          plan: currentPlan,
          billing: currentBilling,
        }),
      });
      
      const data = await response.json();
      
      if (data.valid && data.discount) {
        setAppliedDiscount(data.discount);
        setValidationError(null);
      } else {
        setAppliedDiscount(null);
        setValidationError(data.error || 'Kortingscode is ongeldig');
      }
    } catch (error) {
      console.error('Error validating discount code:', error);
      setAppliedDiscount(null);
      setValidationError('Er ging iets mis bij het valideren van de code');
    } finally {
      setValidating(false);
    }
  }, []);
  
  // Handle button click
  const handleValidateDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    if (code) {
      setDiscountCode(code);
      validateDiscount(code, plan, billing);
    }
  };
  
  // Auto-validate wanneer code wordt ingevoerd (met debounce)
  useEffect(() => {
    const code = discountCode.trim().toUpperCase();
    
    if (!code) {
      setAppliedDiscount(null);
      setValidationError(null);
      return;
    }
    
    const timeoutId = setTimeout(() => {
      validateDiscount(code, plan, billing);
    }, 500); // Debounce 500ms
    
    return () => clearTimeout(timeoutId);
  }, [discountCode, plan, billing, validateDiscount]);
  
  // Pre-fill en valideer coupon uit URL bij mount
  useEffect(() => {
    if (couponParam) {
      setDiscountCode(couponParam.toUpperCase());
      // Validatie gebeurt automatisch via bovenstaande useEffect
    }
  }, [couponParam]);
  
  // Bereken basisprijs
  const basePrice = getBasePrice(plan, billing);
  const finalPrice = appliedDiscount ? appliedDiscount.finalPrice : basePrice;
  const discountAmount = appliedDiscount ? appliedDiscount.discountAmount : 0;
  
  // Handle payment creation
  const handleCreatePayment = useCallback(async () => {
    setCreatingPayment(true);
    setPaymentError(null);
    
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          billing,
          discountCode: appliedDiscount?.code || null,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Er ging iets mis bij het aanmaken van de betaling');
      }
      
      if (data.paymentUrl) {
        // Redirect naar Mollie payment pagina
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('Geen payment URL ontvangen');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      setPaymentError(
        error instanceof Error 
          ? error.message 
          : 'Er ging iets mis bij het aanmaken van de betaling. Probeer het later opnieuw.'
      );
      setCreatingPayment(false);
    }
  }, [plan, billing, appliedDiscount]);
  
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
                    className={`flex-1 p-4 rounded-full border-2 transition-all font-semibold ${
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
                    className={`flex-1 p-4 rounded-full border-2 transition-all font-semibold ${
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
              
              {/* Kortingscode Input */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="font-serif text-2xl font-bold text-bordeaux-hover mb-4">
                  Kortingscode (optioneel)
                </h2>
                
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase().trim();
                          setDiscountCode(value);
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleValidateDiscount();
                          }
                        }}
                        placeholder="Voer kortingscode in"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          validationError
                            ? 'border-red-500 focus:ring-red-500/20'
                            : appliedDiscount
                            ? 'border-green-500 focus:ring-green-500/20'
                            : 'border-gray-300 focus:ring-bordeaux/20 focus:border-bordeaux'
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleValidateDiscount}
                      disabled={validating || !discountCode.trim()}
                      className="px-6 py-3 bg-bordeaux text-white rounded-full font-semibold hover:bg-bordeaux-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {validating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="hidden sm:inline">Valideren...</span>
                        </>
                      ) : (
                        'Toepassen'
                      )}
                    </button>
                  </div>
                  
                  {/* Feedback messages */}
                  {appliedDiscount && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                      <Check className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">
                        Korting van €{appliedDiscount.discountAmount.toFixed(2)} toegepast! ({appliedDiscount.code})
                      </span>
                    </div>
                  )}
                  
                  {validationError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                      <X className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{validationError}</span>
                    </div>
                  )}
                  
                  {appliedDiscount && (
                    <button
                      type="button"
                      onClick={() => {
                        setDiscountCode('');
                        setAppliedDiscount(null);
                        setValidationError(null);
                      }}
                      className="text-sm text-bordeaux-hover hover:underline"
                    >
                      Kortingscode verwijderen
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Rechts: Prijs Overzicht */}
            <div className="space-y-6">
              {/* E5.S1: Contract Info Display */}
              <ContractInfo billing={billing} />
              
              <PriceDisplay
                plan={plan}
                billing={billing}
                basePrice={basePrice}
                finalPrice={finalPrice}
                discountAmount={discountAmount}
                discountCode={appliedDiscount?.code}
              />
              
              {/* Betaal knop */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleCreatePayment}
                  disabled={creatingPayment}
                  className="w-full bg-bordeaux text-white py-4 px-6 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-bordeaux-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {creatingPayment ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Betaling aanmaken...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Betaal met Mollie
                    </>
                  )}
                </button>
                
                {paymentError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <X className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{paymentError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <FooterNew />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-bordeaux/5 via-gold/5 to-teal/5">
        <Header />
        <main className="flex-grow pt-32 pb-20">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-brand-text">Laden...</p>
            </div>
          </div>
        </main>
        <FooterNew />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

