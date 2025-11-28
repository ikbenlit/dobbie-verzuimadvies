import { redirect } from 'next/navigation';
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

interface HomePageProps {
  searchParams: Promise<{ code?: string; type?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  // Handle auth callback codes that land on homepage
  if (params.code) {
    const callbackUrl = `/auth/callback?code=${params.code}${params.type ? `&type=${params.type}` : ''}`;
    redirect(callbackUrl);
  }

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
