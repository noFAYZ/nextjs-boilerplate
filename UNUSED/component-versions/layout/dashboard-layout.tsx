"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { AppHeader, type AppHeaderProps } from "./app-header"
import { AppSidebar, type AppSidebarProps } from "./app-sidebar"
import { Button } from "@/components/ui/button"
import { PanelLeft, PanelLeftClose } from "lucide-react"

const layoutVariants = cva(
  "min-h-screen bg-background",
  {
    variants: {
      variant: {
        default: "",
        fullwidth: "",
        centered: "max-w-7xl mx-auto",
      },
      sidebarPosition: {
        left: "flex",
        right: "flex flex-row-reverse",
        none: "",
      },
      spacing: {
        none: "",
        sm: "p-2",
        default: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      sidebarPosition: "left",
      spacing: "default",
    },
  }
)

interface DashboardLayoutProps extends VariantProps<typeof layoutVariants> {
  children: React.ReactNode
  header?: AppHeaderProps
  sidebar?: AppSidebarProps
  showHeader?: boolean
  showSidebar?: boolean
  sidebarCollapsible?: boolean
  className?: string
}

interface LayoutContextType {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
}

const LayoutContext = React.createContext<LayoutContextType | undefined>(undefined)

export function useLayout() {
  const context = React.useContext(LayoutContext)
  if (!context) {
    throw new Error("useLayout must be used within a DashboardLayout")
  }
  return context
}

export function DashboardLayout({
  children,
  header,
  sidebar,
  showHeader = true,
  showSidebar = true,
  sidebarCollapsible = true,
  variant,
  sidebarPosition,
  spacing,
  className,
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  const toggleSidebar = React.useCallback(() => {
    setSidebarCollapsed(prev => !prev)
  }, [])

  const contextValue = React.useMemo(() => ({
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar,
  }), [sidebarCollapsed, toggleSidebar])

  return (
    <LayoutContext.Provider value={contextValue}>
      <div className={cn(layoutVariants({ variant, sidebarPosition, spacing }), className)}>
        {/* Sidebar */}
        {showSidebar && sidebarPosition !== "none" && (
          <AppSidebar
            {...sidebar}
            collapsed={sidebarCollapsed}
            className={cn(
              "sticky top-0 h-screen",
              sidebarPosition === "right" && "order-2"
            )}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          {showHeader && (
            <AppHeader
              {...header}
              className={cn(
                "sticky top-0 z-40",
                header?.className
              )}
            />
          )}

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <div className={cn(
              "container mx-auto",
              spacing === "none" ? "" : 
              spacing === "sm" ? "p-2" :
              spacing === "lg" ? "p-6" : "p-4"
            )}>
              {children}
            </div>
          </main>
        </div>

        {/* Sidebar Toggle Button (when collapsible) */}
        {showSidebar && sidebarCollapsible && (
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "fixed bottom-4 z-50 md:hidden",
              sidebarPosition === "left" ? "left-4" : "right-4"
            )}
            onClick={toggleSidebar}
          >
            {sidebarCollapsed ? <PanelLeft className="size-4" /> : <PanelLeftClose className="size-4" />}
          </Button>
        )}
      </div>
    </LayoutContext.Provider>
  )
}

// Simple page wrapper for consistent spacing
export function PageContainer({
  children,
  className,
  maxWidth = "7xl",
}: {
  children: React.ReactNode
  className?: string
  maxWidth?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl"
}) {
  return (
    <div className={cn(
      "mx-auto w-full",
      maxWidth === "none" ? "" :
      maxWidth === "sm" ? "max-w-sm" :
      maxWidth === "md" ? "max-w-md" :
      maxWidth === "lg" ? "max-w-lg" :
      maxWidth === "xl" ? "max-w-xl" :
      maxWidth === "2xl" ? "max-w-2xl" :
      maxWidth === "3xl" ? "max-w-3xl" :
      maxWidth === "4xl" ? "max-w-4xl" :
      maxWidth === "5xl" ? "max-w-5xl" :
      maxWidth === "6xl" ? "max-w-6xl" : "max-w-7xl",
      className
    )}>
      {children}
    </div>
  )
}

// Page header component
export function PageHeader({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  )
}

// Content sections
export function PageSection({
  title,
  description,
  children,
  className,
  headerClassName,
}: {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  headerClassName?: string
}) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className={cn("space-y-1", headerClassName)}>
          {title && (
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

// Grid layouts
export function PageGrid({
  children,
  columns = 1,
  gap = "default",
  className,
}: {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: "none" | "sm" | "default" | "lg"
  className?: string
}) {
  return (
    <div className={cn(
      "grid",
      columns === 1 ? "grid-cols-1" :
      columns === 2 ? "grid-cols-1 md:grid-cols-2" :
      columns === 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" :
      columns === 4 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" :
      columns === 5 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" :
      "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
      gap === "none" ? "gap-0" :
      gap === "sm" ? "gap-2" :
      gap === "lg" ? "gap-8" : "gap-4",
      className
    )}>
      {children}
    </div>
  )
}

export { layoutVariants }
export type { DashboardLayoutProps }