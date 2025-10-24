# Migratieplan: SvelteKit naar Next.js - Gefaseerd Bouwplan

## 📋 Aanleiding
Het DoBbie project is momenteel gebouwd met SvelteKit en gebruikt npm als package manager. De organisatie heeft besloten te migreren naar Next.js met pnpm vanwege:
- Grotere ecosystem en community support van React/Next.js
- Betere enterprise adoptie en talent beschikbaarheid
- Verbeterde performance met React Server Components
- Naadloze Vercel deployment optimalisaties

## 🎯 Doel
Complete migratie van de DoBbie chatbot applicatie van SvelteKit naar Next.js, waarbij alle functionaliteit behouden blijft en de gebruikerservaring verbeterd wordt.

## 📊 Statusoverzicht

| Fase | Subfase | Omschrijving | Status | Geschatte Tijd | Prioriteit |
|------|---------|--------------|--------|----------------|------------|
| **1** | 1.1 | Project Setup & Dependencies | ✅ Voltooid | 2 uur | Kritisch |
| | 1.2 | Build Configuratie | ✅ Voltooid | 1 uur | Kritisch |
| | 1.3 | TypeScript & Linting | ✅ Voltooid | 1 uur | Hoog |
| **2** | 2.1 | App Router Structuur | ✅ Voltooid | 2 uur | Kritisch |
| | 2.2 | Global Styles & Fonts | ✅ Voltooid | 1 uur | Hoog |
| | 2.3 | Theme Provider Setup | ✅ Voltooid | 1 uur | Medium |
| **3** | 3.1 | Supabase Client Setup | ✅ Voltooid | 2 uur | Kritisch |
| | 3.2 | Auth Middleware | ✅ Voltooid | 3 uur | Kritisch |
| | 3.3 | Protected Routes | ✅ Voltooid | 2 uur | Kritisch |
| **4** | 4.1 | Chat API Endpoint | ⏳ Wachtend | 3 uur | Kritisch |
| | 4.2 | Auth API Endpoints | ⏳ Wachtend | 2 uur | Kritisch |
| | 4.3 | Contact Form API | ⏳ Wachtend | 1 uur | Laag |
| **5** | 5.1 | Zustand Store Setup | ⏳ Wachtend | 2 uur | Hoog |
| | 5.2 | Chat Store Migration | ⏳ Wachtend | 3 uur | Kritisch |
| | 5.3 | User Store Migration | ⏳ Wachtend | 2 uur | Hoog |
| **6** | 6.1 | Layout Components | ⏳ Wachtend | 4 uur | Hoog |
| | 6.2 | Chat Components | ⏳ Wachtend | 6 uur | Kritisch |
| | 6.3 | Landing Components | ⏳ Wachtend | 4 uur | Medium |
| | 6.4 | Form Components | ⏳ Wachtend | 3 uur | Medium |
| **7** | 7.1 | Homepage | ⏳ Wachtend | 3 uur | Hoog |
| | 7.2 | Chat Page | ⏳ Wachtend | 4 uur | Kritisch |
| | 7.3 | Auth Pages | ⏳ Wachtend | 3 uur | Hoog |
| | 7.4 | Admin Pages | ⏳ Wachtend | 2 uur | Laag |
| **8** | 8.1 | Functional Testing | ⏳ Wachtend | 4 uur | Kritisch |
| | 8.2 | Performance Optimization | ⏳ Wachtend | 3 uur | Hoog |
| | 8.3 | Deployment Setup | ⏳ Wachtend | 2 uur | Kritisch |

---

## 📝 Gedetailleerd Faseplan

### **Fase 1: Fundament (✅ VOLTOOID)**

#### 1.1 Project Setup & Dependencies
**Wat gebeurt er:** Nieuwe Next.js project structuur met pnpm
- Branch aanmaken voor isolatie: `migration/nextjs`
- pnpm installeren en configureren
- `package.json` transformatie van Svelte naar React dependencies

**Dependencies mapping:**
```json
// Van SvelteKit:
"svelte": "^5.0.0" → "react": "^19.0.0"
"@sveltejs/kit": "^2.16.0" → "next": "^15.1.6"
"@sveltejs/adapter-vercel" → ingebouwd in Next.js
"lucide-svelte" → "lucide-react"
"svelte-sonner" → "sonner"
```

