# 🚀 Mission Control — Bouwplan: MVP Checkout Flow zonder Trial

**Projectnaam:** DoBbie MVP Checkout Flow  
**Versie:** v1.0  
**Datum:** 20-01-2025  
**Auteur:** Development Team

---

## 1. Doel en context

🎯 **Doel:** Implementeren van een werkende checkout flow voor nieuwe users en expired users zonder trial functionaliteit. Gebruikers moeten direct kunnen betalen na registratie of bij account reactivatie.

📘 **Toelichting:**  
De klant heeft aangegeven geen trial meer te willen. In plaats daarvan gebruiken we kortingscodes voor nieuwe gebruikers. We implementeren twee primaire routes:
1. **Nieuwe users:** Registratie → Automatisch inloggen → Checkout → Betaling → Actief account
2. **Expired users:** Login → Checkout → Betaling → Account gereactiveerd

De trial functionaliteit wordt tijdelijk uitgeschakeld (niet verwijderd) voor latere cleanup. Organisatie code functionaliteit blijft behouden voor toekomstige team/organisatie accounts.

**Referenties:**
- `docs/kortingscode-spec.md` - Kortingscode specificatie
- `docs/IMPLEMENTATIEPLAN-KORTINGSCODE.md` - Implementatieplan kortingscodes
- `docs/BOUWPLAN-KORTINGSCODE.md` - Bouwplan kortingscodes

---

## 2. Uitgangspunten

### 2.1 Technische Stack

- **Frontend:** Next.js 14 (App Router) + React + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes + Server Actions
- **Database:** Supabase (PostgreSQL)
- **Payment:** Mollie Payment API
- **Auth:** Supabase Auth
- **Hosting:** Vercel
- **State Management:** Zustand (userStore)

### 2.2 Projectkaders

- **Tijd:** 1-2 dagen bouwtijd voor MVP
- **Budget:** Geen extra kosten (bestaande Mollie account)
- **Team:** 1 developer
- **Scope:** MVP - alleen nieuwe users en expired users flows
- **Trial:** Uitgeschakeld (niet verwijderd) voor latere cleanup
- **Organisatie code:** Behouden voor toekomstige features

### 2.3 Programmeer Uitgangspunten

**Code Quality Principles:**
- **DRY:** Herbruikbare auth check functies, gecentraliseerde redirect logica
- **KISS:** Eenvoudige redirect flows, geen complexe state machines
- **SOC:** Auth checks in middleware/layout, payment logic in API routes
- **YAGNI:** Alleen MVP features, geen plan change flow of upgrade flows

**Development Practices:**
- **Error Handling:** Try-catch op alle async operaties, user-friendly error messages
- **Security:** Auth checks op alle protected routes, input validation op checkout
- **Performance:** Debounce op discount code validation, lazy loading waar mogelijk
- **Testing:** Manual smoke tests voor beide flows

---

## 3. Epics & Stories Overzicht

| Epic ID | Titel | Doel | Status | Stories | Opmerkingen |
|---------|-------|------|--------|---------|-------------|
| E1 | Trial Uitschakelen | Trial functionaliteit tijdelijk uitzetten | ✅ Voltooid | 2 | Voor latere cleanup |
| E2 | Registratie Flow | Auto-login + redirect naar checkout | ✅ Voltooid | 2 | Stap 2A implementatie |
| E3 | Checkout Auth Check | Auth check + redirect logica | ✅ Voltooid | 4 | Stap 2B implementatie |
| E4 | Subscription Status Update | Webhook update naar 'active' | ✅ Voltooid | 2 | Na betaling activeren |
| E5 | Chat Access Control | Alleen 'active' users toegang | ✅ Voltooid | 2 | Protect /chat route |
| E6 | Testing & Validation | Smoke tests en validatie | ⏳ To Do | 2 | Manual testing |

---

## 4. Epics & Stories (Uitwerking)

### Epic 1 — Trial Uitschakelen
**Epic Doel:** Trial functionaliteit tijdelijk uitschakelen zonder te verwijderen (voor latere cleanup).

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E1.S1 | Trial checks uitschakelen | Geen trial status checks meer in code | ✅ | — | 2 |
| E1.S2 | Default status naar 'inactive' | Nieuwe users krijgen 'inactive' status | ✅ | E1.S1 | 1 |

