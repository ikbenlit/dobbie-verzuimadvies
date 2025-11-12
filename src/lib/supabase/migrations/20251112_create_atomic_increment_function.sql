-- MIGRATION: 20251112_create_atomic_increment_function.sql
-- Epic E1.S3: Atomic increment functie voor discount code uses
-- 
-- Deze functie verhoogt veilig het current_uses veld van een kortingscode
-- en voorkomt race conditions bij gelijktijdige betalingen.

CREATE OR REPLACE FUNCTION increment_discount_code_uses(code_text TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  max_allowed INTEGER;
BEGIN
  -- Lock row voor atomic update (voorkomt race conditions)
  -- FOR UPDATE zorgt ervoor dat andere transacties moeten wachten
  SELECT current_uses, max_uses INTO current_count, max_allowed
  FROM discount_codes
  WHERE UPPER(code) = UPPER(code_text)
    AND is_active = true
  FOR UPDATE;
  
  -- Check of code bestaat
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Check of max_uses bereikt is (als max_uses niet NULL is)
  -- Als max_uses NULL is, betekent dit onbeperkt gebruik
  IF max_allowed IS NOT NULL AND current_count >= max_allowed THEN
    RETURN false;
  END IF;
  
  -- Increment atomic (deze update gebeurt binnen de lock)
  UPDATE discount_codes
  SET current_uses = current_uses + 1
  WHERE UPPER(code) = UPPER(code_text);
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Opmerking:
-- Deze functie wordt aangeroepen vanuit de webhook handler (Epic 6)
-- wanneer een betaling succesvol is. De atomic operatie voorkomt dat
-- meerdere gebruikers tegelijk de laatste beschikbare gebruik van een code claimen.

