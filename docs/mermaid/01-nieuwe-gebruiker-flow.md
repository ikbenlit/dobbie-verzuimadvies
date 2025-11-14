# Nieuwe Gebruiker Flow (Happy Path)

Complete flow voor een nieuwe gebruiker van landing page tot chat interface.

```mermaid
flowchart TD
    Start[Landing Page] --> CTA{User klikt Hero CTA<br/>'Start gratis'}
    CTA --> CheckAuth{Authenticated?}

    CheckAuth -->|Nee| Register[Register Page<br/>Stap 1: Account maken]
    Register --> FormFill[Invullen:<br/>- Naam<br/>- Email<br/>- Wachtwoord<br/>- Organisatie optioneel]
    FormFill --> Submit[Submit]
    Submit --> AutoLogin[Auto-login succesvol]

    AutoLogin --> Checkout[Checkout Page<br/>Stap 2: Kies abonnement]
    Checkout --> SelectPlan[Kies plan:<br/>Solo / Team]
    SelectPlan --> SelectBilling[Kies periode:<br/>Maand / Jaar]
    SelectBilling --> EnterDiscount[Discount code?<br/>optioneel]
    EnterDiscount --> PayMollie[Betalen via<br/>Mollie/iDEAL]

    PayMollie --> PaySuccess{Betaling<br/>gelukt?}
    PaySuccess -->|Ja| Success[Success Page<br/>Welkom bij DOBbie!]
    PaySuccess -->|Nee| Cancel[Cancel Page<br/>Betaling mislukt]

    Success --> Chat[Chat Interface<br/>Volledige toegang]
    Cancel --> RetryLink[Opnieuw proberen]
    RetryLink --> Checkout

    style Start fill:#e1f5ff
    style Register fill:#fff4e6
    style Checkout fill:#fff4e6
    style Success fill:#e8f5e9
    style Chat fill:#e8f5e9
    style Cancel fill:#ffebee
```

## Flow Beschrijving

### Stap 1: Landing Page
- User landt op homepage
- Ziet Hero CTA "Start gratis" of "Start nu"

### Stap 2: Registratie
- Niet-geauthenticeerde users worden naar register page gestuurd
- Invullen van basisgegevens: naam, email, wachtwoord, organisatie (optioneel)
- Na submit: automatische login

### Stap 3: Checkout
- Direct na registratie redirect naar checkout
- User kiest abonnement (Solo/Team)
- Kiest facturatie periode (Maand/Jaar)
- Optioneel: discount code invullen
- Betaling via Mollie/iDEAL

### Stap 4: Betaling
- Bij succes: redirect naar success page
- Bij cancel: redirect naar cancel page met retry optie

### Stap 5: Chat Interface
- Na succesvolle betaling: volledige toegang tot chat
- Subscription status = 'active'

## Belangrijke Notes

- **Auto-login**: Na registratie wordt gebruiker automatisch ingelogd
- **Query parameters**: Checkout krijgt `?new=true` na registratie
- **Fail-safe**: Bij betaling problemen kan gebruiker opnieuw proberen
- **Status tracking**: Subscription status wordt via webhook ge-update
