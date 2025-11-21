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
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      {/* ============================================================= */}
      {/*                     TOP HEADLINE AREA (NO BG)                */}
      {/* ============================================================= */}

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

      <div className="relative py-10">
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

      {/* Features */}
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
    </section>
  );
}
