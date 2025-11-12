# Implementatieplan: Kortingscode Systeem

**Datum:** 12 november 2025  
**Gebaseerd op:** `docs/kortingscode-spec.md`  
**Status:** 📋 Te implementeren

---

## 📊 Huidige Situatie (Codebase Analyse)

### ✅ Wat er al is:
- ✅ Next.js applicatie met chatbot
- ✅ Supabase voor authenticatie en database
- ✅ Resend API geïnstalleerd en geconfigureerd (`package.json` + `app/api/contact/route.ts`)
- ✅ `profiles` tabel in database (met subscription_status veld)
- ✅ Basis authenticatie flow

### ❌ Wat er NIET is:
- ❌ Mollie package geïnstalleerd (`@mollie/api-client` ontbreekt)
- ❌ `discount_codes` tabel in database
- ❌ `subscriptions` tabel in database (alleen `profiles` met subscription_status)
- ❌ Checkout pagina (`/checkout` route bestaat niet)
- ❌ Mollie webhook handler
- ❌ Payment API endpoints
- ❌ Kortingscode validatie logica

---

## 🎯 Wat moet er gebouwd worden?

### Fase 1: Database Setup (30 min)

#### 1.1 Nieuwe tabel: `discount_codes`
```sql
CREATE TABLE discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percentage NUMERIC, -- NULL als discount_amount gebruikt wordt
  discount_amount NUMERIC,      -- NULL als discount_percentage gebruikt wordt
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  max_uses INTEGER,             -- NULL = onbeperkt
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index voor case-insensitive lookups
CREATE INDEX idx_discount_codes_code ON discount_codes(UPPER(code)) WHERE is_active = true;
CREATE INDEX idx_discount_codes_validity ON discount_codes(valid_from, valid_until) WHERE is_active = true;
```

