"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { type HTMLAttributes, useMemo } from "react";
import { useReducedMotion } from "framer-motion";

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

  pattern?: boolean;
  patternColor?: string;
  patternType?: "dots" | "grid" | "diagonal" | "cross" | "wave" | "custom";
  customPatternSVG?: string;
  patternSize?: number;
  patternOpacity?: number;
  patternRotation?: number;

  noiseOpacity?: number;

  /** Glass overlay */
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

  pattern = true,
  patternColor = "rgba(120,120,120,0.25)",
  patternType = "dots",
  customPatternSVG,
  patternSize = 18,
  patternOpacity = 0.25,
  patternRotation = 0,

  noiseOpacity = 0.08,

  glass = false,
  glassBlur = 18,
  glassOpacity = 0.25,
  glassTint = "rgba(255,255,255,0.4)",
  glassBorderOpacity = 0.25,
  glassNoise = 0.04,

  ...props
}: BgGradientProps) => {
  const prefersReducedMotion = useReducedMotion();

  const gradientStops = useMemo(() => {
    return via
      ? `${from} ${fromOpacity}, ${via} 40%, ${to} 80%`
      : `${from} ${fromOpacity}, ${to} 100%`;
  }, [from, via, to, fromOpacity]);

  const svgPatterns: Record<string, string> = {
    dots: `
      <svg width='${patternSize}' height='${patternSize}' xmlns='http://www.w3.org/2000/svg'>
        <circle cx='${patternSize / 2}' cy='${patternSize / 2}' r='1.2' fill='${patternColor}' />
      </svg>
    `,
    grid: `
      <svg width='${patternSize}' height='${patternSize}' xmlns='http://www.w3.org/2000/svg'>
        <rect width='1' height='${patternSize}' fill='${patternColor}' />
        <rect width='${patternSize}' height='1' fill='${patternColor}' />
      </svg>
    `,
    diagonal: `
      <svg width='${patternSize}' height='${patternSize}' xmlns='http://www.w3.org/2000/svg'>
        <path d='M0 ${patternSize} L${patternSize} 0' stroke='${patternColor}' stroke-width='1'/>
      </svg>
    `,
    cross: `
      <svg width='${patternSize}' height='${patternSize}' xmlns='http://www.w3.org/2000/svg'>
        <path d='M${patternSize / 2} 0 V ${patternSize}' stroke='${patternColor}'/>
        <path d='M0 ${patternSize / 2} H ${patternSize}' stroke='${patternColor}'/>
      </svg>
    `,
    wave: `
      <svg width='${patternSize}' height='${patternSize}' xmlns='http://www.w3.org/2000/svg'>
        <path d='M0 ${patternSize / 2} Q ${patternSize / 4} 0, ${patternSize / 2} ${patternSize / 2} T ${patternSize} ${patternSize / 2}'
          stroke='${patternColor}' fill='none'/>
      </svg>
    `,
  };

  const selectedPattern =
    patternType === "custom" && customPatternSVG
      ? customPatternSVG
      : svgPatterns[patternType];

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
      {/* Background image */}
      {imageSrc && !prefersReducedMotion && (
        <div className="absolute inset-0" style={{ opacity: imageOpacity }}>
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes="100vw"
            quality={70}
            className={imageSize === "cover" ? "object-cover" : "object-contain"}
            style={{ objectPosition: imagePosition }}
          />
        </div>
      )}

      {/* Gradient blob */}
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
          willChange: animated ? "transform" : undefined,
        }}
      />

      {/* Pattern */}
      {pattern && selectedPattern && (
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{
            opacity: patternOpacity,
            transform: `rotate(${patternRotation}deg)`,
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
              selectedPattern
            )}")`,
            backgroundRepeat: "repeat",
          }}
        />
      )}

      {/* Noise */}
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          opacity: noiseOpacity,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E\")",
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
    </div>
  );
};
