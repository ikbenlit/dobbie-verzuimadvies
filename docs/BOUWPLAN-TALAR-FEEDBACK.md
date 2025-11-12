# 🏗️ Gefaseerd Bouwplan: Talar Feedback Implementatie

**Project:** DoBbie Landingspagina Aanpassingen  
**Datum:** 10 november 2025  
**Deadline:** 19 november 2025 (live op 20 november)  
**Context:** Solo werken met AI tools (Cursor agents, Claude code)  
**Status:** 🔴 Kritiek - Voor productie launch

---

## 📊 Status Overzichtstabel

**Laatste Update:** 10 november 2025

| Fase | Subfase | Omschrijving | Status | Tijd (AI) | Bestanden | Opmerkingen |
|------|---------|--------------|--------|-----------|-----------|-------------|
| **FASE 1** | **Content & Structuur** | | | **2-3 uur** | | |
| | 1.1 | Sectievolgorde aanpassen | ⚪ | 15 min | `app/page.tsx` | |
| | 1.2 | UseCases component maken | ⚪ | 45 min | `src/components/landing/UseCases.tsx` (nieuw) | |
| | 1.3 | UseCases content JSON | ⚪ | 15 min | `src/content/nl/use-cases.json` (nieuw) | |
| | 1.4 | Type definities uitbreiden | ⚪ | 30 min | `src/types/content.ts` | |
| | 1.5 | Content helper functie | ⚪ | 15 min | `src/lib/content.ts` | |
| | 1.6 | Testing & fixes | ⚪ | 30-45 min | - | Handmatig |
| **FASE 2** | **CTA's Toevoegen/Aanpassen** | | | **1.5-2.5 uur** | | |
| | 2.1 | Hero CTA aanpassen | ⚪ | 10 min | `src/content/nl/home.json` | |
| | 2.2 | ProblemSolution CTA | ⚪ | 20 min | `src/components/landing/ProblemSolution.tsx` | |
| | 2.3 | Vision CTA toevoegen | ⚪ | 20 min | `src/components/landing/Vision.tsx` | |
| | 2.4 | DobbieHero CTA toevoegen | ⚪ | 20 min | `src/components/landing/DobbieHero.tsx` | |
| | 2.5 | CombinedBenefits CTA | ⚪ | 20 min | `src/components/landing/CombinedBenefits.tsx` | Smooth scroll |
| | 2.6 | Testimonials CTA | ⚪ | 20 min | `src/components/landing/Testimonials.tsx` | Smooth scroll |
| | 2.7 | Pricing CTA teksten | ⚪ | 15 min | `src/content/nl/pricing.json` | |
| | 2.8 | FAQ CTA toevoegen | ⚪ | 20 min | `src/components/landing/FAQ.tsx` | |
| | 2.9 | DobbieCTA tekst | ⚪ | 10 min | `src/content/nl/dobbie-cta.json` | |
| | 2.10 | Testing links & scroll | ⚪ | 30 min | - | Handmatig |
| **FASE 3** | **Pricing Features** | | | **1.5-2 uur** | | |
| | 3.1 | Besparing tonen | ⚪ | 30 min | `src/components/landing/PricingNew.tsx` | Check bedragen met Talar |
| | 3.2 | Enterprise optie | ⚪ | 30 min | `src/components/landing/PricingNew.tsx` | |
| | 3.3 | Kortingscode input (frontend) | ⚪ | 30-45 min | `app/(auth)/register/page.tsx` | Basis validatie |
| | 3.4 | Testing & edge cases | ⚪ | 15-30 min | - | Handmatig |
| **FASE 4** | **Mobile Optimalisatie** | | | **1.5-2.5 uur** | | |
| | 4.1 | White space verminderen | ⚪ | 45 min | Alle landing components | Tailwind classes |
| | 4.2 | Hero mobile layout | ⚪ | 30 min | `src/components/landing/Hero.tsx` | |
| | 4.3 | Responsive spacing | ⚪ | 30 min | Alle landing components | Breakpoints |
| | 4.4 | Device testing | ⚪ | 30-45 min | - | Handmatig op devices |
| **FASE 5** | **Registratie Flow** | | | **45 min - 1 uur** | | |
| | 5.1 | Trial messaging verwijderen | ⚪ | 15 min | `app/(auth)/register/page.tsx` | Find & replace |
| | 5.2 | "14 dagen gratis opzegbaar" messaging | ⚪ | 20 min | Content bestanden | |
| | 5.3 | Knoppen bijwerken | ⚪ | 15 min | Registratie componenten | |
| | 5.4 | Testing flow | ⚪ | 15-20 min | - | Handmatig |
| **FASE 6** | **Testing & Polish** | | | **2-3 uur** | | |
| | 6.1 | Cross-browser testing | ⚪ | 45 min | - | Handmatig |
| | 6.2 | Mobile device testing | ⚪ | 45 min | - | Handmatig |
| | 6.3 | Link validatie | ⚪ | 30 min | - | Handmatig |
| | 6.4 | Smooth scroll testen | ⚪ | 15 min | - | Handmatig |
| | 6.5 | Bug fixes | ⚪ | 30-45 min | - | Afhankelijk van issues |
| **FASE 7** | **Webinar Pagina's** | | | **2-3 uur** | | |
| | 7.1 | Salespagina webinar | ⚪ | 1-1.5 uur | `app/webinar/page.tsx` (nieuw) | Met content van Talar |
| | 7.2 | Registratiepagina webinar | ⚪ | 45 min - 1 uur | `app/webinar/register/page.tsx` (nieuw) | Formulier + validatie |
| | 7.3 | Webinar content JSON | ⚪ | 15 min | `src/content/nl/webinar.json` (nieuw) | |
| | 7.4 | Testing webinar flow | ⚪ | 15-30 min | - | Handmatig |
| **TOTAAL** | | | | **11.5-16.5 uur** | | Met buffer: 15-21 uur |

