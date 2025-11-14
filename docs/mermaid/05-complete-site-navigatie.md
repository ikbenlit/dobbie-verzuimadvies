# Complete Site Navigatie Structuur

Overzicht van alle navigatiepaden door de website.

```mermaid
flowchart TD
    Landing[Landing Page]

    Landing --> Hero[Hero Section<br/>'Start gratis' CTA]
    Landing --> Nav[Header Navigatie]

    Nav --> NavLogo[Logo → Home]
    Nav --> NavPricing[Prijzen → /#pricing]
    Nav --> NavContact[Contact → /contact]
    Nav --> NavLogin[Inloggen → /login]
    Nav --> NavStart[Start gratis → SmartCTA]

    Hero --> SmartCTA[Smart CTA Component<br/>Intelligente routing]
    NavStart --> SmartCTA

    SmartCTA --> Auth{Auth status?}
    Auth -->|Niet ingelogd| Register[/register]
    Auth -->|Ingelogd + betaald| Chat[/chat]
    Auth -->|Ingelogd + niet betaald| Checkout[/checkout]

    Register --> AfterReg[Na registratie<br/>auto-login]
    AfterReg --> Checkout

    Checkout --> Payment[Mollie betaling]
    Payment -->|Success| Success[/checkout/success]
    Payment -->|Cancel| Cancel[/checkout/cancel]

    Success --> Chat
    Cancel --> RetryButton[Opnieuw proberen]
    RetryButton --> Checkout

    NavLogin --> Login[/login]
    Login --> LoginSuccess[Na login<br/>check subscription]
    LoginSuccess --> Auth

    style Landing fill:#e1f5ff
    style SmartCTA fill:#fff4e6
    style Register fill:#fff4e6
    style Checkout fill:#fff4e6
    style Chat fill:#e8f5e9
    style Success fill:#e8f5e9
    style Cancel fill:#ffebee
```

## Navigatie Elementen

### Header (Altijd Zichtbaar)
```
┌─────────────────────────────────────────────────┐
│ [Logo]  Prijzen  Contact  [Inloggen]  [Start]  │
└─────────────────────────────────────────────────┘
```

**Links**:
1. **Logo** → `/` (Homepage)
2. **Prijzen** → `/#pricing` (Anchor naar pricing sectie)
3. **Contact** → `/contact`
4. **Inloggen** → `/login` (als niet ingelogd)
5. **Start gratis** → SmartCTA routing

### Ingelogd Header (Variant)
```
┌──────────────────────────────────────────────────┐
│ [Logo]  Chat  Contact  [User Menu ▾]            │
└──────────────────────────────────────────────────┘
```

**Aanpassingen**:
- "Prijzen" vervangen door "Chat" link
- "Inloggen" vervangen door User menu
- "Start gratis" verborgen of → "Ga naar chat"

### Footer Links
```
DOBbie
├─ Product
│  ├─ Features
│  ├─ Prijzen → /#pricing
│  └─ FAQ
├─ Bedrijf
│  ├─ Over ons
│  ├─ Contact
│  └─ Carrière
└─ Juridisch
   ├─ Algemene voorwaarden
   ├─ Privacy policy
   └─ Cookiebeleid
```

## Primaire User Journeys

### Journey 1: Nieuwe Bezoeker → Gebruiker
```
Landing → Prijzen bekijken → Register → Checkout → Chat
```

### Journey 2: Direct Starten
```
Landing → Start CTA → Register → Checkout → Chat
```

### Journey 3: Bestaande User
```
Landing → Inloggen → (subscription check) → Chat/Checkout
```

### Journey 4: Informatie Zoeken
```
Landing → Prijzen sectie → Contact → Register
```

## Protected Routes

### Public Routes (Altijd Toegankelijk)
- `/` - Landing page
- `/login` - Login
- `/register` - Registratie
- `/forgot-password` - Wachtwoord reset
- `/contact` - Contact formulier
- `/terms` - Algemene voorwaarden
- `/privacy` - Privacy policy

### Auth Required (Redirect naar /login)
- `/chat` - Chat interface
- `/dashboard` - Dashboard (toekomstig)
- `/account` - Account instellingen (toekomstig)

### Conditional Access (Auth + Subscription Check)
- `/chat` - Vereist active of trial subscription

## SmartCTA Beslisboom

```
SmartCTA beslissing:
├─ Niet ingelogd? → /register
├─ Ingelogd + active? → /chat
├─ Ingelogd + trial actief? → /chat
├─ Ingelogd + trial verlopen? → /checkout?expired=true
└─ Ingelogd + inactive/expired? → /checkout?renew=true
```

## Breadcrumb Navigatie (Toekomstig)

Voor diepe routes kan breadcrumb helpen:
```
Home > Checkout > Betaling
Home > Chat > Instellingen
Home > Account > Facturatie
```

## Mobile Navigatie

### Hamburger Menu Volgorde
```
☰ Menu
├─ Home
├─ Prijzen
├─ Contact
├─ ─────────
├─ Inloggen
└─ Start gratis (Primary CTA)
```

## Loading States

### Route Transitions
- Skeleton loaders voor langzame navigatie
- Spinner voor auth checks
- Preserve scroll position waar relevant

## Error Pages

### 404 Not Found
- Friendly message
- Links naar: Home, Prijzen, Contact
- "Terug" button

### 403 Forbidden
- "Geen toegang tot deze pagina"
- Link naar login (als niet ingelogd)
- Link naar checkout (als geen subscription)

### 500 Server Error
- "Er ging iets mis"
- "Probeer opnieuw" button
- Contact support link
