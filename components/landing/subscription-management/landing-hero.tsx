"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { ScrollReveal } from "../scroll-reveal";
import { RotatingHeadline } from "@/components/ui/RotatingWords";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

import {
  DuoIconsCreditCard,
  SolarChartSquareBoldDuotone,
  SolarClockCircleBoldDuotone,
  SolarShieldBoldDuotone,
  SolarPlayCircleBoldDuotone,
} from "@/components/icons/icons";
import {
  DuoIconsBank,
  FinancesIconDuotone,
  MageGoals,
  SolarInboxInBoldDuotone,
  SolarPieChart2BoldDuotone,
  SolarWalletMoneyBoldDuotone,
  SolarClipboardListBoldDuotone,
} from '../../icons/icons';
import { FlickeringGrid } from "../bg/FlickeringGrid";
import { WaitlistFormCompact } from "@/components/coming-soon/waitlist-form-compact";
import { TextRotate } from "../section-widgets/text-rotate";
import { Mockup, MockupFrame } from "../section-widgets/hero-mockup";
import { AvatarCircles } from "../section-widgets/avatar-circles";
import { Example } from "../section-widgets/features-tabs";
import { LogoCloud } from "./logo-cld-section";
import { BgGradient } from "../bg/bg-gradient";
import { getLogoUrl } from "@/lib/services/logo-service";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const FEATURES = [
  { Icon: SolarShieldBoldDuotone, label: "Bank-Level Encryption" },
  { Icon: SolarClockCircleBoldDuotone, label: "Instant Alerts" },
  { Icon: DuoIconsCreditCard, label: "Smart Spend Insights" },
  { Icon: SolarChartSquareBoldDuotone, label: "Predictive Analytics" },
] as const;

const DASHBOARD_IMAGES = {
  light: "/landing/subscription-management.PNG",
  dark: "/landing/subscription-management-dark.PNG",
  alt: "Financial dashboard with predictive insights",
} as const;
type Item = { label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> };

const logos = [
  {
    src: "https://svgl.app/library/nvidia-wordmark-light.svg",
    alt: "Nvidia Logo",
  },
  {
    src: "https://svgl.app/library/supabase_wordmark_light.svg",
    alt: "Supabase Logo",
  },
  {
    src: "https://svgl.app/library/openai_wordmark_light.svg",
    alt: "OpenAI Logo",
  },
  {
    src: "https://svgl.app/library/turso-wordmark-light.svg",
    alt: "Turso Logo",
  },
  {
    src: "https://svgl.app/library/vercel_wordmark.svg",
    alt: "Vercel Logo",
  },
  {
    src: "https://svgl.app/library/github_wordmark_light.svg",
    alt: "GitHub Logo",
  },
  {
    src: "https://svgl.app/library/claude-ai-wordmark-icon_light.svg",
    alt: "Claude AI Logo",
  },
  {
    src: "https://svgl.app/library/clerk-wordmark-light.svg",
    alt: "Clerk Logo",
  },
];

