'use client';

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { usePostHogPageView } from '@/lib/hooks/usePostHogPageView';
import { useBudgetDialogs } from '@/lib/hooks/use-budget-dialogs';
import { useBudgetSelection } from '@/lib/hooks/use-budget-selection';
import { useBudgetFilters } from '@/lib/hooks/use-budget-filters';
import { useBudgetPopovers } from '@/lib/hooks/use-budget-popovers';
import { useBudgetGroups } from '@/lib/hooks/use-budget-groups';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  ArrowRightLeft,
  Plus,
  Search,
  Settings,
  Filter,
  ArrowUpDown,
  FolderPlus,
  X,
  Trash2,
  Edit,
  MoreVertical,
  ChevronsDown,
  ChevronsUp,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useCategoryGroups,
  useRecordSpending,
  useDeleteCategory,
  useDeleteCategoryGroup,
} from '@/lib/queries/use-category-groups-data';
import { CategoryTemplatesStep } from '@/components/onboarding/category-templates-step';
import { useQueryClient } from '@tanstack/react-query';
import { useEnvelopeUIStore } from '@/lib/stores/envelope-ui-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { categoryGroupsApi } from '@/lib/services/category-groups-api';
import { useToast } from "@/lib/hooks/useToast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// UI Components
import { Switch } from '@/components/budgets/ui/switch';
import { Popover } from '@/components/budgets/ui/popover';

// Modals
import { SpendModal } from '@/components/budgets/modals/spend-modal';

// Dialogs
import { TransferCategoriesDialog } from '@/components/budgets/dialogs/transfer-categories-dialog';

// Popovers
import { AddGroupPopover } from '@/components/budgets/popovers/add-group-popover';
import { AssignAmountPopover } from '@/components/budgets/popovers/assign-amount-popover';
import { EditGroupPopover } from '@/components/budgets/popovers/edit-group-popover';

// Forms
import { AddCategoryForm } from '@/components/budgets/forms/add-category-form';

// Rows
import { CategoryRow } from '@/components/budgets/rows/category-row';

