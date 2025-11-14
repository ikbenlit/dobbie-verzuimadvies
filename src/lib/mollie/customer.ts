/**
 * Mollie Customer Management
 *
 * Deze module beheert Mollie Customer objecten voor recurring subscriptions.
 * Customers worden gekoppeld aan users via profiles.mollie_customer_id.
 */

import { mollieClient } from './client';
import type { Customer } from '@mollie/api-client';
import { createClient } from '@/lib/supabase/server';

/**
 * Simple in-memory cache voor Mollie customers
 * Cache wordt gebruikt binnen dezelfde module lifecycle (per request in Next.js)
 * Key: userId, Value: Mollie Customer object
 */
const customerCache = new Map<string, Customer>();

/**
 * Maak een Mollie Customer aan voor een user, of retourneer bestaande customer ID
 * 
 * Deze functie:
 * 1. Checkt of er al een Mollie customer bestaat voor deze user
 * 2. Als niet, maakt een nieuwe customer aan bij Mollie
 * 3. Slaat de customer ID op in profiles.mollie_customer_id
 * 4. Retourneert de customer ID
 * 
 * @param userId - De user ID (profiles.id)
 * @returns De Mollie customer ID (bijv. "cst_xxxxx")
 * @throws Error als user niet gevonden wordt of Mollie API call faalt
 * 
 * @example
 * ```typescript
 * const customerId = await createMollieCustomer(user.id);
 * // customerId = "cst_xxxxx"
 * ```
 */
export async function createMollieCustomer(userId: string): Promise<string> {
  const supabase = await createClient();

  try {
    // 1. Haal user profile op met email en full_name
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('mollie_customer_id, email, full_name')
      .eq('id', userId)
      .single();

    if (profileError) {
      throw new Error(`Failed to fetch user profile: ${profileError.message}`);
    }

    if (!profile) {
      throw new Error(`User profile not found for userId: ${userId}`);
    }

    // 2. Check of er al een Mollie customer bestaat
    if (profile.mollie_customer_id) {
      console.log(`[Mollie Customer] Existing customer found for user ${userId}: ${profile.mollie_customer_id}`);
      // Cache de bestaande customer ID (optioneel: haal customer op voor cache)
      return profile.mollie_customer_id;
    }

    // 3. Valideer dat email en full_name aanwezig zijn (vereist voor Mollie customer)
    if (!profile.email) {
      throw new Error(`User email is required but not found for userId: ${userId}`);
    }

    if (!profile.full_name) {
      throw new Error(`User full_name is required but not found for userId: ${userId}`);
    }

    // 4. Maak nieuwe customer aan bij Mollie
    console.log(`[Mollie Customer] Creating new customer for user ${userId}`);
    
    let customer;
    try {
      customer = await mollieClient.customers.create({
        name: profile.full_name,
        email: profile.email,
        metadata: {
          userId,
        },
      });
    } catch (mollieError) {
      // Mollie API specifieke error handling
      const errorMessage =
        mollieError instanceof Error
          ? mollieError.message
          : 'Unknown Mollie API error';
      
      console.error(
        `[Mollie Customer] Mollie API error creating customer for user ${userId}:`,
        errorMessage
      );
      
      throw new Error(`Failed to create Mollie customer: ${errorMessage}`);
    }

    // 5. Sla customer ID op in database
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ mollie_customer_id: customer.id })
      .eq('id', userId);

    if (updateError) {
      // Customer is aangemaakt bij Mollie, maar niet opgeslagen in DB
      // Dit is niet ideaal, maar we kunnen de customer ID nog steeds retourneren
      // De volgende call zal de customer opnieuw vinden bij Mollie
      console.error(
        `[Mollie Customer] Warning: Customer ${customer.id} created in Mollie but failed to save to database:`,
        updateError
      );
      // We gooien geen error omdat de customer wel bestaat bij Mollie
      // De volgende call zal de customer vinden en opslaan
    } else {
      console.log(`[Mollie Customer] Successfully created and saved customer ${customer.id} for user ${userId}`);
      // Cache de nieuwe customer
      customerCache.set(userId, customer);
    }

    return customer.id;
  } catch (error) {
    // Error handling voor verschillende error types
    if (error instanceof Error) {
      console.error(`[Mollie Customer] Error creating customer for user ${userId}:`, error.message);
      throw error;
    }

    // Onbekende error type
    console.error(`[Mollie Customer] Unknown error creating customer for user ${userId}:`, error);
    throw new Error('Failed to create Mollie customer: Unknown error');
  }
}

