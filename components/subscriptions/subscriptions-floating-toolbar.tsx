"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import type { UserSubscription } from "@/lib/types/subscription";
import { PhUsersDuotone, SolarPauseCircleBoldDuotone, SolarPlayCircleBoldDuotone, SolarRefreshCircleBoldDuotone, SolarTrashBinTrashOutline } from "../icons/icons";

interface SubscriptionsFloatingToolbarProps {
  selectedCount: number;
  totalMonthlySpend: number;
  selectedSubscriptions: UserSubscription[];
  onClearSelection: () => void;
  onDelete: (subscription: UserSubscription) => void;
  isLoading?: boolean;
}

export function SubscriptionsFloatingToolbar({
  selectedCount,
  totalMonthlySpend,
  selectedSubscriptions,
  onClearSelection,
  onDelete,
  isLoading = false,
}: SubscriptionsFloatingToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 px-3 py-2 sm:px-4 sm:py-3">
      <div className="max-w-7xl mx-auto bg-muted border border-border/80 rounded-2xl backdrop-blur-sm supports-[backdrop-filter]:bg-background/95 animate-in slide-in-from-bottom-3 duration-100 shadow-sm">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-6 p-4">
          {/* Left Section - Info */}
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary/10 flex-shrink-0">
              <span className="text-sm font-bold text-primary">{selectedCount}</span>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Selected</p>
                <p className="text-sm font-semibold">{selectedCount} subscription{selectedCount !== 1 ? 's' : ''}</p>
              </div>
              <div className="h-6 w-px bg-border/30" />
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Monthly Spend</p>
                <p className="text-sm font-semibold">
                  <CurrencyDisplay
                    amountUSD={totalMonthlySpend}
                    variant="small"
                    isLoading={isLoading}
                  />
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSelection}
              disabled={isLoading}
              icon={<PhUsersDuotone className="h-4.5 w-4.5" />}
            >
              Reassign
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSelection}
              disabled={isLoading}
              icon={<SolarRefreshCircleBoldDuotone className="h-4.5 w-4.5" />}
            >
              Renew
            </Button>
            <Button
              variant="successbrand"
              size="sm"
              onClick={onClearSelection}
              disabled={isLoading}
              icon={<SolarPlayCircleBoldDuotone className="h-5 w-5" />}
            >
              Activate
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onClearSelection}
              disabled={isLoading}
              icon={<SolarPauseCircleBoldDuotone className="h-4.5 w-4.5" />}
            >
              Pause
            </Button>
            <Button
              variant="delete"
              size="sm"
              onClick={() => {
                selectedSubscriptions.forEach((sub) => onDelete(sub));
              }}
              disabled={isLoading}
              icon={<SolarTrashBinTrashOutline className="h-4 w-4" />}
            >
              Delete
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={onClearSelection}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile & Tablet Layout */}
        <div className="md:hidden space-y-3 p-3">
          {/* Info Section */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary/10 flex-shrink-0">
                <span className="text-sm font-bold text-primary">{selectedCount}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Selected</p>
                <p className="text-sm font-semibold truncate">{selectedCount} subscription{selectedCount !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={onClearSelection}
              disabled={isLoading}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Monthly Spend */}
          <div className="flex items-center justify-between text-xs px-2">
            <span className="text-muted-foreground uppercase tracking-wide">Monthly Spend</span>
            <span className="font-semibold">
              <CurrencyDisplay
                amountUSD={totalMonthlySpend}
                variant="small"
                isLoading={isLoading}
              />
            </span>
          </div>

          {/* Actions Grid */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSelection}
              disabled={isLoading}
              icon={<PhUsersDuotone className="h-4 w-4" />}
              className="text-xs"
            >
              Reassign
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSelection}
              disabled={isLoading}
              icon={<SolarRefreshCircleBoldDuotone className="h-4 w-4" />}
              className="text-xs"
            >
              Renew
            </Button>
            <Button
              variant="successbrand"
              size="sm"
              onClick={onClearSelection}
              disabled={isLoading}
              icon={<SolarPlayCircleBoldDuotone className="h-4 w-4" />}
              className="text-xs"
            >
              Activate
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onClearSelection}
              disabled={isLoading}
              icon={<SolarPauseCircleBoldDuotone className="h-4 w-4" />}
              className="text-xs"
            >
              Pause
            </Button>
            <Button
              variant="delete"
              size="sm"
              onClick={() => {
                selectedSubscriptions.forEach((sub) => onDelete(sub));
              }}
              disabled={isLoading}
              icon={<SolarTrashBinTrashOutline className="h-4 w-4" />}
              className="col-span-2 text-xs"
            >
              Delete Selected
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
