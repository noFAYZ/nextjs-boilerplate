"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Edit3,
  MoreHorizontal,
  RefreshCw,
  Building2,
  CreditCard,
  Loader2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FluentBuildingBank28Regular,
  HugeiconsCreditCard,
  StreamlineFlexFilter2,
  SolarClockCircleBoldDuotone,
  StreamlineUltimatePowerPlugDisconnected,
  SolarRefreshCircleBoldDuotone,
  SolarTrashBinTrashOutline,
  CircumBank,
  GuidanceBank,
  BankBuildingIcon,
  StashCreditCardLight,
  LetsIconsCreditCardDuotone,
} from "../icons/icons";
import { Toggle } from "../ui/toggle";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { BankAccount } from "@/lib/types/banking";
import { bankingMutations } from "@/lib/queries/banking-queries";
import { formatDistanceToNow } from "date-fns";

interface BankAccountsDataTableProps {
  accounts: BankAccount[];
  totalBalance: number;
  isLoading?: boolean;
  hideFilters?: boolean;
  selectedIds?: string[];
  operatingIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onDisconnect?: (account: BankAccount) => void;
  onDelete?: (account: BankAccount) => void;
  onSync?: (account: BankAccount) => void;
}

const ITEMS_PER_PAGE = 20;
const EMPTY_ARRAY: string[] = [];

// Account type display names
const accountTypeLabels: Record<string, string> = {
  CHECKING: "Checking",
  SAVINGS: "Savings",
  CREDIT_CARD: "Credit Card",
  INVESTMENT: "Investment",
  LOAN: "Loan",
  MORTGAGE: "Mortgage",
};

// Bank type gradients
const bankTypeGradients: Record<string, string> = {
  CHECKING: "from-emerald-500 to-emerald-600",
  SAVINGS: "from-green-500 to-green-600",
  CREDIT_CARD: "from-blue-500 to-blue-600",
  INVESTMENT: "from-purple-500 to-purple-600",
  LOAN: "from-orange-500 to-orange-600",
  MORTGAGE: "from-red-500 to-red-600",
  DEFAULT: "from-gray-500 to-gray-600",
};

