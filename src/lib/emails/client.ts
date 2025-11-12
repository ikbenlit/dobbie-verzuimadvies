/**
 * Resend email client configuratie
 */

import { Resend } from 'resend';

// Initialize Resend client
if (!process.env.RESEND_API_KEY) {
  console.warn(
    'RESEND_API_KEY is not set. Email functionality will not work.'
  );
}

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/**
 * Default email from address
 */
export const DEFAULT_FROM_EMAIL = 'DoBbie <noreply@dobbie-mail.ikbenlit.nl>';

