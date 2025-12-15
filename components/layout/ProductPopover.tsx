'use client';

import * as React from 'react';
import Link from 'next/link';
import { TrendingUp, Zap, Target, Users, PlugIcon, GalleryThumbnails, LucideLayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DuoIconsBank,
  MageDashboard,
  MynauiGridOne,
  SiGridViewDuotone,
  SolarGalleryWideOutline,
  SolarInboxInBoldDuotone,
  SolarWalletMoneyBoldDuotone,
} from '../icons/icons';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuItem,
  NavigationMenuIndicator,
} from '@/components/ui/navigation-menu';

interface LinkItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}



export function ProductPopover() {
  const features: LinkItem[] = [
    {
      title: 'Crypto Portfolio',
      description: '15+ chains, DeFi, NFTs & transactions',
      icon: SolarWalletMoneyBoldDuotone,
      href: '/#crypto',
    },
    {
      title: 'Banking & Accounts',
      description: '12,000+ banks via Teller & Stripe',
      icon: DuoIconsBank,
      href: '/#banking',
    },
    {
      title: 'Net Worth Tracker',
      description: 'Real-time asset & liability aggregation',
      icon: TrendingUp,
      href: '/#net-worth',
    },
    {
      title: 'Budgets & Alerts',
      description: 'Smart budgets with threshold notifications',
      icon: Zap,
      href: '/#budgets',
    },
    {
      title: 'Financial Goals',
      description: 'Automated savings goals & milestones',
      icon: Target,
      href: '/#goals',
    },
    {
      title: 'Subscription Manager',
      description: 'Auto-detect recurring payments',
      icon: SolarInboxInBoldDuotone,
      href: '/#subscriptions',
    },
    {
      title: 'Teams & Organizations',
      description: 'Shared access with role-based permissions',
      icon: Users,
      href: '/#teams',
    },
  ];

  const productLinks: LinkItem[] = [
    { title: 'Crypto Portfolio', href: '/#crypto', description: 'Multi-chain, DeFi & NFTs', icon: SolarWalletMoneyBoldDuotone },
    { title: 'Banking Aggregation', href: '/#banking', description: 'Traditional bank accounts', icon: DuoIconsBank },
    { title: 'Net Worth Dashboard', href: '/#net-worth', description: 'Full financial snapshot', icon: TrendingUp },
    { title: 'Budgets', href: '/#budgets', description: 'Flexible budgeting & alerts', icon: Zap },
    { title: 'Goals', href: '/#goals', description: 'Automated progress tracking', icon: Target },
    { title: 'Subscription Tracker', href: '/#subscriptions', description: 'Recurring charge detection', icon: SolarInboxInBoldDuotone },
    { title: 'Teams & Organizations', href: '/#teams', description: 'Multi-user access', icon: Users },
    { title: 'Integrations', href: '/#integrations', description: 'QuickBooks, Zerion + more', icon: PlugIcon },
  ];

  function ListItem({ title, href, description, icon: Icon }: LinkItem) {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a href={href} className="block select-none space-y-1 rounded-xl p-2 leading-none no-underline hover:shadow outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow border bg-muted">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <div className="text-[13px] font-semibold leading-none">{title}</div>
                <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground mt-1">{description}</p>
              </div>
            </div>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }

  return ( <>

    <NavigationMenu delayDuration={0}> {/* Instant open */}
                  <NavigationMenuList className="gap-0">
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className=" hover:text-muted-foreground bg-transparent " ><SiGridViewDuotone />
                      <NavigationMenuIndicator />
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className='rounded-3xl'>
                        <ul className="grid w-[480px] grid-cols-2 gap-2  rounded-2xl">
                          {productLinks.map((item) => (
                            <ListItem key={item.title} title={item.title} href={item.href} description={item.description} icon={item.icon} />
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
  </>
   
  );
}
