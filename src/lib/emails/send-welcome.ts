/**
 * Verstuur welkomstmail na succesvolle betaling
 */

import { resend, DEFAULT_FROM_EMAIL } from './client';
import { getWelcomeEmailTemplate } from './welcome';
import type { PlanType, BillingPeriod } from '@/lib/payment/types';

interface SendWelcomeEmailParams {
  userEmail: string;
  userName: string;
  plan: PlanType;
  billing: BillingPeriod;
  amount: number;
  currency: string;
  discountCode?: string | null;
  discountAmount?: number | null;
  originalPrice?: number | null;
}

/**
 * Verstuur welkomstmail naar gebruiker
 */
export async function sendWelcomeEmail(params: SendWelcomeEmailParams): Promise<boolean> {
  if (!resend) {
    console.error('[Email] Resend client not initialized - RESEND_API_KEY missing');
    return false;
  }

  try {
    // Bepaal login URL
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const loginUrl = `${siteUrl}/chat`;

    // Genereer email HTML
    const html = getWelcomeEmailTemplate({
      userName: params.userName,
      plan: params.plan,
      billing: params.billing,
      amount: params.amount,
      currency: params.currency,
      discountCode: params.discountCode,
      discountAmount: params.discountAmount,
      originalPrice: params.originalPrice,
      loginUrl,
    });

    // Verstuur email
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: params.userEmail,
      subject: 'Welkom bij DOBbie - Je abonnement is geactiveerd!',
      html,
    });

    if (error) {
      console.error('[Email] Error sending welcome email:', error);
      return false;
    }

    console.log(`[Email] Successfully sent welcome email to ${params.userEmail} (ID: ${data?.id})`);
    return true;
  } catch (error) {
    console.error('[Email] Exception sending welcome email:', error);
    return false;
  }
}

