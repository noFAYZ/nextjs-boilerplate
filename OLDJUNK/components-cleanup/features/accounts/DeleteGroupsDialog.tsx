"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import type { AccountGroup } from "@/lib/types/account-groups";
import { DeleteProgressDialog } from "@/components/ui/progress-dialog";
import type { OperationItem } from "@/lib/types/progress";
import { createOperationItem } from "@/lib/types/progress";

interface DeleteGroupsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: AccountGroup[];
  onConfirm: (groupIds: string[]) => Promise<{ success: string[]; failed: string[] }>;
}

export function DeleteGroupsDialog({
  open,
  onOpenChange,
  groups,
  onConfirm,
}: DeleteGroupsDialogProps) {
  // Convert AccountGroup[] to OperationItem[]
  const operationItems: OperationItem[] = groups.map(group => 
    createOperationItem(group.id, group.name)
  );

  return (
    <DeleteProgressDialog
      open={open}
      onOpenChange={onOpenChange}
      items={operationItems}
      onConfirm={onConfirm}
      itemType="group"
    />
  );
}