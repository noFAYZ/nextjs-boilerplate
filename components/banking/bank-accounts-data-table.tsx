"use client";

import { useState } from "react";
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
  Clock,
  CreditCard,
  Landmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FluentBuildingBank28Regular,
  HugeiconsCreditCard,
  StreamlineFlexFilter2,
  SolarClockCircleBoldDuotone,
} from "../icons/icons";
import { Toggle } from "../ui/toggle";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { BankAccount } from "@/lib/types/banking";
import { useDisconnectBankAccount, useSyncBankAccount } from "@/lib/queries";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface BankAccountsDataTableProps {
  accounts: BankAccount[];
  totalBalance: number;
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 20;

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
}: BankAccountsDataTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"balance" | "name" | "lastSync">("balance");
  const [filterBy, setFilterBy] = useState<"all" | "checking" | "savings" | "credit" | "investment">("all");
  const [toggleFilters, setToggleFilters] = useState(false);

  const { mutate: disconnectAccount } = useDisconnectBankAccount();
  const { mutate: syncAccount } = useSyncBankAccount();

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

  const handleDisconnect = (accountId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to disconnect this account?")) {
      disconnectAccount(accountId);
    }
  };

  const handleSync = (accountId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    syncAccount(accountId);
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
      return <HugeiconsCreditCard className="h-6 w-6 text-white" />;
    }
    return <FluentBuildingBank28Regular className="h-6 w-6 text-white" />;
  };

  const getSyncStatusBadge = (syncStatus: string) => {
    const statusConfig: Record<string, { label: string; variant: any }> = {
      connected: { label: "Connected", variant: "success" },
      syncing: { label: "Syncing", variant: "warning" },
      error: { label: "Error", variant: "destructive" },
      disconnected: { label: "Disconnected", variant: "muted" },
    };

    const config = statusConfig[syncStatus] || statusConfig.disconnected;
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
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
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4">
        {/* Left: Value */}
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
            Total Balance
          </span>
          <div className="text-xl font-bold">
            <CurrencyDisplay
              amountUSD={totalBalance}
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
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          <Toggle
            className="px-2 gap-1.5"
            title="Filters"
            variant="outline"
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
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
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
          onValueChange={(value: any) => setFilterBy(value)}
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

      {/* Data Table */}
      <div className="bg-card p-4 rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-[250px] font-bold">NAME</TableHead>
              <TableHead className="font-bold">ACCOUNT</TableHead>
              <TableHead className="font-bold text-right">BALANCE</TableHead>
              <TableHead className="font-bold">LIMIT</TableHead>
              <TableHead className="font-bold">SOURCE</TableHead>
              <TableHead className="font-bold">POSITION</TableHead>
              <TableHead className="font-bold">TRANSACTIONS</TableHead>
              <TableHead className="font-bold">LAST SYNCED</TableHead>
              <TableHead className="text-center font-bold">STATUS</TableHead>
              <TableHead className="text-right font-bold">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAccounts.map((account) => {
              const gradient = bankTypeGradients[account.type] || bankTypeGradients.DEFAULT;
              const accountLabel = accountTypeLabels[account.type] || account.type;
              const lastFour = account.tellerLastFour || account.accountNumber.slice(-4);
              const balance = parseFloat(account.availableBalance || account.balance.toString() || "0");
              const isCreditCard = account.type === "CREDIT_CARD";
              const creditLimit = isCreditCard ? parseFloat(account.ledgerBalance || "0") : 0;
              const creditUsed = isCreditCard && creditLimit > 0 ? creditLimit - balance : 0;
              const transactionCount = account._count?.bankTransactions || 0;

              // Get provider name
              const provider = account.provider || "TELLER";
              const providerDisplay = provider === "TELLER" ? "Teller" : provider;

              return (
                <TableRow
                  key={account.id}
                  className="group border-none cursor-pointer"
                  onClick={() => handleRowClick(account.id)}
                >
                  {/* NAME */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-lg bg-muted flex-shrink-0">
                        <div className={cn("h-full w-full rounded-lg bg-gradient-to-br flex items-center justify-center", gradient)}>
                          {getAccountIcon(account.type)}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-col gap-0.5">
                          <p className="font-semibold text-sm truncate">
                            {account.institutionName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            By {account.name} • {formatDistanceToNow(new Date(account.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* ACCOUNT */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-mono">xxxxx{lastFour}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{accountLabel}</span>
                    </div>
                  </TableCell>

                  {/* BALANCE */}
                  <TableCell className="text-right">
                    <div className="flex flex-col gap-0.5 items-end">
                      <div className="font-semibold text-sm">
                        <CurrencyDisplay
                          amountUSD={balance}
                          variant="compact"
                        />
                      </div>
                      {isCreditCard && creditLimit > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Used: <CurrencyDisplay
                            amountUSD={creditUsed}
                            variant="compact"
                            formatOptions={{ notation: "compact" }}
                          />
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* LIMIT */}
                  <TableCell>
                    {isCreditCard && creditLimit > 0 ? (
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            <CurrencyDisplay
                              amountUSD={creditLimit}
                              variant="compact"
                              formatOptions={{ notation: "compact" }}
                            />
                          </span>
                        </div>
                        {creditLimit > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {Math.round((creditUsed / creditLimit) * 100)}% used
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* SOURCE */}
                  <TableCell>
                    <Badge variant="outline" className="text-xs capitalize">
                      {providerDisplay}
                    </Badge>
                  </TableCell>

                  {/* POSITION */}
                  <TableCell>
                    <span className="text-sm">
                      {isCreditCard ? "Credit" : account.type === "INVESTMENT" ? "Investment" : "Cash"}
                    </span>
                  </TableCell>

                  {/* TRANSACTIONS */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-sm font-medium">
                        {transactionCount.toLocaleString()}
                      </span>
                    </div>
                  </TableCell>

                  {/* LAST SYNCED */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <SolarClockCircleBoldDuotone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(account.lastTellerSync), { addSuffix: true })}
                      </span>
                    </div>
                  </TableCell>

                  {/* STATUS */}
                  <TableCell className="text-center">
                    {getSyncStatusBadge(account.syncStatus)}
                  </TableCell>

                  {/* ACTION */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {account.syncStatus === "connected" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs text-destructive hover:text-destructive"
                          onClick={(e) => handleDisconnect(account.id, e)}
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs text-green-600 hover:text-green-600"
                          onClick={(e) => handleSync(account.id, e)}
                        >
                          Connect
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => handleEdit(account.id, e)}
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(account.id);
                          }}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleSync(account.id, e as any)}>
                            <RefreshCw className="h-3.5 w-3.5 mr-2" />
                            Sync Account
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => handleDisconnect(account.id, e as any)}
                          >
                            Disconnect
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {filteredAccounts.length === 0 && (
        <div className="text-center py-12 border rounded-lg">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">
            {searchTerm || filterBy !== "all"
              ? "No accounts match your criteria"
              : "No accounts found"}
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
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredAccounts.length)} of{" "}
            {filteredAccounts.length} accounts
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
