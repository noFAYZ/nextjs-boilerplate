"use client";

import { AlertCircle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface DuplicateTransaction {
  id: string;
  date: string;
  amount: number;
  merchant: string;
  description?: string;
}

interface DuplicateDetectionBannerProps {
  // Summary mode (for analytics overview)
  duplicateCount?: number;
  onResolve?: () => Promise<void>;

  // Detailed mode (for specific duplicate group)
  duplicateGroupId?: string;
  merchant?: string;
  amount?: number;
  transactions?: DuplicateTransaction[];
  onIgnore?: (reason?: string) => Promise<void>;
  className?: string;
}

export function DuplicateDetectionBanner({
  duplicateGroupId,
  merchant,
  amount,
  transactions,
  onResolve,
  onIgnore,
  className,
  duplicateCount,
}: DuplicateDetectionBannerProps) {
  const [isResolving, setIsResolving] = useState(false);
  const [isIgnoring, setIsIgnoring] = useState(false);
  const [selectedKeepId, setSelectedKeepId] = useState<string | null>(null);
  const [mergeNotes, setMergeNotes] = useState(true);
  const [ignoreReason, setIgnoreReason] = useState("");

  // Check if in summary mode (no transactions provided)
  const isSummaryMode = !transactions || transactions.length === 0;

  const handleResolve = async () => {
    if (!isSummaryMode && !selectedKeepId) return;
    setIsResolving(true);
    try {
      if (isSummaryMode) {
        await onResolve?.();
      } else {
        // Detailed mode - pass transaction ID and merge notes
        const detailedResolve = onResolve as unknown as (id: string, merge: boolean) => Promise<void>;
        if (selectedKeepId) await detailedResolve(selectedKeepId, mergeNotes);
      }
    } finally {
      setIsResolving(false);
    }
  };

  const handleIgnore = async () => {
    setIsIgnoring(true);
    try {
      await onIgnore?.(ignoreReason);
    } finally {
      setIsIgnoring(false);
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900",
        className
      )}
    >
      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-amber-900 dark:text-amber-100">
          {isSummaryMode ? "Duplicate Transactions Found" : "Potential Duplicate Transaction"}
        </h3>
        <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
          {isSummaryMode
            ? `${duplicateCount || 0} potential duplicate transactions detected in this account`
            : `${transactions?.length || 0} similar transactions found for ${merchant} (${amount?.toLocaleString("en-US", { style: "currency", currency: "USD" })})`
          }
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {!isSummaryMode ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-xs">
                Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Resolve Duplicate Transactions</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Duplicate Transactions List */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Select which transaction to keep:
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {transactions?.map((txn) => (
                    <div
                      key={txn.id}
                      onClick={() => setSelectedKeepId(txn.id)}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-colors",
                        selectedKeepId === txn.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {selectedKeepId === txn.id ? (
                            <CheckCircle className="w-4 h-4 text-primary" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-border" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{txn.merchant}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(txn.date).toLocaleDateString()}
                          </p>
                          {txn.description && (
                            <p className="text-xs text-foreground mt-1">{txn.description}</p>
                          )}
                        </div>
                        <p className="text-sm font-medium text-right">
                          {txn.amount.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mergeNotes}
                    onChange={(e) => setMergeNotes(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Merge notes from deleted transactions</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    setIsIgnoring(true);
                    try {
                      await onIgnore("User marked as not a duplicate");
                    } finally {
                      setIsIgnoring(false);
                    }
                  }}
                  disabled={isIgnoring || isResolving}
                >
                  Not a Duplicate
                </Button>
                <Button
                  size="sm"
                  onClick={handleResolve}
                  disabled={!selectedKeepId || isResolving}
                  className="flex-1"
                >
                  {isResolving ? "Resolving..." : "Keep Selected"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        ) : (
          <Button
            size="sm"
            onClick={handleResolve}
            disabled={isResolving}
            className="text-xs"
          >
            {isResolving ? "Processing..." : "Review & Resolve"}
          </Button>
        )}

        <Button
          size="sm"
          variant="ghost"
          onClick={handleIgnore}
          disabled={isIgnoring}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
