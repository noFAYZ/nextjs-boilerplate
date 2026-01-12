"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plug, Unplug, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface ConnectionSyncControlsProps {
  connectionId: string;
  provider: string;
  status: "ACTIVE" | "PAUSED" | "DISCONNECTED";
  lastSyncAt?: string;
  isCurrentlySyncing?: boolean;
  syncProgress?: number;
  onSync: () => Promise<void>;
  onReconnect?: () => Promise<void>;
  onDisconnect?: () => Promise<void>;
  className?: string;
}

export function ConnectionSyncControls({
  connectionId,
  provider,
  status,
  lastSyncAt,
  isCurrentlySyncing = false,
  syncProgress = 0,
  onSync,
  onReconnect,
  onDisconnect,
  className,
}: ConnectionSyncControlsProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await onSync();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleReconnect = async () => {
    if (!onReconnect) return;
    setIsReconnecting(true);
    try {
      await onReconnect();
    } finally {
      setIsReconnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!onDisconnect) return;
    if (!confirm("Are you sure you want to disconnect this connection?")) return;
    setIsDisconnecting(true);
    try {
      await onDisconnect();
    } finally {
      setIsDisconnecting(false);
    }
  };

  const formatLastSync = (date: string | undefined) => {
    if (!date) return "Never";
    try {
      const syncDate = new Date(date);
      const now = new Date();
      const diffMs = now.getTime() - syncDate.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;

      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;

      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return "Unknown";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600";
      case "PAUSED":
        return "text-yellow-600";
      case "DISCONNECTED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Card className={className}>
      <CardContent className="pt-6 space-y-4">
        {/* Status Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Provider</span>
            <span className="text-sm text-muted-foreground">{provider}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <span className={cn("text-sm font-medium", getStatusColor(status))}>
              {status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Last Sync</span>
            <span className="text-sm text-muted-foreground">
              {formatLastSync(lastSyncAt)}
            </span>
          </div>
        </div>

        {/* Sync Progress */}
        {isCurrentlySyncing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Syncing...</span>
              <span>{syncProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all"
                style={{ width: `${syncProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          {status === "ACTIVE" && (
            <Button
              size="sm"
              onClick={handleSync}
              disabled={isSyncing || isCurrentlySyncing}
              className="w-full"
              variant="default"
            >
              <RefreshCw
                className={cn(
                  "w-4 h-4 mr-2",
                  isSyncing || isCurrentlySyncing ? "animate-spin" : ""
                )}
              />
              {isCurrentlySyncing ? "Syncing..." : "Sync Now"}
            </Button>
          )}

          {status === "DISCONNECTED" && onReconnect && (
            <Button
              size="sm"
              onClick={handleReconnect}
              disabled={isReconnecting}
              className="w-full"
              variant="outline"
            >
              <Plug className="w-4 h-4 mr-2" />
              Reconnect
            </Button>
          )}

          {status === "ACTIVE" && onDisconnect && (
            <Button
              size="sm"
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className="w-full"
              variant="destructive"
            >
              <Unplug className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          )}
        </div>

        {/* Warning */}
        {status === "DISCONNECTED" && (
          <div className="flex gap-2 p-2 rounded-lg bg-destructive/10">
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-xs text-destructive">
              Connection is disconnected. Reconnect to sync new data.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
