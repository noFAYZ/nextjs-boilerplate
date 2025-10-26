'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '../ui/theme-switcher';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DuoIconsBank, SolarInboxInBoldDuotone, SolarWalletMoneyBoldDuotone } from '../icons/icons';
import { LogoMappr } from '../icons';

export function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  /** === Scroll handling === */
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 24);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /** === Prevent scroll when mobile menu open === */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  /** === Nav Links with optional popover === */
  const navLinks = [
    { label: 'Features', type: 'popover' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  const quickLinks = [
    { label: 'Security', href: '#security' },
    { label: 'Integrations', href: '#integrations' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Comparison', href: '#comparison' },
  ];

  const handleLinkClick = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* === Floating Navbar === */}
      <nav
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          isScrolled ? 'py-2' : 'py-4'
        )}
      >
        <div
          className={cn(
            'mx-auto transition-all duration-200 px-4 sm:px-6',
            isScrolled ? 'max-w-6xl' : 'max-w-7xl'
          )}
        >
          <div
            className={cn(
              'relative rounded-xl transition-all duration-300',
              isScrolled
                ? 'bg-background/80 backdrop-blur-xl border border-border/60 shadow-lg'
                : 'bg-transparent border-transparent'
            )}
          >
            <div className="flex h-16 sm:h-14 items-center justify-between px-4 md:px-6">
              {/* === Logo === */}
              <Link
                href="/"
                className="flex items-center gap-2 -ml-1 group"
                onClick={handleLinkClick}
              >
               {/*  <Image
                  src="/logo/19.svg"
                  alt="MoneyMappr logo"
                  width={56}
                  height={56}
                  className="object-contain w-12 h-12 sm:w-14 sm:h-14 transition-transform group-hover:scale-105"
                  priority
                /> */}
                <LogoMappr className='w-12 h-12' />
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg font-bold tracking-tight">
                    MoneyMappr
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-muted-foreground hidden sm:block -mt-0.5">
                    Financial Intelligence
                  </span>
                </div>
              </Link>

              {/* === Desktop Nav === */}
              <div className="hidden lg:flex items-center gap-1  p-0.5">
                {navLinks.map((link) => {
                  if (link.type === 'popover') {
                    return (
                      <Popover
                        key={link.label}
                        open={openPopover === link.label}
                        onOpenChange={(isOpen) =>
                          setOpenPopover(isOpen ? link.label : null)
                        }
                      >
                        <PopoverTrigger
                          asChild
                          onMouseEnter={() => setOpenPopover(link.label)}
                          onMouseLeave={() => setOpenPopover(null)}
                        >
                          <Button variant='link' className="text-foreground">
                            {link.label}
                       
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent
                          align="start"
                          sideOffset={10}
                          onMouseEnter={() => setOpenPopover(link.label)}
                          onMouseLeave={() => setOpenPopover(null)}
                          className="p-4 min-w-[500px] rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-lg"
                        >
                          {/* === Popover Content === */}
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              {
                                title: "Bank Portfolio",
                                desc:
                                  "Track all your bank accounts, balances, and transactions in one place.",
                                icon: DuoIconsBank,
                                color: "text-blue-600 dark:text-blue-400",
                                gradient: "from-blue-500/10 to-blue-600/0",
                                disabled: true,
                              },
                              {
                                title: "Crypto Portfolio",
                                desc:
                                  "Manage your crypto assets and monitor performance across wallets.",
                                icon: SolarWalletMoneyBoldDuotone,
                                color: "text-orange-800 dark:text-orange-600",
                                gradient: "from-orange-500/10 to-orange-600/0",
                                disabled: true,
                              },
                              {
                                title: "Subscription Management",
                                desc:
                                  "Keep track of all your recurring payments and cancel unwanted ones.",
                                icon: SolarInboxInBoldDuotone,
                                color: "text-purple-600 dark:text-purple-400",
                                gradient: "from-purple-500/10 to-purple-600/0",
                                link: "/subscriptions",
                                disabled: false,
                              },
                            ].map((item, i) => (
                              <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-3 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer"
                              >
                                <p className="text-sm font-semibold">{item.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {item.desc}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    );
                  }

                  return (
                    <Link
                      key={link.label}
                      href={link.href ?? '#'}
                      className="relative  "
                    >
                      <Button variant='link' className="text-foreground">
                      <span className="relative z-10">{link.label}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>

              {/* === Desktop CTA === */}
              <div className="hidden lg:flex items-center gap-6">
                <ThemeSwitcher />
           {/*      <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="group text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      Get Started
                      <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Button>
                </Link> */}

                <Link href="/auth/signup">
                  <Button size="sm" className="group text-xs font-semibold">
                    <span className="flex items-center gap-1">
                     Join Waitlist
                      <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Button>
                </Link>
              </div>

              {/* === Mobile Menu Button === */}
              <div className="flex lg:hidden items-center gap-2">
                <ThemeSwitcher />
                <button
                  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                  className="relative flex items-center justify-center h-10 w-10 rounded-lg hover:bg-muted/70 active:bg-muted transition-colors"
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
                        isMobileMenuOpen ? 'opacity-0' : ''
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

      {/* === Mobile Menu Overlay === */}
      {/* ... keep your existing mobile menu code as is ... */}

      {/* === Animations === */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(24px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .safe-area-inset {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </>
  );
}