**Technical Notes:**
- **Trial checks:** Geen trial checks gevonden in huidige `app/chat/layout.tsx` (mogelijk al verwijderd)
- **Database update:** Update default `subscription_status` naar 'inactive' in database trigger/constraint
- **Nieuwe users:** Krijgen automatisch 'inactive' status bij registratie (via `handle_new_user` trigger)
- **Bestaande users:** Users met 'trial' status blijven 'trial' (worden niet automatisch geüpdatet naar 'inactive')
  - Trial users kunnen nog steeds betalen en worden dan 'active'
  - Trial status wordt alleen gebruikt voor bestaande accounts, nieuwe accounts krijgen 'inactive'
- Trial code blijft aanwezig maar wordt niet uitgevoerd (voor latere cleanup)

**Bestanden:**
- `src/lib/supabase/migrations/20250120_disable_trial_default.sql` - Database update
  - Update `handle_new_user` trigger om `subscription_status = 'inactive'` te zetten
  - Update constraint om 'inactive' toe te voegen aan allowed values (als nodig)

**Database Changes:**
```sql
-- Update handle_new_user trigger om 'inactive' als default te zetten
-- Update constraint om 'inactive' toe te voegen (als nog niet aanwezig)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_subscription_status_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_status_check 
CHECK (subscription_status IN (
  'inactive',  -- Nieuwe users zonder betaling
  'active',    -- Actieve betaling
  'expired',   -- Verlopen account
  'blocked'    -- Admin blocked
));
```

---

### Epic 2 — Registratie Flow (Stap 2A)
**Epic Doel:** Na registratie automatisch inloggen en redirect naar checkout.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E2.S1 | Auto-login na registratie | User automatisch ingelogd na signUp | ✅ | — | 3 |
| E2.S2 | Redirect naar checkout | Na registratie → /checkout?new=true | ✅ | E2.S1 | 1 |

**Technical Notes:**
- **Implementatie:** Gebruik direct `supabase.auth.signUp()` in `app/(auth)/register/page.tsx` (huidige implementatie)
- Supabase `signUp` retourneert session als email confirmation disabled
- Check `data.session` na signUp
- Als session bestaat: redirect naar `/checkout?new=true` (nieuwe user indicator)
- Als geen session: redirect naar `/login?redirect=/checkout&new=true` (email confirmation vereist)
- **Query parameter `new=true`:** Geeft aan dat dit een nieuwe user is die net geregistreerd heeft (optioneel voor UI/analytics)
- **Email confirmation:** Als email confirmation enabled is in Supabase, krijgt user eerst bevestigingsmail. Na bevestiging kan user inloggen en wordt automatisch naar checkout geredirect via login redirect parameter (E3.S3)
- **Default subscription_status:** Nieuwe users krijgen automatisch 'inactive' status via `handle_new_user` database trigger (Epic 1.S2)

**Bestanden:**
- `app/(auth)/register/page.tsx` - Handle submit aanpassen (regel 23-73)

**Code Changes:**
```typescript
// In handleSubmit functie, na succesvolle signUp (regel 41-50):
const { data, error: signUpError } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: fullName,
      organization: organization,
    },
  },
});

if (signUpError) throw signUpError;

// Vervang huidige success flow (regel 54-58):
if (data.session) {
  // Automatisch ingelogd - redirect naar checkout
  router.push('/checkout?new=true');
} else {
  // Email confirmation vereist - redirect naar login met return URL
  router.push('/login?redirect=/checkout&new=true');
}
```

---

### Epic 3 — Checkout Auth Check (Stap 2B)
**Epic Doel:** Checkout pagina controleert auth status en redirect indien nodig.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E3.S1 | Auth check in checkout | Check auth status bij mount | ✅ | — | 2 |
| E3.S2 | Redirect naar login | Als niet ingelogd: redirect met return URL | ✅ | E3.S1 | 2 |
| E3.S3 | Login redirect parameter | Login page ondersteunt redirect parameter | ✅ | E3.S2 | 2 |
| E3.S4 | Auth callback redirect | Auth callback handler ondersteunt redirect parameter | ✅ | E3.S3 | 1 |

**Technical Notes:**
- **Implementatie:** Client-side auth check in `useEffect` bij mount (checkout is geen protected route in middleware)
- Check auth in `useEffect` bij mount met `supabase.auth.getUser()`
- Als niet ingelogd: redirect naar `/login?redirect=/checkout&plan=...&billing=...&coupon=...`
- Login page haalt `redirect` parameter op en gebruikt na succesvolle login
- **Auth callback handler:** Als user email bevestigt via email link, komt hij op `/auth/callback` terecht. Deze handler moet ook `redirect` parameter ondersteunen (of `next` parameter gebruiken) om naar checkout te redirecten
- Behoud alle query parameters (plan, billing, coupon, new, renew)
- **Query parameters:**
  - `new=true`: Nieuwe user die net geregistreerd heeft (optioneel voor UI)
  - `renew=true`: Expired user die account wil reactiveren (optioneel voor UI)
  - `plan`, `billing`, `coupon`: Plan selectie en kortingscode (behouden bij redirect)

