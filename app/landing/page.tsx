'use client'
import {
  PricingSection,
  FAQSection,
  FinalCTASection,
  LandingFooter,
  ScrollProgress,
  StickyCTA,

} from '@/components/landing';

import IntegrationHero from '@/components/landing/integration-showcase';

import FinanceHeroDubStyle from '@/components/landing/subscription-management/about-section';
import MoneyMapprFeatureSection from '@/components/landing/subscription-management/FeatureSection';



import { LandingHero,  } from '@/components/landing/subscription-management/landing-hero';

import { TestimonialsDemo } from '@/components/landing/subscription-management/testimonials-section';
import Skiper16 from '@/components/landing/subscription-management/skiper-feature';
import { LandingNav } from '@/components/landing-v2/landing-nav';
import { Footer } from '@/components/landing-v2/animated-footer';
import { Twitter, Linkedin, Github, Mail, NotepadTextDashed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Parkinsans, Funnel_Display, Newsreader,Urbanist ,Sora  } from 'next/font/google';

  const parkinsans = Sora({
    variable: "--font-geist-sans",
    subsets: ["latin"],
  });
export default function LandingPage() {
  const socialLinks = [
    {
      icon: <Twitter className="w-6 h-6" />,
      href: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      href: "https://linkedin.com",
      label: "LinkedIn",
    },
    {
      icon: <Github className="w-6 h-6" />,
      href: "https://github.com",
      label: "GitHub",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      href: "mailto:contact@moneymappr.com",
      label: "Email",
    },
  ];

  const navLinks = [
    { label: "Pricing", href: "/" },
    { label: "Features", href: "/" },
    { label: "About", href: "/" },
    { label: "Contact", href: "/" },
  ];

  return (
    <div className={cn('',parkinsans.className)}>
  
    {/*   <ScrollProgress /> */}
      
    <LandingNav />
      <LandingHero />
<FinanceHeroDubStyle />
   <MoneyMapprFeatureSection />

   
    {/*  <Skiper16 /> <Header /> < FeaturesSectionWithHoverEffects />
  
      <FeatureGrid /><SubscriptionsShowcase />
     <RealtimeTracking /> 
        <PortfolioShowcase />
       <CryptoShowcase />
      <HowItWorks />
    
     <TestimonialsDemo />  
      */}
 <IntegrationHero />
    {/*   
     
      <ComparisonSection />
      <SecuritySection /> 
      <PricingSection />*/}
      <FAQSection />
      {/* <FinalCTASection /> */}
 
    
      <Footer
      brandName="MoneyMappr"
      brandDescription="Personal Finance Management System"
      socialLinks={socialLinks}
      navLinks={navLinks}
      creatorName="FAYZ"
      creatorUrl="https://faizanasad.com"

    />
     {/*  <StickyCTA /> <LandingFooter />  */}
    </div>
  );
}
