# 📋 Actielijst: Feedback Talar - Landingspagina Aanpassingen

**Datum:** 10 november 2025  
**Deadline:** 19 november 2025 (live op 20 november)  
**Status:** 🔴 Kritiek - Voor productie launch

---

## 🎯 Overzicht

Deze actielijst bevat alle aanpassingen die Talar heeft aangevraagd voor de landingspagina op basis van de mailwisseling van 10 november 2025.

**Belangrijke context:**
- Geen trial meer, maar **opt-out binnen 2 weken** (aanpassen knoppen bij registratie)
- Pricing is definitief zoals het nu staat
- Sectievolgorde moet worden aangepast voor betere emotionele flow
- Mobile-first: minder white space, betere leesbaarheid

---

## ✅ PRIORITEIT 1: CTA's Toevoegen/Aanpassen

### 1.1 Hero Sectie
**Huidige situatie:** Hero heeft primary en secondary CTA  
**Gewenst:**
- **Knop:** "Start vandaag nog – binnen 14 dagen gratis opzegbaar"
- **Link:** `/register`
- **Aanpassing:** Tekst aanpassen in content bestand

**Bestand:** `src/content/nl/home.json` (hero.primaryCta)

---

### 1.2 Onder 'Van stilstaan naar beweging' (ProblemSolution)
**Huidige situatie:** Mogelijk al een CTA aanwezig  
**Gewenst:**
- **Knop:** "Bekijk hoe DOBbie werkt"
- **Link:** Scroll naar uitleg sectie (of later naar webinar inschrijving)
- **Actie:** CTA toevoegen aan `ProblemSolution.tsx` component

**Bestand:** `src/components/landing/ProblemSolution.tsx`

---

### 1.3 Na 'De wens van elke organisatie' (Verlangen)
**Huidige situatie:** Mogelijk Vision of CombinedBenefits sectie  
**Gewenst:**
- **Knop:** "Laat DOBbie het verschil maken"
- **Link:** `/register`
- **Actie:** CTA toevoegen na deze sectie

**Bestand:** Te bepalen welke component dit is (mogelijk `Vision.tsx` of `CombinedBenefits.tsx`)

---

### 1.4 Onder 'Maak kennis met DOBbie' (DobbieHero)
**Huidige situatie:** DobbieHero sectie heeft geen CTA  
**Gewenst:**
- **Knop:** "Ervaar het zelf – probeer DOBbie vandaag"
- **Link:** `/register`
- **Actie:** CTA toevoegen aan `DobbieHero.tsx`

**Bestand:** `src/components/landing/DobbieHero.tsx`

---

### 1.5 Na 'Wat DOBbie oplevert' (CombinedBenefits)
**Huidige situatie:** Mogelijk geen CTA  
**Gewenst:**
- **Knop:** "Start met tijdwinst en grip"
- **Link:** Scroll naar prijstabel (`#pricing`)
- **Actie:** CTA toevoegen met smooth scroll

**Bestand:** `src/components/landing/CombinedBenefits.tsx`

---

### 1.6 Bij Testimonials
**Huidige situatie:** Testimonials heeft geen CTA  
**Gewenst:**
- **Knop:** "Ik wil dit ook – bekijk prijzen"
- **Link:** Scroll naar prijstabel (`#pricing`)
- **Actie:** CTA toevoegen aan `Testimonials.tsx`

**Bestand:** `src/components/landing/Testimonials.tsx`

---

### 1.7 Prijsblokken (Solo + Team)
**Huidige situatie:** Pricing cards hebben al CTA knoppen  
**Gewenst:**
- **Solo knop tekst:** "Ja, ik wil DOBbie voor mezelf"
- **Team knop tekst:** "Ja, wij willen minimaal 2 accounts"
- **Actie:** Teksten aanpassen in pricing content

**Bestand:** `src/content/nl/pricing.json`

---

### 1.8 Bij FAQ Afsluiter
**Huidige situatie:** FAQ heeft geen CTA na de vragen  
**Gewenst:**
- **Knop:** "Nog vragen? Schrijf je in voor de gratis webinar"
- **Link:** Later naar webinar inschrijving (voor nu placeholder)
- **Actie:** CTA toevoegen na FAQ items

**Bestand:** `src/components/landing/FAQ.tsx`

---

