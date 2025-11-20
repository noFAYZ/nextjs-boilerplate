"use client";

import * as React from "react";
import { CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useSubscriptionAnalytics } from "@/lib/queries/use-subscription-data";
import { subscriptionsApi } from "@/lib/services/subscriptions-api";
import { DuoIconsAlertOctagon } from "../icons/icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getLogoUrl } from "@/lib/services/logo-service";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

export function UpcomingCharges() {
  const { data: analytics, isLoading } = useSubscriptionAnalytics();

  if (isLoading) {
    return (
      <div className="border border-border/70 bg-gradient-to-b from-background/90 to-muted/30 rounded-lg shadow-sm p-4 space-y-3">
        <Skeleton className="h-6 w-32" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!analytics || analytics.upcomingCharges.length === 0) {
    return null;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value="upcoming-charges"
        className="border border-border/70 bg-gradient-to-b from-background/90 to-muted/30 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
      >
        <AccordionTrigger className="px-4 py-3 flex items-center justify-between hover:no-underline">
          <div className="flex items-center gap-2">
            <DuoIconsAlertOctagon className="h-5 w-5 text-primary" />
            <span className="font-semibold text-base">Upcoming Charges</span>
            {analytics.upcomingCharges.length > 0 && (
              <Badge
                variant="new"
                className="text-[10px] font-medium rounded-full"
                size="sm"
              >
                {analytics.upcomingCharges.length}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">(Next 30 Days)</span>
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
              {analytics.upcomingCharges.slice(0, 10).map((charge, i) => (
                <motion.div
                  key={charge.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-10 w-10 ring-1 ring-border bg-background flex-shrink-0">
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

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-tight truncate">
                        {charge.subscriptionName}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CalendarClock className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
                          in {charge.daysUntil}{" "}
                          {charge.daysUntil === 1 ? "day" : "days"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className="text-sm font-semibold bg-background/80 backdrop-blur-sm flex-shrink-0 ml-2"
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
  );
}
