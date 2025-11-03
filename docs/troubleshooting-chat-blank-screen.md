# 🔍 Troubleshooting: /chat Blank Screen Issue

## 📋 Document Informatie

**Datum:** 2025-11-03
**Branch:** `migration/nextjs`
**Status:** ✅ Root Cause Geïdentificeerd | 🔧 Fix Pending
**Priority:** 🔴 Critical - Blokkeert volledige chat functionaliteit

---

## 🎯 Probleem Overzicht

Na het implementeren van een nieuwe landingspagina en het moderniseren van de registratiepagina op de `migration/nextjs` branch, vertoonde de `/chat` route een blanco scherm ondanks dat de server een `200 OK` response teruggaf.

### Impact
- **Beïnvloede Routes:** `/chat`, `/chat/*`
- **Gebruikers Impact:** Geauthenticeerde gebruikers kunnen niet bij chat-interface
- **Severity:** Critical - Core functionaliteit onbeschikbaar

---

## 🔍 Symptomen

### Geobserveerd Gedrag

1. **Browser:**
   - Blanco wit scherm bij navigatie naar `http://localhost:3000/chat`
   - Geen console errors
   - Geen network errors
   - Status code: `200 OK`

2. **Server Logs:**
   ```
   GET /chat 200 in 31ms
   ```
   - Succesvolle response, geen server errors
   - Route wordt correct geroepen

3. **Network Tab:**
   - Herhaalde `307 Temporary Redirect` responses
   - Redirect patroon: `/chat` → `/login` → `/chat` → `/login` (infinite loop)

### Initiële Hypotheses

1. ❌ **Hydration mismatch** tussen server en client
2. ❌ **Component rendering error** in ChatLayout of ChatSidebar
3. ❌ **Tailwind config issue** (net opgelost voor andere paginas)
4. ❌ **Build cache corruptie** (eerder al opgelost met `.next` clear)
5. ✅ **Authentication/Middleware mismatch** ← ROOT CAUSE

---

## 🧪 Analyse Proces

### Fase 1: Initiële Verificatie

**Actie:** Check consistency tussen landing, login, register, en chat pages.

**Bevindingen:**
- Login page: Modern 2-column layout ✅
- Register page: OLD centered layout ❌
- Chat pages: Consistent ✅
- **Actie genomen:** Register page gemoderniseerd

### Fase 2: Tailwind Config Probleem

**Actie:** Gebruiker wees op missing colors in `tailwind.config.nextjs.js`

**Bevindingen:**
```javascript
// Missing:
'teal': { DEFAULT: '#2C5F5D', ... }
'brand': { dark: '#5A0D29', ... }
'gold.light': '#F0C674'
```

**Actie genomen:** Colors toegevoegd aan config

### Fase 3: Build Cache Corruptie

**Error:**
```
⨯ [Error: ENOENT: no such file or directory, open '.next/routes-manifest.json']
```

**Bevindingen:**
- `/login` gaf eerst 200 OK, daarna 404
- `/register` werkte wel correct
- Classic Next.js cache corruption pattern

**Actie genomen:**
```bash
rm -rf .next
pnpm run dev
```

**Result:** Build errors opgelost, maar blank screen bleef bestaan

### Fase 4: Routing & Config Deep Dive

**Actie:** curl testing om server-side gedrag te analyseren

**Test 1: Chat Route**
```bash
curl -I http://localhost:3000/chat
# Result: 307 Temporary Redirect → /login
```

**Test 2: Login Route**
```bash
curl -I http://localhost:3000/login
# Result: 200 OK (correct)
```

**Bevindingen:**
- Redirect gedrag is correct voor unauthenticated users
- Maar waarom infinite loop in browser?

### Fase 5: Debug Logging Implementatie

**Aanpassing 1: middleware.ts**

Toegevoegd op regel 32-36:
```typescript
const allCookies = cookies.getAll();
console.log('🍪 [Middleware] All cookies:',
  allCookies.map(c => c.name).join(', ') || 'NONE'
);
hasSession = allCookies.some(cookie =>
  cookie.name.includes('sb-') && cookie.name.includes('auth-token')
);
console.log('🔐 [Middleware] Has session:', hasSession,
  'for path:', request.nextUrl.pathname
);
```

**Aanpassing 2: app/chat/layout.tsx**

Toegevoegd op regel 16, 19, 23:
```typescript
console.log('👤 [ChatLayout] User from getUser():',
  user?.email || 'NO USER'
);

if (!user) {
  console.log('🚫 [ChatLayout] No user found, redirecting to /login');
  redirect('/login');
}

console.log('✅ [ChatLayout] User authenticated, rendering chat');
```