### 1.9 Laatste Sectie (DobbieCTA)
**Huidige situatie:** DobbieCTA heeft "Start vandaag nog / Plan een demo"  
**Gewenst:**
- **Tekst:** "Start vandaag nog – 14 dagen kosteloos opzegbaar"
- **Actie:** Tekst aanpassen in content

**Bestand:** `src/content/nl/dobbie-cta.json`

---

## ✅ PRIORITEIT 2: Sectievolgorde Aanpassen

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
6. **CombinedBenefits** (Wat DOBbie in de praktijk oplevert) - **NIEUWE SECTIE TOEVOEGEN:** "Waar kan je DOBbie voor gebruiken"
7. **DobbieTargetGroups** (Ontwikkeld door een BA)
8. **PricingNew**
9. **FAQ**
10. **DobbieCTA**

**Actie:** Volgorde aanpassen in `app/page.tsx`

**Bestand:** `app/page.tsx`

---

## ✅ PRIORITEIT 3: Nieuwe Sectie Toevoegen

### 3.1 "Waar kan je DOBbie voor gebruiken"
**Locatie:** Na "Wat DOBbie in de praktijk oplevert" (CombinedBenefits)  
**Content:**
- Alle niet medische vragen die je normaal aan de bedrijfsarts zou stellen (en afhankelijk bent van diens beschikbaarheid)
- Interpretatie van terugkoppelingen die gemaakt zijn door de bedrijfsarts (Is het door ons bedachte werk passend bij de gestelde beperkingen?)
- Een goede vraagstelling opstellen voor het consult met de bedrijfsarts (NB: in volgende versie concretere opdracht inbouwen)
- Helpen in de communicatie en verbinding naar de werknemer(s)
- Procesbegeleiding tijdens verzuim cf. WVP (wat moet je doen, wanneer)

**Actie:** 
- Nieuwe component maken: `UseCases.tsx`
- Content bestand: `src/content/nl/use-cases.json`
- Type definitie: `src/types/content.ts`

**Bestanden:**
- `src/components/landing/UseCases.tsx` (nieuw)
- `src/content/nl/use-cases.json` (nieuw)
- `src/types/content.ts` (uitbreiden)
- `src/lib/content.ts` (helper functie toevoegen)

---

## ✅ PRIORITEIT 4: Registratie Flow Aanpassen

### 4.1 Opt-out binnen 2 weken (geen trial)
**Huidige situatie:** Mogelijk trial messaging  
**Gewenst:**
- Geen "trial" terminologie meer
- "14 dagen gratis opzegbaar" messaging
- Knoppen aanpassen bij registratie

**Acties:**
1. Check registratie pagina voor trial messaging
2. Vervang "trial" door "14 dagen gratis opzegbaar"
3. Update alle CTA teksten

**Bestanden:**
- `app/(auth)/register/page.tsx`
- Alle content bestanden met "trial" tekst

---

## ✅ PRIORITEIT 5: Pricing Aanpassingen

### 5.1 Besparing Tonen
**Gewenst:**
- Bij Solo: "Betaal per jaar en bespaar €239" (of andere formulering)
- Bij Team: "Betaal per jaar en bespaar €199" (of andere formulering)
- Marketingtechnisch goed verwoorden

**Actie:** Besparing berekenen en tonen in pricing cards

**Bestand:** `src/components/landing/PricingNew.tsx`

**Berekening:**
- Solo: (€49 × 12) - €149 = €588 - €149 = €439 besparing? (check met Talar)
- Team: (€39 × 12) - €99 = €468 - €99 = €369 besparing? (check met Talar)

---

### 5.2 Enterprise Optie Toevoegen
**Gewenst:**
- Tekst: "Enterprise: Wil je meer dan 15 accounts? Neem contact op voor een offerte op maat!"
- Plaats: Naast of onder de pricing cards

**Actie:** Enterprise sectie toevoegen aan pricing component

**Bestand:** `src/components/landing/PricingNew.tsx`

---

### 5.3 Kortingscode Functionaliteit
**Gewenst:**
- Kortingscode: `NVVA2025`
- Geldig tot: 30 november 23:59u
- Mag gedeeld worden met derden

**Actie:** 
- Kortingscode input toevoegen aan registratie flow
- Validatie implementeren
- Database/backend logica voor kortingscode

**Bestanden:**
- `app/(auth)/register/page.tsx`
- Backend API voor kortingscode validatie (nieuw)

---

## ✅ PRIORITEIT 6: Mobile Optimalisatie

