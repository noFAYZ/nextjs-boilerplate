"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ConnectionHealthBadgeProps {
  status: "healthy" | "warning" | "error" | "syncing";
  lastSyncAt?: string;
  isCurrentlySyncing?: boolean;
  className?: string;
}

export function ConnectionHealthBadge({
  status,
  lastSyncAt,
  isCurrentlySyncing = false,
  className,
}: ConnectionHealthBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "healthy":
        return {
          icon: CheckCircle,
          label: "Connected",
          color: "text-green-600 bg-green-50 dark:bg-green-950/30",
          dotColor: "bg-green-500",
        };
      case "warning":
        return {
          icon: AlertCircle,
          label: "Connection Issues",
          color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30",
          dotColor: "bg-yellow-500",
        };
      case "error":
        return {
          icon: AlertCircle,
          label: "Connection Failed",
          color: "text-red-600 bg-red-50 dark:bg-red-950/30",
          dotColor: "bg-red-500",
        };
      case "syncing":
        return {
          icon: Clock,
          label: "Syncing...",
          color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30",
          dotColor: "bg-blue-500",
        };
      default:
        return {
          icon: Clock,
          label: "Unknown",
          color: "text-gray-600 bg-gray-50 dark:bg-gray-950/30",
          dotColor: "bg-gray-500",
        };
    }
  };

  const config = getStatusConfig(isCurrentlySyncing ? "syncing" : status);
  const Icon = config.icon;

  const formatLastSync = (date: string | undefined) => {
    if (!date) return "Never synced";
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

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
              config.color,
              className
            )}
          >
            <div className={cn("w-2 h-2 rounded-full", config.dotColor)} />
            <Icon className="w-4 h-4" />
            <span>{config.label}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Last synced: {formatLastSync(lastSyncAt)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
