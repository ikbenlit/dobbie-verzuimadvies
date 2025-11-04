import { Users, MessageSquare, TrendingUp } from 'lucide-react';

const targetGroups = [
  {
    icon: Users,
    title: "Leidinggevenden",
    description: "Zelfverzekerd verzuimgesprekken voeren",
    gradient: "bg-gradient-to-br from-bordeaux to-bordeaux-hover"
  },
  {
    icon: MessageSquare,
    title: "HR-professionals",
    description: "Professionele ondersteuning bij complex verzuim",
    gradient: "bg-gradient-to-br from-gold to-gold-light"
  },
  {
    icon: TrendingUp,
    title: "Ondernemers",
    description: "Efficiënt verzuimbeleid zonder externe expertise",
    gradient: "bg-gradient-to-br from-teal to-teal-dark"
  }
];

export default function DobbieTargetGroups() {
  return (
    <section className="py-16 bg-white">
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
              className="bg-white border border-gray-200 rounded-xl p-6 text-center"
            >
              <div className={`w-16 h-16 ${group.gradient} rounded-full flex items-center justify-center mx-auto mb-4`}>
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