**Bestanden:**
- `app/checkout/page.tsx` - Auth check toevoegen (toevoegen aan bestaande component)
- `app/(auth)/login/page.tsx` - Redirect parameter ondersteuning
- `app/api/auth/callback/route.ts` - Redirect parameter ondersteuning voor email confirmation flow

**Code Changes:**
```typescript
// In checkout/page.tsx (toevoegen aan CheckoutContent component):
useEffect(() => {
  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Behoud alle query parameters bij redirect
      const params = new URLSearchParams({
        redirect: `/checkout?plan=${plan}&billing=${billing}`,
        ...(discountCode && { coupon: discountCode }),
        ...(searchParams.get('new') && { new: 'true' }),
        ...(searchParams.get('renew') && { renew: 'true' })
      });
      router.push(`/login?${params.toString()}`);
    }
  };
  checkAuth();
}, [plan, billing, discountCode, searchParams, router]);

// In login/page.tsx (regel 10-52):
// Voeg useSearchParams import toe bovenaan (als nog niet aanwezig)
import { useSearchParams } from 'next/navigation';

// In component:
const searchParams = useSearchParams();
const redirectParam = searchParams.get('redirect');

// Vervang huidige redirect in handleSubmit (regel 35):
// OUD: window.location.href = '/chat';
// NIEUW:
const redirectUrl = redirectParam || '/chat';
window.location.href = redirectUrl; // Gebruik window.location voor volledige redirect met query params
```

**Auth Callback Handler (E3.S4):**
```typescript
// In app/api/auth/callback/route.ts (regel 4-34):
// Huidige code gebruikt 'next' parameter, maar we moeten ook 'redirect' ondersteunen voor consistentie
// OF: gebruik 'next' parameter en pas registratie flow aan om 'next' te gebruiken i.p.v. 'redirect'

// Optie A: Ondersteun beide parameters (meest flexibel)
const next = requestUrl.searchParams.get('next') || requestUrl.searchParams.get('redirect') || '/chat';

// Optie B: Gebruik alleen 'next' en pas registratie flow aan
// In register/page.tsx: router.push('/login?next=/checkout&new=true');
// Dan in callback: const next = requestUrl.searchParams.get('next') || '/chat';

// Aanbeveling: Optie A voor backward compatibility
```

---

### Epic 4 — Subscription Status Update
**Epic Doel:** Webhook update subscription_status naar 'active' na succesvolle betaling.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E4.S1 | Webhook status update | Update profiles.subscription_status naar 'active' | ✅ | E6.S2 (Kortingscode plan) | 3 |
| E4.S2 | Expired user reactivatie | Expired users worden gereactiveerd na betaling | ✅ | E4.S1 | 1 |

**Technical Notes:**
- **Integratie met Kortingscode plan:** Deze epic werkt samen met Epic 6 uit `BOUWPLAN-KORTINGSCODE.md`
- **Volgorde in webhook:** Na `createSubscription` (E6.S2 uit kortingscode plan) moet `profiles.subscription_status` geüpdatet worden
- **Locatie:** In `app/api/webhooks/mollie/route.ts` in de `case 'paid':` block, direct na `createSubscription` call (regel 107-117)
- Update `profiles` table: `subscription_status = 'active'`
- Werkt voor nieuwe users (inactive → active) en expired users (expired → active)
- **Belangrijk:** Beide operaties (subscription aanmaken + status updaten) moeten in dezelfde webhook call gebeuren voor consistente state
- **Idempotency:** Profile update is idempotent (meerdere updates naar 'active' hebbenzelfde resultaat), maar subscription creation heeft al idempotency check via `subscriptionExistsForPayment`
- **Error handling:** Als profile update faalt maar subscription creation slaagt, loggen we error maar continueren (subscription bestaat al, user kan later handmatig geactiveerd worden indien nodig)

**Bestanden:**
- `app/api/webhooks/mollie/route.ts` - Status update toevoegen na regel 117