**Legenda Status:**
- ⚪ Niet gestart
- 🟡 In uitvoering
- ✅ Voltooid
- 🔴 Blokkerend probleem

---

## 🎯 Overzicht & Context

**Belangrijke context:**
- Geen trial meer, maar **opt-out binnen 2 weken** (aanpassen knoppen bij registratie)
- Pricing is definitief zoals het nu staat
- Sectievolgorde moet worden aangepast voor betere emotionele flow
- Mobile-first: minder white space, betere leesbaarheid
- **Webinar op 20 november:** Salespagina en registratiepagina nodig

**AI Tools Versnelling:**
- Component generatie: 70% sneller
- Code refactoring: 60% sneller
- TypeScript types: 80% sneller
- Content updates: 50% sneller (JSON is al gestructureerd)

---

## 📋 FASE 1: Content & Structuur

**Totaal:** 2-3 uur  
**Prioriteit:** 🔴 Kritiek

### 1.1 Sectievolgorde Aanpassen
**Tijd:** 15 min  
**Status:** ⚪  
**Bestand:** `app/page.tsx`

**Huidige volgorde:**
1. Hero
2. ProblemSolution
3. DobbieHero
4. CombinedBenefits
5. DobbieTargetGroups
6. Testimonials
7. Vision
8. PricingNew
9. FAQ
10. DobbieCTA

**Gewenste volgorde:**
1. Hero
2. **DobbieHero** (Maak kennis met DOBbie)
3. **Vision** (De wens van elke organisatie / Verlangen)
4. **Testimonials** (Reviews en ervaringen)
5. **ProblemSolution** (De pijn met CTA knop)
6. **CombinedBenefits** (Wat DOBbie in de praktijk oplevert)
7. **UseCases** (NIEUWE SECTIE: "Waar kan je DOBbie voor gebruiken")
8. **DobbieTargetGroups** (Ontwikkeld door een BA)
9. **PricingNew**
10. **FAQ**
11. **DobbieCTA**

**Actie:** Componenten herordenen in `app/page.tsx`

---

### 1.2 UseCases Component Maken
**Tijd:** 45 min  
**Status:** ⚪  
**Bestand:** `src/components/landing/UseCases.tsx` (nieuw)

**Actie:** 
- Nieuwe React component maken
- Styling consistent met andere landing components
- Gebruik Tailwind CSS
- Responsive design

**Structuur:**
- Titel: "Waar kan je DOBbie voor gebruiken"
- Lijst met 5 use cases (zie 1.3 voor content)
- Icons/visuals per use case
- CTA knop optioneel

---

### 1.3 UseCases Content JSON
**Tijd:** 15 min  
**Status:** ⚪  
**Bestand:** `src/content/nl/use-cases.json` (nieuw)

