'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Zap, TrendingUp, Target, LucideIcon, History, MapPinned, Briefcase, CreditCard, Lock, Activity, Mail, HelpCircle, FileText, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '../ui/theme-switcher';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DuoIconsBank, SolarWalletMoneyBoldDuotone, SolarInboxInBoldDuotone, HeroiconsWallet16Solid, SolarCalculatorBoldDuotone, MageGoals, PhUsersDuotone, GameIconsDeathStar, GameIconsTyre, GameIconsMetalDisc, GameIconsIceCube, GameIconsHops, GameIconsFairyWings, LogoMapprsss, GhostLogo, GhostLogoDark, SimpleIconsWebmoney, WalletLogoIconOpen } from '../icons/icons';
import { LogoMappr } from '../icons';
import { useAuth } from '@/lib/contexts/AuthContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Building2, PlugIcon, Users } from 'lucide-react';

export function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 24);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleLinkClick = () => setIsMobileMenuOpen(false);

  // Real Mappr Features
  const features = [
    { title: 'Crypto Portfolio', description: '15+ chains, DeFi, NFTs & transactions', icon: SolarWalletMoneyBoldDuotone, color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-500/10', href: '/#crypto' },
    { title: 'Banking & Accounts', description: '12,000+ banks via Teller & Stripe', icon: DuoIconsBank, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-500/10', href: '/#banking' },
    { title: 'Net Worth Tracker', description: 'Real-time asset & liability aggregation', icon: TrendingUp, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-500/10', href: '/#net-worth' },
    { title: 'Budgets & Alerts', description: 'Smart budgets with threshold notifications', icon: Zap, color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-500/10', href: '/#budgets' },
    { title: 'Financial Goals', description: 'Automated savings goals & milestones', icon: Target, color: 'text-pink-600 dark:text-pink-400', bgColor: 'bg-pink-500/10', href: '/#goals' },
    { title: 'Subscription Manager', description: 'Auto-detect recurring payments', icon: SolarInboxInBoldDuotone, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-500/10', href: '/#subscriptions' },
    { title: 'Teams & Organizations', description: 'Shared access with role-based permissions', icon: Users, color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-500/10', href: '/#teams' },
  ];

  type LinkItem = { title: string; href: string; icon: LucideIcon; description?: string };

  const productLinks: LinkItem[] = [
    { title: 'Crypto', href: '/#crypto', description: 'Multi-chain, DeFi & NFTs', icon: HeroiconsWallet16Solid },
    { title: 'Banking', href: '/#banking', description: 'Traditional bank accounts', icon: DuoIconsBank },
    { title: 'Net Worth', href: '/#net-worth', description: 'Full financial snapshot', icon: TrendingUp },
    { title: 'Budgets', href: '/#budgets', description: 'Flexible budgeting & alerts', icon: SolarCalculatorBoldDuotone },
    { title: 'Goals', href: '/#goals', description: 'Automated progress tracking', icon: MageGoals },
    { title: 'Subscriptions', href: '/#subscriptions', description: 'Recurring charge detection', icon: SolarInboxInBoldDuotone },
    { title: 'Organizations', href: '/#teams', description: 'Multi-user access', icon: PhUsersDuotone },
    { title: 'Integrations', href: '/#integrations', description: 'QuickBooks, Zerion + more', icon: PlugIcon },
  ];

  const companyLinks: LinkItem[] = [
    { title: 'About MoneyMappr', href: '/#about', description: 'Our mission and story', icon: Users },
    { title: 'Changelog', href: '/#changelog', description: 'Latest features & updates', icon: History },
    { title: 'Roadmap', href: '/#roadmap', description: "Vote on what's next", icon: MapPinned },
    { title: 'Careers', href: '/#careers', description: 'Join our team', icon: Briefcase },
  ];

  const companyLinks2: LinkItem[] = [
    { title: 'Pricing', href: '/#pricing', icon: CreditCard },
    { title: 'Terms of Service', href: '/#terms', icon: FileText },
    { title: 'Privacy Policy', href: '/#privacy', icon: Shield },
    { title: 'Security', href: '/#security', icon: Lock },
    { title: 'Help Center', href: '/#help', icon: HelpCircle },
    { title: 'Status', href: 'https://status.mappr.com', icon: Activity },
    { title: 'Contact', href: '/#contact', icon: Mail },
  ];

  // Reusable ListItem (unchanged, just moved for clarity)
function ListItem({ title, href, description, icon: Icon }: LinkItem) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a href={href} className="block select-none rounded-lg p-2 leading-none no-underline outline-none transition-colors hover:bg-muted/10 hover:text-accent-foreground  ">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-inner shadow-black  bg-linear-to-b from-orange-400 to-[hsl(25.41,100%,50%)]  to-amber-700/30% ">
              <Icon className="h-6 w-6 text-white/90" />
            </div>
            <div>
              <div className="text-xs font-medium  text-background">{title}</div>
              <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
}

  return (
    <>
      <nav className={cn('fixed inset-x-0 top-0 z-50', 'py-4')}>
        <div className={cn('mx-auto transition-all duration-100  ',
         
           'max-w-md  rounded-full  bg-[hsl(0,0%,18.82%)] dark:bg-gray-100  border-border/50 dark:from-foreground/95 dark:via-foreground dark:to-foreground w-11/12 p-2 py-1 sm:p-1' ,
           isScrolled ? 'max-w-sm ' : ''
          
          )}>
        
            <div className="relative flex  items-center justify-between sm:justify-arround">

              

              {/* Logo */}
             <Link href="/" className="flex items-center gap-2 bg-muted p-0.5 rounded-full group text-[32px]  " onClick={handleLinkClick}>
               {/*   <Image src="/logo/mappr.svg" alt="Mappr logo" width={56} height={56} className="w-9 h-9 object-contain" priority /> 
              <span className='hover:rotate-30 transition-transform duration-200'> 𒀭</span>*/}
             
           
            <WalletLogoIconOpen className='w-8 h-8' />
              </Link>

         

              <div className="hidden lg:flex items-center justify-center flex-1 text-background" >
                <NavigationMenu delayDuration={0}> {/* Instant open */}
                  <NavigationMenuList className="gap-0">
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="bg-transparent hover:bg-none text-[13px]" >Product</NavigationMenuTrigger>
                      <NavigationMenuContent className='bg-[hsl(0,0%,18.82%)] dark:bg-gray-100 border-0 ring-0'>
                        <ul className="grid w-[480px] grid-cols-2 gap-2  ">
                          {productLinks.map((item) => (
                            <ListItem key={item.title} title={item.title} href={item.href} description={item.description} icon={item.icon} />
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                  
               

                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link href="/#pricing" className=" text-[13px] font-medium hover:bg-accent/0 hover:text-background/80  rounded-full transition-colors py-1">
                          Pricing
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link href="#faq" className=" text-[13px] font-medium hover:bg-accent/0 py-1 hover:text-background/80 rounded-full transition-colors">
                          FAQs
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>


              {/* Desktop CTA */}
              <div className="hidden lg:flex items-center  gap-3">
                
              {/*    <ThemeSwitcher />*/}
              <Link href="/#hero"><Button size="sm" variant='brand' className="group rounded-full  h-9 text-xs font-medium" >
                        Waitlist  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
                      </Button></Link>
              {/*  {user ? (
                  <Link href="/dashboard"><Button size="xs" variant='steel' className='rounded-full'>Dashboard</Button></Link>
                ) : (
                  <>
                
                    <Link href="/auth/login">
                      <Button size="xs" variant='steel' className='rounded-full'>
                        Sign in <ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition" />
                      </Button>
                    </Link>
                  </>
                )}  */}
              </div>

              {/* Mobile Toggle */}
              <div className="flex lg:hidden items-center justify-between gap-2">
                {/* <ThemeSwitcher /> */}

            
                <button onClick={() => setIsMobileMenuOpen(v => !v)} className="p-1 rounded-lg hover:bg-muted/70 transition">
                  <div className="relative w-8 h-8">
                    <span className={cn("absolute top-1 left-0 w-7 h-1 bg-background rounded-full transition-all duration-300", isMobileMenuOpen && "rotate-45 top-2")} />
                    <span className={cn("absolute top-3 left-0 w-7 h-1 bg-background rounded-full transition-all duration-300", isMobileMenuOpen && "opacity-0")} />
                    <span className={cn("absolute top-5 left-0 w-7 h-1 bg-background rounded-full transition-all duration-300", isMobileMenuOpen && "-rotate-45 top-2")} />
                  </div>
                </button>
              </div>
            </div>
         
        </div>
      </nav>

      {/* Mobile Menu – unchanged but faster */}
      <motion.div initial={false} animate={isMobileMenuOpen ? "open" : "closed"}
        variants={{ open: { opacity: 1, pointerEvents: "auto" }, closed: { opacity: 0, pointerEvents: "none" } }}
        className="fixed inset-0 z-40 lg:hidden">
        <motion.div variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }} className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)} />
        <motion.div variants={{ open: { x: 0 }, closed: { x: "100%" } }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="absolute top-0 right-0 bottom-0 w-full sm:w-96 bg-background border-l border-border shadow-2xl overflow-y-auto">
          {/* Mobile menu content – same as before, just faster */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <LogoMappr className="w-10 h-10" />
              
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-muted">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 p-6 space-y-8 overflow-y-auto">
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Features</h3>
                <div className="space-y-3">
                  {features.map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <Link key={i} href={f.href} onClick={handleLinkClick} className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition">
                        <div className={cn("p-2 rounded-lg", f.bgColor)}><Icon className={cn("w-5 h-5", f.color)} /></div>
                        <div>
                          <div className="font-medium">{f.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{f.description}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {["How it Works", "Pricing", "FAQ", "Security", "Help Center", "Status"].map((label) => (
                  <Link key={label} href={label === "Status" ? "https://status.mappr.com" : `/#${label.toLowerCase().replace(" ", "-")}`} onClick={handleLinkClick}
                    className="p-4 text-center rounded-lg border hover:border-primary/50 hover:bg-muted/30 transition text-sm font-medium">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-6 border-t bg-muted/20">
              <Link href="/auth/signup" onClick={handleLinkClick} className="block">
                <Button size="lg" className="w-full">Get Started Free</Button>
              </Link>
              <p className="text-center text-xs text-muted-foreground mt-3">No card required • 14-day trial</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

