# 🚀 Mission Control — Bouwplan: Kortingscode Systeem

**Projectnaam:** DoBbie - Kortingscode & Mollie Payment Integratie  
**Versie:** v1.0  
**Datum:** 12 november 2025
**Auteur:** Development Team  

---

## 1. Doel en context

🎯 **Doel:** Implementeren van een volledig geautomatiseerd kortingscode systeem met Mollie payment integratie, waarmee gebruikers kortingscodes kunnen gebruiken bij het afsluiten van een chatbot-abonnement. Het hele proces - van invoeren van de code tot activeren van toegang - moet volledig geautomatiseerd zijn.

📘 **Toelichting:** Dit systeem maakt het mogelijk voor Talar om vanuit webinars (of andere marketingacties) kortingscodes uit te delen. Deelnemers kunnen deze codes gebruiken bij het afsluiten van een abonnement om korting te krijgen. De implementatie omvat database uitbreidingen, checkout pagina, payment API's, webhook handlers en email automatisering.

**Referenties:**
- Functionele specificatie: `docs/kortingscode-spec.md`
- Technisch implementatieplan: `docs/IMPLEMENTATIEPLAN-KORTINGSCODE.md`
- Mollie implementatieplan: `docs/MOLLIE-IMPLEMENTATIEPLAN.md`

---

## 2. Uitgangspunten

### 2.1 Technische Stack

**Frontend:**
- Next.js 15.1.6 (React 19)
- TypeScript
- Tailwind CSS
- Lucide React Icons

**Backend:**
- Next.js API Routes
- Supabase (PostgreSQL database)
- Mollie API Client (`@mollie/api-client`)

**Services:**
- Supabase Auth & Database
- Mollie Payment Gateway
- Resend API (voor email)

**Hosting:**
- Vercel (Next.js deployment)

### 2.2 Projectkaders

- **Tijd:** 12-14 uur geschatte bouwtijd (inclusief admin dashboard)
- **Prioriteit:** 🔴 Kritiek (deadline: 20 november 2025)
- **Team:** 1 developer
- **Data:** Test data wordt aangemaakt via admin dashboard (niet meer Supabase dashboard)
- **Doel:** Werkend kortingscode systeem met volledige payment flow + admin interface voor non-technische gebruikers

### 2.3 Programmeer Uitgangspunten

**Code Quality Principles:**