#### 1.2 Build Configuratie
**Wat gebeurt er:** Next.js specifieke configuraties
- `next.config.js` met Vercel optimalisaties
- Environment variables mapping (PUBLIC_* → NEXT_PUBLIC_*)
- Image & font optimization settings
- Security headers configuratie

#### 1.3 TypeScript & Linting
**Wat gebeurt er:** Type safety voor React/Next.js
- TSConfig met JSX support en strict mode
- Path aliases (@/components, @/lib, @/app)
- ESLint rules voor React hooks
- Prettier integratie met Tailwind

---

### **Fase 2: Applicatie Skelet (✅ VOLTOOID)**

#### 2.1 App Router Structuur
**Wat gebeurt er:** Next.js 14+ App Router hierarchie opzetten

**Directory structuur:**
```
app/
├── layout.tsx          # Root layout met providers
├── page.tsx           # Homepage
├── globals.css        # Global styles
├── (auth)/           # Route group voor auth
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── layout.tsx    # Auth-specifieke layout
├── chat/
│   ├── page.tsx      # Chat interface
│   └── layout.tsx    # Chat layout met sidebar
├── admin/
│   └── trials/
│       └── page.tsx  # Trial beheer
└── api/
    ├── chat/
    │   └── route.ts  # Streaming chat endpoint
    └── auth/
        └── [...]/route.ts
```

#### 2.2 Global Styles & Fonts
**Wat gebeurt er:** CSS migratie naar Next.js
- Tailwind classes behouden in `globals.css`
- Font-face declaraties voor Poppins en Lora
- Custom CSS variables voor theming
- Responsive utilities

#### 2.3 Theme Provider Setup
**Wat gebeurt er:** Dark mode implementatie
- React Context voor theme state management
- localStorage synchronisatie
- `<html>` class toggling voor Tailwind dark mode
- Hydration-safe implementatie

---

### **Fase 3: Authenticatie Infrastructuur (✅ VOLTOOID)**

#### 3.1 Supabase Client Setup
**Wat gebeurt er:** SSR-compatible Supabase clients creëren

**File structuur:**
```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
export function createClient() {
  // Cookie-based server client
}

// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  // Browser client voor client components
}
```

#### 3.2 Auth Middleware
**Wat gebeurt er:** Request interceptie voor authenticatie
- `middleware.ts` in project root
- Session verificatie en refresh per request
- Protected route patterns configureren
- Redirect logic voor unauthenticated users

**Middleware configuratie:**
```typescript
export const config = {
  matcher: [
    '/chat/:path*',
    '/admin/:path*',
    '/dashboard/:path*',
  ]
}
```

#### 3.3 Protected Routes
**Wat gebeurt er:** Route-level auth guards implementeren
- Server-side auth check in layout.tsx
- Loading states tijdens auth verificatie
- Role-based access control (admin vs user)
- Graceful error handling

---

### **Fase 4: API Layer Migratie**

#### 4.1 Chat API Endpoint
**Wat gebeurt er:** Vertex AI streaming endpoint migreren

**Implementatie stappen:**
- `/app/api/chat/route.ts` aanmaken
- Vertex AI client configuratie behouden
- ReadableStream voor response streaming
- Message format transformatie (Svelte → React format)

**Request flow:**
```
Client Component → POST /api/chat
→ Vertex AI (Gemini 2.5)
→ Streaming Response
→ Client Update
```

#### 4.2 Auth API Endpoints
**Wat gebeurt er:** Supabase auth operations migreren
- `/api/auth/register/route.ts` - nieuwe gebruikers met trial
- `/api/auth/forgot-password/route.ts` - password reset flow
- `/api/auth/callback/route.ts` - OAuth callbacks
- Session management endpoints

#### 4.3 Contact Form API
**Wat gebeurt er:** Email verzending via Resend
- Form validatie met Zod
- Rate limiting implementatie
- Success/error response handling
- Email template rendering

---

### **Fase 5: State Management**

