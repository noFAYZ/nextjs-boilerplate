'use client'

import { FAQSection, PricingSection } from "@/components/marketing";
import { Footer } from "@/components/marketing/animated-footer";
import { LandingHero } from "@/components/marketing/landing-hero";
import { LandingNav } from "@/components/marketing/landing-nav";
import FinanceHeroDubStyle from '@/components/marketing/subscription-management/about-section';
import Skiper16 from "@/components/marketing/subscription-management/skiper-feature";
import { Twitter, Linkedin, Github, Mail } from "lucide-react";

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
      href: "mailto:contact@resumegpt.com",
      label: "Email",
    },
  ];

  const navLinks = [
    { label: "Pricing", href: "/" },
    { label: "Templates", href: "/" },
    { label: "About", href: "/" },
    { label: "Contact", href: "/" },
  ];
  return (
    <div className=''>
  <LandingNav />
  <LandingHero />
  <FinanceHeroDubStyle />
  {/* <Skiper16 /> */}
  <PricingSection />
      <FAQSection />
      <Footer
      brandName="MoneyMappr"
      brandDescription="Personal Finance Management System"
      socialLinks={socialLinks}
      navLinks={navLinks}
      creatorName="FAYZ"
      creatorUrl="https://faizanasad.com"

    />
    </div>
  );
}
