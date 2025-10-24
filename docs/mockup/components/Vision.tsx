import React from 'react';

const Vision: React.FC = () => {
  return (
    <section id="visie" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <div className="inline-block bg-brand-light rounded-full px-4 py-1.5 mb-4">
              <p className="text-sm text-[#5A0D29] font-medium">De visie achter DOBbie</p>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#5A0D29]">
              Gemaakt door Experts
            </h2>
            <p className="mt-4 text-lg text-brand-text">
              "Met DOBbie willen we complexe verzuimvraagstukken toegankelijk en beheersbaar maken voor iedere werkgever. Mijn jarenlange ervaring in de branche heeft me geleerd waar de knelpunten zitten. DOBbie is het antwoord: een slimme, efficiënte tool die organisaties ondersteunt bij het creëren van een gezond en productief werkklimaat."
            </p>
            <div className="mt-6">
              <p className="font-bold text-[#5A0D29]">Talar Lazarian</p>
              <p className="text-sm text-brand-text">Oprichtster van DOBbie</p>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
             <img 
              src="/images/talar-blauw.webp" 
              alt="Oprichtster Talar Lazarian" 
              className="rounded-2xl shadow-xl w-full max-w-sm h-auto object-cover aspect-[4/5] object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;