**Content:**
```json
{
  "title": "Waar kan je DOBbie voor gebruiken",
  "subtitle": "...",
  "useCases": [
    {
      "title": "Alle niet medische vragen",
      "description": "Alle niet medische vragen die je normaal aan de bedrijfsarts zou stellen (en afhankelijk bent van diens beschikbaarheid)"
    },
    {
      "title": "Interpretatie van terugkoppelingen",
      "description": "Interpretatie van terugkoppelingen die gemaakt zijn door de bedrijfsarts (Is het door ons bedachte werk passend bij de gestelde beperkingen?)"
    },
    {
      "title": "Goede vraagstelling opstellen",
      "description": "Een goede vraagstelling opstellen voor het consult met de bedrijfsarts (NB: in volgende versie concretere opdracht inbouwen)"
    },
    {
      "title": "Communicatie en verbinding",
      "description": "Helpen in de communicatie en verbinding naar de werknemer(s)"
    },
    {
      "title": "Procesbegeleiding",
      "description": "Procesbegeleiding tijdens verzuim cf. WVP (wat moet je doen, wanneer)"
    }
  ]
}
```

---

### 1.4 Type Definities Uitbreiden
**Tijd:** 30 min  
**Status:** ⚪  
**Bestand:** `src/types/content.ts`

**Actie:**
- Interface `UseCasesContent` toevoegen
- Interface uitbreiden in `SiteContent`
- Type safety voor nieuwe content

---

### 1.5 Content Helper Functie
**Tijd:** 15 min  
**Status:** ⚪  
**Bestand:** `src/lib/content.ts`

**Actie:**
- Functie `getUseCasesContent()` toevoegen
- Export toevoegen
- Consistent met andere helpers

---

### 1.6 Testing & Fixes
**Tijd:** 30-45 min  
**Status:** ⚪  
**Type:** Handmatig

**Acties:**
- Component renderen testen
- Type errors checken
- Content correct laden
- Layout testen op desktop/mobile

---

## 📋 FASE 2: CTA's Toevoegen/Aanpassen

**Totaal:** 1.5-2.5 uur  
**Prioriteit:** 🔴 Kritiek

### 2.1 Hero CTA Aanpassen
**Tijd:** 10 min  
**Status:** ⚪  
**Bestand:** `src/content/nl/home.json`

**Huidige situatie:** Hero heeft primary en secondary CTA  
**Gewenst:**
- **Knop tekst:** "Start vandaag nog – binnen 14 dagen gratis opzegbaar"
- **Link:** `/register`

**Actie:** Tekst aanpassen in `hero.primaryCta`

---

### 2.2 ProblemSolution CTA
**Tijd:** 20 min  
**Status:** ⚪  
**Bestand:** `src/components/landing/ProblemSolution.tsx`

**Gewenst:**
- **Knop:** "Bekijk hoe DOBbie werkt"
- **Link:** Scroll naar uitleg sectie (of later naar webinar inschrijving)

**Actie:** CTA toevoegen aan component

---

### 2.3 Vision CTA Toevoegen
**Tijd:** 20 min  
**Status:** ⚪  
**Bestand:** `src/components/landing/Vision.tsx`

**Gewenst:**
- **Knop:** "Laat DOBbie het verschil maken"
- **Link:** `/register`

**Actie:** CTA toevoegen na Vision sectie

---

### 2.4 DobbieHero CTA Toevoegen
**Tijd:** 20 min  
**Status:** ⚪  
**Bestand:** `src/components/landing/DobbieHero.tsx`

**Gewenst:**
- **Knop:** "Ervaar het zelf – probeer DOBbie vandaag"
- **Link:** `/register`

**Actie:** CTA toevoegen aan component

---

### 2.5 CombinedBenefits CTA
**Tijd:** 20 min  
**Status:** ⚪  
**Bestand:** `src/components/landing/CombinedBenefits.tsx`

**Gewenst:**
- **Knop:** "Start met tijdwinst en grip"
- **Link:** Scroll naar prijstabel (`#pricing`)
- **Smooth scroll:** Implementeren

**Actie:** CTA toevoegen met smooth scroll functionaliteit

---

### 2.6 Testimonials CTA
**Tijd:** 20 min  
**Status:** ⚪  
**Bestand:** `src/components/landing/Testimonials.tsx`

