// Content type definitions for website content management

export interface HeroContent {
  badge: string;
  title: string;
  description: string;
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

export interface PricingContent {
  sectionId: string;
  title: string;
  description: string;
  plans: PricingPlan[];
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

// Main content structure
export interface SiteContent {
  home: HomeContent;
  features: FeaturesContent;
  whyDobbie: WhyDobbieContent;
  vision: VisionContent;
  pricing: PricingContent;
  faq: FAQContent;
  common: CommonContent;
}
