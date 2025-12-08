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

  /** Enable decorative SVG pattern overlay */
  pattern?: boolean;

  /** Pattern color — defaults to a soft muted foreground */
  patternColor?: string;

  /** Dot, grid, diagonal-lines, or custom SVG string */
  patternType?: "dots" | "grid" | "diagonal" | "cross" | "custom";

  /** For custom pattern SVG only */
  customPatternSVG?: string;

  /** Pattern size scaling */
  patternSize?: number;
}

export const BgGradient = ({
  className,
  size = "150% 150%",
  position = "top",
  from = "transparent",
  to = "#C46047",
  via,
  fromOpacity = "0%",
  opacity = "0.45",
  blur = "blur(100px)",
  animated = false,

  pattern = true,
  patternColor = "rgba(120,120,120,0.25)",
  patternType = "dots",
  customPatternSVG,
  patternSize = 18,

  ...props
}: BgGradientProps) => {
  const gradientStops = via
    ? `${from} ${fromOpacity}, ${via} 40%, ${to} 80%`
    : `${from} ${fromOpacity}, ${to} 100%`;

  /** Built-in SVG patterns */
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
  };

  const selectedPattern =
    patternType === "custom" && customPatternSVG
      ? customPatternSVG
      : svgPatterns[patternType];

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        animated && "animate-float",
        className
      )}
      {...props}
    >
      {/* Gradient Blob */}
      <div
        className={cn("absolute inset-0", blur)}
        style={{
          background: `radial-gradient(circle at ${position}, ${gradientStops})`,
          backgroundSize: size,
          opacity,
        }}
      />

      {/* Optional Pattern Overlay */}
      {pattern && (
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
              selectedPattern
            )}")`,
            backgroundRepeat: "repeat",
          }}
        />
      )}

      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-10 mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
