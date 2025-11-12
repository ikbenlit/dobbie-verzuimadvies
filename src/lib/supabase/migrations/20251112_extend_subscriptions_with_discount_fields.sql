-- MIGRATION: 20251112_extend_subscriptions_with_discount_fields.sql
-- Epic E1.S2: Subscriptions tabel uitbreiden met discount velden
-- 
-- Deze migratie voegt de benodigde velden toe aan de subscriptions tabel
-- voor het kortingscode systeem.

-- Stap 1: Voeg discount_code veld toe (welke kortingscode is gebruikt)
ALTER TABLE subscriptions
ADD COLUMN discount_code TEXT;

-- Stap 2: Voeg discount_amount veld toe (hoeveel korting in euro's)
ALTER TABLE subscriptions
ADD COLUMN discount_amount NUMERIC;

-- Stap 3: Voeg original_price veld toe (originele prijs voor rapportage)
ALTER TABLE subscriptions
ADD COLUMN original_price NUMERIC;

-- Stap 4: Voeg check constraint toe voor discount_amount (moet positief zijn als niet NULL)
ALTER TABLE subscriptions
ADD CONSTRAINT subscriptions_discount_amount_positive_check
CHECK (
  discount_amount IS NULL OR
  discount_amount >= 0
);

-- Stap 5: Voeg check constraint toe voor original_price (moet positief zijn als niet NULL)
ALTER TABLE subscriptions
ADD CONSTRAINT subscriptions_original_price_positive_check
CHECK (
  original_price IS NULL OR
  original_price > 0
);

-- Stap 6: Maak index aan voor discount_code (voor snelle filtering en rapportage)
CREATE INDEX idx_subscriptions_discount_code ON subscriptions(discount_code) WHERE discount_code IS NOT NULL;

-- Opmerking: 
-- - discount_code kan NULL zijn (betaling zonder kortingscode)
-- - discount_amount kan NULL zijn (betaling zonder korting)
-- - original_price kan NULL zijn (voor oude records die al bestaan)
-- - De amount kolom die al bestaat kan gebruikt worden als paid_price (wat daadwerkelijk betaald is)

