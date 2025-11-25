"use client";

import * as React from "react";
import { Loader2, Inbox } from "lucide-react";
import { SubscriptionCard } from "./subscription-card";
import { SubscriptionsDataTable } from "./subscriptions-data-table";
import { SubscriptionCardSkeleton } from "./subscription-card-skeleton";
import { useSubscriptions } from "@/lib/queries/use-subscription-data";
import { useSubscriptionUIStore } from "@/lib/stores/subscription-ui-store";
import type { UserSubscription } from "@/lib/types/subscription";
import { cn } from "@/lib/utils";
import { SolarInboxInBoldDuotone } from "../icons/icons";

interface SubscriptionListProps {
  onEdit?: (subscription: UserSubscription) => void;
  onDelete?: (subscription: UserSubscription) => void;
  onSelect?: (subscription: UserSubscription) => void;
  activeTab?: "all" | "active" | "trial" | "cancelled";
  className?: string;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

export function SubscriptionList({
  onEdit,
  onDelete,
  onSelect,
  activeTab = "all",
  className,
  selectedIds = [],
  onSelectionChange,
}: SubscriptionListProps) {
  const { data, isLoading, error } = useSubscriptions();
  const viewPreferences = useSubscriptionUIStore((state) => state.viewPreferences);

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const allSubscriptions = data || [];

  // Filter subscriptions based on active tab
  const subscriptions = React.useMemo(() => {
    if (activeTab === "all") return allSubscriptions;
    if (activeTab === "active")
      return allSubscriptions.filter((s) => s.status === "ACTIVE");
    if (activeTab === "trial")
      return allSubscriptions.filter((s) => s.status === "TRIAL");
    if (activeTab === "cancelled")
      return allSubscriptions.filter(
        (s) => s.status === "CANCELLED" || s.status === "EXPIRED"
      );
    return allSubscriptions;
  }, [allSubscriptions, activeTab]);

  // NOW WE CAN DO CONDITIONAL RETURNS
  if (isLoading) {
    return <SubscriptionListSkeleton view={viewPreferences.subscriptionsView} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <p className="text-sm text-destructive">Failed to load subscriptions</p>
        <p className="text-xs text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <SolarInboxInBoldDuotone className="h-12 w-12 text-muted-foreground/50" />
        <p className="text-sm font-medium">
          {activeTab === "all"
            ? "No subscriptions found"
            : `No ${activeTab} subscriptions`}
        </p>
        <p className="text-xs text-muted-foreground">
          {activeTab === "all"
            ? "Add your first subscription to start tracking"
            : `You don't have any ${activeTab} subscriptions`}
        </p>
      </div>
    );
  }

  // Use datatable for list view, cards for grid and compact views
  if (viewPreferences.subscriptionsView === "list") {
    return (
      <SubscriptionsDataTable
        subscriptions={subscriptions}
        isLoading={isLoading}
        onEdit={onEdit}
        onDelete={onDelete}
        selectedIds={selectedIds}
        onSelectionChange={onSelectionChange}
      />
    );
  }

  const gridClass = {
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
    compact: "flex flex-col gap-2",
  }[viewPreferences.subscriptionsView] || "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";

  return (
    <div className={cn(gridClass, className)}>
      {subscriptions.map((subscription) => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onSelect}
        />
      ))}
    </div>
  );
}

function SubscriptionListSkeleton({
  view,
}: {
  view: 'grid' | 'list' | 'compact';
}) {
  const gridClasses = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    list: 'flex flex-col gap-3',
    compact: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3',
  };

  const count = view === 'compact' ? 8 : view === 'grid' ? 6 : 4;

  return (
    <div className={gridClasses[view]}>
      {Array.from({ length: count }).map((_, i) => (
        <SubscriptionCardSkeleton key={i} />
      ))}
    </div>
  );
}