**Gewenst:**
- **Knop:** "Ik wil dit ook – bekijk prijzen"
- **Link:** Scroll naar prijstabel (`#pricing`)
- **Smooth scroll:** Implementeren

**Actie:** CTA toevoegen na testimonials grid

---

### 2.7 Pricing CTA Teksten
**Tijd:** 15 min  
**Status:** ⚪  
**Bestand:** `src/content/nl/pricing.json`

**Gewenst:**
- **Solo knop tekst:** "Ja, ik wil DOBbie voor mezelf"
- **Team knop tekst:** "Ja, wij willen minimaal 2 accounts"

**Actie:** Teksten aanpassen in pricing content

---

### 2.8 FAQ CTA Toevoegen
**Tijd:** 20 min  
**Status:** ⚪  
**Bestand:** `src/components/landing/FAQ.tsx`

**Gewenst:**
- **Knop:** "Nog vragen? Schrijf je in voor de gratis webinar"
- **Link:** Later naar webinar inschrijving (voor nu placeholder `/contact` of `#`)

**Actie:** CTA toevoegen na FAQ items

---

### 2.9 DobbieCTA Tekst
**Tijd:** 10 min  
**Status:** ⚪  
**Bestand:** `src/content/nl/dobbie-cta.json`

**Huidige situatie:** "Start vandaag nog / Plan een demo"  
**Gewenst:** "Start vandaag nog – 14 dagen kosteloos opzegbaar"

**Actie:** Tekst aanpassen in content

---

### 2.10 Testing Links & Scroll
**Tijd:** 30 min  
**Status:** ⚪  
**Type:** Handmatig

**Acties:**
- Alle links testen (werkend naar juiste pagina)
- Smooth scroll functionaliteit testen
- CTA knoppen visueel checken
- Mobile responsive testen

---

## 📋 FASE 3: Pricing Features

**Totaal:** 1.5-2 uur  
**Prioriteit:** 🟡 Hoog

### 3.1 Besparing Tonen
**Tijd:** 30 min  
**Status:** ⚪  
**Bestand:** `src/components/landing/PricingNew.tsx`

**Gewenst:**
- Bij Solo: "Betaal per jaar en bespaar €X" (marketingtechnisch goed verwoorden)
- Bij Team: "Betaal per jaar en bespaar €X" (marketingtechnisch goed verwoorden)

**Berekening (te checken met Talar):**
- Solo: (€49 × 12) - €149 = €588 - €149 = €439 besparing?
- Team: (€39 × 12) - €99 = €468 - €99 = €369 besparing?

**Actie:** 
- Besparing berekenen
- UI update in pricing cards
- Marketingtechnisch goede formulering

**⚠️ Beslissing nodig:** Exacte bedragen van Talar

---

### 3.2 Enterprise Optie
**Tijd:** 30 min  
**Status:** ⚪  
**Bestand:** `src/components/landing/PricingNew.tsx`

**Gewenst:**
- Tekst: "Enterprise: Wil je meer dan 15 accounts? Neem contact op voor een offerte op maat!"
- Plaats: Onder de pricing cards

**Actie:** Enterprise sectie toevoegen aan pricing component

---

### 3.3 Kortingscode Input (Frontend)
**Tijd:** 30-45 min  
**Status:** ⚪  
**Bestand:** `app/(auth)/register/page.tsx`

**Gewenst:**
- Kortingscode: `NVVA2025`
- Geldig tot: 30 november 23:59u
- Input veld in registratie formulier
- Basis frontend validatie

**Actie:** 
- Input veld toevoegen
- Basis validatie (format check)
- UI feedback

**⚠️ Opmerking:** Volledige backend validatie kost extra tijd (2-3 uur), maar basis frontend input kan snel.

---

### 3.4 Testing & Edge Cases
**Tijd:** 15-30 min  
**Status:** ⚪  
**Type:** Handmatig

**Acties:**
- Besparing berekening testen
- Enterprise optie visueel checken
- Kortingscode input testen
- Edge cases (lege input, foutieve code, etc.)

---

## 📋 FASE 4: Mobile Optimalisatie

**Totaal:** 1.5-2.5 uur  
**Prioriteit:** 🟡 Hoog

### 4.1 White Space Verminderen
**Tijd:** 45 min  
**Status:** ⚪  
**Bestanden:** Alle landing components

