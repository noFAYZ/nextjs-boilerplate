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
  DollarSign,
  Loader2,
  Search,
  Settings2,
  Filter,
  Power,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import type { UserSubscription } from "@/lib/types/subscription";
import { useSubscriptionUIStore } from "@/lib/features/subscriptions/stores";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { SubscriptionFiltersSheet } from "./subscription-filters-sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
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
  isExpanded,
  onSelectRow,
  onEdit,
  onDelete,
  router,
  imageError,
  onImageError,
  onToggleExpand,
}: {
  subscription: UserSubscription;
  isSelected: boolean;
  isDeleting: boolean;
  isExpanded: boolean;
  onSelectRow: (id: string, checked: boolean) => void;
  onEdit?: (subscription: UserSubscription) => void;
  onDelete?: (subscription: UserSubscription) => void;
  router: ReturnType<typeof useRouter>;
  imageError: boolean;
  onImageError: (subscriptionId: string) => void;
  onToggleExpand: (id: string) => void;
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

  const handleToggleExpand = useCallback(() => {
    onToggleExpand(subscription.id);
  }, [subscription.id, onToggleExpand]);

  return (
    <>
      <TableRow
        className={cn(
          styles.tableRow,
          "group  items-center   hover:bg-muted/30",
          isDeleting && styles.rowDeleting,
          isSelected && "bg-primary/5"
        )}
        data-testid={`subscription-row-${subscription.id}`}
      >
        <TableCell className="px-2 sm:px-4 py-2 " onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-6 w-6 p-0"
            onClick={handleToggleExpand}
            aria-label={isExpanded ? "Collapse row" : "Expand row"}
          >
            <ChevronRight
              className={cn(
                "h-5 w-5 transition-transform duration-100",
                isExpanded && "rotate-90"
              )}
            />
          </Button>
        </TableCell>

        <TableCell className="px-2 sm:px-4 py-2" onClick={(e) => e.stopPropagation()}>
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
          <div className="relative h-8 w-8  rounded-lg bg-muted flex-shrink-0 overflow-hidden">
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
            <p className="font-semibold text-xs sm:text-sm truncate">
              {subscription.name}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell className="hidden sm:table-cell text-right px-4 py-2">
        {subscription.category && (
          <Badge variant="outline" className="text-xs rounded-sm">
            {subscription.category.replace(/_/g, " ")}
          </Badge>
        )}
      </TableCell>

      <TableCell className="hidden sm:table-cell text-right px-4 py-2">
        <Badge
          className={cn(
            " font-semibold",

          )}

          variant="success"
        >
          {subscription.status}
        </Badge>
      </TableCell>

      <TableCell className="hidden lg:table-cell text-right px-4 py-2">
        <p className="text-sm font-medium">
          {getBillingCycleDisplay(subscription.billingCycle)}
        </p>
      </TableCell>

      <TableCell className="hidden xl:table-cell text-right px-4 py-2">
        <span >
          <CurrencyDisplay amountUSD={subscription.amount} className="  font-semibold" />
        </span>
      </TableCell>

      <TableCell className="hidden lg:table-cell text-right px-4 py-2">
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
          className="text-center px-2 sm:px-4 py-2"
          onClick={(e) => e.stopPropagation()}
        >
          {isDeleting ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                onClick={handleEditClick}
                aria-label={`Edit ${subscription.name}`}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                onClick={handleDeleteClick}
                aria-label={`Delete ${subscription.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </TableCell>
      </TableRow>

      {/* Expanded Details Row */}
      {isExpanded && (
        <TableRow className="border-b border-border  bg-secondary dark:bg-background hover:bg-secondary">
          <TableCell colSpan={9} className="p-2">
            <div className="space-y-2">
              {/* Subscription Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
                {/* Category */}
                {subscription.category && (
                  <div className="p-2 ">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Category</p>
                    <p className="text-sm font-semibold">{subscription.category.replace(/_/g, " ")}</p>
                  </div>
                )}

                {/* Status */}
                <div className="p-2 ">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Status</p>
                  <Badge
                    className={cn(
                      "text-xs rounded-md font-medium",
                      getStatusColor(subscription.status)
                    )}
                  >
                    {subscription.status}
                  </Badge>
                </div>

                {/* Billing Cycle */}
                <div className="p-2 ">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Billing Cycle</p>
                  <p className="text-sm font-semibold">{getBillingCycleDisplay(subscription.billingCycle)}</p>
                </div>

                {/* Monthly Amount */}
                <div className="p-2 ">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Monthly Cost</p>
                  <p className="text-sm font-semibold">
                    <CurrencyDisplay amountUSD={subscription.monthlyEquivalent} variant="small" />
                  </p>
                </div>

                {/* Subscription Amount */}
                <div className="p-2 ">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Subscription Amount</p>
                  <p className="text-sm font-semibold">
                    <CurrencyDisplay amountUSD={subscription.amount} variant="small" />
                  </p>
                </div>

                {/* Next Billing Date */}
                {subscription.nextBillingDate && (
                  <div className="p-2">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Next Billing</p>
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
                  </div>
                )}

                {/* Start Date */}
                {subscription.startDate && (
                  <div className="p-2">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Started</p>
                    <p className="text-sm font-semibold">
                      {new Date(subscription.startDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              {subscription.description && (
                <div className="p-2">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Description</p>
                  <p className="text-sm text-foreground">{subscription.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2  px-4 pb-2 items-center">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={handleEditClick}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>

                {subscription.status !== "ACTIVE" && (
                  <Button
                    variant="outline3"
                    size="xs"
                    onClick={() => {
                      // This would trigger activate action
                      // You may need to add this functionality
                    }}
                    className="flex items-center gap-2"
                  >
                    <Power className="h-4 w-4" />
                    Activate
                  </Button>
                )}

                <Button
                  variant="delete"
                  size="xs"
                  onClick={handleDeleteClick}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
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
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const deletingSubscriptionIds = useSubscriptionUIStore((state) => state.deletingSubscriptionIds);
  const { viewPreferences, setWalletsView } = useSubscriptionUIStore();

  const handleImageError = useCallback((subscriptionId: string) => {
    setImageErrors((prev) => new Set(prev).add(subscriptionId));
  }, []);

  const handleToggleExpand = useCallback((subscriptionId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subscriptionId)) {
        newSet.delete(subscriptionId);
      } else {
        newSet.add(subscriptionId);
      }
      return newSet;
    });
  }, []);

  // Sync with external selectedIds
  useEffect(() => {
    setSelectedIds(externalSelectedIds);
  }, [externalSelectedIds]);

  // Filter subscriptions based on search query
  const filteredSubscriptions = useMemo(() => {
    if (!searchQuery.trim()) return subscriptions;
    const query = searchQuery.toLowerCase();
    return subscriptions.filter(
      (sub) =>
        sub.name.toLowerCase().includes(query) ||
        sub.description?.toLowerCase().includes(query) ||
        sub.category?.toLowerCase().includes(query)
    );
  }, [subscriptions, searchQuery]);

  // Paginate subscriptions with memoization
  const totalPages = Math.ceil(filteredSubscriptions.length / ITEMS_PER_PAGE);
  const paginatedSubscriptions = useMemo(
    () => filteredSubscriptions.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    ),
    [filteredSubscriptions, currentPage]
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
    <div className="space-y-2">
      {/* Data Table */}
      <div className=" overflow-hidden" role="region" aria-label="Subscriptions data table">
        {/* Search & Filter Toolbar - Inside datatable */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border   ">
          <div className="flex-1 w-full sm:max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Search subscriptions..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="pl-9  "
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline3"
              size="sm"
              className="flex items-center gap-2 rounded-sm"
              onClick={() => setIsFiltersOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button
              variant="outline3"
              size="sm"
              className="flex items-center gap-2 rounded-sm"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings2 className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table aria-label="Subscriptions list">
            <TableHeader  >
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-10 "></TableHead>
                <TableHead className="w-10  ">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected ? "indeterminate" : undefined}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all subscriptions"
                  />
                </TableHead>
                <TableHead className="  min-w-[200px] sm:w-auto">Subscription</TableHead>
                <TableHead className="hidden sm:table-cell text-right  ">Category</TableHead>
                <TableHead className="hidden sm:table-cell text-right ">Status</TableHead>
                <TableHead className="hidden lg:table-cell text-right ">Billing</TableHead>
                <TableHead className="hidden xl:table-cell text-right ">Amount</TableHead>
                <TableHead className="hidden lg:table-cell text-right ">Next Billing</TableHead>
                <TableHead className="text-center   ">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSubscriptions.map((subscription) => {
                const isDeleting = deletingSubscriptionIds.includes(subscription.id);
                const isSelected = selectedIds.includes(subscription.id);
                const hasImageError = imageErrors.has(subscription.id);
                const isExpanded = expandedRows.has(subscription.id);

                return (
                  <SubscriptionTableRow
                    key={subscription.id}
                    subscription={subscription}
                    isSelected={isSelected}
                    isDeleting={isDeleting}
                    isExpanded={isExpanded}
                    onSelectRow={handleSelectRow}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    router={router}
                    imageError={hasImageError}
                    onImageError={handleImageError}
                    onToggleExpand={handleToggleExpand}
                  />
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Empty State */}
      {filteredSubscriptions.length === 0 && (
        <div className="text-center py-16 border border-border/50 rounded-xl bg-muted/20">
          <DollarSign className="h-14 w-14 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery ? "No matching subscriptions" : "No subscriptions found"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "Add your first subscription to start tracking recurring expenses"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Subscriptions pagination" className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground order-2 sm:order-1">
            Showing <span className="text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredSubscriptions.length)}</span> of{" "}
            <span className="text-foreground">{filteredSubscriptions.length}</span> subscriptions
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

      {/* Filters Drawer */}
      <SubscriptionFiltersSheet
        open={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />

      {/* Settings Drawer */}
      <Drawer open={isSettingsOpen} onOpenChange={setIsSettingsOpen}  >
        <DrawerContent  className="  max-w-xl mx-auto rounded-b-none">
          <DrawerHeader className="  pb-4">
        
                <DrawerTitle className="text-lg">Preferences</DrawerTitle>
                <DrawerDescription className="mt-1">
                  Customize how the table looks and behaves
                </DrawerDescription>
             
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto">
            {/* View Preferences Section */}
            <div className="px-4 pt-6 pb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Settings2 className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">View Preferences</h3>
              </div>

              <div className="space-y-2">
                {/* Show Cancelled */}
                <div className={cn(
                  "flex items-center justify-between p-3 rounded-lg transition-all",
                  "bg-muted/40 hover:bg-muted/60 cursor-pointer"
                )}>
                  <div className="flex-1 pr-3">
                    <p className="text-sm font-medium text-foreground">
                      Show Cancelled
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Include cancelled subscriptions
                    </p>
                  </div>
                  <Switch />
                </div>

                {/* Show Trials */}
                <div className={cn(
                  "flex items-center justify-between p-3 rounded-lg transition-all",
                  "bg-muted/40 hover:bg-muted/60 cursor-pointer"
                )}>
                  <div className="flex-1 pr-3">
                    <p className="text-sm font-medium text-foreground">
                      Show Trials
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Display trial subscriptions
                    </p>
                  </div>
                  <Switch />
                </div>

                {/* Compact View */}
                <div className={cn(
                  "flex items-center justify-between p-3 rounded-lg transition-all",
                  "bg-muted/40 hover:bg-muted/60 cursor-pointer"
                )}>
                  <div className="flex-1 pr-3">
                    <p className="text-sm font-medium text-foreground">
                      Compact View
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Reduce spacing for more rows
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            <Separator />

            {/* Display Options Section */}
            <div className="px-4 py-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Filter className="h-4 w-4 text-blue-500" />
                </div>
                <h3 className="font-semibold text-sm">Display Options</h3>
              </div>

              <div className="space-y-3">
                {/* Show Logo */}
                <div className={cn(
                  "flex items-center justify-between p-3 rounded-lg transition-all",
                  "bg-muted/40 hover:bg-muted/60 cursor-pointer"
                )}>
                  <div className="flex-1 pr-3">
                    <p className="text-sm font-medium text-foreground">
                      Show Logos
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Display service logos in table
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                {/* Show Description */}
                <div className={cn(
                  "flex items-center justify-between p-3 rounded-lg transition-all",
                  "bg-muted/40 hover:bg-muted/60 cursor-pointer"
                )}>
                  <div className="flex-1 pr-3">
                    <p className="text-sm font-medium text-foreground">
                      Show Descriptions
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Show details on hover
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
