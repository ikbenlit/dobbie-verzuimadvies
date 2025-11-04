import {
  Header,
  Hero,
  ProblemSolution,
  DobbieHero,
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
        <ProblemSolution />
        <DobbieHero />
        <CombinedBenefits />
        <DobbieTargetGroups />
        <Testimonials />
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
