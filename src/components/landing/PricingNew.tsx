import { CheckIcon } from '@/components/ui/icons';
import { getPricingContent, getCommonContent } from '@/lib/content';

interface PricingCardProps {
  plan: string;
  price: string;
  period: string;
  features: string[];
  isFeatured: boolean;
  buttonText: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  price,
  period,
  features,
  isFeatured,
  buttonText,
}) => {
  const cardClasses = `p-8 rounded-2xl border ${
    isFeatured
      ? 'bg-bordeaux text-white border-bordeaux'
      : 'bg-white border-gray-200'
  }`;
  const buttonClasses = `w-full mt-8 py-3 px-6 font-bold rounded-full transition-all ${
    isFeatured
      ? 'bg-white text-bordeaux-hover hover:bg-gray-100'
      : 'bg-bordeaux text-white hover:bg-bordeaux-hover'
  }`;

  return (
    <div className={cardClasses}>
      <h3 className="text-xl font-bold">{plan}</h3>
      <p className="mt-4">
        <span
          className={`text-4xl font-bold ${isFeatured ? 'text-white' : 'text-bordeaux-hover'}`}
        >
          {price !== 'Contact' && '€'}
          {price}
        </span>
        <span
          className={`ml-1 ${isFeatured ? 'text-gray-300' : 'text-brand-text'}`}
        >
          /{period}
        </span>
      </p>
      <ul className="mt-6 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckIcon
              className={`h-5 w-5 mr-3 flex-shrink-0 ${isFeatured ? 'text-gold' : 'text-teal'}`}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button className={buttonClasses}>{buttonText}</button>
    </div>
  );
};

export default function PricingNew() {
  const content = getPricingContent();
  const common = getCommonContent();

  return (
    <section id={content.sectionId} className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-bordeaux-hover">
            {content.title}
          </h2>
          <p className="mt-4 text-lg text-brand-text max-w-2xl mx-auto">
            {content.description}
          </p>

          {/* ROI Context */}
          <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 max-w-3xl mx-auto border border-teal/40">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-brand-text">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-bordeaux-hover">€405</span>
                <span className="text-sm">gemiddelde kosten per verzuimdag</span>
              </div>
              <span className="hidden md:block text-teal text-2xl">→</span>
              <div className="text-center">
                <p className="font-bold text-teal">DOBbie kost minder dan 1 uur bedrijfsarts</p>
                <p className="text-sm text-brand-text/80">Verdient zich vaak al in de eerste week terug</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {content.plans.map((plan, index) => (
            <PricingCard
              key={index}
              plan={plan.plan}
              price={plan.price}
              period={plan.period}
              features={plan.features}
              isFeatured={plan.isFeatured}
              buttonText={common.buttons.choosePlan}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
