"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Lock } from "lucide-react";

interface AccountStatusBadgeProps {
  status: "ACTIVE" | "ARCHIVED" | "CLOSED";
  className?: string;
  variant?: "compact" | "full";
}

export function AccountStatusBadge({
  status,
  className,
  variant = "compact",
}: AccountStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return {
          icon: CheckCircle,
          label: "Active",
          color: "text-green-600 bg-green-50 dark:bg-green-950/30",
          dotColor: "bg-green-500",
        };
      case "ARCHIVED":
        return {
          icon: AlertCircle,
          label: "Archived",
          color: "text-gray-600 bg-gray-50 dark:bg-gray-950/30",
          dotColor: "bg-gray-500",
        };
      case "CLOSED":
        return {
          icon: Lock,
          label: "Closed",
          color: "text-red-600 bg-red-50 dark:bg-red-950/30",
          dotColor: "bg-red-500",
        };
      default:
        return {
          icon: CheckCircle,
          label: "Unknown",
          color: "text-gray-600 bg-gray-50 dark:bg-gray-950/30",
          dotColor: "bg-gray-500",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
          config.color,
          className
        )}
      >
        <div className={cn("w-1.5 h-1.5 rounded-full", config.dotColor)} />
        <span>{config.label}</span>
      </div>
    );
  }

  return (
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
  );
}
