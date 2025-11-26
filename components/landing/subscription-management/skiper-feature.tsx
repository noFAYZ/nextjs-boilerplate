"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import React from "react";

const projects = [
  {
    endpoint: "Crypto Portfolio",
    title: "Cryptocurrency Portfolio Management",
    description: "Track tokens, NFTs, and DeFi positions across multiple blockchains with real-time prices and portfolio valuation.",
    src: "https://files.asad.digital/video/zerion/api1.mp4",
  },
  {
    endpoint: "Banking Accounts",
    title: "Bank Account Integration",
    description: "Connect and manage multiple bank accounts with automatic transaction sync and spending categorization.",
    src: "https://files.asad.digital/video/zerion/api2.mp4",
  },
  {
    endpoint: "Transactions",
    title: "Transaction Management",
    description: "View complete transaction history across all accounts with intelligent categorization and multi-chain support.",
    src: "https://files.asad.digital/video/zerion/api4.mp4",
  },
  {
    endpoint: "DeFi & NFTs",
    title: "DeFi Positions & NFT Tracking",
    description: "Monitor active DeFi protocols, liquidity pools, staking rewards, and track your NFT holdings and floor prices.",
    src: "https://files.asad.digital/video/zerion/api3.mp4",
  },
  {
    endpoint: "Real-time Sync",
    title: "Automatic Wallet & Account Sync",
    description: "Keep all your wallets and accounts synchronized in real-time with background refresh and instant notifications.",
    src: "https://files.asad.digital/video/zerion/api5.mp4",
  },
  {
    endpoint: "Analytics",
    title: "Financial Analytics & Insights",
    description: "Deep insights into spending patterns, portfolio performance, category breakdown, and comprehensive financial reporting.",
    src: "https://files.asad.digital/video/zerion/api6.mp4",
  },
];

const StickyCard = ({ index, title, description, endpoint, src }: { index: number } & typeof projects[0]) => {
  // Small gap: 100px between cards (adjustable)
  const topOffset = index * 30;

  return (
    <motion.section
      className="sticky flex items-center justify-center min-h-screen"
      style={{ top: `${topOffset}px` }} // This creates tight, elegant stacking
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}

      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="w-full max-w-7xl mx-auto ">
        <div className="flex flex-col md:flex-row gap-10  p-3 bg-card rounded-2xl ">
          {/* Video */}
          <div className="flex-1  overflow-hidden rounded-xl">
            <video
              playsInline
              muted
              autoPlay
              loop
             
              className="w-full h-full object-fit"
            >
              <source src={src} type="video/mp4" />
            </video>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-3 flex-1 space-y-4">
            <div className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
              {endpoint}
            </div>
            <h2 className="text-4xl font-bold leading-tight">
              {title}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
              {description}
            </p>
            <Button size="sm" variant="steel" className="w-fit">
              Learn more →
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

const Skiper16 = () => {
  return (
    <main className="relative  ">
    
      {/* Scroll Hint */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none text-center">
        <motion.div
          initial={{ opacity: 0, y: -0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-xs tracking-widest uppercase text-muted-foreground">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="mt-3 h-16 w-px mx-auto bg-gradient-to-b from-transparent via-muted-foreground/40 to-transparent"
          />
        </motion.div>
      </div>

      {/* Stacked Cards with Small Spacing */}
      <div className="relative">
        {projects.map((project, i) => (
          <StickyCard key={project.endpoint} index={i} {...project} />
        ))}
      </div>

  
    </main>
  );
};

export default Skiper16;