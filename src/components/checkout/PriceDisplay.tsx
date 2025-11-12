'use client';

import type { PlanType, BillingPeriod } from '@/lib/payment/types';

interface PriceDisplayProps {
  plan: PlanType;
  billing: BillingPeriod;
  basePrice: number;
  finalPrice: number;
  discountAmount: number;
  discountCode?: string;
}

/**
 * Prijs display component voor checkout pagina
 * Toont originele prijs, korting, finale prijs en bespaarbedrag
 */
export default function PriceDisplay({
  plan,
  billing,
  basePrice,
  finalPrice,
  discountAmount,
  discountCode,
}: PriceDisplayProps) {
  const hasDiscount = discountAmount > 0 && discountCode;
  const savings = basePrice - finalPrice;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="font-serif text-2xl font-bold text-bordeaux-hover mb-4">
        Prijs Overzicht
      </h2>

      <div className="space-y-4">
        {/* Plan informatie */}
        <div className="flex justify-between text-lg">
          <span className="text-brand-text">Plan:</span>
          <span className="font-semibold text-bordeaux-hover">
            {plan === 'solo' ? 'Solo' : 'Team'}{' '}
            {billing === 'monthly' ? 'Maandelijks' : 'Jaarlijks'}
          </span>
        </div>

        {/* Originele prijs */}
        <div className="flex justify-between text-lg">
          <span className="text-brand-text">Prijs:</span>
          <span
            className={`font-semibold ${
              hasDiscount ? 'line-through text-gray-400' : ''
            }`}
          >
            €{basePrice.toFixed(2)}
          </span>
        </div>

        {/* Korting (alleen tonen als er korting is) */}
        {hasDiscount && (
          <>
            <div className="flex justify-between text-lg text-green-600">
              <span>Korting ({discountCode}):</span>
              <span className="font-semibold">-€{discountAmount.toFixed(2)}</span>
            </div>

            {/* Bespaarbedrag */}
            {savings > 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <span className="text-sm font-medium">
                    🎉 Je bespaart €{savings.toFixed(2)}!
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Totaal */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between text-xl font-bold text-bordeaux-hover">
            <span>Totaal:</span>
            <span className="text-2xl">€{finalPrice.toFixed(2)}</span>
          </div>
          {billing === 'yearly' && (
            <div className="text-sm text-brand-text mt-1 text-right">
              per jaar
            </div>
          )}
          {billing === 'monthly' && (
            <div className="text-sm text-brand-text mt-1 text-right">
              per maand
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

