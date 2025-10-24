
import React from 'react';
import CheckIcon from './icons/CheckIcon';

interface PricingCardProps {
  plan: string;
  price: string;
  period: string;
  features: string[];
  isFeatured: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, price, period, features, isFeatured }) => {
  const cardClasses = `p-8 rounded-2xl border ${
    isFeatured ? 'bg-[#771138] text-white border-[#771138]' : 'bg-white border-gray-200'
  }`;
  const buttonClasses = `w-full mt-8 py-3 px-6 font-bold rounded-full transition-all ${
    isFeatured ? 'bg-white text-[#5A0D29] hover:bg-gray-100' : 'bg-[#771138] text-white hover:bg-[#5A0D29]'
  }`;

  return (
    <div className={cardClasses}>
      <h3 className="text-xl font-bold">{plan}</h3>
      <p className="mt-4">
        <span className={`text-4xl font-bold ${isFeatured ? 'text-white' : 'text-[#5A0D29]'}`}>€{price}</span>
        <span className={`ml-1 ${isFeatured ? 'text-gray-300' : 'text-brand-text'}`}>/{period}</span>
      </p>
      <ul className="mt-6 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckIcon className={`h-5 w-5 mr-3 flex-shrink-0 ${isFeatured ? 'text-[#E9B046]' : 'text-[#5A0D29]'}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button className={buttonClasses}>Kies Plan</button>
    </div>
  );
};

const Pricing: React.FC = () => {
  return (
    <section id="prijzen" className="py-24 bg-brand-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#5A0D29]">
            Kies het plan dat bij u past
          </h2>
          <p className="mt-4 text-lg text-brand-text max-w-2xl mx-auto">
            Transparante prijzen voor elke organisatie. Start vandaag nog met het optimaliseren van uw verzuimbeleid.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            plan="Basis"
            price="49"
            period="maand"
            features={[
              'Onbeperkt vragen stellen',
              'Toegang voor 1 gebruiker',
              'Basis kennisbank',
              'Email ondersteuning',
            ]}
            isFeatured={false}
          />
          <PricingCard
            plan="Professioneel"
            price="99"
            period="maand"
            features={[
              'Alles in Basis',
              'Toegang voor 5 gebruikers',
              'Uitgebreide kennisbank',
              'Prioriteit ondersteuning',
              'Maandelijkse updates',
            ]}
            isFeatured={true}
          />
          <PricingCard
            plan="Enterprise"
            price="Contact"
            period="ons"
            features={[
              'Alles in Professioneel',
              'Onbeperkt aantal gebruikers',
              'API-toegang',
              'Persoonlijke onboarding',
              'Dedicated accountmanager',
            ]}
            isFeatured={false}
          />
        </div>
      </div>
    </section>
  );
};

export default Pricing;
