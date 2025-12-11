'use client';

import React, { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { usePostHogPageView } from '@/lib/hooks/usePostHogPageView';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Grid3x3,
  List,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  useAllEnvelopesWithStats,
  useCreateEnvelope,
  useDashboardSummary,
  useAllocateToEnvelope,
} from '@/lib/queries/use-envelope-data';
import { envelopeApi } from '@/lib/services/envelope-api';
import { useEnvelopeUIStore } from '@/lib/stores/envelope-ui-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { CreateEnvelopeModal } from '@/components/budgets-v2/create-envelope-modal';
import { toast } from 'sonner';

interface EnvelopeItem {
  id: string;
  name: string;
  icon?: string;
  envelopeType: 'SPENDING' | 'SAVINGS_GOAL' | 'SINKING_FUND' | 'FLEXIBLE';
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'CLOSED';
  allocatedAmount: string | number;
  spentAmount: string | number;
  availableBalance: string | number;
  stats?: {
    allocated: number;
    spent: number;
    available: number;
    percentageUsed: number;
    isAtRisk: boolean;
    isOverBudget: boolean;
  };
}

const getCategoryGroupLabel = (type: string) => {
  switch (type) {
    case 'SPENDING':
      return 'Spending';
    case 'SAVINGS_GOAL':
      return 'Savings Goals';
    case 'SINKING_FUND':
      return 'Sinking Funds';
    case 'FLEXIBLE':
      return 'Flexible';
    default:
      return 'Other';
  }
};

