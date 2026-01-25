"use client";

import { useState, useMemo, memo, useCallback } from "react";
import Image from "next/image";
import { ChevronRight, RefreshCw, Trash2, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { FluentBuildingBank28Regular, LetsIconsCreditCardDuotone } from "../icons/icons";

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
}

const getSyncStatusColor = (status: BankingSyncStatus) => {
  const statusColorMap: Record<BankingSyncStatus, string> = {
    connected: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    syncing: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    error: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    disconnected: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
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
  const [imageError, setImageError] = useState(false);

  const handleToggleExpand = useCallback(() => {
    onToggleExpand(connection.institutionId);
  }, [connection.institutionId, onToggleExpand]);

  const primaryAccount = connection.accounts[0];

  return (
    <>
      {/* Bank Header Row */}
      <TableRow
        className={cn(
          "group items-center hover:bg-muted/30",
          isExpanded && "bg-secondary/20"
        )}
      >
        <TableCell className="px-2 sm:px-4 py-2" onClick={(e) => e.stopPropagation()}>
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

        <TableCell className="px-2 sm:px-4 py-2 cursor-pointer group-hover:text-primary" onClick={handleToggleExpand}>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative h-8 w-8 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
              {connection.logo && !imageError ? (
                <Image
                  src={connection.logo}
                  alt={connection.institutionName}
                  fill
                  className="object-cover"
                  priority={false}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center rounded-lg justify-center bg-primary text-primary-foreground"
                  aria-label={`${connection.institutionName} logo placeholder`}
                >
                  <span className="font-bold text-xs sm:text-sm">
                    {connection.institutionName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-xs sm:text-sm truncate">
                {connection.institutionName || "Unknown Bank"}
              </p>
            </div>
          </div>
        </TableCell>

        <TableCell className="hidden sm:table-cell text-right px-4 py-2">
          <Badge
            className={cn("text-xs rounded-md font-medium", getSyncStatusColor(primaryAccount?.syncStatus || "disconnected"))}
          >
            {getSyncStatusLabel(primaryAccount?.syncStatus || "disconnected")}
          </Badge>
        </TableCell>

        <TableCell className="hidden lg:table-cell text-right px-4 py-2">
          <p className="text-sm font-medium">
            <CurrencyDisplay amountUSD={connection.totalBalance} />
          </p>
        </TableCell>

        <TableCell className="hidden lg:table-cell text-right px-4 py-2">
          {connection.lastSync ? (
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(connection.lastSync), { addSuffix: true })}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Never</span>
          )}
        </TableCell>

        <TableCell
          className="text-center px-2 sm:px-4 py-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center gap-1">
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

      {/* Expanded Accounts Row */}
      {isExpanded && (
        <TableRow className="border-b border-border bg-secondary dark:bg-background hover:bg-secondary">
          <TableCell colSpan={6} className="p-2">
            <div className="space-y-2">
              {/* Accounts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
                {connection.accounts.map((account) => (
                  <div key={account.id} className="p-2">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      {account.name || "Unnamed Account"}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs rounded-sm">
                        {account.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {account.accountNumber ? `****${account.accountNumber.slice(-4)}` : "No account #"}
                    </p>
                    <p className="text-sm font-semibold mt-1">
                      <CurrencyDisplay amountUSD={account.balance ?? 0} variant="small" />
                    </p>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 px-4 pb-2 items-center">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => onSync?.(primaryAccount)}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Sync All
                </Button>

                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => onDisconnect?.(primaryAccount)}
                  className="flex items-center gap-2"
                >
                  <Power className="h-4 w-4" />
                  Disconnect
                </Button>

                {connection.accounts.length > 1 && (
                  <Button
                    variant="delete"
                    size="xs"
                    onClick={() => onDelete?.(primaryAccount)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove All
                  </Button>
                )}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
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
          logo: undefined,
        };
      }

      acc[institutionId].accounts.push(account);
      acc[institutionId].totalBalance += account.balance ?? 0;

      // Get logo from tellerInstitutionData if available
      if (!acc[institutionId].logo && account.tellerInstitutionData) {
        const institutionData = account.tellerInstitutionData as Record<string, any>;
        acc[institutionId].logo = institutionData.logo || institutionData.logoUrl;
      }

      // Update lastSync to the most recent
      if (account.lastTellerSync) {
        if (
          !acc[institutionId].lastSync ||
          new Date(account.lastTellerSync) > new Date(acc[institutionId].lastSync!)
        ) {
          acc[institutionId].lastSync = account.lastTellerSync;
        }
      }

      return acc;
    }, {} as Record<string, BankConnection>);

    return Object.values(grouped).sort((a, b) =>
      a.institutionName.localeCompare(b.institutionName)
    );
  }, [accounts]);

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
    <div className="bg-card border border-border/80 rounded-lg overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/80 border-b border-border/50">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-8 px-2 sm:px-4 py-3"></TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider px-2 sm:px-4 py-3 min-w-[200px] sm:w-auto">
              Bank
            </TableHead>
            <TableHead className="hidden sm:table-cell text-right font-semibold text-xs uppercase tracking-wider px-4 py-3">
              Status
            </TableHead>
            <TableHead className="hidden lg:table-cell text-right font-semibold text-xs uppercase tracking-wider px-4 py-3">
              Total Balance
            </TableHead>
            <TableHead className="hidden lg:table-cell text-right font-semibold text-xs uppercase tracking-wider px-4 py-3">
              Last Synced
            </TableHead>
            <TableHead className="text-center font-semibold text-xs uppercase tracking-wider px-2 sm:px-4 py-3">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {connections.map((connection) => (
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
  );
}
