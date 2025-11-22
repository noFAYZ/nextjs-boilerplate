'use client'
import {
  LandingNav,
  PricingSection,
  FAQSection,
  FinalCTASection,
  LandingFooter,
  ScrollProgress,

} from '@/components/landing';

import IntegrationHero from '@/components/landing/integration-showcase';

import FinanceHeroDubStyle from '@/components/landing/subscription-management/about-section';

import MoneyMapprFeatureSection from '@/components/landing/subscription-management/FeatureSection';

import { LandingHero,  } from '@/components/landing/subscription-management/landing-hero';

import { TestimonialsDemo } from '@/components/landing/subscription-management/testimonials-section';


export default function LandingPage() {

  return (
    <div >
  
      <ScrollProgress />
      
    <LandingNav />
      <LandingHero />
<FinanceHeroDubStyle />
   <MoneyMapprFeatureSection />

   
    {/*   <Header /> < FeaturesSectionWithHoverEffects />
  
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
