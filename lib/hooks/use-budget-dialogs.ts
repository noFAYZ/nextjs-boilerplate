import { useState } from 'react';

export type DeleteTargetType = { type: 'category' | 'group'; id: string; name: string } | null;

export function useBudgetDialogs() {
  // Add category dialog
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);
  const [selectedGroupForCategory, setSelectedGroupForCategory] = useState<string | null>(null);

  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTargetType>(null);

  // Transfer categories
  const [transferGroupOpen, setTransferGroupOpen] = useState(false);
  const [transferGroupId, setTransferGroupId] = useState<string | null>(null);

  // Spend modal
  const [spendModalOpen, setSpendModalOpen] = useState(false);
  const [selectedEnvelope, setSelectedEnvelope] = useState<any>(null);

  return {
    // Add category
    addCategoryDialogOpen,
    setAddCategoryDialogOpen,
    selectedGroupForCategory,
    setSelectedGroupForCategory,
    // Delete
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    deleteTarget,
    setDeleteTarget,
    // Transfer
    transferGroupOpen,
    setTransferGroupOpen,
    transferGroupId,
    setTransferGroupId,
    // Spend
    spendModalOpen,
    setSpendModalOpen,
    selectedEnvelope,
    setSelectedEnvelope,
  };
}
