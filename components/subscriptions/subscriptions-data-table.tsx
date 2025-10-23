"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Search,
  Filter,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StreamlineFlexFilter2 } from "../icons/icons";
import { Toggle } from "../ui/toggle";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import type { UserSubscription } from "@/lib/types/subscription";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSubscriptionUIStore } from "@/lib/stores/subscription-ui-store";

interface SubscriptionsDataTableProps {
  subscriptions: UserSubscription[];
  totalMonthlySpend: number;
  isLoading?: boolean;
  onEdit?: (subscription: UserSubscription) => void;
  onDelete?: (subscription: UserSubscription) => void;
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

export function SubscriptionsDataTable({
  subscriptions,
  totalMonthlySpend,
  isLoading,
  onEdit,
  onDelete,
}: SubscriptionsDataTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "amount" | "nextBilling">("name");
  const [filterBy, setFilterBy] = useState<"all" | "active" | "trial" | "expensive">("all");
  const [toggleFilters, setToggleFilters] = useState(false);
  const deletingSubscriptionIds = useSubscriptionUIStore((state) => state.deletingSubscriptionIds);

  // Filter and search subscriptions
  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearch =
      subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.category?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterBy === "active") return subscription.status === "ACTIVE";
    if (filterBy === "trial") return subscription.status === "TRIAL";
    if (filterBy === "expensive") return subscription.monthlyEquivalent >= 20;
    return true;
  });

  // Sort subscriptions
  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    switch (sortBy) {
      case "amount":
        return b.monthlyEquivalent - a.monthlyEquivalent;
      case "nextBilling":
        if (!a.nextBillingDate) return 1;
        if (!b.nextBillingDate) return -1;
        return new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime();
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Paginate subscriptions
  const totalPages = Math.ceil(sortedSubscriptions.length / ITEMS_PER_PAGE);
  const paginatedSubscriptions = sortedSubscriptions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="rounded-xl">
          <div className="h-12 bg-muted rounded-xl animate-pulse" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4">
        {/* Left: Monthly Spend */}
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
            Monthly Spend
          </span>
          <div className="text-xl font-bold">
            <CurrencyDisplay
              amountUSD={totalMonthlySpend}
              variant="default"
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Right: Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:items-center">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          <Toggle
            className="px-2 gap-1.5"
            title="Filters"
            variant={"outline"}
            onClick={() => setToggleFilters(!toggleFilters)}
          >
            <StreamlineFlexFilter2 className="h-4 w-4" />
            Filters
          </Toggle>
        </div>
      </div>

      {/* Sort & Filter */}
      <div
        className={`px-4 gap-2 sm:justify-end ${
          toggleFilters ? "flex" : "hidden"
        }`}
      >
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as "name" | "amount" | "nextBilling")}
        >
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">By Name</SelectItem>
            <SelectItem value="amount">By Amount</SelectItem>
            <SelectItem value="nextBilling">By Next Billing</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filterBy}
          onValueChange={(value) => setFilterBy(value as "all" | "active" | "trial" | "expensive")}
        >
          <SelectTrigger className="w-[140px] h-9">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="expensive">Expensive ($20+)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <div className="bg-card p-4 rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-[250px] font-bold">Subscription</TableHead>
              <TableHead className="text-right font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Billing Cycle</TableHead>
              <TableHead className="text-right font-bold">Amount</TableHead>
              <TableHead className="text-right font-bold">Monthly Cost</TableHead>
              <TableHead className="text-right font-bold">Next Billing</TableHead>
              <TableHead className="text-center font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSubscriptions.map((subscription) => {
              const isDeleting = deletingSubscriptionIds.includes(subscription.id);

              return (
              <TableRow
                key={subscription.id}
                onClick={() => router.push(`/subscriptions/${subscription.id}`)}
                className={cn(
                  "group border-none cursor-pointer hover:bg-muted/50 transition-colors",
                  isDeleting && "opacity-50 pointer-events-none relative"
                )}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-full bg-muted flex-shrink-0 overflow-hidden">
                      {subscription.logoUrl ? (
                        <Image
                          src={subscription.logoUrl}
                          alt={subscription.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center rounded-full justify-center bg-primary text-primary-foreground">
                          <span className="font-bold text-sm">
                            {subscription.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate">
                          {subscription.name}
                        </p>
                        {subscription.category && (
                          <Badge variant="outline" className="text-xs rounded-sm">
                            {subscription.category.replace(/_/g, ' ')}
                          </Badge>
                        )}
                      </div>
                      {subscription.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {subscription.description}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <Badge
                    className={cn(
                      "text-xs rounded-md",
                      getStatusColor(subscription.status)
                    )}
                  >
                    {subscription.status}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <p className="text-sm font-medium">
                    {getBillingCycleDisplay(subscription.billingCycle)}
                  </p>
                </TableCell>

                <TableCell className="text-right">
                  <CurrencyDisplay
                    amountUSD={subscription.amount}
                    variant="small"
                    isLoading={isLoading}
                  />
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <CurrencyDisplay
                      amountUSD={subscription.monthlyEquivalent}
                      variant="small"
                      isLoading={isLoading}
                    />
                    {subscription.monthlyEquivalent >= 20 && (
                      <Badge variant="outline" className="text-xs">
                        High
                      </Badge>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  {subscription.nextBillingDate ? (
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(subscription.nextBillingDate).toLocaleDateString()}
                      </p>
                      {subscription.daysUntilNextBilling !== undefined && (
                        <p className="text-xs text-muted-foreground">
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

                <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                  {isDeleting ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(subscription)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete?.(subscription)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {filteredSubscriptions.length === 0 && (
        <div className="text-center py-12 border rounded-lg">
          <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">
            {searchTerm || filterBy !== "all"
              ? "No subscriptions match your criteria"
              : "No subscriptions found"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm || filterBy !== "all"
              ? "Try adjusting your search or filters"
              : "Add your first subscription to start tracking"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredSubscriptions.length)} of{" "}
            {filteredSubscriptions.length} subscriptions
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 px-3"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              <span className="text-sm font-medium bg-primary text-primary-foreground px-3 py-1 rounded">
                {currentPage}
              </span>
              <span className="text-sm text-muted-foreground">
                of {totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 px-3"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
