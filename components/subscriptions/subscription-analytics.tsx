"use client";

import * as React from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  AlertCircle,
  CalendarClock,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useSubscriptionAnalytics } from "@/lib/queries/use-subscription-data";
import { subscriptionsApi } from "@/lib/services/subscriptions-api";
import { DuoIconsAlertOctagon, FluentMoneyHand20Regular, PhPiggyBankDuotone, SolarChatRoundMoneyBoldDuotone, SolarFireBoldDuotone, SolarInboxInBoldDuotone } from "../icons/icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getLogoUrl } from "@/lib/services/logo-service";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { cn } from "@/lib/utils";

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
<Accordion type="single" collapsible className="w-full mt-4">
  <AccordionItem
    value="upcoming-charges"
    className="border border-border/70 bg-gradient-to-b from-background/90 to-muted/30 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
  >
    <AccordionTrigger className="px-4 py-3 flex items-center justify-between hover:no-underline">
      <div className="flex items-center gap-2">
        <DuoIconsAlertOctagon className="h-5 w-5 text-primary" />
        <span className="font-semibold text-base">
          Upcoming Charges
        </span>
      {analytics.upcomingCharges.length > 0 && (
        <Badge
          variant="new"
          className="text-[10px] font-medium rounded-full "
          size="sm"
        >
          {analytics.upcomingCharges.length}
        </Badge>
      )}
        <span className="text-xs text-muted-foreground ml-1">(Next 30 Days)</span>
    
      </div>

    </AccordionTrigger>

    <AccordionContent className="px-5 pb-4 pt-1">
      {analytics.upcomingCharges.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-2"
        >
          {analytics.upcomingCharges.slice(0, 5).map((charge, i) => (
            <motion.div
              key={charge.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-1 ring-border bg-background">
                  {charge?.website ? (
                    <AvatarImage
                      src={getLogoUrl(charge?.website) || ""}
                      alt={charge.subscriptionName}
                    />
                  ) : (
                    <AvatarFallback className="bg-muted text-xs font-bold uppercase">
                      {charge.subscriptionName.slice(0, 2)}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div>
                  <p className="font-medium text-sm leading-tight">
                    {charge.subscriptionName}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <CalendarClock className="h-3 w-3" />
                    in {charge.daysUntil}{" "}
                    {charge.daysUntil === 1 ? "day" : "days"}
                  </p>
                </div>
              </div>

              <Badge
                variant="outline"
                className="text-sm font-semibold bg-background/80 backdrop-blur-sm flex items-center gap-1"
              >
                {subscriptionsApi.formatCurrency(charge.amount)}
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          No upcoming charges found.
        </p>
      )}
    </AccordionContent>
  </AccordionItem>
</Accordion>


    </motion.div>
  );
}
