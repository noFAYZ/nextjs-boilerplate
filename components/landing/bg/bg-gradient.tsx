"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { type HTMLAttributes, useMemo, useEffect, useState } from "react";
import { useReducedMotion, motion, AnimatePresence } from "framer-motion";
import { GooeyIndicator } from "@/components/ui/goey-indicator";

interface GalleryImage {
  src: string;
  opacity?: number;
  position?: string;
  size?: "cover" | "contain";
}

interface BgGradientProps extends HTMLAttributes<HTMLDivElement> {
  size?: string;
  position?: string;
  from?: string;
  to?: string;
  via?: string;
  fromOpacity?: string;
  opacity?: string;
  blur?: string;
  animated?: boolean;
  animationType?: "float" | "spin" | "pulse";
  shape?: "radial" | "linear" | "conic";

  imageSrc?: string;
  imageOpacity?: number;
  imagePosition?: string;
  imageSize?: "cover" | "contain";

  /** Gallery */
  gallery?: GalleryImage[];
  galleryIndex?: number;
  autoRotate?: boolean;
  rotateInterval?: number;

  /** Indicator */
  showIndicator?: boolean;
  indicatorPosition?: "bottom" | "top" | "center";

  /** Glass */
  glass?: boolean;
  glassBlur?: number;
  glassOpacity?: number;
  glassTint?: string;
  glassBorderOpacity?: number;
  glassNoise?: number;
}

export const BgGradient = ({
  className,
  size = "150% 150%",
  position = "center",
  from = "transparent",
  to = "#C46047",
  via,
  fromOpacity = "0%",
  opacity = "0.45",
  blur = "blur(120px)",
  animated = false,
  animationType = "float",
  shape = "radial",

  imageSrc,
  imageOpacity = 0.25,
  imagePosition = "center",
  imageSize = "cover",

  gallery,
  galleryIndex,
  autoRotate = false,
  rotateInterval = 4000,

  showIndicator = false,
  indicatorPosition = "bottom",

  glass = false,
  glassBlur = 18,
  glassOpacity = 0.25,
  glassTint = "rgba(255,255,255,0.4)",
  glassBorderOpacity = 0.25,
  glassNoise = 0.04,

  ...props
}: BgGradientProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [internalIndex, setInternalIndex] = useState(0);

  const activeIndex = galleryIndex ?? internalIndex;
  const activeImage = gallery?.[activeIndex];

  useEffect(() => {
    if (!gallery || !autoRotate || prefersReducedMotion) return;
    const id = setInterval(
      () => setInternalIndex((i) => (i + 1) % gallery.length),
      rotateInterval
    );
    return () => clearInterval(id);
  }, [gallery, autoRotate, rotateInterval, prefersReducedMotion]);

  const gradientStops = useMemo(() => {
    return via
      ? `${from} ${fromOpacity}, ${via} 40%, ${to} 80%`
      : `${from} ${fromOpacity}, ${to} 100%`;
  }, [from, via, to, fromOpacity]);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        animated &&
          !prefersReducedMotion &&
          animationType === "float" &&
          "animate-float",
        animated &&
          !prefersReducedMotion &&
          animationType === "spin" &&
          "animate-spin-slow",
        animated &&
          !prefersReducedMotion &&
          animationType === "pulse" &&
          "animate-pulse-slow",
        className
      )}
      {...props}
    >
      {/* Gallery / Image */}
      <AnimatePresence mode="wait">
        {(activeImage || imageSrc) && !prefersReducedMotion && (
          <motion.div
            key={activeImage?.src ?? imageSrc}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              opacity: activeImage?.opacity ?? imageOpacity,
            }}
          >
            <Image
              src={activeImage?.src ?? imageSrc!}
              alt=""
              fill
              sizes="100vw"
              quality={75}
              className={
                (activeImage?.size ?? imageSize) === "cover"
                  ? "object-cover"
                  : "object-contain"
              }
              style={{
                objectPosition:
                  activeImage?.position ?? imagePosition,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient */}
      <div
        className={cn("absolute inset-0", blur)}
        style={{
          background:
            shape === "radial"
              ? `radial-gradient(circle at ${position}, ${gradientStops})`
              : shape === "linear"
              ? `linear-gradient(to bottom right, ${gradientStops})`
              : `conic-gradient(from 0deg at center, ${gradientStops})`,
          backgroundSize: size,
          opacity,
        }}
      />

      {/* Glass overlay */}
      {glass && (
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${glassBlur}px)`,
            WebkitBackdropFilter: `blur(${glassBlur}px)`,
            background: glassTint,
            opacity: glassOpacity,
            boxShadow: `inset 0 0 0 1px rgba(255,255,255,${glassBorderOpacity})`,
          }}
        >
          {glassNoise > 0 && (
            <div
              className="absolute inset-0"
              style={{
                opacity: glassNoise,
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
            />
          )}
        </div>
      )}

      {/* Indicator */}
      {showIndicator && gallery && (
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2",
            indicatorPosition === "bottom" && "bottom-6",
            indicatorPosition === "top" && "top-6",
            indicatorPosition === "center" &&
              "top-1/2 -translate-y-1/2"
          )}
        >
          <GooeyIndicator
            current={activeIndex }
            total={gallery.length}
          />
        </div>
      )}
    </div>
  );
};
