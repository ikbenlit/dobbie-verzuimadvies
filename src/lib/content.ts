// Content management utilities
import type {
  HomeContent,
  FeaturesContent,
  FAQContent,
  PricingContent,
  CommonContent,
  AuthContent,
  DobbieHeroContent,
  ProblemSolutionContent,
  TestimonialsContent,
  DobbieCTAContent,
} from '@/types/content';

// Import JSON files
import homeContent from '@/content/nl/home.json';
import featuresContent from '@/content/nl/features.json';
import whyDobbieContent from '@/content/nl/why-dobbie.json';
import visionContent from '@/content/nl/vision.json';
import faqContent from '@/content/nl/faq.json';
import pricingContent from '@/content/nl/pricing.json';
import commonContent from '@/content/nl/common.json';
import authContent from '@/content/nl/auth.json';
import dobbieHeroContent from '@/content/nl/dobbie-hero.json';
import problemSolutionContent from '@/content/nl/problem-solution.json';
import testimonialsContent from '@/content/nl/testimonials.json';
import dobbieCTAContent from '@/content/nl/dobbie-cta.json';

/**
 * Get home page content (hero + stats)
 */
export function getHomeContent(): HomeContent {
  return homeContent as HomeContent;
}

/**
 * Get features section content
 */
export function getFeaturesContent(): FeaturesContent {
  return featuresContent as FeaturesContent;
}

/**
 * Get "Why DOBbie" section content
 */
export function getWhyDobbieContent() {
  return whyDobbieContent;
}

/**
 * Get vision section content
 */
export function getVisionContent() {
  return visionContent;
}

/**
 * Get FAQ content
 */
export function getFAQContent(): FAQContent {
  return faqContent as FAQContent;
}

/**
 * Get pricing content
 */
export function getPricingContent(): PricingContent {
  return pricingContent as PricingContent;
}

/**
 * Get common content (nav, footer, buttons)
 */
export function getCommonContent(): CommonContent {
  return commonContent as CommonContent;
}

/**
 * Get auth pages content (login, register, forgot password)
 */
export function getAuthContent(): AuthContent {
  return authContent as AuthContent;
}

/**
 * Get Dobbie Hero section content
 */
export function getDobbieHeroContent(): DobbieHeroContent {
  return dobbieHeroContent as DobbieHeroContent;
}

/**
 * Get Problem Solution section content
 */
export function getProblemSolutionContent(): ProblemSolutionContent {
  return problemSolutionContent as ProblemSolutionContent;
}

/**
 * Get Testimonials section content
 */
export function getTestimonialsContent(): TestimonialsContent {
  return testimonialsContent as TestimonialsContent;
}

/**
 * Get Dobbie CTA section content
 */
export function getDobbieCTAContent(): DobbieCTAContent {
  return dobbieCTAContent as DobbieCTAContent;
}

/**
 * Get all content for a specific language
 * Currently only supports Dutch (nl), but ready for i18n
 */
export function getAllContent(locale: string = 'nl') {
  return {
    home: getHomeContent(),
    features: getFeaturesContent(),
    whyDobbie: getWhyDobbieContent(),
    vision: getVisionContent(),
    faq: getFAQContent(),
    pricing: getPricingContent(),
    common: getCommonContent(),
    auth: getAuthContent(),
    dobbieHero: getDobbieHeroContent(),
    problemSolution: getProblemSolutionContent(),
    testimonials: getTestimonialsContent(),
    dobbieCTA: getDobbieCTAContent(),
  };
}
