import Image from 'next/image';
import { Bot, Sparkles, Clock, Shield, Users } from 'lucide-react';
import { getDobbieHeroContent } from '@/lib/content';

const features = [
  {
    icon: Bot,
    title: "AI-gedreven advies",
    description: "Intelligente analyses gebaseerd op Nederlandse wetgeving en medische consensus",
    iconColor: "text-bordeaux",
    bgColor: "bg-bordeaux/10"
  },
  {
    icon: Clock,
    title: "24/7 beschikbaar",
    description: "Directe ondersteuning wanneer u het nodig heeft, ook buiten kantooruren",
    iconColor: "text-teal",
    bgColor: "bg-teal/10"
  },
  {
    icon: Shield,
    title: "Juridisch onderbouwd",
    description: "Alle adviezen gebaseerd op geldende Nederlandse wet- en regelgeving",
    iconColor: "text-teal-dark",
    bgColor: "bg-teal/10"
  },
  {
    icon: Users,
    title: "Mensgerichte benadering",
    description: "Focus op empathische communicatie en verbindend leiderschap",
    iconColor: "text-gold",
    bgColor: "bg-gold/10"
  }
];

export default function DobbieHero() {
  const content = getDobbieHeroContent();

  return (
    <section className="py-24 bg-brand-light">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-gold/20 to-gold-light/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 shadow-sm border border-gold/30">
            <p className="text-sm text-bordeaux-hover font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-gold" />
              {content.badge}
            </p>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-bordeaux-hover">
            {content.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-bordeaux to-bordeaux-hover">{content.titleHighlight}</span>
          </h2>
          <p className="mt-4 text-lg text-brand-text max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center mr-4 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-bordeaux-hover">{content.assistant.title}</h3>
                <p className="text-brand-text">{content.assistant.subtitle}</p>
              </div>
            </div>

            <div className="space-y-4 text-brand-text leading-relaxed">
              {content.assistant.description.map((paragraph, index) => (
                <p key={index} className={index === 0 ? "text-lg" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-full max-w-md aspect-square bg-white rounded-2xl shadow-xl overflow-hidden">
              <Image
                src="/images/demo-dobbie.webp"
                alt="DOBbie AI chat interface demo"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute bottom-4 left-4 right-4 text-white bg-bordeaux-hover/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">{content.interface.status}</span>
                </div>
                <p className="text-sm font-medium text-white">{content.interface.statusMessage}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Features Row */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-4 rounded-lg transition-all duration-300 hover:bg-white/50 group"
              >
                <div className={`w-10 h-10 ${feature.bgColor} rounded-full flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110`}>
                  <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                </div>
                <p className="text-m font-semibold text-bordeaux-hover mb-2">
                  {feature.title}
                </p>
                <p className="text-ms text-brand-text leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
