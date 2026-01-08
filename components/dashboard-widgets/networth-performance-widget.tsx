"use client";

import { ArrowRight, BarChart, TrendingUp } from "lucide-react";
import { NetWorthChart } from "@/components/networth/networth-chart";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { HeroiconsWallet16Solid, MingcuteChartBarFill } from "@/components/icons/icons";
import { Separator } from "../ui/separator";

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
    <Card className="relative border-border shadow-none hover:shadow-none   w-full flex flex-col gap-2 justify-between h-[450px]">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-xl bg-purple-400 flex items-center justify-center">
            <MingcuteChartBarFill className="h-4.5 w-4.5 text-purple-900" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            Net Worth Performance
          </h3>
        </div>
        <Link href="/networth">
          <Button
            variant="link"
            className="text-[11px] cursor-pointer  transition-colors h-7"
            size="sm"
          >
            View Analytics
            <ArrowRight className="h-3 w-3 " />
          </Button>
        </Link>
      </div>
    
      {/* Chart Container - Flex grow to fill available space */}
     
        <NetWorthChart mode="demo" height={280} className="border-0   " />
      
    </Card>
  );
}
