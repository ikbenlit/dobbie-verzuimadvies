# Functionele specificatie: Kortingcode systeem voor Talar Chatbot

**Project:** Talar Chatbot - Abonnementen met kortingscodes  
**Datum:** 12 november 2025  
**Voor:** Developer (bouw)  
**Opdrachtgever:** Talar via Colin

---

## 1. Wat gaan we bouwen?

Een kortingscode systeem waarmee Talar vanuit webinars (of andere marketingacties) kortingscodes kan uitdelen. Deelnemers kunnen deze codes gebruiken bij het afsluiten van een chatbot-abonnement om korting te krijgen. Het hele proces - van invoeren van de code tot activeren van toegang - moet volledig geautomatiseerd zijn.

---

## 2. Wat staat er al?

- ✅ Next.js applicatie met chatbot
- ✅ Supabase voor authenticatie en database
- ✅ Mollie betalingsintegratie (basic)
- ✅ Resend API voor email verzending
- ✅ Users tabel in database
- ✅ Subscriptions tabel in database (basis opzet)

---

## 3. Wat moet er gebeuren?

### 3.1 Database uitbreiden

**Nieuwe tabel: `discount_codes`**

Doel: Alle kortingscodes opslaan die Talar aanmaakt.

Velden die nodig zijn:
- **id** - Unieke identifier
- **code** - De kortingscode zelf (bijv. "WEBINAR2024")
- **discount_percentage** - Percentage korting (bijv. 20 voor 20%)
- **discount_amount** - Óf een vast bedrag in euro's (bijv. 10.00)
- **valid_from** - Vanaf welke datum is de code geldig
- **valid_until** - Tot welke datum is de code geldig
- **max_uses** - Maximaal aantal keer dat de code gebruikt kan worden (NULL = onbeperkt)
- **current_uses** - Hoeveel keer is de code al gebruikt
- **is_active** - Kan Talar de code aan/uit zetten
- **created_at** - Wanneer is de code aangemaakt

Belangrijke eisen:
- De code moet uniek zijn (hoofdletters/kleine letters maakt niet uit)
- Er moet een index op het `code` veld voor snelle opzoekingen
- Codes moeten gemakkelijk aan/uit gezet kunnen worden

**Bestaande tabel aanpassen: `subscriptions`**

Nieuwe velden toevoegen:
- **discount_code** - Welke kortingscode is gebruikt (als die er was)
- **discount_amount** - Hoeveel korting is gegeven in euro's
- **original_price** - Wat was de originele prijs (voor rapportage)

Doel: Later kunnen we rapporten maken zoals "hoeveel omzet is er via WEBINAR2024 binnengekomen".

---

### 3.2 Checkout pagina aanpassen

**Huidige situatie:**
Er is een checkout pagina waar gebruikers een abonnement kunnen kiezen (maandelijks of jaarlijks).

**Wat moet erbij:**

1. **Input veld voor kortingscode**
   - Tekstveld waar gebruiker een code kan invoeren
   - Knop "Toepassen" naast het veld
   - Code wordt automatisch naar hoofdletters omgezet

2. **Real-time validatie**
   - Wanneer gebruiker op "Toepassen" klikt, wordt er gecontroleerd:
     - Bestaat deze code?
     - Is de code nog geldig (niet verlopen)?
     - Is de code nog niet te vaak gebruikt?
     - Is de code actief (niet uitgeschakeld)?
   
3. **Feedback tonen**
   - **Bij ongeldige code:** Rode foutmelding tonen
     - "Code niet gevonden"
     - "Code is verlopen"
     - "Code is al volledig gebruikt"
   - **Bij geldige code:** Groene bevestiging tonen
     - "Korting van €X toegepast!" of "20% korting toegepast!"
     - Originele prijs doorstreept
     - Nieuwe prijs dikgedrukt
     - Bespaarbedrag tonen

4. **Prijs berekening**
   - Toon altijd de originele prijs
   - Als korting is toegepast: toon ook de nieuwe prijs
   - Maak duidelijk hoeveel iemand bespaart

