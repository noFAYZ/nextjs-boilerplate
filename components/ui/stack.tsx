"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const stackVariants = cva(
  "flex",
  {
    variants: {
      direction: {
        row: "flex-row",
        "row-reverse": "flex-row-reverse",
        col: "flex-col",
        "col-reverse": "flex-col-reverse",
      },
      gap: {
        0: "gap-0",
        1: "gap-1", 
        2: "gap-2",
        3: "gap-3",
        4: "gap-4",
        6: "gap-6",
        8: "gap-8",
        10: "gap-10",
        12: "gap-12",
        16: "gap-16",
        20: "gap-20",
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
        baseline: "items-baseline",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
      },
      wrap: {
        true: "flex-wrap",
        false: "flex-nowrap",
        reverse: "flex-wrap-reverse",
      },
    },
    defaultVariants: {
      direction: "col",
      gap: 4,
      align: "stretch",
      justify: "start",
      wrap: false,
    },
  }
)

interface StackProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof stackVariants> {}

export function Stack({
  className,
  direction,
  gap,
  align,
  justify,
  wrap,
  ...props
}: StackProps) {
  return (
    <div
      className={cn(stackVariants({ direction, gap, align, justify, wrap, className }))}
      {...props}
    />
  )
}

// Horizontal Stack (HStack)
export function HStack({
  className,
  gap = 4,
  align = "center",
  justify = "start",
  wrap = false,
  ...props
}: Omit<StackProps, "direction">) {
  return (
    <Stack
      direction="row"
      gap={gap}
      align={align}
      justify={justify}
      wrap={wrap}
      className={className}
      {...props}
    />
  )
}

// Vertical Stack (VStack)
export function VStack({
  className,
  gap = 4,
  align = "stretch",
  justify = "start",
  ...props
}: Omit<StackProps, "direction" | "wrap">) {
  return (
    <Stack
      direction="col"
      gap={gap}
      align={align}
      justify={justify}
      className={className}
      {...props}
    />
  )
}

// Center component for centering content
export function Center({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Spacer component for flexible spacing
export function Spacer({ className }: { className?: string }) {
  return <div className={cn("flex-1", className)} />
}

export { stackVariants }