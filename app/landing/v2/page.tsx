'use client'

import { FAQSection, PricingSection } from "@/components/landing";
import { Footer } from "@/components/landing-v2/animated-footer";
import { LandingHero } from "@/components/landing-v2/landing-hero";
import { LandingNav } from "@/components/landing-v2/landing-nav";
import FinanceHeroDubStyle from '@/components/landing/subscription-management/about-section';
import Skiper16 from "@/components/landing/subscription-management/skiper-feature";
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
