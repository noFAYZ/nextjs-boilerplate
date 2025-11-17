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

import { FlickeringGrid } from "../bg/FlickeringGrid";
import { WaitlistFormCompact } from "@/components/coming-soon/waitlist-form-compact";

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

  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      {/* ============================================================= */}
      {/*                     TOP HEADLINE AREA (NO BG)                */}
      {/* ============================================================= */}

      <div className="relative z-10 mx-auto px-6 max-w-3xl text-center">
        {/* Heading */}
        <motion.h1
          {...fadeUp}
          transition={{ delay: 0.2 }}
          className="font-bold tracking-tight leading-tight text-5xl md:text-6xl lg:text-7xl"
        >
          Take Control of Your{" "}
          <span className="inline-block relative">
            <RotatingHeadline />
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          {...fadeUp}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-muted-foreground"
        >
          Track, manage and predict every recurring payment — with AI-powered
          alerts, smart insights, and real-time spend forecasting.
        </motion.p>

               {/* CTA 
               <motion.div
          {...fadeUp}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center gap-4 flex-wrap"
        >
          
       
        </motion.div>*/}

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

      <div className="relative mx-auto container">
        {/* FULL-WIDTH BACKGROUND JUST FOR DASHBOARD */}
     
         
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
     

        {/* Dashboard Preview */}
        <ScrollReveal>
          <motion.div
            {...scaleIn}
            transition={{ delay: 0.75 }}
            className="relative mx-auto max-w-7xl  mt-10 pt-20 "
          >
            {/* Dashboard Container */}
            <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-muted backdrop-blur-xl shadow-[0_10px_45px_rgba(0,0,0,0.28)]">
              {/* Browser frame */}
              <div className="flex items-center gap-2 border-b border-border/60 bg-background/30 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>

              <div className="relative aspect-[13.7/9] w-full bg-background/20">
                <Image
                  src={imageSrc}
                  alt={DASHBOARD_IMAGES.alt}
                  fill
                  priority
                  className="object-cover object-top"
                />
              </div>
            </div>
          </motion.div>
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
