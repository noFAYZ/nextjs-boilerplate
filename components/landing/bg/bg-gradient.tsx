import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface BgGradientProps extends HTMLAttributes<HTMLDivElement> {
  /** Size of the gradient blob (e.g. "200% 200%", "800px 800px") */
  size?: string;
  /** Position of the gradient center (e.g. "top left", "30% 80%", "center") */
  position?: string;
  /** Starting color (transparent by default for clean blend) */
  from?: string;
  /** Main accent color (your brand color) */
  to?: string;
  /** Where the solid color starts fading (default 0% for soft blob) */
  fromOpacity?: string;
  /** Optional second accent for richer gradients */
  via?: string;
  /** Opacity of the entire gradient layer */
  opacity?: string;
  /** Blur intensity */
  blur?: string;
  /** Enable subtle animation (floating blob) */
  animated?: boolean;
}

export const BgGradient = ({
  className,
  size = "150% 150%",
  position = "top",
  from = "transparent",
  to = "hsl(346.1,38.68%,41.57%)", // your orange: #E57B2A
  via,
  fromOpacity = "0%",
  opacity = "0.4",
  blur = "blur(100px)",
  animated = false,
  ...props
}: BgGradientProps) => {
  const gradientStops = via
    ? `${from} ${fromOpacity}, ${via} 40%, ${to} 80%`
    : `${from} ${fromOpacity}, ${to} 100%`;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        animated && "animate-float",
        className
      )}
      {...props}
    >
      <div
        className={cn("absolute w-full h-full", blur)}
        style={{
          background: `radial-gradient(circle at ${position}, ${gradientStops})`,
          backgroundSize: size,
          opacity,
        }}
      />

      {/* Optional: subtle noise overlay for premium texture */}
      <div
        className="absolute inset-0 opacity-10 mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};