export default function BudgetsV2Page() {
  usePostHogPageView('budgets-v2');

  // Auth
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthReady = !!user && isInitialized;

  // UI State
  const {
    filters,
    setSearchQuery,
    viewMode,
    setViewMode,
    isCreateEnvelopeModalOpen,
    openCreateEnvelopeModal,
    closeCreateEnvelopeModal,
  } = useEnvelopeUIStore();

  // Local state
  const [showBalances, setShowBalances] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    SPENDING: true,
    SAVINGS_GOAL: true,
    SINKING_FUND: true,
    FLEXIBLE: true,
  });

  // Queries
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    refetch: refetchDashboard,
  } = useDashboardSummary();

  const {
    data: envelopesResponse,
    isLoading: envelopesLoading,
    error: envelopesError,
    refetch: refetchEnvelopes,
  } = useAllEnvelopesWithStats({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    take: 100,
  });

  // Mutations
  const createEnvelopeMutation = useCreateEnvelope();

  // Extract envelopes
  const allEnvelopes = useMemo(() => {
    if (!envelopesResponse) return [];
    const data = envelopesResponse?.data?.data || envelopesResponse?.data || [];
    return Array.isArray(data) ? data : [];
  }, [envelopesResponse]);

  // Filter envelopes
  const filteredEnvelopes = useMemo(() => {
    let result = allEnvelopes;

    if (filterStatus && filterStatus !== '') {
      result = result.filter((env) => env.status === filterStatus);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter((env) => env.name?.toLowerCase().includes(query));
    }

    return result;
  }, [allEnvelopes, filterStatus, filters.searchQuery]);

  // Group envelopes by type
  const groupedEnvelopes = useMemo(() => {
    const groups: Record<string, EnvelopeItem[]> = {
      SPENDING: [],
      SAVINGS_GOAL: [],
      SINKING_FUND: [],
      FLEXIBLE: [],
    };

    filteredEnvelopes.forEach((env) => {
      const type = env.envelopeType || 'SPENDING';
      if (groups[type]) {
        groups[type].push(env);
      }
    });

    return groups;
  }, [filteredEnvelopes]);

  // Dashboard stats
  const dashboardStats = dashboardData?.data || {
    totalEnvelopes: 0,
    activeEnvelopes: 0,
    totalAllocated: '0',
    totalSpent: '0',
    totalRemaining: '0',
    percentageUsed: 0,
    envelopesAtRisk: 0,
    envelopesOverBudget: 0,
  };

  const totalAllocated = typeof dashboardStats.totalAllocated === 'string'
    ? parseFloat(dashboardStats.totalAllocated)
    : dashboardStats.totalAllocated;

  const totalSpent = typeof dashboardStats.totalSpent === 'string'
    ? parseFloat(dashboardStats.totalSpent)
    : dashboardStats.totalSpent;

  const totalRemaining = typeof dashboardStats.totalRemaining === 'string'
    ? parseFloat(dashboardStats.totalRemaining)
    : dashboardStats.totalRemaining;

  // Handlers
  const handleCreateEnvelope = async (data: Record<string, unknown>) => {
    try {
      await createEnvelopeMutation.mutateAsync(data);
      toast.success('Envelope created successfully');
      closeCreateEnvelopeModal();
      await refetchEnvelopes();
      await refetchDashboard();
    } catch (error) {
      toast.error('Failed to create envelope');
    }
  };

  const handleRefresh = async () => {
    await Promise.all([refetchEnvelopes(), refetchDashboard()]);
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  if (!isAuthReady) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  const hasEnvelopes = filteredEnvelopes.length > 0;

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header Bar */}
      <div className="border-b border-border/40 bg-background sticky top-0 z-40">
        <div className="max-w-full px-4 md:px-6 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Budgets</h1>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(), 'MMMM yyyy')}
              </p>
            </div>
            <Button onClick={openCreateEnvelopeModal} className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <div className="flex-1 flex gap-2">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={filters.searchQuery || ''}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32 h-9 text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="f">All</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PAUSED">Paused</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalances(!showBalances)}
                className="h-9"
                title="Toggle balances"
              >
                {showBalances ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="h-9"
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={envelopesLoading}
                className="h-9"
              >
                <RefreshCw className={cn('h-4 w-4', envelopesLoading && 'animate-spin')} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}

    
          {/* Error State */}
          {envelopesError && !hasEnvelopes && (
            <Card className="border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 mb-6">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 dark:text-red-200">Failed to load envelopes</h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      There was a problem loading your envelopes. Please try again.
                    </p>
                    <Button onClick={handleRefresh} variant="outline" size="sm" className="mt-3">
                      Retry
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {envelopesLoading && !hasEnvelopes && (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!envelopesLoading && !hasEnvelopes && (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-lg font-semibold mb-2">No envelopes yet</h3>
                <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
                  Create your first envelope to start budgeting.
                </p>
                <Button onClick={openCreateEnvelopeModal} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Envelope
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Content */}
          {hasEnvelopes && viewMode === 'list' ? (
            // DATA TABLE VIEW (YNAB Style with Accordion)
            <div className="space-y-1 border border-border/40 rounded-lg overflow-hidden bg-card">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-accent/80 border-b border-border/40 text-xs font-semibold text-muted-foreground sticky top-0 z-10">
                <div className="col-span-4">Category</div>
                <div className="col-span-2 text-right">Leftover</div>
                <div className="col-span-2 text-right">Assigned</div>
                <div className="col-span-2 text-right">Activity</div>
                <div className="col-span-2 text-right">Available</div>
              </div>

              {/* Category Group Accordions */}
              {['SPENDING', 'SAVINGS_GOAL', 'SINKING_FUND', 'FLEXIBLE'].map((type) => {
                const groupEnvelopes = groupedEnvelopes[type as keyof typeof groupedEnvelopes];
                return (
                  groupEnvelopes.length > 0 && (
                    <div key={type} className="border-b border-border/40 last:border-b-0">
                      {/* Group Row - Shows totals and allows editing */}
                      <TableGroupRow
                        groupType={type}
                        envelopes={groupEnvelopes}
                        showBalances={showBalances}
                        isExpanded={expandedGroups[type]}
                        onToggle={() => toggleGroup(type)}
                      />

                      {/* Expanded Group Content - Individual envelopes */}
                      {expandedGroups[type] && (
                        <div>
                          {groupEnvelopes.map((envelope, idx) => (
                            <TableDataRow
                              key={envelope.id}
                              envelope={envelope}
                              showBalances={showBalances}
                              isLast={idx === groupEnvelopes.length - 1}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                );
              })}

            </div>
          ) : (
            // GRID VIEW
            <div className="space-y-8">
              {['SPENDING', 'SAVINGS_GOAL', 'SINKING_FUND', 'FLEXIBLE'].map((type) => (
                groupedEnvelopes[type as keyof typeof groupedEnvelopes].length > 0 && (
                  <div key={type} className="space-y-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground px-1">
                      {getCategoryGroupLabel(type)}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupedEnvelopes[type as keyof typeof groupedEnvelopes].map((envelope) => (
                        <GridCard
                          key={envelope.id}
                          envelope={envelope}
                          showBalances={showBalances}
                        />
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
    
 

      {/* Create Modal */}
      <CreateEnvelopeModal
        isOpen={isCreateEnvelopeModalOpen}
        onClose={closeCreateEnvelopeModal}
        onSubmit={handleCreateEnvelope}
        isLoading={createEnvelopeMutation.isPending}
      />
    </div>
  );
}

// Data Table Row Component with Inline Editing
function TableDataRow({
  envelope,
  showBalances,
  isLast,
}: {
  envelope: EnvelopeItem;
  showBalances: boolean;
  isLast: boolean;
}) {
  const [isEditingAssigned, setIsEditingAssigned] = React.useState(false);
  const [editValue, setEditValue] = React.useState('');

  // Mutation hook for allocating funds
  const allocateMutation = useAllocateToEnvelope(envelope.id);

  const allocated = typeof envelope.allocatedAmount === 'string'
    ? parseFloat(envelope.allocatedAmount)
    : envelope.allocatedAmount;

  const spent = typeof envelope.spentAmount === 'string'
    ? parseFloat(envelope.spentAmount)
    : envelope.spentAmount;

  const available = typeof envelope.availableBalance === 'string'
    ? parseFloat(envelope.availableBalance)
    : envelope.availableBalance;

  const leftover = available > 0 ? available : 0;

  const handleEditAssigned = () => {
    setEditValue(allocated.toString());
    setIsEditingAssigned(true);
  };

  const handleSaveAssigned = async () => {
    const newAmount = parseFloat(editValue);

    if (isNaN(newAmount)) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (newAmount < 0) {
      toast.error('Amount cannot be negative');
      return;
    }

    // Call the allocation API
    allocateMutation.mutate(
      { amount: newAmount },
      {
        onSuccess: () => {
          toast.success(`Allocated $${newAmount.toFixed(2)} to ${envelope.name}`);
          setIsEditingAssigned(false);
        },
        onError: (error: unknown) => {
          const errorMessage = error?.response?.data?.message || 'Failed to update allocation';
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setIsEditingAssigned(false);
  };

  return (
    <div
      className={cn(
        'grid grid-cols-12 gap-4 px-4   transition-colors text-sm items-center',
        !isLast && 'border-b border-border/40'
      )}
    >
      {/* Category Name */}
      <div className="col-span-4 flex items-center gap-3">
        {envelope.icon && <span className="text-lg flex-shrink-0">{envelope.icon}</span>}
        <span className="font-medium truncate">{envelope.name}</span>
      </div>

      {/* Leftover */}
      <div className="col-span-2 text-right text-sm">
        {showBalances ? (
          <span className={cn('font-medium', leftover > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground')}>
            <CurrencyDisplay amountUSD={leftover} />
          </span>
        ) : (
          '••••'
        )}
      </div>

      {/* Assigned - Editable */}
      <div className="col-span-2 text-right">
        {isEditingAssigned ? (
          <div className="flex items-center justify-end gap-1">
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSaveAssigned();
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  handleCancelEdit();
                }
              }}
              className="w-20 px-2 py-1 text-xs border border-border rounded text-right disabled:opacity-50"
              autoFocus
              placeholder="0.00"
              disabled={allocateMutation.isPending}
            />
            <Button
              size="xs"
              variant="ghost"
              onClick={handleSaveAssigned}
              className="h-6 px-2 text-xs"
              disabled={allocateMutation.isPending}
            >
              {allocateMutation.isPending ? '⟳' : '✓'}
            </Button>
            <Button
              size="xs"
              variant="ghost"
              onClick={handleCancelEdit}
              className="h-6 px-2 text-xs"
              disabled={allocateMutation.isPending}
            >
              ✕
            </Button>
          </div>
        ) : (
          <button
            onClick={handleEditAssigned}
            className="font-medium text-right w-full hover:bg-muted/50 px-2 py-1 rounded transition-colors cursor-pointer disabled:opacity-50"
            title="Click to edit"
            disabled={allocateMutation.isPending}
          >
            {showBalances ? <CurrencyDisplay amountUSD={allocated} /> : '••••'}
          </button>
        )}
      </div>

      {/* Activity (Spent) */}
      <div className="col-span-2 text-right text-sm font-medium">
        {showBalances ? <CurrencyDisplay amountUSD={spent} /> : '••••'}
      </div>

      {/* Available */}
      <div
        className={cn(
          'col-span-2 text-right text-sm font-medium',
          available < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
        )}
      >
        {showBalances ? <CurrencyDisplay amountUSD={Math.abs(available)} /> : '••••'}
      </div>
    </div>
  );
}

// Table Group Row Component - Shows aggregated data for a category group
function TableGroupRow({
  groupType,
  envelopes,
  showBalances,
  isExpanded,
  onToggle,
}: {
  groupType: string;
  envelopes: EnvelopeItem[];
  showBalances: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [isEditingAssigned, setIsEditingAssigned] = React.useState(false);
  const [editValue, setEditValue] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const queryClient = useQueryClient();

  // Calculate totals for all envelopes in the group
  const totalAllocated = envelopes.reduce((sum, env) => {
    const amount = typeof env.allocatedAmount === 'string'
      ? parseFloat(env.allocatedAmount)
      : env.allocatedAmount;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const totalSpent = envelopes.reduce((sum, env) => {
    const amount = typeof env.spentAmount === 'string'
      ? parseFloat(env.spentAmount)
      : env.spentAmount;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const totalAvailable = envelopes.reduce((sum, env) => {
    const amount = typeof env.availableBalance === 'string'
      ? parseFloat(env.availableBalance)
      : env.availableBalance;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const totalLeftover = totalAvailable > 0 ? totalAvailable : 0;

  const handleEditAssigned = () => {
    setEditValue(totalAllocated.toString());
    setIsEditingAssigned(true);
  };

  const handleSaveAssigned = async () => {
    const newAmount = parseFloat(editValue);

    if (isNaN(newAmount)) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (newAmount < 0) {
      toast.error('Amount cannot be negative');
      return;
    }

    // Calculate the delta (change from current amount)
    const delta = newAmount - totalAllocated;

    // If no change, just close the editor
    if (delta === 0) {
      setIsEditingAssigned(false);
      return;
    }

    // Distribute the delta proportionally across all envelopes
    if (envelopes.length === 0) {
      toast.error('No envelopes in this group');
      return;
    }

    // For each envelope, calculate its current proportion and distribute the delta
    const allocations = envelopes.map((env) => {
      const current = typeof env.allocatedAmount === 'string'
        ? parseFloat(env.allocatedAmount)
        : env.allocatedAmount;

      if (totalAllocated === 0) {
        // If total allocated is 0, distribute evenly
        return { envelopeId: env.id, newAmount: newAmount / envelopes.length };
      } else {
        // Otherwise distribute proportionally
        const proportion = current / totalAllocated;
        return { envelopeId: env.id, newAmount: current + (delta * proportion) };
      }
    });

    setIsSaving(true);

    // Execute all allocations in parallel
    try {
      await Promise.all(
        allocations.map((allocation) =>
          envelopeApi.allocateToEnvelope(allocation.envelopeId, {
            amount: Math.max(0, allocation.newAmount),
          })
        )
      );

      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: ['envelopes', 'lists', 'with-stats'],
      });

      toast.success(`Allocated $${newAmount.toFixed(2)} to ${getCategoryGroupLabel(groupType)}`);
      setIsEditingAssigned(false);
    } catch (error: unknown) {
      const errorMessage = error?.response?.data?.message || 'Failed to update allocations';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingAssigned(false);
  };

  return (
    <div className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-muted/20 transition-colors text-sm items-center border-b border-border/40 bg-muted/10 font-semibold">
      {/* Group Name with Chevron */}
      <button
        onClick={onToggle}
        className="col-span-4 flex items-center gap-2 hover:text-foreground transition-colors text-left"
      >
        <div className="transition-transform">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
        <span>{getCategoryGroupLabel(groupType)}</span>
        <span className="text-xs text-muted-foreground ml-1">({envelopes.length})</span>
      </button>

      {/* Leftover Total */}
      <div className="col-span-2 text-right text-sm">
        {showBalances ? (
          <span className={cn('font-medium', totalLeftover > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground')}>
            <CurrencyDisplay amountUSD={totalLeftover} />
          </span>
        ) : (
          '••••'
        )}
      </div>

      {/* Assigned Total - Editable */}
      <div className="col-span-2 text-right">
        {isEditingAssigned ? (
          <div className="flex items-center justify-end gap-1">
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSaveAssigned();
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  handleCancelEdit();
                }
              }}
              className="w-20 px-2 py-1 text-xs border border-border rounded text-right disabled:opacity-50"
              autoFocus
              placeholder="0.00"
              disabled={isSaving}
            />
            <Button
              size="xs"
              variant="ghost"
              onClick={handleSaveAssigned}
              className="h-6 px-2 text-xs"
              disabled={isSaving}
            >
              {isSaving ? '⟳' : '✓'}
            </Button>
            <Button
              size="xs"
              variant="ghost"
              onClick={handleCancelEdit}
              className="h-6 px-2 text-xs"
              disabled={isSaving}
            >
              ✕
            </Button>
          </div>
        ) : (
          <button
            onClick={handleEditAssigned}
            className="font-semibold text-right w-full hover:bg-muted/50 px-2 py-1 rounded transition-colors cursor-pointer disabled:opacity-50"
            title="Click to edit"
            disabled={isSaving}
          >
            {showBalances ? <CurrencyDisplay amountUSD={totalAllocated} /> : '••••'}
          </button>
        )}
      </div>

      {/* Activity Total (Spent) */}
      <div className="col-span-2 text-right text-sm font-semibold">
        {showBalances ? <CurrencyDisplay amountUSD={totalSpent} /> : '••••'}
      </div>

      {/* Available Total */}
      <div
        className={cn(
          'col-span-2 text-right text-sm font-semibold',
          totalAvailable < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
        )}
      >
        {showBalances ? <CurrencyDisplay amountUSD={Math.abs(totalAvailable)} /> : '••••'}
      </div>
    </div>
  );
}

// Grid Card Component with Inline Editing
function GridCard({
  envelope,
  showBalances,
}: {
  envelope: EnvelopeItem;
  showBalances: boolean;
}) {
  const [isEditingAssigned, setIsEditingAssigned] = React.useState(false);
  const [editValue, setEditValue] = React.useState('');
  const allocateMutation = useAllocateToEnvelope(envelope.id);

  const allocated = typeof envelope.allocatedAmount === 'string'
    ? parseFloat(envelope.allocatedAmount)
    : envelope.allocatedAmount;

  const spent = typeof envelope.spentAmount === 'string'
    ? parseFloat(envelope.spentAmount)
    : envelope.spentAmount;

  const available = typeof envelope.availableBalance === 'string'
    ? parseFloat(envelope.availableBalance)
    : envelope.availableBalance;

  const percentageUsed = allocated > 0 ? (spent / allocated) * 100 : 0;
  const isOverBudget = available < 0;

  const handleEditAssigned = () => {
    setEditValue(allocated.toString());
    setIsEditingAssigned(true);
  };

  const handleSaveAssigned = async () => {
    const newAmount = parseFloat(editValue);

    if (isNaN(newAmount)) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (newAmount < 0) {
      toast.error('Amount cannot be negative');
      return;
    }

    // Call the allocation API
    allocateMutation.mutate(
      { amount: newAmount },
      {
        onSuccess: () => {
          toast.success(`Allocated $${newAmount.toFixed(2)} to ${envelope.name}`);
          setIsEditingAssigned(false);
        },
        onError: (error: unknown) => {
          const errorMessage = error?.response?.data?.message || 'Failed to update allocation';
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setIsEditingAssigned(false);
  };

  return (
    <Card className="border border-border/40 bg-card hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-4">
        {/* Name */}
        <div className="flex items-center gap-2">
          {envelope.icon && <span className="text-lg">{envelope.icon}</span>}
          <h3 className="font-semibold text-sm">{envelope.name}</h3>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(percentageUsed)}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all',
                isOverBudget ? 'bg-red-500' : percentageUsed >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
              )}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>
        </div>

        {/* Amounts - Allocated is editable */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <p className="text-muted-foreground">Allocated</p>
            {isEditingAssigned ? (
              <div className="space-y-1">
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSaveAssigned();
                    } else if (e.key === 'Escape') {
                      e.preventDefault();
                      handleCancelEdit();
                    }
                  }}
                  className="w-full px-2 py-1 text-xs border border-border rounded text-right disabled:opacity-50"
                  autoFocus
                  placeholder="0.00"
                  disabled={allocateMutation.isPending}
                />
                <div className="flex gap-1">
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={handleSaveAssigned}
                    className="h-6 px-1.5 text-xs flex-1"
                    disabled={allocateMutation.isPending}
                  >
                    {allocateMutation.isPending ? '⟳' : '✓'}
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={handleCancelEdit}
                    className="h-6 px-1.5 text-xs flex-1"
                    disabled={allocateMutation.isPending}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleEditAssigned}
                className="font-semibold hover:bg-muted/50 px-2 py-1 rounded transition-colors cursor-pointer w-full text-left disabled:opacity-50"
                title="Click to edit"
                disabled={allocateMutation.isPending}
              >
                {showBalances ? <CurrencyDisplay amountUSD={allocated} /> : '••••'}
              </button>
            )}
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Spent</p>
            <p className="font-semibold">
              {showBalances ? <CurrencyDisplay amountUSD={spent} /> : '••••'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Available</p>
            <p className={cn('font-semibold', isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400')}>
              {showBalances ? <CurrencyDisplay amountUSD={Math.abs(available)} /> : '••••'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