export function LandingHero() {
  const { resolvedTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const theme = resolvedTheme?.startsWith("dark") ? "dark" : "light";
  const imageSrc = DASHBOARD_IMAGES[theme];

  const fadeUp = {
    initial: { opacity: 0, y: reduceMotion ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: reduceMotion ? 1 : 0.96 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.65, ease: "easeOut" },
  };
  const rotatingItems: Item[] = [
    { label: 'Finances', icon: FinancesIconDuotone },
    { label: 'Banks', icon: DuoIconsBank },
    { label: 'Crypto', icon: SolarWalletMoneyBoldDuotone },
    { label: 'Subscriptions', icon: SolarInboxInBoldDuotone },
    { label: 'Budgets', icon: SolarPieChart2BoldDuotone },
    { label: 'Goals', icon: MageGoals },
  ];
  return (
    <section className="relative overflow-hidden pt-32 md:pt-40 ">

      {/* ============================================================= */}
      {/*                     TOP HEADLINE AREA (NO BG)                */}
      {/* ============================================================= */}
      <div
        className="absolute top-0 left-0 right-0 w-full h-[703px]"
        style={{
          background: "linear-gradient(to bottom, var(--background) 0%, rgba(217, 217, 217, 0) 100%)",
          zIndex: 0,
        }}
      />
          {/* Bottom overlay */}
          <div
        className="absolute bottom-0 left-0 right-0 w-full h-[103px] pointer-events-none"
        style={{
          background: "linear-gradient(to top, var(--background) 0%, rgba(217, 217, 217, 0) 100%)",
          zIndex: 10,
        }}
      />
      <BgGradient pattern={false} imageSrc="/landing/bg3.jpg" opacity="0" imageOpacity={0.78} />
       {/*    <div className="absolute  hidden lg:block mx-auto h-96 w-full">
            <FloatingCard delay={0} className="left-0 top-0 -rotate-12">
              <CryptoCard />
            </FloatingCard>

            <FloatingCard delay={0.5} className="left-12 top-56 rotate-6">
              <SubscriptionCard />
            </FloatingCard>

            <FloatingCard delay={1} className="right-0 top-0 rotate-12">
              <NetWorthCard />
            </FloatingCard>

            <FloatingCard delay={1} className="right-20 top-54 -rotate-6">
              <SpendingCard />
            </FloatingCard>
          </div>
  Floating Finance Cards - Ultra Premium     <video
    className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none"
    src="/landing/sunset.mp4"
    autoPlay
    loop
    muted
    playsInline
  />*/}


      <div className="relative z-10 mx-auto px-6 max-w-lg lg:max-w-lg xl:max-w-2xl text-center">
        {/* Heading */}
        <motion.h1
          {...fadeUp}
          transition={{ delay: 0.2 }}
          className="font-semibold tracking-tight leading-tight text-4xl md:text-4xl lg:text-4xl xl:text-6xl  "
        >
          Take Control of Your{" "}

         
          <span className="inline-block relative ">
          <TextRotate
            texts={[ 
              "Finances ✽",
              "Banks",
              "Crypto",
              "Subscriptions",
              "Budgets",
              "Goals",
            ]}
            mainClassName="text-white opacity-90 backdrop-blur-2xl px-2 sm:px-2 md:px-6  rounded-full overflow-hidden  justify-center py-0 antialiased bg-gradient-to-b from-orange-600/40 to-[hsl(24.86,71.54%,49.61%)]/95"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden "
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2200}
          />
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          {...fadeUp}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-4 max-w-lg text-sm sm:text-sm md:text-md lg:text-base text-muted-foreground"
        >
          Track, budget and plan every trasaction — with AI-powered
          alerts, smart insights, and real-time forecasting.
        </motion.p>
               {/* CTA */}
               <motion.div
          {...fadeUp}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center gap-4 flex-wrap"
        >
          <AvatarCircles numPeople={49} avatarUrls={[
  "https://avatars.githubusercontent.com/u/16860528",
  "https://avatars.githubusercontent.com/u/20110627",
  "https://avatars.githubusercontent.com/u/106103625",
  "https://avatars.githubusercontent.com/u/59228569",
]} />
       
        </motion.div>

        {/* CTA */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.6 }}
          className="mt-16 flex justify-center gap-3 flex-wrap"
        >
      {/*    <Button  >
            Get Started
          </Button>

          <Button
           
            variant="outline"
   
            icon={<SolarPlayCircleBoldDuotone className="w-5 h-5" />}
          >
            See Demo
          </Button> */}
           <WaitlistFormCompact />
        </motion.div>


        
       
      </div>
 
      {/* ============================================================= */}
      {/*        BACKGROUND ONLY BEHIND THE DASHBOARD PREVIEW           */}
      {/* ============================================================= */}

      <div className="relative pt-20">
        {/* FULL-WIDTH BACKGROUND JUST FOR DASHBOARD 
     
         
  <div
  className="absolute inset-0 pointer-events-none"
  style={{
    WebkitMaskImage:
      "radial-gradient(circle at center, white 40%, transparent 100%)",
    maskImage:
      "radial-gradient(circle at center, white 40%, transparent 100%)",
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
  }}
>
  <FlickeringGrid
    className="absolute inset-0 opacity-50"
    squareSize={8}
    gridGap={10}
    color="#E2653F"
    maxOpacity={0.5}
    flickerChance={0.1}
  />
</div>
     
     <Image
              src={'/landing/globe.avif'}
              alt={'askd'}
              width={1920}
              height={1200}
              quality={100}
              className="w-full rounded-2xl absolute bottom-0 left-0 right-0"
              priority
            />
<div
              className="absolute bottom-0 left-0 right-0 w-full h-[403px]"
              style={{
                background: "linear-gradient(to top, var(--background) 0%, rgba(217, 217, 217, 0) 100%)",
                zIndex: 10,
              }}
            />*/}



        {/* Dashboard Preview */}
        <ScrollReveal>
      {/*     <motion.div
            {...scaleIn}
            transition={{ delay: 0.3 }}
            className="relative mx-auto max-w-7xl  mt-10 pt-10 "
          >
  
                     
          <div className=" w-full relative  ">
            <MockupFrame>
              <Mockup type="responsive">
                <Image
                  src={imageSrc}
                  alt={DASHBOARD_IMAGES.alt}
                  width={1920}
                  height={1200}
                  className="w-full rounded-2xl"
                  priority
                />
              </Mockup>
            </MockupFrame>
            <div
              className="absolute bottom-0 left-0 right-0 w-full h-[303px]"
              style={{
                background: "linear-gradient(to top, var(--background) 0%, rgba(217, 217, 217, 0) 100%)",
                zIndex: 10,
              }}
            />
          </div> 
          </motion.div>
 */}

<Example bg={false} />
        </ScrollReveal>

      </div>

   
      
      {/* Features 
      <div className="mt-12 flex flex-wrap justify-center gap-4 ">
        {FEATURES.map(({ Icon, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + i * 0.12 }}
            className="flex items-center gap-2 bg-muted text-muted-foreground px-2 py-1 rounded-full backdrop-blur-md border border-border shadow-xs text-xs"
          >
            <Icon className="h-4 w-4 text-foreground/80" />
            <span className="font-medium">{label}</span>
          </motion.div>
        ))}
      </div>

<section className="relative mx-auto container">
       <h2 className="mb-5 text-center font-semibold text-foreground text-xl tracking-tight md:text-3xl">
          <span className="text-muted-foreground">Trusted by experts.</span>
          <br />
       
        </h2>
        <div className="mx-auto my-5 h-px max-w-lg bg-border [mask-image:linear-gradient(to_right,white,white,white)]" />

        <LogoCloud logos={logos} />

      <div className="mt-5 h-px bg-border [mask-image:linear-gradient(to_right,white,white,white)]" />
      </section>  */}

 {/* */}
    </section>
  );
}
// Reusable floating card with physics-like motion
function FloatingCard({ children, delay = 0, className = "" }: any) {
  return (
    <motion.div

      transition={{
        delay,
        duration: 0.4,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{
        y: -12,
        scale: 1.02,
        transition: { duration: 0.1 }
      }}
      whileTap={{ scale: 1 }}
      className={`absolute ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Crypto Allocation Widget - matches dashboard styling
function CryptoCard() {
  const TOKEN_COLORS = [
    'bg-orange-100 dark:bg-orange-600/5',
    'bg-blue-100 dark:bg-blue-600/25',
    'bg-green-100 dark:bg-green-600/25',
  ];

  const topTokens = [
    { symbol: 'BTC', name: 'Bitcoin', value: 89450, change24h: 12.4, logo: '₿' },
    { symbol: 'ETH', name: 'Ethereum', value: 38033, change24h: 8.2, logo: 'Ξ' },
    { symbol: 'SOL', name: 'Solana', value: 32875, change24h: 15.7, logo: 'S' },
  ];

  return (
    <Card className="w-80 rounded-xl border border-border/50 gap-4 flex flex-col p-3">
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-xl bg-amber-400 flex items-center justify-center">
            <SolarPieChart2BoldDuotone className="h-4.5 w-4.5 text-amber-900" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Crypto Allocation</h3>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {topTokens.map((token, index) => {
          const isPositive = token.change24h >= 0;
          const isFirstToken = index === 0;
          return (
            <div
              key={token.symbol}
              className={`rounded-lg p-3 cursor-pointer transition-all hover:shadow-sm ${TOKEN_COLORS[index % TOKEN_COLORS.length]} ${isFirstToken ? 'row-span-2' : ''}`}
              style={{
                minHeight: isFirstToken ? '140px' : '68px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-foreground">{token.symbol}</span>
                </div>
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <p className={`font-bold text-foreground ${isFirstToken ? 'text-base' : 'text-sm'}`}>
                  ${token.value.toLocaleString()}
                </p>
                <p className={`${isFirstToken ? 'text-xs' : 'text-[10px]'} text-muted-foreground mt-1`}>
                  {token.change24h > 0 ? '+' : ''}{token.change24h}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// Net Worth Widget - matches dashboard styling
function NetWorthCard() {
  const assets = 1650000;
  const liabilities = 365079;
  const netWorth = assets - liabilities;

  return (
    <Card className="w-80 rounded-xl border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border/40 mb-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-blue-500 flex items-center justify-center">
            <SolarChartSquareBoldDuotone className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Net Worth</h3>
            <p className="text-[10px] text-muted-foreground">Total balance</p>
          </div>
        </div>
      </div>

      <div className="px-3 pb-3 space-y-3">
        {/* Main Value */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Current Net Worth</p>
          <p className="text-2xl font-bold text-foreground">${netWorth.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            +$142,831 (+12.4% YTD)
          </p>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2">
            <p className="text-[10px] text-muted-foreground font-medium">Total Assets</p>
            <p className="text-sm font-bold text-foreground">${assets.toLocaleString()}</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2">
            <p className="text-[10px] text-muted-foreground font-medium">Liabilities</p>
            <p className="text-sm font-bold text-red-600 dark:text-red-400">-${liabilities.toLocaleString()}</p>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="h-12 rounded-lg bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-transparent flex items-end justify-around gap-1 px-2 pb-1">
          {[35, 48, 62, 78, 68, 90, 100, 85].map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm"
              style={{ height: `${height}%`, minHeight: '2px' }}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

// Subscriptions Widget - matches dashboard styling
function SubscriptionCard() {
  const subscriptions = [
    { name: 'Netflix', cost: 15.99, date: 'Renews in 2 days', status: 'upcoming', logo: getLogoUrl('netflix.com') },
    { name: 'Canva', cost: 9.99, date: 'Monthly plan', status: 'active',logo: getLogoUrl('canva.com') },
    { name: 'Adobe Cloud', cost: 54.99, date: 'Renews in 5 days', status: 'upcoming',logo: getLogoUrl('adobe.com') },
  ];

  const monthlySpend = subscriptions.reduce((sum, sub) => sum + sub.cost, 0);

  return (
    <Card className="w-80 rounded-xl border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between  border-b border-border/40 mb-2">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-violet-500 flex items-center justify-center">
            <SolarInboxInBoldDuotone className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Subscriptions</h3>
            <p className="text-[10px] text-muted-foreground">3 active</p>
          </div>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className=" space-y-1.5">
        {subscriptions.map((sub) => (
          <div
            key={sub.name}
            className="group flex items-center justify-between p-1  rounded-lg hover:bg-muted/60 cursor-pointer transition-all duration-75"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 font-bold text-xs">
                <Avatar>
                  <AvatarImage
                  src={sub.logo}
                  ></AvatarImage>

                </Avatar>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{sub.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{sub.date}</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-foreground flex-shrink-0">${sub.cost.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Footer - Monthly Total */}
      <div className="py-2 bg-muted/20 border-t border-border/40 flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-medium">Monthly spend</p>
        <p className="text-sm font-bold text-foreground">${monthlySpend.toFixed(2)}</p>
      </div>
    </Card>
  );
}

// Recent Activity Widget - matches dashboard styling
function SpendingCard() {
  const transactions = [

    { emoji: '☕', name: 'Starbucks', date: 'Today', amount: 6.49, isIncome: false, category: 'Food' },
    { emoji: '💰', name: 'Salary Deposit', date: 'Yesterday', amount: 4500, isIncome: true, category: 'Income' },
    { emoji: '🍕', name: 'Pizza Hut', date: '2 days ago', amount: 23.99, isIncome: false, category: 'Food' },
  ];

  return (
    <Card className="w-80 rounded-xl border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border/40 mb-2">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-amber-500 flex items-center justify-center">
            <SolarClipboardListBoldDuotone className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
            <p className="text-[10px] text-muted-foreground">Latest transactions</p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-3 pb-3 space-y-1.5">
        {transactions.map((tx, i) => (
          <div
            key={i}
            className="group flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/60 cursor-pointer transition-all duration-75"
          >
            <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 text-2xl">
              {tx.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{tx.name}</p>
              <p className="text-[10px] text-muted-foreground">{tx.date} • {tx.category}</p>
            </div>
            <p
              className={`text-sm font-semibold flex-shrink-0 ${
                tx.isIncome
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {tx.isIncome ? '+' : '-'}${tx.amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Insight Footer */}
      <div className="px-3 py-2 bg-emerald-500/10 border-t border-emerald-500/20">
        <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
          ↓ 22% less spending vs last month
        </p>
      </div>
    </Card>
  );
}
