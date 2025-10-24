import Image from 'next/image';
import { Bot, Sparkles } from 'lucide-react';

export default function DobbieHero() {
  return (
    <section className="py-24 bg-brand-light">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-[#E9B046]/20 to-[#F0C674]/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 shadow-sm border border-[#E9B046]/30">
            <p className="text-sm text-[#5A0D29] font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#E9B046]" />
              Binnenkort beschikbaar
            </p>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#5A0D29]">
            Maak kennis met <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#771138] to-[#5A0D29]">DOBbie</span>
          </h2>
          <p className="mt-4 text-lg text-brand-text max-w-2xl mx-auto">
            De intelligente AI-assistent voor verzuimmanagement. Eerste hulp bij verzuim,
            direct in uw broekzak. Ontwikkeld door een bedrijfsarts, speciaal voor Nederlandse organisaties.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#E9B046] to-[#F0C674] rounded-full flex items-center justify-center mr-4 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#5A0D29]">DOBbie AI-assistent</h3>
                <p className="text-brand-text">Eerste hulp bij verzuim</p>
              </div>
            </div>

            <div className="space-y-4 text-brand-text leading-relaxed">
              <p className="text-lg">
                DOBbie is niet zomaar een chatbot. Het is een specialistische AI-assistent
                die is ontwikkeld om leidinggevenden, HR-professionals en ondernemers
                direct te ondersteunen bij verzuimgesprekken en re-integratietrajecten.
              </p>
              <p>
                Gebaseerd op jarenlange expertise in bedrijfsgeneeskunde en toegespitst op
                de Nederlandse context, biedt DOBbie concrete, juridisch onderbouwde adviezen
                wanneer u die het meest nodig heeft.
              </p>
              <p>
                Of het nu gaat om een eerste ziekmelding, een lastig re-integratiegesprek of
                complexe verzuimproblematiek - DOBbie helpt u de juiste stappen te zetten.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-full max-w-md aspect-square bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* TODO: Vervang met screenshot van DOBbie chat interface */}
              {/* <Image src="/images/dobbie-interface.webp" alt="DOBbie AI chat interface" width={600} height={600} /> */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#E9B046]/10 via-[#5A0D29]/5 to-[#5A0D29]/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="relative">
                    <Bot className="w-24 h-24 text-[#E9B046] mx-auto mb-4 drop-shadow-lg" />
                    <div className="absolute inset-0 bg-[#E9B046]/20 blur-2xl"></div>
                  </div>
                  <p className="text-sm font-medium text-[#5A0D29]">DOBbie interface</p>
                  <p className="text-xs text-brand-text mt-1">Screenshot volgt binnenkort</p>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 text-white bg-[#5A0D29]/80 rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">DOBbie Online</span>
                </div>
                <p className="text-xs opacity-90">Klaar om u te helpen met verzuimadvies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
