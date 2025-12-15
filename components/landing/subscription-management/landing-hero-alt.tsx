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
  SolarPlayCircleBoldDuotone,
  SolarShieldBoldDuotone,
} from "@/components/icons/icons";

const FEATURES = [
  {
    Icon: SolarShieldBoldDuotone,
    label: "Bank-Level Encryption",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    Icon: SolarClockCircleBoldDuotone,
    label: "Instant Alerts",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    Icon: DuoIconsCreditCard,
    label: "Smart Spend Insights",
    color: "text-orange-600 dark:text-orange-400",
  },

] as const;

const DASHBOARD_IMAGES = {
  light: "/landing/subscription-management.PNG",
  dark: "/landing/subscription-management-dark.PNG",
  alt: "AI-powered dashboard showing subscription tracking and analytics",
} as const;

export function LandingHeroAlt() {
  const { resolvedTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  const theme = resolvedTheme?.startsWith("dark") ? "dark" : "light";
  const imageSrc = DASHBOARD_IMAGES[theme];

  const fadeInUp = (delay = 0) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.6, ease: "easeOut" },
  });

  const scaleIn = {
    initial: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.8, ease: "easeOut" },
  };

  return (
    <section
      className={cn(
        "relative overflow-hidden flex items-center justify-center min-h-[90vh] sm:min-h-[100vh]",
        "bg-gradient-to-b from-background via-background/80 to-background"
      )}
      aria-labelledby="hero-heading"
    >

      <div className="mx-auto max-w-7xl px-6 md:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-10 lg:gap-16 items-center">
          {/* === LEFT CONTENT === */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left relative z-10">
            <motion.h1
              id="hero-heading"
              {...fadeInUp(0.1)}
              className={cn(
                "text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight",
                "bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60"
              )}
            >
              Take Control of Your{" "}
              <span className="inline-block align-middle">
                <RotatingHeadline />
              </span>
            </motion.h1>

            <motion.p
              {...fadeInUp(0.3)}
              className="mt-5 max-w-lg text-sm  text-muted-foreground leading-relaxed"
            >
              Gain visibility into your business expenses and automate your
              financial insights with AI — predict, prevent, and optimize every
              recurring payment with enterprise-grade intelligence.
            </motion.p>

            <motion.div
              {...fadeInUp(0.5)}
              className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center lg:justify-start"
            >
              <Button className="w-full sm:w-auto font-semibold ">
                Get Started
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto font-semibold "
                icon={<SolarPlayCircleBoldDuotone className="w-6 h-6" />}
              >
                See Demo
              </Button>
            </motion.div>


            <motion.div
              {...fadeInUp(0.9)}
              className="mt-8 flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 text-xs sm:text-sm text-muted-foreground/80"
            >
              {FEATURES.map(({ Icon, label, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="flex items-center gap-1 rounded-full bg-muted/40 px-2 py-1 backdrop-blur-md border border-border shadow-xs text-xs"
                >
                  <Icon className={cn("h-4 w-4", color)} />
                  <span className="font-medium">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* === RIGHT BANNER === */}
          <ScrollReveal>
            <motion.div
              {...scaleIn}
              className="relative w-full max-w-[900px] mx-auto lg:mx-0"
            >
              <div className="overflow-hidden rounded-3xl border border-border/60 bg-background/70 shadow-2xl backdrop-blur-2xl">
                {/* Browser mockup header */}
                <div className="flex items-center gap-2 border-b border-border/50 bg-muted/30 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <span className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="ml-4 flex-1 truncate rounded bg-background/50 px-3 py-1 text-xs text-muted-foreground">
                    dashboard.enterprise.ai
                  </div>
                </div>

                <div className="relative aspect-[16/9] sm:aspect-[16/8] bg-muted/20">
                  <Image
                    src={imageSrc}
                    alt={DASHBOARD_IMAGES.alt}
                    fill
                    priority
                    className="object-cover object-top transition-transform duration-700 hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 700px"
                    quality={95}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                </div>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
