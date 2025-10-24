import { Users, MessageSquare, TrendingUp } from 'lucide-react';

const targetGroups = [
  {
    icon: Users,
    title: "Leidinggevenden",
    description: "Zelfverzekerd verzuimgesprekken voeren",
    gradient: "bg-gradient-to-br from-bordeaux to-bordeaux-hover",
    hoverGradient: "hover:from-bordeaux-hover hover:to-bordeaux"
  },
  {
    icon: MessageSquare,
    title: "HR-professionals",
    description: "Professionele ondersteuning bij complex verzuim",
    gradient: "bg-gradient-to-br from-gold to-gold-light",
    hoverGradient: "hover:from-gold-light hover:to-gold"
  },
  {
    icon: TrendingUp,
    title: "Ondernemers",
    description: "Efficiënt verzuimbeleid zonder externe expertise",
    gradient: "bg-gradient-to-br from-teal to-teal-dark",
    hoverGradient: "hover:from-teal-dark hover:to-teal"
  }
];

export default function DobbieTargetGroups() {
  return (
    <section className="py-16 bg-brand-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-bordeaux-hover mb-4">
            Voor wie is DOBbie bedoeld?
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {targetGroups.map((group, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
            >
              <div className={`w-16 h-16 ${group.gradient} ${group.hoverGradient} rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                <group.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-bordeaux-hover mb-3">
                {group.title}
              </h4>
              <p className="text-brand-text">
                {group.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
