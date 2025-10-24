import { Lightbulb, CheckCircle } from 'lucide-react';

export default function DobbieCTA() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center mr-3 animate-pulse">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-bordeaux-hover">
                Interesse in DOBbie?
              </h3>
            </div>
            <p className="text-brand-text mb-6 max-w-2xl">
              DOBbie komt binnenkort online. Meld u aan voor early access en
              blijf op de hoogte van de laatste ontwikkelingen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-bordeaux to-bordeaux-hover hover:from-bordeaux-hover hover:to-bordeaux text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
                <CheckCircle className="w-4 h-4 mr-2 text-gold" />
                Houd mij op de hoogte
              </button>
              <button className="bg-white text-teal border-2 border-teal hover:bg-teal hover:text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95">
                Plan een demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
