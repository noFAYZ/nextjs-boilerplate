"use client";

import { ArrowRight, TrendingUp } from "lucide-react";
import { NetWorthChart } from "@/components/networth/networth-chart";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { HeroiconsWallet16Solid } from "@/components/icons/icons";

/**
 * NetWorth Performance Widget
 *
 * Displays networth performance chart and breakdown
 * - Live networth performance visualization
 * - Growth trends and metrics
 * - Quick view of key performance indicators
 * - Link to full networth analytics page
 */
export function NetWorthPerformanceWidget() {
  return (
    <Card className="relative border border-border/50 shadow-xs h-full w-full flex flex-col gap-4 ">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[rgb(251,146,60)] border flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-[rgb(124,45,18)]" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            Net Worth Performance
          </h3>
        </div>
        <Link href="/networth">
          <Button
            variant="outline"
            className="text-[11px] cursor-pointer hover:bg-muted transition-colors h-7"
            size="sm"
          >
            View Analytics
            <ArrowRight className="h-3 w-3 " />
          </Button>
        </Link>
      </div>

      {/* Chart Container - Flex grow to fill available space */}
      <div className="flex-1 flex items-center justify-center min-h-0 w-full">
        <NetWorthChart mode="demo" height={300} />
      </div>
    </Card>
  );
}
