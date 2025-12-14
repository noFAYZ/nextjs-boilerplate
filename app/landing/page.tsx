'use client'
import {
  PricingSection,
  FAQSection,
  FinalCTASection,
} from '@/components/landing';

import FinanceHeroDubStyle from '@/components/landing/subscription-management/about-section';
import MoneyMapprFeatureSection from '@/components/landing/subscription-management/FeatureSection';

import { TestimonialsDemo } from '@/components/landing/subscription-management/testimonials-section';
import { LandingNav } from '@/components/landing-v2/landing-nav';
import { Footer } from '@/components/landing-v2/animated-footer';
import { Twitter, Linkedin, Github, Mail, NotepadTextDashed } from 'lucide-react';

import DatabaseWithRestApi from '@/components/landing-v2/integrations-section';
import { LandingHero } from '@/components/landing/subscription-management/landing-hero2';
import { Example } from '@/components/landing/section-widgets/features-tabs';


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
    <div >
  
    {/*   <ScrollProgress /><Example bg={false} /> <FeaturesGrid />*/}
      
    <LandingNav />
      <LandingHero />
<FinanceHeroDubStyle /> 
      




   <MoneyMapprFeatureSection />


    {/*  <Header /> 
     < FeaturesSectionWithHoverEffects />
     <SubscriptionsShowcase />
     <RealtimeTracking /> 
       <PortfolioShowcase />
       <CryptoShowcase />  <FeaturesGrid />
      <HowItWorks />
 <Skiper16 />
     <FeatureGrid />   <IntegrationHero />  
      */}
 
   <DatabaseWithRestApi />
   



 <TestimonialsDemo />  
  <PricingSection />
      <FAQSection />
      <FinalCTASection />
       {/* <ComparisonSection /> 
      <SecuritySection /> 
     
      {/*  */}
 
    
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
