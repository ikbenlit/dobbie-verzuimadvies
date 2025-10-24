# Content Management Systeem

Deze directory bevat alle inhoudelijke teksten van de website in een gestructureerde JSON-formaat.

## Structuur

```
src/content/
  nl/                    # Nederlandse content (standaard)
    home.json           # Homepage content (hero, stats)
    features.json       # Features sectie
    why-dobbie.json     # "Waarom DOBbie" sectie
    vision.json         # Visie sectie met oprichter quote
    faq.json           # Veelgestelde vragen
    pricing.json       # Prijzen en abonnementen
    common.json        # Gedeelde content (navigatie, footer, buttons)
  en/                   # Engels (toekomstige uitbreiding)
  README.md            # Deze documentatie
```

## Gebruik

### Import content in components

```typescript
import { getHomeContent, getFeaturesContent, getCommonContent } from '@/lib/content';

export default function MyComponent() {
  const home = getHomeContent();
  const features = getFeaturesContent();
  const common = getCommonContent();

  return (
    <div>
      <h1>{home.hero.title}</h1>
      <p>{home.hero.description}</p>
    </div>
  );
}
```

### Beschikbare helper functies

- `getHomeContent()` - Homepage content (hero + statistieken)
- `getFeaturesContent()` - Features sectie
- `getWhyDobbieContent()` - Waarom DOBbie sectie
- `getVisionContent()` - Visie sectie
- `getFAQContent()` - FAQ items
- `getPricingContent()` - Prijzen
- `getCommonContent()` - Navigatie, footer, buttons
- `getAllContent(locale)` - Alle content voor een taal

## Type Safety

Alle content heeft TypeScript interfaces gedefinieerd in `src/types/content.ts`:

- `HomeContent`
- `FeaturesContent`
- `WhyDobbieContent`
- `VisionContent`
- `FAQContent`
- `PricingContent`
- `CommonContent`

## Content bewerken

1. Open het relevante JSON bestand in `src/content/nl/`
2. Pas de gewenste teksten aan
3. Sla het bestand op - Next.js detecteert de wijziging automatisch (Fast Refresh)
4. De wijzigingen zijn direct zichtbaar in de browser

## Toekomstige uitbreidingen

### Meertaligheid

De structuur is voorbereid voor meertaligheid:

```typescript
// Voorbeeld voor Engels
const content = getAllContent('en');
```

Voeg simpelweg een `en/` directory toe met vertaalde JSON bestanden.

### CMS integratie

De huidige structuur kan gemakkelijk worden gemigreerd naar een headless CMS zoals:
- Sanity
- Contentful
- Strapi
- Payload CMS

De TypeScript interfaces blijven hetzelfde, alleen de data source verandert.

## Best Practices

1. **Houd JSON bestanden clean** - Gebruik duidelijke keys en structuur
2. **Valideer JSON syntax** - Gebruik een JSON validator bij twijfel
3. **Test na wijzigingen** - Check altijd de website na content updates
4. **Gebruik type-safe imports** - Import altijd via de helper functies in `@/lib/content`
5. **Documenteer nieuwe velden** - Voeg nieuwe velden toe aan de TypeScript interfaces

## Vragen?

Bij vragen of problemen, raadpleeg:
- `src/types/content.ts` voor alle type definities
- `src/lib/content.ts` voor helper functies
- Deze README voor algemene documentatie
