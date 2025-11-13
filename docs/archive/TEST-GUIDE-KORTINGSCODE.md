# 🧪 Test Guide - Kortingscode Systeem

**Datum:** 27 januari 2025  
**Doel:** Volledige end-to-end testing van het kortingscode en payment systeem

---

## 📋 Pre-requisites

### 1. Environment Setup

Zorg dat je `.env.local` de volgende variabelen bevat:

```env
# Supabase
PUBLIC_SUPABASE_URL=https://rcbokkgstwvlxwrpufsv.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Mollie (Test Mode)
MOLLIE_API_KEY=test_NzbgaW4kKHHMjjEDyxzs393TVuewAa
MOLLIE_WEBHOOK_SECRET=whsec_placeholder_change_in_production

# Site URL (voor redirects en webhooks)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Resend (voor emails)
RESEND_API_KEY=re_...
```

### 2. Development Server Starten

```bash
pnpm dev
```

De applicatie draait nu op `http://localhost:3000`

---

## 🗄️ Test Data Setup

### Stap 1: Test Kortingscodes Aanmaken

Je hebt al test codes in de database:
- `TESTVALID` - 20% korting, 10 uses, geldig tot 12 dec 2025
- `DOBBIETESTCODE` - 25% korting, onbeperkt, geldig tot 12 nov 2026

**Optioneel: Extra test codes aanmaken via Supabase SQL Editor:**

```sql
-- Test code 1: Percentage korting (20%)
INSERT INTO discount_codes (code, discount_percentage, valid_from, valid_until, max_uses, is_active)
VALUES ('TEST20', 20, NOW(), NOW() + INTERVAL '1 year', 100, true);

-- Test code 2: Vast bedrag korting (€50)
INSERT INTO discount_codes (code, discount_amount, valid_from, valid_until, max_uses, is_active)
VALUES ('TEST50', 50, NOW(), NOW() + INTERVAL '1 year', 50, true);

-- Test code 3: Verlopen code (voor edge case testing)
INSERT INTO discount_codes (code, discount_percentage, valid_from, valid_until, max_uses, is_active)
VALUES ('EXPIRED', 10, NOW() - INTERVAL '1 year', NOW() - INTERVAL '1 day', NULL, true);

-- Test code 4: Code met max uses bereikt
INSERT INTO discount_codes (code, discount_percentage, valid_from, valid_until, max_uses, current_uses, is_active)
VALUES ('FULL', 15, NOW(), NOW() + INTERVAL '1 year', 5, 5, true);
```

### Stap 2: Test User Account

Zorg dat je een test account hebt:
1. Ga naar `/register` en maak een account aan
2. Log in op `/login`
3. Noteer je user ID (te vinden in browser DevTools → Application → Cookies → `sb-*-auth-token`)

---

## 🧪 Test Scenarios

### Scenario 1: Happy Path - Betaling met Kortingscode

**Stappen:**
1. Ga naar `/checkout?plan=solo&billing=yearly`
2. Voer kortingscode in: `TESTVALID` of `DOBBIETESTCODE`
3. Controleer dat prijs real-time update (€349 → €279.20 met 20% korting)
4. Klik "Betaal met Mollie"
5. Je wordt doorgestuurd naar Mollie test pagina
6. Kies een test payment method (bijv. "iDEAL Test")
7. Volg de betaling flow
8. Je wordt terug gestuurd naar `/checkout/success`

**Verificatie:**
- ✅ Success pagina toont betalingsdetails
- ✅ Korting wordt getoond
- ✅ Subscription is aangemaakt in database
- ✅ Kortingscode `current_uses` is verhoogd
- ✅ Welkomstmail is verstuurd (check inbox)

**Database Check:**
```sql
-- Check subscription
SELECT * FROM subscriptions WHERE user_id = 'jouw-user-id' ORDER BY created_at DESC LIMIT 1;

-- Check discount code usage
SELECT code, current_uses, max_uses FROM discount_codes WHERE code = 'TESTVALID';

-- Check payment
SELECT * FROM payments WHERE user_id = 'jouw-user-id' ORDER BY created_at DESC LIMIT 1;
```

### Scenario 2: Betaling zonder Kortingscode

**Stappen:**
1. Ga naar `/checkout?plan=solo&billing=yearly`
2. Laat kortingscode veld leeg
3. Klik "Betaal met Mollie"
4. Volg betaling flow

**Verificatie:**
- ✅ Betaling werkt zonder korting
- ✅ Subscription wordt aangemaakt
- ✅ Geen discount code increment
- ✅ Welkomstmail zonder korting info

### Scenario 3: Verlopen Kortingscode

**Stappen:**
1. Ga naar `/checkout?plan=solo&billing=yearly`
2. Voer code in: `EXPIRED` (als je deze hebt aangemaakt)
3. Controleer error message

**Verificatie:**
- ✅ Error message: "Deze kortingscode is verlopen"
- ✅ Prijs blijft origineel
- ✅ Betaling knop werkt nog steeds (zonder korting)

### Scenario 4: Ongeldige Kortingscode

**Stappen:**
1. Ga naar `/checkout?plan=solo&billing=yearly`
2. Voer code in: `INVALID123`
3. Controleer error message

**Verificatie:**
- ✅ Error message: "Kortingscode niet gevonden"
- ✅ Visuele feedback (rood)

