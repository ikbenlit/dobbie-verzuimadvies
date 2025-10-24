import {
  Header,
  Hero,
  Stats,
  WhyDobbie,
  Vision,
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
        <WhyDobbie />
        <Vision />
        <PricingNew />
        <FAQ />
      </main>
      <FooterNew />
      <ScrollToTopButton />
    </div>
  );
}
