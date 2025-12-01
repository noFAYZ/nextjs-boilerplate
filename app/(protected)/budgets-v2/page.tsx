'use client';

import React, { useMemo, useState } from 'react';
import { usePostHogPageView } from '@/lib/hooks/usePostHogPageView';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useCategoryGroups,
  useAllocateFunds,
  useRecordSpending,
} from '@/lib/queries/use-category-groups-data';
import { useEnvelopeUIStore } from '@/lib/stores/envelope-ui-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { toast } from 'sonner';

// ============================================================================
// SWITCH COMPONENT
// ============================================================================

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-5 w-9 rounded-full transition-colors',
          checked ? 'bg-primary' : 'bg-muted'
        )}
      >
        <div
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform',
            checked ? 'translate-x-4' : 'translate-x-0.5'
          )}
        />
      </button>
      {label && <span className="text-xs font-medium">{label}</span>}
    </div>
  );
}

// ============================================================================
// POPOVER COMPONENT
// ============================================================================

function Popover({
  open,
  onOpenChange,
  trigger,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {trigger}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => onOpenChange(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 bg-card border border-border/40 rounded-lg shadow-lg min-w-max">
            {children}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function BudgetsV2Page() {
  usePostHogPageView('budgets-v2');

  // Auth
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthReady = !!user && isInitialized;

  // UI State
  const { showBalances, setShowBalances } = useEnvelopeUIStore();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [spendModalOpen, setSpendModalOpen] = useState(false);
  const [selectedEnvelope, setSelectedEnvelope] = useState<any>(null);
  const [addCategoryPopover, setAddCategoryPopover] = useState<string | null>(null);
  const [addGroupModalOpen, setAddGroupModalOpen] = useState(false);

  // Popovers
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [sortPopoverOpen, setSortPopoverOpen] = useState(false);
  const [columnPopoverOpen, setColumnPopoverOpen] = useState(false);

  // Filters & Sort
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'zero'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'allocated' | 'spent'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [visibleColumns, setVisibleColumns] = useState({
    leftover: true,
    assigned: true,
    activity: true,
    available: true,
    actions: true,
  });

  // Queries
  const { data: rawData, isLoading: groupsLoading } = useCategoryGroups({
    includeCategories: true,
    activeOnly: false,
  });

  const groups = rawData?.data || [];

  // Flatten all categories
  const allEnvelopes = useMemo(() => {
    if (!groups) return [];
    const envelopes: any[] = [];
    groups.forEach((group: any) => {
      (group.categories || []).forEach((cat: any) => {
        envelopes.push({ ...cat, groupId: group.id, groupName: group.name });
      });
    });
    return envelopes;
  }, [groups]);

  // Filter by search
  const filteredEnvelopes = useMemo(() => {
    let filtered = allEnvelopes;

    if (searchQuery) {
      filtered = filtered.filter((env) =>
        env.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus === 'active') {
      filtered = filtered.filter((env) => env.isActive);
    } else if (filterStatus === 'zero') {
      filtered = filtered.filter((env) => (env.allocatedAmount || 0) === 0);
    }

    return filtered;
  }, [allEnvelopes, searchQuery, filterStatus]);

  // Group envelopes by their group
  const groupedEnvelopes = useMemo(() => {
    const grouped = new Map<string, any[]>();
    filteredEnvelopes.forEach((env) => {
      if (!grouped.has(env.groupId)) {
        grouped.set(env.groupId, []);
      }
      grouped.get(env.groupId)?.push(env);
    });
    return grouped;
  }, [filteredEnvelopes]);

  // Sort and group
  const sortedGroups = useMemo(() => {
    return groups
      .map((group: any) => {
        let categories = groupedEnvelopes.get(group.id) || [];
  
        categories = categories.sort((a, b) => {
          const aAllocated = Number(a.allocatedAmount) || 0;
          const bAllocated = Number(b.allocatedAmount) || 0;
  
          const aSpent = Number(a.totalSpent) || 0;
          const bSpent = Number(b.totalSpent) || 0;
  
          let comparison = 0;
  
          if (sortBy === 'name') {
            comparison = (a.name || '').localeCompare(b.name || '');
          } else if (sortBy === 'allocated') {
            comparison = bAllocated - aAllocated; // desc base
          } else if (sortBy === 'spent') {
            comparison = bSpent - aSpent; // desc base
          }
  
          return sortOrder === 'asc' ? comparison : -comparison;
        });
  
        return { ...group, categories };
      })
      .filter((group) => group.categories.length > 0);
  }, [groups, groupedEnvelopes, sortBy, sortOrder]);
  
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

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const toggleColumn = (column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column as keyof typeof prev],
    }));
  };

  const spendMutation = useRecordSpending(selectedEnvelope?.id);

  const handleRecordSpending = (amount: number) => {
    if (amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    spendMutation.mutate(
      {
        amount,
        description: 'Spending record',
      },
      {
        onSuccess: () => {
          toast.success('Spending recorded');
          setSpendModalOpen(false);
          setSelectedEnvelope(null);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to record spending');
        },
      }
    );
  };

  return (
    <div className=" space-y-4">
 
      {/* Main Content */}
   
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-2">
          {/* Table */}
          <div className="lg:col-span-5">
            <Card className="border border-border/80 overflow-visible p-0 rounded-xs shadow">

                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted border-b border-border/60">
                      <th className="px-4  text-left font-semibold text-foreground h-9">
                      <div className="flex items-center gap-1">
                      
  {/* Create Group */}
  <Button
              variant="outlinemuted"
              size="xs"
              onClick={() => setAddGroupModalOpen(true)}
        icon={ <FolderPlus className="h-4 w-4" />}
            >
             
          
            </Button>
            {/* Toolbar Buttons */}
            <Popover
              open={filterPopoverOpen}
              onOpenChange={setFilterPopoverOpen}
              trigger={
                <Button
                  variant="outlinemuted"
                  size="xs"
              
                  onClick={() => setFilterPopoverOpen(!filterPopoverOpen)}
                  icon={ <Filter className="h-4 w-4" />}
                  
                >   
                </Button>
              }
            >
              <div className="p-2 space-y-3 w-40 z-50">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">Status</p>
                  <div className="space-y-0">
                    {(['all', 'active', 'zero'] as const).map((status) => (
                      <label
                        key={status}
                        className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-muted/50 transition-colors"
                      >
                        <input
                          type="radio"
                          name="status"
                          value={status}
                          checked={filterStatus === status}
                          onChange={(e) => setFilterStatus(e.target.value as typeof status)}
                          className="h-4 w-4"
                        />
                        <span className="text-xs capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Popover>

            {/* Sort Popover */}
            <Popover
              open={sortPopoverOpen}
              onOpenChange={setSortPopoverOpen}
              trigger={
                <Button
                  variant="outlinemuted"
                  size="xs"
            icon={ <ArrowUpDown className="h-4 w-4" />}
                  onClick={() => setSortPopoverOpen(!sortPopoverOpen)}
                >
                 
           
                </Button>
              }
            >
              <div className="p-3 space-y-1 w-40">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">Sort By</p>
                  <div className="space-y-0">
                    {(['name', 'allocated', 'spent'] as const).map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-muted/50 transition-colors"
                      >
                        <input
                          type="radio"
                          name="sort"
                          value={option}
                          checked={sortBy === option}
                          onChange={(e) => setSortBy(e.target.value as typeof option)}
                          className="h-4 w-4"
                        />
                        <span className="text-xs capitalize">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Order</span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="h-7 text-xs"
                    >
                      {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
                    </Button>
                  </div>
                </div>
              </div>
            </Popover>

            {/* Columns Popover */}
            <Popover
              open={columnPopoverOpen}
              onOpenChange={setColumnPopoverOpen}
              trigger={
                <Button
                 variant="outlinemuted"
              size="xs"
              className=''
                  onClick={() => setColumnPopoverOpen(!columnPopoverOpen)}
                >
                  <Settings className="h-4 w-4" />
                
                </Button>
              }
            >
              <div className="p-3 space-y-2 w-40">
                {Object.entries(visibleColumns).map(([key, visible]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-xs capitalize">{key}</span>
                    <Switch
                      checked={visible}
                      onChange={() => toggleColumn(key)}
                    />
                  </div>
                ))}
              </div>
            </Popover>

        
          
          </div>
                      </th>
                      {visibleColumns.leftover && (
                        <th className="px-4  text-right font-semibold text-foreground">
                          Leftover
                        </th>
                      )}
                      {visibleColumns.assigned && (
                        <th className="px-4 text-right font-semibold text-foreground">
                          Assigned
                        </th>
                      )}
                      {visibleColumns.activity && (
                        <th className="px-4  text-right font-semibold text-foreground">
                          Activity
                        </th>
                      )}
                      {visibleColumns.available && (
                        <th className="px-4 text-right font-semibold text-foreground">
                          Available
                        </th>
                      )}
                      {visibleColumns.actions && (
                        <th className="px-4  text-center font-semibold text-foreground">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        </td>
                      </tr>
                    ) : sortedGroups.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground text-sm">
                          No categories found
                        </td>
                      </tr>
                    ) : (
                      sortedGroups.map((group: any) => {
                        const groupEnvelopes = group.categories || [];
                        const isExpanded = expandedGroups.has(group.id);

                        return (
                          <React.Fragment key={group.id}>
                            {/* Group Header */}
                            <tr
                              className="border-b border-border/50 hover:bg-background cursor-pointer transition-colors bg-muted/25"
                              onClick={() => toggleGroup(group.id)}
                            >
                              <td className="px-4  font-semibold flex items-center gap-1 h-8">
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                                )}
                                {group.icon && <span className="text-lg">{group.icon}</span>}
                                <span className="truncate">{group.name}</span>
                                <span className="ml-auto text-xs text-muted-foreground font-normal">
                                  {groupEnvelopes.length}
                                </span>
                              </td>
                              <td colSpan={5}>
                                <div className="flex items-center justify-end gap-1 px-4  h-8">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAddCategoryPopover(
                                        addCategoryPopover === group.id ? null : group.id
                                      );
                                    }}
                                    className="h-6 w-6 p-0 rounded-full bg-primary/10"
                                    title="Add category"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>

                            {/* Add Category Form */}
                            {addCategoryPopover === group.id && (
                              <tr className="border-b border-border/40 bg-muted/50">
                                <td colSpan={6} className="px-4 py-3">
                                  <AddCategoryForm
                                    groupId={group.id}
                                    onClose={() => setAddCategoryPopover(null)}
                                  />
                                </td>
                              </tr>
                            )}

                            {/* Category Rows */}
                            {isExpanded &&
                              groupEnvelopes.map((envelope: any, idx: number) => (
                                <CategoryRow
                                  key={envelope.id}
                                  envelope={envelope}
                                  showBalances={showBalances}
                                  visibleColumns={visibleColumns}
                                  isLast={idx === groupEnvelopes.length - 1}
                                  onSpendClick={(env) => {
                                    setSelectedEnvelope(env);
                                    setSpendModalOpen(true);
                                  }}
                                />
                              ))}
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
        
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Summary */}
            <Card className="border border-border/40 p-3">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Summary</CardTitle>
              </CardHeader>
        
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Income</div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {showBalances ? (
                      <CurrencyDisplay amountUSD={totals.totalAllocated} />
                    ) : (
                      '••••'
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">Expenses</div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    -{showBalances ? <CurrencyDisplay amountUSD={totals.totalSpent} /> : '••••'}
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40">
                  <div className="text-xs text-muted-foreground mb-1">Net</div>
                  <div
                    className={cn(
                      'text-2xl font-bold',
                      totals.totalBalance < 0
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    )}
                  >
                    {showBalances ? (
                      <CurrencyDisplay amountUSD={totals.totalBalance} />
                    ) : (
                      '••••'
                    )}
                  </div>
                </div>
       
            </Card>

            {/* Status */}
            <Card className="border border-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">
                      {totals.totalAllocated > 0
                        ? ((totals.totalSpent / totals.totalAllocated) * 100).toFixed(0)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all',
                        (totals.totalSpent / totals.totalAllocated) * 100 > 100
                          ? 'bg-red-500'
                          : (totals.totalSpent / totals.totalAllocated) * 100 >= 80
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      )}
                      style={{
                        width: `${Math.min(
                          (totals.totalSpent / totals.totalAllocated) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/40">
                  {[
                    { label: 'Allocated', value: totals.totalAllocated },
                    { label: 'Spent', value: totals.totalSpent },
                    { label: 'Available', value: Math.max(0, totals.totalBalance) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-semibold">
                        {showBalances ? (
                          <CurrencyDisplay amountUSD={value} />
                        ) : (
                          '••••'
                        )}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs pt-2 border-t border-border/40">
                    <span className="text-muted-foreground">At Risk</span>
                    <span className="font-semibold text-amber-600">
                      {totals.exceededCount}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
 

      {/* Spend Modal */}
      {spendModalOpen && selectedEnvelope && (
        <SpendModal
          envelope={selectedEnvelope}
          onClose={() => {
            setSpendModalOpen(false);
            setSelectedEnvelope(null);
          }}
          onSubmit={handleRecordSpending}
          isLoading={spendMutation.isPending}
        />
      )}
    </div>
  );
}

// ============================================================================
// ADD CATEGORY FORM
// ============================================================================

function AddCategoryForm({
  groupId,
  onClose,
}: {
  groupId: string;
  onClose: () => void;
}) {
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error('Category name required');
      return;
    }
    setIsLoading(true);
    // TODO: Call API to create category
    setTimeout(() => {
      toast.success(`Category created`);
      setCategoryName('');
      onClose();
      setIsLoading(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Category name..."
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        className="h-8 text-sm flex-1"
        autoFocus
      />
      <Button size="sm" type="submit" disabled={isLoading} className="h-8">
        {isLoading ? '...' : 'Add'}
      </Button>
      <Button
        size="sm"
        variant="outline"
        type="button"
        onClick={onClose}
        className="h-8"
      >
        Cancel
      </Button>
    </form>
  );
}

// ============================================================================
// CATEGORY ROW
// ============================================================================

function CategoryRow({
  envelope,
  showBalances,
  visibleColumns,
  isLast,
  onSpendClick,
}: {
  envelope: any;
  showBalances: boolean;
  visibleColumns: Record<string, boolean>;
  isLast: boolean;
  onSpendClick: (envelope: any) => void;
}) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const allocateMutation = useAllocateFunds(envelope.id);

  const allocated = Number(envelope.allocatedAmount) || 0;
  const spent = Number(envelope.totalSpent) || 0;
  const balance = Number(envelope.currentBalance) || 0;
  const percentage = Number(envelope.percentageUsed) || 0;

  const handleEditAllocation = (value: string) => {
    const amount = parseFloat(value);
    if (isNaN(amount) || amount < 0) {
      toast.error('Invalid amount');
      return;
    }

    allocateMutation.mutate(
      { amount, description: 'Allocation adjustment' },
      {
        onSuccess: () => {
          toast.success('Allocation updated');
          setEditingField(null);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to update');
        },
      }
    );
  };

  return (
    <tr className="border-b border-border/40 hover:bg-muted/50 transition-colors">
      <td className="px-4 py-1 h-8">
        <div className="flex items-center gap-2">
          {envelope.icon && <span className="text-xl">{envelope.icon}</span>}
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold truncate ">{envelope.name}
              <span className='ml-2 text-muted-foreground bg-muted rounded-full shadow text-[11px] border px-1'>{percentage.toFixed(0)}%</span>
            </div>
            
          </div>
        </div>
      </td>

      {visibleColumns.leftover && (
        <td className="px-4 py-1 text-right h-8">
          <div
            className={cn(
              'text-xs font-semibold',
              balance < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-emerald-600 dark:text-emerald-400'
            )}
          >
            {showBalances ? (
              <CurrencyDisplay amountUSD={Math.abs(balance)} variant='small' />
            ) : (
              '••••'
            )}
          </div>
        {/*   <div className="text-[11px] text-muted-foreground">
            {balance < 0 ? 'Over' : 'Left'}
          </div> */}
        </td>
      )}

      {visibleColumns.assigned && (
        <td className=" py-1 text-right h-8">
          {editingField === 'assigned' ? (
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => {
                handleEditAllocation(editValue);
                setEditingField(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEditAllocation(editValue);
                  setEditingField(null);
                }
                if (e.key === 'Escape') setEditingField(null);
              }}
              autoFocus
              className="w-24 px-2 py-1 text-sm text-right border border-primary rounded bg-background"
              placeholder="0.00"
            />
          ) : (
            <button
              onClick={() => {
                setEditValue(allocated.toString());
                setEditingField('assigned');
              }}
              className="text-sm font-semibold cursor-pointer hover:text-primary transition-colors"
            >
              {showBalances ? (
                <CurrencyDisplay amountUSD={allocated} variant='small'  />
              ) : (
                '••••'
              )}
            </button>
          )}
        </td>
      )}

      {visibleColumns.activity && (
        <td className="px-4 py-1 text-right h-8">
          <button
            onClick={() => onSpendClick(envelope)}
            className="text-sm font-semibold cursor-pointer hover:text-primary transition-colors"
            title="Record spending"
          >
            {showBalances ? (
              <CurrencyDisplay amountUSD={spent} variant='small'  />
            ) : (
              '••••'
            )}
          </button>
        </td>
      )}

      {visibleColumns.available && (
        <td className="px-4 py-1 h-8">
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all',
                percentage > 100
                  ? 'bg-red-500'
                  : percentage >= 80
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </td>
      )}

      {visibleColumns.actions && (
        <td className="px-4 py-1 text-center h-8">
          <button
            title="Transfer funds"
            className="inline-flex items-center justify-center h-7 w-7 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>
        </td>
      )}
    </tr>
  );
}

// ============================================================================
// SPEND MODAL
// ============================================================================

function SpendModal({
  envelope,
  onClose,
  onSubmit,
  isLoading,
}: {
  envelope: any;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  isLoading: boolean;
}) {
  const [amount, setAmount] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Record Spending</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Category</p>
            <p className="font-semibold">{envelope.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Amount</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="mt-1"
              step="0.01"
              autoFocus
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={() => onSubmit(parseFloat(amount))}
              disabled={isLoading || !amount}
            >
              {isLoading ? 'Recording...' : 'Record'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