**Code Changes:**
```typescript
// In app/api/webhooks/mollie/route.ts, na createSubscription (regel 107-117):
// E4.S1 - Update subscription_status naar 'active'
const { error: profileError } = await supabase
  .from('profiles')
  .update({ 
    subscription_status: 'active',
    updated_at: new Date().toISOString()
  })
  .eq('id', metadata.userId);

if (profileError) {
  console.error('[Webhook] Error updating profile status:', profileError);
  // Continue - subscription is al aangemaakt, maar log error voor monitoring
} else {
  console.log(`[Webhook] Updated profile ${metadata.userId} subscription_status to 'active'`);
}

// Daarna volgt E6.S3 (increment discount code) en E6.S4 (send email)
```

---

### Epic 5 — Chat Access Control
**Epic Doel:** Alleen users met 'active' subscription_status hebben toegang tot /chat.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E5.S1 | Subscription check in layout | Check subscription_status uit profiles table | ✅ | E4.S1 | 3 |
| E5.S2 | Redirect naar checkout | Als 'inactive' of 'expired': redirect naar checkout | ✅ | E5.S1 | 2 |

**Technical Notes:**
- **Waarom database query (niet user_metadata):**
  - Webhooks updaten `profiles.subscription_status` direct in database (Epic 4)
  - Real-time checks nodig: user moet direct toegang krijgen na betaling zonder re-login
  - Database is single source of truth (consistent met `contact/page.tsx` en `useUserStore.ts`)
  - Acceptabele performance: server component kan database queryen
- **Implementatie:** In `app/chat/layout.tsx` na auth check (regel 18-21)
- Haal `subscription_status` op uit `profiles` table via database query
- Als 'inactive' of 'expired': redirect naar `/checkout?renew=true`
- Alleen 'active' users hebben toegang
- **Belangrijk:** Vervang huidige `user_metadata?.subscription_status` check (regel 32) met database query
- **Database error handling:** Als database query faalt (bijv. database down):
  - Log error voor monitoring
  - **Fallback strategie:** Laat user door (fail-open) om UX niet te blokkeren bij database issues
  - Stuur monitoring alert voor snelle detectie van database problemen
  - **Security trade-off:** Bij database downtime kunnen inactive users tijdelijk toegang krijgen, maar dit is acceptabel gezien database downtime zeldzaam is en UX belangrijker is dan perfecte security in dit scenario

**Bestanden:**
- `app/chat/layout.tsx` - Subscription check toevoegen na regel 21

**Code Changes:**
```typescript
// In app/chat/layout.tsx, na auth check (regel 18-21):
if (!user) {
  console.log('🚫 [ChatLayout] No user found, redirecting to /login');
  redirect('/login');
}

// E5.S1 - Check subscription_status uit database (niet user_metadata)
const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('subscription_status')
  .eq('id', user.id)
  .single();

// E5.S2 - Redirect als niet actief
// Database error handling: bij error laten we user door (fail-open voor UX)
if (profileError) {
  console.error(`⚠️ [ChatLayout] Database error checking subscription_status for user ${user.id}:`, profileError);
  // Fail-open: laat user door bij database errors (monitoring alert wordt gestuurd)
  // Dit voorkomt dat users geblokkeerd worden bij database downtime
} else if (!profile || profile.subscription_status !== 'active') {
  console.log(`🚫 [ChatLayout] User ${user.id} subscription_status: ${profile?.subscription_status || 'unknown'}, redirecting to checkout`);
  redirect('/checkout?renew=true');
}

console.log('✅ [ChatLayout] User authenticated and subscription active, rendering chat');

// Vervang huidige userData object (regel 26-34) - subscription_status komt nu uit profile
const userData = {
  id: user.id,
  email: user.email ?? (user.user_metadata?.email as string | undefined) ?? '',
  full_name: user.user_metadata?.full_name,
  account_type: user.user_metadata?.account_type,
  organization_id: user.user_metadata?.organization_id,
  subscription_status: profile.subscription_status, // Gebruik database waarde
  role: user.user_metadata?.role ?? 'user',
};
```

---

### Epic 6 — Testing & Validation
**Epic Doel:** Validatie van beide flows en edge cases.

| Story ID | Beschrijving | Acceptatiecriteria | Status | Afhankelijkheden | Story Points |
|----------|--------------|---------------------|--------|------------------|--------------|
| E6.S1 | Smoke tests nieuwe user flow | Volledige flow werkt end-to-end | ⏳ | E2.S2, E3.S3, E4.S1, E5.S2 | 3 |
| E6.S2 | Smoke tests expired user flow | Expired user kan account reactiveren | ⏳ | E3.S3, E4.S2, E5.S2 | 2 |

