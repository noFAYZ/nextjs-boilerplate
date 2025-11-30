"use client";

import { DuoIconsBank, PhSparkleDuotone, SolarInboxInBoldDuotone } from "@/components/icons/icons";
import { useScroll, useTransform, motion } from "framer-motion";
import { Bitcoin } from "lucide-react";
import { useRef, useState } from "react";

export default function FinanceHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const maskImage = useTransform(progress, (value) =>
    `linear-gradient(to bottom, black ${value * 100 + 50}%, transparent ${value * 100 + 150}%)`
  );
  const y = useTransform(progress, [0, 1], [50, 0]);

  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-b from-background to-background/95 px-6 sm:px-12 lg:px-24 py-24 sm:py-32 lg:py-40 xl:py-48"
    >
    

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Hero Text */}
        <motion.div style={{ maskImage, y }} className="mx-auto max-w-xl space-y-6">
          <h1 className="max-w-md mx-auto text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-4xl font-semibold text-foreground">
            Finance isn’t about{" "}
            <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              tracking money
            </span>
            .
          </h1>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-bold text-foreground/90">
            It’s about{" "}
            <span className="relative inline-block">
              mastering it
            </span>
            .
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl   text-muted-foreground max-w-3xl mx-auto tracking-tight space-y-1">
            One dashboard for{" "}
            <FeatureBadge
              icon={Bitcoin}
              label="Crypto"
              color="text-orange-500"
              bg="bg-orange-400"
              glow="text-orange-500"
              onHover={() => setHoveredBadge("crypto")}
              onLeave={() => setHoveredBadge(null)}
            />{" "}
            <FeatureBadge
              icon={DuoIconsBank}
              label="Net worth"
              color="text-green-800"
              bg="bg-lime-700"
              glow="text-emerald-400"
              onHover={() => setHoveredBadge("networth")}
              onLeave={() => setHoveredBadge(null)}
            />{" "}
            and{" "}
            <FeatureBadge
              icon={SolarInboxInBoldDuotone}
              label="Subscriptions"
              color="text-violet-600"
              bg="bg-violet-500"
              glow="text-violet-500"
              onHover={() => setHoveredBadge("subscriptions")}
              onLeave={() => setHoveredBadge(null)}
            />
            .
          </p>

          <p className="mt-2 text-base sm:text-lg md:text-xl lg:text-xl text-muted-foreground/80 leading-relaxed sm:leading-normal">
            Track. Optimize. Grow. <br />
            Real-time insights. Crypto-native intelligence. <br />
            Make smarter decisions. Take control. Stay ahead.
          </p>
        </motion.div>

        {/* Floating cards above badges */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          {hoveredBadge === "crypto" && (
            <FloatingCard x={0} y={-140}>
              <LiveCryptoCard />
            </FloatingCard>
          )}
          {hoveredBadge === "networth" && (
            <FloatingCard x={0} y={-140}>
              <LiveNetWorthCard />
            </FloatingCard>
          )}
          {hoveredBadge === "subscriptions" && (
            <FloatingCard x={0} y={-140}>
              <LiveSubscriptionCard />
            </FloatingCard>
          )}
        </div>
      </div>
    </section>
  );
}

// Feature Badge
interface FeatureBadgeProps {
  icon: React.ElementType;
  label: string;
  color?: string;
  bg?: string;
  glow?: string;
  onHover?: () => void;
  onLeave?: () => void;
  tooltip?: string;
}

export function FeatureBadge({
  icon: Icon,
  label,
  color = "text-white",
  bg = "bg-primary/20",
  glow = "text-primary",
  onHover,
  onLeave,
  tooltip,
}: FeatureBadgeProps) {
  const random = (min: number, max: number) => Math.random() * (max - min) + min;

  return (
    <motion.span
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
  
      className="group relative inline-flex items-center gap-1 text-xl px-1 py-0.5 pr-2 rounded-full font-medium cursor-pointer border border-border/60 bg-card dark:bg-muted/80 text-foreground/80 shadow-md transition-all duration-0 focus:outline-none focus:ring-0"
      role="button"
      tabIndex={0}
      aria-label={label}
      title={tooltip}
    >
      <motion.span
        className={`inline-flex items-center justify-center p-1 rounded-full ${bg}`}
        whileHover={{ rotate: 15 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Icon className={`w-6 h-6 text-white`} strokeWidth={2.5} />
      </motion.span>
      <span className="relative z-10">{label}</span>
    </motion.span>
  );
}

// Floating Card animation
function FloatingCard({ children, x = 0, y = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: y + 20 }}
      animate={{ opacity: 1, y }}
      exit={{ opacity: 0, y: y + 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ x }}
      className="absolute left-1/2 -translate-x-1/2 z-30"
    >
      {children}
    </motion.div>
  );
}

// Background dots + gradient
function BackgroundDots() {
  return (
    <div className="absolute inset-0 -z-10">
      <svg className="w-full h-full text-border/20" width="100%" height="100%">
        <defs>
          <pattern id="dots-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots-pattern)" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-transparent pointer-events-none" />
    </div>
  );
}

// Live Cards
const LiveCryptoCard = () => (
  <div className="w-72 sm:w-80 p-5 sm:p-6 bg-card/95 backdrop-blur-xl border border-border/30 rounded-3xl shadow-2xl">
    <div className="flex justify-between items-center">
      <h4 className="font-semibold text-lg">Crypto Portfolio</h4>
      <span className="text-emerald-500 font-medium text-sm sm:text-base">+18.4%</span>
    </div>
    <p className="mt-4 text-3xl sm:text-4xl font-bold">$142,381</p>
    <div className="mt-4 h-16 sm:h-20 rounded-xl bg-gradient-to-r from-orange-500/30 via-transparent to-transparent" />
  </div>
);

const LiveNetWorthCard = () => (
  <div className="w-72 sm:w-80 p-5 sm:p-6 bg-gradient-to-br from-emerald-500/10 to-transparent border border-border/30 backdrop-blur-xl rounded-3xl shadow-2xl">
    <h4 className="font-semibold text-emerald-600 text-base sm:text-lg">Net Worth</h4>
    <p className="mt-3 text-4xl sm:text-5xl font-bold">$1.28M</p>
    <p className="mt-2 text-emerald-500 text-sm sm:text-base">+42.8% all time</p>
  </div>
);

const LiveSubscriptionCard = () => (
  <div className="w-64 sm:w-72 p-4 sm:p-5 bg-card/95 backdrop-blur-xl border border-border/30 rounded-3xl shadow-xl">
    <p className="text-xs sm:text-sm text-muted-foreground">Next renewal</p>
    <p className="mt-2 text-xl sm:text-2xl font-bold">Netflix</p>
    <p className="text-orange-500 text-xs sm:text-sm">in 3 days • $15.99</p>
  </div>
);
