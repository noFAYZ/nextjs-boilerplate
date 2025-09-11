"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const gridVariants = cva(
  "grid",
  {
    variants: {
      cols: {
        1: "grid-cols-1",
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
        6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
        12: "grid-cols-12",
        auto: "grid-cols-[repeat(auto-fit,minmax(250px,1fr))]",
        "auto-sm": "grid-cols-[repeat(auto-fit,minmax(200px,1fr))]",
        "auto-lg": "grid-cols-[repeat(auto-fit,minmax(300px,1fr))]",
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
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
        baseline: "items-baseline",
      },
      justify: {
        start: "justify-items-start",
        center: "justify-items-center", 
        end: "justify-items-end",
        stretch: "justify-items-stretch",
      },
    },
    defaultVariants: {
      cols: 1,
      gap: 4,
      align: "stretch",
      justify: "stretch",
    },
  }
)

interface GridProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof gridVariants> {}

export function Grid({
  className,
  cols,
  gap,
  align,
  justify,
  ...props
}: GridProps) {
  return (
    <div
      className={cn(gridVariants({ cols, gap, align, justify, className }))}
      {...props}
    />
  )
}

// Grid Item Component
const gridItemVariants = cva(
  "",
  {
    variants: {
      span: {
        1: "col-span-1",
        2: "col-span-2",
        3: "col-span-3",
        4: "col-span-4",
        5: "col-span-5",
        6: "col-span-6",
        7: "col-span-7",
        8: "col-span-8",
        9: "col-span-9",
        10: "col-span-10",
        11: "col-span-11",
        12: "col-span-12",
        full: "col-span-full",
        auto: "col-auto",
      },
      start: {
        1: "col-start-1",
        2: "col-start-2",
        3: "col-start-3",
        4: "col-start-4",
        5: "col-start-5",
        6: "col-start-6",
        7: "col-start-7",
        8: "col-start-8",
        9: "col-start-9",
        10: "col-start-10",
        11: "col-start-11",
        12: "col-start-12",
        auto: "col-start-auto",
      },
      end: {
        1: "col-end-1",
        2: "col-end-2", 
        3: "col-end-3",
        4: "col-end-4",
        5: "col-end-5",
        6: "col-end-6",
        7: "col-end-7",
        8: "col-end-8",
        9: "col-end-9",
        10: "col-end-10",
        11: "col-end-11",
        12: "col-end-12",
        13: "col-end-13",
        auto: "col-end-auto",
      },
    },
    defaultVariants: {
      span: 1,
    },
  }
)

interface GridItemProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof gridItemVariants> {}

export function GridItem({
  className,
  span,
  start,
  end,
  ...props
}: GridItemProps) {
  return (
    <div
      className={cn(gridItemVariants({ span, start, end, className }))}
      {...props}
    />
  )
}

export { gridVariants, gridItemVariants }