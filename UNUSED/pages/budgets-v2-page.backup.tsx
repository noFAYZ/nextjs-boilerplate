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
import { useToast } from "@/lib/hooks/useToast";

/**
 * ARCHIVED: This file has been moved to UNUSED/pages/budgets-v2-page.backup.tsx
 * This was a development backup of the budgets-v2 page before production moved to budgets-v3
 *
 * To restore: Copy this file back to app/(protected)/budgets-v2/page.tsx
 * Then test thoroughly with: npm run build && npm run dev
 */

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
  const toast = useToast();

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
      toast.toast({ title: 'Success', description: 'Envelope created successfully', variant: 'success' });
      closeCreateEnvelopeModal();
      await refetchEnvelopes();
      await refetchDashboard();
    } catch (error) {
      toast.toast({ title: 'Error', description: 'Failed to create envelope', variant: 'destructive' });
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
      {/* ARCHIVED - See UNUSED/pages/budgets-v2-page.backup.tsx for full implementation */}
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <Card className="border-yellow-200 dark:border-yellow-900/50 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">This page has been archived</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Budgets V2 (envelope-based approach) has been replaced by Budgets V3 with improved features.
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Full backup available at: UNUSED/pages/budgets-v2-page.backup.tsx
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Original implementation truncated - see UNUSED/pages/budgets-v2-page.backup.tsx.full for complete code
