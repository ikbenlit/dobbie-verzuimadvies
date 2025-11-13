# 💳 Mollie Payment Integratie - Implementatieplan

**Datum:** 10 november 2025  
**Context:** Betaalpagina met kortingscode functionaliteit  
**Prioriteit:** 🔴 Kritiek (voor 20 november deadline)

---

## 🎯 Overzicht

Implementatie van Mollie payment integratie met:
- **Universele betaalpagina** (`/checkout`) waar gebruikers kunnen betalen
- **Kortingscode functionaliteit** - zonder code = standaardprijs, met code = kortingsprijs
- **Toegankelijk vanuit:**
  - Homepage/landingspagina (CTA knoppen)
  - Salespagina webinar (met pre-filled kortingscode)
  - Direct via URL met query parameters

---

## 📊 Architectuur Beslissing

### Optie 1: Universele Betaalpagina (Aanbevolen) ✅

**Voordelen:**
- Eén centrale pagina voor alle betalingen
- Eenvoudig onderhoud
- Kortingscode kan altijd worden ingevuld
- Flexibel voor toekomstige uitbreidingen

**Structuur:**
```
/checkout
  ?plan=solo|team
  &billing=monthly|yearly
  &coupon=NVVA2025 (optioneel)
```

**Flow:**
1. Gebruiker klikt op CTA knop (homepage/salespagina)
2. Redirect naar `/checkout` met query parameters
3. Pagina toont geselecteerde plan + prijs
4. Kortingscode veld (optioneel, kan worden ingevuld)
5. Prijs update real-time bij kortingscode
6. Mollie payment flow
7. Success/cancel redirect

---

## 🏗️ Implementatie Structuur

### Fase 1: Mollie Setup & Dependencies
**Tijd:** 30-45 min

**Acties:**
1. Mollie package installeren
2. Environment variables toevoegen
3. Mollie client configureren
4. Type definities maken

**Bestanden:**
- `package.json` (dependency toevoegen)
- `.env` (MOLLIE_API_KEY)
- `src/lib/mollie/client.ts` (nieuw)
- `src/types/payment.ts` (nieuw)

---

### Fase 2: Kortingscode Systeem
**Tijd:** 1-1.5 uur

**Acties:**
1. Kortingscode database tabel maken
2. Kortingscode validatie logica
3. Prijsberekening met korting
4. API endpoint voor kortingscode validatie

**Database Schema:**
```sql
CREATE TABLE coupon_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL, -- 'percentage' of 'fixed'
  discount_value NUMERIC NOT NULL,
  plan_type TEXT, -- 'solo', 'team', of NULL (alle plannen)
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  max_uses INTEGER, -- NULL = unlimited
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index voor snelle lookups
CREATE INDEX idx_coupon_codes_code ON coupon_codes(code) WHERE is_active = true;
```

**Kortingscodes:**
- `NVVA2025`: 
  - Solo yearly: €149 (was €349)
  - Team yearly: €99/account (was €269)
  - Geldig tot: 30 november 2025 23:59u

**Bestanden:**
- Database migration: `src/lib/supabase/migrations/YYYYMMDD_create_coupon_codes.sql`
- `src/lib/payment/coupon.ts` (nieuw)
- `app/api/payment/validate-coupon/route.ts` (nieuw)

---

### Fase 3: Betaalpagina Component
**Tijd:** 2-2.5 uur

**Acties:**
1. Checkout pagina maken (`/checkout`)
2. Plan selectie UI
3. Billing period toggle (monthly/yearly)
4. Kortingscode input veld
5. Real-time prijs update
6. Mollie payment button

**Bestanden:**
- `app/checkout/page.tsx` (nieuw)
- `src/components/checkout/CheckoutForm.tsx` (nieuw)
- `src/components/checkout/CouponInput.tsx` (nieuw)
- `src/components/checkout/PriceDisplay.tsx` (nieuw)
- `src/content/nl/checkout.json` (nieuw)

**UI Flow:**
```
┌─────────────────────────────────┐
│  Plan Selectie                  │
│  [Solo] [Team]                  │
├─────────────────────────────────┤
│  Billing Period                 │
│  ( ) Monthly  (•) Yearly        │
├─────────────────────────────────┤
│  Kortingscode (optioneel)       │
│  [NVVA2025] [Toepassen]        │
├─────────────────────────────────┤
│  Prijs Overzicht                │
│  Plan: Solo Yearly              │
│  Prijs: €349                    │
│  Korting: -€200 (NVVA2025)      │
│  ─────────────────────          │
│  Totaal: €149                   │
├─────────────────────────────────┤
│  [Betaal met Mollie]            │
└─────────────────────────────────┘
```

---

### Fase 4: Payment API Endpoints
**Tijd:** 1.5-2 uur

**Acties:**
1. Payment creation endpoint
2. Payment status check endpoint
3. Success/cancel redirect handlers

