'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { getPricingContent } from '@/lib/content';

export default function Pricing() {
  const pricingContent = getPricingContent();
  const { title, description, popularBadge, tiers } = pricingContent;

  return (
    <section id="pricing" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-bordeaux">
            {title}
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-dark max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto items-stretch">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={cn(
                'bg-white rounded-lg shadow-lg p-6 md:p-8 relative flex flex-col h-full transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.15)]',
                tier.popular
                  ? 'border-2 border-bordeaux'
                  : 'border border-gray-200'
              )}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bordeaux text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                  {popularBadge}
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-dark mb-2">
                {tier.name}
              </h3>

              {tier.minUsers && (
                <div className="text-sm text-gray-dark mb-2">
                  vanaf {tier.minUsers} gebruikers
                </div>
              )}

              <p className="text-gray-dark mb-6 min-h-[40px]">
                {tier.description}
              </p>

              <div className="mb-6 space-y-2">
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-extrabold text-bordeaux">
                    €{tier.yearlyPrice}
                  </span>
                  <span className="text-lg text-gray-dark ml-2">
                    {tier.minUsers ? 'p.p. ' : ''}per jaar*
                  </span>
                </div>
                <div className="text-center text-gray-dark">
                  of{' '}
                  <span className="font-semibold text-bordeaux">
                    €{tier.monthlyPrice}
                  </span>
                  {tier.minUsers ? ' p.p.' : ''} per maand*
                </div>
              </div>

              <ul className="space-y-3 mb-6 text-gray-dark flex-grow">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg
                      className={cn(
                        'w-5 h-5 mr-2 flex-shrink-0 mt-0.5',
                        feature.included ? 'text-bordeaux' : 'text-gray-300'
                      )}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>

              {tier.footnote && (
                <p className="text-xs text-gray-dark mb-4 italic">
                  {tier.footnote}
                </p>
              )}

              <Link
                href={tier.ctaLink}
                className={cn(
                  'block w-full text-center font-medium py-3 px-6 rounded-md shadow-md hover:shadow-lg transition-all duration-300 mt-auto',
                  tier.popular
                    ? 'bg-bordeaux hover:bg-bordeaux-hover text-white'
                    : 'bg-gold hover:bg-bordeaux hover:text-white text-black'
                )}
              >
                {tier.ctaText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