export function BankAccountsDataTable({
  accounts,
  totalBalance,
  isLoading,
  hideFilters = false,
  selectedIds: externalSelectedIds = EMPTY_ARRAY,
  operatingIds = EMPTY_ARRAY,
  onSelectionChange,
  onDisconnect,
  onDelete,
  onSync,
}: BankAccountsDataTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"balance" | "name" | "lastSync">("balance");
  const [filterBy, setFilterBy] = useState<"all" | "checking" | "savings" | "credit" | "investment">("all");
  const [toggleFilters, setToggleFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(externalSelectedIds);

  const { mutate: syncAccount } = bankingMutations.useSyncAccount();

  // Sync with external selectedIds
  useEffect(() => {
    setSelectedIds(externalSelectedIds);
  }, [externalSelectedIds]);

  // Filter and search accounts
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterBy === "checking") return account.type === "CHECKING";
    if (filterBy === "savings") return account.type === "SAVINGS";
    if (filterBy === "credit") return account.type === "CREDIT_CARD";
    if (filterBy === "investment") return account.type === "INVESTMENT";
    return true;
  });

  // Sort accounts
  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    switch (sortBy) {
      case "balance":
        return parseFloat(b.balance.toString()) - parseFloat(a.balance.toString());
      case "name":
        return a.name.localeCompare(b.name);
      case "lastSync":
        return new Date(b.lastTellerSync).getTime() - new Date(a.lastTellerSync).getTime();
      default:
        return 0;
    }
  });

  // Paginate accounts
  const totalPages = Math.ceil(sortedAccounts.length / ITEMS_PER_PAGE);
  const paginatedAccounts = sortedAccounts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    const newIds = checked ? paginatedAccounts.map((a) => a.id) : [];
    setSelectedIds(newIds);
    onSelectionChange?.(newIds);
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newIds = checked
      ? [...selectedIds, id]
      : selectedIds.filter((sid) => sid !== id);
    setSelectedIds(newIds);
    onSelectionChange?.(newIds);
  };

  const isAllSelected = paginatedAccounts.length > 0 && paginatedAccounts.every((a) => selectedIds.includes(a.id));
  const isSomeSelected = selectedIds.length > 0 && !isAllSelected;

  const handleSync = (accountId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    syncAccount({ accountId });
  };

  const handleEdit = (accountId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/accounts/bank/${accountId}/edit`);
  };

  const handleRowClick = (accountId: string) => {
    router.push(`/accounts/bank/${accountId}`);
  };

  const getAccountIcon = (type: string) => {
    if (type === "CREDIT_CARD") {
      return <LetsIconsCreditCardDuotone className="h-6 w-6 " />;
    }
    return <FluentBuildingBank28Regular className="h-6 w-6 " strokeWidth={2} />;
  };

  const getSyncStatusBadge = (syncStatus: string) => {
    type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "muted";

    const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
      connected: { label: "Connected", variant: "success" },
      syncing: { label: "Syncing", variant: "warning" },
      error: { label: "Error", variant: "destructive" },
      disconnected: { label: "Disconnected", variant: "muted" },
    };

    const config = statusConfig[syncStatus] || statusConfig.disconnected;
    return (
      <Badge 
        variant={config.variant} 
        className={cn(
          "text-xs rounded-md font-medium",
          syncStatus === 'connected' && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
          syncStatus === 'syncing' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
          syncStatus === 'error' && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
          syncStatus === 'disconnected' && "bg-muted text-muted-foreground"
        )}
      >
        {config.label}
      </Badge>
    );
  };

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
      {/* Filters - Only show if not hidden */}
      {!hideFilters && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
          {/* Left: Value */}
       

          {/* Right: Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:items-center">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9"
              
              />
            </div>
            <Toggle
              className="px-2 gap-1.5"
              title="Filters"
             
              onClick={() => setToggleFilters(!toggleFilters)}
            >
              <StreamlineFlexFilter2 className="h-4 w-4" />
              Filters
            </Toggle>
          </div>
        </div>
      )}

      {/* Sort & Filter */}
      {!hideFilters && (
        <div
          className={`gap-2 sm:justify-end ${
            toggleFilters ? "flex" : "hidden"
          }`}
        >
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="balance">By Balance</SelectItem>
              <SelectItem value="name">By Name</SelectItem>
              <SelectItem value="lastSync">By Last Sync</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterBy}
            onValueChange={(value) => setFilterBy(value as typeof filterBy)}
          >
            <SelectTrigger className="w-[140px] h-9">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              <SelectItem value="checking">Checking</SelectItem>
              <SelectItem value="savings">Savings</SelectItem>
              <SelectItem value="credit">Credit Cards</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-card border border-border/80 rounded-xl overflow-x-auto shadow-sm">
        <Table>
          <TableHeader className="bg-muted/80 border-b border-border/50">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-10 px-2 sm:px-4 py-3">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider px-2 sm:px-4 py-3 min-w-[200px] sm:w-auto">Account</TableHead>
              <TableHead className="hidden sm:table-cell text-right font-semibold text-xs uppercase tracking-wider px-4 py-3">Status</TableHead>
              <TableHead className="hidden lg:table-cell text-right font-semibold text-xs uppercase tracking-wider px-4 py-3">Balance</TableHead>
              <TableHead className="hidden xl:table-cell text-right font-semibold text-xs uppercase tracking-wider px-4 py-3">Limit / Available</TableHead>
              <TableHead className="hidden lg:table-cell text-right font-semibold text-xs uppercase tracking-wider px-4 py-3">Last Synced</TableHead>
              <TableHead className="text-center font-semibold text-xs uppercase tracking-wider px-2 sm:px-4 py-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAccounts.map((account) => {
              const gradient = bankTypeGradients[account.type] || bankTypeGradients.DEFAULT;
              const accountLabel = accountTypeLabels[account.type] || account.type;
              const lastFour = account.accountNumber?.slice(-4);
              const balance = parseFloat(account.availableBalance || account.balance.toString() || "0");
              const isCreditCard = account.type === "CREDIT_CARD";
              const creditLimit = isCreditCard ? parseFloat(account.ledgerBalance || "0") : 0;
              const creditUsed = isCreditCard && creditLimit > 0 ? creditLimit - balance : 0;

              const isSelected = selectedIds.includes(account.id);
              const isOperating = operatingIds.includes(account.id);

              return (
                <TableRow
                  key={account.id}
                  className={cn(
                    "group border-b border-border/30 hover:bg-muted/30 transition-colors py-2",
                    !isOperating && "cursor-pointer",
                    isSelected && "bg-primary/5",
                    isOperating && "bg-primary/10 opacity-70 cursor-not-allowed"
                  )}
                  onClick={() => !isOperating && handleRowClick(account.id)}
                >
                  <TableCell className="px-2 sm:px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleSelectRow(account.id, !!checked)
                      }
                    />
                  </TableCell>

                  <TableCell className="px-2 sm:px-4 py-3 group-hover:text-primary transition-colors">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="h-11 w-11 rounded-full border shadow-sm group-hover:shadow-lg bg-muted text-foreground flex items-center justify-center flex-shrink-0">
                        {isOperating ? (
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        ) : (
                          getAccountIcon(account.type)
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        {isOperating ? (
                          <div className="space-y-2">
                            <div className="h-4 bg-muted animate-pulse rounded w-32" />
                            <div className="h-3 bg-muted animate-pulse rounded w-48" />
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <p className="font-semibold text-xs sm:text-sm truncate">
                                {account.name}
                              </p>
                              <Badge variant="outline" className="hidden sm:inline-flex text-xs rounded-sm">
                                {accountLabel}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate hidden sm:block">
                              {account.institutionName} • ****{lastFour}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden sm:table-cell text-right px-4 py-3">
                    {isOperating ? (
                      <div className="h-6 bg-muted animate-pulse rounded w-20 ml-auto" />
                    ) : (
                      getSyncStatusBadge(account.syncStatus)
                    )}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell text-right px-4 py-3">
                    {isOperating ? (
                      <div className="h-5 bg-muted animate-pulse rounded w-24 ml-auto" />
                    ) : (
                      <p className="text-sm font-semibold">
                        <CurrencyDisplay
                          amountUSD={balance}
                          variant="small"
                          isLoading={isLoading}
                        />
                      </p>
                    )}
                  </TableCell>

                  <TableCell className="hidden xl:table-cell text-right px-4 py-3">
                    {isOperating ? (
                      <div className="h-5 bg-muted animate-pulse rounded w-28 ml-auto" />
                    ) : isCreditCard && creditLimit > 0 ? (
                      <div className="flex flex-col items-end gap-0.5">
                        <p className="text-sm font-medium">
                          <CurrencyDisplay
                            amountUSD={creditLimit}
                            variant="small"
                            formatOptions={{ notation: "compact" }}
                          />
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {Math.round((creditUsed / creditLimit) * 100)}% used
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell text-right px-4 py-3">
                    {isOperating ? (
                      <div className="h-5 bg-muted animate-pulse rounded w-32 ml-auto" />
                    ) : (
                      <div className="flex items-center justify-end gap-1.5">
                        <SolarClockCircleBoldDuotone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(account.lastTellerSync), { addSuffix: true })}
                        </span>
                      </div>
                    )}
                  </TableCell>

                  <TableCell
                    className="text-center px-2 sm:px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isOperating ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleRowClick(account.id)}>
                              <Edit3 className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              onSync?.(account);
                            }}>
                              <SolarRefreshCircleBoldDuotone className="mr-2 h-4 w-4" />
                              Sync Account
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                  e.stopPropagation();
                                  onDisconnect?.(account);
                              }}
                            >
                              <StreamlineUltimatePowerPlugDisconnected className="mr-2 h-4 w-4" />
                              Disconnect
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete?.(account);
                              }}
                            >
                              <SolarTrashBinTrashOutline className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {filteredAccounts.length === 0 && (
        <div className="text-center py-16 border border-border/50 rounded-xl bg-muted/20">
          <Building2 className="h-14 w-14 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {searchTerm || filterBy !== "all"
              ? "No accounts match your criteria"
              : "No bank accounts found"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm || filterBy !== "all"
              ? "Try adjusting your search or filters"
              : "Connect your first bank account to get started"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground order-2 sm:order-1">
            Showing <span className="text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredAccounts.length)}</span> of{" "}
            <span className="text-foreground">{filteredAccounts.length}</span>
          </p>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 px-2 sm:px-3"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Prev</span>
            </Button>

            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3">
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
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
