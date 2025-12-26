'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card } from '@/components/ui/card';
import {
  Plus,
  Trash2,
  Edit2,
  Copy,
  Download,
  Upload,
  CheckCircle,
  Circle,
  Zap,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useCategorizationRules,
  useCreateCategorizationRule,
  useDeleteCategorizationRule,
  useEnableRule,
  useDisableRule,
  useDuplicateRule,
  useTestAllRules,
} from '@/lib/queries/use-categorization-rules-data';
import { useTransactionCategories } from '@/lib/queries/use-transaction-categories-data';
import { SolarCheckCircleBoldDuotone, StreamlineFlexFilter2 } from '../icons/icons';
import { CategoryCombobox } from '@/components/ui/category-combobox';

interface Rule {
  id: string;
  merchantPattern: string;
  categoryId: string;
  priority: number;
  isActive: boolean;
  appliedCount: number;
  confidence: number;
  description?: string;
  lastAppliedAt?: string;
}

interface RuleFormData {
  merchantPattern: string;
  categoryId: string;
  priority: string;
  confidence?: string;
  description?: string;
}

export function RulesManagement() {
  const { toast, update, dismiss } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [testMerchant, setTestMerchant] = useState('');
  const [testResult, setTestResult] = useState<{ matched: boolean; matchedRule?: Rule } | null>(null);
  const [optimisticRules, setOptimisticRules] = useState<Rule[] | null>(null);
  const [pendingOperations, setPendingOperations] = useState<Set<string>>(new Set());
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [ruleToDelete, setRuleToDelete] = useState<Rule | null>(null);

  // Queries and mutations
  const { data: rulesData, isLoading } = useCategorizationRules();
  const { data: categoriesData } = useTransactionCategories();
  const createRuleMutation = useCreateCategorizationRule();
  const deleteRuleMutation = useDeleteCategorizationRule();
  const enableRuleMutation = useEnableRule();
  const disableRuleMutation = useDisableRule();
  const duplicateRuleMutation = useDuplicateRule();
  const testAllRulesMutation = useTestAllRules();

  // Use optimistic rules if available, otherwise use server data
  const rules = optimisticRules ?? rulesData ?? [];

  // Flatten categories from groups for quick lookup
  const categoriesMap = new Map(
    categoriesData?.groups.flatMap(group =>
      group.categories.map(cat => [
        cat.id,
        { displayName: cat.displayName, emoji: cat.emoji, groupName: group.groupName }
      ])
    ) || []
  );

  // Helper to get category display info
  const getCategoryDisplay = (categoryId: string) => {
    return categoriesMap.get(categoryId) || { displayName: categoryId, emoji: undefined, groupName: '' };
  };

  // Filter rules
  const filteredRules = rules.filter((rule: Rule) => {
    const matchesSearch =
      rule.merchantPattern.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterActive === 'all' ||
      (filterActive === 'active' && rule.isActive) ||
      (filterActive === 'inactive' && !rule.isActive);

    return matchesSearch && matchesFilter;
  });

  // Sort by priority (highest first)
  const sortedRules = filteredRules.sort((a: Rule, b: Rule) => b.priority - a.priority);

  const handleCreateRule = useCallback(async (formData: RuleFormData) => {
    const previousRules = optimisticRules ?? rulesData;
    const newRuleId = `temp-${Date.now()}`;
    const optimisticNewRule: Rule = {
      id: newRuleId,
      merchantPattern: formData.merchantPattern.toUpperCase(),
      categoryId: formData.categoryId,
      priority: parseInt(formData.priority),
      confidence: parseFloat(formData.confidence || '0.95'),
      description: formData.description,
      isActive: true,
      appliedCount: 0,
    };

    // Optimistic update
    setOptimisticRules([optimisticNewRule, ...(previousRules || [])]);
    setIsCreateOpen(false);
    const toastId = toast({ title: 'Creating rule...', variant: 'loading' });

    try {
      await createRuleMutation.mutateAsync({
        merchantPattern: formData.merchantPattern.toUpperCase(),
        categoryId: formData.categoryId,
        priority: parseInt(formData.priority),
        confidence: parseFloat(formData.confidence || '0.95'),
        description: formData.description,
      });
      update(toastId, { title: 'Rule created', variant: 'success', duration: 3000 });
      // Let TanStack Query cache update naturally, don't force reset
    } catch (error) {
      console.error('Failed to create rule:', error);
      setOptimisticRules(previousRules || null);
      update(toastId, { title: 'Failed to create rule', variant: 'destructive', duration: 4000 });
    }
  }, [optimisticRules, rulesData, createRuleMutation, toast, update]);

  const handleToggleRule = useCallback(async (rule: Rule) => {
    const previousRules = optimisticRules ?? rulesData;
    const operationId = `toggle-${rule.id}`;

    // Optimistic update
    const updatedRules = (previousRules || []).map(r =>
      r.id === rule.id ? { ...r, isActive: !r.isActive } : r
    );
    setOptimisticRules(updatedRules);
    setPendingOperations(prev => new Set(prev).add(operationId));

    try {
      if (rule.isActive) {
        await disableRuleMutation.mutateAsync(rule.id);
      } else {
        await enableRuleMutation.mutateAsync(rule.id);
      }
      // Let TanStack Query cache update naturally, don't force reset
    } catch (error) {
      console.error('Failed to toggle rule:', error);
      setOptimisticRules(previousRules || null);
      toast({ title: 'Failed to update rule', variant: 'destructive', duration: 4000 });
    } finally {
      setPendingOperations(prev => {
        const next = new Set(prev);
        next.delete(operationId);
        return next;
      });
    }
  }, [optimisticRules, rulesData, enableRuleMutation, disableRuleMutation, toast]);

  const handleDeleteRule = useCallback(async (ruleId: string) => {
    const previousRules = optimisticRules ?? rulesData;

    // Optimistic update
    const updatedRules = (previousRules || []).filter(r => r.id !== ruleId);
    setOptimisticRules(updatedRules);
    setRuleToDelete(null);
    const toastId = toast({ title: 'Deleting rule...', variant: 'loading' });

    try {
      await deleteRuleMutation.mutateAsync(ruleId);
      update(toastId, { title: 'Rule deleted', variant: 'success', duration: 3000 });
      // Let TanStack Query cache update naturally, don't force reset
    } catch (error) {
      console.error('Failed to delete rule:', error);
      setOptimisticRules(previousRules || null);
      update(toastId, { title: 'Failed to delete rule', variant: 'destructive', duration: 4000 });
    }
  }, [optimisticRules, rulesData, deleteRuleMutation, toast, update]);

  const handleDuplicateRule = useCallback(async (rule: Rule) => {
    const previousRules = optimisticRules ?? rulesData;
    const newRuleId = `temp-${Date.now()}`;
    const duplicatedRule: Rule = {
      ...rule,
      id: newRuleId,
      priority: Math.max(0, rule.priority - 10),
    };

    // Optimistic update
    setOptimisticRules([duplicatedRule, ...(previousRules || [])]);
    const toastId = toast({ title: 'Duplicating rule...', variant: 'loading' });

    try {
      await duplicateRuleMutation.mutateAsync({
        ruleId: rule.id,
        newPriority: Math.max(0, rule.priority - 10),
      });
      update(toastId, { title: 'Rule duplicated', variant: 'success', duration: 3000 });
      // Let TanStack Query cache update naturally, don't force reset
    } catch (error) {
      console.error('Failed to duplicate rule:', error);
      setOptimisticRules(previousRules || null);
      update(toastId, { title: 'Failed to duplicate rule', variant: 'destructive', duration: 4000 });
    }
  }, [optimisticRules, rulesData, duplicateRuleMutation, toast, update]);

  const handleTestMerchant = async () => {
    if (!testMerchant.trim()) return;
    try {
      const result = await testAllRulesMutation.mutateAsync(testMerchant);
      setTestResult(result);
    } catch (error) {
      console.error('Failed to test merchant:', error);
    }
  };

  console.log(rulesData)

  return (
    <div className="h-full flex flex-col space-y-4 max-w-7xl mx-auto">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex-1">
          <div className="relative">
            <Input
              placeholder="Search by pattern or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs h-9"
            />
          </div>
        </div>

        <div className="flex gap-2">

                 <CreateRuleDialog onSubmit={handleCreateRule} isOpen={isCreateOpen} setIsOpen={setIsCreateOpen}>
            <Button variant="brand" size="xs" className="gap-2">
              <Plus className="h-4 w-4" />
              New Rule
            </Button>
          </CreateRuleDialog>
          <Select value={filterActive} onValueChange={(v: string) => setFilterActive(v as 'all' | 'active' | 'inactive')}>
            <SelectTrigger variant="outline2" size="xs" >
              <StreamlineFlexFilter2 className="h-3.5 w-3.5" />
              Filter
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rules</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>

   

          <Button variant="outlinemuted2" size="icon-sm" title="Export rules">
            <Download className="h-4 w-4" />
          </Button>

          <Button variant="outlinemuted2" size="icon-sm" title="Import rules">
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Test Merchant Section */}
      <div className=" border-none space-y-3">
   
        <div className="flex  justify-end gap-2">
          <Input
            placeholder="Enter merchant name to test..."
            value={testMerchant}
            onChange={(e) => setTestMerchant(e.target.value)}
            className="h-8 max-w-sm"
         
          />
          <Button
            variant="outline2"
            size="sm"
            onClick={handleTestMerchant}
            disabled={!testMerchant.trim() || testAllRulesMutation.isPending}
          >
            Test
          </Button>

           {testResult && (
          <div className={cn(
            'p-2 rounded-lg text-sm',
            testResult.matched
              ? 'bg-lime-50  dark:bg-lime-500/10 text-lime-800 dark:text-lime-600'
              : 'bg-amber-50   text-amber-900'
          )}>
            {testResult.matched ? (
              <div className="space-y-1">
                <p className="font-medium">Matched: {testResult.matchedRule.merchantPattern}</p>
                <p className="text-xs flex items-center gap-2">
                  {(() => {
                    const catDisplay = getCategoryDisplay(testResult.matchedRule.categoryId);
                    return (
                      <>
                        {catDisplay.emoji && <span>{catDisplay.emoji}</span>}
                        <span>Category: {catDisplay.displayName}</span>
                      </>
                    );
                  })()}
                  | Priority: {testResult.matchedRule.priority}
                </p>
              </div>
            ) : (
              <p>No matching rule found for &quot;{testMerchant}&quot;</p>
            )}
          </div>
        )}
        </div>

       
      </div>

      {/* Rules List */}
      <div className="flex-1 overflow-auto space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Loading rules...
          </div>
        ) : sortedRules.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <p className="text-sm">
              {searchTerm || filterActive !== 'all'
                ? 'No matching rules found'
                : 'No rules created yet'}
            </p>
          </div>
        ) : (
          sortedRules.map((rule: Rule) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              categoryDisplay={getCategoryDisplay(rule.categoryId)}
              onToggle={() => handleToggleRule(rule)}
              onEdit={() => setEditingRule(rule)}
              onDelete={() => setRuleToDelete(rule)}
              onDuplicate={() => handleDuplicateRule(rule)}
              isTogglePending={pendingOperations.has(`toggle-${rule.id}`)}
              isDeletePending={pendingOperations.has(`delete-${rule.id}`)}
              isDuplicatePending={pendingOperations.has(`duplicate-${rule.id}`)}
            />
          ))
        )}
      </div>

      {/* Stats */}
      {rules.length > 0 && (
        <div className="border-t border-border/30 pt-3 text-xs text-muted-foreground flex justify-between">
          <span>{sortedRules.length} of {rules.length} rules shown</span>
          <span>{rules.filter((r: Rule) => r.isActive).length} active</span>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!ruleToDelete} onOpenChange={(open) => !open && setRuleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Rule?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the rule for <span className="font-semibold text-foreground">"{ruleToDelete?.merchantPattern}"</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (ruleToDelete) {
                  handleDeleteRule(ruleToDelete.id);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================================================
// CREATE RULE DIALOG
// ============================================================================

interface CreateRuleDialogProps {
  onSubmit: (data: RuleFormData) => Promise<void>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  children: React.ReactNode;
}

function CreateRuleDialog({ onSubmit, isOpen, setIsOpen, children }: CreateRuleDialogProps) {
  const { data: categoriesData } = useTransactionCategories();
  const [formData, setFormData] = useState({
    merchantPattern: '',
    categoryId: '',
    priority: '50',
    confidence: '0.95',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Flatten categories from groups
  const categories = categoriesData?.groups.flatMap(group =>
    group.categories.map(cat => ({
      id: cat.id,
      displayName: cat.displayName,
      emoji: cat.emoji,
      groupName: group.groupName,
      groupIcon: group.groupIcon,
    }))
  ) || [];

  // Set first category as default when categories load
  if (categories.length > 0 && !formData.categoryId) {
    setFormData(prev => ({ ...prev, categoryId: categories[0].id }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        merchantPattern: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        priority: '50',
        confidence: '0.95',
        description: '',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Categorization Rule</DialogTitle>
          <DialogDescription >
            Create a new rule to automatically categorize transactions based on merchant name patterns.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Merchant Pattern *</label>
            <Input
              placeholder="e.g., AMAZON, STARBUCKS, NETFLIX"
              value={formData.merchantPattern}
              onChange={(e) =>
                setFormData({ ...formData, merchantPattern: e.target.value.toUpperCase() })
              }
              required
            />
            <p className="text-xs text-muted-foreground">
              Substring to match in merchant names (case-insensitive)
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category *</label>
            <CategoryCombobox
              categoryId={formData.categoryId}
              categories={categories}
              onCategoryChange={(categoryId) => setFormData({ ...formData, categoryId })}
              disabled={categories.length === 0}
            />
            {categories.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No categories available
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Higher = applies first (0-100)</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Confidence</label>
              <Input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.confidence}
                onChange={(e) => setFormData({ ...formData, confidence: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Match confidence (0-1)</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              placeholder="e.g., All Amazon purchases"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.merchantPattern}>
              {isSubmitting ? 'Creating...' : 'Create Rule'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// RULE CARD COMPONENT
// ============================================================================

interface RuleCardProps {
  rule: Rule;
  categoryDisplay?: { displayName: string; emoji?: string; groupName: string };
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  isTogglePending?: boolean;
  isDeletePending?: boolean;
  isDuplicatePending?: boolean;
}

function RuleCard({
  rule,
  categoryDisplay,
  onToggle,
  onEdit,
  onDelete,
  onDuplicate,
  isTogglePending = false,
  isDeletePending = false,
  isDuplicatePending = false,
}: RuleCardProps) {
  return (
    <Card className={cn(
      "flex flex-row items-start justify-between gap-2 shadow-xl transition-opacity duration-100 bg-none border-none",
      isDeletePending && "opacity-50"
    )}

    >

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Button
              onClick={onToggle}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-all"
              title={rule.isActive ? 'Disable rule' : 'Enable rule'}
              variant='ghost'
              size='icon'
              disabled={isTogglePending}
            >
              {isTogglePending ? (
                <Circle className="h-8 w-8 animate-pulse" />
              ) : rule.isActive ? (
                <SolarCheckCircleBoldDuotone className="h-8 w-8 text-lime-700" />
              ) : (
                <Circle className="h-8 w-8" />
              )}
            </Button>
            <div>
              <p className="font-medium text-sm">{rule.merchantPattern}</p>
              {rule.description && (
                <p className="text-xs text-muted-foreground">{rule.description}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="bg-muted/50 px-2 py-1 rounded flex items-center gap-1">
              {categoryDisplay?.emoji ? (
                <span className="text-sm">{categoryDisplay.emoji}</span>
              ) : (
                <Tag className="h-3.5 w-3.5" />
              )}
              <span>Category: {categoryDisplay?.displayName || rule.categoryId}</span>
            </span>
            <span className="bg-muted/50 px-2 py-1 rounded">
              Priority: {rule.priority}
            </span>
            <span className="bg-muted/50 px-2 py-1 rounded">
              Confidence: {(rule.confidence * 100).toFixed(0)}%
            </span>
            <span className="bg-muted/50 px-2 py-1 rounded">
              Applied: {rule.appliedCount} times
            </span>
          </div>

          {rule.lastAppliedAt && (
            <p className="text-xs text-muted-foreground">
              Last applied: {new Date(rule.lastAppliedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onDuplicate}
            disabled={isDuplicatePending}
            className={cn(
              "  hover:bg-muted rounded transition-all",
              isDuplicatePending && "opacity-50 cursor-not-allowed"
            )}
            title="Duplicate rule"
            variant='ghost'
            size='icon-xs'
          >
            <Copy className={cn("h-4 w-4 text-muted-foreground", isDuplicatePending && "animate-pulse")} />
          </Button>
          <Button
            onClick={onEdit}
            disabled={isDeletePending || isDuplicatePending || isTogglePending}
            className={cn(
              " hover:bg-muted rounded transition-all",
              (isDeletePending || isDuplicatePending || isTogglePending) && "opacity-50 cursor-not-allowed"
            )}
            title="Edit rule"
              variant='ghost'
            size='icon-xs'
          >
            <Edit2 className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button
            onClick={onDelete}
            disabled={isDeletePending}
            className={cn(
              " hover:bg-muted rounded transition-all text-red-500/50 hover:text-red-500",
              isDeletePending && "opacity-50 cursor-not-allowed"
            )}
            title="Delete rule"
              variant='ghost'
            size='icon-xs'
          >
            <Trash2 className={cn("h-4 w-4", isDeletePending && "animate-pulse")} />
          </Button>
        </div>
   
    </Card>
  );
}
