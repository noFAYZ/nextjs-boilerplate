import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Eye, EyeOff, X } from "lucide-react"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 border bg-background/50 backdrop-blur-sm text-base transition-all duration-75 outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default: "border-input rounded-lg shadow-sm hover:shadow-md focus-visible:ring-0 focus-visible:ring-primary/60 focus-visible:ring-offset-0 focus-visible:border-primary/60",
        filled: "bg-muted border-transparent rounded-lg hover:bg-muted/80",
        underlined: "border-0 border-b-2 border-input rounded-none bg-transparent hover:border-border focus-visible:border-primary shadow-none",
        premium: "border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg shadow-sm focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:border-purple-500",
        enterprise: "border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900/50 rounded-lg shadow-sm focus-visible:ring-1 focus-visible:ring-slate-500 focus-visible:border-slate-500 backdrop-blur-sm",
      },
      size: {
        sm: "h-8 px-3 py-1 text-sm rounded-md",
        default: "h-9 px-3 py-2",
        lg: "h-10 px-4 py-2 text-base",
        xl: "h-12 px-6 py-3 text-lg",
      },
      state: {
        default: "",
        error: "border-destructive focus-visible:ring-destructive focus-visible:border-destructive",
        success: "border-emerald-500 focus-visible:ring-emerald-500 focus-visible:border-emerald-500",
        warning: "border-amber-500 focus-visible:ring-amber-500 focus-visible:border-amber-500",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default",
    },
  }
)

interface InputProps extends React.ComponentProps<"input">, VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  clearable?: boolean
  onClear?: () => void
  loading?: boolean
  label?: string
  labelClassName?: string
}

function Input({ 
  className, 
  type, 
  variant, 
  size, 
  state, 
  leftIcon, 
  rightIcon, 
  clearable, 
  onClear, 
  loading,
  value,
  label,
  labelClassName,
  id,
  ...props 
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const isPassword = type === "password"
  const hasValue = value !== undefined && value !== ""
  const inputId = id || React.useId()

  const inputType = isPassword ? (showPassword ? "text" : "password") : type

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const handleClear = () => {
    onClear?.()
  }

  const inputElement = (
    <input
      id={inputId}
      type={inputType}
      data-slot="input"
      className={cn(
        inputVariants({ variant, size, state }),
        leftIcon && "pl-10",
        (rightIcon || isPassword || (clearable && hasValue)) && "pr-10",
        className
      )}
      value={value}
      aria-label={!label ? props.placeholder || "input" : undefined}
      {...props}
    />
  )

  // Render with icons, password toggle, or clear button
  if (leftIcon || rightIcon || isPassword || clearable || loading) {
    const wrappedInput = (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
            {loading ? (
              <div className="size-4 animate-spin rounded-full border-1 border-current border-t-transparent" />
            ) : (
              leftIcon
            )}
          </div>
        )}
        
        {inputElement}
        
        {(rightIcon || isPassword || (clearable && hasValue)) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {clearable && hasValue && (
              <button
                type="button"
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                tabIndex={-1}
                aria-label="Clear input"
              >
                <X className="size-3" />
              </button>
            )}
            
            {isPassword && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            )}
            
            {rightIcon && !isPassword && <div className="text-muted-foreground">{rightIcon}</div>}
          </div>
        )}
      </div>
    )

    if (label) {
      return (
        <label htmlFor={inputId} className="block">
          <span className={cn("block text-sm font-medium text-foreground mb-1.5", labelClassName)}>
            {label}
          </span>
          {wrappedInput}
        </label>
      )
    }

    return wrappedInput
  }

  // Simple input without wrapper
  if (label) {
    return (
      <label htmlFor={inputId} className="block">
        <span className={cn("block text-sm font-medium text-foreground mb-1.5", labelClassName)}>
          {label}
        </span>
        {inputElement}
      </label>
    )
  }

  return inputElement
}

export { Input, inputVariants, type InputProps }