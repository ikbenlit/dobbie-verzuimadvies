import Link from 'next/link';
import { CheckIcon } from '@/components/ui/icons';
import { getPricingContent, getCommonContent } from '@/lib/content';

interface PricingCardProps {
  name: string;
  yearlyPrice: number;
  monthlyPrice: number;
  minUsers?: number;
  description: string;
  features: Array<{ text: string; included: boolean }>;
  ctaText: string;
  ctaLink: string;
  popular?: boolean;
  footnote?: string;
  popularBadge?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  yearlyPrice,
  monthlyPrice,
  minUsers,
  description,
  features,
  ctaText,
  ctaLink,
  popular,
  footnote,
  popularBadge,
}) => {
  const cardClasses = `p-8 rounded-2xl border relative ${
    popular
      ? 'bg-bordeaux text-white border-bordeaux'
      : 'bg-white border-gray-200'
  }`;
  const buttonClasses = `w-full mt-8 py-3 px-6 font-bold rounded-full transition-all ${
    popular
      ? 'bg-white text-bordeaux-hover hover:bg-gray-100'
      : 'bg-bordeaux text-white hover:bg-bordeaux-hover'
  }`;

  return (
    <div className={`${cardClasses} flex flex-col`}>
      {popular && popularBadge && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-bordeaux text-xs font-semibold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
          {popularBadge}
        </div>
      )}

      <div className="mb-6">
        <h3 className={`text-2xl font-bold mb-2 ${popular ? 'text-white' : 'text-gray-900'}`}>{name}</h3>

        {minUsers && (
          <div className={`text-sm ${popular ? 'text-gray-200' : 'text-gray-600'}`}>
            vanaf {minUsers} gebruikers
          </div>
        )}

        <p className={`mt-2 text-sm ${popular ? 'text-gray-200' : 'text-brand-text'}`}>
          {description}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span
            className={`text-5xl font-bold ${popular ? 'text-white' : 'text-bordeaux-hover'}`}
          >
            €{monthlyPrice}
          </span>
          <span
            className={`text-base ${popular ? 'text-gray-300' : 'text-brand-text'}`}
          >
            {minUsers ? 'p.p. ' : ''}per maand*
          </span>
        </div>
        <p className={`text-base mt-2 ${popular ? 'text-gray-200' : 'text-brand-text'}`}>
          of <span className="font-semibold text-lg">€{yearlyPrice}</span>{minUsers ? ' p.p.' : ''} per jaar*
        </p>
      </div>

      <ul className="mb-6 space-y-4 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckIcon
              className={`h-5 w-5 mr-3 flex-shrink-0 mt-0.5 ${popular ? 'text-gold' : 'text-teal'}`}
            />
            <span className="text-base">{feature.text}</span>
          </li>
        ))}
      </ul>

      {footnote && (
        <p className={`text-xs mb-4 italic ${popular ? 'text-gray-300' : 'text-gray-600'}`}>
          {footnote}
        </p>
      )}

      <Link href={ctaLink} className={buttonClasses}>
        {ctaText}
      </Link>
    </div>
  );
};

export default function PricingNew() {
  const content = getPricingContent();
  const common = getCommonContent();

  return (
    <section id={content.sectionId} className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-16">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-bordeaux-hover text-center mb-4">
            {content.title}
          </h2>
          <p className="mt-4 text-lg text-brand-text text-center max-w-3xl mx-auto">
            {content.description}
          </p>

          {/* ROI Context */}
          <div className="mt-8 bg-gray-50 rounded-2xl p-6 max-w-4xl mx-auto border border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-brand-text">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-bordeaux-hover">€405</span>
                <span className="text-sm">gemiddelde kosten per verzuimdag</span>
              </div>
              <span className="hidden md:block text-teal text-2xl">→</span>
              <div className="text-center md:text-left">
                <p className="font-bold text-teal">DOBbie kost minder dan 1 uur bedrijfsarts</p>
                <p className="text-sm text-brand-text/80">Verdient zich vaak al in de eerste week terug</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {content.tiers.map((tier, index) => (
            <PricingCard
              key={index}
              name={tier.name}
              yearlyPrice={tier.yearlyPrice}
              monthlyPrice={tier.monthlyPrice}
              minUsers={tier.minUsers}
              description={tier.description}
              features={tier.features}
              ctaText={tier.ctaText}
              ctaLink={tier.ctaLink}
              popular={tier.popular}
              footnote={tier.footnote}
              popularBadge={content.popularBadge}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
