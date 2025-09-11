import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center  whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-75 disabled:pointer-events-none disabled:opacity-50   outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ring-offset-background relative overflow-hidden cursor-pointer disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md active:scale-[0.98] before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md active:scale-[0.98] focus-visible:ring-destructive/70 before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        outline:
          "border-2 border-border/60 bg-background/50 backdrop-blur-sm hover:bg-accent/50 hover:text-accent-foreground hover:border-border active:scale-[0.98] shadow-sm hover:shadow-md",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md active:scale-[0.98] backdrop-blur-sm border border-secondary-foreground/10",
        ghost:
          "hover:bg-accent/60 hover:text-accent-foreground active:scale-[0.98] backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline active:scale-[0.98]",
        success:
          "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 hover:shadow-md active:scale-[0.98] focus-visible:ring-emerald-500/70 before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        warning:
          "bg-amber-500 text-white shadow-sm hover:bg-amber-600 hover:shadow-md active:scale-[0.98] focus-visible:ring-amber-500/70 before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        premium:
          "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl active:scale-[0.98] focus-visible:ring-purple-500/70 before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        enterprise:
          "bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg hover:shadow-xl active:scale-[0.98] focus-visible:ring-slate-500/70 before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity border border-slate-700/50",
      },
      size: {
        xs: "h-7 px-2.5 text-xs rounded-md ",
        sm: "h-8 px-3 text-sm rounded-md ",
        default: "h-9 px-4 ",
        lg: "h-10 px-6 text-base ",
        xl: "h-12 px-8 text-lg ",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
        "icon-xl": "size-12",
      },
      loading: {
        true: "cursor-not-allowed",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  loadingText,
  icon,
  iconPosition = "left",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  const isDisabled = disabled || loading

  const content = React.useMemo(() => {
    if (loading) {
      return (
        <>
          <Loader2 className="size-4 animate-spin" />
          {loadingText || children}
        </>
      )
    }

    if (icon && !asChild) {
      return iconPosition === "right" ? (
        <>
          {children}
          {icon}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )
    }

    return children
  }, [loading, loadingText, children, icon, iconPosition, asChild])

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, loading, className }))}
      disabled={isDisabled}
      {...props}
    >
      {content}
    </Comp>
  )
}

export { Button, buttonVariants }
