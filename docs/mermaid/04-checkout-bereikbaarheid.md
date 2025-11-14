# Checkout Page Bereikbaarheid

Alle routes waarop gebruikers de checkout page kunnen bereiken.

```mermaid
flowchart TD
    Entry[User wil naar Checkout]

    Entry --> Via{Via welke route?}

    Via -->|Direct URL /checkout| DirectURL[Direct naar /checkout]
    Via -->|Na registratie| AfterReg[/checkout?new=true]
    Via -->|Trial verlopen| TrialExp[/checkout?expired=true]
    Via -->|Renewal bestaande user| Renewal[/checkout?renew=true]
    Via -->|Navigatie 'Prijzen'| NavPricing[Navigatie → /#pricing<br/>Dan naar checkout]

    DirectURL --> AuthCheck{Authenticated?}
    AuthCheck -->|Nee| LoginRedirect[→ /login?redirect=/checkout]
    AuthCheck -->|Ja| SubCheck{Subscription<br/>status?}

    SubCheck -->|Al active| AlreadyActive[Melding: 'Je hebt al<br/>een actief abonnement'<br/>+ Link naar /chat]
    SubCheck -->|Niet active| ShowCheckout[Toon checkout<br/>plan selectie]

    AfterReg --> ShowCheckout
    TrialExp --> ShowCheckout
    Renewal --> ShowCheckout
    NavPricing --> ShowCheckout

    ShowCheckout --> SelectPlan[Plan kiezen:<br/>Solo / Team]
    SelectPlan --> Pay[Betalen via<br/>Mollie/iDEAL]

    style DirectURL fill:#e1f5ff
    style ShowCheckout fill:#fff4e6
    style AlreadyActive fill:#e8f5e9
    style LoginRedirect fill:#fff9c4
```

## Entry Points

### 1. Direct URL
**URL**: `/checkout`
- **Scenario**: User typt URL in of bookmark
- **Check**: Authentication status
- **Actie bij niet-ingelogd**: Redirect naar login met return URL

### 2. Na Registratie
**URL**: `/checkout?new=true`
- **Trigger**: Automatisch na succesvolle registratie
- **Context**: Nieuwe user, eerste betaling
- **UX**: "Welkom! Kies je abonnement"

### 3. Trial Verlopen
**URL**: `/checkout?expired=true`
- **Trigger**: Chat layout detecteert verlopen trial
- **Context**: User heeft product gebruikt, trial is op
- **UX**: "Je trial is afgelopen, kies een abonnement"

### 4. Renewal
**URL**: `/checkout?renew=true`
- **Trigger**: Inactive of expired subscription
- **Context**: User komt terug, moet verlengen
- **UX**: "Verleng je abonnement om door te gaan"

### 5. Navigatie Link
**Via**: Header of Footer → "Prijzen"
- **Eerste stop**: Pricing section (/#pricing of dedicated page)
- **Vervolgens**: CTA buttons naar checkout
- **Context**: User wil prijzen zien voor beslissing

## Auth Check Gedrag

### Niet Geauthenticeerd
```
/checkout → Check auth → Niet ingelogd
  ↓
/login?redirect=/checkout
  ↓
Na login → Terug naar /checkout
```

### Al Active Subscription
```
/checkout → Check auth → Ingelogd + Active
  ↓
Melding tonen: "Je hebt al een actief abonnement"
+ Button: "Ga naar chat"
```

### Inactive/Expired
```
/checkout → Check auth → Ingelogd + Niet active
  ↓
Normale checkout flow tonen
```

## Query Parameters Betekenis

| Parameter | Betekenis | UX Message |
|-----------|-----------|------------|
| `?new=true` | Net geregistreerd | "Welkom! Kies je eerste abonnement" |
| `?expired=true` | Trial/subscription verlopen | "Je trial/abonnement is afgelopen" |
| `?renew=true` | Algemene renewal | "Kies een abonnement om door te gaan" |
| Geen params | Direct bezoek | Standaard checkout |

## Preservation van Parameters

Parameters worden bewaard bij:
- Login redirect: `?redirect=/checkout?expired=true`
- Error recovery: Blijven in URL
- Terug van cancel page: `?plan=team&billing=yearly` preserved

## Edge Cases

### Al Betaald Maar Probeert Opnieuw
- Toon friendly message
- Link naar chat
- Optioneel: Link naar account/billing management (toekomstig)

### Halfway Payment Flow
- User start betaling, sluit tab
- Komt terug via direct URL
- Checkout detecteert pending payment (future: show status)

### Multiple Browser Tabs
- User heeft checkout in twee tabs open
- Betaalt in tab 1
- Tab 2 toont nog checkout → bij refresh: "Al actief" message
