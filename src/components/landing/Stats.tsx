import { getHomeContent } from '@/lib/content';

interface StatItemProps {
  value: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label }) => (
  <div className="text-center">
    <p className="font-serif text-4xl md:text-5xl font-bold text-[#5A0D29]">
      {value}
    </p>
    <p className="mt-2 text-sm text-brand-text">{label}</p>
  </div>
);

export default function Stats() {
  const { stats } = getHomeContent();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <StatItem key={index} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
