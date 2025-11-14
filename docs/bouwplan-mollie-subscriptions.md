# 🚀 Mission Control — Bouwplan: Mollie Subscriptions

**Projectnaam:** DoBbie Bedrijfsarts - Mollie Recurring Subscriptions
**Versie:** v1.3
**Datum:** 13-11-2025
**Auteur:** Development Team

---

## 1. Doel en context

🎯 **Doel:** Ombouwen van het huidige one-time payment systeem naar een hybride subscription model met 12-maanden contracten, 14-dagen opt-out periode, en recurring SEPA payments voor maandelijkse abonnementen.

📘 **Toelichting:**
Het huidige systeem werkt met one-time iDEAL betalingen voor zowel maandelijkse als jaarlijkse abonnementen. Dit vereist handmatige verlenging en biedt geen automatische recurring payments. Het nieuwe systeem introduceert:

- **Maandelijks abonnement:** Eerste betaling via iDEAL → Mollie Subscription met automatische SEPA incasso
- **Jaarlijks abonnement:** One-time payment via iDEAL (blijft zoals nu)
- **Contract periode:** Altijd 12 maanden vast, daarna maand-tot-maand opzegbaar
- **Opt-out regeling:** 14 dagen bedenktijd met volledige refund mogelijk (manueel door support)

**Business Value:**
- Verbeterde cash flow door recurring payments
- Lagere churn door contractperiode
- Automatische verlengingen (minder handmatig werk)
- Wettelijk correcte opt-out regeling

**📋 Vereenvoudigde Aanpak:**
Dit bouwplan focust op **eenvoud en praktische implementatie**:
- ✅ **Must-Have:** Database migratie, payment flow splitsing, webhooks, contract info in checkout (~75 uur)
- 🟡 **Nice-to-Have:** Account subscription pagina kan later toegevoegd worden (~12 uur bespaard)
- ✅ **Login flow blijft simpel:** Huidige `subscription_status` check werkt prima, geen complexe contract-aware checks nodig
- ✅ **Focus op functionaliteit:** Contract info = eenvoudige tekstuele uitleg, geen complexe interactieve elementen

**Zie sectie 11 voor volledige workflow alignment analyse.**

---

## 2. Uitgangspunten

### 2.1 Technische Stack

**Frontend:**
- Next.js 15.1.6 (App Router)
- React 19.0.0
- TypeScript 5.7.2 (strict mode)
- Tailwind CSS 3.4.17
- Lucide React 0.460.0 (icons)
- Sonner 1.7.1 (toast notifications)

**Backend:**
- Next.js API Routes
- Supabase (@supabase/supabase-js ^2.50.0)
  - PostgreSQL database
  - Auth (@supabase/ssr ^0.5.2)
  - Row Level Security (RLS)

**Payment & External Services:**
- Mollie API (@mollie/api-client ^4.3.3)
  - iDEAL payments
  - SEPA Direct Debit
  - Subscription management
- Resend (resend ^4.6.0) voor email

**State Management & Utilities:**
- Zustand 5.0.2 (state management)
- Zod 4.1.12 (schema validatie)
- date-fns (datum berekeningen)

**Development:**
- pnpm 9.15.4 (package manager)
- Jest 29.7.0 (testing)
- ESLint 9.18.0 + Prettier 3.4.2

**Hosting:**
- Vercel (productie deployment)
- Supabase Cloud (database)

### 2.2 Projectkaders

**Tijd:** 3 weken (120 uur totaal)
- Week 1: Database + Backend (40 uur)
- Week 2: Webhooks + Testing (40 uur)
- Week 3: Frontend + Polish (40 uur)

**Budget:**
- Mollie transactiekosten: €0.29 + 1.29% per transactie
- SEPA Direct Debit: gratis na activatie
- Supabase: huidige plan (geen extra kosten verwacht)
- Vercel: huidige plan

**Team:**
- 1 Full-stack developer (TypeScript, Next.js, Supabase)
- 1 Support medewerker (Talar - refund handling)

**Data:**
- Productie data blijft behouden
- Bestaande subscriptions migreren (add-only migrations)
- Test mode eerst, dan live switch

**Compliance:**
- GDPR compliant (geen extra PII opslag)
- Wettelijke 14-dagen bedenktijd
- Transparante contractvoorwaarden in checkout

### 2.3 Programmeer Uitgangspunten

**Code Quality Principles:**