**Technical Notes:**
- Manual testing checklist
- Test beide flows volledig
- Test edge cases (geen redirect parameter, invalid payment, etc.)
- **Test setup vereisten:**
  - Test accounts nodig:
    1. Account met 'inactive' status (nieuwe user simulatie)
    2. Account met 'expired' status (expired user simulatie)
    3. Account met 'active' status (negatieve test - mag niet geredirect worden)
    4. Account met 'trial' status (bestaande user - moet kunnen betalen)
  - Mollie test mode credentials
  - Email confirmation status checken in Supabase dashboard (aan/uit)
  - Test zowel met als zonder email confirmation enabled

---

## 5. Kwaliteit & Testplan

### Test Types

| Test Type | Scope | Tools | Verantwoordelijke |
|-----------|-------|-------|-------------------|
| Manual Smoke Tests | Beide user flows | Browser DevTools | Developer |
| Integration Tests | API endpoints | Manual API calls | Developer |
| Security Tests | Auth checks, redirects | Manual testing | Developer |

### Test Coverage Targets
- **Smoke tests:** 2 complete flows (nieuwe user + expired user)
- **Edge cases:** 3 scenario's (geen redirect, invalid payment, expired session)

### Manual Test Checklist

#### Nieuwe User Flow (Stap 2A)
- [ ] User kan registreren op `/register`
- [ ] Na registratie wordt user automatisch ingelogd
- [ ] Redirect naar `/checkout?new=true` werkt
- [ ] Plan selectie werkt op checkout pagina
- [ ] Kortingscode validatie werkt
- [ ] Betaling kan worden aangemaakt
- [ ] Na betaling wordt subscription_status 'active'
- [ ] User heeft toegang tot `/chat` na betaling

#### Expired User Flow (Stap 2B)
- [ ] Expired user kan inloggen
- [ ] Expired user wordt geredirect naar `/checkout?renew=true`
- [ ] Checkout pagina toont "Account verlopen" banner (optioneel)
- [ ] Betaling kan worden aangemaakt
- [ ] Na betaling wordt subscription_status 'active'
- [ ] User heeft toegang tot `/chat` na betaling

#### Edge Cases
- [ ] Direct naar `/checkout` zonder login → redirect naar login
- [ ] Login met redirect parameter → terug naar checkout met parameters
- [ ] Email confirmation flow → user bevestigt email → redirect naar checkout via callback
- [ ] Betaling geannuleerd → user kan opnieuw proberen
- [ ] Webhook faalt → subscription wordt later geactiveerd (retry)
- [ ] Database error bij chat access check → user krijgt toegang (fail-open)
- [ ] Webhook retry → idempotent (geen dubbele subscriptions of updates)
- [ ] Bestaande trial user kan betalen → wordt 'active'

---

## 6. Demo & Presentatieplan

### Demo Scenario
**Duur:** 5 minuten  
**Doelgroep:** Klant (Talar)  
**Locatie:** Development omgeving (localhost of staging)

**Flow:**
1. **Nieuwe User Flow** (2 min):
   - Registratie op `/register`
   - Automatisch redirect naar checkout
   - Plan selectie + kortingscode
   - Betaling via Mollie test mode
   - Success pagina + toegang tot chat

2. **Expired User Flow** (2 min):
   - Login met expired account
   - Redirect naar checkout
   - Betaling via Mollie test mode
   - Account gereactiveerd + toegang tot chat

3. **Afsluiting** (1 min): Vragen + next steps

**Backup Plan:**
- Screenshots van flows als fallback
- Test accounts voorbereid voor demo

---

## 7. Risico's & Mitigatie

| Risico | Kans | Impact | Mitigatie | Owner |
|--------|------|--------|-----------|-------|
| Auto-login werkt niet | Middel | Hoog | Fallback naar login redirect | Developer |
| Redirect parameters verloren | Laag | Middel | URLSearchParams gebruiken, testen | Developer |
| Webhook faalt | Laag | Hoog | Retry mechanisme, manual activation mogelijk | Developer |
| Subscription status niet geüpdatet | Middel | Hoog | Logging + monitoring, manual check | Developer |
| Expired users kunnen niet betalen | Laag | Hoog | Testen met expired test account | Developer |
| Trial code interfereert | Laag | Laag | Trial checks uitschakelen (niet verwijderen) | Developer |
| Database error blokkeert actieve users | Laag | Hoog | Fail-open strategie bij database errors | Developer |
| Auth callback redirect werkt niet | Middel | Middel | Testen email confirmation flow, callback handler aanpassen | Developer |
| Webhook profile update faalt | Middel | Hoog | Error logging + monitoring, manual activation mogelijk | Developer |