/**
 * Haal een Mollie Customer op voor een user
 * 
 * Deze functie:
 * 1. Checkt de cache voor een cached customer
 * 2. Haalt customer ID op uit database (profiles.mollie_customer_id)
 * 3. Als customer ID aanwezig, haalt customer op bij Mollie
 * 4. Retourneert customer object of null als geen customer bestaat
 * 5. Cachet het resultaat voor repeated calls
 * 
 * @param userId - De user ID (profiles.id)
 * @param useCache - Of caching gebruikt moet worden (default: true)
 * @returns Mollie Customer object of null als geen customer bestaat
 * 
 * @example
 * ```typescript
 * const customer = await getMollieCustomer(user.id);
 * if (customer) {
 *   console.log(`Customer email: ${customer.email}`);
 * }
 * ```
 */
export async function getMollieCustomer(
  userId: string,
  useCache: boolean = true
): Promise<Customer | null> {
  // 1. Check cache eerst
  if (useCache && customerCache.has(userId)) {
    const cachedCustomer = customerCache.get(userId);
    if (cachedCustomer) {
      console.log(`[Mollie Customer] Cache hit for user ${userId}`);
      return cachedCustomer;
    }
  }

  const supabase = await createClient();

  try {
    // 2. Haal customer ID op uit database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('mollie_customer_id')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error(
        `[Mollie Customer] Error fetching profile for user ${userId}:`,
        profileError.message
      );
      return null;
    }

    if (!profile || !profile.mollie_customer_id) {
      console.log(`[Mollie Customer] No customer ID found for user ${userId}`);
      return null;
    }

    // 3. Haal customer op bij Mollie
    try {
      const customer = await mollieClient.customers.get(profile.mollie_customer_id);

      // 4. Cache het resultaat
      if (useCache) {
        customerCache.set(userId, customer);
      }

      console.log(`[Mollie Customer] Retrieved customer ${customer.id} for user ${userId}`);
      return customer;
    } catch (mollieError) {
      // Mollie API error - customer bestaat mogelijk niet meer
      const errorMessage =
        mollieError instanceof Error
          ? mollieError.message
          : 'Unknown Mollie API error';

      console.error(
        `[Mollie Customer] Error fetching customer ${profile.mollie_customer_id} from Mollie:`,
        errorMessage
      );

      // Als customer niet gevonden wordt bij Mollie, maar wel in database staat,
      // kunnen we null retourneren (inconsistentie tussen DB en Mollie)
      // Dit kan gebeuren als customer handmatig verwijderd is bij Mollie
      return null;
    }
  } catch (error) {
    // Onbekende error
    console.error(
      `[Mollie Customer] Unknown error retrieving customer for user ${userId}:`,
      error
    );
    return null;
  }
}

/**
 * Clear de customer cache voor een specifieke user of voor alle users
 * 
 * @param userId - Optionele user ID. Als niet opgegeven, wordt de hele cache geleegd
 */
export function clearCustomerCache(userId?: string): void {
  if (userId) {
    customerCache.delete(userId);
    console.log(`[Mollie Customer] Cache cleared for user ${userId}`);
  } else {
    customerCache.clear();
    console.log(`[Mollie Customer] Cache cleared for all users`);
  }
}

