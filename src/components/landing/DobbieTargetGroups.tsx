import { Users, MessageSquare, TrendingUp } from 'lucide-react';

const targetGroups = [
  {
    icon: Users,
    title: "Leidinggevenden",
    description: "Zelfverzekerd verzuimgesprekken voeren",
    gradient: "bg-gradient-to-br from-[#771138] to-[#5A0D29]",
    hoverGradient: "hover:from-[#5A0D29] hover:to-[#771138]"
  },
  {
    icon: MessageSquare,
    title: "HR-professionals",
    description: "Professionele ondersteuning bij complex verzuim",
    gradient: "bg-gradient-to-br from-[#E9B046] to-[#F0C674]",
    hoverGradient: "hover:from-[#F0C674] hover:to-[#E9B046]"
  },
  {
    icon: TrendingUp,
    title: "Ondernemers",
    description: "Efficiënt verzuimbeleid zonder externe expertise",
    gradient: "bg-gradient-to-br from-blue-500 to-purple-500",
    hoverGradient: "hover:from-purple-500 hover:to-blue-500"
  }
];

export default function DobbieTargetGroups() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#5A0D29] mb-4">
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
              <h4 className="text-xl font-bold text-[#5A0D29] mb-3">
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