**Voorbeeld visueel:**
```
[ ] Maandelijks abonnement - €29,00 per maand
[x] Jaarlijks abonnement - €290,00 per jaar (€24,17 per maand)

Kortingscode: [WEBINAR2024____] [Toepassen]

✓ Korting van €58,00 toegepast! (20%)

Subtotaal: €290,00
Korting:    -€58,00
-----------------------
Totaal:     €232,00

[Betalen met Mollie]
```

---

### 3.3 Checkout proces (backend)

**Wat gebeurt er als iemand op "Betalen" klikt:**

1. **Korting valideren (nogmaals)**
   - Ook al is de code op de pagina gevalideerd, check het nogmaals in de backend
   - Waarom? Gebruiker kan tussen validatie en betalen wachten, waardoor code verlopen kan zijn
   - Of: code kan net op dat moment max_uses bereiken

2. **Prijs berekenen**
   - Start met originele prijs (€29 of €290)
   - Als kortingscode geldig is:
     - Bij percentage: `originele_prijs * (percentage / 100)` = korting in euro's
     - Bij vast bedrag: neem het discount_amount veld
   - Trek korting af van originele prijs = finale prijs
   - Check: finale prijs mag nooit negatief zijn (minimaal €0,01)

3. **Betaling aanmaken bij Mollie**
   - Stuur het **finale bedrag** (dus al met korting verwerkt) naar Mollie
   - Stuur deze informatie mee in de metadata:
     - userId (wie bestelt dit?)
     - plan (monthly of yearly)
     - discountCode (welke code is gebruikt, of NULL)
     - discountAmount (hoeveel korting in euro's)
     - originalPrice (wat was de prijs voor korting)
   
4. **Gebruiker doorsturen**
   - Stuur gebruiker naar Mollie betaalpagina
   - Mollie regelt de betaling
   - Na betaling komt gebruiker terug op success of cancel pagina

---

### 3.4 Webhook afhandeling (na betaling)

**Wat is een webhook:**
Mollie stuurt een bericht naar onze server zodra een betaling is gelukt (of mislukt). Dit is de plek waar we de toegang automatisch activeren.

**Wat moet er gebeuren in de webhook:**

1. **Betaling ophalen bij Mollie**
   - Haal betaling op met de ID die Mollie meestuurt
   - Check status: is het "paid"?

2. **Als betaling gelukt is:**
   
   **A. Subscription aanmaken/updaten**
   - Maak een nieuwe regel aan in de `subscriptions` tabel met:
     - user_id (uit metadata)
     - plan (monthly/yearly, uit metadata)
     - status = "active"
     - discount_code (uit metadata, kan NULL zijn)
     - discount_amount (uit metadata)
     - original_price (uit metadata)
     - paid_price (wat Mollie daadwerkelijk ontvangen heeft)
     - start_date = nu
     - end_date = nu + 30 dagen (monthly) of nu + 365 dagen (yearly)
   
   **B. Kortingscode usage verhogen**
   - Als er een kortingscode is gebruikt:
     - Tel 1 op bij het `current_uses` veld van die kortingscode
     - Dit moet een "atomic" operatie zijn (geen race conditions)
   
   **C. Welkomstmail versturen**
   - Verstuur via Resend een welkomstmail
   - Inhoud mail:
     - Bevestiging van betaling
     - Welk abonnement is afgesloten
     - Hoeveel korting is gekregen (als van toepassing)
     - Link naar inloggen
     - Startgids of tips om te beginnen

3. **Als betaling mislukt/geannuleerd:**
   - Doe niets met subscription
   - Optioneel: log dit voor rapportage

---

### 3.5 Email automation (via Resend)

**Mail 1: Direct na succesvolle betaling**
- Trigger: Webhook ontvangt "paid" status
- Template: "Welkom bij [Chatbot naam]"
- Inhoud:
  - Bedankt voor je aankoop
  - Je hebt [monthly/yearly] abonnement
  - [Als korting gebruikt:] Je hebt €X bespaard met code [CODE]
  - Log in op: [URL]
  - Hulp nodig? [Support link]

**Mail 2: Onboarding (dag 1)**
- Trigger: 24 uur na activatie
- Inhoud:
  - Tips om te starten
  - Meest gestelde vragen
  - Video tutorial (als beschikbaar)

**Mail 3: Verlenging reminder (3 dagen voor einde)**
- Trigger: 3 dagen voor end_date
- Alleen bij yearly (monthly verlengt automatisch)
- Inhoud:
  - Je abonnement verloopt over 3 dagen
  - Wil je verlengen? [Link]
  - Vragen? Neem contact op

**Opmerking:** Deze laatste twee mails zijn "nice to have" - focus eerst op de welkomstmail.

---

## 4. User flows

### Flow 1: Gebruiker met kortingscode (happy path)

1. Gebruiker komt op checkout pagina
2. Gebruiker selecteert yearly abonnement (€290)
3. Gebruiker vult "WEBINAR2024" in
4. Gebruiker klikt "Toepassen"
5. Systeem checkt: code is geldig, 20% korting
6. Pagina toont: €290 → €232 (€58 korting)
7. Gebruiker klikt "Betalen"
8. Backend checkt code nogmaals (is nog steeds geldig)
9. Backend maakt Mollie payment aan voor €232
10. Gebruiker betaalt bij Mollie
11. Mollie stuurt webhook: betaling gelukt
12. Systeem:
    - Maakt subscription aan (status: active)
    - Verhoogt current_uses van WEBINAR2024 van 49 naar 50
    - Verstuurt welkomstmail
13. Gebruiker kan inloggen en chatbot gebruiken

### Flow 2: Gebruiker zonder kortingscode

1. Gebruiker komt op checkout pagina
2. Gebruiker selecteert monthly abonnement (€29)
3. Gebruiker vult geen kortingscode in
4. Gebruiker klikt "Betalen"
5. Backend maakt Mollie payment aan voor €29 (geen korting)
6. Gebruiker betaalt bij Mollie
7. Mollie stuurt webhook: betaling gelukt
8. Systeem:
    - Maakt subscription aan (status: active, geen discount velden)
    - Verstuurt welkomstmail
9. Gebruiker kan inloggen en chatbot gebruiken

### Flow 3: Gebruiker met verlopen code (error handling)

1. Gebruiker komt op checkout pagina
2. Gebruiker vult "NIEUWJAAR2024" in
3. Gebruiker klikt "Toepassen"
4. Systeem checkt: code bestaat, maar valid_until = 31-01-2025 (is verlopen)
5. Pagina toont rode foutmelding: "Deze code is verlopen"
6. Gebruiker kan niet verder met deze code
7. Gebruiker kan:
   - Andere code proberen
   - Of zonder code doorgaan

### Flow 4: Code bereikt max_uses tijdens checkout

1. Gebruiker vult code in op moment dat current_uses = 99, max_uses = 100
2. Code wordt gevalideerd: "Code is geldig!" (want 99 < 100)
3. Gebruiker wacht 2 minuten met betalen
4. Ondertussen gebruikt een andere gebruiker dezelfde code
5. Current_uses wordt nu 100
6. Eerste gebruiker klikt "Betalen"
7. Backend checkt opnieuw: 100 >= 100, code is vol
8. Systeem toont foutmelding: "Deze code is vol gebruikt"
9. Prijs wordt teruggezet naar origineel
10. Gebruiker kan opnieuw proberen (zonder code of andere code)

---

## 5. Validatie regels

### Kortingscode validatie (check in deze volgorde):

1. **Code bestaat?**
   - Zoek code op in database (case-insensitive)
   - Niet gevonden → "Code niet gevonden"

2. **Code is actief?**
   - Check `is_active` = true
   - Niet actief → "Deze code is niet meer geldig"

3. **Code is niet verlopen?**
   - Check `valid_from` <= nu <= `valid_until`
   - Te vroeg → "Deze code is nog niet geldig"
   - Te laat → "Deze code is verlopen"

4. **Code niet over limiet?**
   - Als `max_uses` is ingesteld: check `current_uses` < `max_uses`
   - Over limiet → "Deze code is al volledig gebruikt"

5. **Alles OK?**
   - Bereken kortingsbedrag
   - Return success met korting details

### Prijs berekening validatie:

- Finale prijs moet minimaal €0,01 zijn
- Korting mag nooit hoger zijn dan originele prijs
- Alle bedragen in 2 decimalen (€29.00, niet €29)

---

## 6. Admin functionaliteit (voor Talar)

**Talar moet kortingscodes kunnen beheren. Dit kan via:**

**Optie A: Direct in Supabase (simpel, snel te bouwen)**
- Talar logt in op Supabase dashboard
- Gaat naar `discount_codes` tabel
- Kan daar codes aanmaken/bewerken/deactiveren

**Optie B: Admin pagina in de app (netter, meer werk)**
- Er komt een `/admin/kortingscodes` pagina
- Overzicht van alle codes met:
  - Code naam
  - Type korting (percentage/bedrag)
  - Geldigheid (van-tot)
  - Hoeveel keer gebruikt / max
  - Status (actief/inactief)
- Knoppen: Nieuwe code, Bewerken, Deactiveren, Verwijderen

**Mijn advies:** Start met Optie A (Supabase direct), bouw later Optie B als daar tijd voor is.

---

## 7. Edge cases en error handling

### Scenario's die goed afgehandeld moeten worden:

1. **Gebruiker vult spaties in code**
   - "  WEBINAR2024  " moet werken
   - Trim whitespace voor validatie

2. **Gebruiker vult kleine letters in**
   - "webinar2024" moet ook werken
   - Convert naar hoofdletters

3. **Twee gebruikers gebruiken laatste slot tegelijk**
   - Race condition bij current_uses
   - Gebruik database atomic increment (zie code voorbeeld)
   - Één krijgt de code, ander krijgt foutmelding

4. **Betaling loopt vast bij Mollie**
   - Webhook komt niet binnen
   - Of: webhook komt met "failed" status
   - Subscription wordt NIET aangemaakt
   - Gebruiker kan opnieuw proberen

5. **Code wordt gedeactiveerd tijdens checkout**
   - Validatie op pagina: OK
   - Maar voor betaling: admin heeft code uitgezet
   - Backend check vangt dit op
   - Gebruiker krijgt foutmelding

6. **Negatieve korting (code fout geconfigureerd)**
   - Als admin per ongeluk 150% korting instelt
   - Validatie: finale prijs kan niet negatief
   - Set finale prijs op €0.01 (minimum)
   - Log error voor admin

---

## 8. Testing checklist

### Functionele tests:

- [ ] Code aanmaken in database werkt
- [ ] Code validatie werkt (geldig → groen, ongeldig → rood met juiste melding)
- [ ] Percentage korting berekent correct
- [ ] Vast bedrag korting berekent correct
- [ ] Prijs update op pagina klopt
- [ ] Betaling gaat door naar Mollie met juiste bedrag
- [ ] Metadata wordt correct meegestuurd
- [ ] Webhook maakt subscription aan
- [ ] Current_uses wordt verhoogd
- [ ] Welkomstmail wordt verstuurd
- [ ] Subscription heeft juiste end_date (30 of 365 dagen)
- [ ] Verlopen code wordt geweigerd
- [ ] Volle code (max_uses bereikt) wordt geweigerd
- [ ] Race condition bij max_uses wordt correct afgehandeld
- [ ] Code met hoofdletters/kleine letters/spaties werkt
- [ ] Zonder kortingscode werkt ook

### Technische tests:

- [ ] Database indexes zijn aangemaakt
- [ ] Atomic increment functie werkt
- [ ] Webhook is bereikbaar voor Mollie
- [ ] Resend emails komen aan
- [ ] Error logging werkt
- [ ] Success/cancel pagina's tonen juiste info

---

## 9. Data voorbeelden

### Voorbeeld discount codes die Talar kan aanmaken:

```
Code: WEBINAR2024
Type: Percentage
Waarde: 20%
Geldig: 01-11-2024 t/m 31-12-2024
Max uses: 100
Status: Actief
```

```
Code: EARLYBIRD
Type: Vast bedrag  
Waarde: €50
Geldig: 01-11-2024 t/m 15-11-2024
Max uses: 25
Status: Actief
```

```
Code: VRIEND
Type: Percentage
Waarde: 10%
Geldig: 01-11-2024 t/m 31-12-2025
Max uses: NULL (onbeperkt)
Status: Actief
```

### Voorbeeld subscription na betaling met code:

```
user_id: abc-123-def
plan: yearly
status: active
discount_code: WEBINAR2024
discount_amount: 58.00
original_price: 290.00
paid_price: 232.00
start_date: 2024-11-12 14:30:00
end_date: 2025-11-12 14:30:00
```

---

## 10. Prioritering

### Must have (eerst bouwen):
1. Database aanpassingen (discount_codes tabel + subscriptions uitbreiding)
2. Kortingscode validatie logica
3. Checkout pagina met code input
4. Prijs berekening
5. Mollie betaling met metadata
6. Webhook: subscription aanmaken + current_uses verhogen
7. Welkomstmail via Resend

### Nice to have (later):
1. Admin interface voor codes beheren
2. Extra onboarding emails
3. Rapportage: hoeveel omzet per code
4. Automatische verlengingsmail

---

## 11. Vragen voor Talar (beslissingen nodig)

1. **Korting bij verlengingen?**
   - Geldt de 20% korting alleen bij eerste betaling?
   - Of ook bij automatische verlengingen?
   - **Advies:** Alleen eerste keer (standaard in webshops)

2. **Percentage OF vast bedrag?**
   - Wil Talar beide opties kunnen gebruiken?
   - Of alleen percentage kortingen?
   - **Advies:** Support beide, is flexibeler

3. **Code hergebruik door zelfde persoon?**
   - Kan iemand met 2 email accounts 2x WEBINAR2024 gebruiken?
   - Of moet er gecheck worden op bijv. IP adres?
   - **Advies:** Sta toe (te complex om te blokkeren)

4. **Minimum bedrag?**
   - Moet er een minimum bestelbedrag zijn voor kortingscodes?
   - Bijv: "Alleen geldig vanaf €50"
   - **Advies:** Start zonder, voeg later toe als nodig

---

## 12. Schatting

**Totaal: 5-6 uur**

- Database schema + migraties: 30 minuten
- Discount validatie functie: 1 uur
- Checkout pagina UI + validatie: 1-1.5 uur
- Backend: prijs berekening + Mollie call: 1 uur
- Webhook uitbreiden: 30 minuten
- Resend email templates: 1 uur
- Testing + bugfixes: 1-1.5 uur

---

## 13. Oplevering

**Wat moet er klaar zijn:**

1. **Code**
   - Alle database migraties
   - Validatie functies
   - Checkout flow
   - Webhook handlers
   - Email templates

2. **Documentatie**
   - Hoe maakt Talar een code aan (stap-voor-stap)
   - Wat betekenen de velden
   - Voorbeelden van veelgebruikte codes

3. **Test data**
   - 2-3 voorbeeld codes in database
   - Waarvan 1 verlopen (om te testen)
   - Waarvan 1 met max_uses = 1 (om te testen)

4. **Demo**
   - Live demo: code invoeren, betaling doen, toegang krijgen
   - Laat zien wat er in database gebeurt
   - Laat zien welke email eruit komt

---

Klaar! Met deze spec + de code voorbeelden moet de developer precies weten wat er gebouwd moet worden. Veel success! 🚀