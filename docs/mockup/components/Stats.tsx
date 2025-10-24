
import React from 'react';

const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <p className="font-serif text-4xl md:text-5xl font-bold text-[#5A0D29]">{value}</p>
    <p className="mt-2 text-sm text-brand-text">{label}</p>
  </div>
);

const Stats: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <StatItem value="95%" label="Nauwkeurigheid in Advies" />
          <StatItem value="24/7" label="Beschikbaarheid" />
          <StatItem value="1000+" label="Tevreden Bedrijven" />
        </div>
      </div>
    </section>
  );
};

export default Stats;
