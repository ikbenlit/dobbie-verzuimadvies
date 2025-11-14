/**
 * Contract Info Component
 * 
 * E5.S1: Toont contract voorwaarden in checkout voor transparantie
 * Eenvoudige info box zonder interactieve elementen
 */

import type { BillingPeriod } from '@/lib/payment/types';
import { Check } from 'lucide-react';

interface ContractInfoProps {
  billing: BillingPeriod;
}

/**
 * E5.S1: Contract info display component
 * 
 * Toont contract voorwaarden voor monthly of yearly subscriptions
 * - 12 maanden contractperiode
 * - 14 dagen bedenktijd met volledige refund mogelijkheid
 * - SEPA info voor monthly subscriptions
 */
export default function ContractInfo({ billing }: ContractInfoProps) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50 mb-6">
      <h3 className="font-semibold mb-3 text-lg text-bordeaux-hover">
        📋 Contractvoorwaarden
      </h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-green-600 mt-0.5">
            <Check className="w-4 h-4" />
          </span>
          <span>12 maanden contractperiode</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-600 mt-0.5">
            <Check className="w-4 h-4" />
          </span>
          <span>14 dagen bedenktijd met volledige refund mogelijkheid</span>
        </li>
        {billing === 'monthly' && (
          <>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">
                <Check className="w-4 h-4" />
              </span>
              <span>Eerste maand: betaling via iDEAL</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">
                <Check className="w-4 h-4" />
              </span>
              <span>Daarna: automatische SEPA incasso (maandelijks)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">
                <Check className="w-4 h-4" />
              </span>
              <span>Na 12 maanden: maandelijks opzegbaar</span>
            </li>
          </>
        )}
        {billing === 'yearly' && (
          <>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">
                <Check className="w-4 h-4" />
              </span>
              <span>Volledige bedrag vooruit via iDEAL</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">
                <Check className="w-4 h-4" />
              </span>
              <span>Na 12 maanden: handmatig verlengen</span>
            </li>
          </>
        )}
      </ul>
      <p className="text-xs text-gray-500 mt-3">
        Voor vragen over je abonnement, neem contact op met support.
      </p>
    </div>
  );
}

