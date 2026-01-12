"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface NetWorthCardProps {
  currentNetWorth: number;
  previousNetWorth?: number;
  currency?: string;
  isLoading?: boolean;
  className?: string;
}

export function NetWorthCard({
  currentNetWorth,
  previousNetWorth,
  currency = "USD",
  isLoading = false,
  className,
}: NetWorthCardProps) {
  const change = previousNetWorth ? currentNetWorth - previousNetWorth : 0;
  const changePercent = previousNetWorth ? (change / previousNetWorth) * 100 : 0;
  const isPositive = change >= 0;

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Net Worth</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Total Net Worth</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Main Value */}
        <div>
          <p className="text-3xl font-bold">
            {currentNetWorth.toLocaleString("en-US", {
              style: "currency",
              currency,
              maximumFractionDigits: 0,
            })}
          </p>
        </div>

        {/* Change Indicator */}
        {previousNetWorth !== undefined && (
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-md",
                isPositive
                  ? "text-green-600 bg-green-50 dark:bg-green-950/30"
                  : "text-red-600 bg-red-50 dark:bg-red-950/30"
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {change.toLocaleString("en-US", {
                  style: "currency",
                  currency,
                  maximumFractionDigits: 0,
                })}{" "}
                ({changePercent.toFixed(1)}%)
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
