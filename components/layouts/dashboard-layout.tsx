"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarNav,
  SidebarSection,
  useSidebar,
} from "@/components/ui/sidebar"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/theme-switcher"
import { NotificationCenter } from "@/components/ui/notification"
import type { NavigationItem } from "@/components/ui/navigation"
import type { Notification } from "@/components/ui/notification"

const dashboardLayoutVariants = cva(
  "flex h-screen bg-background",
  {
    variants: {
      variant: {
        default: "",
        compact: "",
        full: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const headerVariants = cva(
  "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
  {
    variants: {
      variant: {
        default: "",
        floating: "mx-4 mt-4 rounded-lg border shadow-sm",
        minimal: "border-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const mainContentVariants = cva(
  "flex-1 overflow-auto",
  {
    variants: {
      padding: {
        none: "",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      padding: "default",
    },
  }
)

interface User {
  name: string
  email: string
  avatar?: string
  role?: string
  plan?: string
}

interface DashboardLayoutProps extends VariantProps<typeof dashboardLayoutVariants> {
  children: React.ReactNode
  navigation: NavigationItem[]
  user?: User
  notifications?: Notification[]
  headerContent?: React.ReactNode
  sidebarFooter?: React.ReactNode
  onUserMenuAction?: (action: string) => void
  className?: string
  headerVariant?: VariantProps<typeof headerVariants>["variant"]
  contentPadding?: VariantProps<typeof mainContentVariants>["padding"]
  showBreadcrumbs?: boolean
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export function DashboardLayout({
  children,
  navigation,
  user,
  notifications = [],
  headerContent,
  sidebarFooter,
  onUserMenuAction,
  variant,
  className,
  headerVariant = "default",
  contentPadding = "default",
  showBreadcrumbs = false,
  breadcrumbs = [],
}: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultCollapsed={false} collapsible={true}>
      <div className={cn(dashboardLayoutVariants({ variant, className }))}>
        {/* Sidebar */}
        <Sidebar variant="default" size="default">
          <SidebarHeader showToggle={true}>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <span className="font-semibold">MoneyMappr</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarNav items={navigation} />
          </SidebarContent>
          
          {sidebarFooter && (
            <SidebarFooter>
              {sidebarFooter}
            </SidebarFooter>
          )}
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <DashboardHeader
            variant={headerVariant}
            user={user}
            notifications={notifications}
            onUserMenuAction={onUserMenuAction}
            showBreadcrumbs={showBreadcrumbs}
            breadcrumbs={breadcrumbs}
          >
            {headerContent}
          </DashboardHeader>

          {/* Content */}
          <main className={cn(mainContentVariants({ padding: contentPadding }))}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

interface DashboardHeaderProps {
  variant?: VariantProps<typeof headerVariants>["variant"]
  user?: User
  notifications?: Notification[]
  onUserMenuAction?: (action: string) => void
  showBreadcrumbs?: boolean
  breadcrumbs?: Array<{ label: string; href?: string }>
  children?: React.ReactNode
}

function DashboardHeader({
  variant,
  user,
  notifications = [],
  onUserMenuAction,
  showBreadcrumbs = false,
  breadcrumbs = [],
  children,
}: DashboardHeaderProps) {
  const { collapsed } = useSidebar()

  return (
    <header className={cn(headerVariants({ variant }))}>
      <Container size="full" padding="sm">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Breadcrumbs or Title */}
          <div className="flex items-center gap-4">
            {showBreadcrumbs && breadcrumbs.length > 0 && (
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
            {children}
          </div>

          {/* Right side - Actions and User Menu */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {/* Notifications */}
            {notifications.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
                    <span className="sr-only">View notifications</span>
                    <svg
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-5-5V4a2 2 0 00-2-2H6a2 2 0 00-2 2v8l-5 5h5m0 0v1a3 3 0 006 0v-1m-6 0h6"
                      />
                    </svg>
                    {notifications.filter(n => !n.read).length > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                      >
                        {notifications.filter(n => !n.read).length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0">
                  <NotificationCenter notifications={notifications} />
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      {user.plan && (
                        <Badge variant="secondary" className="w-fit text-xs">
                          {user.plan}
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onUserMenuAction?.("profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUserMenuAction?.("settings")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUserMenuAction?.("billing")}>
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onUserMenuAction?.("logout")}
                    className="text-destructive focus:text-destructive"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </Container>
    </header>
  )
}

// Simple Layout (no sidebar)
interface SimpleLayoutProps {
  children: React.ReactNode
  header?: React.ReactNode
  className?: string
  contentPadding?: VariantProps<typeof mainContentVariants>["padding"]
}

export function SimpleLayout({
  children,
  header,
  className,
  contentPadding = "default",
}: SimpleLayoutProps) {
  return (
    <div className={cn("flex h-screen flex-col bg-background", className)}>
      {header && (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {header}
        </header>
      )}
      <main className={cn(mainContentVariants({ padding: contentPadding }))}>
        {children}
      </main>
    </div>
  )
}

// Auth Layout (for login, signup, etc.)
interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  showLogo?: boolean
  className?: string
}

export function AuthLayout({
  children,
  title,
  description,
  showLogo = true,
  className,
}: AuthLayoutProps) {
  return (
    <div className={cn("flex min-h-screen flex-col items-center justify-center bg-background px-4", className)}>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        {showLogo && (
          <div className="flex flex-col space-y-2 text-center">
            <div className="mx-auto size-12 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">M</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              MoneyMappr
            </h1>
          </div>
        )}
        
        {(title || description) && (
          <div className="flex flex-col space-y-2 text-center">
            {title && (
              <h2 className="text-2xl font-semibold tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        
        {children}
      </div>
    </div>
  )
}

export { dashboardLayoutVariants, headerVariants, mainContentVariants }