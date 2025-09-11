"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, Menu, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Navigation, type NavigationItem } from "@/components/ui/navigation"
import { Separator } from "@/components/ui/separator"

const sidebarVariants = cva(
  "flex h-full flex-col border-r bg-background transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "border-border",
        floating: "mx-4 my-4 rounded-lg border shadow-lg",
        minimal: "border-none",
      },
      size: {
        sm: "w-48",
        default: "w-64",
        lg: "w-72",
        xl: "w-80",
      },
      collapsible: {
        true: "",
        false: "",
      },
      collapsed: {
        true: "w-16",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      collapsible: false,
      collapsed: false,
    },
  }
)

const sidebarContext = React.createContext<{
  collapsed: boolean
  collapsible: boolean
  toggle: () => void
  expand: () => void
  collapse: () => void
}>({
  collapsed: false,
  collapsible: false,
  toggle: () => {},
  expand: () => {},
  collapse: () => {},
})

export const useSidebar = () => {
  const context = React.useContext(sidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultCollapsed?: boolean
  collapsible?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

export function SidebarProvider({
  children,
  defaultCollapsed = false,
  collapsible = true,
  onCollapsedChange,
}: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)

  const toggle = React.useCallback(() => {
    const newState = !collapsed
    setCollapsed(newState)
    onCollapsedChange?.(newState)
  }, [collapsed, onCollapsedChange])

  const expand = React.useCallback(() => {
    setCollapsed(false)
    onCollapsedChange?.(false)
  }, [onCollapsedChange])

  const collapse = React.useCallback(() => {
    setCollapsed(true) 
    onCollapsedChange?.(true)
  }, [onCollapsedChange])

  return (
    <sidebarContext.Provider
      value={{
        collapsed,
        collapsible,
        toggle,
        expand,
        collapse,
      }}
    >
      {children}
    </sidebarContext.Provider>
  )
}

interface SidebarProps extends VariantProps<typeof sidebarVariants> {
  className?: string
  children?: React.ReactNode
}

export function Sidebar({ 
  className, 
  variant, 
  size, 
  collapsible: collapsibleProp,
  children,
  ...props 
}: SidebarProps) {
  const { collapsed, collapsible } = useSidebar()
  const effectiveCollapsible = collapsibleProp ?? collapsible

  return (
    <aside
      className={cn(
        sidebarVariants({ 
          variant, 
          size: collapsed ? "sm" : size, 
          collapsible: effectiveCollapsible,
          collapsed,
          className 
        })
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

interface SidebarHeaderProps {
  children: React.ReactNode
  className?: string
  showToggle?: boolean
}

export function SidebarHeader({ 
  children, 
  className,
  showToggle = true,
}: SidebarHeaderProps) {
  const { collapsed, collapsible, toggle } = useSidebar()

  return (
    <div className={cn("flex h-16 items-center px-4 border-b", className)}>
      <div className="flex items-center justify-between w-full">
        {!collapsed && (
          <div className="flex items-center gap-2 font-semibold">
            {children}
          </div>
        )}
        
        {collapsible && showToggle && (
          <Button
            variant="ghost"
            size="sm" 
            onClick={toggle}
            className={cn("h-8 w-8 p-0", collapsed && "mx-auto")}
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

interface SidebarContentProps {
  children: React.ReactNode
  className?: string
}

export function SidebarContent({ children, className }: SidebarContentProps) {
  return (
    <div className={cn("flex-1 overflow-auto p-4", className)}>
      {children}
    </div>
  )
}

interface SidebarFooterProps {
  children: React.ReactNode
  className?: string
}

export function SidebarFooter({ children, className }: SidebarFooterProps) {
  return (
    <div className={cn("border-t p-4", className)}>
      {children}
    </div>
  )
}

interface SidebarNavProps {
  items: NavigationItem[]
  className?: string
}

export function SidebarNav({ items, className }: SidebarNavProps) {
  const { collapsed } = useSidebar()

  return (
    <div className={cn("space-y-1", className)}>
      <Navigation
        items={items}
        orientation="vertical"
        itemVariant="sidebar"
        collapsible={!collapsed}
        showIcons={true}
      />
    </div>
  )
}

interface SidebarSectionProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function SidebarSection({ title, children, className }: SidebarSectionProps) {
  const { collapsed } = useSidebar()

  return (
    <div className={cn("space-y-2", className)}>
      {title && !collapsed && (
        <h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h4>
      )}
      {children}
    </div>
  )
}

// Mobile Sidebar Overlay
interface MobileSidebarProps extends SidebarProps {
  open: boolean
  onClose: () => void
  trigger?: React.ReactNode
}

export function MobileSidebar({
  open,
  onClose,
  trigger,
  children,
  className,
  ...props
}: MobileSidebarProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    
    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [open, onClose])

  return (
    <>
      {/* Trigger */}
      {trigger}
      
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed left-0 top-0 h-full">
            <Sidebar
              className={cn("h-full shadow-lg", className)}
              {...props}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2 font-semibold">
                  {/* Logo/Title would go here */}
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="size-4" />
                </Button>
              </div>
              {children}
            </Sidebar>
          </div>
        </div>
      )}
    </>
  )
}

// Default Mobile Trigger
export function SidebarTrigger({ className }: { className?: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("h-9 w-9 p-0 lg:hidden", className)}
    >
      <Menu className="size-4" />
    </Button>
  )
}

export { sidebarVariants }