### Fase 6: 🎯 Critical Discovery

**Server Logs bij /chat access:**
```
🍪 [Middleware] All cookies: sb-sutcfnaiyqybepqexiyr-auth-token-code-verifier
🔐 [Middleware] Has session: true for path: /chat
👤 [ChatLayout] User from getUser(): NO USER
🚫 [ChatLayout] No user found, redirecting to /login
```

**Server Logs bij /login access:**
```
🍪 [Middleware] All cookies: sb-sutcfnaiyqybepqexiyr-auth-token-code-verifier
🔐 [Middleware] Has session: true for path: /login
GET /chat 307 in 12ms
```

**🚨 EUREKA MOMENT:**

De middleware vindt een cookie genaamd `sb-sutcfnaiyqybepqexiyr-auth-token-code-verifier` en denkt dat dit een geldige sessie is, maar dit is slechts een OAuth **code verifier** - GEEN daadwerkelijke auth token!

---

## 💡 Root Cause Analyse

### Het Probleem

**Cookie Pattern Mismatch tussen Middleware en Supabase SSR**

#### Middleware Logica (middleware.ts:33-35)
```typescript
hasSession = allCookies.some(cookie =>
  cookie.name.includes('sb-') && cookie.name.includes('auth-token')
);
```

**Probleem:** Deze pattern matching is te permissive!

#### Cookie Gevonden
```
sb-sutcfnaiyqybepqexiyr-auth-token-code-verifier
```

**Pattern Analyse:**
- ✅ Bevat `'sb-'` → Match!
- ✅ Bevat `'auth-token'` → Match!
- ❌ **MAAR:** Dit is een OAuth flow artifact, geen sessie token!

#### Daadwerkelijke Auth Check (app/chat/layout.tsx:13-14)
```typescript
const { data: { user } } = await supabase.auth.getUser();
// Result: user = null (CORRECT!)
```

Supabase SSR's `getUser()` zoekt naar daadwerkelijke sessie tokens zoals:
- `sb-{project-ref}-auth-token` (het daadwerkelijke JWT)
- `sb-access-token`
- `sb-refresh-token`

### De Infinite Redirect Loop

**Flow Diagram:**

```
User → /chat
   ↓
Middleware checks cookies
   ↓
Finds: sb-*-auth-token-code-verifier
   ↓
hasSession = true ✓ (INCORRECT!)
   ↓
NextResponse.next() → Allows access to /chat
   ↓
ChatLayout.tsx: supabase.auth.getUser()
   ↓
Result: user = null (CORRECT!)
   ↓
redirect('/login')
   ↓
User → /login
   ↓
Middleware checks cookies (SAME COOKIE STILL EXISTS!)
   ↓
Finds: sb-*-auth-token-code-verifier
   ↓
hasSession = true ✓ (INCORRECT!)
   ↓
isAuthRoute && hasSession → redirect('/chat')
   ↓
[LOOP REPEATS INFINITELY]
```

### Waarom Code Verifier Cookie Bestaat

De `code-verifier` cookie is onderdeel van OAuth 2.0 PKCE (Proof Key for Code Exchange) flow:

1. User start login proces
2. Supabase genereert code_verifier
3. Cookie wordt gezet: `sb-{project}-auth-token-code-verifier`
4. Na succesvolle OAuth callback → Verifier wordt gebruikt
5. **Probleem:** Cookie blijft bestaan na gebruik

Dit is normaal gedrag in Supabase OAuth flows, maar onze middleware moet dit onderscheiden van echte sessie tokens.

---

## 🔧 Oplossingen

### Oplossing 1: Exclude Code Verifier Pattern (RECOMMENDED)

**File:** `middleware.ts`

**Huidige Code (regel 33-35):**
```typescript
hasSession = allCookies.some(cookie =>
  cookie.name.includes('sb-') && cookie.name.includes('auth-token')
);
```

**Nieuwe Code:**
```typescript
hasSession = allCookies.some(cookie =>
  cookie.name.includes('sb-') &&
  cookie.name.includes('auth-token') &&
  !cookie.name.includes('code-verifier')  // ← EXCLUDE OAuth artifacts
);
```

**Voordelen:**
- ✅ Minimale code change
- ✅ Behoudt bestaande cookie detection logica
- ✅ Expliciet excludeert OAuth flow cookies
- ✅ Performance: No additional API calls

