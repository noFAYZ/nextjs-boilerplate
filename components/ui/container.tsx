"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const containerVariants = cva(
  "w-full mx-auto",
  {
    variants: {
      size: {
        sm: "max-w-screen-sm",
        md: "max-w-screen-md", 
        lg: "max-w-screen-lg",
        xl: "max-w-screen-xl",
        "2xl": "max-w-screen-2xl",
        full: "max-w-full",
        content: "max-w-6xl",
        narrow: "max-w-3xl",
        wide: "max-w-7xl",
      },
      padding: {
        none: "",
        sm: "px-4 sm:px-6",
        md: "px-4 sm:px-6 lg:px-8",
        lg: "px-6 sm:px-8 lg:px-12",
        xl: "px-8 sm:px-12 lg:px-16",
      },
      responsive: {
        true: "px-4 sm:px-6 lg:px-8",
        false: "",
      },
    },
    defaultVariants: {
      size: "xl",
      padding: "md",
      responsive: true,
    },
  }
)

interface ContainerProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof containerVariants> {}

export function Container({
  className,
  size,
  padding,
  responsive,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(containerVariants({ size, padding, responsive, className }))}
      {...props}
    />
  )
}

export { containerVariants }