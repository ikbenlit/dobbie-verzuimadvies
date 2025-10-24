import { Bot, Clock, Shield, Users } from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: "AI-gedreven advies",
    description: "Intelligente analyses gebaseerd op Nederlandse wetgeving en medische consensus",
    bgColor: "bg-[#E9B046]/10",
    iconColor: "text-[#E9B046]",
    borderColor: "hover:border-[#E9B046]/30"
  },
  {
    icon: Clock,
    title: "24/7 beschikbaar",
    description: "Directe ondersteuning wanneer u het nodig heeft, ook buiten kantooruren",
    bgColor: "bg-green-500/10",
    iconColor: "text-green-600",
    borderColor: "hover:border-green-500/30"
  },
  {
    icon: Shield,
    title: "Juridisch onderbouwd",
    description: "Alle adviezen gebaseerd op geldende Nederlandse wet- en regelgeving",
    bgColor: "bg-[#5A0D29]/10",
    iconColor: "text-[#5A0D29]",
    borderColor: "hover:border-[#5A0D29]/30"
  },
  {
    icon: Users,
    title: "Mensgerichte benadering",
    description: "Focus op empathische communicatie en verbindend leiderschap",
    bgColor: "bg-blue-500/10",
    iconColor: "text-blue-600",
    borderColor: "hover:border-blue-500/30"
  }
];

export default function DobbieFeatures() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white border border-gray-200 rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${feature.borderColor} group`}
            >
              <div className={`w-12 h-12 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110`}>
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>
              <h4 className="font-bold text-[#5A0D29] mb-2">
                {feature.title}
              </h4>
              <p className="text-sm text-brand-text">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
