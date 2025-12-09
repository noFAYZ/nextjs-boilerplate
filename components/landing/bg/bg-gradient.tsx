import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

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

  /** Optional background image */
  imageSrc?: string;
  imageOpacity?: number;
  imagePosition?: string;
  imageSize?: string;
  imageRepeat?: string;

  pattern?: boolean;
  patternColor?: string;
  patternType?: "dots" | "grid" | "diagonal" | "cross" | "wave" | "custom";
  customPatternSVG?: string;
  patternSize?: number;
  patternOpacity?: number;
  patternRotation?: number;

  noiseOpacity?: number;
  darkMode?: boolean;
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
  imageOpacity = 0.3,
  imagePosition = "center",
  imageSize = "cover",
  imageRepeat = "no-repeat",

  pattern = true,
  patternColor = "rgba(120,120,120,0.25)",
  patternType = "dots",
  customPatternSVG,
  patternSize = 18,
  patternOpacity = 0.3,
  patternRotation = 0,

  noiseOpacity = 0.1,
  darkMode = false,

  ...props
}: BgGradientProps) => {
  const gradientStops = via
    ? `${from} ${fromOpacity}, ${via} 40%, ${to} 80%`
    : `${from} ${fromOpacity}, ${to} 100%`;

  const svgPatterns: Record<string, string> = {
    dots: `
      <svg width='${patternSize}' height='${patternSize}' viewBox='0 0 ${patternSize} ${patternSize}' xmlns='http://www.w3.org/2000/svg'>
        <circle cx='${patternSize / 2}' cy='${patternSize / 2}' r='1.2' fill='${patternColor}' />
      </svg>
    `,
    grid: `
      <svg width='${patternSize}' height='${patternSize}' viewBox='0 0 ${patternSize} ${patternSize}' xmlns='http://www.w3.org/2000/svg'>
        <rect width='1' height='${patternSize}' fill='${patternColor}' />
        <rect width='${patternSize}' height='1' fill='${patternColor}' />
      </svg>
    `,
    diagonal: `
      <svg width='${patternSize}' height='${patternSize}' viewBox='0 0 ${patternSize} ${patternSize}' xmlns='http://www.w3.org/2000/svg'>
        <path d='M0 ${patternSize} L${patternSize} 0' stroke='${patternColor}' stroke-width='1' />
      </svg>
    `,
    cross: `
      <svg width='${patternSize}' height='${patternSize}' viewBox='0 0 ${patternSize} ${patternSize}' xmlns='http://www.w3.org/2000/svg'>
        <path d='M${patternSize / 2} 0 V ${patternSize}' stroke='${patternColor}' stroke-width='1'/>
        <path d='M0 ${patternSize / 2} H ${patternSize}' stroke='${patternColor}' stroke-width='1'/>
      </svg>
    `,
    wave: `
      <svg width='${patternSize}' height='${patternSize}' viewBox='0 0 ${patternSize} ${patternSize}' xmlns='http://www.w3.org/2000/svg'>
        <path d='M0 ${patternSize/2} Q ${patternSize/4} 0, ${patternSize/2} ${patternSize/2} T ${patternSize} ${patternSize/2}' stroke='${patternColor}' stroke-width='1' fill='none'/>
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
        animated && animationType === "float" && "animate-float",
        animated && animationType === "spin" && "animate-spin-slow",
        animated && animationType === "pulse" && "animate-pulse-slow",
        className
      )}
      {...props}
    >
      {/* Optional Background Image */}
      {imageSrc && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: imageSize,
            backgroundPosition: imagePosition,
            backgroundRepeat: imageRepeat,
            opacity: imageOpacity,
          }}
        />
      )}

      {/* Gradient Blob */}
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

      {/* Pattern Overlay */}
      {pattern && (
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

      {/* Noise Overlay */}
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          opacity: noiseOpacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