---

## 8. Evaluatie & Lessons Learned

**Te documenteren na implementatie:**
- Werkt auto-login consistent?
- Zijn redirect flows gebruiksvriendelijk?
- Zijn er edge cases die we gemist hebben?
- Moet trial code volledig verwijderd worden?
- Zijn er performance issues met auth checks?

---

## 9. Referenties

**Mission Control Documents:**
- `docs/kortingscode-spec.md` - Kortingscode specificatie
- `docs/IMPLEMENTATIEPLAN-KORTINGSCODE.md` - Implementatieplan
- `docs/BOUWPLAN-KORTINGSCODE.md` - Bouwplan kortingscodes
- `docs/MOLLIE-IMPLEMENTATIEPLAN.md` - Mollie implementatie

**External Resources:**
- Mollie API Docs: https://docs.mollie.com/
- Supabase Auth Docs: https://supabase.com/docs/guides/auth
- Next.js App Router: https://nextjs.org/docs/app

---

## 10. Glossary & Abbreviations

| Term | Betekenis |
|------|-----------|
| MVP | Minimum Viable Product |
| Epic | Grote feature of fase in development |
| Story | Kleine, uitvoerbare taak binnen een epic |
| Stap 2A | Registratie → Auto-login → Checkout flow |
| Stap 2B | Direct Checkout → Auth check → Login → Checkout flow |
| Trial | Gratis proefperiode (nu uitgeschakeld) |
| Subscription Status | Status van user account ('inactive', 'active', 'expired') |
| `new=true` | Query parameter die aangeeft dat dit een nieuwe user is (na registratie) |
| `renew=true` | Query parameter die aangeeft dat dit een expired user is die account wil reactiveren |

## 11. Integratie met Kortingscode Plan

**Belangrijke overlap en volgorde:**

1. **Webhook Flow (Epic 4 + Epic 6 uit kortingscode plan):**
   - Eerst: `createSubscription` (E6.S2 uit kortingscode plan)
   - Dan: `update profiles.subscription_status` (E4.S1 uit dit plan)
   - Dan: `incrementDiscountCodeUses` (E6.S3 uit kortingscode plan)
   - Tot slot: `sendWelcomeEmail` (E6.S4 uit kortingscode plan)

2. **Checkout pagina:**
   - Bestaat al met kortingscode functionaliteit (Epic 4 uit kortingscode plan)
   - Epic 3 voegt alleen auth check toe aan bestaande pagina
   - Geen wijzigingen aan kortingscode functionaliteit nodig

3. **Registratie flow:**
   - Gebruikt direct Supabase client (niet API route)
   - Redirect naar checkout met `new=true` parameter

4. **Subscription Status Management:**
   - **Database is source of truth:** `profiles.subscription_status` wordt direct geüpdatet in database
   - **Chat layout:** Queryt database voor real-time status (niet user_metadata)
   - **Webhook:** Update database direct na betaling
   - **Consistentie:** Zelfde patroon als `contact/page.tsx` en `useUserStore.ts`

---

**Versiehistorie:**

| Versie | Datum | Auteur | Wijziging |
|--------|-------|--------|-----------|
| v1.0 | 20-01-2025 | Development Team | Initiële versie MVP checkout flow |
| v1.1 | 20-01-2025 | Development Team | Verduidelijkingen: webhook integratie, query parameters, registratie flow |
| v1.2 | 20-01-2025 | Development Team | Verduidelijking: subscription_status uit database (niet user_metadata), login redirect, trial checks, email confirmation flow |
| v1.3 | 20-01-2025 | Development Team | Team review feedback: auth callback redirect, database error fallback, bestaande trial users, test setup, webhook idempotency |
| v1.4 | 20-01-2025 | Development Team | Implementatie voltooid: Epic 1 (Trial uitschakelen), Epic 2 (Registratie Flow), Epic 3 (Checkout Auth Check) - Status bijgewerkt naar ✅ Voltooid |
| v1.5 | 20-01-2025 | Development Team | Implementatie voltooid: Epic 4 (Subscription Status Update), Epic 5 (Chat Access Control) - Alle code implementaties compleet |

