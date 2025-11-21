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

         {/* Floating Finance Cards - Ultra Premium */}
         <div className="relative  hidden lg:block">
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
          </div>

      <div className="relative z-10 mx-auto px-6 max-w-2xl lg:max-w-3xl text-center">
        {/* Heading */}
        <motion.h1
          {...fadeUp}
          transition={{ delay: 0.2 }}
          className="font-semibold tracking-tight leading-snug text-4xl md:text-4xl lg:text-5xl xl:text-6xl"
        >
          Take Control of Your{" "}

         
          <span className="inline-block relative">
          <TextRotate
            texts={[ 
              "Finances ✽",
              "Banks",
              "Crypto",
              "Subscriptions",
              "Budgets",
              "Goals",
            ]}
            mainClassName="text-white px-2 sm:px-2 md:px-6  bg-gradient-to-br from-[#FFB347] via-[#FF7A00] to-[#E66A00] overflow-hidden  justify-center rounded-2xl py-0"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden "
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={3000}
          />
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          {...fadeUp}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-6 max-w-xl text-sm sm:text-sm md:text-md lg:text-lg text-muted-foreground"
        >
          Track, manage and predict every recurring payment — with AI-powered
          alerts, smart insights, and real-time spend forecasting.
        </motion.p>

               {/* CTA */}
               <motion.div
          {...fadeUp}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center gap-4 flex-wrap"
        >
          <AvatarCircles numPeople={99} avatarUrls={[
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
          <Button  >
            Get Started
          </Button>

          <Button
           
            variant="outline"
   
            icon={<SolarPlayCircleBoldDuotone className="w-5 h-5" />}
          >
            See Demo
          </Button>
        </motion.div>


        
       
      </div>

      {/* ============================================================= */}
      {/*        BACKGROUND ONLY BEHIND THE DASHBOARD PREVIEW           */}
      {/* ============================================================= */}

      <div className="relative pt-10">
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
  <Example/>

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

<section className="relative mx-auto container">
      {/*   <h2 className="mb-5 text-center font-semibold text-foreground text-xl tracking-tight md:text-3xl">
          <span className="text-muted-foreground">Trusted by experts.</span>
          <br />
       
        </h2>
        <div className="mx-auto my-5 h-px max-w-lg bg-border [mask-image:linear-gradient(to_right,transparent,black,transparent)]" /> */}

        <LogoCloud logos={logos} />

        {/* <div className="mt-5 h-px bg-border [mask-image:linear-gradient(to_right,transparent,black,transparent)]" /> */}
      </section>
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

// Mini live cards
function CryptoCard() {
  return (
    <div className="w-72 overflow-hidden rounded-2xl border bg-card/90 shadow-2xl backdrop-blur-xl">
      <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-4 text-white">
        <p className="text-sm opacity-90">Crypto Portfolio</p>
        <p className="text-3xl font-bold">$127,483</p>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Bitcoin</span>
          <span className="text-emerald-500 font-semibold">+$4,231 (12.4%)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Ethereum</span>
          <span className="text-emerald-500 font-semibold">+$892 (8.1%)</span>
        </div>
      </div>
    </div>
  );
}

function NetWorthCard() {
  return (
    <div className="w-80 rounded-2xl border bg-card/95 p-6 shadow-2xl backdrop-blur-xl">
      <p className="text-sm text-muted-foreground">Net Worth</p>
      <p className="mt-2 text-4xl font-bold">$1,284,921</p>
      <p className="mt-2 text-emerald-500">+42.8% all time</p>
      <div className="mt-6 h-24 rounded-xl bg-gradient-to-r from-emerald-500/20 to-transparent" />
    </div>
  );
}

function SubscriptionCard() {
  return (
    <div className="w-64 rounded-2xl border bg-card/90 p-5 shadow-xl shadow-2xl backdrop-blur-xl">
      <p className="text-sm font-medium">Upcoming Bills</p>
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-red-500/20 p-1">
              <span className="text-xs">N</span>
            </div>
            <span className="text-sm">Netflix</span>
          </div>
          <span className="text-sm font-medium">$15.99</span>
        </div>
        <div className="text-xs text-orange-500">Renews in 3 days</div>
      </div>
    </div>
  );
}

function SpendingCard() {
  return (
    <div className="w-72 rounded-2xl border bg-card/90 p-6 shadow-2xl backdrop-blur-xl">
      <p className="text-sm text-muted-foreground">This Month</p>
      <p className="mt-2 text-3xl font-bold">$4,821</p>
      <p className="text-sm text-emerald-500">↓ 18% vs last month</p>
    </div>
  );
}