#### 1.2 Nieuwe tabel: `subscriptions`
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  discount_code TEXT,           -- Welke kortingscode is gebruikt
  discount_amount NUMERIC,       -- Hoeveel korting in euro's
  original_price NUMERIC NOT NULL, -- Originele prijs voor rapportage
  paid_price NUMERIC NOT NULL,   -- Wat Mollie daadwerkelijk ontvangen heeft
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL, -- Nu + 30 dagen (monthly) of nu + 365 dagen (yearly)
  mollie_payment_id TEXT UNIQUE, -- Mollie payment ID voor tracking
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_discount_code ON subscriptions(discount_code);
```

#### 1.3 Atomic increment functie voor `current_uses`
```sql
CREATE OR REPLACE FUNCTION increment_discount_code_uses(code_text TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  max_allowed INTEGER;
BEGIN
  -- Lock row voor atomic update
  SELECT current_uses, max_uses INTO current_count, max_allowed
  FROM discount_codes
  WHERE UPPER(code) = UPPER(code_text)
    AND is_active = true
  FOR UPDATE;
  
  -- Check of code bestaat
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Check of max_uses bereikt is (als max_uses niet NULL is)
  IF max_allowed IS NOT NULL AND current_count >= max_allowed THEN
    RETURN false;
  END IF;
  
  -- Increment
  UPDATE discount_codes
  SET current_uses = current_uses + 1
  WHERE UPPER(code) = UPPER(code_text);
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;
```

**Bestand:** `src/lib/supabase/migrations/YYYYMMDD_create_discount_codes_subscriptions.sql`

---

### Fase 2: Mollie Setup (30 min)

#### 2.1 Package installeren
```bash
pnpm add @mollie/api-client
```

#### 2.2 Environment variables toevoegen
```env
# .env.local
MOLLIE_API_KEY=test_dHar4XY7LxsDOtmnkVtjNVWXLSlXsM  # Test key voor development
MOLLIE_WEBHOOK_SECRET=your_webhook_secret_here     # Voor webhook verificatie
```

#### 2.3 Mollie client configureren
**Bestand:** `src/lib/mollie/client.ts` (nieuw)
```typescript
import { createMollieClient } from '@mollie/api-client';

if (!process.env.MOLLIE_API_KEY) {
  throw new Error('MOLLIE_API_KEY is not set');
}

export const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY,
});
```

---

### Fase 3: Kortingscode Validatie Logica (1 uur)

#### 3.1 Validatie functie
**Bestand:** `src/lib/payment/discount.ts` (nieuw)

Functies nodig:
- `validateDiscountCode(code: string)` - Valideert code en retourneert korting details
- `calculateDiscount(originalPrice: number, discountCode: DiscountCode)` - Berekent korting
- `incrementCodeUsage(code: string)` - Verhoogt current_uses (via database functie)

#### 3.2 API endpoint voor validatie
**Bestand:** `app/api/payment/validate-discount/+server.ts` (nieuw)

Endpoint: `POST /api/payment/validate-discount`
Request body: `{ code: string, plan: 'monthly' | 'yearly' }`
Response: `{ valid: boolean, discount?: {...}, error?: string }`

---

### Fase 4: Checkout Pagina (1.5-2 uur)

#### 4.1 Checkout pagina component
**Bestand:** `app/checkout/page.tsx` (nieuw)

Features:
- Plan selectie (monthly/yearly) - prijzen: €29/month of €290/year
- Kortingscode input veld met "Toepassen" knop
- Real-time prijs update bij kortingscode
- Visuele feedback (groen bij geldig, rood bij ongeldig)
- "Betalen met Mollie" knop

#### 4.2 Prijs berekening component
**Bestand:** `src/components/checkout/PriceDisplay.tsx` (nieuw)

Toont:
- Originele prijs
- Korting (indien toegepast)
- Finale prijs
- Bespaarbedrag

---

### Fase 5: Payment API Endpoints (1.5 uur)

#### 5.1 Payment creation endpoint
**Bestand:** `app/api/payment/create/+server.ts` (nieuw)

Endpoint: `POST /api/payment/create`
Flow:
1. Valideer kortingscode (nogmaals, voor security)
2. Bereken finale prijs
3. Maak Mollie payment aan
4. Sla payment referentie op in database
5. Return payment URL voor redirect

#### 5.2 Success/Cancel pagina's
**Bestanden:**
- `app/checkout/success/page.tsx` (nieuw)
- `app/checkout/cancel/page.tsx` (nieuw)

---

### Fase 6: Webhook Handler (1-1.5 uur)

#### 6.1 Mollie webhook endpoint
**Bestand:** `app/api/webhooks/mollie/+server.ts` (nieuw)

Endpoint: `POST /api/webhooks/mollie`

Flow:
1. Verifieer webhook (optioneel met secret)
2. Haal payment op bij Mollie
3. Als status = "paid":
   - Maak subscription aan in database
   - Verhoog `current_uses` van kortingscode (atomic)
   - Verstuur welkomstmail via Resend
4. Update payment status in database

---

### Fase 7: Email Templates (1 uur)

#### 7.1 Welkomstmail template
**Bestand:** `src/lib/emails/welcome.ts` (nieuw)

Email bevat:
- Bevestiging van betaling
- Welk abonnement is afgesloten
- Hoeveel korting is gekregen (als van toepassing)
- Link naar inloggen
- Startgids of tips

**Gebruik:** Resend API (al geïnstalleerd)

---

### Fase 8: Integratie & Testing (1-1.5 uur)

#### 8.1 Homepage CTA knoppen aanpassen
**Bestand:** `src/components/landing/PricingNew.tsx` (aanpassen)

Knoppen moeten linken naar `/checkout?plan=...&billing=...`

#### 8.2 Test data aanmaken
- 2-3 voorbeeld kortingscodes in database
- 1 verlopen code (voor testen)
- 1 code met max_uses = 1 (voor testen)

---

## 📋 Checklist per Fase

### Fase 1: Database ✅
- [ ] Migration bestand aanmaken
- [ ] `discount_codes` tabel aanmaken
- [ ] `subscriptions` tabel aanmaken
- [ ] Indexes aanmaken
- [ ] Atomic increment functie aanmaken
- [ ] Migration uitvoeren in Supabase

### Fase 2: Mollie Setup ✅
- [ ] Package installeren
- [ ] Environment variables toevoegen
- [ ] Mollie client configureren

### Fase 3: Kortingscode Validatie ✅
- [ ] Validatie functie schrijven
- [ ] API endpoint aanmaken
- [ ] Testen met verschillende scenarios

### Fase 4: Checkout Pagina ✅
- [ ] Checkout pagina component
- [ ] Kortingscode input component
- [ ] Prijs display component
- [ ] Real-time validatie
- [ ] Styling volgens styleguide

### Fase 5: Payment API ✅
- [ ] Payment creation endpoint
- [ ] Success pagina
- [ ] Cancel pagina
- [ ] Error handling

### Fase 6: Webhook Handler ✅
- [ ] Webhook endpoint
- [ ] Subscription aanmaken logica
- [ ] Kortingscode usage increment
- [ ] Email trigger

### Fase 7: Email Templates ✅
- [ ] Welkomstmail template
- [ ] Email helper functie
- [ ] Test email verzenden

### Fase 8: Integratie & Testing ✅
- [ ] Homepage CTA knoppen aanpassen
- [ ] Test data aanmaken
- [ ] End-to-end testen
- [ ] Edge cases testen

---

## 🔧 Technische Details

### Prijzen (uit specificatie):
- Maandelijks: €29,00 per maand
- Jaarlijks: €290,00 per jaar (€24,17 per maand)

### Kortingscode validatie volgorde:
1. Code bestaat? (case-insensitive)
2. Code is actief? (`is_active = true`)
3. Code is niet verlopen? (`valid_from <= now <= valid_until`)
4. Code niet over limiet? (`current_uses < max_uses` of `max_uses IS NULL`)

### Prijs berekening:
- Percentage: `originele_prijs * (percentage / 100)` = korting in euro's
- Vast bedrag: neem `discount_amount` veld
- Finale prijs: `originele_prijs - korting` (minimaal €0,01)

---

## 🚨 Belangrijke Opmerkingen

1. **Dubbele validatie:** Code wordt zowel in frontend als backend gevalideerd (security)
2. **Atomic operations:** `current_uses` increment moet atomic zijn (voorkomt race conditions)
3. **Case-insensitive:** Codes moeten werken met hoofdletters/kleine letters
4. **Minimum prijs:** Finale prijs mag nooit negatief zijn (minimaal €0,01)
5. **Webhook security:** Overweeg webhook secret verificatie

---

## 📝 Volgende Stappen

1. Start met Fase 1 (Database setup)
2. Test database migraties lokaal
3. Implementeer fase voor fase
4. Test elke fase voordat je doorgaat
5. Documenteer eventuele afwijkingen van de specificatie

---

**Totaal geschatte tijd:** 8-10 uur  
**Prioriteit:** 🔴 Kritiek (volgens MOLLIE-IMPLEMENTATIEPLAN.md)

