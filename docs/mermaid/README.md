# DOBbie UX Flow Diagrammen

Deze directory bevat Mermaid flow diagrammen die de gebruikersflows van DOBbie documenteren.

## Overzicht Diagrammen

### 1. [Nieuwe Gebruiker Flow](./01-nieuwe-gebruiker-flow.md)
**Doel**: Complete happy path voor nieuwe gebruikers
- Landing page → Registratie → Checkout → Chat
- Inclusief betaling via Mollie/iDEAL
- Success en cancel scenarios

### 2. [Bestaande Gebruiker Login Flow](./02-bestaande-gebruiker-login-flow.md)
**Doel**: Alle login scenario's met subscription checks
- Active subscription → Direct naar chat
- Trial actief → Chat met banner
- Trial/subscription verlopen → Checkout
- Inactive → Checkout

### 3. [Smart CTA Routing](./03-smart-cta-routing.md)
**Doel**: Intelligente routing logica voor CTA buttons
- Context-aware button gedrag
- Auth + subscription status checks
- Optimale user experience per status

### 4. [Checkout Bereikbaarheid](./04-checkout-bereikbaarheid.md)
**Doel**: Alle manieren om checkout te bereiken
- Direct URL access
- Na registratie
- Trial expiratie
- Renewal scenario's
- Navigatie links

### 5. [Complete Site Navigatie](./05-complete-site-navigatie.md)
**Doel**: Volledige site structuur en navigatie
- Header navigatie
- Footer links
- Protected routes
- User journeys

## Mermaid Syntax

Deze diagrammen gebruiken [Mermaid](https://mermaid.js.org/) syntax voor flowcharts. Ze kunnen worden gerenderd in:

- **GitHub**: Automatisch gerenderd in `.md` bestanden
- **VS Code**: Met de [Mermaid Preview](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid) extensie
- **Online**: Via [Mermaid Live Editor](https://mermaid.live/)
- **Documentation sites**: Docusaurus, MkDocs, etc.

## Kleuren Legenda

De diagrammen gebruiken kleurcodering voor verschillende states:

| Kleur | Betekenis | Hex Code |
|-------|-----------|----------|
| 🔵 Blauw | Start/Entry points | `#e1f5ff` |
| 🟡 Geel | Actieve processen | `#fff4e6` |
| 🟢 Groen | Succes/Toegang verleend | `#e8f5e9` |
| 🟠 Oranje | Waarschuwingen/Actions required | `#ffe0b2` |
| 🔴 Rood | Errors/Geweigerde toegang | `#ffebee` |
| 🟡 Licht geel | Trial status | `#fff9c4` |

## Gebruik in Ontwikkeling

Deze diagrammen dienen als:

1. **Ontwikkel Reference**: Begrijp de flows tijdens implementatie
2. **Onboarding**: Nieuwe teamleden snappen de UX snel
3. **QA Testing**: Test alle mogelijke paden
4. **Product Discussions**: Visuele basis voor UX beslissingen
5. **Documentation**: Technische documentatie voor stakeholders

## Updates

Deze diagrammen moeten ge-update worden bij:
- ✏️ Wijzigingen in user flows
- ✏️ Nieuwe features die flows beïnvloeden
- ✏️ Wijzigingen in subscription model
- ✏️ Nieuwe entry points of routes

## Related Documentation

- [Bouwplan MVP Checkout Flow](../BOUWPLAN-MVP-CHECKOUT-FLOW-ZONDER-TRIAL.md)
- [Overleg UX Frontend](../OVERLEG-UX-FRONTEND-LOGIN-CHECKOUT-FLOW.md)
- [Database Schema](../../supabase/migrations/)

## Vragen of Feedback?

Zie een flow die niet klopt? Suggesties voor verbetering?
- Update het diagram met de correcte flow
- Commit met duidelijke message
- Of bespreek in team overleg