- **DRY (Don't Repeat Yourself)**
  - Contract date berekeningen in gedeelde helper functie
  - Webhook logic herbruikbaar voor payment/subscription events
  - Type definitions centraal in `/src/lib/payment/types.ts`

- **KISS (Keep It Simple, Stupid)**
  - Refund process blijft manueel (geen complexe automation)
  - Database computed fields voor `can_cancel` (geen client-side logic)
  - Duidelijke scheiding: monthly = subscription, yearly = one-time

- **SOC (Separation of Concerns)**
  - `/src/lib/mollie/customer.ts` - Customer management
  - `/src/lib/payment/contract.ts` - Contract date calculations
  - `/app/api/payment/create/route.ts` - Payment creation logic
  - `/app/api/webhooks/mollie/route.ts` - Webhook handling

- **YAGNI (You Aren't Gonna Need It)**
  - Geen automatische refund API (handmatig is voldoende)
  - Geen contract verleng-notificaties (komt later indien nodig)
  - Geen multi-currency support (alleen EUR)

**Development Practices:**

- **Code Organization**
  - Nieuwe files: `/src/lib/mollie/customer.ts`, `/src/lib/payment/contract.ts`
  - Bestaande files uitbreiden: `route.ts` files in `/app/api/`
  - Types centraal in `/src/lib/payment/types.ts`

- **Error Handling**
  - Try-catch op alle Mollie API calls
  - Webhook retry safety (idempotent operations)
  - User-friendly errors in checkout UI

- **Security**
  - Mollie API key alleen in server-side code
  - Webhook signature verification
  - RLS policies voor subscription data
  - No PII in Mollie metadata (alleen user IDs)

- **Performance**
  - Webhook processing < 5 seconden (Mollie timeout)
  - Database indexes op customer IDs en mandate IDs
  - Atomic operations voor subscription creation

- **Testing**
  - Unit tests: contract date calculations
  - Integration tests: webhook handlers (mocked Mollie)
  - Manual tests: complete checkout flows in Mollie test mode
  - Test scenarios: success, failure, cancellation flows

- **Documentation**
  - Inline JSDoc voor public functions
  - Support documentation voor refund process
  - Architecture Decision Record (ADR) voor subscription model keuze

**Code Voorbeeld:**

```typescript
// ✅ WEL - DRY + SOC principe
// In /src/lib/payment/contract.ts
export function calculateContractDates(startDate: Date) {
  return {
    contract_start_date: startDate,
    contract_end_date: addMonths(startDate, 12),
    opt_out_deadline: addDays(startDate, 14),
  };
}

// In webhook handler
const contractDates = calculateContractDates(new Date());

// ❌ NIET - Repeated logic
// In webhook
const contractEnd = new Date();
contractEnd.setMonth(contractEnd.getMonth() + 12);
// Same logic repeated in multiple places
```

---

## 3. MVP vs Post-MVP Overzicht

### 3.1 MVP (Minimum Viable Product) - Must-Have Features

**Doel:** Core functionaliteit voor recurring subscriptions met contract tracking. Focus op eenvoud en werkende basis.

| Epic ID | Titel | Doel | Stories | Story Points | Status |
|---------|-------|------|---------|--------------|--------|
| E0 | Database Schema Updates | Contract & opt-out tracking toevoegen aan database | 2 | 5 | ⏳ To Do |
| E1 | TypeScript Types & Helpers | Type definitions en contract helper functies | 2 | 3 | ⏳ To Do |
| E2 | Mollie Customer Management | Customer creation en opslag in database | 2 | 8 | ⏳ To Do |
| E3 | Betaalflow Splitsen | Scheiding monthly (subscription) vs yearly (one-time) | 3 | 13 | ⏳ To Do |
| E4 | Webhook Updates | Payment + subscription event handling | 4 | 21 | ⏳ To Do |
| E5.S1 | Checkout: Contract info display | Contract voorwaarden tonen in checkout | 1 | 3 | ⏳ To Do |
| E7 | Testing & QA | Test scenarios en debugging | 3 | 13 | ⏳ To Do |
| E8 | Deployment | Pre-deployment checks en rollout | 3 | 8 | ⏳ To Do |

**MVP Totaal:** 8 Epics (waarvan 1 partial), 20 Stories, **~74 Story Points (~74 uur)**

**MVP Deliverables:**
- ✅ Recurring monthly subscriptions met SEPA incasso
- ✅ Yearly one-time payments blijven werken
- ✅ Contract tracking in database (12 maanden + 14 dagen opt-out)
- ✅ Contract info zichtbaar in checkout
- ✅ Automatische subscription creation via webhooks
- ✅ Production-ready deployment

---

### 3.2 Post-MVP - Nice-to-Have Features

**Doel:** Verbeterde UX en support tooling. Kan later toegevoegd worden zonder impact op core functionaliteit.

| Epic ID | Titel | Doel | Stories | Story Points | Status |
|---------|-------|------|---------|--------------|--------|
| E5.S2 | Account subscription page | User-facing subscription management pagina | 1 | 8 | ⏳ Post-MVP |
| E5.S3 | Subscription cancellation UI | Cancellation flow voor users | 1 | 2 | ⏳ Post-MVP |
| E6 | Refund Process | Support documentation en helpers | 2 | 3 | ⏳ Post-MVP |

**Post-MVP Totaal:** 3 Stories, **~13 Story Points (~13 uur)**

**Post-MVP Deliverables:**
- 🟡 Account pagina voor subscription management
- 🟡 Self-service cancellation (na contractperiode)
- 🟡 Support tooling voor refund proces

**Totaal Project:** 9 Epics, 24 Stories, 87 Story Points (~87 uur)

---

## 4. MVP Epics & Stories (Uitwerking)

> **Focus:** Alle must-have features voor production launch. Deze epics moeten allemaal geïmplementeerd worden voordat we live gaan.

### Epic 0 — Database Schema Updates (MVP)

**Epic Doel:** Database voorbereiden voor contract tracking en recurring subscriptions zonder bestaande data te breken.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E0.S1 | Migratie: Contract fields toevoegen | - `subscriptions` tabel heeft contract_start_date, contract_end_date, opt_out_deadline<br>- `can_cancel` column met trigger werkt<br>- `is_recurring` boolean toegevoegd<br>- Bestaande subscriptions blijven werken | ✅ | — | 3 |
| E0.S2 | Migratie: Mollie customer tracking | - `profiles` tabel heeft `mollie_customer_id`<br>- `subscriptions` tabel heeft `mollie_customer_id`, `mollie_mandate_id`<br>- `mollie_subscription_id` renamed naar `mollie_reference_id`<br>- Indexes toegevoegd | ✅ | E0.S1 | 2 |

**Technical Notes:**
- Gebruik `ALTER TABLE ADD COLUMN` (backwards compatible)
- `can_cancel` als normale column met trigger (PostgreSQL ondersteunt geen tijd-afhankelijke computed fields)
- Trigger update automatisch `can_cancel` bij INSERT/UPDATE
- Test migratie eerst op lokale database

**✅ E0.S1 Status:** Migratie succesvol uitgevoerd op 13-11-2025
- Alle contract fields toegevoegd
- Trigger `update_subscription_can_cancel_trigger` aangemaakt
- Function `update_subscription_can_cancel()` aangemaakt

**✅ E0.S2 Status:** Migratie succesvol uitgevoerd op 13-11-2025
- UNIQUE constraint op `profiles.mollie_customer_id` toegevoegd
- `mollie_customer_id` en `mollie_mandate_id` toegevoegd aan subscriptions
- `mollie_subscription_id` hernoemd naar `mollie_reference_id`
- Indexes `idx_subscriptions_customer` en `idx_subscriptions_mandate` aangemaakt

**SQL Migration (Uitgevoerd):**
```sql
-- E0.S1: Contract fields toevoegen aan subscriptions
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS contract_start_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS contract_end_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS opt_out_deadline TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS can_cancel BOOLEAN DEFAULT false;

-- Trigger function om can_cancel automatisch te updaten
CREATE OR REPLACE FUNCTION update_subscription_can_cancel()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.can_cancel := NEW.opt_out_deadline IS NOT NULL AND NEW.opt_out_deadline > NOW();
  RETURN NEW;
END;
$$;

-- Trigger aanmaken
CREATE TRIGGER update_subscription_can_cancel_trigger
  BEFORE INSERT OR UPDATE OF opt_out_deadline ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_can_cancel();

-- E0.S2: Mollie customer tracking (Uitgevoerd)
-- Step 1: Add UNIQUE constraint to profiles.mollie_customer_id
ALTER TABLE profiles
  ADD CONSTRAINT profiles_mollie_customer_id_unique UNIQUE (mollie_customer_id);

-- Step 2: Add mollie_customer_id and mollie_mandate_id to subscriptions
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS mollie_customer_id VARCHAR,
  ADD COLUMN IF NOT EXISTS mollie_mandate_id VARCHAR;

-- Step 3: Rename mollie_subscription_id to mollie_reference_id
ALTER TABLE subscriptions
  RENAME COLUMN mollie_subscription_id TO mollie_reference_id;

-- Step 4: Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer ON subscriptions(mollie_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_mandate ON subscriptions(mollie_mandate_id);
```

**⚠️ Database Check Resultaten (via Supabase MCP):**

**✅ Al Aanwezig:**
- `profiles.mollie_customer_id` (varchar, nullable) - bestaat al!
- `subscriptions.mollie_subscription_id` - moet hernoemd worden naar `mollie_reference_id`

**✅ E0.S1 Voltooid:**
- `subscriptions.contract_start_date` ✅
- `subscriptions.contract_end_date` ✅
- `subscriptions.opt_out_deadline` ✅
- `subscriptions.can_cancel` (column met trigger) ✅
- `subscriptions.is_recurring` ✅

**✅ E0.S2 Voltooid:**
- `subscriptions.mollie_customer_id` ✅
- `subscriptions.mollie_mandate_id` ✅
- Rename `mollie_subscription_id` → `mollie_reference_id` ✅
- UNIQUE constraint op `profiles.mollie_customer_id` ✅
- Indexes op `subscriptions.mollie_customer_id` en `mollie_mandate_id` ✅

**📝 Opmerking:**
- Er bestaat een aparte `mollie_customers` tabel, maar het bouwplan gebruikt alleen `profiles.mollie_customer_id` voor eenvoud. Dit is consistent met de implementatie.

---

### Epic 1 — TypeScript Types & Helpers (MVP)

**Epic Doel:** Type-safe contract logic en helper functies voor datum berekeningen.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E1.S1 | Update payment types | - `SubscriptionWithContract` interface gedefineerd<br>- Alle contract fields getypt<br>- Backwards compatible met bestaande types | ⏳ | E0.S2 | 1 |
| E1.S2 | Contract helper functies | - `calculateContractDates()` werkt correct<br>- `isInOptOutPeriod()` correct<br>- `isContractActive()` correct<br>- Unit tests geschreven | ⏳ | E1.S1 | 2 |

**Technical Notes:**
- Nieuwe file: `/src/lib/payment/contract.ts`
- Update: `/src/lib/payment/types.ts`
- Use `date-fns` voor datum manipulatie (`addMonths`, `addDays`)
- Export via `/src/lib/payment/index.ts`

**Code Structure:**
```typescript
// types.ts
export interface SubscriptionWithContract {
  // Existing fields
  id: string;
  user_id: string;
  status: string;

  // New contract fields
  contract_start_date: string;
  contract_end_date: string;
  opt_out_deadline: string;
  can_cancel: boolean;

  // New Mollie fields
  mollie_reference_id: string;
  mollie_customer_id: string | null;
  mollie_mandate_id: string | null;
  is_recurring: boolean;
}

// contract.ts
export function calculateContractDates(startDate: Date) {
  return {
    contract_start_date: startDate,
    contract_end_date: addMonths(startDate, 12),
    opt_out_deadline: addDays(startDate, 14),
  };
}
```

---

### Epic 2 — Mollie Customer Management (MVP)

**Epic Doel:** Mollie Customer objecten aanmaken en koppelen aan users voor recurring subscriptions.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E2.S1 | Customer creation service | - `createMollieCustomer()` functie werkt<br>- Check op bestaande customer<br>- Customer ID opgeslagen in profiles<br>- Error handling voor Mollie API | ⏳ | E1.S2 | 5 |
| E2.S2 | Customer retrieval helper | - `getMollieCustomer()` functie werkt<br>- Returns customer of null<br>- Caching voor repeated calls | ⏳ | E2.S1 | 3 |

**Technical Notes:**
- Nieuwe file: `/src/lib/mollie/customer.ts`
- Gebruik `mollieClient.customers.create()`
- Store alleen customer ID, niet volledige customer data
- Metadata: `{ userId }` voor linking

**Implementation Details:**
```typescript
// /src/lib/mollie/customer.ts
import { mollieClient } from './client';
import { createClient } from '@/lib/supabase/server';

export async function createMollieCustomer(userId: string) {
  const supabase = await createClient();

  // 1. Check existing
  const { data: profile } = await supabase
    .from('profiles')
    .select('mollie_customer_id, email, full_name')
    .eq('id', userId)
    .single();

  if (profile.mollie_customer_id) {
    return profile.mollie_customer_id;
  }

  // 2. Create in Mollie
  const customer = await mollieClient.customers.create({
    name: profile.full_name,
    email: profile.email,
    metadata: { userId },
  });

  // 3. Store ID
  await supabase
    .from('profiles')
    .update({ mollie_customer_id: customer.id })
    .eq('id', userId);

  return customer.id;
}
```

---

### Epic 3 — Betaalflow Splitsen (MVP)

**Epic Doel:** Scheiding tussen monthly (subscription) en yearly (one-time) payment flows.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E3.S1 | Payment route routing logic | - `if (billing === 'monthly')` routing werkt<br>- Correct dispatch naar functies<br>- Request validation blijft werken | ⏳ | E2.S2 | 2 |
| E3.S2 | Monthly subscription creation | - `createMonthlySubscription()` implementatie<br>- Customer creation call<br>- First payment met `sequenceType: 'first'`<br>- Metadata correct | ⏳ | E3.S1 | 8 |
| E3.S3 | Yearly payment (refactor existing) | - `createYearlyPayment()` extracted<br>- Bestaande one-time logic behouden<br>- Contract dates toegevoegd aan metadata | ⏳ | E3.S1 | 3 |

**Technical Notes:**
- Update `/app/api/payment/create/route.ts`
- Twee aparte functies: `createMonthlySubscription()` en `createYearlyPayment()`
- Monthly: `mollieClient.customerPayments.create()` met `sequenceType: 'first'`
- Yearly: `mollieClient.payments.create()` (existing)

**Flow Diagram:**
```
POST /api/payment/create
  ├─ if (billing === 'monthly')
  │   └─> createMonthlySubscription()
  │       ├─ createMollieCustomer(userId)
  │       ├─ mollieClient.customerPayments.create({ sequenceType: 'first' })
  │       ├─ Store in payments table
  │       └─ Return paymentUrl
  │
  └─ else (billing === 'yearly')
      └─> createYearlyPayment()
          ├─ mollieClient.payments.create()
          ├─ Store in payments table
          └─ Return paymentUrl
```

**Code Structure:**
```typescript
// /app/api/payment/create/route.ts
export async function POST(request: NextRequest) {
  // ... validation ...

  // NEW: Route based on billing
  if (billing === 'monthly') {
    return await createMonthlySubscription(user, plan, finalPrice, metadata);
  } else {
    return await createYearlyPayment(user, plan, finalPrice, metadata);
  }
}

async function createMonthlySubscription(user, plan, price, metadata) {
  // 1. Create/get customer
  const customerId = await createMollieCustomer(user.id);

  // 2. First payment (creates mandate)
  const firstPayment = await mollieClient.customerPayments.create({
    customerId,
    amount: { value: price.toFixed(2), currency: 'EUR' },
    description: `${plan} - Eerste maand`,
    redirectUrl: `${siteUrl}/checkout/success`,
    webhookUrl: `${siteUrl}/api/webhooks/mollie`,
    sequenceType: 'first', // Creates mandate!
    metadata: { ...metadata, subscriptionType: 'monthly' },
  });

  // 3. Store payment
  await supabase.from('payments').insert({
    user_id: user.id,
    mollie_payment_id: firstPayment.id,
    amount: price,
    status: 'open',
  });

  return NextResponse.json({
    success: true,
    paymentUrl: firstPayment.getCheckoutUrl(),
  });
}
```

---

### Epic 4 — Webhook Updates (MVP)

**Epic Doel:** Uitgebreide webhook handler voor payment events EN subscription events.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E4.S1 | Webhook event routing | - Detect `tr_` vs `sub_` prefixes<br>- Route naar juiste handler<br>- Unknown events loggen | ⏳ | E3.S3 | 3 |
| E4.S2 | Payment webhook: recurring subscription | - `createRecurringSubscription()` werkt<br>- Mollie subscription aangemaakt<br>- Database subscription met contract fields<br>- Profile status update | ⏳ | E4.S1 | 8 |
| E4.S3 | Payment webhook: one-time subscription | - `createOneTimeSubscription()` refactored<br>- Contract dates toegevoegd<br>- Bestaande logic behouden | ⏳ | E4.S1 | 3 |
| E4.S4 | Subscription webhook handler | - `handleSubscriptionWebhook()` werkt<br>- Handles 'active', 'canceled', 'suspended'<br>- Updates database correct<br>- Email notifications (optional) | ⏳ | E4.S2 | 7 |

**Technical Notes:**
- Update `/app/api/webhooks/mollie/route.ts`
- Mollie webhook retries automatisch (max 10x over 24 uur)
- Idempotency belangrijk (check bestaande subscription)
- Webhook moet binnen 5 seconden responsen (Mollie timeout)

**Event Types:**
```
Mollie ID prefixes:
- tr_xxxxx  = Payment (transaction)
- sub_xxxxx = Subscription
- cst_xxxxx = Customer
- mdt_xxxxx = Mandate
```

**Webhook Logic:**
```typescript
// /app/api/webhooks/mollie/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Route based on ID prefix
  if (body.id.startsWith('tr_')) {
    return await handlePaymentWebhook(body.id);
  } else if (body.id.startsWith('sub_')) {
    return await handleSubscriptionWebhook(body.id);
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentWebhook(paymentId: string) {
  const payment = await mollieClient.payments.get(paymentId);

  // Update payment status
  await supabase.from('payments')
    .update({ status: payment.status })
    .eq('mollie_payment_id', paymentId);

  if (payment.status === 'paid') {
    const metadata = payment.metadata;

    if (metadata.subscriptionType === 'monthly') {
      await createRecurringSubscription(payment);
    } else {
      await createOneTimeSubscription(payment);
    }
  }
}

async function createRecurringSubscription(payment) {
  const metadata = payment.metadata;
  const customerId = payment.customerId;

  // 1. Check duplicate (idempotency)
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', metadata.userId)
    .single();

  if (existing) {
    console.log('Subscription already exists');
    return;
  }

  // 2. Create Mollie subscription
  const mollieSubscription = await mollieClient.customerSubscriptions.create({
    customerId,
    amount: { value: payment.amount.value, currency: 'EUR' },
    interval: '1 month',
    description: `${metadata.plan} maandabonnement`,
    webhookUrl: `${siteUrl}/api/webhooks/mollie`,
    startDate: addMonths(new Date(), 1).toISOString(),
    metadata: {
      userId: metadata.userId,
      plan: metadata.plan,
    },
  });

  // 3. Create subscription record
  const now = new Date();
  const contractDates = calculateContractDates(now);

  await supabase.from('subscriptions').insert({
    user_id: metadata.userId,
    mollie_reference_id: mollieSubscription.id,
    mollie_customer_id: customerId,
    mollie_mandate_id: payment.mandateId,
    is_recurring: true,

    contract_start_date: contractDates.contract_start_date,
    contract_end_date: contractDates.contract_end_date,
    opt_out_deadline: contractDates.opt_out_deadline,

    status: 'active',
    start_date: now,
    next_billing_date: addMonths(now, 1),
    amount: parseFloat(payment.amount.value),
    currency: 'EUR',
  });

  // 4. Update profile
  await supabase.from('profiles')
    .update({ subscription_status: 'active' })
    .eq('id', metadata.userId);

  // 5. Increment discount if used
  if (metadata.discountCode) {
    await incrementDiscountCodeUses(metadata.discountCode);
  }

  // 6. Send welcome email
  await sendWelcomeEmail(metadata.userId);
}

async function handleSubscriptionWebhook(subscriptionId: string) {
  // Get subscription from Mollie
  // Note: Need customer ID - get from database first
  const { data: dbSub } = await supabase
    .from('subscriptions')
    .select('mollie_customer_id')
    .eq('mollie_reference_id', subscriptionId)
    .single();

  const subscription = await mollieClient.customerSubscriptions.get(
    dbSub.mollie_customer_id,
    subscriptionId
  );

  switch (subscription.status) {
    case 'active':
      // Monthly payment succeeded
      await handleSuccessfulPayment(subscription);
      break;

    case 'canceled':
      // User canceled (only after contract)
      await handleCancellation(subscription);
      break;

    case 'suspended':
      // Payment failed - grace period
      await handlePaymentFailure(subscription);
      break;
  }
}
```

---

### Epic 5.S1 — Checkout: Contract Info Display (MVP)

**Epic Doel:** Contract voorwaarden tonen in checkout voor transparantie.

**⚠️ Note:** E5.S2 en E5.S3 zijn Post-MVP en staan in sectie 5.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E5.S1 | Checkout page: Contract info display | - Contract voorwaarden getoond<br>- Verschillend voor monthly/yearly<br>- 12 maanden + 14 dagen duidelijk<br>- SEPA info voor monthly<br>- **Eenvoudige info box, geen interactieve elementen** | ⏳ | E4.S4 | 3 |

**Technical Notes:**
- Update `/app/checkout/page.tsx` met contract info box
- Eenvoudige implementatie: geen complexe hooks of state management nodig
- Contract info = statische tekst, geen interactieve elementen

**UI Components (E5.S1 - Vereenvoudigd):**
```typescript
// /app/checkout/page.tsx
// Eenvoudige info box - geen interactieve elementen
<div className="border rounded-lg p-4 bg-gray-50 mb-6">
  <h3 className="font-semibold mb-3 text-lg">📋 Contractvoorwaarden</h3>
  <ul className="space-y-2 text-sm text-gray-700">
    <li className="flex items-start gap-2">
      <span className="text-green-600">✓</span>
      <span>12 maanden contractperiode</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-green-600">✓</span>
      <span>14 dagen bedenktijd met volledige refund mogelijkheid</span>
    </li>
    {billing === 'monthly' && (
      <>
        <li className="flex items-start gap-2">
          <span className="text-green-600">✓</span>
          <span>Eerste maand: betaling via iDEAL</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-600">✓</span>
          <span>Daarna: automatische SEPA incasso (maandelijks)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-600">✓</span>
          <span>Na 12 maanden: maandelijks opzegbaar</span>
        </li>
      </>
    )}
    {billing === 'yearly' && (
      <>
        <li className="flex items-start gap-2">
          <span className="text-green-600">✓</span>
          <span>Volledige bedrag vooruit via iDEAL</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-600">✓</span>
          <span>Na 12 maanden: handmatig verlengen</span>
        </li>
      </>
    )}
  </ul>
  <p className="text-xs text-gray-500 mt-3">
    Voor vragen over je abonnement, neem contact op met support.
  </p>
</div>
```

---

### Epic 7 — Testing & QA (MVP)

**Epic Doel:** Alle scenarios testen in Mollie test mode en bugs fixen.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E7.S1 | Monthly subscription tests | - Eerste betaling succesvol → mandaat<br>- Eerste betaling faalt → geen sub<br>- Tweede betaling succesvol<br>- Tweede betaling faalt → suspended | ⏳ | E5.S1 | 5 |
| E7.S2 | Yearly subscription tests | - Betaling succesvol → 12m active<br>- Annulering binnen 14 dagen<br>- Verlopen na 12 maanden | ⏳ | E7.S1 | 3 |
| E7.S3 | Bug fixes & polish | - Alle gevonden bugs gefixt<br>- Edge cases handled<br>- Error messages user-friendly<br>- Performance check | ⏳ | E7.S2 | 5 |

**Technical Notes:**
- Gebruik Mollie test mode
- Test credit cards: `5555 5555 5555 4444` (success), `5555 5555 5555 5557` (fail)
- Test iDEAL: Test Bank → kies "paid" of "failed"
- Document test results

**Test Scenarios Checklist:**

**Monthly Subscription:**
- [ ] Eerste betaling slaagt → mandaat aangemaakt → subscription start volgende maand
- [ ] Eerste betaling faalt → geen mandaat → geen subscription
- [ ] Tweede betaling slaagt → subscription blijft actief
- [ ] Tweede betaling faalt → status 'suspended' → grace period email
- [ ] Annuleer binnen 14 dagen → status 'canceled' → refund mogelijk
- [ ] Annuleer na 12 maanden → stopt einde maand

**Yearly Subscription:**
- [ ] Betaling slaagt → subscription 12 maanden actief
- [ ] Annuleer binnen 14 dagen → refund eligible
- [ ] Na 12 maanden → status 'expired', moet verlengen

**Edge Cases:**
- [ ] User annuleert bij bank tijdens checkout
- [ ] Duplicate webhook calls (idempotency check)
- [ ] Webhook timeout (Mollie retry)
- [ ] Customer al bestaat (reuse check)

---

### Epic 8 — Deployment (MVP)

**Epic Doel:** Production-ready deployment met monitoring en rollback plan.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E8.S1 | Pre-deployment checklist | - SEPA Direct Debit geactiveerd in Mollie<br>- Live API keys configured<br>- Webhook URL productie<br>- Migratie getest op staging | ⏳ | E7.S3 | 2 |
| E8.S2 | Production deployment | - Database migratie run<br>- Code deployed naar Vercel<br>- Complete test flow in prod (test mode)<br>- Switch naar live mode | ⏳ | E8.S1 | 3 |
| E8.S3 | Post-deployment monitoring | - Webhook logs monitoren (48 uur)<br>- Subscription creation rate check<br>- Mandate creation rate check<br>- Failed payment tracking | ⏳ | E8.S2 | 3 |

**Technical Notes:**
- Deployment via Vercel (automatic op `main` branch push)
- Database migratie via Supabase dashboard
- Test mode eerst (1 dag), dan live switch
- Rollback plan: revert migration + code rollback

**Pre-deployment Checklist:**

**Mollie Configuration:**
- [ ] SEPA Direct Debit geactiveerd (via Mollie dashboard)
- [ ] Live API key toegevoegd aan Vercel environment variables
- [ ] Webhook URL updated: `https://dobbie.app/api/webhooks/mollie`
- [ ] Webhook signature secret configured

**Database:**
- [ ] Migration tested op lokale database
- [ ] Migration tested op Supabase staging (if available)
- [ ] Backup genomen van productie database
- [ ] Migration script ready to run

**Code:**
- [ ] All tests passing
- [ ] TypeScript build succeeds
- [ ] ESLint warnings resolved
- [ ] Code review completed

**Documentation:**
- [ ] Support team trained op refund proces
- [ ] Bouwplan finalized
- [ ] Architecture Decision Record (ADR) written

**Deployment Steps:**

1. **Database Migration (15 min)**
   ```bash
   # Via Supabase dashboard SQL editor
   # Run migration script: 20250113_contract_tracking.sql
   ```

2. **Code Deployment (10 min)**
   ```bash
   git checkout main
   git merge feature/mollie-subscriptions
   git push origin main
   # Vercel auto-deploys
   ```

3. **Test in Production (Test Mode) (30 min)**
   - Create test monthly subscription
   - Verify webhook calls
   - Check database records
   - Test cancellation flow

4. **Switch to Live Mode (5 min)**
   ```bash
   # Update environment variable
   MOLLIE_API_KEY=live_xxxxx  # Replace test key
   ```

5. **Monitor (48 hours)**
   - Check Vercel logs for webhook calls
   - Monitor Supabase for subscription creation
   - Track first real payments
   - Support team on standby

**Rollback Plan:**

If critical issues occur:
1. Switch MOLLIE_API_KEY back to test mode
2. Revert code: `git revert [commit]` + push
3. Consider migration rollback (complex, only if data corruption)

---

## 5. Post-MVP Epics & Stories (Uitwerking)

> **Focus:** Verbeterde UX en support tooling. Deze features kunnen later toegevoegd worden zonder impact op core functionaliteit.

### Epic 5.S2 — Account Subscription Page (Post-MVP)

**Epic Doel:** User-facing pagina voor subscription management en contract status.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E5.S2 | Account subscription page | - Nieuwe route `/account/subscription`<br>- Contract status display<br>- Opt-out button (conditional op `can_cancel`)<br>- Next billing date getoond<br>- **Eenvoudige implementatie** | ⏳ | E5.S1 | 8 |

**Technical Notes:**
- Nieuwe file: `/app/account/subscription/page.tsx`
- Server-side component (geen complexe state)
- Gebruik database `can_cancel` computed field voor conditional rendering

**UI Component:**
```typescript
// /app/account/subscription/page.tsx
// Eenvoudige pagina - alleen basis info
export default async function SubscriptionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Haal subscription op met contract fields
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*, can_cancel')
    .eq('user_id', user.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mijn Abonnement</h1>
      
      {/* Basis contract info */}
      <div className="border rounded-lg p-4 mb-4">
        <h2 className="font-semibold mb-2">Contract Status</h2>
        <p className="text-sm">Contract: {format(subscription.contract_start_date)} - {format(subscription.contract_end_date)}</p>
        <p className="text-sm">Status: {subscription.status}</p>
      </div>

      {/* Opt-out button (alleen als can_cancel = true) */}
      {subscription.can_cancel && (
        <div className="border-2 border-orange-500 rounded-lg p-4 bg-orange-50">
          <p className="font-semibold mb-2">⚠️ 14-dagen bedenktijd</p>
          <p className="text-sm mb-3">Je kunt nog annuleren tot {format(subscription.opt_out_deadline)}</p>
          <a 
            href="/contact" 
            className="bg-orange-600 text-white px-4 py-2 rounded inline-block"
          >
            Neem contact op voor annulering
          </a>
        </div>
      )}
    </div>
  );
}
```

---

### Epic 5.S3 — Subscription Cancellation UI (Post-MVP)

**Epic Doel:** Self-service cancellation flow voor users na contractperiode.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E5.S3 | Subscription cancellation UI | - Cancel button (only after contract)<br>- Eenvoudige confirmation (geen complexe modal)<br>- API call naar cancellation endpoint<br>- Success/error handling<br>- **Basis functionaliteit is voldoende** | ⏳ | E5.S2 | 2 |

**Technical Notes:**
- Eenvoudige button die API call doet
- Geen complexe modals of state management
- Focus op functionaliteit, niet UX polish

---

### Epic 6 — Refund Process (Post-MVP)

**Epic Doel:** Support team voorbereiden op handmatige refund verwerking binnen 14-dagen periode.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E6.S1 | Support documentation | - Refund template document<br>- Step-by-step Mollie dashboard guide<br>- Database update queries<br>- Email template | ⏳ | E5.S1 | 2 |
| E6.S2 | Refund eligibility helper | - `checkRefundEligibility()` functie<br>- Returns canRefund, daysRemaining, amount<br>- Voor support team gebruik | ⏳ | E6.S1 | 1 |

**Technical Notes:**
- **Geen automatische refund API** (bewuste YAGNI keuze)
- Support doet refunds handmatig via Mollie dashboard
- Gemiddeld 2 minuten per refund (acceptabel volume)
- Document in `/docs/support/refund-template.md`

**Support Documentation:**
```markdown
# Refund Proces - 14 dagen bedenktijd

## Wanneer eligible?
- Binnen 14 dagen na `subscription.contract_start_date`
- Check: `subscription.can_cancel = true` in database

## Stappen:
1. **Verify eligibility**
   ```sql
   SELECT can_cancel, opt_out_deadline, amount, mollie_reference_id
   FROM subscriptions
   WHERE user_id = '[USER_ID]';
   ```

2. **Mollie Dashboard**
   - Log in op dashboard.mollie.com
   - Zoek payment via `mollie_reference_id`
   - Klik "Refund" → Volledige bedrag selecteren
   - Bevestig refund

3. **Database Update**
   ```sql
   UPDATE subscriptions
   SET status = 'canceled'
   WHERE user_id = '[USER_ID]';

   UPDATE profiles
   SET subscription_status = 'inactive'
   WHERE id = '[USER_ID]';
   ```

4. **Email naar klant**
   - Bevestiging van refund
   - Bedrag en verwachte termijn (2-5 werkdagen)
   - Uitnodiging om later terug te komen

## Tijdsinvestering
- ~2 minuten per refund
- Bij veel refunds: overwegen automation (komt later)
```

---

## 6. Kwaliteit & Testplan (MVP)

### Test Types

| Test Type | Scope | Tools | Verantwoordelijke |
|-----------|-------|-------|-------------------|
| Unit Tests | Contract date calculations, helper functions | Jest | Developer |
| Integration Tests | API endpoints (mocked Mollie), webhook handlers | Jest + supertest | Developer |
| E2E Tests | Complete checkout flows in Mollie test mode | Manual checklist | Developer |
| Performance Tests | Webhook response time (<5s), database queries | Vercel logs, Supabase monitoring | Developer |
| Security Tests | RLS policies, Mollie webhook signature verification | Manual + Supabase logs | Developer |

### Test Coverage Targets

- **Unit tests:** 80%+ coverage op `/src/lib/payment/contract.ts`
- **Integration tests:** Alle webhook scenarios (paid, failed, canceled, suspended)
- **E2E tests:** 6 happy flows + 4 error scenarios (zie E7 checklist)

### Manual Test Checklist (voor launch)

**Monthly Subscription Flow:**
- [ ] User kan checkout doen met monthly billing
- [ ] iDEAL betaling succesvol
- [ ] Mandaat wordt aangemaakt
- [ ] Mollie subscription wordt aangemaakt (start over 1 maand)
- [ ] Database subscription heeft correcte contract dates
- [ ] Profile status wordt 'active'
- [ ] Welcome email verstuurd
- [ ] Opt-out button zichtbaar in account page
- [ ] Na 14 dagen: opt-out button verdwijnt

**Yearly Subscription Flow:**
- [ ] User kan checkout doen met yearly billing
- [ ] iDEAL betaling succesvol
- [ ] Database subscription heeft contract dates
- [ ] Geen Mollie subscription aangemaakt (one-time)
- [ ] Profile status wordt 'active'
- [ ] Welcome email verstuurd

**Error Scenarios:**
- [ ] Betaling failed → user ziet error message
- [ ] Webhook downtime → Mollie retries (check logs)
- [ ] Duplicate webhook → idempotency check werkt
- [ ] Invalid discount code → error getoond

**Mobile Responsiveness:**
- [ ] Checkout page werkt op mobile
- [ ] Contract info leesbaar op mobile
- [ ] Account subscription page werkt op mobile

---

## 6. Kwaliteit & Testplan

**Duur:** 15 minuten
**Doelgroep:** Interne stakeholders + support team
**Locatie:** Live op Vercel (test mode eerst)

### Demo Scenario

**Flow:**

1. **Intro** (2 min): Doel en voordelen nieuwe systeem
   - Recurring payments
   - 12-maanden contract
   - 14-dagen opt-out

2. **Monthly Subscription Demo** (5 min):
   - Checkout pagina met contract info
   - iDEAL test betaling
   - Success pagina
   - Account pagina: contract status + opt-out button

3. **Backend Demo** (3 min):
   - Supabase: subscription record met contract fields
   - Mollie dashboard: customer + mandate + subscription
   - Webhook logs in Vercel

4. **Yearly Subscription Demo** (2 min):
   - Snelle checkout demo
   - Contract info verschil (geen SEPA, wel 12m)

5. **Support Process Demo** (2 min):
   - Refund documentation walkthrough
   - `checkRefundEligibility()` helper demo

6. **Vragen + Next Steps** (1 min)

### Backup Plan

- Lokale versie klaar bij internet issues
- Screenshots als complete fallback
- Test data pre-seeded

---

## 7. Demo & Presentatieplan

| Risico | Kans | Impact | Mitigatie | Owner |
|--------|------|--------|-----------|-------|
| Mollie SEPA delay (2-5 werkdagen) | Hoog | Middel | Duidelijk communiceren in checkout UI | Developer |
| Failed mandates (user weigert bij bank) | Middel | Hoog | Email notificatie + grace period + support follow-up | Developer + Support |
| Webhook downtime | Middel | Hoog | Mollie retries automatisch (max 10x/24h), logs monitoren | Developer |
| Migration data corruption | Laag | Kritiek | Test op staging, backup voor productie, rollback plan | Developer |
| Hoog refund volume (>10/dag) | Laag | Middel | Manual process acceptabel, automation indien nodig (later) | Support |
| Browser compatibility (oude Safari) | Laag | Middel | Test op Chrome, Safari, Firefox | Developer |
| Environment vars niet gezet | Middel | Hoog | `.env.example` + deployment checklist | Developer |
| User confusion over contract (juridisch) | Middel | Hoog | Duidelijke UI, terms & conditions link, FAQ pagina | Product + Legal |

---

## 8. Risico's & Mitigatie

**Te documenteren na project:**

- Wat ging goed? Wat niet?
- Welke Mollie API quirks ontdekt?
- Performance van webhooks in productie
- Refund volume (hoeveel binnen 14 dagen?)
- User feedback op contract voorwaarden
- Support team feedback op refund proces
- Conversion rate monthly vs yearly
- Failed payment rate (SEPA)

**KPIs om te meten (eerste maand):**
- Aantal subscriptions: monthly vs yearly
- Mandate creation success rate
- Failed payment rate
- Refund aanvragen (binnen 14 dagen)
- Churn rate (na contractperiode)

---

## 9. Evaluatie & Lessons Learned

### Mission Control Documents

- **PRD** — Product Requirements Document (indien aanwezig)
- **FO** — Functioneel Ontwerp (indien aanwezig)
- **TO** — Technisch Ontwerp (dit document)
- **Implementatieplan** — Originele Mollie Subscriptions plan (basis voor dit bouwplan)

### External Resources

- **Repository:** https://github.com/[org]/08-DoBbie-bedrijfsarts
- **Deployment:** https://dobbie.app (productie)
- **Documentation:** `/docs` folder in repo
- **Mollie Docs:** https://docs.mollie.com/
  - Subscriptions API: https://docs.mollie.com/reference/v2/subscriptions-api
  - Customers API: https://docs.mollie.com/reference/v2/customers-api
  - Webhooks: https://docs.mollie.com/overview/webhooks
- **Supabase Docs:** https://supabase.com/docs

### Database

- **Supabase Project:** https://rcbokkgstwvlxwrpufsv.supabase.co
- **Migrations folder:** `/src/lib/supabase/migrations/`
- **Key tables:** profiles, subscriptions, payments, discount_codes

### Code Locations

- **Payment logic:** `/src/lib/payment/`
- **Mollie client:** `/src/lib/mollie/client.ts`
- **API routes:** `/app/api/payment/`, `/app/api/webhooks/mollie/`
- **Checkout UI:** `/app/checkout/page.tsx`

---

## 10. Referenties

| Term | Betekenis |
|------|-----------|
| Epic | Grote feature of fase in development (bevat meerdere stories) |
| Story | Kleine, uitvoerbare taak binnen een epic |
| Story Points | Schatting van complexiteit (Fibonacci: 1, 2, 3, 5, 8, 13, 21) |
| MVP | Minimum Viable Product |
| DRY | Don't Repeat Yourself |
| KISS | Keep It Simple, Stupid |
| SOC | Separation of Concerns |
| YAGNI | You Aren't Gonna Need It |
| SEPA | Single Euro Payments Area (Europese betaalmethode) |
| Mandate | Machtiging voor automatische incasso |
| Opt-out | Bedenktijd waarbij klant kan annuleren |
| RLS | Row Level Security (Supabase database beveiliging) |
| iDEAL | Nederlandse online betaalmethode |
| Webhook | HTTP callback voor asynchrone event notificaties |
| Idempotent | Operatie die veilig meerdere keren uitgevoerd kan worden |

**Mollie Specifiek:**
| Term | Betekenis |
|------|-----------|
| Customer | Mollie Customer object (voor recurring payments) |
| Mandate | SEPA machtiging voor automatische incasso |
| Subscription | Mollie Subscription object (recurring billing schedule) |
| Payment | Mollie Payment object (één transactie) |
| sequenceType: 'first' | Eerste betaling die mandate aanmaakt |
| sequenceType: 'recurring' | Automatische betaling via bestaande mandate |

---

## 11. Glossary & Abbreviations

| Versie | Datum | Auteur | Wijziging |
|--------|-------|--------|-----------|
| v1.1 | 13-11-2025 | Development Team | Workflow alignment analyse toegevoegd (sectie 11), vereenvoudigingen geïmplementeerd (E5.S2/S3 optioneel), prioriteiten toegevoegd |
| v1.0 | 13-11-2025 | Development Team | Initiële versie - volledige bouwplan structuur |

---

## 12. Workflow Alignment & Huidige State

### 11.1 Workflow Matching Analyse

**Huidige State vs Gewenste State:**

| Aspect | Huidige State | Gewenste State | Status |
|--------|---------------|-----------------|--------|
| **Checkout Flow** | ✅ Monthly/Yearly selectie werkt | ✅ Contract info display nodig | ⚠️ Gedeeltelijk |
| **Payment Creation** | ❌ Beide flows gebruiken one-time payment | ✅ Monthly = subscription, Yearly = one-time | ❌ Niet geïmplementeerd |
| **Login Flow** | ✅ Checkt `subscription_status = 'active'` | ⚠️ Contract-aware checks nodig (optioneel) | ✅ Werkt, maar kan uitgebreid |
| **Account Management** | ❌ Geen subscription pagina | ✅ `/account/subscription` met contract info | ❌ Niet geïmplementeerd |
| **Contract Tracking** | ❌ Geen contract velden in database | ✅ Contract dates + opt-out deadline | ❌ Niet geïmplementeerd |

**Match Percentage:** ~40% (basis flows werken, contract logica ontbreekt)

### 11.2 Vereenvoudigingen & Focus

**Belangrijkste Vereenvoudigingen:**

1. **Login Flow blijft simpel**
   - ✅ Huidige `subscription_status = 'active'` check blijft werken
   - ⚠️ Contract-aware checks zijn **optioneel** (nice-to-have, niet kritiek)
   - **Beslissing:** Login flow niet aanpassen tenzij nodig voor UX

2. **Account Subscription Page = MVP**
   - Basis: Contract status tonen
   - Opt-out button alleen als `can_cancel = true` (database computed field)
   - Cancellation na contract = eenvoudige API call
   - **Geen complexe state management nodig**

3. **Payment Flow Splitsing = Core Feature**
   - Monthly: Customer creation + first payment met mandate
   - Yearly: Bestaande one-time flow blijft werken
   - **Duidelijke scheiding = makkelijker te onderhouden**

4. **Contract Info Display = Simpel**
   - Eenvoudige info box in checkout
   - Geen interactieve elementen nodig
   - **Alleen tekstuele uitleg**

### 11.3 Kritieke Gaps (Moet Geïmplementeerd)

**Must-Have (voor launch):**
1. ✅ Database migratie (E0) - Foundation
2. ✅ Payment flow splitsing (E3) - Core functionaliteit
3. ✅ Webhook updates (E4) - Subscription creation
4. ✅ Contract info in checkout (E5.S1) - Transparantie

**Nice-to-Have (kan later):**
- Account subscription page (E5.S2) - Kan in fase 2
- Contract-aware login checks - Huidige flow werkt prima
- Advanced cancellation UI - Basis is voldoende

### 11.4 Implementatie Prioriteit

**Fase 1 - Core (Week 1-2):**
- E0: Database schema
- E1: Types & helpers
- E2: Customer management
- E3: Payment flow splitsing
- E4: Webhook handlers

**Fase 2 - UX (Week 3):**
- E5.S1: Contract info in checkout (eenvoudig)
- E5.S2: Account page (optioneel, kan later)
- E7: Testing

**Fase 3 - Support (Post-launch):**
- E6: Refund documentation
- E8: Deployment

### 11.5 Aanbevolen Vereenvoudigingen

**Voor Eenvoud:**

1. **Account Subscription Page = Optioneel**
   - Kan later toegevoegd worden
   - Users kunnen contact opnemen met support voor info
   - **Bespaart ~8 story points**

2. **Contract-aware Login Checks = Niet Nodig**
   - Huidige flow werkt prima
   - `subscription_status = 'active'` is voldoende
   - Contract checks alleen nodig voor cancellation UI
   - **Bespaart complexiteit**

3. **Cancellation UI = Eenvoudig**
   - Eenvoudige button die API call doet
   - Geen complexe modals of state management
   - **Focus op functionaliteit, niet UX polish**

**Resultaat:** Van 87 naar ~74 story points door optionele features te schrappen.

---

## 13. Versiehistorie

| Versie | Datum | Auteur | Wijziging |
|--------|-------|--------|-----------|
| v1.3 | 13-11-2025 | Development Team | Database check uitgevoerd via Supabase MCP. Migratie SQL aangepast: `profiles.mollie_customer_id` bestaat al, alleen UNIQUE constraint nodig. Database check resultaten toegevoegd aan E0. |
| v1.2 | 13-11-2025 | Development Team | Plan herarrangeerd op MVP vs Post-MVP basis. Duidelijke scheiding tussen must-have en nice-to-have features. |
| v1.1 | 13-11-2025 | Development Team | Workflow alignment analyse toegevoegd (sectie 11), vereenvoudigingen geïmplementeerd (E5.S2/S3 optioneel), prioriteiten toegevoegd |
| v1.0 | 13-11-2025 | Development Team | Initiële versie - volledige bouwplan structuur |

---

**Status:** Ready for Implementation
**Next Action:** E0.S1 - Database migratie schrijven en testen (MVP)

