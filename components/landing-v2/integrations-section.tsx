"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Folder,
  HeartHandshake,
  Sparkles,
  Database,
  HeartHandshakeIcon,
  SparklesIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getLogoUrl } from "@/lib/services/logo-service";
import { DuoIconsBank, HeroiconsWallet16Solid, SolarCalculatorBoldDuotone, SolarChartSquareBoldDuotone, SolarWalletBoldDuotone } from "../icons/icons";
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
  buttonTexts?: {
    first: string;
    second: string;
  };
  title?: string;
  lightColor?: string;
  size?: "xs" | "sm" | "lg" | "xl" | "2xl";
}

const Node = ({
  label,
  color,
  big = false,
  image ='googl.com',
  size = 16,
  bigSize = 7,
}: {
  label: string;
  color: string;
  image?:string;
  big?: boolean;
  size?: number;
  bigSize?: number;
}) => {
  const nodeSize = big ? bigSize : size;
  const avatarSize = nodeSize - 2;
  
  return (
    <g>
      <rect
        width={nodeSize}
        height={nodeSize}
        rx={size}
        fill="#0f0f12"
        strokeWidth="0.5"
      />
      <foreignObject x={1} y={1} width={avatarSize} height={avatarSize}>
        {big ? (
          <>
           <Avatar
       
          >
            <AvatarImage
              src={image}
            />
            <AvatarFallback
              className="text-[10px] font-bold text-white rounded-full"
              style={{ backgroundColor: color }}
            >
              {label.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          </>
        ) : (
          <Avatar
            className={`h-${avatarSize} w-${avatarSize}`}
            style={{ height: `${avatarSize}px`, width: `${avatarSize}px` }}
          >
            <AvatarImage
              src={image}
            />
            <AvatarFallback
              className="text-[10px] font-bold text-white rounded-full"
              style={{ backgroundColor: color }}
            >
              {label.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        )}
      </foreignObject>
    </g>
  );
};

export default function DatabaseWithRestApi({
  className,
  circleText = "An",
  badgeTexts = { first: "Crypto", second: "Banking" },
  title = "Integrate 13k+ Financial Institutions",
  lightColor = "#DA6F24",
  size = "2xl",
}: DatabaseWithRestApiProps) {
  // Size configurations
  const sizeConfig = {
    xs: {
        svg: "h-[350px]",
        viewBox: "0 0 260 180",
        coreY: 120,
        nodeSize: { regular: 14, big: 20 },
        logoSize: "h-[60px] w-[60px] text-4xl",
        cardHeight: "h-[120px]",
        bottomOffset: "-bottom-6",
      },
    sm: {
      svg: "h-[400px]",
      viewBox: "0 0 260 180",
      coreY: 120,
      nodeSize: { regular: 14, big: 20 },
      logoSize: "h-[60px] w-[60px] text-4xl",
      cardHeight: "h-[120px]",
      bottomOffset: "-bottom-6",
    },
    lg: {
      svg: "h-[500px]",
      viewBox: "0 0 260 190",
      coreY: 130,
      nodeSize: { regular: 16, big: 24 },
      logoSize: "h-[70px] w-[70px] text-5xl",
      cardHeight: "h-[140px]",
      bottomOffset: "-bottom-7",
    },
    xl: {
      svg: "h-[600px]",
      viewBox: "0 0 260 200",
      coreY: 140,
      nodeSize: { regular: 16, big: 32 },
      logoSize: "h-[80px] w-[80px] text-6xl",
      cardHeight: "h-[150px]",
      bottomOffset: "-bottom-8",
    },
    "2xl": {
      svg: "h-[700px]",
      viewBox: "0 0 260 220",
      coreY: 160,
      nodeSize: { regular: 18, big: 33 },
      logoSize: "h-[90px] w-[90px] text-7xl",
      cardHeight: "h-[170px]",
      bottomOffset: "-bottom-9",
    },
  };

  const config = sizeConfig[size];

  // Improved node layout in a circular pattern around the center
  const centerX = 130;
  const centerY = config.coreY;
  const radius = 85;

  const nodes = [
    // Top row - evenly spaced
    { x: centerX + 40, y: 20, label: "AI", color: "#EC4899", image:getLogoUrl('chase.com') || "" },
    { x: centerX - 100, y: 15, label: "BACKUP", color: "#06B6D4", image:getLogoUrl('bofa.com') || ""   },
    { x: centerX + 100, y: 15, label: "ANALYTICS", color: "#EF4444", image:getLogoUrl('fidelity.com') || "" },
    { x: centerX - 40, y: 20, label: "REALTIME", color: "#A855F7", image:getLogoUrl('td.com') || "" },

    // Middle row - around the center
    { x: centerX + 115, y: centerY - 85, label: "USER", color: "#3B82F6", image:getLogoUrl('mercury.com') || "" },
    { x: centerX - 115, y: centerY - 55, label: "SEARCH", color: "#F59E0B", image:getLogoUrl('binance.com') || "" },
    {
      x: centerX,
      y: centerY - 80,
      label: "MAIN DB",
      color: "#8B5CF6",
      big: true,
       image:getLogoUrl('plaid.com') || ""
    },
    { x: centerX - 110, y: centerY - 85, label: "CACHE", color: "#10B981", image:getLogoUrl('wellsfargo.com') || "" },
    { x: centerX + 115, y: centerY - 50, label: "LOGS", color: "#F97316", image:getLogoUrl('kraken.com') || "" },
  ];

  const getPath = (node: (typeof nodes)[0], index: number) => {
    const startX = node.x;
    const startY =
      node.y +
      (node.big ? config.nodeSize.big / 2 : config.nodeSize.regular / 2);
    const endX = centerX;
    const endY = centerY;

    // Create curved paths with better control points
    const midY = (startY + endY) / 2;
    const controlOffset = index % 2 === 0 ? 40 : -40;
    const ctrlX = (startX + endX) / 2 + controlOffset;

    return `M${startX} ${startY} Q ${ctrlX} ${midY} ${endX} ${endY}`;
  };

  return (
    <div className={cn("relative flex flex-col justify-center items-center  py-20", className)}>
<BgGradient  opacity="1"/>

 

      <ScrollReveal>
       
          
       <div className="relative max-w-lg mx-auto  mb-8 text-center">
     <div className="mx-auto  text-center ">
       <h2 className="text-3xl md:text-4xl font-bold mb-4">
       Connect all accounts
       </h2>
       <p className="text-sm md:text-base text-muted-foreground">
       Link your banks, crypto wallets, and exchanges to get a complete view of your finances.       </p>
     </div>
   </div>


     </ScrollReveal>



      <div className="relative w-full max-w-2xl">
        {/* Animated Network SVG */}
        <svg
          viewBox={config.viewBox}
          className={cn("w-full drop-shadow-2xl", config.svg)}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Gradient & Filters */}
          <defs>
            <radialGradient id="glow">
              <stop offset="0%" stopColor={lightColor} />
              <stop offset="100%" stopColor={lightColor} stopOpacity="0" />
            </radialGradient>
            <filter id="glow-filter">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Animated Lines */}
          <g stroke="#6F6F6F" strokeWidth="1" opacity="0.6">
            {nodes.map((node, i) => (
              <path
                key={`line-${i}`}
                d={getPath(node, i)}
                fill="none"
                strokeDasharray="8 12"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="100"
                  to="0"
                  dur="20s"
                  repeatCount="indefinite"
                />
              </path>
            ))}
          </g>

          {/* Traveling Glows */}
          {nodes.map((node, i) => {
            const path = getPath(node, i);
            return (
              <g key={`glow-${i}`}>
                <mask id={`mask-${i}`}>
                  <path d={path} stroke="white" strokeWidth="18" />
                </mask>
                <g mask={`url(#mask-${i})`}>
                  <circle r="1" fill={lightColor}>
                    <animateMotion
                      path={path}
                      dur="4.5s"
                      begin={`${i * 0.4}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle r="3" fill={lightColor} opacity="0.3">
                    <animateMotion
                      path={path}
                      dur="4.5s"
                      begin={`${i * 0.4}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              </g>
            );
          })}

          {/* Nodes */}
          <g>
            {nodes.map((node, i) => {
              const nodeSize = node.big
                ? config.nodeSize.big
                : config.nodeSize.regular;
              return (
                <g
                  key={`node-${i}`}
                  transform={`translate(${node.x - nodeSize / 2}, ${
                    node.y - config.nodeSize.regular / 2
                  })`}
                >
                  <Node
                    label={node.label}
                    color={node.color}
                    image={node.image}
                    big={node.big}
                    size={config.nodeSize.regular}
                    bigSize={config.nodeSize.big}
                  />
                </g>
              );
            })}
          </g>

          {/* Central Core */}
          <g filter="url(#glow-filter)">
            <motion.circle
              cx={centerX}
              cy={centerY}
              r="100"
              fill={lightColor}
              opacity="0.7"
              animate={{ r: [3, 5, 3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <circle cx={centerX} cy={centerY} r="4" fill={lightColor} />
            <circle cx={centerX} cy={centerY} r="2" fill="white" />
          </g>
        </svg>

        {/* Bottom Card */}
        <div className="absolute bottom-12 flex w-full flex-col items-center">
          <div className="absolute -top-3 z-20 flex items-center justify-center rounded-lg border bg-card px-2 py-1 sm:-top-4 sm:py-1.5">
            <SparklesIcon className="size-3" />
            <span className="ml-2 text-[10px]">
              {title ? title : "Data exchange using a customized REST API"}
            </span>
          </div>

          {/* Logo circle */}
          <div
            className={cn(
              "absolute z-30 grid place-items-center rounded-full border bg-muted shadow font-bold text-orange-500",
              config.logoSize,
              config.bottomOffset
            )}
          >
            𒀭
          </div>

          <div
            className={cn(
              "relative z-10 flex w-full items-center justify-center overflow-hidden rounded-lg bg-background",
              config.cardHeight
            )}
          >
            {/* Bottom left badge */}
            <div className="absolute bottom-8 left-12 z-10 h-7 rounded-full bg-card px-3 text-xs border flex items-center gap-2">
              <HeroiconsWallet16Solid className="size-4" />
              <span>{badgeTexts.first}</span>
            </div>

            {/* Bottom right badge */}
            <div className="absolute right-16 bottom-6  z-10 hidden h-7 rounded-full bg-card px-3 text-xs sm:flex border items-center gap-2">
              <DuoIconsBank className="size-4" />
              <span>{badgeTexts.second}</span>
            </div>
               {/* Bottom right badge */}
               <div className="absolute right-36 bottom-24 z-10 hidden h-7 rounded-full bg-card px-3 text-xs sm:flex border items-center gap-2">
              <SolarCalculatorBoldDuotone className="size-4" />
              <span>Budgeting</span>
            </div>

               {/* Bottom left badge */}
               <div className="absolute bottom-24 left-26 z-10 h-7 rounded-full bg-card px-3 text-xs border flex items-center gap-2">
              <SolarChartSquareBoldDuotone className="size-4" />
              <span>Investment</span>
            </div>

            {/* Circles */}
            <motion.div
              className="absolute -bottom-14 h-[120px] w-[120px] rounded-full border-t bg-accent/15"
              animate={{ scale: [0.98, 1.02, 0.98, 1, 1, 1, 1, 1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-20 h-[165px] w-[165px] rounded-full border-t bg-accent/15"
              animate={{ scale: [1, 1, 1, 0.98, 1.02, 0.98, 1, 1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-[100px] h-[210px] w-[210px] rounded-full border-t bg-accent/15"
              animate={{ scale: [1, 1, 1, 1, 1, 0.98, 1.02, 0.98, 1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-[120px] h-[255px] w-[255px] rounded-full border-t bg-accent/15"
              animate={{ scale: [1, 1, 1, 1, 1, 1, 0.98, 1.02, 0.98, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </div>

      
    </div>
  );
}