**Nadelen:**
- ⚠️ Afhankelijk van cookie naming conventions
- ⚠️ Mogelijk andere OAuth artifacts in toekomst

### Oplossing 2: Server-side Session Validation (MOST SECURE)

**File:** `middleware.ts`

**Replace cookie inspection met daadwerkelijke Supabase check:**

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    let response = NextResponse.next();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            response.cookies.set(name, value, options);
          },
          remove(name: string, options: any) {
            response.cookies.set(name, '', { ...options, maxAge: 0 });
          },
        },
      }
    );

    // ACTUAL session validation
    const { data: { session } } = await supabase.auth.getSession();
    const hasSession = !!session;

    console.log('🔐 [Middleware] Has valid session:', hasSession,
      'for path:', request.nextUrl.pathname
    );

    const isProtectedRoute = request.nextUrl.pathname.startsWith('/chat') ||
      request.nextUrl.pathname.startsWith('/admin') ||
      request.nextUrl.pathname.startsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/contact');

    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/register');

    if (isProtectedRoute && !hasSession) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && hasSession) {
      return NextResponse.redirect(new URL('/chat', request.url));
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

**Voordelen:**
- ✅ **Most secure:** Gebruikt daadwerkelijke Supabase session validation
- ✅ Geen cookie naming assumptions
- ✅ Consistent met ChatLayout auth check
- ✅ Toekomstbestendig

**Nadelen:**
- ⚠️ Meer code changes
- ⚠️ Mogelijk performance impact (extra API call per request)
- ⚠️ Moet Supabase SSR cookies correct afhandelen

### Oplossing 3: Hybrid Approach

**Combineer beide methodes voor optimale balans:**

```typescript
// Eerst: Quick cookie check voor performance
const hasCookie = allCookies.some(cookie =>
  cookie.name.includes('sb-') &&
  cookie.name.includes('auth-token') &&
  !cookie.name.includes('code-verifier')
);

// Alleen voor protected routes: Validate daadwerkelijke sessie
let hasSession = hasCookie;

if (isProtectedRoute && hasCookie) {
  const { data: { session } } = await supabase.auth.getSession();
  hasSession = !!session;
}
```

**Voordelen:**
- ✅ Fast path: Cookie check voorkomt API calls voor meeste requests
- ✅ Secure path: Actual validation voor protected routes
- ✅ Best of both worlds

**Nadelen:**
- ⚠️ Meer complexiteit
- ⚠️ Twee code paths om te onderhouden

---

## 🎯 Aanbevolen Implementatie

### Stap 1: Implementeer Oplossing 1 (Quick Fix)

**Prioriteit:** 🔴 Immediate
**Effort:** Low
**Impact:** High

```typescript
// middleware.ts:33-36
hasSession = allCookies.some(cookie =>
  cookie.name.includes('sb-') &&
  cookie.name.includes('auth-token') &&
  !cookie.name.includes('code-verifier')
);
```

### Stap 2: Test de Fix

```bash
# Clear all cookies in browser
# Navigate to http://localhost:3000/login
# Login met credentials
# Verify redirect naar /chat werkt
# Verify /chat toont chat interface (geen blank screen)
```

### Stap 3: Valideer Logs

Expected logs na fix:
```
🍪 [Middleware] All cookies: sb-sutcfnaiyqybepqexiyr-auth-token, ...
🔐 [Middleware] Has session: true for path: /chat
👤 [ChatLayout] User from getUser(): user@example.com
✅ [ChatLayout] User authenticated, rendering chat
```

### Stap 4: Plan Migratie naar Oplossing 2 (Long-term)

**Prioriteit:** 🟡 Medium
**Timeline:** Sprint +1
**Reason:** More secure en toekomstbestendig

---

## 📝 Technische Details

### Beïnvloede Bestanden

| File | Regel | Type Change | Beschrijving |
|:-----|:------|:------------|:-------------|
| `middleware.ts` | 33-36 | 🔧 Fix Required | Cookie pattern matching te permissive |
| `app/chat/layout.tsx` | 10-21 | ✅ Correct | Auth check werkt zoals verwacht |
| `lib/supabase/server.ts` | - | ✅ Correct | Server client creation correct |

### Cookie Types in Supabase Auth

| Cookie Name Pattern | Type | Betekenis | Middleware Moet Accepteren? |
|:-------------------|:-----|:----------|:---------------------------|
| `sb-{project}-auth-token` | Session | Actual JWT access token | ✅ YES |
| `sb-access-token` | Session | Alternative access token name | ✅ YES |
| `sb-refresh-token` | Session | Refresh token | ✅ YES |
| `sb-{project}-auth-token-code-verifier` | OAuth Artifact | PKCE code verifier | ❌ NO |
| `sb-{project}-auth-token-code-challenge` | OAuth Artifact | PKCE code challenge | ❌ NO |

### Next.js Middleware Edge Runtime

**Belangrijke Constraints:**
- Middleware draait in Edge Runtime (niet Node.js runtime)
- Beperkte Node.js APIs beschikbaar
- Supabase SSR `@supabase/ssr` is Edge compatible ✅
- `getUser()` en `getSession()` werken in middleware

---

## 🛡️ Preventie & Best Practices

### 1. Cookie Naming Patterns

**DO:**
```typescript
// Specifieke patterns met expliciete excludes
cookie.name.match(/^sb-.*-auth-token$/) &&
!cookie.name.includes('verifier')
```

**DON'T:**
```typescript
// Brede patterns zonder guards
cookie.name.includes('auth-token')
```

### 2. Authentication Validation

**DO:**
```typescript
// Gebruik Supabase APIs voor daadwerkelijke validation
const { data: { session } } = await supabase.auth.getSession();
const isAuthenticated = !!session;
```

**DON'T:**
```typescript
// Trust cookie existence alone
const isAuthenticated = cookies.has('sb-auth-token');
```

### 3. Logging & Debugging

**DO:**
```typescript
// Comprehensive logging met context
console.log('🍪 [Middleware] Cookies:', cookies.map(c => c.name));
console.log('🔐 [Middleware] Session:', hasSession, 'Path:', path);
```

**DON'T:**
```typescript
// Silent failures
if (!hasSession) redirect('/login');
```

### 4. Testing Checklist

Voor elke auth-related change:

- [ ] Test met fresh browser (geen cookies)
- [ ] Test met verifier cookie maar geen session
- [ ] Test met geldige session
- [ ] Test redirect flows (login → protected route)
- [ ] Test auth routes met active session
- [ ] Check server logs voor unexpected patterns

---

## 📚 Lessons Learned

### 1. Cookie Naming Conventions Matter

OAuth flows genereren artifacts die lijken op auth tokens. Pattern matching moet specifiek genoeg zijn om deze te onderscheiden.

### 2. Middleware vs. Server Components Auth

**Middleware:** Snelle, lightweight checks voor routing decisions
**Server Components:** Daadwerkelijke auth validation met volledige Supabase APIs

Het is essentieel dat beide **consistent** zijn. Mismatch leidt tot redirect loops.

### 3. Debug Logging is Essentieel

Zonder de toegevoegde logs hadden we deze issue niet kunnen identificeren. De symptomen (blank screen, 200 OK) gaven geen hints naar de root cause.

**Key Insight:** Voeg altijd cookie inspection logs toe bij auth debugging.

### 4. Next.js Cache can Hide Issues

De initiële focus lag op cache issues (routes-manifest.json errors), wat afleidt van de daadwerkelijke auth mismatch. Clear separation of concerns bij debugging is belangrijk.

### 5. Supabase OAuth Flow Leaves Artifacts

Code verifier cookies zijn **expected behavior** in OAuth flows. Applicaties moeten hier rekening mee houden en niet blind alle `sb-*-auth-token*` cookies accepteren.

---

## 🔗 Gerelateerde Documentatie

- [Supabase SSR Implementatie](/docs/supabase-ssr-implementatie.md)
- [Next.js Migration Plan](/docs/MIGRATION-PLAN-NEXTJS.md)
- [Project Summary](/docs/PROJECT_SUMMARY.md)
- [Supabase Auth Cookies Docs](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [OAuth 2.0 PKCE Flow](https://oauth.net/2/pkce/)

---

## ✅ Action Items

- [ ] **Immediate:** Implementeer Oplossing 1 (exclude code-verifier pattern)
- [ ] **Immediate:** Test volledige auth flow (login → chat)
- [ ] **Short-term:** Verwijder debug logs na validatie (of behoud voor monitoring)
- [ ] **Short-term:** Update tests om OAuth artifact cookies te mocken
- [ ] **Medium-term:** Plan migratie naar Oplossing 2 (server-side validation)
- [ ] **Medium-term:** Documenteer auth flow in PROJECT_SUMMARY.md

---

**Document Owner:** Claude Code (AI Assistant)
**Last Updated:** 2025-11-03
**Status:** ✅ Complete - Ready for Implementation
