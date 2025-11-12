/**
 * Mollie API Client Configuration
 * 
 * Deze module configureert de Mollie API client voor payment integratie.
 * De client wordt gebruikt voor het aanmaken van payments en het verwerken van webhooks.
 */

import { createMollieClient } from '@mollie/api-client';

// Valideer dat MOLLIE_API_KEY is geconfigureerd
if (!process.env.MOLLIE_API_KEY) {
  throw new Error(
    'MOLLIE_API_KEY is not set. Please add it to your .env.local file.'
  );
}

// Maak Mollie client aan met API key
export const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY,
});

// Export type voor Mollie client (voor TypeScript type checking)
export type MollieClient = typeof mollieClient;

