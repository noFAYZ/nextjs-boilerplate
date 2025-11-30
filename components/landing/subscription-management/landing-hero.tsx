"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { ScrollReveal } from "../scroll-reveal";
import { RotatingHeadline } from "@/components/ui/RotatingWords";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

         {/* Floating Finance Cards - Ultra Premium 
         <div className="relative -z-40 hidden lg:block">
            <FloatingCard delay={0} className="left-10 top-10 -rotate-12">
              <CryptoCard />
            </FloatingCard>

            <FloatingCard delay={0.5} className="left-left-4 top-64 rotate-6">
              <SubscriptionCard />
            </FloatingCard>

            <FloatingCard delay={1} className="right-20 top-20 rotate-12">
              <NetWorthCard />
            </FloatingCard>

            <FloatingCard delay={1.5} className="right-10 top-80 -rotate-6">
              <SpendingCard />
            </FloatingCard>
          </div>*/}

      <div className="relative z-10 mx-auto px-6 max-w-lg lg:max-w-2xl text-center">
        {/* Heading */}
        <motion.h1
          {...fadeUp}
          transition={{ delay: 0.2 }}
          className="font-bold tracking-tight leading-tight text-4xl md:text-4xl lg:text-4xl xl:text-5xl"
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
            mainClassName="text-orange-500 px-2 sm:px-2 md:px-6  bg-none overflow-hidden  justify-center rounded-lg py-0 "
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
          className="mx-auto mt-6 max-w-lg text-sm sm:text-sm md:text-md lg:text-base text-muted-foreground"
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
          className="mt-8 flex justify-center gap-4 flex-wrap"
        >
        {/*   <Button  >
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
</div>*/}
     

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
      </div> */}

 {/*<section className="relative mx-auto container">
       <h2 className="mb-5 text-center font-semibold text-foreground text-xl tracking-tight md:text-3xl">
          <span className="text-muted-foreground">Trusted by experts.</span>
          <br />
       
        </h2>
        <div className="mx-auto my-5 h-px max-w-lg bg-border [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />

        <LogoCloud logos={logos} />

       <div className="mt-5 h-px bg-border [mask-image:linear-gradient(to_right,transparent,black,transparent)]" /> 
      </section> */} 
    </section>
  );
}
// Reusable floating card with physics-like motion
function FloatingCard({ children, delay = 0, className = "" }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100, rotate: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 1, type: "spring", stiffness: 80 }}
      whileHover={{ y: -10, rotate: 0 }}
      className={`absolute ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Mini live cards matching actual dashboard widgets
function CryptoCard() {
  return (
    <div className="w-80 overflow-hidden rounded-xl border border-border/50 bg-card shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-xl bg-purple-300 flex items-center justify-center">
            <SolarWalletMoneyBoldDuotone className="h-4 w-4 text-purple-900" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Crypto Portfolio</h3>
        </div>
        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">+12.4%</span>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-muted/30 border border-border/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <span className="text-lg font-bold">₿</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Bitcoin</p>
              <p className="text-xs text-muted-foreground">2.45 BTC</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">+$4,231</p>
            <p className="text-xs text-muted-foreground">$89,450</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-muted/30 border border-border/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <span className="text-lg font-bold">Ξ</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Ethereum</p>
              <p className="text-xs text-muted-foreground">15.8 ETH</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">+$892</p>
            <p className="text-xs text-muted-foreground">$38,033</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NetWorthCard() {
  return (
    <div className="w-80 rounded-xl border border-border/50 bg-card/95 p-5 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-6 rounded-xl bg-blue-300 flex items-center justify-center">
          <SolarChartSquareBoldDuotone className="h-4 w-4 text-blue-900" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Net Worth</h3>
      </div>
      
      {/* Main Value */}
      <div className="mb-4">
        <p className="text-4xl font-bold">$1,284,921</p>
        <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
          +$142,831 (+42.8%) all time
        </p>
      </div>
      
      {/* Mini Chart */}
      <div className="h-20 rounded-lg bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-full flex items-end justify-around gap-1 px-2 pb-2">
          <div className="w-full h-[40%] bg-emerald-500/30 rounded-t"></div>
          <div className="w-full h-[55%] bg-emerald-500/40 rounded-t"></div>
          <div className="w-full h-[70%] bg-emerald-500/50 rounded-t"></div>
          <div className="w-full h-[85%] bg-emerald-500/60 rounded-t"></div>
          <div className="w-full h-[100%] bg-emerald-500/70 rounded-t"></div>
        </div>
      </div>
    </div>
  );
}

function SubscriptionCard() {
  return (
    <div className="w-72 rounded-xl border border-border/50 bg-card shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-xl bg-violet-300 flex items-center justify-center">
            <SolarInboxInBoldDuotone className="h-4 w-4 text-violet-900" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Subscriptions</h3>
        </div>
        <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">3 upcoming</span>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-muted/30 border border-border/80 hover:bg-muted/40 transition-all">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-border/50">
              <span className="text-lg font-bold text-red-600">N</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Netflix</p>
              <p className="text-xs text-orange-600 dark:text-orange-400">Renews in 3 days</p>
            </div>
          </div>
          <p className="text-sm font-bold">$15.99</p>
        </div>
        
        <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-muted/30 border border-border/80 hover:bg-muted/40 transition-all">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center border border-border/50">
              <span className="text-lg font-bold text-green-600">S</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Spotify</p>
              <p className="text-xs text-muted-foreground">Monthly</p>
            </div>
          </div>
          <p className="text-sm font-bold">$9.99</p>
        </div>
      </div>
    </div>
  );
}

function SpendingCard() {
  return (
    <div className="w-80 rounded-xl border border-border/50 bg-card/95 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-xl bg-amber-400 flex items-center justify-center">
            <SolarClipboardListBoldDuotone className="h-4.5 w-4.5 text-amber-900" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center border border-border/50">
              <span className="text-xl">🛒</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Amazon Purchase</p>
              <p className="text-xs text-muted-foreground">Today • Shopping</p>
            </div>
          </div>
          <p className="text-sm font-bold text-red-700 dark:text-red-500">-$127.50</p>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center border border-border/50">
              <span className="text-xl">💰</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Salary Deposit</p>
              <p className="text-xs text-muted-foreground">Yesterday • Income</p>
            </div>
          </div>
          <p className="text-sm font-bold text-green-700 dark:text-green-500">+$4,500</p>
        </div>
        
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            ↓ 18% less spending vs last month
          </p>
        </div>
      </div>
    </div>
  );
}
