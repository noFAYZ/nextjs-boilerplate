import * as React from "react";
import { cn } from "./styles";

export interface PillStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: "success" | "error" | "warning" | "info" | "default";
  pulse?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  withText?: boolean;
}

const statusConfig = {
  success: {
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
    label: "Success",
  },
  error: {
    dot: "bg-red-500",
    text: "text-red-700 dark:text-red-300",
    label: "Error",
  },
  warning: {
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-300",
    label: "Warning",
  },
  info: {
    dot: "bg-blue-500",
    text: "text-blue-700 dark:text-blue-300",
    label: "Info",
  },
  default: {
    dot: "bg-gray-500",
    text: "text-gray-700 dark:text-gray-300",
    label: "Default",
  },
};

const statusSizes = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
};

export const PillStatus = React.forwardRef<HTMLSpanElement, PillStatusProps>(
  (
    { status = "default", pulse = false, size = "md", withText = false, className, children, ...props },
    ref
  ) => {
    const config = statusConfig[status];

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5",
          withText && config.text,
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "rounded-full",
            config.dot,
            statusSizes[size],
            pulse && "animate-pulse"
          )}
        />
        {withText && <span className="text-xs font-medium">{children || config.label}</span>}
      </span>
    );
  }
);

PillStatus.displayName = "PillStatus";