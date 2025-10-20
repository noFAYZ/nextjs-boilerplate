"use client";

import * as React from "react";
import { X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSubscriptionUIStore } from "@/lib/stores/subscription-ui-store";
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
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Subscriptions</SheetTitle>
          <SheetDescription>
            Refine your subscription list by category, status, and billing cycle
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 p-6">
          {/* Categories */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Categories</Label>
              {(filters?.categories?.length || 0) > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs"
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
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category.value)}
                  >
                    {category.label}
                    {isSelected && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Status</Label>
              {(filters?.statuses?.length || 0) > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs"
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
                    className="cursor-pointer"
                    onClick={() => toggleStatus(status.value)}
                  >
                    {status.label}
                    {isSelected && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Billing Cycle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Billing Cycle</Label>
              {(filters?.billingCycles?.length || 0) > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs"
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
                    className="cursor-pointer"
                    onClick={() => toggleBillingCycle(cycle.value)}
                  >
                    {cycle.label}
                    {isSelected && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
          {hasActiveFilters && (
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                clearFilters();
                onClose();
              }}
            >
              Clear All
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
