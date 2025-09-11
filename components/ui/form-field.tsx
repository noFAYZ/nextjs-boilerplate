"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle2, Info } from "lucide-react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const formFieldVariants = cva(
  "space-y-2",
  {
    variants: {
      state: {
        default: "",
        error: "",
        success: "",
        warning: "",
      },
      size: {
        sm: "",
        default: "",
        lg: "",
      },
    },
    defaultVariants: {
      state: "default",
      size: "default",
    },
  }
)

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      state: {
        default: "text-foreground",
        error: "text-destructive",
        success: "text-emerald-600 dark:text-emerald-400",
        warning: "text-amber-600 dark:text-amber-400",
      },
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-destructive",
        false: "",
      },
    },
    defaultVariants: {
      state: "default",
      required: false,
    },
  }
)

const descriptionVariants = cva(
  "text-sm",
  {
    variants: {
      state: {
        default: "text-muted-foreground",
        error: "text-destructive",
        success: "text-emerald-600 dark:text-emerald-400", 
        warning: "text-amber-600 dark:text-amber-400",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

const messageVariants = cva(
  "text-sm flex items-center gap-1.5",
  {
    variants: {
      state: {
        default: "text-muted-foreground",
        error: "text-destructive",
        success: "text-emerald-600 dark:text-emerald-400",
        warning: "text-amber-600 dark:text-amber-400",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

interface FormFieldProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof formFieldVariants> {
  label?: string
  description?: string
  message?: string
  required?: boolean
  optional?: boolean
  children: React.ReactElement
}

export function FormField({
  className,
  state,
  size,
  label,
  description,
  message,
  required = false,
  optional = false,
  children,
  ...props
}: FormFieldProps) {
  const id = React.useId()
  const childId = children.props.id || id
  
  // Clone the child element with proper IDs and ARIA attributes
  const clonedChild = React.cloneElement(children, {
    id: childId,
    "aria-describedby": cn(
      description && `${childId}-description`,
      message && `${childId}-message`
    ),
    "aria-invalid": state === "error" ? "true" : undefined,
    state,
  })

  const getMessageIcon = () => {
    switch (state) {
      case "error":
        return <AlertCircle className="size-4 shrink-0" />
      case "success":
        return <CheckCircle2 className="size-4 shrink-0" />
      case "warning":
        return <Info className="size-4 shrink-0" />
      default:
        return null
    }
  }

  return (
    <div className={cn(formFieldVariants({ state, size, className }))} {...props}>
      {label && (
        <div className="flex items-center justify-between">
          <Label
            htmlFor={childId}
            className={cn(labelVariants({ state, required }))}
          >
            {label}
          </Label>
          {optional && (
            <span className="text-xs text-muted-foreground">Optional</span>
          )}
        </div>
      )}
      
      {description && (
        <p
          id={`${childId}-description`}
          className={cn(descriptionVariants({ state }))}
        >
          {description}
        </p>
      )}
      
      {clonedChild}
      
      {message && (
        <p
          id={`${childId}-message`}
          className={cn(messageVariants({ state }))}
        >
          {getMessageIcon()}
          {message}
        </p>
      )}
    </div>
  )
}

// Form Section for grouping related fields
interface FormSectionProps extends React.ComponentProps<"div"> {
  title?: string
  description?: string
}

export function FormSection({
  className,
  title,
  description,
  children,
  ...props
}: FormSectionProps) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-medium leading-6 text-foreground">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  )
}

// Form Grid for laying out fields in columns
interface FormGridProps extends React.ComponentProps<"div"> {
  cols?: 1 | 2 | 3 | 4
  gap?: "sm" | "md" | "lg"
}

export function FormGrid({
  className,
  cols = 2,
  gap = "md",
  ...props
}: FormGridProps) {
  return (
    <div
      className={cn(
        "grid",
        {
          "grid-cols-1": cols === 1,
          "grid-cols-1 md:grid-cols-2": cols === 2,
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-3": cols === 3,
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-4": cols === 4,
        },
        {
          "gap-4": gap === "sm",
          "gap-6": gap === "md", 
          "gap-8": gap === "lg",
        },
        className
      )}
      {...props}
    />
  )
}

export { formFieldVariants, labelVariants, descriptionVariants, messageVariants }