#### 5.1 Zustand Store Setup
**Wat gebeurt er:** Svelte stores vervangen door Zustand

**Store architectuur:**
```typescript
// stores/useAppStore.ts
interface AppStore {
  // Chat state
  messages: Message[]
  activeCategoryId: string | null
  isTyping: boolean

  // Actions
  addMessage: (msg: Message) => void
  setTyping: (status: boolean) => void

  // User state
  user: User | null
  setUser: (user: User | null) => void

  // UI state
  sidebarOpen: boolean
  toggleSidebar: () => void
}
```

#### 5.2 Chat Store Migration
**Wat gebeurt er:** Chat functionaliteit state management

**Te migreren state:**
- Message history met persistence
- Category selectie en questions
- Typing indicators
- Stream buffer management
- Error states

#### 5.3 User Store Migration
**Wat gebeurt er:** User session state management
- Profile data synchronisatie
- Trial status tracking
- Organization membership
- User preferences

---

### **Fase 6: Component Library Conversie**

#### 6.1 Layout Components (11 componenten)
**Wat gebeurt er:** Structurele componenten converteren

**Conversie mapping:**
```
Svelte → React
- Sidebar.svelte → components/layout/Sidebar.tsx
- Header.svelte → components/layout/Header.tsx
- Footer.svelte → components/layout/Footer.tsx
- MobileMenu.svelte → components/layout/MobileMenu.tsx
- UserMenu.svelte → components/layout/UserMenu.tsx
```

**Conversie patterns:**
```svelte
<!-- Svelte -->
<script>
  export let open = false
  $: classes = open ? 'open' : 'closed'
</script>

<!-- React -->
interface Props {
  open?: boolean
}
const classes = open ? 'open' : 'closed'
```

#### 6.2 Chat Components (8 componenten)
**Wat gebeurt er:** Chat UI elementen converteren

**Kritische componenten:**
- `ChatMessage.tsx` - Markdown rendering met marked
- `ChatInput.tsx` - Controlled input met submit
- `CategoryChips.tsx` - Interactive chips
- `QuestionChip.tsx` - Clickable suggestions
- `TypingIndicator.tsx` - Animation component

#### 6.3 Landing Components (7 componenten)
**Wat gebeurt er:** Marketing componenten converteren
- `Hero.tsx` - Met animation hooks
- `Features.tsx` - Grid layout
- `Pricing.tsx` - Pricing cards
- `Testimonials.tsx` - Carousel logic
- `HowItWorks.tsx` - Process steps

#### 6.4 Form Components (6 componenten)
**Wat gebeurt er:** Herbruikbare form elementen
- `Input.tsx` - Met forwardRef
- `Button.tsx` - Variant system
- `Select.tsx` - Controlled component
- `PasswordInput.tsx` - Toggle visibility
- `Checkbox.tsx` - Custom styling

---

### **Fase 7: Page Routes Implementatie**

#### 7.1 Homepage
**Wat gebeurt er:** Landing page assembly

**Componenten samenstellen:**
- Server-side data fetching voor testimonials
- Hero section met scroll animations
- Feature cards grid
- Pricing section
- CTA sections

#### 7.2 Chat Page
**Wat gebeurt er:** Core functionaliteit implementeren

**Implementatie details:**
- WebSocket/streaming setup
- Message rendering met virtualisatie
- Category picker integratie
- Sidebar met chat history
- Mobile responsive design

**Data flow:**
```
User Input → Zustand Store
→ API Call → Streaming Response
→ Progressive UI Updates
```

#### 7.3 Auth Pages
**Wat gebeurt er:** Authentication flows

**Te implementeren:**
- Login met email/password
- Register met trial activation
- Password reset flow
- Email verificatie
- OAuth providers (Google/GitHub)

#### 7.4 Admin Pages
**Wat gebeurt er:** Beheer interfaces
- Trial overview dashboard
- User management table
- Analytics visualisaties
- System health monitoring

---

### **Fase 8: Afronding & Deployment**

#### 8.1 Functional Testing
**Wat gebeurt er:** End-to-end verificatie

