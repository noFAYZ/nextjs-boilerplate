"use client";

import React from "react";
import { motion } from "framer-motion";
import { SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLogoUrl } from "@/lib/services/logo-service";
import { DuoIconsBank, FluentPlugConnectedCheckmark20Filled, HeroiconsWallet16Solid, SolarCalculatorBoldDuotone, SolarChartSquareBoldDuotone, TablerPlugConnected } from "../icons/icons";
import { BgGradient } from "../landing/bg/bg-gradient";
import { ScrollReveal } from "../landing/scroll-reveal";

interface DatabaseWithRestApiProps {
  className?: string;
  circleText?: string;
  badgeTexts?: {
    first: string;
    second: string;
    third?: string;
    fourth?: string;
  };
  title?: string;
  lightColor?: string;
  size?: "xs" | "sm" | "lg" | "xl" | "2xl";
}

export default function DatabaseWithRestApi({
  className,
  circleText = "An",
  badgeTexts = { first: "Crypto", second: "Banking" },
  title = "Integrate 13k+ Financial Institutions",
  lightColor = "#DA6F24",
  size = "2xl",
}: DatabaseWithRestApiProps) {
  // Responsive full-width hero size map
  const sizeConfig = {
    xs: { viewBox: "0 0 900 380", svgH: "h-[360px]", centerY: 180, node: 18, bigNode: 42 },
    sm: { viewBox: "0 0 1000 420", svgH: "h-[420px]", centerY: 200, node: 20, bigNode: 46 },
    lg: { viewBox: "0 0 1100 480", svgH: "h-[480px]", centerY: 230, node: 24, bigNode: 54 },
    xl: { viewBox: "0 0 1200 520", svgH: "h-[520px]", centerY: 250, node: 28, bigNode: 62 },
    "2xl": { viewBox: "0 0 1400 620", svgH: "h-[620px]", centerY: 300, node: 26, bigNode: 40 },
  };

  const cfg = sizeConfig[size];
  const viewW = Number(cfg.viewBox.split(" ")[2]);
  const viewH = Number(cfg.viewBox.split(" ")[3]);
  const centerX = Math.round(viewW / 2);
  const centerY = cfg.centerY;

  // L-shaped hybrid (rounded corner) control points - Option C hybrid (smooth corner)
  const tlStart = { x: 72, y: 48 };

  const brStart = { x: viewW - 72, y: viewH - 48 };


  // Create smooth cubic Beziers for organic L with rounded joint
  const pathTopLeft = `M ${tlStart.x} ${tlStart.y} 
  C ${tlStart.x} ${tlStart.y + 200}, ${centerX - 200} ${centerY - 80}, ${centerX} ${centerY}`;

    const pathBottomRight = `M ${brStart.x} ${brStart.y} 
    C ${brStart.x + 0} ${brStart.y - (brStart.y - centerY) / 2}, 
      ${centerX + 100} ${centerY + 40}, 
      ${centerX} ${centerY}`;

  // Logos for nodes
  const topLeftLogos = [
    getLogoUrl("chase.com") || "",
    getLogoUrl("plaid.com") || "",
    getLogoUrl("mercury.com") || "",
    getLogoUrl("bofa.com") || "",
    getLogoUrl("fidelity.com") || "",
    getLogoUrl("mx.com") || "",
    getLogoUrl("bybit.com") || "",
  ];

  const bottomRightLogos = [
    getLogoUrl("wellsfargo.com") || "",
    getLogoUrl("td.com") || "",
    getLogoUrl("binance.com") || "",
    getLogoUrl("kraken.com") || "",
    getLogoUrl("coinbase.com") || "",
    getLogoUrl("crypto.com") || "",
  ];

  // Animation params adaptive to size
  const baseDuration = 7.2; // seconds
  const sizeFactor = Math.max(1, cfg.bigNode / 48);
  const duration = baseDuration * (1 + (1 - 1 / sizeFactor) * 0.6);
  const stagger = 0.78;

  // helper renders node with circular mask and bead visuals
  const renderLogoNode = (id: string, href: string, sizePx: number) => {
    return (
      <g key={id} transform={`translate(${-sizePx / 2}, ${-sizePx / 2})`} aria-hidden>
        <defs>
          <clipPath id={`clip-${id}`}>
            <circle cx={sizePx / 2} cy={sizePx / 2} r={sizePx / 2} />
          </clipPath>
        </defs>

        {/* bead background */}
    
  

        {/* image or fallback */}
        {href ? (
          <image
            id={`${id}-img`}
            href={href}
            x={0}
            y={0}
            width={sizePx}
            height={sizePx}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#clip-${id})`}
          />
        ) : (
          <g clipPath={`url(#clip-${id})`}>
            <rect x={0} y={0} width={sizePx} height={sizePx} rx={sizePx / 2} fill="#374151" />
            <text x={sizePx / 2} y={sizePx / 2 + sizePx / 5} textAnchor="middle" fontSize={sizePx / 2.8} fontWeight={700} fill="#fff">?
            </text>
          </g>
        )}

        {/* soft rim */}
      
      </g>
    );
  };

  // compute badge positions radially around center in empty spaces
  const badgePositions = (
    radius: number,
    count: number,
    startAngle = -180, // left-most point on top curve
    endAngle = -0     // right-most point on top curve
  ) => {
    const positions: { x: number; y: number }[] = [];
    const angleStep = (endAngle - startAngle) / (count - 1); // equally spaced
  
    for (let i = 0; i < count; i++) {
      const angle = ((startAngle + i * angleStep) * Math.PI) / 120;
      const x = centerX + Math.round(radius * Math.cos(angle));
      const y = centerY + Math.round(radius * Math.sin(angle)); // negative sin goes up
      positions.push({ x, y });
    }
  
    return positions;
  };

  const badges = [
    { icon: <HeroiconsWallet16Solid className="size-4" />, label: badgeTexts.first },
  
   
    { icon: <DuoIconsBank className="size-4" />, label: badgeTexts.second }, 

  ];

  const badgeCoords = badgePositions(cfg.bigNode * 3.5, badges.length);


  return (
    <section className={cn("relative flex flex-col items-center justify-center overflow-hidden px-4", className)}>
      {/* Top overlay kept as requested */}
      <div
        className="absolute top-0 left-0 right-0 w-full h-[303px]  "
        style={{
          background: "linear-gradient(to bottom, var(--background) 20%, rgba(217, 217, 217, 0) 100%)",
          zIndex: 10,
        }}
      />

      {/* Bottom overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 w-full h-[120px] pointer-events-none z-100"
        style={{
          background: "linear-gradient(to top, var(--background) 20%, rgba(217, 217, 217, 0) 100%)",
          zIndex: 10,
        }}
      />

      <BgGradient position="top" patternSize={10} />
      <ScrollReveal className="z-20">
           {/* caption under center */}
    
        <div className="relative z-30 max-w-3xl text-center mb-3 ">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Connect all accounts</h2>
          <p className="text-sm md:text-base text-muted-foreground">Link your banks, crypto wallets, and exchanges to get a complete view of your finances.</p>
        </div>
        <div className="  flex gap-2 justify-center">

     
{badges.map((b, i) => (
  <div
    key={`badge-${i}`}
    className=" z-40 flex items-center gap-2 px-3 py-1 rounded-xl backdrop-blur-sm bg-card/70  text-xs shadow-sm"  >
    {b.icon}
    <span className="hidden sm:inline">{b.label}</span>
  </div>
))}
</div>
      </ScrollReveal>

      <div
        className="absolute top-0 left-0 right-0 w-full h-[203px]  "
        style={{
          background: "linear-gradient(to bottom, var(--background) 0%, rgba(217, 217, 217, 0) 100%)",
          zIndex: 10,
        }}
      />

      {/* SVG full width */}
      <div className="relative w-full max-w-full ">
        <svg viewBox={cfg.viewBox} className={cn("w-full", cfg.svgH)} preserveAspectRatio="xMidYMid slice" role="img" aria-label="network visualization">
          <defs>
            <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <path id="p-tl" d={pathTopLeft} fill="none" strokeWidth={2.4} stroke="transparent" />
            <path id="p-br" d={pathBottomRight} fill="none" strokeWidth={2.4} stroke="transparent" />

            <linearGradient id="gradA" x1="0%" x2="100%">
              <stop offset="0%" stopColor={lightColor} stopOpacity="0.96" />
              <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.12" />
            </linearGradient>
            <linearGradient id="gradB" x1="100%" x2="0%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.12" />
            </linearGradient>

            {/* dashed stroke style */}
            <mask id="dash-mask">
              <rect x="0" y="0" width={viewW} height={viewH} fill="white" />
            </mask>

            {/* center clip so nodes truly disappear inside */}
            <clipPath id="center-clip">
              <circle cx={centerX} cy={centerY} r={cfg.bigNode * 1.18} />
            </clipPath>
          </defs>

          {/* visible dashed organic strokes with animated dash offset
          <g strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity={0.85}>
            <path d={pathTopLeft} stroke="url(#gradA)" fill="none" strokeDasharray="8 8">
              <animate attributeName="stroke-dashoffset" from="0" to="-64" dur={`${duration}s`} repeatCount="indefinite" />
            </path>

            <path d={pathBottomRight} stroke="url(#gradB)" fill="none" strokeDasharray="8 8">
              <animate attributeName="stroke-dashoffset" from="0" to="64" dur={`${duration}s`} repeatCount="indefinite" />
            </path>
          </g> */}

          {/* nodes top-left (larger) */}
          <g id="nodes-tl" >
            {topLeftLogos.map((logo, i) => {
              const sizePx = Math.round(cfg.node * 1.5);
              const id = `tl-${i}`;
              const begin = `${(i * stagger).toFixed(2)}s`;
              return (
                <g key={id}>
                  <g>
                    {renderLogoNode(id, logo, sizePx)}
                    <animateMotion dur={`${duration}s`} begin={begin} repeatCount="indefinite" rotate="auto">
                      <mpath href="#p-tl" />
                    </animateMotion>
                  </g>
                </g>
              );
            })}
          </g>

          {/* nodes bottom-right (larger) */}
          <g id="nodes-br" >
            {bottomRightLogos.map((logo, i) => {
              const sizePx = Math.round(cfg.node * 1.5);
              const id = `br-${i}`;
              const begin = `${(i * stagger + 0.2).toFixed(2)}s`;
              return (
                <g key={id}>
                  <g>
                    {renderLogoNode(id, logo, sizePx)}
                    <animateMotion dur={`${duration}s`} begin={begin} repeatCount="indefinite" rotate="auto">
                      <mpath href="#p-br" />
                    </animateMotion>
                  </g>
                </g>
              );
            })}
          </g>

          {/* center glow layers */}
          <g aria-hidden>
            <circle cx={centerX} cy={centerY} r={cfg.bigNode * 1.8} fill={lightColor} opacity={0.06} />
            <circle cx={centerX} cy={centerY} r={cfg.bigNode * 0.9} fill={lightColor} opacity={0.04} />
          </g>

          {/* center logo with interactive pulse when nodes pass behind */}
          <g transform={`translate(${centerX}, ${centerY})`} style={{ pointerEvents: "none" }}>
            {/* outer interactive ring that pulses in-phase with node arrivals */}
            <motion.circle
              cx={0}
              cy={0}
              r={cfg.bigNode * 1.25}
              fill="none"
              stroke={lightColor}
              strokeWidth={2}
              initial={{ opacity: 0.06, scale: 1 }}
              animate={{
                scale: [1, 1.06, 1],
                opacity: [0.06, 0.16, 0.06],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* core circle */}
            <motion.circle
              cx={0}
              cy={0}
              r={cfg.bigNode}
              fill="var(--foreground)"
              
            
              style={{ filter: "drop-shadow(0 18px 48px rgba(0,0,0,0.18))" }}
              animate={{
                scale: [1, 1.005, 1],
              }}
              className={'shadow'}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* inner glyph */}
            <text x={0} y={24} textAnchor="middle" fontSize={cfg.bigNode * 1.82} fontWeight={800} fill={lightColor}>
              𒀭
            </text>

            {/* highlight ring that flashes slightly when nodes arrive (synced with duration) */}
            <circle cx={0} cy={0} r={cfg.bigNode * 0.9} fill="none" stroke={lightColor} strokeOpacity={0.08} strokeWidth={1}>
              <animate attributeName="stroke-opacity" values="0.04;0.18;0.04" dur={`${duration}s`} repeatCount="indefinite" />
            </circle>
          </g>

          {/* hard clip: nodes that enter center region are clipped (makes them look like they go behind) */}
          <g clipPath="url(#center-clip)" />
        </svg>

        
      </div>

      {/* badges surrounding the center in empty spaces - absolutely positioned using badgeCoords */}

   
    </section>
  );
}
