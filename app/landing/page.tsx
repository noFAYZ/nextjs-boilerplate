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
        {/* <FeatureGrid />
      <PortfolioShowcase />
       <CryptoShowcase />
      
     <RealtimeTracking /> */}
     <SubscriptionsShowcase />
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
