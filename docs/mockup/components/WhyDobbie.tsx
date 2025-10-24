
import React from 'react';
import CheckIcon from './icons/CheckIcon';

const WhyDobbie: React.FC = () => {
  return (
    <section id="waarom" className="py-24 bg-brand-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-white rounded-full px-4 py-1.5 mb-4 shadow-sm">
            <p className="text-sm text-[#5A0D29] font-medium">Waarom DOBbie?</p>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#5A0D29]">
            Direct de juiste informatie
          </h2>
          <p className="mt-4 text-lg text-brand-text max-w-2xl mx-auto">
            Professioneel advies over verzuim en re-integratie, direct beschikbaar wanneer u het nodig heeft. Efficiënt, betrouwbaar en altijd up-to-date met de laatste wet- en regelgeving.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <img 
              src="/images/demo-dobbie.webp" 
              alt="Een voorbeeldscherm van de DoBbie chatbot die advies geeft over de Wet Verbetering Poortwachter." 
              className="rounded-2xl shadow-xl w-full h-auto object-cover aspect-square"
            />
          </div>
          <div className="space-y-6">
            <h3 className="font-serif text-3xl font-bold text-[#5A0D29]">Voordelen voor uw organisatie</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-[#5A0D29] mr-3 mt-1 flex-shrink-0" />
                <span><span className="font-bold">Altijd Actueel:</span> Gebaseerd op de meest recente wet- en regelgeving.</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-[#5A0D29] mr-3 mt-1 flex-shrink-0" />
                <span><span className="font-bold">Efficiënt & Snel:</span> Bespaar kostbare tijd en krijg direct antwoord.</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-[#5A0D29] mr-3 mt-1 flex-shrink-0" />
                <span><span className="font-bold">Betrouwbare Partner:</span> Ontwikkeld door experts in verzuim en re-integratie.</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-[#5A0D29] mr-3 mt-1 flex-shrink-0" />
                <span><span className="font-bold">Kostenbesparend:</span> Verminder externe advieskosten met een betaalbaar abonnement.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyDobbie;
