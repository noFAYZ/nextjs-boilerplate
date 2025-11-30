import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { FlickeringGrid } from "../bg/FlickeringGrid";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";
import { TablerPlant2 } from "@/components/icons/icons";
/**
 * Reusable FeatureTabs component
 * - Pure React state (no framer-motion)
 * - Uses shadcn UI utilities (cn)
 * - Fully production-grade
 * - Accepts dynamic tab definitions
 */

export function FeatureTabs({ tabs, bg }) {
  const [active, setActive] = useState(0);

  return (
    <div className="relative z-0 mx-auto max-w-grid-width border-grid-border border-x ">

{bg && <div
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
 
</div>}
      {/* Tabs Container */}
      <div className="relative top-0 z-0 mx-auto mt-0 flex h-16 max-w-[min(700px,calc(100vw-2rem))] items-start justify-center  max-md:h-auto">
        {/* Left Decorative SVG */}
        {bg &&  <SVGDecorative reversed={undefined} />} 

        {/* Tabs */}
        <div className={cn(`relative z-10 h-[calc(100%)] min-w-0 grow  `, bg && 'bg-background shadow-[0_6px_12px_-6px_rgba(0,0,0,0.12)] dark:shadow-[0_6px_12px_-6px_rgba(0,0,0,0.3)] ')}>
          <div className="flex size-full flex-wrap  items-center justify-center gap-2.5 max-md:pt-4" role="tablist">
            {tabs.map((t, i) => (
              <Button
                key={t.label}
               
                onClick={() => setActive(i)}
                role="tab"
                variant={active === i  ? 'outlinepressed' : 'outline'}
                aria-selected={active === i}
                size={bg ? 'sm' :"xs"}
                aria-controls={`panel-${i}`}
                className={cn(
                  "group flex items-center  gap-2 transition-colors duration-100 border",
                  bg ? '' : 'rounded-md'
                )}
                icon={ <span
                    className="flex size-5 items-center justify-center rounded border border-black/5 drop-shadow-md transition-transform group-hover:scale-102"
                    style={{ backgroundColor: t.iconBg, color: t.iconColor }}
                  >
                    {t.icon}
                  </span>}
              >
               
                <span className=" font-medium leading-none">{t.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Right Decorative SVG */}
        {bg && <SVGDecorative reversed />}
      </div>

      {/* Panels */}
      <div className="mx-auto mt-0 container sm:max-w-7xl px-2 sm:px-4 [perspective:1000px]">
        <div className="relative h-[300px] md:h-[680px]">
          {tabs.map((t, i) => (
            <div
              id={`panel-${i}`}
              key={t.label}
              role="tabpanel"
              aria-hidden={active !== i}
              className={cn(
                "absolute inset-0 transition-opacity duration-300",
                active === i ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              <PanelContainer>{t.content}</PanelContainer>
            </div>
          ))}
        </div>
      </div>
      <div
              className="absolute bottom-0 left-0 right-0 w-full h-[303px]"
              style={{
                background: "linear-gradient(to top, var(--background) 0%, rgba(217, 217, 217, 0) 100%)",
                zIndex: 10,
              }}
            />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Sub Components                               */
/* -------------------------------------------------------------------------- */

function PanelContainer({ children }) {
    return (
      <div
        className="
          size-full 
          rounded-t-xl 
          border-x border-t border-border/80
          bg-muted
          
          sm:rounded-t-[1.25rem] sm:px-2 sm:pt-2
          [mask-image:linear-gradient(to_bottom,black_95%,transparent_100%)]
        "
      >
        <div
          className="
            relative 
            size-full 
            overflow-hidden 
            rounded-t-lg 
            border-x border-t border-border 
            bg-card 
            shadow-sm 
            sm:rounded-t-xl
          "
        >
          {children}
        </div>
      </div>
    );
  }
  

function SVGDecorsative({ reversed }) {
  return (
    <svg
      viewBox="0 0 85 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "h-full w-auto shrink-0 translate-y-px overflow-visible  drop-shadow-2xl",
        reversed ? "-translate-x-px -scale-x-100" : "translate-x-px"
      )}
    >
      <rect x={0} y={0} width={85} height={1} fill="var(--background)" transform="translate(0, -1)" />
      <path
        d="M50 45C57.3095 56.6952 71.2084 63.9997 85 64V0H0C13.7915 0 26.6905 7.30481 34 19L50 45Z"
        fill="var(--background)"
      />
    </svg>
  );
}

function SVGDecorative({ reversed }) {
    return (
      <div
        className={cn(
          "relative h-full w-auto shrink-0 drop-shadow-xl",
          reversed ? "-scale-x-100 -translate-x-px" : "translate-x-px"
        )}
      >
        {/* Ambient soft shadow */}
        <div
          className="
            absolute inset-0 
            blur-xl opacity-25
            bg-background 
          "
        />
  
        {/* Directional rim-light */}
        <div
          className="
            absolute inset-y-0 w-6
             bg-background
            pointer-events-none
            blur-md
          "
        />
  
        {/* Actual SVG */}
        <svg
          viewBox="0 0 85 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 h-full w-auto overflow-visible "
        >
          <rect
            x={0}
            y={0}
            width={85}
            height={1}
            fill="var(--background)"
            transform="translate(0, -1)"
          />
          <path
            d="M50 45C57.3095 56.6952 71.2084 63.9997 85 64V0H0C13.7915 0 26.6905 7.30481 34 19L50 45Z"
            className="fill-background "
          />
        </svg>
      </div>
    );
  }
  

/* -------------------------------------------------------------------------- */
/*                             Example Usage (Optional)                        */
/* -------------------------------------------------------------------------- */

export function Example({bg}) {
    const { resolvedTheme } = useTheme();

    const theme = resolvedTheme?.startsWith("dark") ? "dark" : "light";

    const DASHBOARD_IMAGES = {
        light: "/landing/hero-light2.JPG",
        dark: "/landing/hero-dark2.JPG",
        alt: "Financial dashboard with predictive insights",
      } as const;
      type Item = { label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> };
      const imageSrc = DASHBOARD_IMAGES[theme];

  return (
    <FeatureTabs
      tabs={[
        {
          label: "Track",
          iconBg: "#fb923c",
          iconColor: "#7c2d12",
          icon: (
            <svg width={11} height={10} viewBox="0 0 11 10" fill="none">
              <path stroke="currentColor" strokeWidth="3.333" strokeLinecap="round" d="M5.5 5.667v-4M5.5 5.667l-3.333 2M5.5 5.667l3.333 2" />
            </svg>
          ),
          content:   <Image
          src={imageSrc}
          alt={DASHBOARD_IMAGES.alt}
          width={1920}
          height={1200}
          quality={100}
          className="w-full rounded-2xl"
          priority
        />
        },
        {
          label: "Budget",
          iconBg: "#4ade80",
          iconColor: "#065f46",
          icon: (
            <svg width={10} height={10} viewBox="0 0 10 10" fill="none">
              <path stroke="currentColor" strokeWidth="3.333" strokeLinecap="round" d="M2.333 6.333v2M7.667 1.667v6.666" />
            </svg>
          ),
          content: <div className="flex items-center justify-center h-full text-neutral-700">Analytics Preview</div>
        },
        {
          label: "Plan",
          iconBg: "#7ABB08",
          iconColor: "#085F46",
          icon: (<svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"  ><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}><path d="M2 9a10 10 0 1 0 20 0"></path><path d="M12 19A10 10 0 0 1 22 9M2 9a10 10 0 0 1 10 10"></path><path d="M12 4a9.7 9.7 0 0 1 2.99 7.5m-5.98 0A9.7 9.7 0 0 1 12 4"></path></g></svg>),
          content: <div className="flex items-center justify-center h-full text-neutral-700">Affiliate Preview</div>
        },
        {
            label: "Collaborate",
            iconBg: "#c084fc",
            iconColor: "#581c87",
            icon: (
              <svg width={32} height={32} viewBox="0 0 32 32" fill="none" className="size-2.5">
                <circle cx={27} cy={16} r={5} fill="currentColor" />
                <circle cx={5} cy={16} r={5} fill="currentColor" />
                <circle cx={16} cy={27} r={5} fill="currentColor" />
                <circle cx={16} cy={5} r={5} fill="currentColor" />
              </svg>
            ),
            content: <div className="flex items-center justify-center h-full text-neutral-700">Affiliate Preview</div>
          }
      ]}
      bg={bg}
    />
  );
}
