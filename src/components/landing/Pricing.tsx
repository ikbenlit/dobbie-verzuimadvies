'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface FeatureItem {
  text: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  price: number;
  userRange?: string;
  priceSuffix: string;
  description: string;
  features: FeatureItem[];
  ctaText: string;
  ctaLink: string;
  popular?: boolean;
}

const defaultTiers: PricingTier[] = [
  {
    name: 'Individueel',
    price: 12,
    priceSuffix: '/maand',
    description: 'Voor zelfstandige professionals en kleine praktijken',
    features: [
      { text: '24/7 toegang tot DoBie', included: true },
      { text: 'Onbeperkt vragen stellen', included: true },
      { text: 'Wet- en regelgeving updates', included: true },
      { text: 'Exporteren van gesprekken', included: true },
      { text: 'Basis rapportages', included: true },
    ],
    ctaText: 'Start gratis proefperiode',
    ctaLink: '/login',
  },
  {
    name: 'Team',
    price: 10,
    userRange: '2-25',
    priceSuffix: '/maand per gebruiker',
    description: 'Voor HR-teams en middelgrote organisaties',
    features: [
      { text: 'Alles van Individueel', included: true },
      { text: 'Team dashboard', included: true },
      { text: 'Gedeelde kennisbank', included: true },
      { text: 'Prioriteit support', included: true },
      { text: 'Uitgebreide rapportages', included: true },
    ],
    ctaText: 'Vraag demo aan',
    ctaLink: '/contact',
    popular: true,
  },
  {
    name: 'Organisatie',
    price: 8,
    userRange: '26-100',
    priceSuffix: '/maand per gebruiker',
    description: 'Voor grote organisaties met meerdere afdelingen',
    features: [
      { text: 'Alles van Team', included: true },
      { text: 'Organisatie dashboard', included: true },
      { text: 'API toegang', included: true },
      { text: 'Custom integraties', included: true },
      { text: 'Dedicated support', included: true },
    ],
    ctaText: 'Neem contact op',
    ctaLink: '/contact',
  },
];

const enterpriseTier: PricingTier = {
  name: 'Enterprise',
  price: 6,
  userRange: '100+',
  priceSuffix: '/maand per gebruiker',
  description: 'Voor grote ondernemingen met specifieke eisen',
  features: [
    { text: 'Alles van Organisatie', included: true },
    { text: 'Maatwerk oplossingen', included: true },
    { text: 'SLA garantie', included: true },
    { text: 'Account manager', included: true },
    { text: 'On-premise optie', included: true },
  ],
  ctaText: 'Plan gesprek in',
  ctaLink: '/contact',
};

interface PricingProps {
  tiers?: PricingTier[];
}

export default function Pricing({ tiers }: PricingProps) {
  const actualTiers = tiers && tiers.length > 0 ? tiers : defaultTiers;

  return (
    <section id="pricing" className="py-16 md:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-bordeaux">
            Professioneel verzuimadvies voor elke organisatie
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-dark max-w-3xl mx-auto">
            24/7 toegang tot expertise op het gebied van verzuim, Wet Poortwachter
            en personeelsbeleid
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3 items-start">
          {actualTiers.map((tier, index) => (
            <div
              key={index}
              className={cn(
                'bg-white rounded-lg shadow-lg p-6 md:p-8 relative flex flex-col h-full transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.15)]',
                tier.popular
                  ? 'border-2 border-bordeaux scale-102 hover:scale-104'
                  : ''
              )}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bordeaux text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                  Aanbevolen
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-dark mb-2">
                {tier.name}
              </h3>

              {tier.userRange && (
                <div className="text-sm text-gray-dark mb-2">
                  {tier.userRange} gebruikers
                </div>
              )}

              <p className="text-gray-dark mb-4 min-h-[40px]">
                {tier.description}
              </p>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-bordeaux">
                  €{tier.price}
                </span>
                <span className="text-lg text-gray-dark">{tier.priceSuffix}</span>
              </div>

              <ul className="space-y-3 mb-8 text-gray-dark flex-grow">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <svg
                      className={cn(
                        'w-5 h-5 mr-2 flex-shrink-0',
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

        {/* Enterprise Section */}
        <div className="mt-16 md:mt-24">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8 md:p-10 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-bordeaux mb-3">
              {enterpriseTier.name}
            </h3>

            {enterpriseTier.userRange && (
              <div className="text-sm text-gray-dark mb-2">
                {enterpriseTier.userRange} gebruikers
              </div>
            )}

            <p className="text-gray-dark mb-4">{enterpriseTier.description}</p>

            <div className="mb-6">
              <span className="text-4xl md:text-5xl font-extrabold text-bordeaux">
                €{enterpriseTier.price}
              </span>
              <span className="text-lg md:text-xl text-gray-dark">
                {enterpriseTier.priceSuffix}
              </span>
            </div>

            <ul className="space-y-2 mb-8 text-gray-dark text-left sm:text-center">
              {enterpriseTier.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center justify-center sm:justify-start"
                >
                  <svg
                    className="w-5 h-5 text-bordeaux mr-2 flex-shrink-0"
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

            <Link
              href={enterpriseTier.ctaLink}
              className="bg-bordeaux hover:bg-bordeaux-hover text-white font-medium py-3 px-8 rounded-md shadow-md hover:shadow-lg transition-all duration-300 text-lg inline-block"
            >
              {enterpriseTier.ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
