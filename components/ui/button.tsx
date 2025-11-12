import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-100 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ring-offset-background relative overflow-hidden cursor-pointer disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
 /*        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md active:scale-[0.98] before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity", */
/*           default: "bg-orange-500  text-primary-foreground border-2 border-orange-800 shadow-[0_4px_0_0_rgb(154,52,18)] hover:shadow-[0_2px_0_0_rgb(154,52,18)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-100 font-medium dark:bg-orange-900 dark:border-orange-600 dark:shadow-[0_4px_0_0_rgb(224,45,18)] dark:hover:shadow-[0_2px_0_0_rgb(224,45,18)]", */

          default:
            "relative bg-gradient-to-b from-[#FFB347] via-[#FF7A00] to-[#E66A00] text-white font-semibold " +
            "shadow-[0_4px_0_0_rgb(154,52,18)] border-2 border-[#E66A00]/70 " +
            " hover:shadow-[0_2px_0_0_rgb(154,52,18)] hover:translate-y-[2px] " +
            "active:shadow-none active:translate-y-[4px] transition-all duration-150 " +
            "before:absolute before:inset-0 before:bg-[linear-gradient(145deg,rgba(255,255,255,0.3)_0%,transparent_60%)] before:opacity-0  before:transition-opacity before:duration-200 " +
            " overflow-hidden dark:from-[#FF8C1A] dark:via-[#E66A00] dark:to-[#B84D00]",
          delete: 'bg-[rgb(245,126,47)] text-primary-foreground border-2 border-[rgb(245,102,9)] shadow-[0_3px_0_0_rgb(245,102,9)] hover:shadow-[0_1px_0_0_rgb(245,100,9)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-150 font-medium ',
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md  focus-visible:ring-destructive/70 before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        outline:
          "border-2 border-border bg-gray-50 dark:bg-[#3E3C3C] backdrop-blur-sm hover:bg-gray-200 hover:text-accent-foreground   shadow-sm hover:shadow-md   shadow-[0_4px_0_0_rgb(218,217,212)] hover:shadow-[0_2px_0_0_rgb(218,217,212)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-100  dark:shadow-[0_4px_0_0_rgb(47,47,41)] dark:hover:shadow-[0_2px_0_0_rgb(47,47,41)]",
        secondary:  "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md active:scale-[0.98] backdrop-blur-sm border-2 border-orange-500/25 shadow-[0_4px_0_0_rgb(254,215,170)] hover:shadow-[0_2px_0_0_rgb(254,215,170)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-75 dark:border-[rgb(114,65,12)] dark:shadow-[0_3px_0_0_rgb(114,65,12)] dark:hover:shadow-[0_1px_0_0_rgb(114,65,12)]",
        ghost:
          "hover:bg-accent/60 hover:text-accent-foreground active:scale-[0.98] backdrop-blur-sm",
        link: 
          "text-primary underline-offset-4 hover:underline active:scale-[0.98]",
        success:
          "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 hover:shadow-md active:scale-[0.98] focus-visible:ring-emerald-500/70 before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        warning:
          "bg-amber-500 text-white shadow-sm hover:bg-amber-600 hover:shadow-md active:scale-[0.98] focus-visible:ring-amber-500/70 before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        premium:
          "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl active:scale-[0.98] focus-visible:ring-purple-500/70 before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        enterprise:
          "bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg hover:shadow-xl active:scale-[0.98] focus-visible:ring-slate-500/70 before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity border border-slate-700/50",
        
        // New Creative Variants
        neon:
          "bg-slate-900 text-cyan-400 border-2 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:border-cyan-400 active:scale-[0.98] focus-visible:ring-cyan-500/70 transition-all duration-300",
        glassmorphism:
          "bg-white/10 backdrop-blur-xl border border-white/20 text-foreground shadow-lg hover:bg-white/20 hover:border-white/30 active:scale-[0.98] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        neobrutalism:
          "bg-orange-500 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150 font-black uppercase",
        gradient:
          "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg hover:shadow-2xl hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 active:scale-[0.98] focus-visible:ring-purple-500/70 animate-gradient bg-[length:200%_200%]",
        shimmer:
          "bg-slate-900 text-white border border-slate-700 shadow-lg hover:shadow-xl active:scale-[0.98] after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:translate-x-[-100%] hover:after:translate-x-[100%] after:transition-transform after:duration-400",
        aurora:
          "bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-white shadow-lg hover:shadow-2xl active:scale-[0.98] focus-visible:ring-purple-500/70 before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-400 before:via-purple-400 before:to-pink-400 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
        cyberpunk:
          "bg-black text-cyan-300 border-2 border-cyan-500 shadow-[inset_0_0_10px_rgba(6,182,212,0.3)] hover:shadow-[inset_0_0_20px_rgba(6,182,212,0.5),0_0_20px_rgba(6,182,212,0.3)] hover:text-cyan-100 active:scale-[0.98] focus-visible:ring-cyan-500/70 font-mono uppercase tracking-wider",
        minimal:
          "bg-transparent text-foreground border-b-2 border-transparent hover:border-foreground rounded-none active:scale-[0.98] transition-colors duration-200",
        neumorphism:
          "bg-slate-100 text-slate-900 shadow-[5px_5px_10px_rgba(0,0,0,0.1),-5px_-5px_10px_rgba(255,255,255,0.9)] hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.1),inset_-5px_-5px_10px_rgba(255,255,255,0.9)] active:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.1),inset_-5px_-5px_10px_rgba(255,255,255,0.9)] transition-all duration-200",
        retro:
          "bg-orange-500 text-white border-b-4 border-orange-700 shadow-md hover:bg-orange-600 hover:border-orange-800 active:border-b-0 active:mt-[4px] active:shadow-none transition-all duration-100 font-bold",
        holographic:
          "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-2xl active:scale-[0.98] focus-visible:ring-purple-500/70 before:absolute before:inset-0 before:bg-gradient-to-tl before:from-blue-400 before:via-cyan-400 before:to-teal-400 before:opacity-0 hover:before:opacity-50 before:transition-opacity before:duration-300 before:mix-blend-overlay",
        liquid:
          "bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-teal-600 active:scale-[0.98] focus-visible:ring-blue-500/70 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/30 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-500 before:blur-xl",
         
        cosmic:
          "bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 text-white border border-purple-500/30 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] active:scale-[0.98] focus-visible:ring-purple-500/70 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.2),transparent_50%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        sunset:
          "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white shadow-lg hover:shadow-2xl hover:from-orange-600 hover:via-red-600 hover:to-pink-600 active:scale-[0.98] focus-visible:ring-orange-500/70",
        matrix:
          "bg-black text-green-400 border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:text-green-300 active:scale-[0.98] focus-visible:ring-green-500/70 font-mono before:absolute before:inset-0 before:bg-[linear-gradient(0deg,transparent_0%,rgba(34,197,94,0.1)_50%,transparent_100%)] before:animate-pulse",
        candy:
          "bg-gradient-to-r from-pink-400 via-purple-300 to-blue-300 text-white shadow-lg hover:shadow-2xl hover:from-pink-500 hover:via-purple-400 hover:to-blue-400 active:scale-[0.98] focus-visible:ring-pink-500/70 border-2 border-white/50",
        steel:
          "bg-gradient-to-b from-slate-400 to-slate-600 text-white border border-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] hover:from-slate-500 hover:to-slate-700 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] active:scale-[0.98]",
      },
      size: {
        xs: "h-7 px-2 text-xs rounded-md gap-1",
        sm: "h-8 px-3 text-sm rounded-md gap-1",
        default: "h-9 px-4 gap-2",
        lg: "h-10 px-6 text-base gap-2.5",
        xl: "h-12 px-8 text-lg gap-3",
        "2xl": "h-14 px-10 text-xl gap-3",
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