### Scenario 5: Case-Insensitive Code

**Stappen:**
1. Ga naar `/checkout?plan=solo&billing=yearly`
2. Voer code in: `testvalid` (kleine letters)
3. Controleer dat code werkt

**Verificatie:**
- ✅ Code wordt automatisch uppercase
- ✅ Validatie werkt
- ✅ Korting wordt toegepast

---

## 🔗 Webhook Testing

### Lokale Webhook Testing met ngrok

Mollie webhooks werken alleen met publiek bereikbare URLs. Voor lokale testing gebruik ngrok:

**Stap 1: Installeer ngrok**
```bash
# Windows (via Chocolatey)
choco install ngrok

# Of download van https://ngrok.com/download
```

**Stap 2: Start ngrok tunnel**
```bash
ngrok http 3000
```

Je krijgt een URL zoals: `https://abc123.ngrok.io`

**Stap 3: Update Mollie Webhook URL**

1. Ga naar Mollie Dashboard → Developers → Webhooks
2. Voeg webhook toe: `https://abc123.ngrok.io/api/webhooks/mollie`
3. Of gebruik Mollie's test webhook tool

**Stap 4: Test Webhook**

Na een betaling kun je de webhook testen:
1. Maak een payment aan via checkout
2. Betaal in Mollie test mode
3. Check console logs voor webhook events
4. Verifieer dat subscription wordt aangemaakt

**Alternatief: Mollie Test Webhook Tool**

Mollie heeft een webhook testing tool:
1. Ga naar Mollie Dashboard → Developers → Webhooks
2. Klik "Test webhook"
3. Voer payment ID in
4. Mollie stuurt test webhook naar je endpoint

---

## 📧 Email Testing

### Resend Test Mode

Resend heeft een test mode voor development:

1. Check `.env.local` voor `RESEND_API_KEY`
2. Emails worden verstuurd naar het opgegeven email adres
3. Check je inbox (en spam folder)

**Email Verificatie:**
- ✅ Email ontvangen na succesvolle betaling
- ✅ Correcte gebruikersnaam
- ✅ Abonnement details correct
- ✅ Korting info correct (als van toepassing)
- ✅ Login link werkt

---

## 🐛 Debugging Tips

### Console Logs

Alle belangrijke events worden gelogd:
- `[Webhook]` - Webhook events
- `[Subscription]` - Subscription creation
- `[Discount]` - Discount code operations
- `[Email]` - Email verzending

### Database Queries voor Debugging

```sql
-- Check alle payments
SELECT 
  p.mollie_payment_id,
  p.status,
  p.amount,
  p.created_at,
  u.email
FROM payments p
JOIN profiles u ON p.user_id = u.id
ORDER BY p.created_at DESC
LIMIT 10;

-- Check subscriptions
SELECT 
  s.id,
  s.status,
  s.amount,
  s.discount_code,
  s.start_date,
  s.next_billing_date,
  u.email
FROM subscriptions s
JOIN profiles u ON s.user_id = u.id
ORDER BY s.created_at DESC
LIMIT 10;

-- Check discount codes usage
SELECT 
  code,
  discount_percentage,
  discount_amount,
  current_uses,
  max_uses,
  is_active,
  valid_until
FROM discount_codes
ORDER BY created_at DESC;
```

### Mollie Dashboard

1. Ga naar https://www.mollie.com/dashboard
2. Check "Payments" tab voor alle test payments
3. Check payment details voor metadata
4. Check webhook logs voor delivery status

---

## ✅ Test Checklist

### Frontend Testing
- [ ] Checkout pagina laadt correct
- [ ] Plan selectie werkt (Solo/Team)
- [ ] Billing toggle werkt (Monthly/Yearly)
- [ ] Kortingscode input werkt
- [ ] Real-time validatie werkt
- [ ] Prijs update werkt correct
- [ ] Error messages zijn duidelijk
- [ ] Success pagina toont correcte info
- [ ] Cancel pagina werkt

### Backend Testing
- [ ] Payment creation endpoint werkt
- [ ] Kortingscode validatie werkt
- [ ] Mollie payment wordt aangemaakt
- [ ] Payment wordt opgeslagen in database
- [ ] Webhook ontvangt events
- [ ] Subscription wordt aangemaakt
- [ ] Discount code increment werkt
- [ ] Email wordt verstuurd

### Integration Testing
- [ ] Volledige flow: checkout → betaling → activatie
- [ ] Webhook verwerkt payment correct
- [ ] Database updates zijn correct
- [ ] Email bevat juiste informatie

---

## 🚨 Bekende Issues & Workarounds

### Issue 1: Webhook niet bereikbaar lokaal
**Oplossing:** Gebruik ngrok of Mollie test webhook tool

### Issue 2: Email niet ontvangen
**Check:**
- RESEND_API_KEY is correct
- Email adres is geldig
- Check spam folder
- Check Resend dashboard voor delivery status

### Issue 3: Payment status blijft "open"
**Oplossing:** 
- Betaal de payment in Mollie test mode
- Of gebruik Mollie test webhook tool om status te simuleren

---

## 📞 Hulp Nodig?

Als je problemen tegenkomt:
1. Check console logs voor errors
2. Check database voor data consistency
3. Check Mollie dashboard voor payment status
4. Check Resend dashboard voor email status

---

**Laatste update:** 27 januari 2025