- **DRY (Don't Repeat Yourself)**
  - Herbruikbare prijsberekening functies
  - Centrale kortingscode validatie logica
  - Shared types voor payment/discount data

- **KISS (Keep It Simple, Stupid)**
  - Eenvoudige checkout flow zonder onnodige complexiteit
  - Duidelijke error messages voor gebruikers
  - Directe feedback bij kortingscode validatie

- **SOC (Separation of Concerns)**
  - UI componenten gescheiden van business logic
  - Payment API calls in dedicated service layer
  - Database queries in repository functions
  - Email templates in separate module

- **YAGNI (You Aren't Gonna Need It)**
  - Start met basis kortingscode functionaliteit
  - Admin interface komt later (start met Supabase dashboard)
  - Geen premature features voor rapportage

**Development Practices:**

- **Code Organization**
  - `/app/api/payment/*` voor payment endpoints
  - `/app/api/webhooks/*` voor webhook handlers
  - `/src/lib/payment/*` voor payment business logic
  - `/src/lib/mollie/*` voor Mollie client configuratie
  - `/src/components/checkout/*` voor checkout UI componenten

- **Error Handling**
  - Try-catch blocks op alle async operaties
  - User-friendly foutmeldingen in UI
  - Logging van errors naar console
  - Graceful degradation bij Mollie API failures

- **Security**
  - Kortingscode validatie zowel frontend als backend (dubbele validatie)
  - Atomic operations voor `current_uses` increment (voorkomt race conditions)
  - Webhook secret verificatie (optioneel maar aanbevolen)
  - Input validation op alle user input

- **Performance**
  - Real-time prijs update zonder page reload
  - Debounce op kortingscode input (optioneel)
  - Optimized database queries met indexes

- **Testing**
  - Manual testing van happy path flows
  - Edge cases: verlopen codes, volle codes, race conditions
  - Integration tests voor webhook handler

---

## 3. Epics & Stories Overzicht

| Epic ID | Titel | Doel | Status | Stories | Opmerkingen |
|---------|-------|------|--------|---------|-------------|
| E1 | Database Setup | Discount codes tabel + subscriptions uitbreiding | ✅ Completed | 3 | Migratie bestand aanmaken |
| E2 | Mollie Setup | Mollie package + client configuratie | ✅ Completed | 3 | Environment variables nodig |
| E3 | Kortingscode Validatie | Validatie logica + API endpoint | ✅ Completed | 2 | Frontend + backend validatie |
| E4 | Checkout Pagina | UI voor plan selectie + kortingscode input | ⏳ To Do | 3 | Real-time prijs update |
| E5 | Payment API | Payment creation + success/cancel pagina's | ⏳ To Do | 3 | Mollie integration |
| E6 | Webhook Handler | Mollie webhook + subscription activatie | ⏳ To Do | 4 | Email trigger |
| E7 | Email Templates | Welkomstmail met kortingscode info | ⏳ To Do | 2 | Resend API |
| E8 | Integratie & Testing | CTA knoppen + end-to-end testing | ⏳ To Do | 3 | Test data aanmaken |
| E9 | Admin Dashboard | Admin interface voor discount codes beheer | ⏳ To Do | 4 | Voor non-technische gebruikers |

---

## 4. Epics & Stories (Uitwerking)

### Epic 1 — Database Setup
**Epic Doel:** Database structuur aanmaken voor kortingscodes en subscriptions uitbreiden met discount velden.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E1.S1 | Discount codes tabel aanmaken | `discount_codes` tabel bestaat met alle velden + indexes | ✅ | — | 2 |
| E1.S2 | Subscriptions tabel uitbreiden | `discount_code`, `discount_amount`, `original_price` velden toegevoegd | ✅ | E1.S1 | 1 |
| E1.S3 | Atomic increment functie | Database functie `increment_discount_code_uses()` werkt | ✅ | E1.S1 | 2 |

**Technical Notes:**
- Migratie bestand: `src/lib/supabase/migrations/YYYYMMDD_create_discount_codes_system.sql`
- `discount_codes` tabel: `discount_percentage` OF `discount_amount` (niet beide)
- `max_uses` kan `NULL` zijn (onbeperkt gebruik)
- Case-insensitive code lookups via `UPPER(code)` index
- RLS policies: iedereen kan actieve codes lezen, alleen service role kan schrijven

**Database Schema:**
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
```

---

### Epic 2 — Mollie Setup
**Epic Doel:** Mollie package installeren en client configureren voor payment integratie.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E2.S1 | Mollie package installeren | `@mollie/api-client` in `package.json` | ✅ | — | 1 |
| E2.S2 | Environment variables | `MOLLIE_API_KEY` en `MOLLIE_WEBHOOK_SECRET` geconfigureerd | ✅ | E2.S1 | 1 |
| E2.S3 | Mollie client configureren | `src/lib/mollie/client.ts` bestaat en exporteert client | ✅ | E2.S2 | 1 |

**Technical Notes:**
- Package: `pnpm add @mollie/api-client`
- Environment variables in `.env.local` (niet committen)
- Client configuratie met error handling voor missing API key
- Type definities in `src/types/payment.ts`

---

### Epic 3 — Kortingscode Validatie
**Epic Doel:** Validatie logica voor kortingscodes met frontend en backend endpoints.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E3.S1 | Validatie functie | `validateDiscountCode()` werkt met alle validatie regels | ✅ | E1.S1 | 3 |
| E3.S2 | API endpoint | `POST /api/payment/validate-discount` retourneert validatie resultaat | ✅ | E3.S1 | 2 |

**Technical Notes:**
- Validatie volgorde:
  1. Code bestaat? (case-insensitive)
  2. Code is actief? (`is_active = true`)
  3. Code niet verlopen? (`valid_from <= now <= valid_until`)
  4. Code niet over limiet? (`current_uses < max_uses` of `max_uses IS NULL`)
- Request body: `{ code: string, plan: 'solo' | 'team', billing: 'monthly' | 'yearly' }`
- Response: `{ valid: boolean, discount?: {...}, error?: string }`
- Prijsberekening functie: `calculateDiscount(originalPrice, discountCode)`

**Prijzen (uit codebase):**
```typescript
const basePrices = {
  solo: { monthly: 49, yearly: 349 },
  team: { monthly: 39, yearly: 269 }
};
```

---

### Epic 4 — Checkout Pagina
**Epic Doel:** Gebruiksvriendelijke checkout pagina met plan selectie, kortingscode input en real-time prijs update.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E4.S1 | Checkout pagina component | `/checkout` pagina toont plan selectie + billing toggle | ⏳ | E3.S2 | 5 |
| E4.S2 | Kortingscode input | Input veld met "Toepassen" knop + real-time validatie | ⏳ | E4.S1 | 3 |
| E4.S3 | Prijs display component | Toont originele prijs, korting, finale prijs + bespaarbedrag | ⏳ | E4.S2 | 2 |

**Technical Notes:**
- URL structuur: `/checkout?plan=solo&billing=yearly&coupon=CODE`
- Plan selectie: Solo/Team radio buttons
- Billing toggle: Monthly/Yearly toggle
- Kortingscode input: Auto uppercase, trim whitespace
- Visuele feedback: Groen bij geldig, rood bij ongeldig
- Real-time prijs update zonder page reload
- "Betalen met Mollie" knop (disabled tot plan geselecteerd)

**UI Flow:**
```
┌─────────────────────────────────┐
│  Plan Selectie                  │
│  (•) Solo  ( ) Team             │
├─────────────────────────────────┤
│  Billing Period                 │
│  ( ) Monthly  (•) Yearly        │
├─────────────────────────────────┤
│  Kortingscode (optioneel)       │
│  [CODE] [Toepassen]            │
│  ✓ Korting van €X toegepast!   │
├─────────────────────────────────┤
│  Prijs Overzicht                │
│  Plan: Solo Yearly              │
│  Prijs: €349                    │
│  Korting: -€X (CODE)            │
│  ─────────────────────          │
│  Totaal: €XXX                   │
├─────────────────────────────────┤
│  [Betaal met Mollie]            │
└─────────────────────────────────┘
```

---

### Epic 5 — Payment API
**Epic Doel:** Payment creation endpoint en success/cancel redirect pagina's.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E5.S1 | Payment creation endpoint | `POST /api/payment/create` maakt Mollie payment aan | ⏳ | E2.S3, E3.S1 | 5 |
| E5.S2 | Success pagina | `/checkout/success` toont bevestiging | ⏳ | E5.S1 | 2 |
| E5.S3 | Cancel pagina | `/checkout/cancel` toont annulering | ⏳ | E5.S1 | 1 |

**Technical Notes:**
- Payment creation flow:
  1. Valideer kortingscode (nogmaals, voor security)
  2. Bereken finale prijs
  3. Maak Mollie payment aan met metadata
  4. Sla payment referentie op in database
  5. Return payment URL voor redirect
- Metadata in Mollie payment:
  - `userId`, `plan`, `billing`, `discountCode`, `discountAmount`, `originalPrice`
- Redirect URLs: `${SITE_URL}/checkout/success` en `/checkout/cancel`
- Error handling voor invalid codes, Mollie API failures

---

### Epic 6 — Webhook Handler
**Epic Doel:** Mollie webhook verwerken en subscription activeren na betaling.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E6.S1 | Webhook endpoint | `POST /api/webhooks/mollie` ontvangt en verwerkt events | ⏳ | E5.S1 | 3 |
| E6.S2 | Subscription aanmaken | Subscription wordt aangemaakt na succesvolle betaling | ⏳ | E6.S1, E1.S2 | 3 |
| E6.S3 | Kortingscode increment | `current_uses` wordt atomic verhoogd | ⏳ | E6.S2, E1.S3 | 2 |
| E6.S4 | Email trigger | Welkomstmail wordt verstuurd na betaling | ⏳ | E6.S2, E7.S1 | 2 |

**Technical Notes:**
- Webhook events: `payment.paid`, `payment.failed`, `payment.canceled`
- Flow bij `payment.paid`:
  1. Haal payment op bij Mollie
  2. Maak subscription aan in database
  3. Verhoog `current_uses` (atomic via database functie)
  4. Verstuur welkomstmail via Resend
  5. Update payment status
- Subscription velden:
  - `user_id`, `plan`, `status`, `discount_code`, `discount_amount`, `original_price`, `paid_price`
  - `start_date`, `end_date` (30 dagen voor monthly, 365 voor yearly)
  - `mollie_payment_id`

---

### Epic 7 — Email Templates
**Epic Doel:** Welkomstmail template met kortingscode informatie.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E7.S1 | Welkomstmail template | Email template met betaling bevestiging + korting info | ⏳ | — | 3 |
| E7.S2 | Email helper functie | Helper functie voor email verzending via Resend | ⏳ | E7.S1 | 2 |

**Technical Notes:**
- Email bevat:
  - Bevestiging van betaling
  - Welk abonnement is afgesloten (Solo/Team, Monthly/Yearly)
  - Hoeveel korting is gekregen (als van toepassing)
  - Link naar inloggen
  - Startgids of tips
- Gebruik Resend API (al geïnstalleerd)
- Template in `src/lib/emails/welcome.ts`

---

### Epic 8 — Integratie & Testing
**Epic Doel:** Homepage CTA knoppen aanpassen en end-to-end testing.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E8.S1 | CTA knoppen aanpassen | Pricing componenten linken naar `/checkout` met query params | ⏳ | E4.S1 | 2 |
| E8.S2 | Test data aanmaken | 2-3 voorbeeld kortingscodes in database | ⏳ | E1.S1 | 1 |
| E8.S3 | End-to-end testing | Volledige flow werkt: code invoeren → betalen → activatie | ⏳ | E6.S4 | 3 |

**Technical Notes:**
- CTA links: `/checkout?plan=solo&billing=yearly` (zonder coupon)
- Webinar pagina: `/checkout?plan=solo&billing=yearly&coupon=NVVA2025` (met pre-filled coupon)
- Test scenarios:
  - Happy path: geldige code → betaling → activatie
  - Zonder code: betaling zonder korting
  - Verlopen code: error message
  - Volle code: error message (als max_uses bereikt)
  - Race condition: twee gebruikers tegelijk laatste slot

---

### Epic 9 — Admin Dashboard
**Epic Doel:** Admin interface voor non-technische gebruikers om discount codes te beheren.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E9.S1 | Admin route protection | `/admin/discount-codes` alleen toegankelijk voor super_admin | ⏳ | — | 1 |
| E9.S2 | Discount codes overzicht | Overzichtspagina toont alle codes met status, uses, etc. | ⏳ | E9.S1, E1.S1 | 3 |
| E9.S3 | Code aanmaken formulier | Formulier om nieuwe codes aan te maken met validatie | ⏳ | E9.S2 | 5 |
| E9.S4 | Code bewerken/deactiveren | Codes kunnen worden bewerkt en geactiveerd/degeactiveerd | ⏳ | E9.S3 | 3 |

**Technical Notes:**
- Route: `/admin/discount-codes`
- Access control: Check `user_type = 'super_admin'` in server component
- Features:
  - Overzichtstabel met alle codes
  - Filter op actief/inactief
  - Sorteer op datum, uses, etc.
  - Formulier voor nieuwe code aanmaken
  - Edit modal voor bestaande codes
  - Activate/deactivate toggle
  - Usage statistics per code
- API endpoints:
  - `GET /api/admin/discount-codes` - Haal alle codes op
  - `POST /api/admin/discount-codes` - Maak nieuwe code aan
  - `PATCH /api/admin/discount-codes/[id]` - Update code
  - `DELETE /api/admin/discount-codes/[id]` - Deactiveer code (soft delete)

**UI Flow:**
```
┌─────────────────────────────────┐
│  Admin Dashboard                │
│  Discount Codes Beheer          │
├─────────────────────────────────┤
│  [+ Nieuwe Code]                │
├─────────────────────────────────┤
│  Filter: [Actief ▼] [Zoeken...]│
├─────────────────────────────────┤
│  Code      │ Type │ Uses │ Status│
│  WEBINAR25 │ 20%  │ 45/100│ ✓ Actief│
│  EARLYBIRD │ €50  │ 12/25 │ ✓ Actief│
│  TEST123   │ 10%  │ 5/5   │ ✗ Vol │
└─────────────────────────────────┘
```

**Formulier velden:**
- Code naam (text, required, uppercase)
- Korting type (radio: percentage / vast bedrag)
- Korting waarde (number, required)
- Geldig van (date)
- Geldig tot (date, optional)
- Max uses (number, optional - NULL = onbeperkt)
- Actief (checkbox, default: true)

---

## 5. Kwaliteit & Testplan

### Test Types

| Test Type | Scope | Tools | Verantwoordelijke |
|-----------|-------|-------|-------------------|
| Manual Tests | Happy path flows | Browser DevTools | Developer |
| Integration Tests | API endpoints | Postman / curl | Developer |
| Edge Case Tests | Verlopen codes, race conditions | Manual testing | Developer |
| Security Tests | Dubbele validatie, atomic operations | Code review | Developer |

### Test Coverage Targets

- **Manual tests:** Alle happy flows + 3 edge cases
- **Integration tests:** Alle API endpoints (validate-discount, create payment, webhook)
- **Security tests:** Dubbele validatie, atomic increment, webhook verification

### Manual Test Checklist

**Happy Path:**
- [ ] Gebruiker kan plan selecteren (Solo/Team)
- [ ] Gebruiker kan billing period selecteren (Monthly/Yearly)
- [ ] Gebruiker kan kortingscode invoeren en valideren
- [ ] Prijs update real-time bij kortingscode
- [ ] Betaling gaat door naar Mollie met juiste bedrag
- [ ] Webhook maakt subscription aan na betaling
- [ ] Kortingscode `current_uses` wordt verhoogd
- [ ] Welkomstmail wordt verstuurd

**Edge Cases:**
- [ ] Verlopen code wordt geweigerd met juiste error message
- [ ] Volle code (max_uses bereikt) wordt geweigerd
- [ ] Code met hoofdletters/kleine letters werkt
- [ ] Code met spaties werkt (trim whitespace)
- [ ] Betaling zonder kortingscode werkt
- [ ] Race condition bij max_uses wordt correct afgehandeld

**Error Handling:**
- [ ] Ongeldige code toont user-friendly error
- [ ] Mollie API failure wordt graceful afgehandeld
- [ ] Webhook met invalid signature wordt geweigerd
- [ ] Database errors worden gelogd

---

## 6. Demo & Presentatieplan

### Demo Scenario
**Duur:** 5 minuten  
**Doelgroep:** Talar (opdrachtgever)  
**Locatie:** Development omgeving (localhost of staging)

**Flow:**
1. **Checkout pagina** (1 min): Plan selectie, billing toggle, kortingscode input
2. **Kortingscode validatie** (1 min): Code invoeren, real-time validatie, prijs update
3. **Betaling flow** (1 min): Mollie payment aanmaken, redirect naar Mollie
4. **Webhook verwerking** (1 min): Betaling simuleren, subscription activatie
5. **Email verificatie** (1 min): Welkomstmail tonen, korting info checken

**Backup Plan:**
- Screenshots van alle stappen als demo niet werkt
- Test data klaar in database
- Mock Mollie responses voor offline demo

---

## 7. Risico's & Mitigatie

| Risico | Kans | Impact | Mitigatie | Owner |
|--------|------|--------|-----------|-------|
| Race condition bij max_uses | Hoog | Hoog | Atomic increment functie gebruiken | Developer |
| Kortingscode validatie bypass | Middel | Hoog | Dubbele validatie (frontend + backend) | Developer |
| Mollie API downtime | Laag | Hoog | Graceful error handling, retry logic | Developer |
| Webhook niet bereikbaar | Middel | Hoog | Mollie webhook URL configureren, testen | Developer |
| Email niet verstuurd | Middel | Middel | Logging, fallback naar admin notificatie | Developer |
| Prijs berekening fout | Laag | Hoog | Unit tests voor prijsberekening | Developer |
| Database migratie faalt | Laag | Hoog | Test migratie eerst op staging | Developer |

---

## 8. Evaluatie & Lessons Learned

**Te documenteren na implementatie:**
- Werkt de atomic increment functie correct bij race conditions?
- Zijn de error messages duidelijk voor gebruikers?
- Is de checkout flow gebruiksvriendelijk?
- Werkt de webhook betrouwbaar?
- Zijn er performance issues bij real-time validatie?
- Wat kunnen we verbeteren voor volgende iteratie?

---

## 9. Referenties

**Mission Control Documents:**
- **Functionele Specificatie:** `docs/kortingscode-spec.md`
- **Technisch Implementatieplan:** `docs/IMPLEMENTATIEPLAN-KORTINGSCODE.md`
- **Mollie Implementatieplan:** `docs/MOLLIE-IMPLEMENTATIEPLAN.md`

**External Resources:**
- Mollie API Documentatie: https://docs.mollie.com/
- Supabase Database Migrations: `src/lib/supabase/migrations/`
- Resend API Documentatie: https://resend.com/docs

**Codebase Referenties:**
- Prijzen: `src/content/nl/pricing.json`
- Pricing Componenten: `src/components/landing/PricingNew.tsx`
- Supabase Client: `src/lib/supabase/server.ts`

---

## 10. Glossary & Abbreviations

| Term | Betekenis |
|------|-----------|
| Epic | Grote feature of fase in development (bevat meerdere stories) |
| Story | Kleine, uitvoerbare taak binnen een epic |
| Story Points | Schatting van complexiteit (Fibonacci: 1, 2, 3, 5, 8, 13) |
| RLS | Row Level Security (Supabase database security) |
| Atomic Operation | Database operatie die niet onderbroken kan worden (voorkomt race conditions) |
| Webhook | HTTP callback van externe service (Mollie) naar onze server |
| CTA | Call To Action (knop of link die actie uitlokt) |

---

## 11. Belangrijke Aanpassingen t.o.v. Originele Spec

**Prijzen (uit codebase - leidend):**
- Solo: €49/month, €349/year (niet €29/€290 uit spec)
- Team: €39/month, €269/year

**Plan Structuur:**
- Plan types: `solo` | `team` (niet alleen `monthly`/`yearly`)
- Billing period: `monthly` | `yearly`
- Checkout URL: `/checkout?plan=solo&billing=yearly&coupon=CODE`

**Kortingscode:**
- Geen limiet: `max_uses` kan `NULL` zijn (onbeperkt gebruik)
- Structuur: `discount_percentage` OF `discount_amount` (niet beide)

**Database:**
- `subscriptions` tabel bestaat al, moet uitgebreid worden (niet aangemaakt)
- `payments` tabel bestaat al (kan gebruikt worden voor tracking)

---

**Versiehistorie:**

| Versie | Datum | Auteur | Wijziging |
|--------|-------|--------|-----------|
| v1.0 | 27-01-2025 | Development Team | Initiële versie gebaseerd op IMPLEMENTATIEPLAN-KORTINGSCODE.md |

