"use client";

import { useState, useEffect, useMemo, memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  MoreHorizontal,
  DollarSign,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import type { UserSubscription } from "@/lib/types/subscription";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSubscriptionUIStore } from "@/lib/stores/subscription-ui-store";
import styles from "./subscriptions-data-table.module.css";

interface SubscriptionsDataTableProps {
  subscriptions: UserSubscription[];
  isLoading?: boolean;
  error?: Error | null;
  onEdit?: (subscription: UserSubscription) => void;
  onDelete?: (subscription: UserSubscription) => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

const ITEMS_PER_PAGE = 20;

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    case "TRIAL":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    case "CANCELLED":
    case "EXPIRED":
      return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
    case "PAUSED":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
    case "PAYMENT_FAILED":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getBillingCycleDisplay = (cycle: string) => {
  const cycles: Record<string, string> = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    BIWEEKLY: "Bi-weekly",
    MONTHLY: "Monthly",
    QUARTERLY: "Quarterly",
    SEMI_ANNUAL: "Semi-annual",
    YEARLY: "Yearly",
    CUSTOM: "Custom",
  };
  return cycles[cycle] || cycle;
};

// Memoized row component for efficient rendering
const SubscriptionTableRow = memo(function SubscriptionTableRow({
  subscription,
  isSelected,
  isDeleting,
  onSelectRow,
  onEdit,
  onDelete,
  router,
  imageError,
  onImageError,
}: {
  subscription: UserSubscription;
  isSelected: boolean;
  isDeleting: boolean;
  onSelectRow: (id: string, checked: boolean) => void;
  onEdit?: (subscription: UserSubscription) => void;
  onDelete?: (subscription: UserSubscription) => void;
  router: ReturnType<typeof useRouter>;
  imageError: boolean;
  onImageError: (subscriptionId: string) => void;
}) {
  const handleSelectChange = useCallback(
    (checked: boolean) => {
      onSelectRow(subscription.id, checked);
    },
    [subscription.id, onSelectRow]
  );

  const handleEditClick = useCallback(() => {
    onEdit?.(subscription);
  }, [subscription, onEdit]);

  const handleDeleteClick = useCallback(() => {
    onDelete?.(subscription);
  }, [subscription, onDelete]);

  const handleNameClick = useCallback(() => {
    router.push(`/subscriptions/${subscription.id}`);
  }, [subscription.id, router]);

  return (
    <TableRow
      className={cn(
        styles.tableRow,
        "group border-b border-border/30 py-2 hover:bg-muted/30",
        isDeleting && styles.rowDeleting,
        isSelected && "bg-primary/5"
      )}
      data-testid={`subscription-row-${subscription.id}`}
    >
      <TableCell className="px-2 sm:px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleSelectChange}
          aria-label={`Select ${subscription.name}`}
        />
      </TableCell>

      <TableCell
        onClick={handleNameClick}
        className={cn(styles.clickableCell, "cursor-pointer px-2 sm:px-4 py-3 group-hover:text-primary")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleNameClick();
          }
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-muted flex-shrink-0 overflow-hidden">
            {subscription.logoUrl && !imageError ? (
              <Image
                src={subscription.logoUrl}
                alt={subscription.name}
                fill
                className="object-cover"
                priority={false}
                onError={() => onImageError(subscription.id)}
              />
            ) : (
              <div
                className="w-full h-full flex items-center rounded-full justify-center bg-primary text-primary-foreground"
                aria-label={`${subscription.name} logo placeholder`}
              >
                <span className="font-bold text-xs sm:text-sm">
                  {subscription.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 sm:gap-2">
              <p className="font-semibold text-xs sm:text-sm truncate">
                {subscription.name}
              </p>
              {subscription.category && (
                <Badge variant="outline" className="hidden sm:inline-flex text-xs rounded-sm">
                  {subscription.category.replace(/_/g, " ")}
                </Badge>
              )}
            </div>
            {subscription.description && (
              <p className="text-xs text-muted-foreground truncate hidden sm:block">
                {subscription.description}
              </p>
            )}
          </div>
        </div>
      </TableCell>

      <TableCell className="hidden sm:table-cell text-right px-4 py-3">
        <Badge
          className={cn(
            "text-xs rounded-md font-medium",
            getStatusColor(subscription.status)
          )}
        >
          {subscription.status}
        </Badge>
      </TableCell>

      <TableCell className="hidden lg:table-cell text-right px-4 py-3">
        <p className="text-sm font-medium">
          {getBillingCycleDisplay(subscription.billingCycle)}
        </p>
      </TableCell>

      <TableCell className="hidden xl:table-cell text-right px-4 py-3">
        <span className="text-sm font-semibold">
          <CurrencyDisplay amountUSD={subscription.amount} variant="small" />
        </span>
      </TableCell>

      <TableCell className="text-right px-2 sm:px-4 py-3 whitespace-nowrap">
        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm font-semibold">
            <CurrencyDisplay
              amountUSD={subscription.monthlyEquivalent}
              variant="small"
            />
          </span>
          {subscription.monthlyEquivalent >= 20 && (
            <Badge variant="outline" className="hidden sm:inline-flex text-xs font-medium">
              High
            </Badge>
          )}
        </div>
      </TableCell>

      <TableCell className="hidden lg:table-cell text-right px-4 py-3">
        {subscription.nextBillingDate ? (
          <div>
            <p className="text-sm font-semibold">
              {new Date(subscription.nextBillingDate).toLocaleDateString()}
            </p>
            {subscription.daysUntilNextBilling !== undefined && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {subscription.daysUntilNextBilling === 0
                  ? "Today"
                  : subscription.daysUntilNextBilling === 1
                    ? "Tomorrow"
                    : `in ${subscription.daysUntilNextBilling} days`}
              </p>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </TableCell>

      <TableCell
        className="text-center px-2 sm:px-4 py-3"
        onClick={(e) => e.stopPropagation()}
      >
        {isDeleting ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className={styles.actionsContainer}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-8 w-8"
                  aria-label={`Actions for ${subscription.name}`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEditClick}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit {subscription.name}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteClick}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete {subscription.name}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
});

export function SubscriptionsDataTable({
  subscriptions,
  isLoading,
  error,
  onEdit,
  onDelete,
  selectedIds: externalSelectedIds = [],
  onSelectionChange,
}: SubscriptionsDataTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>(externalSelectedIds);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const deletingSubscriptionIds = useSubscriptionUIStore((state) => state.deletingSubscriptionIds);

  const handleImageError = useCallback((subscriptionId: string) => {
    setImageErrors((prev) => new Set(prev).add(subscriptionId));
  }, []);

  // Sync with external selectedIds
  useEffect(() => {
    setSelectedIds(externalSelectedIds);
  }, [externalSelectedIds]);

  // Paginate subscriptions with memoization
  const totalPages = Math.ceil(subscriptions.length / ITEMS_PER_PAGE);
  const paginatedSubscriptions = useMemo(
    () => subscriptions.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    ),
    [subscriptions, currentPage]
  );

  // Notify parent of selection changes (decoupled from state update)
  useEffect(() => {
    onSelectionChange?.(selectedIds);
  }, [selectedIds, onSelectionChange]);

  // Selection handlers with useCallback
  const handleSelectAll = useCallback((checked: boolean) => {
    const newIds = checked ? paginatedSubscriptions.map((s) => s.id) : [];
    setSelectedIds(newIds);
  }, [paginatedSubscriptions]);

  const handleSelectRow = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      return checked
        ? [...prev, id]
        : prev.filter((sid) => sid !== id);
    });
  }, []);

  const isAllSelected = paginatedSubscriptions.length > 0 && paginatedSubscriptions.every((s) => selectedIds.includes(s.id));
  const isSomeSelected = selectedIds.length > 0 && !isAllSelected;

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-10 bg-muted animate-pulse rounded-lg" />
        <div className="rounded-xl">
          <div className="h-12 bg-muted rounded-xl animate-pulse" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 border border-destructive/50 rounded-xl bg-destructive/5">
        <div className="text-destructive mb-4">
          <DollarSign className="h-12 w-12 mx-auto opacity-50" />
        </div>
        <h3 className="text-lg font-semibold text-destructive mb-2">Failed to load subscriptions</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {error instanceof Error ? error.message : "An unexpected error occurred"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-primary hover:underline"
        >
          Try refreshing the page
        </button>
      </div>
    );
  }

  const selectedSubscriptions = paginatedSubscriptions.filter((s) =>
    selectedIds.includes(s.id)
  );

  return (
    <div className="space-y-4">
      {/* Data Table */}
      <div className="bg-card border border-border/80 rounded-xl overflow-x-auto shadow-sm" role="region" aria-label="Subscriptions data table">
        <Table aria-label="Subscriptions list">
          <TableHeader className="bg-muted/80 border-b border-border/50">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-10 px-2 sm:px-4 py-3">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isSomeSelected ? "indeterminate" : undefined}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all subscriptions"
                />
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider px-2 sm:px-4 py-3 min-w-[200px] sm:w-auto">Subscription</TableHead>
              <TableHead className="hidden sm:table-cell text-right font-semibold text-xs uppercase tracking-wider px-4 py-3">Status</TableHead>
              <TableHead className="hidden lg:table-cell text-right font-semibold text-xs uppercase tracking-wider px-4 py-3">Billing</TableHead>
              <TableHead className="hidden xl:table-cell text-right font-semibold text-xs uppercase tracking-wider px-4 py-3">Amount</TableHead>
              <TableHead className="text-right font-semibold text-xs uppercase tracking-wider px-2 sm:px-4 py-3">Monthly</TableHead>
              <TableHead className="hidden lg:table-cell text-right font-semibold text-xs uppercase tracking-wider px-4 py-3">Next Billing</TableHead>
              <TableHead className="text-center font-semibold text-xs uppercase tracking-wider px-2 sm:px-4 py-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSubscriptions.map((subscription) => {
              const isDeleting = deletingSubscriptionIds.includes(subscription.id);
              const isSelected = selectedIds.includes(subscription.id);
              const hasImageError = imageErrors.has(subscription.id);

              return (
                <SubscriptionTableRow
                  key={subscription.id}
                  subscription={subscription}
                  isSelected={isSelected}
                  isDeleting={isDeleting}
                  onSelectRow={handleSelectRow}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  router={router}
                  imageError={hasImageError}
                  onImageError={handleImageError}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {subscriptions.length === 0 && (
        <div className="text-center py-16 border border-border/50 rounded-xl bg-muted/20">
          <DollarSign className="h-14 w-14 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No subscriptions found</h3>
          <p className="text-sm text-muted-foreground">
            Add your first subscription to start tracking recurring expenses
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Subscriptions pagination" className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground order-2 sm:order-1">
            Showing <span className="text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * ITEMS_PER_PAGE, subscriptions.length)}</span> of{" "}
            <span className="text-foreground">{subscriptions.length}</span> subscriptions
          </p>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 px-2 sm:px-3"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Prev</span>
            </Button>

            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3" aria-live="polite" aria-atomic="true">
              <span className="text-xs sm:text-sm font-semibold text-foreground">
                {currentPage}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground">
                / {totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 px-2 sm:px-3"
              aria-label="Next page"
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}
