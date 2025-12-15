"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { motion, AnimatePresence } from "framer-motion"
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
    lg: "size-5",
  }

  const baseClasses = cn(
    "peer relative inline-flex items-center justify-center rounded-md border border-input transition-all duration-0 outline-none cursor-pointer",
    "focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    sizeClasses[size],
    {
      // Variant styles
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
      <AnimatePresence>
        {props.checked && (
          <CheckboxPrimitive.Indicator asChild forceMount>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="flex items-center justify-center text-primary-foreground"
            >
              <Check className={cn("stroke-[3px]", size === "lg" ? "size-4" : "size-3")} />
            </motion.div>
          </CheckboxPrimitive.Indicator>
        )}
      </AnimatePresence>
    </CheckboxPrimitive.Root>
  )
}
