import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium  ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none outline-none cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        // 🌟 Improved Primary
        default:
          "bg-gradient-to-r from-primary/80 to-primary/90 text-primary-foreground shadow-sm hover:from-primary/90 hover:to-primary/80 active:from-primary/95 active:to-primary/85 focus-visible:ring-2 focus-visible:ring-primary/50 dark:from-primary dark:to-primary/80 dark:hover:from-primary/80 dark:hover:to-primary/70",

        // 🔥 Improved Destructive
        destructive:
          "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-sm hover:from-red-500 hover:to-red-400 active:from-red-700 active:to-red-600 focus-visible:ring-2 focus-visible:ring-red-400/60 dark:from-red-700 dark:to-red-600 dark:hover:from-red-600 dark:hover:to-red-500",

        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",

        success:
          "bg-green-600 text-white shadow-xs hover:bg-green-700 focus-visible:ring-green-400/40",
        warning:
          "bg-yellow-500 text-black shadow-xs hover:bg-yellow-600 focus-visible:ring-yellow-400/40",
        info: "bg-sky-600 text-white shadow-xs hover:bg-sky-700 focus-visible:ring-sky-400/40",
        subtle:
          "bg-muted text-muted-foreground hover:bg-muted/80 border border-border",
        soft: "bg-primary/10 text-primary hover:bg-primary/20",
        gradient:
          "bg-gradient-to-r from-primary to-purple-500 text-white shadow-md hover:opacity-90",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-sm gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-12 px-8 text-base rounded-lg font-semibold",
        icon: "size-9",
      },
      shape: {
        default: "rounded-md",
        pill: "rounded-full",
        square: "rounded-none",
        circle: "rounded-full size-9 p-0 justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  }
)

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

function Button({
  className,
  variant,
  size,
  shape,
  
  asChild = false,
  isLoading = false,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      aria-busy={isLoading}
      disabled={isLoading || props.disabled}
      className={cn(buttonVariants({ variant, size, shape,  className }))}
      {...props}
    >
 
      {children}
    </Comp>
  )
}

export { Button, buttonVariants }
