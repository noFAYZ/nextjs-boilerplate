"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AccountFavoriteToggleProps {
  accountId: string;
  isFavorite: boolean;
  onToggle: (isFavorite: boolean) => Promise<void>;
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AccountFavoriteToggle({
  accountId,
  isFavorite,
  onToggle,
  isLoading = false,
  size = "md",
  className,
}: AccountFavoriteToggleProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      await onToggle(!isFavorite);
    } finally {
      setIsUpdating(false);
    }
  };

  const sizeClasses = {
    sm: "h-7 w-7 p-0",
    md: "h-9 w-9 p-0",
    lg: "h-10 w-10 p-0",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleToggle}
      disabled={isLoading || isUpdating}
      className={cn(
        sizeClasses[size],
        isFavorite
          ? "text-yellow-500 hover:text-yellow-600"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        className={cn(iconSizes[size], isFavorite ? "fill-current" : "")}
      />
    </Button>
  );
}
