"use client";

import { useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NetWorthCard } from "./net-worth-card";
import { ConnectionHealthBadge } from "./connection-health-badge";
import { cn } from "@/lib/utils";

interface NetWorthSnapshot {
  totalNetWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  previousNetWorth?: number;
  currency?: string;
}

interface Connection {
  id: string;
  provider: string;
  status: "ACTIVE" | "PAUSED" | "DISCONNECTED";
  lastSyncAt?: string;
  isCurrentlySyncing?: boolean;
  accountsCount: number;
}

interface AccountsOverviewSectionProps {
  netWorth?: NetWorthSnapshot;
  connections?: Connection[];
  isLoadingNetWorth?: boolean;
  isLoadingConnections?: boolean;
  className?: string;
}

export function AccountsOverviewSection({
  netWorth,
  connections = [],
  isLoadingNetWorth = false,
  isLoadingConnections = false,
  className,
}: AccountsOverviewSectionProps) {
  const getConnectionHealth = useCallback((connection: Connection) => {
    if (connection.isCurrentlySyncing) {
      return "syncing";
    }
    if (connection.status === "ACTIVE") {
      return "healthy";
    }
    if (connection.status === "PAUSED") {
      return "warning";
    }
    return "error";
  }, []);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Net Worth Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Main Net Worth Card */}
        {isLoadingNetWorth ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Net Worth</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ) : (
          <NetWorthCard
            currentNetWorth={netWorth?.totalNetWorth || 0}
            previousNetWorth={netWorth?.previousNetWorth}
            currency={netWorth?.currency || "USD"}
          />
        )}

        {/* Total Assets Card */}
        {isLoadingNetWorth ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-10 w-40" />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {(netWorth?.totalAssets || 0).toLocaleString("en-US", {
                  style: "currency",
                  currency: netWorth?.currency || "USD",
                  maximumFractionDigits: 0,
                })}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Total Liabilities Card */}
        {isLoadingNetWorth ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-10 w-40" />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">
                {(netWorth?.totalLiabilities || 0).toLocaleString("en-US", {
                  style: "currency",
                  currency: netWorth?.currency || "USD",
                  maximumFractionDigits: 0,
                })}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Connections Status */}
      {connections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Provider Connections</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingConnections ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {connections.map((connection) => (
                  <div
                    key={connection.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium capitalize">
                        {connection.provider.toLowerCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {connection.accountsCount} account
                        {connection.accountsCount !== 1 ? "s" : ""} connected
                      </p>
                    </div>
                    <ConnectionHealthBadge
                      status={getConnectionHealth(connection)}
                      lastSyncAt={connection.lastSyncAt}
                      isCurrentlySyncing={connection.isCurrentlySyncing}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