### 6.1 White Space Verminderen
**Probleem:** Te veel white space, voelt niet mobile-friendly  
**Gewenst:** Meer leesmodus, logische verdeling

**Acties:**
1. Padding/margin aanpassen op mobile breakpoints
2. Sectie spacing optimaliseren
3. Text sizing voor mobile verbeteren

**Bestanden:** Alle landing components

---

### 6.2 Hero Sectie Mobile
**Probleem:** Leeg blok met kopje bij opening op mobile  
**Gewenst:** Betere mobile layout zonder lege ruimtes

**Actie:** Hero component mobile-first herzien

**Bestand:** `src/components/landing/Hero.tsx`

---

## ✅ PRIORITEIT 7: Sales Pagina Check

### 7.1 Valideer Claims
**Taak:** Check of DOBbie kan wat er geclaimd wordt in de sales pagina tekst  
**Tekst te checken:**
- Snellere intake (Checklist en agendatekst)
- Vertaling BA → taak/uren
- Scenario's die landen A/B/C met microstappen
- Dossiervorming die klopt
- Communicatie zonder frictie
- Poortwachter-ritme bewaakt

**Actie:** 
- Review AI prompt en capabilities
- Bepaal wat wel/niet mogelijk is
- Feedback geven aan Talar

**Document:** Nieuwe analyse maken

---

## ✅ PRIORITEIT 8: Content Updates

### 8.1 Content Bestanden Bijwerken
**Acties:**
- Alle CTA teksten aanpassen
- Trial → "14 dagen gratis opzegbaar" vervangen
- Nieuwe sectie content toevoegen
- Pricing teksten aanpassen

**Bestanden:**
- `src/content/nl/home.json`
- `src/content/nl/pricing.json`
- `src/content/nl/dobbie-cta.json`
- `src/content/nl/use-cases.json` (nieuw)

---

## 📊 Implementatie Checklist

### Fase 1: Content & Structuur (4-6 uur)
- [ ] Sectievolgorde aanpassen in `app/page.tsx`
- [ ] Nieuwe UseCases component maken
- [ ] Content bestanden bijwerken
- [ ] Type definities uitbreiden

### Fase 2: CTA's Toevoegen (3-4 uur)
- [ ] Hero CTA aanpassen
- [ ] ProblemSolution CTA toevoegen
- [ ] Vision/Verlangen CTA toevoegen
- [ ] DobbieHero CTA toevoegen
- [ ] CombinedBenefits CTA toevoegen
- [ ] Testimonials CTA toevoegen
- [ ] Pricing CTA teksten aanpassen
- [ ] FAQ CTA toevoegen
- [ ] DobbieCTA tekst aanpassen

### Fase 3: Pricing Features (2-3 uur)
- [ ] Besparing tonen in pricing cards
- [ ] Enterprise optie toevoegen
- [ ] Kortingscode input toevoegen (basis)

### Fase 4: Mobile Optimalisatie (2-3 uur)
- [ ] White space verminderen
- [ ] Hero mobile layout verbeteren
- [ ] Responsive spacing optimaliseren

### Fase 5: Registratie Flow (1-2 uur)
- [ ] Trial messaging verwijderen
- [ ] "14 dagen gratis opzegbaar" messaging toevoegen
- [ ] Knoppen bijwerken

### Fase 6: Testing & Polish (2-3 uur)
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Link validatie
- [ ] Smooth scroll functionaliteit testen

**Totaal Geschatte Tijd: 14-21 uur**

---

## 🚨 Kritieke Beslissingen Nodig

1. **Besparing bedragen:** Exacte bedragen voor "Betaal per jaar en bespaar €X" (check met Talar)
2. **Webinar link:** Placeholder of echte link voor webinar inschrijving?
3. **Kortingscode implementatie:** Volledig geautomatiseerd of handmatige validatie?
4. **Sales pagina claims:** Welke claims zijn haalbaar voor DOBbie?

---

## 📝 Notities

- Talar heeft deadline gemist (OK datum 24 nov), maar wil nog steeds 20 nov live
- Geen meerdere iteraties mogelijk volgens Colin's mail
- Focus op definitieve keuzes en implementatie
- Sales pagina kan op WordPress/Plug&Pay als DOBbie flow werkt

---

**Laatste Update:** 10 november 2025  
**Status:** 🔴 In Afwachting van Start

