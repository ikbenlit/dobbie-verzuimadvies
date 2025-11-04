import { CheckCircle, TrendingUp, Clock, Users, Smile, Handshake } from 'lucide-react';

const results = [
  {
    icon: TrendingUp,
    title: "Sneller hersteltraject",
    color: "text-green-600",
    bgColor: "bg-green-500/10"
  },
  {
    icon: Clock,
    title: "Eerder terugkeer naar werk",
    color: "text-[#E9B046]",
    bgColor: "bg-[#E9B046]/10"
  },
  {
    icon: Users,
    title: "Meer eigenaarschap bij leidinggevenden",
    color: "text-blue-600",
    bgColor: "bg-blue-500/10"
  },
  {
    icon: Smile,
    title: "Minder frustratie bij medewerkers",
    color: "text-green-600",
    bgColor: "bg-green-500/10"
  },
  {
    icon: CheckCircle,
    title: "Minder druk op HR en bedrijfsarts",
    color: "text-[#5A0D29]",
    bgColor: "bg-[#5A0D29]/10"
  },
  {
    icon: Handshake,
    title: "Betere samenwerking en dossiervorming",
    color: "text-blue-600",
    bgColor: "bg-blue-500/10"
  }
];

export default function ResultsList() {
  return (
    <section className="py-16 bg-brand-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#5A0D29] mb-4">
            Wat DOBbie in de praktijk oplevert
          </h2>
          <p className="text-lg text-brand-text max-w-2xl mx-auto">
            Concrete resultaten die u direct kunt verwachten
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 flex items-start gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
            >
              <div className={`${result.bgColor} rounded-full p-3 flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                <result.icon className={`w-6 h-6 ${result.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#5A0D29] leading-snug">
                  {result.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
