"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

/* ------------------------------------------------------------------ */
/*   DATA (Replace with dynamic content if needed)                    */
/* ------------------------------------------------------------------ */

const founders = [
  "/landing/hero-light2.JPG",
  "/landing/hero-light4.JPG",
  "/landing/hero-light3.JPG",
];

const slides = [
  {
    id: 1,
    src:  "/landing/hero-light2.JPG",
    alt: "A mobile app for tracking your calories and achieving your fitness goals.",
  },
  {
    id: 2,
    src: "/landing/hero-light4.JPG",
    alt: "An app for tracking your sleep and improving your sleep quality.",
  },
  {
    id: 3,
    src: "/landing/hero-light4.JPG",
    alt: "A budgeting and finance tracking mobile app template.",
  },
];

/* ------------------------------------------------------------------ */
/*   MAIN SHOWCASE SECTION                                            */
/* ------------------------------------------------------------------ */

export default function SleekHeroShowcase() {
  return (
    <div className="hidden lg:block h-full flex-1 overflow-hidden p-6">
      <div className="relative flex h-full flex-col items-center justify-center gap-10 rounded-lg bg-primary/20 overflow-hidden">
        

        {/* ------------------------------------------------------------------ */}
        {/*                             CAROUSEL                               */}
        {/* ------------------------------------------------------------------ */}
        <div className="relative w-full max-w-full px-4 overflow-hidden">
          <HeroCarousel slides={slides} />
        </div>
      </div>
    </div>
  );
}

/* ======================================================================== */
/*                       CAROUSEL COMPONENT                                 */
/* ======================================================================== */

function HeroCarousel({
  slides,
}: {
  slides: { id: number; src: string; alt: string }[];
}) {
  const [index, setIndex] = React.useState(0);

  // move every 3.5 sec
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative h-[230px] sm:h-[260px] md:h-[300px] lg:h-[320px] w-full flex items-center justify-center">
      <AnimatePresence initial={false}>
        {slides.map((slide, i) => {
          const isActive = i === index;
          const prev = (index - 1 + slides.length) % slides.length;
          const next = (index + 1) % slides.length;

          const position =
            i === index ? "center" : i === prev ? "left" : i === next ? "right" : "hidden";

          // transform based on state
          const scale = isActive ? 1 : 0.85;
          const opacity = isActive ? 1 : 0.35;
          const zIndex = isActive ? 20 : 10;
          const x =
            position === "center"
              ? "0%"
              : position === "left"
              ? "-65%"
              : position === "right"
              ? "65%"
              : "120%";

          return (
            position !== "hidden" && (
              <motion.div
                key={slide.id}
                className="absolute w-[70%] sm:w-[55%] md:w-[45%] lg:w-[40%]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity, scale, x }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.65,
                  ease: "easeInOut",
                }}
                style={{ zIndex }}
              >
                <div className="relative overflow-hidden rounded-2xl p-2 bg-input dark:bg-card shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-all">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    width={600}
                    height={350}
                    className="w-full h-full rounded-xl object-cover"
                  />
                </div>
              </motion.div>
            )
          );
        })}
      </AnimatePresence>
    </div>
  );
}
