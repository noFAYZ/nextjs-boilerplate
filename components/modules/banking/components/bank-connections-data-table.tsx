"use client";

import { useState, useMemo, memo, useCallback } from "react";
import { ChevronRight, RefreshCw, Trash2, Power, Search, Settings2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { BankAccount, BankingSyncStatus } from "@/lib/types/banking";
import { formatDistanceToNow } from "date-fns";
import { FluentBuildingBank28Regular, LetsIconsCreditCardDuotone } from '@/components/icons/icons';
import { getBankingProviderMetadata } from "@/lib/utils/banking-utils";

interface BankConnectionsDataTableProps {
  accounts: BankAccount[];
  isLoading?: boolean;
  onDisconnect?: (account: BankAccount) => void;
  onDelete?: (account: BankAccount) => void;
  onSync?: (account: BankAccount) => void;
}

// Group accounts by institution
interface BankConnection {
  institutionId: string;
  institutionName: string;
  accounts: BankAccount[];
  totalBalance: number;
  lastSync?: string;
  logo?: string;
  autoSync?: boolean;
  provider?: string;
  status?: string;
}

const getSyncStatusColor = (status: BankingSyncStatus) => {
  const statusColorMap: Record<BankingSyncStatus, string> = {
    connected: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    syncing: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    error: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    disconnected: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  };
  return statusColorMap[status] || "bg-muted text-muted-foreground";
};

const getSyncStatusLabel = (status: BankingSyncStatus) => {
  const statusLabelMap: Record<BankingSyncStatus, string> = {
    connected: "Connected",
    syncing: "Syncing",
    error: "Error",
    disconnected: "Disconnected",
  };
  return statusLabelMap[status] || status;
};

// Memoized connection row component
const BankConnectionRow = memo(function BankConnectionRow({
  connection,
  isExpanded,
  onToggleExpand,
  onSync,
  onDisconnect,
  onDelete,
}: {
  connection: BankConnection;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onSync?: (account: BankAccount) => void;
  onDisconnect?: (account: BankAccount) => void;
  onDelete?: (account: BankAccount) => void;
}) {
  const handleToggleExpand = useCallback(() => {
    onToggleExpand(connection.institutionId);
  }, [connection.institutionId, onToggleExpand]);

  const primaryAccount = connection.accounts[0];
  const toTitleCase = (str: string) =>
    str.replace(/\w\S*/g, txt =>
      txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    );
  return (
    <>
      {/* Bank Header Row */}
      <TableRow className={cn("group", isExpanded && "bg-secondary/50")}>
        <TableCell className="w-8 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-6 w-6 p-0"
            onClick={handleToggleExpand}
            aria-label={isExpanded ? "Collapse row" : "Expand row"}
          >
            <ChevronRight className={cn("h-5 w-5 transition-transform duration-100", isExpanded && "rotate-90")} />
          </Button>
        </TableCell>

        <TableCell className="flex-1  cursor-pointer group-hover:text-primary min-w-[200px]" onClick={handleToggleExpand}>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Avatar className="h-8 w-8 rounded-lg flex-shrink-0">
              <AvatarImage src={connection.logo} alt={connection.institutionName} className="rounded-lg" />
              <AvatarFallback className="bg-primary/10 rounded-lg">
                <span className="text-xs sm:text-sm font-semibold text-primary">
                  {connection.institutionName.charAt(0).toUpperCase()}
                </span>
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <p className="font-semibold text-xs sm:text-sm truncate">{connection.institutionName || "Unknown Bank"}</p>
                {connection.autoSync && <RefreshCw className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />}
              </div>
            </div>
          </div>
        </TableCell>

        <TableCell className="hidden sm:table-cell text-right">
          <Badge variant={connection.status === "ACTIVE" ? "success" : "muted"} className="text-xs rounded-sm font-semibold">
            {connection.status || "DISCONNECTED"}
          </Badge>
        </TableCell>

        <TableCell className="hidden md:table-cell text-right w-8">
          {connection.provider ? (
            <Badge variant="subtle"   className="flex items-center justify-end gap-1.5 w-fit ml-auto px-1">
              <Avatar className="bg-muted rounded-full border text-[10px] h-5 w-5 flex-shrink-0">
                <AvatarImage src={getBankingProviderMetadata(connection.provider)?.logo} alt={connection.provider} className="rounded-full" />
                <AvatarFallback className="bg-muted text-foreground">{connection.provider.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className=" font-medium">{getBankingProviderMetadata(connection.provider)?.name}</span>
            </Badge>
          ) : null}
        </TableCell>

        <TableCell className="hidden lg:table-cell text-right">
          <CurrencyDisplay amountUSD={connection.totalBalance} className="font-semibold" />
        </TableCell>

        <TableCell className="hidden lg:table-cell text-right">
          {connection.lastSync ? (
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(connection.lastSync), { addSuffix: true })}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Never</span>
          )}
        </TableCell>

        <TableCell className="w-24 flex-shrink-0 text-center" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-center gap-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
              onClick={() => onSync?.(primaryAccount)}
              title="Sync accounts"
              aria-label="Sync accounts"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDisconnect?.(primaryAccount)}
              title="Disconnect"
              aria-label="Disconnect bank"
            >
              <Power className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {/* Expanded Accounts Rows */}
      {isExpanded &&
        connection.accounts.map((account, index) => (
          <TableRow
            key={account.id}
            className={cn(
              "border-b border-border/70 dark:bg-background  ",
            
            )}
          >
            <TableCell className="w-8 flex-shrink-0" />
            <TableCell className="flex-1 min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <LetsIconsCreditCardDuotone className="h-7 w-7 text-primary flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{account.displayName || account.name || "Unnamed Account"}</p>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {account.mask ? `●●●● ${account.mask}` : account.accountNumber ? `**** ${account.accountNumber.slice(-4)}` : ""}
                  </p>
                </div>
              </div>
            </TableCell>

            <TableCell className="hidden sm:table-cell text-right">
              <Badge variant="metal" className="text-xs rounded-sm whitespace-nowrap font-medium text-pretty">
              {toTitleCase(account.subtype || account.type)}
              </Badge>
            </TableCell>

            <TableCell className="hidden md:table-cell" />

            <TableCell className="hidden lg:table-cell text-right">
              <div className="flex flex-col items-end gap-0.5">
               
                  <CurrencyDisplay amountUSD={account.currentBalance ?? 0}className="text-sm font-semibold" />
             
                {account.availableBalance && account.availableBalance !== account.balance && (
                  <p className="text-xs text-muted-foreground">
                    Avbl: <CurrencyDisplay amountUSD={account.availableBalance} />
                  </p>
                )}
              </div>
            </TableCell>

            <TableCell className="hidden lg:table-cell text-right">
              <Badge
                className={cn(
                  "text-xs rounded-md font-medium",
                  account.isActive
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                )}
              >
                {account.isActive ? "Active" : "Inactive"}
              </Badge>
            </TableCell>

            <TableCell className="w-20 flex-shrink-0 text-center">
              <div className="flex items-center justify-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => onSync?.(account)}
                  title="Sync account"
                  aria-label="Sync account"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
                  onClick={() => onDelete?.(account)}
                  title="Remove account"
                  aria-label="Remove account"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
    </>
  );
});

export function BankConnectionsDataTable({
  accounts,
  isLoading,
  onDisconnect,
  onDelete,
  onSync,
}: BankConnectionsDataTableProps) {
  const [expandedConnections, setExpandedConnections] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Group accounts by institution
  const connections = useMemo(() => {
    const grouped = accounts.reduce((acc, account) => {
      const institutionId = account.tellerInstitutionId || account.institutionName || "unknown";
      const institutionName = account.institutionName || "Unknown Bank";

      if (!acc[institutionId]) {
        acc[institutionId] = {
          institutionId,
          institutionName,
          accounts: [],
          totalBalance: 0,
          lastSync: undefined,
          logo: account.institutionLogo || undefined,
        };
      }

      acc[institutionId].accounts.push(account);
      acc[institutionId].status = account?.status
      acc[institutionId].autoSync = account?.autoSync
      acc[institutionId].provider = account?.provider
      acc[institutionId].totalBalance += account?.availableBalance ?? 0;

      // Get logo from institutionLogo (generated from institutionUrl in page)
      if (!acc[institutionId].logo && account.institutionLogo) {
        acc[institutionId].logo = account.institutionLogo;
      }

      // Update lastSync to the most recent
      if (account.lastSyncAt) {
        if (
          !acc[institutionId].lastSync ||
          new Date(account.lastSyncAt) > new Date(acc[institutionId].lastSync!)
        ) {
          acc[institutionId].lastSync = account.lastSyncAt;
        }
      }

      return acc;
    }, {} as Record<string, BankConnection>);

    return Object.values(grouped).sort((a, b) =>
      a.institutionName.localeCompare(b.institutionName)
    );
  }, [accounts]);

  // Filter connections based on search query
  const filteredConnections = useMemo(() => {
    if (!searchQuery.trim()) return connections;
    const query = searchQuery.toLowerCase();
    return connections.filter(
      (conn) =>
        conn.institutionName.toLowerCase().includes(query) ||
        conn.accounts.some(
          (acc) =>
            acc.name?.toLowerCase().includes(query) ||
            acc.displayName?.toLowerCase().includes(query)
        )
    );
  }, [connections, searchQuery]);

  const handleToggleExpand = useCallback((institutionId: string) => {
    setExpandedConnections((prev) => {
      const next = new Set(prev);
      if (next.has(institutionId)) {
        next.delete(institutionId);
      } else {
        next.add(institutionId);
      }
      return next;
    });
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="text-center py-16 border border-border/50 rounded-lg bg-muted/20">
        <FluentBuildingBank28Regular className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-1">No bank connections</h3>
        <p className="text-sm text-muted-foreground">
          Connect your first bank account to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Data Table */}
      <div className="   overflow-clip     rounded-sm   ">
        {/* Search & Filter Toolbar - Inside datatable */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3  py-4">
          <div className="flex-1 w-full sm:max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Search banks & accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
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
            <Table className="w-full " style={{ tableLayout: "fixed" }}>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-8 flex-shrink-0" />
                  <TableHead className="flex-1  min-w-[200px]">Bank</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">Status</TableHead>
                  <TableHead className="hidden md:table-cell text-right w-22">Provider</TableHead>
                  <TableHead className="hidden lg:table-cell text-right">Total Balance</TableHead>
                  <TableHead className="hidden lg:table-cell text-right w-40">Last Synced</TableHead>
                  <TableHead className="w-20 flex-shrink-0 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredConnections.map((connection) => (
                  <BankConnectionRow
                    key={connection.institutionId}
                    connection={connection}
                    isExpanded={expandedConnections.has(connection.institutionId)}
                    onToggleExpand={handleToggleExpand}
                    onSync={onSync}
                    onDisconnect={onDisconnect}
                    onDelete={onDelete}
                  />
                ))}
              </TableBody>
            </Table>
            </div>

      </div>

      {/* Empty State */}
      {filteredConnections.length === 0 && (
        <div className="text-center py-16   rounded-lg bg-muted/20">
          <FluentBuildingBank28Regular className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-1">
            {searchQuery ? "No matching connections" : "No bank connections"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "Connect your first bank account to get started"}
          </p>
        </div>
      )}

      {/* Settings Drawer */}
      <Drawer open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DrawerContent className="max-w-xl mx-auto rounded-b-none">
          <DrawerHeader className="pb-4">
            <DrawerTitle className="text-lg">Bank Preferences</DrawerTitle>
            <DrawerDescription className="mt-1">
              Customize how the connections table looks and behaves
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            {/* View Preferences Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Settings2 className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">View Preferences</h3>
              </div>

              <div className="space-y-2">
                {/* Show Inactive Connections */}
                <div className={cn(
                  "flex items-center justify-between p-3 rounded-lg transition-all",
                  "bg-muted/40 hover:bg-muted/60 cursor-pointer"
                )}>
                  <div className="flex-1 pr-3">
                    <p className="text-sm font-medium text-foreground">
                      Show Inactive
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Display disconnected connections
                    </p>
                  </div>
                  <Switch />
                </div>

                {/* Show Empty Connections */}
                <div className={cn(
                  "flex items-center justify-between p-3 rounded-lg transition-all",
                  "bg-muted/40 hover:bg-muted/60 cursor-pointer"
                )}>
                  <div className="flex-1 pr-3">
                    <p className="text-sm font-medium text-foreground">
                      Show All Accounts
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Display all accounts by default
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </div>

          <DrawerFooter className="border-t border-border/50 pt-4">
            <DrawerClose asChild>
              <Button variant="outline" size="sm" className="w-full">
                Done
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
