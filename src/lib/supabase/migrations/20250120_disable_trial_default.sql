-- Migration: Disable trial default and update subscription_status constraint
-- Date: 2025-01-20
-- Purpose: Update subscription_status to support 'inactive' and 'active' instead of 'trial' and 'manual_active'
-- Epic: E1.S2 - Default status naar 'inactive'

-- 0. Update existing 'trial' users to 'inactive' (trial is disabled for new users)
-- Bestaande trial users worden 'inactive' zodat ze kunnen betalen om 'active' te worden
UPDATE profiles 
SET subscription_status = 'inactive', updated_at = NOW()
WHERE subscription_status = 'trial';

-- 0.1. Update existing 'manual_active' users to 'active' (equivalent status)
UPDATE profiles 
SET subscription_status = 'active', updated_at = NOW()
WHERE subscription_status = 'manual_active';

-- 1. Update constraint: Replace 'trial' and 'manual_active' with 'inactive' and 'active'
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_subscription_status_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_status_check 
CHECK (subscription_status IN (
  'inactive',  -- Nieuwe users zonder betaling
  'active',    -- Actieve betaling
  'expired',   -- Verlopen account
  'blocked'    -- Admin blocked
));

-- 2. Update DEFAULT value: Change from 'trial' to 'inactive'
ALTER TABLE profiles ALTER COLUMN subscription_status SET DEFAULT 'inactive';

-- 3. Update handle_new_user trigger to explicitly set subscription_status = 'inactive'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    -- Variable to hold the final organization_id to be inserted
    final_organization_id UUID;
    -- Variable to hold the final account_type
    final_account_type TEXT;
BEGIN
    -- Determine the account type. Default to 'individual' if not provided.
    final_account_type := COALESCE(new.raw_user_meta_data->>'account_type', 'individual');

    -- Check if an organization_id (as a UUID) was passed in the metadata.
    -- This is the preferred, direct way.
    IF new.raw_user_meta_data->>'organization_id' IS NOT NULL THEN
        -- Use the provided organization_id directly.
        -- We trust the frontend to have validated this via the RPC call.
        final_organization_id := (new.raw_user_meta_data->>'organization_id')::UUID;
    ELSE
        -- Fallback: if no organization_id is provided, default to the 'INDIVIDUAL' organization.
        SELECT id INTO final_organization_id 
        FROM organizations 
        WHERE org_code = 'INDIVIDUAL' 
        LIMIT 1;
    END IF;

    -- If, after all checks, we still don't have an organization ID, raise an error.
    IF final_organization_id IS NULL THEN
        RAISE EXCEPTION 'Could not determine organization for new user.';
    END IF;

    -- Insert the new profile with the determined values.
    -- Explicitly set subscription_status = 'inactive' for new users (no trial)
    INSERT INTO public.profiles (id, email, full_name, account_type, organization_id, subscription_status)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Unnamed User'),
        final_account_type,
        final_organization_id,
        'inactive'  -- New users get 'inactive' status (no trial)
    );
    
    RETURN new;
END;
$function$;

-- Comment explaining the migration
COMMENT ON COLUMN profiles.subscription_status IS 'Subscription status: inactive (new users), active (paid), expired (lapsed), blocked (admin)';