**Bestanden:**
- `app/api/payment/create/route.ts` (nieuw)
- `app/api/payment/status/route.ts` (nieuw)
- `app/checkout/success/page.tsx` (nieuw)
- `app/checkout/cancel/page.tsx` (nieuw)

**Payment Creation Flow:**
```typescript
// 1. Valideer kortingscode (indien aanwezig)
// 2. Bereken finale prijs
// 3. Maak Mollie payment
// 4. Sla payment referentie op in database
// 5. Return payment URL voor redirect
```

---

### Fase 5: Database Integration
**Tijd:** 1 uur

**Acties:**
1. Payment tracking tabel
2. Link payment aan user profile
3. Update subscription status na betaling

**Database Schema:**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  mollie_payment_id TEXT UNIQUE NOT NULL,
  plan_type TEXT NOT NULL, -- 'solo' of 'team'
  billing_period TEXT NOT NULL, -- 'monthly' of 'yearly'
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'EUR',
  coupon_code TEXT REFERENCES coupon_codes(code),
  discount_amount NUMERIC DEFAULT 0,
  status TEXT NOT NULL, -- 'pending', 'paid', 'failed', 'canceled'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_profile_id ON payments(profile_id);
CREATE INDEX idx_payments_mollie_id ON payments(mollie_payment_id);
CREATE INDEX idx_payments_status ON payments(status);
```

**Bestanden:**
- Database migration: `src/lib/supabase/migrations/YYYYMMDD_create_payments.sql`
- `src/lib/payment/database.ts` (nieuw)

---

### Fase 6: Webhook Handler
**Tijd:** 1-1.5 uur

**Acties:**
1. Mollie webhook endpoint
2. Payment status updates verwerken
3. Subscription activatie na betaling
4. Email notificaties (optioneel)

**Bestanden:**
- `app/api/webhooks/mollie/route.ts` (nieuw)
- `src/lib/payment/webhook.ts` (nieuw)

**Webhook Events:**
- `payment.paid` → Activate subscription, update profile
- `payment.failed` → Log failure, notify user
- `payment.canceled` → Update status

---

### Fase 7: Integration & Testing
**Tijd:** 1-1.5 uur

**Acties:**
1. Link homepage CTA knoppen naar checkout
2. Link salespagina naar checkout met pre-filled coupon
3. Test payment flow end-to-end
4. Test kortingscode validatie
5. Test verschillende scenarios

**Bestanden:**
- `src/components/landing/PricingNew.tsx` (CTA links aanpassen)
- `app/webinar/page.tsx` (CTA links aanpassen)

---

## 📋 Gedetailleerde Implementatie

### 1. Mollie Package Installatie

```bash
pnpm add @mollie/api-client
```

### 2. Environment Variables

```env
# Mollie Configuration
MOLLIE_API_KEY=test_dHar4XY7LxsDOtmnkVtjNVWXLSlXsM  # Test key voor development
MOLLIE_WEBHOOK_SECRET=whsec_...  # Voor webhook verificatie
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Voor redirect URLs
```

### 3. Mollie Client Setup

```typescript
// src/lib/mollie/client.ts
import { createMollieClient } from '@mollie/api-client';

if (!process.env.MOLLIE_API_KEY) {
  throw new Error('MOLLIE_API_KEY is not set');
}

export const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY,
});
```

### 4. Kortingscode Validatie

```typescript
// src/lib/payment/coupon.ts
export interface CouponValidation {
  valid: boolean;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  planType?: 'solo' | 'team';
  validUntil?: Date;
  error?: string;
}

export async function validateCoupon(
  code: string,
  planType: 'solo' | 'team',
  billingPeriod: 'monthly' | 'yearly'
): Promise<CouponValidation> {
  // Database query naar coupon_codes tabel
  // Check validiteit, plan type, expiry date
  // Return validation result
}
```

### 5. Prijsberekening

```typescript
// src/lib/payment/pricing.ts
export interface PricingCalculation {
  basePrice: number;
  discountAmount: number;
  finalPrice: number;
  couponCode?: string;
}

