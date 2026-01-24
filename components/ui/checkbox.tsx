"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  variant?: "default" | "glow" | "glass"
  size?: "sm" | "md" | "lg"
}

export function Checkbox({
  className,
  variant = "default",
  size = "md",
  ...props
}: CheckboxProps) {
  const sizeClasses = {
    sm: "size-3.5",
    md: "size-4",
    lg: "size-4.5",
  }

  const iconSizes = {
    sm: "size-2.5",
    md: "size-3",
    lg: "size-3.5",
  }

  const baseClasses = cn(
    "peer relative inline-flex items-center justify-center rounded-xs border cursor-pointer",
    "transition-colors duration-75 ease-out",
    "focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    sizeClasses[size],
    {
      "bg-background data-[state=checked]:bg-primary data-[state=checked]:border-primary":
        variant === "default",

      "bg-background/70 backdrop-blur-sm border-border data-[state=checked]:bg-primary/20 data-[state=checked]:border-primary/50":
        variant === "glass",

      "bg-background border-border hover:border-primary/40 data-[state=checked]:bg-primary/90 data-[state=checked]:shadow-[0_0_6px_rgba(var(--primary-rgb),0.5)]":
        variant === "glow",
    },
    className
  )

  return (
    <CheckboxPrimitive.Root className={baseClasses} {...props}>
      <CheckboxPrimitive.Indicator
        className={cn(
          "flex items-center justify-center text-primary-foreground",
          "transition-opacity duration-75 ease-out",
          "data-[state=unchecked]:opacity-0",
          "data-[state=checked]:opacity-100"
        )}
      >
        <Check className={cn("stroke-[4px]", iconSizes[size])} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
