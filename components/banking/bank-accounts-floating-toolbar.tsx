"use client";

import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import type { BankAccount } from "@/lib/types/banking";
import { 
  SolarRefreshCircleBoldDuotone, 
  SolarTrashBinTrashOutline,
  StreamlineUltimatePowerPlugDisconnected
} from "../icons/icons";

interface BankAccountsFloatingToolbarProps {
  selectedCount: number;
  totalBalance: number;
  selectedAccounts: BankAccount[];
  onClearSelection: () => void;
  onDisconnect: () => void;
  onDelete: () => void;
  onSync: () => void;
  isLoading?: boolean;
}

export function BankAccountsFloatingToolbar({
  selectedCount,
  totalBalance,
  selectedAccounts,
  onClearSelection,
  onDisconnect,
  onDelete,
  onSync,
  isLoading = false,
}: BankAccountsFloatingToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="">
      <div className="fixed bottom-6 left-0 right-0  max-w-7xl mx-auto bg-card border border-border/80 rounded-lg backdrop-blur-sm supports-[backdrop-filter]:bg-card animate-in slide-in-from-bottom-3 duration-100 shadow-sm">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-6 p-2">
          {/* Left Section - Info */}
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary/10 flex-shrink-0">
              <span className="text-sm font-bold text-primary">{selectedCount}</span>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Selected</p>
                <p className="text-sm font-semibold">{selectedCount} account{selectedCount !== 1 ? 's' : ''}</p>
              </div>
              <div className="h-6 w-px bg-border/30" />
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Total Balance</p>
                <p className="text-sm font-semibold">
                  <CurrencyDisplay
                    amountUSD={totalBalance}
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
              size="xs"
              onClick={() => onSync()}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <SolarRefreshCircleBoldDuotone className="h-4.5 w-4.5" />
                  Sync
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              size="xs"
              onClick={() => onDisconnect()}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                <>
                  <StreamlineUltimatePowerPlugDisconnected className="h-4.5 w-4.5" />
                  Disconnect
                </>
              )}
            </Button>
            <Button
              variant="delete"
              size="xs"
              onClick={() => onDelete()}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <SolarTrashBinTrashOutline className="h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
            {!isLoading && (
              <Button
                variant="ghost"
                size="xs"
                onClick={onClearSelection}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
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
                <p className="text-sm font-semibold truncate">{selectedCount} account{selectedCount !== 1 ? 's' : ''}</p>
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

          {/* Total Balance */}
          <div className="flex items-center justify-between text-xs px-2">
            <span className="text-muted-foreground uppercase tracking-wide">Total Balance</span>
            <span className="font-semibold">
              <CurrencyDisplay
                amountUSD={totalBalance}
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
              onClick={() => onSync()}
              disabled={isLoading}
              className="text-xs gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Syncing
                </>
              ) : (
                <>
                  <SolarRefreshCircleBoldDuotone className="h-4 w-4" />
                  Sync
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onDisconnect()}
              disabled={isLoading}
              className="text-xs gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Disconnecting
                </>
              ) : (
                <>
                  <StreamlineUltimatePowerPlugDisconnected className="h-4 w-4" />
                  Disconnect
                </>
              )}
            </Button>
            <Button
              variant="delete"
              size="sm"
              onClick={() => onDelete()}
              disabled={isLoading}
              className="col-span-2 text-xs gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting Selected
                </>
              ) : (
                <>
                  <SolarTrashBinTrashOutline className="h-4 w-4" />
                  Delete Selected
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
