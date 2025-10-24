import { Lightbulb, CheckCircle } from 'lucide-react';

export default function DobbieCTA() {
  return (
    <section className="py-16 bg-brand-light">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#E9B046] to-[#F0C674] rounded-full flex items-center justify-center mr-3 animate-pulse">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#5A0D29]">
                Interesse in DOBbie?
              </h3>
            </div>
            <p className="text-brand-text mb-6 max-w-2xl">
              DOBbie komt binnenkort online. Meld u aan voor early access en
              blijf op de hoogte van de laatste ontwikkelingen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-[#771138] to-[#5A0D29] hover:from-[#5A0D29] hover:to-[#771138] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
                <CheckCircle className="w-4 h-4 mr-2 text-[#E9B046]" />
                Houd mij op de hoogte
              </button>
              <button className="bg-[#E9B046] hover:bg-[#F0C674] text-[#5A0D29] px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95">
                Plan een demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
