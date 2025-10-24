const benefits = [
  {
    percentage: "75%",
    label: "Tijdsbesparing",
    description: "Van uren zoeken naar minuten directe adviezen",
    color: "text-green-600",
    bgColor: "bg-green-500/10",
    ringColor: "ring-green-500/20"
  },
  {
    percentage: "40%",
    label: "Meer succes",
    description: "Verhoogd re-integratiesucces door evidence-based aanpak",
    color: "text-[#E9B046]",
    bgColor: "bg-[#E9B046]/10",
    ringColor: "ring-[#E9B046]/20"
  },
  {
    percentage: "90%",
    label: "Minder risico's",
    description: "Voorkom juridische problemen door correct handelen",
    color: "text-[#5A0D29]",
    bgColor: "bg-[#5A0D29]/10",
    ringColor: "ring-[#5A0D29]/20"
  }
];

export default function DobbieBenefits() {
  return (
    <section className="py-16 bg-brand-light">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#5A0D29] text-center mb-8">
            Bewezen resultaten
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className={`inline-block ${benefit.bgColor} rounded-full p-6 mb-4 ring-4 ${benefit.ringColor} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                  <div className={`text-4xl md:text-5xl font-bold ${benefit.color}`}>
                    {benefit.percentage}
                  </div>
                </div>
                <div className={`text-lg font-bold ${benefit.color} mb-2`}>
                  {benefit.label}
                </div>
                <p className="text-sm text-brand-text">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
