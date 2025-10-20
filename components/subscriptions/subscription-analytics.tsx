"use client";

import * as React from "react";
import { TrendingUp, TrendingDown, DollarSign, Calendar, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSubscriptionAnalytics } from "@/lib/queries/use-subscription-data";
import { subscriptionsApi } from "@/lib/services/subscriptions-api";
import { Skeleton } from "@/components/ui/skeleton";

export function SubscriptionAnalytics() {
  const { data: analytics, isLoading } = useSubscriptionAnalytics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  const stats = [
    {
      title: "Total Subscriptions",
      value: analytics.totalSubscriptions,
      subtitle: `${analytics.activeSubscriptions} active`,
      icon: Calendar,
      variant: "default" as const,
    },
    {
      title: "Monthly Spend",
      value: subscriptionsApi.formatCurrency(analytics.totalMonthlySpend),
      subtitle: subscriptionsApi.formatCurrency(analytics.totalYearlySpend) + "/year",
      icon: DollarSign,
      variant: "default" as const,
    },
    {
      title: "Average Cost",
      value: subscriptionsApi.formatCurrency(analytics.averageSubscriptionCost),
      subtitle: "per subscription",
      icon: TrendingUp,
      variant: "default" as const,
    },
    {
      title: "Spending Trend",
      value: `${analytics.spendingTrend.percentageChange > 0 ? "+" : ""}${analytics.spendingTrend.percentageChange.toFixed(1)}%`,
      subtitle: "vs last 30 days",
      icon: analytics.spendingTrend.percentageChange > 0 ? TrendingUp : TrendingDown,
      variant: analytics.spendingTrend.percentageChange > 0 ? "destructive" : ("success" as const),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Charges */}
      {analytics.upcomingCharges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Upcoming Charges (Next 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.upcomingCharges.slice(0, 5).map((charge) => (
                <div
                  key={charge.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-sm">{charge.subscriptionName}</p>
                    <p className="text-xs text-muted-foreground">
                      in {charge.daysUntil} {charge.daysUntil === 1 ? "day" : "days"}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {subscriptionsApi.formatCurrency(charge.amount)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
