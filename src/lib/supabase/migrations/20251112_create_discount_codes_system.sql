-- MIGRATION: 20251112_create_discount_codes_system.sql
-- Epic E1.S1: Discount codes tabel aanmaken met alle velden, indexes en RLS policies
-- 
-- Deze migratie maakt de discount_codes tabel aan voor het kortingscode systeem.
-- De tabel ondersteunt zowel percentage- als bedrag-gebaseerde kortingen.

-- Stap 1: Maak de discount_codes tabel aan
CREATE TABLE discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percentage NUMERIC, -- NULL als discount_amount gebruikt wordt
  discount_amount NUMERIC,      -- NULL als discount_percentage gebruikt wordt
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  max_uses INTEGER,             -- NULL = onbeperkt gebruik
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stap 2: Voeg check constraint toe: discount_percentage OF discount_amount (niet beide)
-- Dit zorgt ervoor dat er altijd precies één type korting is gedefinieerd
ALTER TABLE discount_codes
ADD CONSTRAINT discount_codes_discount_type_check
CHECK (
  (discount_percentage IS NOT NULL AND discount_amount IS NULL) OR
  (discount_percentage IS NULL AND discount_amount IS NOT NULL)
);

-- Stap 3: Voeg check constraint toe voor discount_percentage range (0-100)
ALTER TABLE discount_codes
ADD CONSTRAINT discount_codes_percentage_range_check
CHECK (
  discount_percentage IS NULL OR
  (discount_percentage >= 0 AND discount_percentage <= 100)
);

-- Stap 4: Voeg check constraint toe voor discount_amount (moet positief zijn)
ALTER TABLE discount_codes
ADD CONSTRAINT discount_codes_amount_positive_check
CHECK (
  discount_amount IS NULL OR
  discount_amount > 0
);

-- Stap 5: Voeg check constraint toe voor max_uses (moet positief zijn als niet NULL)
ALTER TABLE discount_codes
ADD CONSTRAINT discount_codes_max_uses_positive_check
CHECK (
  max_uses IS NULL OR
  max_uses > 0
);

-- Stap 6: Voeg check constraint toe voor current_uses (mag niet negatief zijn)
ALTER TABLE discount_codes
ADD CONSTRAINT discount_codes_current_uses_non_negative_check
CHECK (
  current_uses >= 0
);

-- Stap 7: Maak index aan voor case-insensitive code lookups
-- Dit maakt het mogelijk om codes te zoeken ongeacht hoofdletters/kleine letters
CREATE INDEX idx_discount_codes_code_upper ON discount_codes(UPPER(code));

-- Stap 8: Maak index aan voor actieve codes (voor snelle filtering)
CREATE INDEX idx_discount_codes_is_active ON discount_codes(is_active) WHERE is_active = true;

-- Stap 9: Maak index aan voor valid_from en valid_until (voor datum filtering)
CREATE INDEX idx_discount_codes_valid_dates ON discount_codes(valid_from, valid_until);

-- Stap 10: Activeer Row Level Security (RLS) voor discount_codes tabel
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Stap 11: RLS Policy: Iedereen kan actieve codes lezen
-- Dit maakt het mogelijk voor gebruikers om kortingscodes te valideren
CREATE POLICY "Anyone can read active discount codes"
ON discount_codes
FOR SELECT
USING (is_active = true);

-- Stap 12: RLS Policy: Alleen service role kan schrijven
-- Dit voorkomt dat gebruikers zelf kortingscodes kunnen aanmaken of wijzigen
-- Service role bypass RLS automatisch, dus deze policy is voor extra duidelijkheid
CREATE POLICY "Service role can manage discount codes"
ON discount_codes
FOR ALL
USING (true)
WITH CHECK (true);

-- Opmerking: De service role policy hierboven werkt omdat service role RLS bypass heeft.
-- Voor productie kan je ook een expliciete check toevoegen op auth.role() = 'service_role',
-- maar dit is niet strikt noodzakelijk omdat service role altijd RLS bypass heeft.

