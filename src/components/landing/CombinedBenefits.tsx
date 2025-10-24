import { CheckCircle, TrendingUp, Clock, Users, Smile, Handshake } from 'lucide-react';

const stats = [
  {
    percentage: "75%",
    label: "Tijdsbesparing",
    description: "Van uren zoeken naar minuten directe adviezen",
    color: "text-teal",
    bgColor: "bg-teal/10",
    ringColor: "ring-teal/20"
  },
  {
    percentage: "40%",
    label: "Meer succes",
    description: "Verhoogd re-integratiesucces door evidence-based aanpak",
    color: "text-gold",
    bgColor: "bg-gold/10",
    ringColor: "ring-gold/20"
  },
  {
    percentage: "90%",
    label: "Minder risico's",
    description: "Voorkom juridische problemen door correct handelen",
    color: "text-bordeaux",
    bgColor: "bg-bordeaux/10",
    ringColor: "ring-bordeaux/20"
  }
];

const results = [
  {
    icon: TrendingUp,
    title: "Sneller hersteltraject",
    color: "text-teal",
    bgColor: "bg-teal/10"
  },
  {
    icon: Clock,
    title: "Eerder terugkeer naar werk",
    color: "text-gold",
    bgColor: "bg-gold/10"
  },
  {
    icon: Users,
    title: "Meer eigenaarschap bij leidinggevenden",
    color: "text-bordeaux",
    bgColor: "bg-bordeaux/10"
  },
  {
    icon: Smile,
    title: "Minder frustratie bij medewerkers",
    color: "text-teal",
    bgColor: "bg-teal/10"
  },
  {
    icon: CheckCircle,
    title: "Minder druk op HR en bedrijfsarts",
    color: "text-bordeaux-hover",
    bgColor: "bg-bordeaux-hover/10"
  },
  {
    icon: Handshake,
    title: "Betere samenwerking en dossiervorming",
    color: "text-gold",
    bgColor: "bg-gold/10"
  }
];

export default function CombinedBenefits() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-bordeaux-hover mb-4">
            Wat DOBbie in de praktijk oplevert
          </h2>
          <p className="text-lg text-brand-text max-w-2xl mx-auto">
            Concrete resultaten die u direct kunt verwachten
          </p>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-bordeaux-hover text-center mb-8">
            Bewezen resultaten
          </h3>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`inline-block ${stat.bgColor} rounded-full p-6 mb-4 ring-4 ${stat.ringColor} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                  <div className={`text-4xl md:text-5xl font-bold ${stat.color}`}>
                    {stat.percentage}
                  </div>
                </div>
                <div className={`text-lg font-bold ${stat.color} mb-2`}>
                  {stat.label}
                </div>
                <p className="text-sm text-brand-text">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>

          {/* Results Grid */}
          <div className="border-t border-gray-200 pt-8">
            <h4 className="font-bold text-xl text-bordeaux-hover text-center mb-6">
              Directe voordelen voor uw organisatie
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-brand-light rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group"
                >
                  <div className={`${result.bgColor} rounded-full p-2 flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                    <result.icon className={`w-5 h-5 ${result.color}`} />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-bordeaux-hover text-sm leading-snug">
                      {result.title}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