export function calculatePrice(
  planType: 'solo' | 'team',
  billingPeriod: 'monthly' | 'yearly',
  coupon?: CouponValidation
): PricingCalculation {
  // Base pricing
  const basePrices = {
    solo: { monthly: 49, yearly: 349 },
    team: { monthly: 39, yearly: 269 },
  };
  
  const basePrice = basePrices[planType][billingPeriod];
  
  // Apply coupon discount
  let discountAmount = 0;
  if (coupon?.valid) {
    if (coupon.discountType === 'percentage') {
      discountAmount = (basePrice * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }
  }
  
  return {
    basePrice,
    discountAmount,
    finalPrice: basePrice - discountAmount,
    couponCode: coupon?.code,
  };
}
```

### 6. Payment Creation

```typescript
// app/api/payment/create/route.ts
export async function POST(request: NextRequest) {
  const { planType, billingPeriod, couponCode, userId } = await request.json();
  
  // 1. Validate coupon if provided
  let coupon: CouponValidation | undefined;
  if (couponCode) {
    coupon = await validateCoupon(couponCode, planType, billingPeriod);
    if (!coupon.valid) {
      return NextResponse.json({ error: coupon.error }, { status: 400 });
    }
  }
  
  // 2. Calculate final price
  const pricing = calculatePrice(planType, billingPeriod, coupon);
  
  // 3. Create Mollie payment
  const payment = await mollieClient.payments.create({
    amount: {
      currency: 'EUR',
      value: pricing.finalPrice.toFixed(2),
    },
    description: `DOBbie ${planType} - ${billingPeriod}`,
    redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
    cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
    metadata: {
      planType,
      billingPeriod,
      couponCode: coupon?.code,
      userId,
    },
  });
  
  // 4. Save payment to database
  await savePayment({
    profileId: userId,
    molliePaymentId: payment.id,
    planType,
    billingPeriod,
    amount: pricing.finalPrice,
    couponCode: coupon?.code,
    discountAmount: pricing.discountAmount,
    status: 'pending',
  });
  
  // 5. Return payment URL
  return NextResponse.json({
    paymentUrl: payment.getCheckoutUrl(),
    paymentId: payment.id,
  });
}
```

---

## 🔗 Integratie Punten

### Homepage CTA Knoppen

**Huidige situatie:** Knoppen linken naar `/register`  
**Nieuwe situatie:** Knoppen linken naar `/checkout` met query parameters

**Voorbeelden:**
- Solo yearly: `/checkout?plan=solo&billing=yearly`
- Team yearly: `/checkout?plan=team&billing=yearly`
- Met kortingscode: `/checkout?plan=solo&billing=yearly&coupon=NVVA2025`

**Bestanden aanpassen:**
- `src/components/landing/PricingNew.tsx`
- `src/content/nl/pricing.json` (ctaLink aanpassen)

---

### Salespagina Webinar

**CTA knoppen:** Linken naar `/checkout` met pre-filled kortingscode

**Voorbeeld:**
- `/checkout?plan=solo&billing=yearly&coupon=NVVA2025`
- `/checkout?plan=team&billing=yearly&coupon=NVVA2025`

**Bestand:** `app/webinar/page.tsx` (CTA links)

---

## 📊 Tijdsschatting

| Fase | Tijd | Prioriteit |
|------|------|------------|
| Fase 1: Mollie Setup | 30-45 min | 🔴 Kritiek |
| Fase 2: Kortingscode Systeem | 1-1.5 uur | 🔴 Kritiek |
| Fase 3: Betaalpagina | 2-2.5 uur | 🔴 Kritiek |
| Fase 4: Payment API | 1.5-2 uur | 🔴 Kritiek |
| Fase 5: Database Integration | 1 uur | 🔴 Kritiek |
| Fase 6: Webhook Handler | 1-1.5 uur | 🔴 Kritiek |
| Fase 7: Integration & Testing | 1-1.5 uur | 🔴 Kritiek |
| **TOTAAL** | **8.5-11 uur** | |

---

## ✅ Acceptance Criteria

- [ ] Mollie package geïnstalleerd en geconfigureerd
- [ ] Kortingscode database tabel aangemaakt
- [ ] NVVA2025 kortingscode toegevoegd aan database
- [ ] Betaalpagina `/checkout` werkt met plan selectie
- [ ] Kortingscode kan worden ingevuld en gevalideerd
- [ ] Prijs update real-time bij kortingscode
- [ ] Mollie payment flow werkt end-to-end
- [ ] Payment wordt opgeslagen in database
- [ ] Webhook handler verwerkt payment updates
- [ ] Homepage CTA knoppen linken naar checkout
- [ ] Salespagina CTA knoppen linken naar checkout met coupon
- [ ] Success/cancel pagina's werken
- [ ] Subscription wordt geactiveerd na betaling

---

## 🚨 Kritieke Beslissingen

1. **Pricing Database vs Hardcoded:**
   - Optie A: Hardcoded in code (snel, minder flexibel)
   - Optie B: Database tabel (flexibel, meer setup)
   - **Aanbeveling:** Start met hardcoded, migreer later naar database

2. **Kortingscode Type:**
   - Percentage korting vs vaste korting
   - **Aanbeveling:** Start met vaste korting (eenvoudiger), voeg percentage later toe

3. **Payment Flow:**
   - Direct betalen vs eerst registreren
   - **Aanbeveling:** Eerst registreren, dan betalen (beter voor user tracking)

---

## 📝 Volgende Stappen

1. **Start met Fase 1:** Mollie setup en dependencies
2. **Dan Fase 2:** Kortingscode systeem (kritiek voor salespagina)
3. **Dan Fase 3:** Betaalpagina UI
4. **Dan Fase 4-6:** Backend integratie
5. **Laatste:** Integration en testing

---

**Laatste Update:** 10 november 2025  
**Status:** 🔴 Klaar voor implementatie

