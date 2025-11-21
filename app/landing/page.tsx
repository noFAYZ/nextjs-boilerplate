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
import { FeaturesSectionWithHoverEffects } from '@/components/landing/subscription-management/feature-section2';
import MoneyMapprFeatureSection from '@/components/landing/subscription-management/FeatureSection';
import { LandingHero,  } from '@/components/landing/subscription-management/landing-hero';
import { LandingHeroAlt } from '@/components/landing/subscription-management/landing-hero-alt';
import { PortfolioShowcase } from '@/components/landing/subscription-management/portfolio-showcase';


export default function LandingPage() {

  return (
    <div >
  
      <ScrollProgress />
      <LandingNav />
      <LandingHero />
     {/*  <SocialProof /> */}
   <MoneyMapprFeatureSection />
   < FeaturesSectionWithHoverEffects />
        {/* <FeatureGrid />
  FeaturesSectionWithHoverEffects
       <SubscriptionsShowcase />
     <RealtimeTracking /> */}
        <PortfolioShowcase />
       <CryptoShowcase />
      <HowItWorks />
     {/* <AutomationShowcase />   */}
     
    {/*   
      <TestimonialsSection />
      <ComparisonSection />
      <SecuritySection /> */}
      <PricingSection />
      <FAQSection />
      {/* <FinalCTASection /> */}
      <LandingFooter />
     {/*  <StickyCTA /> */}
    </div>
  );
}
