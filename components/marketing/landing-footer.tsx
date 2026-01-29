'use client';

import Link from 'next/link';
import { Wallet, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import Image from 'next/image';

export function LandingFooter() {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Security', href: '#' },
        { label: 'Roadmap', href: '#' },
        { label: 'Integrations', href: '#' },
        { label: 'API Docs', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press Kit', href: '#' },
        { label: 'Contact', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Community', href: '#' },
        { label: 'Tutorials', href: '#' },
        { label: 'Changelog', href: '#' },
        { label: 'Status', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
        { label: 'Acceptable Use', href: '#' },
        { label: 'Licenses', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer className=" relative bg-card px-4 overflow-hidden ">
      
   
      {/* Grid Overlay */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 border-x border-white/5 [mask-image:linear-gradient(black,transparent)]"></div>
        <div className="absolute inset-y-0 left-1/2 w-[1200px] -translate-x-1/2">
          <svg
            className="pointer-events-none absolute inset-0 text-white/15 [mask-composite:intersect] [mask-image:linear-gradient(black,transparent),radial-gradient(black,transparent)]"
            width="100%"
            height="100%"
          >
            <defs>
              <pattern
                id="grid-pattern"
                x="-1"
                y="-1"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="1"
                ></path>
              </pattern>
            </defs>
            <rect fill="url(#grid-pattern)" width="100%" height="100%"></rect>
          </svg>
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="relative top-0 z-0 mx-auto mt-0 flex h-16 max-w-[min(700px,calc(100vw-2rem))] -translate-y-px items-start justify-center ">
        <svg
          viewBox="0 0 85 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto shrink-0 translate-x-px translate-y-px overflow-visible"
        >
          <rect x="0" y="0" width="85" height="1" fill="var(--background)" transform="translate(0, -1)" />
          <path
            d="M50 45C57.3095 56.6952 71.2084 63.9997 85 64V0H0C13.7915 0 26.6905 7.30481 34 19L50 45Z"
            fill="var(--background)"
          />
        </svg>
        <div className="border-t-1 relative z-10 h-[calc(100%+1px)] min-w-0 grow border-none bg-background "></div>
        <svg
          viewBox="0 0 85 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto shrink-0 -translate-x-px translate-y-px -scale-x-100 overflow-visible"
        >
          <rect x="0" y="0" width="85" height="1" fill="var(--background)" transform="translate(0, -1)" />
          <path
            d="M50 45C57.3095 56.6952 71.2084 63.9997 85 64V0H0C13.7915 0 26.6905 7.30481 34 19L50 45Z"
            fill="var(--background)"
          />
        </svg>
      </div>


    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
            {/* Main Footer Content */}
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6 mb-12">
              {/* Brand Section */}
              <div className="lg:col-span-2">
              <Link
                    href="/"
                    className="flex items-center gap-2 -ml-1 group"
                
                  >
                  <Image
                      src="/logo/log.png"
                      alt="MoneyMappr logo"
                      width={56}
                      height={56}
                      className="object-contain w-12 h-12  transition-transform group-hover:scale-102"
                      priority
                    /> 
                    {/*  <LogoMappr className='w-10 h-10' />*/}
                    <div className="flex flex-col">
                      <span className="text-base sm:text-lg font-bold tracking-tight">
                        MoneyMappr
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-muted-foreground hidden sm:block -mt-0.5">
                        Financial Intelligence
                      </span>
                    </div>
                  </Link>
                <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
                  Your complete financial management platform for traditional banking, cryptocurrency,
                  and investment portfolios. Take control of your wealth.
                </p>

                {/* Social Links */}
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:border-orange-200 dark:hover:border-orange-900 transition-colors"
                    >
                      <social.icon className="h-4 w-4 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Footer Links */}
              {footerSections.map((section) => (
                <div key={section.title}>
                  <h4 className="font-semibold text-sm mb-4">{section.title}</h4>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Newsletter Section 
            <div className="mb-12 rounded-2xl border bg-card p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Stay updated</h3>
                  <p className="text-sm text-muted-foreground">
                    Get the latest updates on new features, integrations, and financial tips.
                  </p>
                </div>
                <div className="flex-1 w-full md:max-w-md">
                  <form className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                      Subscribe
                    </button>
                  </form>
                  <p className="text-xs text-muted-foreground mt-2">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </div>
              </div>
            </div>*/}

            {/* Bottom Section */}
            <div className="pt-8 border-t">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()} MoneyMappr. All rights reserved.
                </p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <Link href="#" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                    Privacy
                  </Link>
                  <Link href="#" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                    Terms
                  </Link>
                  <Link href="#" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                    Cookies
                  </Link>
                </div>
              </div>
            </div>
          </div>


 
      

    </footer>
  );
}
