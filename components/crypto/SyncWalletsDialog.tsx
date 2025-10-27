"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import type { CryptoWallet } from "@/lib/types/crypto";
import { SyncProgressDialog } from "@/components/ui/progress-dialog";
import type { OperationItem } from "@/lib/types/progress";
import { createOperationItem } from "@/lib/types/progress";

interface SyncWalletsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wallets: CryptoWallet[];
  onConfirm: (walletIds: string[]) => Promise<{ success: string[]; failed: string[] }>;
}

export function SyncWalletsDialog({
  open,
  onOpenChange,
  wallets,
  onConfirm,
}: SyncWalletsDialogProps) {
  // Convert CryptoWallet[] to OperationItem[]
  const operationItems: OperationItem[] = wallets.map(wallet => 
    createOperationItem(wallet.id, wallet.name || `${wallet.address.slice(0, 8)}...${wallet.address.slice(-4)}`)
  );

  return (
    <SyncProgressDialog
      open={open}
      onOpenChange={onOpenChange}
      items={operationItems}
      onConfirm={onConfirm}
      title="Sync Crypto Wallets"
    />
  );
}
