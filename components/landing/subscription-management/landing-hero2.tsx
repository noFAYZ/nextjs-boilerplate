"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WaitlistFormCompact } from "@/components/coming-soon/waitlist-form-compact";
import { TextRotate } from "../section-widgets/text-rotate";
import { BgGradient } from "../bg/bg-gradient";
import { LogoCloud } from "./logo-cld-section";
import { SolarShieldBoldDuotone, SolarClockCircleBoldDuotone, DuoIconsCreditCard, SolarChartSquareBoldDuotone } from "@/components/icons/icons";
import { GooeyIndicator } from "@/components/ui/goey-indicator";

const TABS = ["Track", "Budget", "Plan", "Collab"] as const;

export function LandingHero() {
  const reduceMotion = useReducedMotion();

  const fadeUp = {
    initial: { opacity: 0, y: reduceMotion ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: reduceMotion ? 1 : 0.96 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
  };

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
  const FEATURES = [
    { Icon: SolarShieldBoldDuotone, label: "Bank-Level Encryption" },
    { Icon: SolarClockCircleBoldDuotone, label: "Instant Alerts" },
    { Icon: DuoIconsCreditCard, label: "Smart Spend Insights" },
    { Icon: SolarChartSquareBoldDuotone, label: "Predictive Analytics" },
  ] as const;
  

  return (
    <section className="relative min-h-screen overflow-hidden">


      {/* Background */}
      <div className="absolute inset-0 -z-10  ">
        <BgGradient
    
          imageSrc="/landing/bg8.webp"  
          opacity="0.3"
          position="top"
          to="background"
          
  
          glass
        
       
      
        
  
        />
      </div>

      {/* Edge fades */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-62 opacity-80 bg-gradient-to-b from-background  via-background/40 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-42 bg-gradient-to-t from-background via-background to-transparent z-10" />

      {/* Main container */}
      <div className="relative mx-auto flex min-h-screen  flex-col  xl:flex-row xl:items-end  justify-between px-2 xl:px-8 pt-30">
        
        {/* LEFT — Copy */}
        <div className="flex flex-col items-center text-center xl:items-start xl:text-left pb-20 xl:pb-30 ">

          <motion.h1
            {...fadeUp}
            className="max-w-sm lg:max-w-md xl:max-w-lg text-4xl font-bold leading-tight text-white   xl:text-4xl  2xl:text-5xl"
          >
           Take Control of Your{" "}
            <span className="inline-block">
            <TextRotate
                texts={[
                  "Finances ✽",
                  "Banks",
                  "Crypto",
                  "Subscriptions",
                  "Budgets",
                  "Goals",
                ]}
                rotationInterval={2200}
                mainClassName="text-white opacity-90 backdrop-blur-2xl px-2 sm:px-2 md:px-4  rounded-lg overflow-hidden  justify-center py-0 antialiased bg-gradient-to-b from-primary/40 to-[hsl(24.86,71.54%,49.61%)]/95"
                staggerFrom={"last"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden "
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
    
              />
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-md text-base leading-tight xl:text-white/80 sm:text-base font-semibold rounded-lg text-black "
          >
            Track, budget, and plan every transaction with AI-powered alerts,
            smart insights, and real-time forecasting.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ delay: 0.3 }}
            className="mt-10 w-full max-w-xs"
          >
            <WaitlistFormCompact />
          </motion.div>
        </div>

        {/* RIGHT — Tabs + Preview */}
        <motion.div {...fadeUp} className=" min-w-full   xl:min-w-4xl 2xl:min-w-5xl h-full flex flex-col justify-end  ">
       <Tabs defaultValue="Track" className="w-full flex justify-center xl:justify-start">
            {/* Tabs header */}
            <div className="  flex justify-center xl:justify-start">
              <TabsList className="rounded-lg border border-white/10 bg-black/60 p-1.5 backdrop-blur-xl">
                {TABS.map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="rounded-md px-2 py-1 text-sm font-semibold text-white/70 transition data-[state=active]:bg-muted data-[state=active]:text-foreground"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Preview */}
            <div className="relative mx-auto w-full  overflow-hidden rounded-xl">
              <div className="relative aspect-[18/10] h-full">
                {TABS.map((tab) => (
                  <TabsContent
                    key={tab}
                    value={tab}
                    forceMount
                    className="data-[state=inactive]:pointer-events-none data-[state=inactive]:opacity-0 data-[state=active]:opacity-100 transition-opacity duration-300"
                  >
                    <DashboardImage src="/landing/hero-dark2.JPG" />
                  </TabsContent>
                ))}
              </div>
            </div>
          </Tabs>
        </motion.div>
      </div>

  
      {/* Features */}
      <div className=" flex flex-wrap justify-center gap-4 z-50">
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background via background/80 to-transparent z-10" />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-background via background/80 to-transparent z-10" />
        <LogoCloud logos={logos} className="z-10 " />

      </div>

  
    </section>
  );
}

function DashboardImage({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt="Dashboard preview"
      fill
      priority
      quality={100}
      className="object-fill"
    />
  );
}
