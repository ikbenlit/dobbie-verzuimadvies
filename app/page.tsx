import {
  Header,
  Hero,
  Stats,
  ProblemSolution,
  DobbieHero,
  DobbieFeatures,
  CombinedBenefits,
  DobbieTargetGroups,
  DobbieCTA,
  Vision,
  Testimonials,
  PricingNew,
  FAQ,
  FooterNew,
} from '@/components/landing';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Stats />
        <Testimonials />
        <ProblemSolution />
        <DobbieHero />
        <DobbieFeatures />
        <CombinedBenefits />
        <DobbieTargetGroups />
        <Vision />
        <PricingNew />
        <FAQ />
        <DobbieCTA />
      </main>
      <FooterNew />
      <ScrollToTopButton />
    </div>
  );
}
