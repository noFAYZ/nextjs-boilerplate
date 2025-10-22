'use client'
import {
  LandingNav,
  LandingHero,
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
  PortfolioShowcase,
  RealtimeTracking,
  AutomationShowcase,
  SubscriptionsShowcase,
} from '@/components/landing';
import { CryptoShowcase } from '@/components/landing/crypto-section';
import { ReactLenis, useLenis } from 'lenis/react'


export default function LandingPage() {
  const lenis = useLenis((lenis) => {
    // called every scroll
    console.log(lenis)
  })
  return (
    <div className="min-h-screen">
       <ReactLenis root />
      <ScrollProgress />
      <LandingNav />
      <LandingHero />
      {/*  <SocialProof />
     <StatsSection /> */}
     
      <FeatureGrid />
       <PortfolioShowcase />
       <CryptoShowcase />
       <SubscriptionsShowcase />
      <RealtimeTracking />
{/*       <IntegrationShowcase /> 
      <HowItWorks />
      <AutomationShowcase />*/}
      
      <TestimonialsSection />
  {/*     <ComparisonSection />
      <SecuritySection /> */}
      <PricingSection />
      <FAQSection />
      {/* <FinalCTASection /> */}
      <LandingFooter />
     {/*  <StickyCTA /> */}
    </div>
  );
}
