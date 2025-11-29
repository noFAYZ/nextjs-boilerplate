"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React from "react";
import { Card } from "../ui/card";
import { BgGradient } from "./bg/bg-gradient";

const ICONS_ROW1 = [
  "https://cdn-icons-png.flaticon.com/512/196/196559.png", // Chase
  "https://cdn-icons-png.flaticon.com/512/732/732204.png", // Bank of America
  "https://cdn-icons-png.flaticon.com/512/196/196566.png", // Wells Fargo
  "https://cdn-icons-png.flaticon.com/512/888/888857.png", // Citibank
  "https://cdn-icons-png.flaticon.com/512/196/196578.png", // HSBC
  "https://cdn-icons-png.flaticon.com/512/196/196554.png", // Capital One
  "https://cdn-icons-png.flaticon.com/512/196/196571.png", // Santander
];

const ICONS_ROW2 = [
  "https://cdn-icons-png.flaticon.com/512/174/174861.png", // PayPal
  "https://cdn-icons-png.flaticon.com/512/349/349228.png", // Visa
  "https://cdn-icons-png.flaticon.com/512/5968/5968144.png", // Mastercard
  "https://cdn-icons-png.flaticon.com/512/888/888879.png", // Revolut
  "https://cdn-icons-png.flaticon.com/512/6124/6124991.png", // Monzo
  "https://cdn-icons-png.flaticon.com/512/888/888841.png", // Stripe
  "https://cdn-icons-png.flaticon.com/512/825/825454.png", // Coinbase
];

// Utility to repeat icons enough times
const repeatedIcons = (icons: string[], repeat = 4) =>
  Array.from({ length: repeat }).flatMap(() => icons);

export default function IntegrationHero() {
  return (
    <section className="relative py-32 space-y-3 overflow-hidden ">
{/*    
   <BgGradient   position="bottom"  size="280% 280%" /> */}
      {/* Content */}
      <div className="relative max-w-lg mx-auto  mb-8 text-center">
        <div className="mx-auto  text-center ">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Connect all your financial accounts
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Link your banks, crypto wallets, and exchanges to get a complete view of your finances.
          </p>
        </div>
      </div>
      <Card className="mx-auto max-w-5xl  bg-card flex-row items-center border border-border/80 rounded-lg p-6">
        <div className="flex-1 text-center">
          <span className="text-7xl font-bold">13k+</span>
          <p className="text-lg font-semibold">Supported Institutions</p>
          <Button
            variant="link"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            className="text-md"
          >
            Explore all institutions{" "}
          </Button>
        </div>
        {/* Carousel */}
        <div className=" overflow-hidden  relative ">
          {/* Row 1 */}
          <div className="flex gap-10 whitespace-nowrap animate-scroll-left">
            {repeatedIcons(ICONS_ROW1, 4).map((src, i) => (
              <div
                key={i}
                className="h-16 w-16 flex-shrink-0 rounded-full bg-accent dark:bg-gray-200 shadow-md border border-border/80 flex items-center justify-center"
              >
                <img
                  src={src}
                  alt="icon"
                  className="h-10 w-10 object-contain"
                />
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex gap-10 whitespace-nowrap mt-6 animate-scroll-right">
            {repeatedIcons(ICONS_ROW2, 4).map((src, i) => (
              <div
                key={i}
                className="h-16 w-16 flex-shrink-0 border border-border/80 rounded-full bg-accent dark:bg-gray-200 shadow-md flex items-center justify-center"
              >
                <img
                  src={src}
                  alt="icon"
                  className="h-10 w-10 object-contain"
                />
              </div>
            ))}
          </div>

          {/* Fade overlays */}
          <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-card dark:from-card to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-card dark:from-card to-transparent pointer-events-none" />
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-5xl mx-auto ">
        {/* Card 1 */}
        <Card className="relative overflow-hidden rounded-lg border border-border/80 ">
          <div className="relative p-3 text-start">
            <span className="text-4xl font-black  ">1000+</span>
            <p className="mt-3 text-lg font-semibold text-muted-foreground">
              Supported Institutions
            </p>
            <Button variant="link" size="sm" className="mt-4 pl-0  font-medium">
              Explore
              <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </Card>

        {/* Card 2 */}
        <Card className="relative overflow-hidden rounded-lg border border-border/80   ">
          <div className="relative p-3 text-start">
            <span className="text-4xl font-black ">13k+</span>
            <p className="mt-3 text-lg font-semibold text-muted-foreground">
              Supported Tokens
            </p>
            <Button variant="link" size="sm" className="mt-4 pl-0 font-medium">
              View Full List
              <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </Card>

        {/* Card 3 */}
        <Card className="relative overflow-hidden rounded-lg border border-border/80 ">
          <div className="relative p-3 text-start">
            <span className="text-4xl font-black ">99.9%</span>
            <p className="mt-3 text-lg font-semibold text-muted-foreground">
              Uptime Guarantee
            </p>
            <Button variant="link" size="sm" className="mt-4 pl-0  font-medium">
              View Status Page
              <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </Card>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
