import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ProblemSolution() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Probleem */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#5A0D29]">
                Hoe verzuim onnodig stilvalt
              </h3>
            </div>

            <div className="space-y-4 text-brand-text leading-relaxed">
              <p>
                U herkent het vast: <strong>De bedrijfsarts zit vol. Leidinggevenden wachten. Vragen blijven liggen.</strong>
              </p>
              <p>
                En voor u het weet ligt er weer een verzuimdossier stil, terwijl iedereen van goede wil is.
              </p>
              <p>
                Soms wacht een medewerker <strong className="text-red-600">weken</strong> op iets wat medisch lijkt,
                maar eigenlijk <strong>communicatie, proces of misverstand</strong> is.
              </p>
              <p className="text-sm italic border-l-4 border-red-200 pl-4 py-2 bg-red-50">
                Ondertussen groeit de frustratie – bij de medewerker, de leidinggevende én bij u.
              </p>
            </div>
          </div>

          {/* Oplossing */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#5A0D29]">
                Wat je eigenlijk zou willen
              </h3>
            </div>

            <div className="space-y-4 text-brand-text leading-relaxed">
              <p>
                U zou willen dat <strong className="text-green-600">leidinggevenden hun rol serieuzer nemen</strong>.
              </p>
              <p>
                Dat ze niet alleen de verantwoordelijkheid hebben, maar ook <strong>het vertrouwen voelen om die te dragen</strong>.
              </p>
              <p>
                U wilt leidinggevenden die met <strong>kennis en zekerheid</strong> handelen.
                Die het gesprek aangaan, plannen maken en zorgen voor beweging.
              </p>
              <div className="bg-green-50 border-l-4 border-green-500 pl-4 py-3 space-y-2">
                <p className="font-bold text-[#5A0D29]">En u wilt zelf grip:</p>
                <ul className="text-sm space-y-1">
                  <li>✓ Geen eindeloze wachttijden, maar <strong>snelheid</strong></li>
                  <li>✓ Geen miscommunicatie, maar <strong>duidelijkheid</strong></li>
                  <li>✓ Geen overbelasting bedrijfsarts, maar <strong>inzet waar het telt</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-xl font-bold text-[#5A0D29]">
            Kortom: u wilt <span className="text-green-600">daadkracht in het proces</span> –
            zonder dat u daar nóg een systeem voor moet beheren.
          </p>
        </div>
      </div>
    </section>
  );
}
