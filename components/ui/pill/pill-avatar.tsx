import * as React from "react";
import { cn } from "./styles";

export interface PillAvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: "xs" | "sm" | "md" | "lg";
  fallback?: React.ReactNode;
  status?: "online" | "offline" | "away" | "busy" | "none";
  statusPosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

const avatarSizes = {
  xs: "h-4 w-4",
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-7 w-7",
};

const statusSizes = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
};

const statusColors = {
  online: "bg-emerald-500",
  offline: "bg-gray-400",
  away: "bg-amber-500",
  busy: "bg-red-500",
};

const statusPositions = {
  "top-right": "top-0 right-0",
  "top-left": "top-0 left-0",
  "bottom-right": "bottom-0 right-0",
  "bottom-left": "bottom-0 left-0",
};

export const PillAvatar = React.forwardRef<HTMLDivElement, PillAvatarProps>(
  (
    {
      src,
      alt,
      size = "md",
      fallback,
      status = "none",
      statusPosition = "bottom-right",
      className,
      ...props
    },
    ref
  ) => {
    const [imgError, setImgError] = React.useState(false);
    
    const renderFallback = () => {
      if (fallback) return fallback;
      return (
        <div className="flex h-full w-full items-center justify-center bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium">
          {alt?.[0]?.toUpperCase() || "?"}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex-shrink-0 overflow-hidden rounded-full",
          avatarSizes[size],
          className
        )}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt={alt || ""}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
            {...props}
          />
        ) : (
          renderFallback()
        )}
        
        {status !== "none" && (
          <span
            className={cn(
              "absolute rounded-full border-2 border-white dark:border-gray-800",
              statusColors[status],
              statusSizes[size],
              statusPositions[statusPosition]
            )}
          />
        )}
      </div>
    );
  }
);

PillAvatar.displayName = "PillAvatar";