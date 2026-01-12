"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Archive,
  MoreHorizontal,
  RotateCcw,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface AccountLifecycleActionsProps {
  accountId: string;
  accountStatus: "ACTIVE" | "ARCHIVED" | "CLOSED";
  onArchive?: () => Promise<void>;
  onReopen?: () => Promise<void>;
  onClose?: () => Promise<void>;
  className?: string;
}

export function AccountLifecycleActions({
  accountId,
  accountStatus,
  onArchive,
  onReopen,
  onClose,
  className,
}: AccountLifecycleActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    action: "archive" | "reopen" | "close" | null;
  }>({ action: null });

  const handleAction = async (
    action: "archive" | "reopen" | "close",
    callback?: () => Promise<void>
  ) => {
    if (!callback) return;

    setIsProcessing(true);
    try {
      await callback();
      setIsOpen(false);
      setConfirmDialog({ action: null });
    } finally {
      setIsProcessing(false);
    }
  };

  const getAvailableActions = () => {
    const actions = [];

    if (accountStatus === "ACTIVE") {
      actions.push({
        label: "Archive Account",
        icon: Archive,
        action: "archive" as const,
        description: "Archive this account (can be reopened later)",
        variant: "default" as const,
        callback: onArchive,
      });
    }

    if (accountStatus === "ARCHIVED") {
      actions.push({
        label: "Reopen Account",
        icon: RotateCcw,
        action: "reopen" as const,
        description: "Reopen this archived account",
        variant: "default" as const,
        callback: onReopen,
      });
    }

    if (accountStatus !== "CLOSED") {
      actions.push({
        label: "Close Account",
        icon: Trash2,
        action: "close" as const,
        description: "Permanently close this account (cannot be undone)",
        variant: "destructive" as const,
        callback: onClose,
      });
    }

    return actions;
  };

  const actions = getAvailableActions();

  if (actions.length === 0) {
    return null;
  }

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-8 w-8 p-0", className)}
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() => {
                    setConfirmDialog({ action: action.action });
                  }}
                  disabled={isProcessing}
                  className={cn(
                    action.variant === "destructive" && "text-destructive"
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span>{action.label}</span>
                </DropdownMenuItem>
                {index < actions.length - 1 && <DropdownMenuSeparator />}
              </div>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
      {confirmDialog.action && (
        <Dialog
          open={!!confirmDialog.action}
          onOpenChange={(open) => {
            if (!open) setConfirmDialog({ action: null });
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {confirmDialog.action === "archive" && "Archive Account"}
                {confirmDialog.action === "reopen" && "Reopen Account"}
                {confirmDialog.action === "close" && "Close Account"}
              </DialogTitle>
              <DialogDescription>
                {confirmDialog.action === "archive" &&
                  "Archive this account to hide it from your view. You can reopen it anytime. All transactions will be preserved."}
                {confirmDialog.action === "reopen" &&
                  "Reopen this account to restore it to active status. You'll be able to view all transactions again."}
                {confirmDialog.action === "close" && (
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span>
                      Close this account permanently. This action cannot be undone.
                      All associated data will be archived.
                    </span>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfirmDialog({ action: null })}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const action = actions.find(
                    (a) => a.action === confirmDialog.action
                  );
                  if (action) {
                    handleAction(action.action, action.callback);
                  }
                }}
                disabled={isProcessing}
                variant={
                  confirmDialog.action === "close" ? "destructive" : "default"
                }
              >
                {isProcessing ? "Processing..." : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
