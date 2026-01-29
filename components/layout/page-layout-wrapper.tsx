"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Container } from "@/components/ui/container"
import { HStack, VStack, Spacer } from "@/components/ui/stack"

const pageLayoutVariants = cva(
  "space-y-6",
  {
    variants: {
      variant: {
        default: "",
        compact: "space-y-4",
        spacious: "space-y-8",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const pageHeaderVariants = cva(
  "space-y-4",
  {
    variants: {
      variant: {
        default: "",
        centered: "text-center",
        minimal: "space-y-2",
      },
      border: {
        true: "pb-6 border-b",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      border: false,
    },
  }
)

interface PageAction {
  label: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive"
  size?: "sm" | "default" | "lg"
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
}

interface PageHeaderProps extends VariantProps<typeof pageHeaderVariants> {
  title: string
  description?: string
  badge?: {
    text: string
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
  actions?: PageAction[]
  breadcrumbs?: Array<{ label: string; href?: string }>
  className?: string
  children?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  badge,
  actions = [],
  breadcrumbs = [],
  variant,
  border,
  className,
  children,
}: PageHeaderProps) {
  return (
    <div className={cn(pageHeaderVariants({ variant, border, className }))}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-foreground">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-foreground font-medium">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title and Actions */}
      <HStack justify="between" align="start" className="gap-4">
        <VStack gap={2} align="start" className="flex-1 min-w-0">
          <HStack gap={3} align="center" wrap={false}>
            <h1 className="text-3xl font-bold tracking-tight truncate">
              {title}
            </h1>
            {badge && (
              <Badge variant={badge.variant} className="shrink-0">
                {badge.text}
              </Badge>
            )}
          </HStack>
          
          {description && (
            <p className="text-muted-foreground text-lg max-w-2xl">
              {description}
            </p>
          )}
        </VStack>

        {/* Actions */}
        {actions.length > 0 && (
          <HStack gap={2} className="shrink-0">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                size={action.size}
                onClick={action.onClick}
                disabled={action.disabled}
                loading={action.loading}
                icon={action.icon}
              >
                {action.label}
              </Button>
            ))}
          </HStack>
        )}
      </HStack>

      {/* Custom content */}
      {children}
    </div>
  )
}

interface PageContentProps extends VariantProps<typeof pageLayoutVariants> {
  children: React.ReactNode
  className?: string
}

export function PageContent({ children, variant, className }: PageContentProps) {
  return (
    <div className={cn(pageLayoutVariants({ variant, className }))}>
      {children}
    </div>
  )
}

// Section component for organizing content
interface PageSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  actions?: PageAction[]
  className?: string
  headerClassName?: string
  contentClassName?: string
}

export function PageSection({
  title,
  description,
  children,
  actions = [],
  className,
  headerClassName,
  contentClassName,
}: PageSectionProps) {
  return (
    <section className={cn("space-y-6", className)}>
      {(title || description || actions.length > 0) && (
        <div className={cn("space-y-2", headerClassName)}>
          <HStack justify="between" align="start" className="gap-4">
            <VStack gap={1} align="start" className="flex-1">
              {title && (
                <h2 className="text-xl font-semibold tracking-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-muted-foreground">
                  {description}
                </p>
              )}
            </VStack>

            {actions.length > 0 && (
              <HStack gap={2}>
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || "outline"}
                    size={action.size || "sm"}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    loading={action.loading}
                    icon={action.icon}
                  >
                    {action.label}
                  </Button>
                ))}
              </HStack>
            )}
          </HStack>
        </div>
      )}
      
      <div className={cn(contentClassName)}>
        {children}
      </div>
    </section>
  )
}

// Complete page layout component
interface PageLayoutProps extends VariantProps<typeof pageLayoutVariants> {
  header: React.ComponentProps<typeof PageHeader>
  children: React.ReactNode
  className?: string
  containerSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "content" | "narrow" | "wide"
}

export function PageLayout({
  header,
  children,
  variant,
  className,
  containerSize = "xl",
}: PageLayoutProps) {
  return (
    <Container size={containerSize} className={cn("py-6", className)}>
      <PageHeader {...header} />
      <PageContent variant={variant}>
        {children}
      </PageContent>
    </Container>
  )
}

// Empty state component
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline"
  }
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-12", className)}>
      {icon && (
        <div className="mb-4 text-muted-foreground opacity-50">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-foreground mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-muted-foreground max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button
          variant={action.variant || "outline"}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

// Loading state component
interface LoadingStateProps {
  title?: string
  description?: string
  className?: string
}

export function LoadingState({
  title = "Loading...",
  description,
  className,
}: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-12", className)}>
      <div className="mb-4">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-muted-foreground max-w-sm">
          {description}
        </p>
      )}
    </div>
  )
}

// Error state component
interface ErrorStateProps {
  title?: string
  description?: string
  error?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function ErrorState({
  title = "Something went wrong",
  description,
  error,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-12", className)}>
      <div className="mb-4 size-12 rounded-full bg-destructive/10 flex items-center justify-center">
        <svg
          className="size-6 text-destructive"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-muted-foreground max-w-sm mb-2">
          {description}
        </p>
      )}
      {error && (
        <p className="text-sm text-destructive max-w-sm mb-6 font-mono bg-destructive/5 px-3 py-2 rounded">
          {error}
        </p>
      )}
      {action && (
        <Button
          variant="outline"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

export {
  pageLayoutVariants,
  pageHeaderVariants,
  type PageAction,
}