// Sections
import { BudgetsToolbar } from '@/components/budgets/sections/toolbar';
import { BudgetsSidebar } from '@/components/budgets/sections/sidebar';
import { TableHeaderControls } from '@/components/budgets/sections/table-header-controls';
import { FloatingToolbar } from '@/components/budgets/sections/floating-toolbar';
import { TableContent } from '@/components/budgets/sections/table-content';

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function BudgetsV2Page() {
  usePostHogPageView('budgets-v2');
  const { success, error } = useToast();

  // ============================================================================
  // INITIALIZATION & CONTEXT
  // ============================================================================
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthReady = !!user && isInitialized;
  const { showBalances } = useEnvelopeUIStore();

  // ============================================================================
  // CUSTOM HOOKS - STATE MANAGEMENT
  // ============================================================================
  const dialogs = useBudgetDialogs();
  const filters = useBudgetFilters();
  const popovers = useBudgetPopovers();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Queries first
  const { data: rawData, isLoading: groupsLoading } = useCategoryGroups({
    includeCategories: true,
    activeOnly: false,
  });

  const groups = rawData?.data || [];

  // Selection & Groups hooks depend on groups data
  const selection = useBudgetSelection(0, groups.length); // Will update after computing envelopes
  const groupsHook = useBudgetGroups(groups.length);

  // Flatten all categories
  const allEnvelopes = useMemo(() => {
    if (!groups) return [];
    const envelopes: Array<Record<string, unknown>> = [];
    groups.forEach((group: Record<string, unknown>) => {
      ((group.categories as Array<Record<string, unknown>>) || []).forEach((cat: Record<string, unknown>) => {
        envelopes.push({ ...cat, groupId: group.id, groupName: group.name });
      });
    });
    return envelopes;
  }, [groups]);

  // ============================================================================
  // COMPUTED STATE - FILTERING & GROUPING
  // ============================================================================

  // Filter by search
  const filteredEnvelopes = useMemo(() => {
    let filtered = allEnvelopes;

    if (searchQuery) {
      filtered = filtered.filter((env) =>
        env.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.filterStatus === 'active') {
      filtered = filtered.filter((env) => env.isActive);
    } else if (filters.filterStatus === 'zero') {
      filtered = filtered.filter((env) => (env.allocatedAmount || 0) === 0);
    }

    return filtered;
  }, [allEnvelopes, searchQuery, filters.filterStatus]);

  // Group envelopes by their group
  const groupedEnvelopes = useMemo(() => {
    const grouped = new Map<string, Array<Record<string, unknown>>>();
    filteredEnvelopes.forEach((env) => {
      if (!grouped.has(env.groupId as string)) {
        grouped.set(env.groupId as string, []);
      }
      grouped.get(env.groupId as string)?.push(env);
    });
    return grouped;
  }, [filteredEnvelopes]);

  // Sort and group (including empty groups)
  const sortedGroups = useMemo(() => {
    return groups.map((group: Record<string, unknown>) => {
      let categories = groupedEnvelopes.get(group.id as string) || [];

      categories = categories.sort((a, b) => {
        const aAllocated = Number(a.allocatedAmount) || 0;
        const bAllocated = Number(b.allocatedAmount) || 0;

        const aSpent = Number(a.totalSpent) || 0;
        const bSpent = Number(b.totalSpent) || 0;

        let comparison = 0;

        if (filters.sortBy === 'name') {
          comparison = (String(a.name) || '').localeCompare(String(b.name) || '');
        } else if (filters.sortBy === 'allocated') {
          comparison = bAllocated - aAllocated; // desc base
        } else if (filters.sortBy === 'spent') {
          comparison = bSpent - aSpent; // desc base
        }

        return filters.sortOrder === 'asc' ? comparison : -comparison;
      });

      return { ...group, categories };
    });
  }, [groups, groupedEnvelopes, filters.sortBy, filters.sortOrder]);
  
  // Calculate totals
  const totals = useMemo(() => {
    return allEnvelopes.reduce(
      (acc, env) => ({
        totalAllocated:
          acc.totalAllocated + (Number(env.allocatedAmount) || 0),
        totalSpent:
          acc.totalSpent + (Number(env.totalSpent) || 0),
        totalBalance:
          acc.totalBalance + (Number(env.currentBalance) || 0),
        exceededCount: acc.exceededCount + (env.isExceeded ? 1 : 0),
      }),
      {
        totalAllocated: 0,
        totalSpent: 0,
        totalBalance: 0,
        exceededCount: 0,
      }
    );
  }, [allEnvelopes]);

  const isLoading = !isAuthReady || groupsLoading;

  // ============================================================================
  // MUTATION HANDLERS
  // ============================================================================

  // Delete mutations (must be called unconditionally, but use with null checks)
  const deleteCategoryMutation = useDeleteCategory(dialogs.deleteTarget?.id || '');
  const deleteGroupMutation = useDeleteCategoryGroup(dialogs.deleteTarget?.id || '');

  // Check if any mutation is in progress
  const isAnyMutationLoading = useMemo(() => {
    return (
      isRefreshing ||
      (dialogs.deleteTarget?.id && (deleteCategoryMutation?.isPending || deleteGroupMutation?.isPending))
    );
  }, [isRefreshing, dialogs.deleteTarget?.id, deleteCategoryMutation?.isPending, deleteGroupMutation?.isPending]);

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['category-groups'] });
      success('Data refreshed');
    } catch (error) {
      error('Failed to refresh');
    } finally {
      setIsRefreshing(false);
    }
  };

  const spendMutation = useRecordSpending(dialogs.selectedEnvelope?.id);

  const handleRecordSpending = useCallback((amount: number) => {
    if (amount <= 0) {
      error('Amount must be greater than 0');
      return;
    }

    // Close modal immediately for instant feedback
    dialogs.setSpendModalOpen(false);
    dialogs.setSelectedEnvelope(null);

    spendMutation.mutate(
      {
        amount,
        description: 'Spending record',
      },
      {
        onSuccess: () => {
          success('Spending recorded');
        },
        onError: (error: unknown) => {
          const apiError = error as { response?: { data?: { message?: string } } };
          error(apiError?.response?.data?.message || 'Failed to record spending');
        },
      }
    );
  }, [spendMutation, dialogs]);

  // Delete handler
  const handleConfirmDelete = useCallback(() => {
    if (!dialogs.deleteTarget?.id) return;

    if (dialogs.deleteTarget.type === 'category') {
      // Close dialog immediately for instant feedback
      dialogs.setDeleteConfirmOpen(false);
      dialogs.setDeleteTarget(null);

      deleteCategoryMutation.mutate(undefined, {
        onSuccess: () => {
          success('Category deleted successfully');
          selection.clearSelection();
        },
        onError: (error: unknown) => {
          const apiError = error as { message?: string };
          error(apiError?.message || 'Failed to delete category');
        },
      });
    } else if (dialogs.deleteTarget.type === 'group') {
      // Close dialog immediately for instant feedback
      dialogs.setDeleteConfirmOpen(false);
      dialogs.setDeleteTarget(null);

      deleteGroupMutation.mutate(undefined, {
        onSuccess: () => {
          success('Group deleted successfully');
          selection.clearSelection();
        },
        onError: (error: unknown) => {
          const apiError = error as { message?: string };
          error(apiError?.message || 'Failed to delete group');
        },
      });
    }
  }, [dialogs, deleteCategoryMutation, deleteGroupMutation, selection]);

  const handleApplyTemplate = useCallback(async () => {
    if (!popovers.selectedTemplate) return;

    popovers.setIsApplyingTemplate(true);
    try {
      await categoryGroupsApi.applyTemplate(popovers.selectedTemplate);
      success('Template applied successfully! Categories have been created.');
      popovers.setSelectedTemplate(null);

      // Invalidate and refetch category groups
      await queryClient.invalidateQueries({
        queryKey: ['category-groups'],
      });
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      error(apiError?.message || 'Failed to apply template');
    } finally {
      popovers.setIsApplyingTemplate(false);
    }
  }, [popovers, queryClient]);

  // Show template selection when no categories exist
  if (!groupsLoading && allEnvelopes.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-end">
          <Button
            onClick={handleApplyTemplate}
            disabled={!popovers.selectedTemplate || popovers.isApplyingTemplate}
            size="xs"
          >
            {popovers.isApplyingTemplate ? 'Applying...' : 'Apply Template'}
          </Button>
        </div>

        <CategoryTemplatesStep
          selectedTemplate={popovers.selectedTemplate}
          onSelectTemplate={popovers.setSelectedTemplate}
        />

        {/* Loading Dialog */}
        {popovers.isApplyingTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-8 w-full max-w-sm">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">Applying Template</h3>
                  <p className="text-sm text-muted-foreground">
                    Creating budget categories from template...
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Toolbar - Month Selector & Ready to Assign */}
      <BudgetsToolbar
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        totalBalance={totals.totalBalance}
        showBalances={showBalances}
        onAssignClick={(e) => {
          popovers.setAssignPopoverTrigger(e.currentTarget);
          popovers.setAssignPopoverOpen(true);
        }}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          {/* Table */}
          <div className="lg:col-span-5 relative overflow-visible">
            <Card className="border border-border/60 p-0 rounded-lg shadow-sm overflow-visible">
              {/* Loading Overlay */}
              {groupsLoading && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-lg z-20 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    <p className="text-xs text-muted-foreground">Loading...</p>
                  </div>
                </div>
              )}
              <TableHeaderControls
                allGroupsExpanded={groupsHook.allGroupsExpanded}
                onExpandAllToggle={() => groupsHook.toggleExpandAll(sortedGroups.map(g => g.id))}
                onCreateGroupClick={(e) => {
                  popovers.setAddGroupTrigger(e.currentTarget);
                  popovers.setAddGroupPopoverOpen(true);
                }}
                filterPopoverOpen={popovers.filterPopoverOpen}
                onFilterPopoverChange={popovers.setFilterPopoverOpen}
                filterStatus={filters.filterStatus}
                onFilterStatusChange={filters.setFilterStatus}
                sortPopoverOpen={popovers.sortPopoverOpen}
                onSortPopoverChange={popovers.setSortPopoverOpen}
                sortBy={filters.sortBy}
                onSortByChange={filters.setSortBy}
                sortOrder={filters.sortOrder}
                onSortOrderChange={filters.setSortOrder}
                columnPopoverOpen={popovers.columnPopoverOpen}
                onColumnPopoverChange={popovers.setColumnPopoverOpen}
                visibleColumns={filters.visibleColumns}
                onToggleColumn={filters.toggleColumn}
                isRefreshing={isRefreshing}
                onRefresh={handleRefresh}
                groupsLoading={groupsLoading}
              />

              <div className="w-full overflow-x-auto overflow-y-visible">
                <Table>
                  <TableHeader className="bg-muted/80">
                    <TableRow className="border-border/60 hover:bg-transparent">
                      <TableHead className="px-4 text-left font-semibold w-12">
                        <input
                          type="checkbox"
                          checked={selection.allVisibleRowsSelected}
                          ref={(el) => {
                            if (el && selection.someVisibleRowsSelected && !selection.allVisibleRowsSelected) {
                              el.indeterminate = true;
                            }
                          }}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const allRowIds = new Set<string>();
                              filteredEnvelopes.forEach((env) => {
                                allRowIds.add(env.id);
                              });
                              selection.setSelectedRows(allRowIds);
                            } else {
                              selection.clearSelection();
                            }
                          }}
                          className="h-4 w-4 rounded border-border cursor-pointer"
                        />
                      </TableHead>
                      <TableHead className="px-4 text-left font-semibold">
                        Category
                      </TableHead>
                    {filters.visibleColumns.leftover && (
                      <TableHead className="px-4 text-right font-semibold">
                        Leftover
                      </TableHead>
                    )}
                    {filters.visibleColumns.assigned && (
                      <TableHead className="px-4 text-right font-semibold">
                        Assigned
                      </TableHead>
                    )}
                    {filters.visibleColumns.activity && (
                      <TableHead className="px-4 text-right font-semibold">
                        Activity
                      </TableHead>
                    )}
                    {filters.visibleColumns.available && (
                      <TableHead className="px-4 text-right font-semibold">
                        Available
                      </TableHead>
                    )}
                    {filters.visibleColumns.actions && (
                      <TableHead className="px-4 text-center font-semibold">
                        Actions
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>

                <TableContent
                  isLoading={isLoading}
                  sortedGroups={sortedGroups}
                  expandedGroups={groupsHook.expandedGroups}
                  onToggleGroup={groupsHook.toggleGroup}
                  selectedGroups={selection.selectedGroups}
                  selectedRows={selection.selectedRows}
                  onSelectGroup={selection.toggleGroupSelection}
                  onSelectRow={selection.toggleRowSelection}
                  visibleColumns={filters.visibleColumns}
                  showBalances={showBalances}
                  onAddCategoryClick={(groupId) => {
                    dialogs.setSelectedGroupForCategory(groupId);
                    dialogs.setAddCategoryDialogOpen(true);
                  }}
                  onSpendClick={(envelope) => {
                    dialogs.setSelectedEnvelope(envelope);
                    dialogs.setSpendModalOpen(true);
                  }}
                  onDeleteClick={(envelope) => {
                    dialogs.setDeleteTarget({ type: 'category', id: envelope.id, name: envelope.name });
                    dialogs.setDeleteConfirmOpen(true);
                  }}
                  editGroupPopover={popovers.editGroupPopover}
                  editGroupId={popovers.editGroupId}
                  editGroupName={popovers.editGroupName}
                  setEditGroupName={popovers.setEditGroupName}
                  setEditGroupPopover={popovers.setEditGroupPopover}
                  groupPopoverTrigger={popovers.groupPopoverTrigger}
                  setGroupPopoverTrigger={popovers.setGroupPopoverTrigger}
                  onGroupDelete={(groupId) => {
                    dialogs.setTransferGroupId(groupId);
                    popovers.setEditGroupPopover(null);
                    dialogs.setTransferGroupOpen(true);
                  }}
                />
                </Table>
              </div>
            </Card>

            {/* Floating Toolbar */}
            <FloatingToolbar
              selectedRowsCount={selection.selectedRows.size}
              selectedGroupsCount={selection.selectedGroups.size}
              onSpendClick={() => {
                if (selection.selectedRows.size > 0) {
                  const firstSelected = Array.from(selection.selectedRows)[0];
                  const env = filteredEnvelopes.find(e => e.id === firstSelected);
                  if (env) {
                    dialogs.setSelectedEnvelope(env);
                    dialogs.setSpendModalOpen(true);
                  }
                }
              }}
              onTransferClick={() => {
                // Handle transfer
              }}
              onDeleteClick={() => {
                if (selection.selectedRows.size > 0) {
                  const firstSelected = Array.from(selection.selectedRows)[0];
                  const env = filteredEnvelopes.find(e => e.id === firstSelected);
                  if (env) {
                    dialogs.setDeleteTarget({ type: 'category', id: env.id, name: env.name });
                    dialogs.setDeleteConfirmOpen(true);
                  }
                }
              }}
              onClearSelection={selection.clearSelection}
            />
          </div>

          {/* Sidebar */}
          <BudgetsSidebar
            totals={totals}
            showBalances={showBalances}
            filteredEnvelopesLength={filteredEnvelopes.length}
          />
        </div>
 

      {/* Spend Modal */}
      {dialogs.spendModalOpen && dialogs.selectedEnvelope && (
        <SpendModal
          envelope={dialogs.selectedEnvelope}
          onClose={() => {
            dialogs.setSpendModalOpen(false);
            dialogs.setSelectedEnvelope(null);
          }}
          onSubmit={handleRecordSpending}
          isLoading={spendMutation.isPending}
        />
      )}

      {/* Add Group Popover */}
      {popovers.addGroupPopoverOpen && (
        <AddGroupPopover
          onClose={() => popovers.setAddGroupPopoverOpen(false)}
          triggerElement={popovers.addGroupTrigger}
        />
      )}

      {/* Assign Amount Popover */}
      {popovers.assignPopoverOpen && (
        <AssignAmountPopover
          onClose={() => popovers.setAssignPopoverOpen(false)}
          triggerElement={popovers.assignPopoverTrigger}
          totalBalance={totals.totalBalance}
          groups={sortedGroups}
          onAssign={async (groupId, amount) => {
            // Handle assign logic here
            success(`Assigned ${amount} to group`);
            popovers.setAssignPopoverOpen(false);
          }}
        />
      )}

      {/* Add Category Dialog */}
      <Dialog open={dialogs.addCategoryDialogOpen} onOpenChange={dialogs.setAddCategoryDialogOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          {dialogs.selectedGroupForCategory && (
            <AddCategoryForm
              groupId={dialogs.selectedGroupForCategory}
              onClose={() => {
                dialogs.setAddCategoryDialogOpen(false);
                dialogs.setSelectedGroupForCategory(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={dialogs.deleteConfirmOpen} onOpenChange={dialogs.setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {dialogs.deleteTarget?.type === 'group' ? 'Group' : 'Category'}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{dialogs.deleteTarget?.name}</strong>? This action cannot be undone.
              {dialogs.deleteTarget?.type === 'group' && ' All categories in this group will also be deleted.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={deleteCategoryMutation?.isPending || deleteGroupMutation?.isPending}
            >
              {deleteCategoryMutation?.isPending || deleteGroupMutation?.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Transfer Categories Dialog */}
      <Dialog open={dialogs.transferGroupOpen} onOpenChange={dialogs.setTransferGroupOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer Categories</DialogTitle>
          </DialogHeader>
          {dialogs.transferGroupId && (
            <TransferCategoriesDialog
              sourceGroupId={dialogs.transferGroupId}
              sourceGroup={sortedGroups.find(g => g.id === dialogs.transferGroupId)}
              allGroups={sortedGroups}
              onClose={() => {
                dialogs.setTransferGroupOpen(false);
                dialogs.setTransferGroupId(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

