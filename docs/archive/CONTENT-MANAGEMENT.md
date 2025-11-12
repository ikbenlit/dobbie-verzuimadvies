# Content Management Systeem - Implementatie Overzicht

## Samenvatting

Alle inhoudelijke teksten van de website zijn nu centraal beheerd via JSON-bestanden. Dit maakt het gemakkelijk om content aan te passen zonder in de code te hoeven duiken.

## Wat is er geïmplementeerd?

### 📁 Structuur

```
src/
├── content/
│   ├── nl/                    # Nederlandse content
│   │   ├── home.json          # Hero sectie + statistieken
│   │   ├── features.json      # Features sectie
│   │   ├── why-dobbie.json    # "Waarom DOBbie" sectie
│   │   ├── vision.json        # Visie sectie met oprichter quote
│   │   ├── faq.json          # Veelgestelde vragen
│   │   ├── pricing.json      # Prijzen en abonnementen
│   │   └── common.json       # Gedeelde teksten (nav, footer, buttons)
│   └── README.md             # Documentatie voor content beheer
├── types/
│   └── content.ts            # TypeScript interfaces voor type-safety
└── lib/
    └── content.ts            # Helper functies om content te laden
```

### ✅ Gerefactorde Components

Alle landing page componenten gebruiken nu de centrale content bestanden:

1. **Hero.tsx** - Home sectie met hoofdboodschap en CTA buttons
2. **Stats.tsx** - Statistieken sectie (95% nauwkeurigheid, 24/7, etc.)
3. **Features.tsx** - Feature cards met iconen
4. **WhyDobbie.tsx** - Voordelen sectie met checkmarks
5. **Vision.tsx** - Visie sectie met oprichter quote en foto
6. **FAQ.tsx** - Veelgestelde vragen accordeon
7. **PricingNew.tsx** - Pricing cards (Basis, Professioneel, Enterprise)
8. **Header.tsx** - Navigatie menu
9. **FooterNew.tsx** - Footer met links en copyright

### 🎯 Hoe werkt het?

#### Content aanpassen

1. Open het relevante JSON bestand in `src/content/nl/`
2. Pas de gewenste tekst aan
3. Sla het bestand op
4. Next.js detecteert de wijziging automatisch (Hot Reload)
5. Ververs de browser - wijzigingen zijn direct zichtbaar!

#### Voorbeeld: Hero tekst aanpassen

```json
// src/content/nl/home.json
{
  "hero": {
    "badge": "Online Verzuimadvies",
    "title": "Professioneel advies binnen handbereik",  // ← Deze tekst aanpassen
    "description": "Direct antwoord op al uw vragen...",
    ...
  }
}
```

#### Voorbeeld: FAQ item toevoegen

```json
// src/content/nl/faq.json
{
  "items": [
    ...bestaande items...,
    {
      "question": "Nieuwe vraag?",
      "answer": "Het antwoord hierop..."
    }
  ]
}
```

### 🔧 Type Safety

Alle content heeft TypeScript interfaces, wat betekent:
- Auto-completion in je code editor
- Type checking bij compilatie
- Voorkomt fouten door verkeerde data structuren

```typescript
// Gebruik in components
import { getHomeContent } from '@/lib/content';

export default function MyComponent() {
  const { hero } = getHomeContent(); // Type-safe!

  return <h1>{hero.title}</h1>;
}
```

### 🌍 Voorbereid op Internationalisatie

De structuur is opgezet met meertaligheid in gedachten:

```
src/content/
  nl/           # Nederlands (huidige implementatie)
  en/           # Engels (toekomstige uitbreiding)
  de/           # Duits (toekomstige uitbreiding)
```

Om een nieuwe taal toe te voegen:
1. Maak een nieuwe directory (bijv. `en/`)
2. Kopieer alle JSON bestanden uit `nl/`
3. Vertaal de teksten
4. Update `src/lib/content.ts` om de juiste taal te laden

### 📝 Best Practices

#### DO's ✅
- Test altijd na het aanpassen van content
- Gebruik duidelijke, beschrijvende teksten
- Houd JSON syntax geldig (gebruik een validator bij twijfel)
- Commit content wijzigingen met duidelijke commit messages

#### DON'Ts ❌
- Verwijder geen velden zonder de TypeScript types aan te passen
- Gebruik geen speciale karakters zonder proper escaping
- Verander de structuur niet zonder de components bij te werken

### 🚀 Toekomstige Mogelijkheden

Deze setup maakt het mogelijk om in de toekomst:

1. **CMS Integratie** - Migreer naar Sanity, Contentful, of Strapi
2. **A/B Testing** - Test verschillende versies van teksten
3. **Personalisatie** - Toon verschillende teksten per gebruikersgroep
4. **Multi-language** - Support voor meerdere talen
5. **Content Scheduling** - Plan content updates vooruit

### 📚 Documentatie

- **Content beheer**: `src/content/README.md`
- **Type definities**: `src/types/content.ts`
- **Helper functies**: `src/lib/content.ts`

### 🔗 Gerelateerde Bestanden

#### JSON Content Bestanden
- `src/content/nl/home.json` - Homepage content
- `src/content/nl/features.json` - Features
- `src/content/nl/why-dobbie.json` - Waarom DOBbie
- `src/content/nl/vision.json` - Visie
- `src/content/nl/faq.json` - FAQ
- `src/content/nl/pricing.json` - Prijzen
- `src/content/nl/common.json` - Gedeelde content

#### TypeScript Bestanden
- `src/types/content.ts` - Type definities
- `src/lib/content.ts` - Content helpers

#### Components
- `src/components/landing/Hero.tsx`
- `src/components/landing/Stats.tsx`
- `src/components/landing/Features.tsx`
- `src/components/landing/WhyDobbie.tsx`
- `src/components/landing/Vision.tsx`
- `src/components/landing/FAQ.tsx`
- `src/components/landing/PricingNew.tsx`
- `src/components/landing/Header.tsx`
- `src/components/landing/FooterNew.tsx`

## Vragen?

Bij vragen over het content management systeem:
1. Raadpleeg `src/content/README.md`
2. Bekijk de type definities in `src/types/content.ts`
3. Check de voorbeelden in `src/lib/content.ts`