**Test checklist:**
- [ ] User registration met trial activatie
- [ ] Login/logout flows
- [ ] Chat streaming functionaliteit
- [ ] Message persistence
- [ ] Category selectie
- [ ] Password reset email
- [ ] Protected routes authenticatie
- [ ] Admin toegang
- [ ] Mobile responsiveness
- [ ] Dark mode toggle

#### 8.2 Performance Optimization
**Wat gebeurt er:** Snelheid & UX verbetering

**Optimalisaties:**
- Bundle size analyse met @next/bundle-analyzer
- Dynamic imports voor code splitting
- Image optimization met next/image
- Font preloading strategieën
- API response caching
- Static generation waar mogelijk

#### 8.3 Deployment Setup
**Wat gebeurt er:** Production-ready configuratie

**Deployment stappen:**
- Vercel project configuratie
- Environment variables setup
- Domain configuratie
- SSL certificaten
- Monitoring met Vercel Analytics
- Error tracking setup

---

## 🚀 Volgende Stappen

### Huidige positie: Fase 4 - API Layer Migratie

### Directe acties (volgorde van uitvoering):

1. **Chat API Endpoint** (3 uur) ⬅️ VOLGENDE
   - Streaming endpoint migreren
   - Vertex AI integratie
   - Error handling

2. **Zustand Store Setup** (2 uur)
   - Store configuratie
   - Chat state management
   - User state management

3. **Basis Chat Componenten** (6 uur)
   - ChatMessage component
   - ChatInput component
   - Category chips
   - Typing indicator

4. **Chat Page Implementatie** (4 uur)
   - Basis functionaliteit
   - Streaming integratie
   - Layout met sidebar

5. **Auth API Endpoints** (2 uur)
   - Register endpoint
   - Forgot password
   - Callback handler

---

## ⚠️ Risico's & Mitigatie

### Technische risico's:
1. **Streaming API compatibility**
   - Risico: Next.js Edge runtime beperkingen
   - Mitigatie: Node.js runtime gebruiken indien nodig

2. **State hydration mismatches**
   - Risico: Server/client state desync
   - Mitigatie: Proper hydration boundaries

3. **Cookie-based auth complexiteit**
   - Risico: Session management issues
   - Mitigatie: Supabase SSR best practices

### Project risico's:
1. **Component conversie tijd**
   - Risico: 27 componenten = veel werk
   - Mitigatie: Gefaseerde aanpak, MVP eerst

2. **Testing overhead**
   - Risico: Bugs in productie
   - Mitigatie: Uitgebreide test fase

---

## 📈 Success Metrics

### Must-have (MVP):
- ✅ Gebruiker kan inloggen
- ✅ Chat functionaliteit werkt
- ✅ Streaming responses
- ✅ Basis UI componenten

### Should-have:
- ✅ Alle routes gemigreerd
- ✅ Dark mode
- ✅ Mobile responsive
- ✅ Admin panel

### Nice-to-have:
- ✅ Performance optimalisaties
- ✅ Advanced animations
- ✅ PWA features

---

## 🔄 Status Updates

### 2025-01-24: Migratie gestart - Fase 1-3 compleet
- ✅ Branch `migration/nextjs` aangemaakt
- ✅ Dependencies volledig gemigreerd naar Next.js/React
- ✅ Build configuratie en tooling (ESLint, Prettier, TypeScript)
- ✅ App Router structuur met layouts
- ✅ Supabase SSR auth layer compleet
- ✅ Middleware en protected routes werkend
- ✅ Homepage en auth pages (login/register) geïmplementeerd
- ✅ Development server draait op localhost:3000

### Totale voortgang: ~35% compleet

**Voltooide fases:**
- ✅ Fase 1: Fundament (100%)
- ✅ Fase 2: Applicatie Skelet (100%)
- ✅ Fase 3: Authenticatie Infrastructuur (100%)
- 🔄 Fase 4: API Layer (0% - volgende)

**Geschatte resterende tijd:**
- Optimistisch: 5-6 dagen
- Realistisch: 8-10 dagen
- Pessimistisch: 12 dagen

---

*Dit document wordt continu bijgewerkt tijdens de migratie.*