**Probleem:** Te veel white space, voelt niet mobile-friendly  
**Gewenst:** Meer leesmodus, logische verdeling

**Acties:**
1. Padding/margin aanpassen op mobile breakpoints
2. Sectie spacing optimaliseren
3. Text sizing voor mobile verbeteren

**Tailwind Classes Aanpassen:**
- `py-24` → `py-12 md:py-24` (minder padding op mobile)
- `px-4` → `px-4 md:px-6` (consistent spacing)
- Text sizes: `text-3xl` → `text-2xl md:text-3xl`

---

### 4.2 Hero Mobile Layout
**Tijd:** 30 min  
**Status:** ⚪  
**Bestand:** `src/components/landing/Hero.tsx`

**Probleem:** Leeg blok met kopje bij opening op mobile  
**Gewenst:** Betere mobile layout zonder lege ruimtes

**Acties:**
- Hero component mobile-first herzien
- Grid layout aanpassen voor mobile
- Video/mockup sizing voor mobile
- Padding/margin optimaliseren

---

### 4.3 Responsive Spacing
**Tijd:** 30 min  
**Status:** ⚪  
**Bestanden:** Alle landing components

**Acties:**
- Breakpoint optimalisatie (sm, md, lg, xl)
- Consistent spacing systeem
- Gap tussen secties aanpassen
- Container max-widths checken

---

### 4.4 Device Testing
**Tijd:** 30-45 min  
**Status:** ⚪  
**Type:** Handmatig op echte devices

**Acties:**
- Testen op verschillende devices (iPhone, Android)
- Verschillende schermformaten
- Landscape/portrait orientatie
- Touch interacties testen

---

## 📋 FASE 5: Registratie Flow

**Totaal:** 45 min - 1 uur  
**Prioriteit:** 🔴 Kritiek

### 5.1 Trial Messaging Verwijderen
**Tijd:** 15 min  
**Status:** ⚪  
**Bestand:** `app/(auth)/register/page.tsx`

**Actie:** 
- Find & replace "trial" → verwijderen
- Check alle bestanden voor trial messaging
- Verwijder trial-specifieke logica (indien aanwezig)

---

### 5.2 "14 Dagen Gratis Opzegbaar" Messaging
**Tijd:** 20 min  
**Status:** ⚪  
**Bestanden:** Content bestanden

**Acties:**
- Vervang "trial" door "14 dagen gratis opzegbaar"
- Update alle CTA teksten
- Update registratie pagina tekst
- Check alle content bestanden

**Bestanden te checken:**
- `src/content/nl/home.json`
- `src/content/nl/pricing.json`
- `src/content/nl/dobbie-cta.json`
- `app/(auth)/register/page.tsx`

---

### 5.3 Knoppen Bijwerken
**Tijd:** 15 min  
**Status:** ⚪  
**Bestanden:** Registratie componenten

**Acties:**
- Update button teksten
- Check styling consistentie
- Update tooltips/hints

---

### 5.4 Testing Flow
**Tijd:** 15-20 min  
**Status:** ⚪  
**Type:** Handmatig

**Acties:**
- Registratie flow doorlopen
- Messaging checken
- Knoppen testen
- Flow logica valideren

---

## 📋 FASE 6: Testing & Polish

**Totaal:** 2-3 uur  
**Prioriteit:** 🔴 Kritiek

### 6.1 Cross-Browser Testing
**Tijd:** 45 min  
**Status:** ⚪  
**Type:** Handmatig

**Browsers te testen:**
- Chrome (desktop & mobile)
- Firefox (desktop & mobile)
- Safari (desktop & mobile)
- Edge

**Te checken:**
- Layout consistentie
- Functionaliteit werkt
- Geen console errors
- Performance

---

### 6.2 Mobile Device Testing
**Tijd:** 45 min  
**Status:** ⚪  
**Type:** Handmatig op echte devices

**Devices:**
- iPhone (verschillende modellen)
- Android (verschillende modellen)
- Tablets (iPad, Android tablet)

**Te checken:**
- Touch interacties
- Scroll gedrag
- Layout op verschillende schermformaten
- Performance op mobile

---

### 6.3 Link Validatie
**Tijd:** 30 min  
**Status:** ⚪  
**Type:** Handmatig

