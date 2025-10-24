'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wallet, Menu, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ThemeSwitcher } from '../ui/theme-switcher';

export function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll to add background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled ? 'py-2' : 'py-4'
        }`}
      >
        <div className={` mx-auto px-4 sm:px-6 ${isScrolled ? 'max-w-6xl' : 'max-w-7xl'} transition-all duration-150`}>
          {/* Floating Nav Container */}
          <div
            className={`relative rounded-xl transition-all duration-200 ${
              isScrolled
                ? 'bg-background/85 backdrop-blur-xl border border-border/70 shadow-lg'
                : 'bg-transparent backdrop-blur-md border border-transparent'
            }`}
          >
            <div className="flex h-16 sm:h-14 items-center justify-between px-4 md:px-6">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2 group relative z-10 -ml-1"
                onClick={handleLinkClick}
              >
                <Image
                  src={'/logo/19.svg'}
                  alt={'MoneyMappr logo'}
                  width={56}
                  height={56}
                  className="object-contain w-12 h-12 sm:w-14 sm:h-14"
                  priority
                />
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg font-bold tracking-tight">
                    MoneyMappr
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-muted-foreground -mt-0.5 hidden sm:block">
                    Financial Intelligence
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1 bg-muted/50 rounded-lg p-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="relative px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md group"
                  >
                    <span className="relative z-10">{link.label}</span>
                    <div className="absolute inset-0 bg-background rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" />
                  </Link>
                ))}
              </div>

              {/* Desktop CTA Buttons */}
              <div className="hidden lg:flex items-center gap-2">
                <ThemeSwitcher />
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="group">
                    <span className="flex items-center gap-1">
                      Get Started
                      <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Button>
                </Link>
              </div>

              {/* Mobile: Theme + Menu Button */}
              <div className="flex lg:hidden items-center gap-2">
                <ThemeSwitcher />
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex items-center justify-center h-10 w-10 rounded-lg hover:bg-muted/80 active:bg-muted transition-colors touch-manipulation"
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isMobileMenuOpen}
                >
                  <div className="relative w-5 h-5">
                    <span
                      className={`absolute top-1.5 left-0 w-5 h-0.5 bg-foreground rounded-full transition-all duration-300 ${
                        isMobileMenuOpen ? 'rotate-45 top-2' : ''
                      }`}
                    />
                    <span
                      className={`absolute top-2.5 left-0 w-5 h-0.5 bg-foreground rounded-full transition-all duration-300 ${
                        isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                    <span
                      className={`absolute top-3.5 left-0 w-5 h-0.5 bg-foreground rounded-full transition-all duration-300 ${
                        isMobileMenuOpen ? '-rotate-45 top-2' : ''
                      }`}
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-background/98 backdrop-blur-2xl"
          onClick={handleLinkClick}
        />

        {/* Menu Content */}
        <div
          className={`relative h-full flex flex-col safe-area-inset transition-transform duration-500 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Menu Items Container */}
          <div className="flex-1 overflow-y-auto pt-24 pb-6 px-4 sm:px-6">
            {/* Navigation Links */}
            <nav className="space-y-2 mb-8">
              {navLinks.map((link, index) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`group flex items-center justify-between py-4 px-5 rounded-xl border bg-card hover:bg-muted/50 active:scale-[0.98] transition-all duration-200 touch-manipulation ${
                    isMobileMenuOpen ? 'animate-slide-in-right' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 75}ms`,
                  }}
                >
                  <span className="text-base font-semibold">{link.label}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </nav>

            {/* Additional Quick Links */}
            <div className="pt-6 border-t">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                Quick Links
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Security', href: '#security' },
                  { label: 'Integrations', href: '#integrations' },
                  { label: 'Testimonials', href: '#testimonials' },
                  { label: 'Comparison', href: '#comparison' },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={handleLinkClick}
                    className="py-3 px-4 text-sm text-center rounded-lg border bg-card/50 hover:bg-muted/50 transition-colors touch-manipulation"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom CTA Section - Sticky */}
          <div className="border-t bg-background/95 backdrop-blur-lg px-4 sm:px-6 py-4 space-y-3">
            <Link href="/auth/signup" onClick={handleLinkClick}>
              <Button size="lg" className="w-full rounded-xl text-base touch-manipulation">
                Get Started Free
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/login" onClick={handleLinkClick}>
              <Button size="lg" variant="outline" className="w-full rounded-xl text-base touch-manipulation">
                Sign In
              </Button>
            </Link>
            <p className="text-xs text-center text-muted-foreground pt-2">
              No credit card required • Free 14-day trial
            </p>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out forwards;
          opacity: 0;
        }

        .safe-area-inset {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }

        @media (max-width: 640px) {
          .touch-manipulation {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
          }
        }
      `}</style>
    </>
  );
}
