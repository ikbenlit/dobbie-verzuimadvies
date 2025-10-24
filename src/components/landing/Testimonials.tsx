'use client';

import Image from 'next/image';

interface Testimonial {
  name: string;
  role: string;
  image: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Mark van der Berg',
    role: 'HR Manager bij TechCorp',
    image: '/images/testimonials/mark.webp',
    quote:
      'DOBbie heeft ons enorm geholpen bij het stroomlijnen van ons verzuimproces. De 24/7 beschikbaarheid en accurate adviezen hebben onze HR-afdeling veel tijd bespaard.',
  },
  {
    name: 'Linda de Vries',
    role: 'Casemanager Verzuim',
    image: '/images/avatar-1.webp',
    quote:
      'Als casemanager waardeer ik de actuele kennis van wet- en regelgeving. DOBbie geeft direct bruikbare antwoorden en houdt rekening met de laatste updates in de Wet Poortwachter.',
  },
  {
    name: 'Peter Jansen',
    role: 'Directeur MKB',
    image: '/images/testimonials/peter.webp',
    quote:
      'Voor een klein bedrijf als het onze is DOBbie de perfecte oplossing. Professioneel advies wanneer we het nodig hebben, zonder de kosten van een fulltime bedrijfsarts.',
  },
  {
    name: 'Sarah Ahmed',
    role: 'Teamleider Personeelszaken',
    image: '/images/avatar-3.webp',
    quote:
      'De combinatie van AI-technologie met gedegen medische en juridische kennis maakt DOBbie uniek. Het helpt ons om compliant te blijven en tegelijk efficiënt te werken.',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-bordeaux">
            Wat onze gebruikers zeggen
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-dark max-w-3xl mx-auto">
            Ontdek hoe DOBbie organisaties helpt bij professionele
            verzuimbegeleiding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-cream p-6 rounded-lg shadow-md transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]"
            >
              <div className="flex items-center mb-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-bold text-gray-dark">{testimonial.name}</h3>
                  <p className="text-sm text-gray-dark">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-dark italic">&ldquo;{testimonial.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