**Acties:**
- Alle links testen (werkend)
- Externe links checken
- Interne navigatie testen
- Smooth scroll links testen
- 404 errors voorkomen

---

### 6.4 Smooth Scroll Testen
**Tijd:** 15 min  
**Status:** ⚪  
**Type:** Handmatig

**Acties:**
- Smooth scroll naar `#pricing` testen
- Scroll gedrag checken
- Performance testen
- Mobile scroll testen

---

### 6.5 Bug Fixes
**Tijd:** 30-45 min  
**Status:** ⚪  
**Type:** Afhankelijk van issues

**Acties:**
- Gevonden bugs fixen
- Edge cases afhandelen
- Performance optimalisaties
- Laatste polish

---

## 🗓️ Planning Opties

### Optie 1: Intensief (6-8 uur per dag)
**Totaal:** 2-2.5 dagen werk  
**Planning:**
- Dag 1: Fase 1-3 + Fase 7 (7-10.5 uur)
- Dag 2: Fase 4-6 (4.5-6.5 uur)

**✅ Haalbaar voor deadline**

---

### Optie 2: Normaal (4-5 uur per dag)
**Totaal:** 3-4 dagen werk  
**Planning:**
- Dag 1: Fase 1-2 (3.5-5.5 uur)
- Dag 2: Fase 3-4 + Fase 7 (5-7.5 uur)
- Dag 3: Fase 5-6 (3-4 uur)

**✅ Comfortabel voor deadline**

---

