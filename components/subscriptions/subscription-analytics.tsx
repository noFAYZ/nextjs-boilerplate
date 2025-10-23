"use client";

import * as React from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useSubscriptionAnalytics } from "@/lib/queries/use-subscription-data";
import { subscriptionsApi } from "@/lib/services/subscriptions-api";
import { FluentMoneyHand20Regular, PhPiggyBankDuotone, SolarChatRoundMoneyBoldDuotone, SolarFireBoldDuotone, SolarInboxInBoldDuotone } from "../icons/icons";

export function SubscriptionAnalytics() {
  const { data: analytics, isLoading } = useSubscriptionAnalytics();

  // Loading skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card
            key={i}
            className="bg-gradient-to-br from-muted/40 to-background border-muted/30"
          >
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
      icon: SolarInboxInBoldDuotone,
      color: "from-orange-500/10 to-amber-500/0",
    },
    {
      title: "Monthly Spend",
      value: subscriptionsApi.formatCurrency(analytics.totalMonthlySpend),
      subtitle:
        subscriptionsApi.formatCurrency(analytics.totalYearlySpend) + " / year",
      icon: SolarChatRoundMoneyBoldDuotone,
      color: "from-purple-500/10 to-pink-500/0",
    },
    {
      title: "Average Cost",
      value: subscriptionsApi.formatCurrency(
        analytics.averageSubscriptionCost
      ),
      subtitle: "per subscription",
      icon: TrendingUp,
      color: "from-emerald-500/10 to-emerald-500/0",
    },
    {
      title: "Spending Trend",
      value: `${
        analytics.spendingTrend.percentageChange > 0 ? "+" : ""
      }${analytics.spendingTrend.percentageChange.toFixed(1)}%`,
      subtitle: "vs last 30 days",
      icon:
        analytics.spendingTrend.percentageChange > 0
          ? SolarFireBoldDuotone
          : PhPiggyBankDuotone,
      color:
        analytics.spendingTrend.percentageChange > 0
          ? "from-red-500/10 to-red-500/0"
          : "from-emerald-500/10 to-emerald-500/0",
    },
  ];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Card className={`relative overflow-hidden group`}>
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`}
                />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 relative z-10">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className=" text-muted-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-2xl font-bold tracking-tight">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.subtitle}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Upcoming Charges Section */}
      {analytics.upcomingCharges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="border-muted/40 bg-gradient-to-b from-background to-muted/30">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2 font-semibold">
                <AlertCircle className="h-4 w-4 text-primary" />
                Upcoming Charges (Next 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analytics.upcomingCharges.slice(0, 5).map((charge, i) => (
                <motion.div
                  key={charge.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl border border-muted/30 hover:border-muted/50 hover:bg-muted/30 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm leading-tight">
                      {charge.subscriptionName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      in {charge.daysUntil}{" "}
                      {charge.daysUntil === 1 ? "day" : "days"}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-sm font-semibold bg-background/80 backdrop-blur-sm"
                  >
                    {subscriptionsApi.formatCurrency(charge.amount)}
                  </Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
