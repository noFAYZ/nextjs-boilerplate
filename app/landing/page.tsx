'use client'
import {
  LandingNav,

  SocialProof,
  FeatureGrid,
  IntegrationShowcase,
  StatsSection,
  HowItWorks,
  TestimonialsSection,
  ComparisonSection,
  SecuritySection,
  PricingSection,
  FAQSection,
  FinalCTASection,
  LandingFooter,
  ScrollProgress,
  StickyCTA,

  RealtimeTracking,
  AutomationShowcase,
  SubscriptionsShowcase,
} from '@/components/landing';
import { CryptoShowcase } from '@/components/landing/crypto-section';
import IntegrationHero from '@/components/landing/integration-showcase';
import { Example } from '@/components/landing/section-widgets/features-tabs';
import FinanceHeroDubStyle from '@/components/landing/subscription-management/about-section';
import   UltimateFinanceHero  from '@/components/landing/subscription-management/about-section';
import { FeaturesSectionWithHoverEffects } from '@/components/landing/subscription-management/feature-section2';
import MoneyMapprFeatureSection from '@/components/landing/subscription-management/FeatureSection';
import { LandingHero,  } from '@/components/landing/subscription-management/landing-hero';
import { LandingHeroAlt } from '@/components/landing/subscription-management/landing-hero-alt';
import { PortfolioShowcase } from '@/components/landing/subscription-management/portfolio-showcase';
import { TestimonialsDemo } from '@/components/landing/subscription-management/testimonials-section';


export default function LandingPage() {

  return (
    <div >
  
      <ScrollProgress />
      <LandingNav />
      <LandingHero />
<FinanceHeroDubStyle />
   <MoneyMapprFeatureSection />
   
    {/*  < FeaturesSectionWithHoverEffects />
  
      <FeatureGrid /><SubscriptionsShowcase />
     <RealtimeTracking /> 
        <PortfolioShowcase />
       <CryptoShowcase />
      <HowItWorks />*/}
<IntegrationHero />
     <TestimonialsDemo />
    {/*   
      
      <ComparisonSection />
      <SecuritySection /> */}
      <PricingSection />
      <FAQSection />
      {/* */}<FinalCTASection /> 
      <LandingFooter />
     {/*  <StickyCTA /> */}
    </div>
  );
}
