"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Plus,
  ArrowRight,
  Loader2,
  ArrowLeft,
  Trash2,
  FolderOpen,
  AlertTriangle,
  AlertOctagonIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccountGroupsStore } from "@/lib/stores";
import type { AccountGroup } from "@/lib/types/account-groups";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreateGroupDialog } from "./CreateGroupDialog";
import { AddAccountToGroupDialog } from "./AddAccountToGroupDialog";
import { DeleteGroupsDialog } from "./DeleteGroupsDialog";
import { ProiconsFolderAdd, SolarWallet2Outline, StreamlineFlexWallet, StreamlineFlexWalletAdd } from "../icons/icons";
import { Separator } from "../ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarImage } from "../ui/avatar";
import AvatarGroup from "../ui/avatar-group";

interface AccountGroupsGridProps {
  onGroupSelect?: (group: AccountGroup) => void;
  limit?: number; // Limit number of groups shown
  onCreateGroup?: () => void;
}

interface GroupDetailsViewProps {
  group: AccountGroup;
  onBack: () => void;
  onAddAccount: (group: AccountGroup) => void;
}

function GroupDetailsView({
  group,
  onBack,
  onAddAccount,
}: GroupDetailsViewProps) {
  const router = useRouter();
  const [removingWallet, setRemovingWallet] = useState<string | null>(null);
  const [removingAccount, setRemovingAccount] = useState<string | null>(null);
  const [isRemoveMode, setIsRemoveMode] = useState(false);
  const [selectedWallets, setSelectedWallets] = useState<Set<string>>(
    new Set()
  );
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(
    new Set()
  );

  const handleRemoveWallet = async (walletId: string) => {
    try {
      setRemovingWallet(walletId);
      // TODO: Implement API call to remove wallet from group
      console.log("Removing wallet:", walletId, "from group:", group.id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // The hook will automatically refresh the data
    } catch (error) {
      console.error("Failed to remove wallet from group:", error);
    } finally {
      setRemovingWallet(null);
    }
  };

  const handleRemoveAccount = async (accountId: string) => {
    try {
      setRemovingAccount(accountId);
      // TODO: Implement API call to remove account from group
      console.log("Removing account:", accountId, "from group:", group.id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // The hook will automatically refresh the data
    } catch (error) {
      console.error("Failed to remove account from group:", error);
    } finally {
      setRemovingAccount(null);
    }
  };

  const handleBatchRemove = async () => {
    try {
      const walletIds = Array.from(selectedWallets);
      const accountIds = Array.from(selectedAccounts);

      console.log(
        "Batch removing wallets:",
        walletIds,
        "and accounts:",
        accountIds,
        "from group:",
        group.id
      );

      // TODO: Implement API calls for batch removal
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Reset selection and exit remove mode
      setSelectedWallets(new Set());
      setSelectedAccounts(new Set());
      setIsRemoveMode(false);

      // The hook will automatically refresh the data
    } catch (error) {
      console.error("Failed to batch remove accounts from group:", error);
    }
  };

  const toggleWalletSelection = (walletId: string) => {
    const newSelection = new Set(selectedWallets);
    if (newSelection.has(walletId)) {
      newSelection.delete(walletId);
    } else {
      newSelection.add(walletId);
    }
    setSelectedWallets(newSelection);
  };

  const toggleAccountSelection = (accountId: string) => {
    const newSelection = new Set(selectedAccounts);
    if (newSelection.has(accountId)) {
      newSelection.delete(accountId);
    } else {
      newSelection.add(accountId);
    }
    setSelectedAccounts(newSelection);
  };

  const handleWalletClick = (wallet: { id: string }) => {
    if (isRemoveMode) {
      toggleWalletSelection(wallet.id);
    } else {
      // Navigate to wallet page
      router.push(`/dashboard/accounts/wallet/${wallet.id}`);
    }
  };

  const cancelRemoveMode = () => {
    setIsRemoveMode(false);
    setSelectedWallets(new Set());
    setSelectedAccounts(new Set());
  };

  const hasSelectedItems =
    selectedWallets.size > 0 || selectedAccounts.size > 0;

  const hasAccounts =
    (group.financialAccounts && group.financialAccounts.length > 0) ||
    (group.cryptoWallets && group.cryptoWallets.length > 0);

  return (
    <div className="space-y-8">
      {/* Header - Fully Responsive */}
      <div className="flex flex-col gap-4 sm:gap-0">
        {/* Top Row - Back button and Group Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="subtle"
              size="sm"
              className="text-xs font-semibold shrink-0"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden xs:inline">Back</span>
            </Button>

            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-[0.7rem] flex items-center justify-center text-base sm:text-lg shrink-0"
                style={{
                  backgroundColor: group.color
                    ? `${group.color}30`
                    : "rgb(243 244 246)",
                  color: group.color || "rgb(107 114 128)",
                }}
              >
                {group.icon || "📁"}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold truncate">
                  {group.name}
                </h2>
                {group.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-none">
                    {group.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Action Button (Only show main action on small screens) */}
          <div className="sm:hidden">
            {isRemoveMode ? (
              <Button
                onClick={cancelRemoveMode}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Cancel
              </Button>
            ) : (
              <Button
                onClick={() => onAddAccount(group)}
                size="sm"
                className="text-xs"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Desktop Action Buttons - Hidden on mobile, full on desktop */}
        <div className="hidden sm:flex sm:items-center sm:justify-end sm:-mt-2">
          {isRemoveMode ? (
            <div className="flex items-center gap-2">
              <Button
                onClick={cancelRemoveMode}
                variant="subtle"
                size="sm"
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBatchRemove}
                size="sm"
                variant="destructive"
                disabled={!hasSelectedItems}
                className="text-xs shadow-none"
              >
                <span className="flex items-center gap-1">
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden md:inline">Remove Selected</span>
                  <span className="md:hidden">Remove</span>(
                  {selectedWallets.size + selectedAccounts.size})
                </span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {hasAccounts && (
                <Button
                  onClick={() => setIsRemoveMode(true)}
                  variant="soft"
                  size="sm"
                  className="text-xs shadow-none"
                >
                  <span className="flex items-center gap-1">
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden lg:inline">Remove</span>
                  </span>
                </Button>
              )}
              <Button
                onClick={() => onAddAccount(group)}
                size="sm"
                className="text-xs shadow-none"
              >
                <span className="flex items-center gap-1">
                  <StreamlineFlexWalletAdd className="h-4 w-4" />
                  <span className="hidden md:inline">Add Account</span>
                  <span className="md:hidden">Add</span>
                </span>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Remove Mode Actions - Only show when in remove mode on mobile */}
        {isRemoveMode && (
          <div className="sm:hidden flex items-center justify-between bg-destructive/10 dark:bg-destructive/20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-sm font-medium text-destructive">
                Remove Mode Active
              </span>
            </div>
            <Button
              onClick={handleBatchRemove}
              size="sm"
              variant="destructive"
              disabled={!hasSelectedItems}
              className="text-xs"
            >
              <span className="flex items-center gap-1">
                <Trash2 className="h-3 w-3" />
                Remove ({selectedWallets.size + selectedAccounts.size})
              </span>
            </Button>
          </div>
        )}
      </div>

      {/* Accounts in this group - Enhanced Accordions */}
      {hasAccounts ? (
        <div className="space-y-4">
          <Accordion
            type="multiple"
            defaultValue={["bank-accounts", "crypto-wallets"]}
            className="w-full space-y-3"
          >
            {/* Bank Accounts Accordion */}
            {group.financialAccounts && group.financialAccounts.length > 0 && (
              <AccordionItem
                value="bank-accounts"
                className="border-none shadow-sm bg-gradient-to-r from-green-50/50 to-green-100/30 dark:from-green-950/30 dark:to-green-900/20 rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="text-sm sm:text-base font-semibold px-4 sm:px-6 py-3 sm:py-4 hover:no-underline hover:bg-green-50/60 dark:hover:bg-green-900/20 transition-colors duration-200 border-none">
                  <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm shrink-0">
                      <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="flex flex-col items-start min-w-0 flex-1">
                      <span className="text-green-900 dark:text-green-100 font-semibold truncate">
                        Bank Accounts
                      </span>
                      <span className="text-xs text-green-700/70 dark:text-green-300/70 font-normal truncate sm:text-wrap">
                        <span className="inline sm:hidden">
                          {group.financialAccounts.length} • $
                          {group.financialAccounts
                            .reduce((sum, acc) => sum + acc.balance, 0)
                            .toLocaleString()}
                        </span>
                        <span className="hidden sm:inline">
                          {group.financialAccounts.length} account
                          {group.financialAccounts.length !== 1 ? "s" : ""} • $
                          {group.financialAccounts
                            .reduce((sum, acc) => sum + acc.balance, 0)
                            .toLocaleString()}
                        </span>
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                    {group.financialAccounts.map((account, index) => (
                      <Card
                        key={account.id}
                        className={`group hover:shadow-lg cursor-pointer border-green-100/50 dark:border-green-800/30 bg-white/60 dark:bg-green-950/20 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${
                          isRemoveMode
                            ? "hover:bg-green-50/80 dark:hover:bg-green-900/30"
                            : ""
                        } ${
                          selectedAccounts.has(account.id)
                            ? "ring-2 ring-green-500/50 bg-green-50 dark:bg-green-900/40 shadow-lg scale-[1.02]"
                            : ""
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() =>
                          isRemoveMode && toggleAccountSelection(account.id)
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              {isRemoveMode && (
                                <div className="flex items-center">
                                  <div
                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                                      selectedAccounts.has(account.id)
                                        ? "bg-green-500 border-green-500 scale-110"
                                        : "border-green-300 hover:border-green-400"
                                    }`}
                                  >
                                    {selectedAccounts.has(account.id) && (
                                      <svg
                                        className="w-3 h-3 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                              )}
                              <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-400 to-green-500 shadow-md group-hover:shadow-lg transition-all duration-300">
                                <Building2 className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                                  {account.name}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                  {account.institutionName || account.type}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-sm text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                ${account.balance.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {account.currency}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Crypto Wallets Accordion */}
            {group.cryptoWallets && group.cryptoWallets.length > 0 && (
              <AccordionItem
                value="crypto-wallets"
                className="border shadow-sm rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="text-sm sm:text-base font-semibold px-4 sm:px-6 py-3 sm:py-4 hover:no-underline border-none">
                  <div className="flex items-center justify-between w-full min-w-0 gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center bg-accent shrink-0">
                        <StreamlineFlexWallet className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="flex flex-col items-start min-w-0">
                        <span className="font-semibold truncate">
                          Crypto Wallets
                        </span>
                        <span className="text-xs text-muted-foreground truncate sm:hidden">
                          {group.cryptoWallets.length} wallets
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm sm:text-base font-bold text-muted-foreground">
                        $
                        {group.cryptoWallets
                          .reduce(
                            (sum, wallet) =>
                              sum + parseFloat(wallet.totalBalanceUsd || "0"),
                            0
                          )
                          .toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground hidden sm:block">
                        {group.cryptoWallets.length} wallet
                        {group.cryptoWallets.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                    {group.cryptoWallets.map((wallet, index) => (
                      <Card
                        key={wallet.id}
                        className={`group shadow-none cursor-pointer border  py-0 bg-card hover:bg-muted/70 rounded-2xl ${
                          isRemoveMode ? "" : ""
                        } ${
                          selectedWallets.has(wallet.id)
                            ? " bg-accent shadow-xl "
                            : ""
                        }`}
                        style={{ animationDelay: `${index * 75}ms` }}
                        onClick={() => handleWalletClick(wallet)}
                      >
                        <CardContent className="px-3 sm:px-4 py-2 sm:py-3 relative overflow-hidden">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1">
                              {isRemoveMode && (
                                <div className="flex items-center">
                                  <div
                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                                      selectedWallets.has(wallet.id)
                                        ? "bg-primary border-primary scale-110"
                                        : "border-primary/50 hover:border-primary/60"
                                    }`}
                                  >
                                    {selectedWallets.has(wallet.id) && (
                                      <svg
                                        className="w-3 h-3 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                              )}
                              <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-muted ">
                                <StreamlineFlexWallet className="h-6 w-6 " />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm ">
                                  {wallet.name}
                                </p>
                                <p className="text-xs font-mono  mt-0.5 bg-muted px-2 py-0.5 rounded-md w-fit">
                                  {wallet.address?.slice(0, 8)}...
                                  {wallet.address?.slice(-4)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-sm">
                                $
                                {parseFloat(
                                  wallet?.totalBalanceUsd || "0"
                                ).toLocaleString()}
                              </p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {wallet.assetCount} assets
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      ) : (
        /* Empty state */
        <div className="text-center py-8">
          <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
            <Plus className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium mb-1">No accounts in this group</p>
          <p className="text-xs text-muted-foreground mb-4">
            Add your first account or wallet to get started
          </p>
          <Button onClick={() => onAddAccount(group)} size="sm">
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Account
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}

export function AccountGroupsGrid({
  onGroupSelect,
  limit = 6, // Show max 6 groups on main page
  onCreateGroup,
}: AccountGroupsGridProps) {
  const [selectedGroup, setSelectedGroup] = useState<AccountGroup | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const [groupForAddingAccount, setGroupForAddingAccount] =
    useState<AccountGroup | null>(null);
  
  // Delete mode states
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Zustand store - use selectors for better reactivity
  const groups = useAccountGroupsStore((state) => state.groups);
  const isLoading = useAccountGroupsStore((state) => state.groupsLoading);
  const error = useAccountGroupsStore((state) => state.groupsError);
  const fetchGroups = useAccountGroupsStore((state) => state.fetchGroups);
  const deleteGroup = useAccountGroupsStore((state) => state.deleteGroup);
  
  // Load groups on mount
  React.useEffect(() => {
    if (groups.length === 0 && !isLoading) {
      fetchGroups({
        details: true,
        includeAccounts: true,
        includeWallets: true,
        includeCounts: true,
      });
    }
  }, [groups.length, isLoading, fetchGroups]);

  // Get limited groups for display
  const displayGroups = groups.slice(0, limit);
  const hasMore = groups.length > limit;

  const handleGroupClick = (group: AccountGroup) => {
    if (isDeleteMode) {
      // In delete mode, toggle selection instead of navigating
      if (!group.isDefault) {
        handleToggleGroupForDeletion(group.id);
      }
    } else {
      if (onGroupSelect) {
        onGroupSelect(group);
      }
      setSelectedGroup(group);
    }
  };

  const handleCreateGroup = () => {
    if (onCreateGroup) {
      onCreateGroup();
    }
    setIsCreateDialogOpen(true);
  };
  
  // Delete mode handlers
  const handleEnterDeleteMode = () => {
    setIsDeleteMode(true);
    setSelectedForDeletion([]);
  };

  const handleExitDeleteMode = () => {
    setIsDeleteMode(false);
    setSelectedForDeletion([]);
  };

  const handleToggleGroupForDeletion = (groupId: string) => {
    setSelectedForDeletion(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleBulkDelete = () => {
    if (selectedForDeletion.length === 0) return;
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (groupIds: string[]) => {
    const successGroups: string[] = [];
    const failedGroups: string[] = [];
    
    for (const groupId of groupIds) {
      const success = await deleteGroup(groupId);
      if (success) {
        successGroups.push(groupId);
      } else {
        failedGroups.push(groupId);
      }
    }
    
    return { success: successGroups, failed: failedGroups };
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    handleExitDeleteMode();
  };
  
  const getSelectedGroups = () => {
    return displayGroups.filter(group => selectedForDeletion.includes(group.id));
  };
  
  const handleSelectAllForDeletion = () => {
    const deletableGroups = displayGroups
      .filter(group => !group.isDefault)
      .map(group => group.id);
    setSelectedForDeletion(deletableGroups);
  };
  
  const handleDeselectAll = () => {
    setSelectedForDeletion([]);
  };

  const handleGroupCreated = (newGroup: AccountGroup) => {
    // Refresh will happen automatically due to the hook
    setIsCreateDialogOpen(false);
  };

  const handleAddAccount = (group: AccountGroup) => {
    setGroupForAddingAccount(group);
    setIsAddAccountDialogOpen(true);
  };

  const handleAccountAdded = () => {
    // Refresh will happen automatically
    setIsAddAccountDialogOpen(false);
    setGroupForAddingAccount(null);
  };

  // If a group is selected, show its details
  if (selectedGroup) {
    return (
      <div>
        <GroupDetailsView
          group={selectedGroup}
          onBack={() => setSelectedGroup(null)}
          onAddAccount={handleAddAccount}
        />

        {/* Add Account Dialog */}
        <AddAccountToGroupDialog
          open={isAddAccountDialogOpen}
          onOpenChange={setIsAddAccountDialogOpen}
          group={groupForAddingAccount}
          onSuccess={handleAccountAdded}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm text-muted-foreground">
            Loading groups...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-sm text-red-600 mb-2">Failed to load groups</div>
        <p className="text-xs text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
          <Plus className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium mb-1">No groups yet</p>
        <p className="text-xs text-muted-foreground mb-4">
          Create your first account group to organize your finances
        </p>
        <Button onClick={handleCreateGroup} size="sm">
          Create First Group
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center ">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          <h2 className="text-sm font-semibold">Groups <span className="ml-1 text-muted-foreground">({displayGroups?.length || 0})</span></h2>
          {/*    <Link href="/dashboard/accounts/groups">
            <Button variant="link" size="sm" className="ml-auto">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link> */}
        </div>
        
        {/* Create and Delete buttons */}
        <div className="flex items-center gap-2">
          {!isDeleteMode ? (
            <>
                <Button 
                variant="soft" 
                size="sm"
                onClick={handleEnterDeleteMode}
                disabled={displayGroups.filter(g => !g.isDefault).length === 0}
                className="flex items-center text-xs"
              >
                <Trash2 className=" h-4 w-4" />
                <span className="md:hidden">Remove</span>
                
              </Button>
              <Button
                onClick={handleCreateGroup}
                size={'sm'}
              
                className="flex items-center text-xs shadow-none"
                disabled={isDeleteMode}
              >
         <ProiconsFolderAdd className="h-5 w-5" />
                  <span className="hidden md:inline ">Create Group</span>
                  <span className="md:hidden">Create</span>
              
             
              </Button>
        
          
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleBulkDelete}
                disabled={selectedForDeletion.length === 0}
                className="flex items-center text-xs"
              >
                <Trash2 className=" h-4 w-4" />
                Delete ({selectedForDeletion.length})
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExitDeleteMode}
                className="text-xs"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Mode Info */}
      {isDeleteMode && (
        <Alert className="items-center text-red-500/80">
          <AlertOctagonIcon className="h-6 w-6 " />
          <AlertDescription className="text-red-500/80">
            <div className="flex items-center justify-between text-xs w-full">
              <div>
                <strong>Delete Mode:</strong> Click on the groups you want to delete, then click the "Delete" button. 
                {selectedForDeletion.length > 0 && (
                  <span className="ml-2 font-medium">
                    {selectedForDeletion.length} group{selectedForDeletion.length > 1 ? 's' : ''} selected for deletion.
                  </span>
                )}
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button 
                  variant="soft" 
                  size="sm" 
                  onClick={handleSelectAllForDeletion}
                  disabled={displayGroups.filter(g => !g.isDefault).length === 0}
                  className="text-xs"
              
                >
                  Select All
                </Button>
                {selectedForDeletion.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleDeselectAll}
                    className="text-xs"
                  
                  >
                    Deselect All
                  </Button>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Groups Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayGroups.map((group) => (
          <Card
            key={group.id}
            className={`
              relative cursor-pointer hover:shadow-md  p-2 px-4 group transition-all
              ${isDeleteMode && selectedForDeletion.includes(group.id) ? 'border  shadow-lg shadow-destructive bg-destructive/5' : ''}
              ${isDeleteMode && group.isDefault ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => handleGroupClick(group)}
          >
            {/* Selection indicator for delete mode */}
            {isDeleteMode && (
              <div className="absolute top-2 right-2 z-10">
                {group.isDefault ? (
                  <div className="h-5 w-5 rounded-full bg-muted border-2 border-muted-foreground/20 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">✕</span>
                  </div>
                ) : (
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedForDeletion.includes(group.id) 
                      ? 'bg-destructive border-destructive text-white' 
                      : 'bg-background border-border hover:border-destructive'
                  }`}>
                    {selectedForDeletion.includes(group.id) && (
                      <span className="text-xs">✓</span>
                    )}
                  </div>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-2">
                {/* Group Icon */}
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-sm"
                  style={{
                    backgroundColor: group.color
                      ? `${group.color}20`
                      : "rgb(243 244 246)",
                    color: group.color || "rgb(107 114 128)",
                  }}
                >
                  {group.icon || "📁"}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-sm truncate">{group.name}</h3>
                  {group.isDefault && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      Default
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-4 ">
                {group.cryptoWallets && (
                  <p className="flex text-yellow-700 bg-yellow-500/20 px-2 py-0.5 rounded-md text-sm font-medium">
                    <span className="mr-1">$</span>
                    {group.cryptoWallets.reduce(
                      (sum, wallet) =>
                        sum + parseFloat(wallet.totalBalanceUsd || "0"),
                      0
                    ).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {group._count?.financialAccounts || 0}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <StreamlineFlexWallet className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {group._count?.cryptoWallets || 0}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                {group.cryptoWallets && (
                  <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                    {group.cryptoWallets?.map((item, index) => (
                      <Avatar key={index}>
                        {" "}
                        <AvatarImage src="https://github.com/shadcn.png" />
                      </Avatar>
                    ))}
                  </div>
                )}
                <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        {hasMore && (
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="/dashboard/accounts/groups"
              className="inline-flex items-center"
            >
              <span>View all {groups.length} groups</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        )}
      </div>

      {/* Dialogs */}
      <CreateGroupDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleGroupCreated}
        parentGroups={groups.filter((g) => !g.parentId)}
      />

      <AddAccountToGroupDialog
        open={isAddAccountDialogOpen}
        onOpenChange={setIsAddAccountDialogOpen}
        group={groupForAddingAccount}
        onSuccess={handleAccountAdded}
      />
      
      <DeleteGroupsDialog
        open={isDeleteDialogOpen}
        onOpenChange={handleDeleteDialogClose}
        groups={getSelectedGroups()}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
