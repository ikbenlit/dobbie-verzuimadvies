import { Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  gradient: string;
  bgColor: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Sinds DOBbie is er veel minder onzekerheid bij onze teamleiders.",
    author: "HR-adviseur",
    gradient: "from-[#771138] to-[#5A0D29]",
    bgColor: "bg-[#5A0D29]/5"
  },
  {
    quote: "Ik gebruik DOBbie voordat ik contact opneem met de arbodienst – dat scheelt tijd én vragen.",
    author: "Leidinggevende",
    gradient: "from-[#E9B046] to-[#F0C674]",
    bgColor: "bg-[#E9B046]/5"
  },
  {
    quote: "Veel vragen die eerst op mijn spreekuur kwamen, worden nu al opgelost. Ik kan me richten op medische beoordeling.",
    author: "Bedrijfsarts",
    gradient: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/5"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#5A0D29] mb-4">
            Wat anderen zeggen
          </h2>
          <p className="text-lg text-brand-text max-w-2xl mx-auto">
            DOBbie helpt al verschillende organisaties bij verzuimbegeleiding
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`${testimonial.bgColor} rounded-2xl p-8 border-2 border-transparent hover:border-opacity-30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden`}
            >
              {/* Gradient accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${testimonial.gradient}`}></div>

              {/* Quote icon */}
              <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
                <Quote className="w-6 h-6 text-white" />
              </div>

              {/* Quote text */}
              <p className="text-brand-text mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className={`text-sm font-bold bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent`}>
                — {testimonial.author}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
