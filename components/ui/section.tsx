"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const sectionVariants = cva(
  "relative",
  {
    variants: {
      spacing: {
        none: "",
        sm: "py-8",
        md: "py-12",
        lg: "py-16", 
        xl: "py-20",
        "2xl": "py-24",
      },
      background: {
        default: "",
        muted: "bg-muted/30",
        card: "bg-card",
        gradient: "bg-gradient-to-br from-background to-muted/20",
        primary: "bg-primary text-primary-foreground",
        accent: "bg-accent text-accent-foreground",
      },
      border: {
        none: "",
        top: "border-t",
        bottom: "border-b", 
        both: "border-y",
        all: "border",
      },
      pattern: {
        none: "",
        dots: "bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] [background-size:16px_16px]",
        grid: "bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] [background-size:20px_20px]",
        diagonal: "bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.1)_25%,rgba(0,0,0,0.1)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.1)_75%)] [background-size:20px_20px]",
      },
    },
    defaultVariants: {
      spacing: "lg",
      background: "default",
      border: "none",
      pattern: "none",
    },
  }
)

interface SectionProps
  extends React.ComponentProps<"section">,
    VariantProps<typeof sectionVariants> {
  containerSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "content" | "narrow" | "wide"
  containerPadding?: "none" | "sm" | "md" | "lg" | "xl"
  innerClassName?: string
}

export function Section({
  className,
  spacing,
  background,
  border,
  pattern,
  containerSize,
  containerPadding,
  innerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(sectionVariants({ spacing, background, border, pattern, className }))}
      {...props}
    >
      {containerSize ? (
        <div
          className={cn(
            "w-full mx-auto",
            {
              "max-w-screen-sm": containerSize === "sm",
              "max-w-screen-md": containerSize === "md",
              "max-w-screen-lg": containerSize === "lg", 
              "max-w-screen-xl": containerSize === "xl",
              "max-w-screen-2xl": containerSize === "2xl",
              "max-w-full": containerSize === "full",
              "max-w-6xl": containerSize === "content",
              "max-w-3xl": containerSize === "narrow",
              "max-w-7xl": containerSize === "wide",
            },
            {
              "px-4 sm:px-6": containerPadding === "sm",
              "px-4 sm:px-6 lg:px-8": containerPadding === "md",
              "px-6 sm:px-8 lg:px-12": containerPadding === "lg",
              "px-8 sm:px-12 lg:px-16": containerPadding === "xl",
            },
            innerClassName
          )}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  )
}

export { sectionVariants }