### Optie 3: Rustig (2-3 uur per dag)
**Totaal:** 5-6 dagen werk  
**Planning:**
- Dag 1-2: Fase 1-2
- Dag 3: Fase 3-4
- Dag 4: Fase 7 (Webinar pagina's - kritiek!)
- Dag 5: Fase 5
- Dag 6: Fase 6

**✅ Ruim binnen deadline**

---

## ⚠️ Risico's & Buffer

### Mogelijke Vertragingen

1. **Kortingscode Backend** (+2-3 uur)
   - Als volledige automatische validatie nodig is
   - Database schema updates
   - API endpoints

2. **Mobile Issues** (+1-2 uur)
   - Onverwachte layout problemen
   - Device-specifieke bugs

3. **Client Feedback** (+1-3 uur)
   - Aanpassingen na review
   - Extra iteraties

4. **Sales Pagina Claims Check** (+1-2 uur)
   - Analyse van AI capabilities
   - Documentatie schrijven

**Aanbevolen Buffer:** +3-5 uur (20-30% van totaal)

---

## 📋 FASE 7: Webinar Pagina's

**Totaal:** 2-3 uur  
**Prioriteit:** 🔴 Kritiek (voor 20 november)

### 7.1 Salespagina Webinar
**Tijd:** 1-1.5 uur  
**Status:** ⚪  
**Bestand:** `app/webinar/page.tsx` (nieuw)

**Context:** 
- Talar heeft content aangeleverd in de mailwisseling
- Salespagina voor NVVA congres webinar
- Moet klaar zijn voor 20 november

**Content uit mailwisseling:**
- Titel: "DOBbie - jouw AI verzuimbuddy. Exclusief Congresaanbod"
- Intro tekst over lezing op NVVA-congres
- Wat is DOBbie sectie
- Wat levert het op als arbeidsdeskundige (6 punten)
- Congresaanbod met kortingscode NVVA2025
- Solo-licentie: €149/jaar (normaal €49/maand)
- Teamlicentie: €99/account/jaar (normaal €39/account/maand)
- Kortingscode: NVVA2025 (geldig tot 30 november)
- CTA: "Direct aan de slag?"
- Waarom nú starten sectie
- Contact informatie

**Acties:**
- Nieuwe pagina maken: `app/webinar/page.tsx`
- Content structureren in JSON
- Componenten maken voor verschillende secties
- Styling consistent met landingspagina
- Responsive design
- CTA knoppen naar registratiepagina

**Structuur:**
- Hero sectie met congresaanbod badge
- Intro sectie
- Wat is DOBbie
- Voordelen voor arbeidsdeskundige
- Pricing sectie met kortingscode
- CTA sectie
- Contact sectie

---

### 7.2 Registratiepagina Webinar
**Tijd:** 45 min - 1 uur  
**Status:** ⚪  
**Bestand:** `app/webinar/register/page.tsx` (nieuw)

**Gewenst:**
- Formulier voor webinar inschrijving
- Velden: naam, email, organisatie (optioneel), kortingscode (optioneel)
- Validatie
- Bevestiging na inschrijving
- Link naar DOBbie registratie met kortingscode

**Acties:**
- Nieuwe pagina maken: `app/webinar/register/page.tsx`
- Formulier component maken
- Validatie implementeren
- Success state na inschrijving
- Integratie met email service (optioneel, kan later)

**Formulier velden:**
- Naam (verplicht)
- Email (verplicht)
- Organisatie (optioneel)
- Kortingscode (optioneel, pre-filled met NVVA2025)
- Checkbox: "Ik ga akkoord met..." (optioneel)

**Na inschrijving:**
- Bevestigingsbericht
- Link naar DOBbie registratie met kortingscode
- Of directe redirect naar registratie met kortingscode

---

### 7.3 Webinar Content JSON
**Tijd:** 15 min  
**Status:** ⚪  
**Bestand:** `src/content/nl/webinar.json` (nieuw)

**Actie:**
- Content bestand maken met alle teksten uit Talar's mail
- Structuur voor salespagina
- Structuur voor registratiepagina
- Type definitie toevoegen

**Content structuur:**
```json
{
  "sales": {
    "title": "DOBbie - jouw AI verzuimbuddy",
    "subtitle": "Exclusief Congresaanbod",
    "intro": "...",
    "whatIsDobbie": "...",
    "benefits": [...],
    "pricing": {...},
    "cta": {...}
  },
  "register": {
    "title": "Schrijf je in voor het webinar",
    "form": {...}
  }
}
```

---

### 7.4 Testing Webinar Flow
**Tijd:** 15-30 min  
**Status:** ⚪  
**Type:** Handmatig

**Acties:**
- Salespagina testen (layout, content, links)
- Registratieformulier testen (validatie, submit)
- Flow testen: salespagina → registratie → bevestiging
- Mobile responsive testen
- Link naar DOBbie registratie testen

---

## 🚨 Kritieke Beslissingen Nodig

1. **Besparing bedragen:** Exacte bedragen voor "Betaal per jaar en bespaar €X" (check met Talar)
2. **Webinar registratie:** Email service integratie nodig? Of alleen formulier met bevestiging?
3. **Kortingscode implementatie:** Volledig geautomatiseerd of handmatige validatie?
4. **Sales pagina claims:** Welke claims zijn haalbaar voor DOBbie? (Talar twijfelt hierover)
5. **Webinar datum/tijd:** Exacte details voor registratiepagina?
6. **Webinar platform:** Welk platform wordt gebruikt? (Zoom, Teams, etc.) - link nodig?

---

## 💡 Optimalisatie Tips

### Maximale AI Efficiency

1. **Batch Similar Tasks**
   - Alle CTA's tegelijk aanpassen
   - Alle content updates in één sessie

2. **Use AI for Boilerplate**
   - Laat AI component structuur genereren
   - Gebruik AI voor TypeScript types

3. **Test Incrementeel**
   - Test elke fase direct na implementatie
   - Voorkom grote refactors aan het eind

4. **Content First**
   - Start met alle content updates (snelste win)
   - Dan component aanpassingen
   - Laatste: complexe features

---

## 📊 Conclusie

### Realistische Schatting

**Met AI Tools:** **11.5-16.5 uur**  
**Met Buffer (30%):** **15-21 uur**  
**In Dagen (4-5 uur/dag):** **3-4 dagen**

### Haalbaarheid Deadline

✅ **Ja, ruim haalbaar** als je:
- 2-3 dagen intensief werkt
- Of 4-5 dagen rustig werkt
- Buffer houdt voor onverwachte issues

### Aanbeveling

**Plan 4-5 dagen** (15-20 uur) voor:
- Comfortabele werkdruk
- Ruimte voor testing
- Buffer voor onverwachte issues
- Tijd voor client communicatie
- Webinar pagina's (kritiek voor 20 november)

**Start met:**
1. Content updates (snelste win)
2. CTA's toevoegen (veel herhaald werk)
3. Webinar pagina's (kritiek voor deadline)
4. Dan complexere features
5. Laatste: testing & polish

---

**Laatste Update:** 10 november 2025  
**Status:** 🔴 In Afwachting van Start

