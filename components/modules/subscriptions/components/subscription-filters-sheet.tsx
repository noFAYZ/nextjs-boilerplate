"use client";

import * as React from "react";
import { X, Filter } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSubscriptionUIStore } from "@/lib/features/subscriptions/stores";
import { cn } from "@/lib/utils";
import type { SubscriptionCategory, SubscriptionStatus, BillingCycle } from "@/lib/types/subscription";

interface SubscriptionFiltersSheetProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORIES: { value: SubscriptionCategory; label: string }[] = [
  { value: "STREAMING", label: "Streaming" },
  { value: "MUSIC", label: "Music" },
  { value: "SOFTWARE", label: "Software" },
  { value: "CLOUD_STORAGE", label: "Cloud Storage" },
  { value: "GAMING", label: "Gaming" },
  { value: "FITNESS", label: "Fitness" },
  { value: "PRODUCTIVITY", label: "Productivity" },
  { value: "COMMUNICATION", label: "Communication" },
  { value: "SECURITY", label: "Security" },
  { value: "EDUCATION", label: "Education" },
  { value: "OTHER", label: "Other" },
];

const STATUSES: { value: SubscriptionStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "TRIAL", label: "Trial" },
  { value: "PAUSED", label: "Paused" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "EXPIRED", label: "Expired" },
  { value: "PAYMENT_FAILED", label: "Payment Failed" },
];

const BILLING_CYCLES: { value: BillingCycle; label: string }[] = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "WEEKLY", label: "Weekly" },
];

export function SubscriptionFiltersSheet({
  open,
  onClose,
}: SubscriptionFiltersSheetProps) {
  const { filters, setCategoryFilter, setStatusFilter, setBillingCycleFilter, clearFilters } =
    useSubscriptionUIStore();

  const toggleCategory = (category: SubscriptionCategory) => {
    const current = filters?.categories || [];
    if (current.includes(category)) {
      setCategoryFilter(current.filter((c) => c !== category));
    } else {
      setCategoryFilter([...current, category]);
    }
  };

  const toggleStatus = (status: SubscriptionStatus) => {
    const current = filters?.statuses || [];
    if (current.includes(status)) {
      setStatusFilter(current.filter((s) => s !== status));
    } else {
      setStatusFilter([...current, status]);
    }
  };

  const toggleBillingCycle = (cycle: BillingCycle) => {
    const current = filters?.billingCycles || [];
    if (current.includes(cycle)) {
      setBillingCycleFilter(current.filter((c) => c !== cycle));
    } else {
      setBillingCycleFilter([...current, cycle]);
    }
  };

  const hasActiveFilters =
    (filters?.categories?.length || 0) > 0 ||
    (filters?.statuses?.length || 0) > 0 ||
    (filters?.billingCycles?.length || 0) > 0;

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-w-xl mx-auto rounded-b-none">
        <DrawerHeader className="pb-4">
          <DrawerTitle className="text-lg">Filters</DrawerTitle>
          <DrawerDescription className="mt-1">
            Refine your subscription list by category, status, and billing cycle
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Categories Section */}
          <div className="px-4 pt-6 pb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Filter className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">Categories</h3>
              </div>
              {(filters?.categories?.length || 0) > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs hover:text-destructive"
                  onClick={() => setCategoryFilter([])}
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const isSelected = filters?.categories?.includes(category.value) || false;
                return (
                  <Badge
                    key={category.value}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-all",
                      isSelected && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => toggleCategory(category.value)}
                  >
                    {category.label}
                    {isSelected && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                );
              })}
            </div>
          </div>

          <Separator className="my-2 mx-4" />

          {/* Status Section */}
          <div className="px-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Filter className="h-4 w-4 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">Status</h3>
              </div>
              {(filters?.statuses?.length || 0) > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs hover:text-destructive"
                  onClick={() => setStatusFilter([])}
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((status) => {
                const isSelected = filters?.statuses?.includes(status.value) || false;
                return (
                  <Badge
                    key={status.value}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-all",
                      isSelected && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => toggleStatus(status.value)}
                  >
                    {status.label}
                    {isSelected && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                );
              })}
            </div>
          </div>

          <Separator className="my-2 mx-4" />

          {/* Billing Cycle Section */}
          <div className="px-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Filter className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">Billing Cycle</h3>
              </div>
              {(filters?.billingCycles?.length || 0) > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs hover:text-destructive"
                  onClick={() => setBillingCycleFilter([])}
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {BILLING_CYCLES.map((cycle) => {
                const isSelected = filters?.billingCycles?.includes(cycle.value) || false;
                return (
                  <Badge
                    key={cycle.value}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-all",
                      isSelected && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => toggleBillingCycle(cycle.value)}
                  >
                    {cycle.label}
                    {isSelected && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                );
              })}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="px-4 py-4">
              <Button
                variant="outline"
                className="w-full text-destructive hover:bg-destructive/5"
                onClick={() => {
                  clearFilters();
                  onClose();
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
