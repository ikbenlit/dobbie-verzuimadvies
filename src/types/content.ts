// Content type definitions for website content management

export interface HeroContent {
  badge: string;
  title: string;
  description: string;
  descriptionHighlight?: string;
  descriptionEnd?: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta: {
    text: string;
    href: string;
  };
  video: {
    src: string;
    alt: string;
  };
}

export interface StatItem {
  value: string;
  label: string;
  description?: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesContent {
  sectionId: string;
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  features: Feature[];
}

export interface WhyDobbieContent {
  sectionId: string;
  title: string;
  subtitle: string;
  badge: string;
  benefitsTitle: string;
  image: {
    src: string;
    alt: string;
  };
  reasons: Array<{
    title: string;
    description: string;
  }>;
}

export interface VisionContent {
  sectionId: string;
  badge: string;
  title: string;
  description: string;
  author: {
    name: string;
    role: string;
    image: {
      src: string;
      alt: string;
    };
  };
}

export interface PricingPlan {
  plan: string;
  price: string;
  period: string;
  features: string[];
  isFeatured: boolean;
}

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingTier {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  minUsers?: number;
  description: string;
  features: PricingFeature[];
  ctaText: string;
  ctaLink: string;
  popular?: boolean;
  footnote?: string;
}

export interface PricingContent {
  sectionId: string;
  title: string;
  description: string;
  popularBadge: string;
  plans: PricingPlan[];
  tiers: PricingTier[];
  enterprise: PricingTier;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQContent {
  sectionId: string;
  title: string;
  description: string;
  items: FAQItem[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export interface CommonContent {
  nav: {
    logo: string;
    links: NavLink[];
    startButton: string;
  };
  footer: {
    logo: string;
    tagline: string;
    sections: FooterSection[];
    copyright: string;
  };
  buttons: {
    tryDobbie: string;
    moreInfo: string;
    choosePlan: string;
    contactUs: string;
    startNow: string;
  };
}

export interface HomeContent {
  hero: HeroContent;
  stats: StatItem[];
}

// Dobbie Hero content
export interface DobbieHeroContent {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  assistant: {
    title: string;
    subtitle: string;
    description: string[];
  };
  interface: {
    placeholder: string;
    comingSoon: string;
    status: string;
    statusMessage: string;
  };
}

// Problem Solution content
export interface ProblemSolutionParagraph {
  text?: string;
  highlight?: string;
  highlightColor?: string;
  continuation?: string;
  emphasis?: string;
  end?: string;
}

export interface BenefitItem {
  text: string;
  emphasis: string;
}

export interface ProblemSolutionContent {
  problem: {
    title: string;
    paragraphs: (string | ProblemSolutionParagraph)[];
    quote?: string;
    benefits?: {
      title: string;
      items: BenefitItem[];
    };
  };
  solution: {
    title: string;
    paragraphs: (string | ProblemSolutionParagraph)[];
    benefits: {
      title: string;
      items: BenefitItem[];
    };
  };
  cta: {
    text: string;
    highlight: string;
    continuation: string;
    action?: {
      title: string;
      subtitle: string;
      buttonText: string;
    };
  };
}

// Testimonials content
export interface Testimonial {
  quote: string;
  author: string;
  gradient: string;
  bgColor: string;
}

export interface TestimonialsContent {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
}

// Dobbie CTA content
export interface DobbieCTAContent {
  title: string;
  reasons: string[];
  support: {
    intro: string;
    badges: string[];
    promise: string;
  };
  cta: {
    emoji: string;
    heading: string;
    subtext: string;
  };
  buttons: {
    primary: string;
    secondary: string;
  };
}

// Auth content
export interface AuthPageFeatures {
  title: string;
  description: string;
  items: string[];
}

export interface AuthForm {
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  submitButton: string;
  submitButtonLoading: string;
  [key: string]: any;
}

export interface AuthLinks {
  [key: string]: string;
}

export interface AuthErrors {
  [key: string]: string;
}

export interface AuthPageContent {
  title: string;
  subtitle: string;
  features: AuthPageFeatures;
  form: AuthForm;
  links: AuthLinks;
  errors: AuthErrors;
}

export interface AuthContent {
  login: AuthPageContent;
  register: AuthPageContent;
  forgotPassword: AuthPageContent;
}

// Main content structure
export interface SiteContent {
  home: HomeContent;
  features: FeaturesContent;
  whyDobbie: WhyDobbieContent;
  vision: VisionContent;
  pricing: PricingContent;
  faq: FAQContent;
  common: CommonContent;
  auth: AuthContent;
  dobbieHero: DobbieHeroContent;
  problemSolution: ProblemSolutionContent;
  testimonials: TestimonialsContent;
  dobbieCTA: DobbieCTAContent;
}
