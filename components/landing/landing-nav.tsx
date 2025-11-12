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
import { DuoIconsBank, SolarHomeSmileBoldDuotone, SolarInboxInBoldDuotone, SolarWalletMoneyBoldDuotone } from '../icons/icons';
import { LogoMappr } from '../icons';
import { useAuth } from '@/lib/contexts/AuthContext';

export function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const {user} = useAuth()

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
              'relative rounded-xl transition-all duration-200',
              isScrolled
                ? 'bg-background/80 border border-border/60 '
                : 'bg-transparent border-transparent'
            )}
          >
            <div className="flex h-16 sm:h-14 items-center justify-between px-2">
              {/* === Logo === */}
              <Link
                href="/"
                className="flex items-center gap-2 -ml-1 group"
                onClick={handleLinkClick}
              >
              <Image
                  src="/logo/mappr.svg"
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
              <div className="hidden lg:flex items-center gap-2">
                <ThemeSwitcher />

                {!process.env.NEXT_PUBLIC_WAITLIST_MODE ?    <Link href="/auth/signup">
                  <Button size="sm" className="group text-xs font-semibold">
                    <span className="flex items-center gap-1">
                     Join Waitlist
                      <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Button>
                </Link> : <>

                {user?    <Link href="/auth/signup">
                  <Button size="sm" >
                 
                      Dashboard
                  
                  
                  </Button>
                </Link> :
                <>
                
                <Link href="/auth/login">
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
                </Link></>
                }
                </>}


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
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? 'open' : 'closed'}
        variants={{
          open: { opacity: 1, pointerEvents: 'auto' },
          closed: { opacity: 0, pointerEvents: 'none' },
        }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-40 lg:hidden"
      >
        {/* Backdrop */}
        <motion.div
          variants={{
            open: { opacity: 1 },
            closed: { opacity: 0 },
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-xl"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <motion.div
          variants={{
            open: { x: 0 },
            closed: { x: '100%' },
          }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute top-0 right-0 bottom-0 w-full sm:w-[400px] bg-background border-l border-border shadow-2xl overflow-y-auto"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-2">
                <LogoMappr className="w-10 h-10" />
                <div className="flex flex-col">
                  <span className="text-lg font-bold">MoneyMappr</span>
                  <span className="text-[10px] text-muted-foreground -mt-0.5">
                    Financial Intelligence
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-muted/70 active:bg-muted transition-colors"
                aria-label="Close menu"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-foreground"
                >
                  <path
                    d="M15 5L5 15M5 5L15 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Features Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Features
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      title: 'Bank Portfolio',
                      desc: 'Track all your bank accounts in one place.',
                      icon: DuoIconsBank,
                      color: 'text-blue-600 dark:text-blue-400',
                      bgColor: 'bg-blue-500/10',
                    },
                    {
                      title: 'Crypto Portfolio',
                      desc: 'Manage your crypto assets and wallets.',
                      icon: SolarWalletMoneyBoldDuotone,
                      color: 'text-orange-800 dark:text-orange-600',
                      bgColor: 'bg-orange-500/10',
                    },
                    {
                      title: 'Subscription Management',
                      desc: 'Track all your recurring payments.',
                      icon: SolarInboxInBoldDuotone,
                      color: 'text-purple-600 dark:text-purple-400',
                      bgColor: 'bg-purple-500/10',
                    },
                  ].map((feature, i) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all cursor-pointer"
                      >
                        <div className={cn('p-2 rounded-lg', feature.bgColor)}>
                          <Icon className={cn('w-5 h-5', feature.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                            {feature.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {feature.desc}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Navigation
                </h3>
                <div className="space-y-1">
                  {navLinks
                    .filter((link) => link.type !== 'popover')
                    .map((link, i) => (
                      <motion.div
                        key={link.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                      >
                        <Link
                          href={link.href ?? '#'}
                          onClick={handleLinkClick}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all group"
                        >
                          <span className="text-sm font-medium group-hover:text-primary transition-colors">
                            {link.label}
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </Link>
                      </motion.div>
                    ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Quick Links
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {quickLinks.map((link, i) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={handleLinkClick}
                        className="flex items-center justify-center p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-muted/30 transition-all text-xs font-medium group"
                      >
                        <span className="group-hover:text-primary transition-colors">
                          {link.label}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="p-6 border-t border-border/50 space-y-3 bg-muted/20">
              <Link href="/auth/signup" onClick={handleLinkClick} className="block">
                <Button size="lg" className="w-full group font-semibold">
                  <span className="flex items-center justify-center gap-2">
                    Join Waitlist
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <p className="text-xs text-center text-muted-foreground">
                Be the first to experience MoneyMappr
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

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
