"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cva, type VariantProps } from "class-variance-authority"
import {
  Home,
  Wallet,
  BarChart3,
  CreditCard,
  Settings,
  HelpCircle,
  Users,
  FileText,
  Target,
  TrendingUp,
  DollarSign,
  Activity,
  PieChart,
  Calendar,
  Bell,
  Shield,
  Download,
  Upload,
  Plus,
  ChevronDown,
  ChevronRight,
  Zap,
  Star,
  Globe,
  Smartphone,
  MonitorSpeaker,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const sidebarVariants = cva(
  "flex flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
  {
    variants: {
      variant: {
        default: "border-border",
        floating: "m-2 rounded-lg border shadow-sm",
        minimal: "border-transparent",
        glass: "bg-background/50 border-border/30",
      },
      size: {
        sm: "w-12",
        default: "w-64",
        lg: "w-72",
        xl: "w-80",
      },
      collapsed: {
        true: "w-12",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      collapsed: false,
    },
  }
)

interface SidebarNavItem {
  title: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
  description?: string
  disabled?: boolean
  external?: boolean
  children?: SidebarNavItem[]
}

interface QuickAction {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  onClick?: () => void
  variant?: "default" | "primary" | "secondary"
}

interface SidebarStats {
  totalValue: number
  change24h: number
  change24hPercent: number
  topAsset: {
    symbol: string
    logo?: string
    value: number
    change: number
  }
}

interface AppSidebarProps extends VariantProps<typeof sidebarVariants> {
  navigation?: SidebarNavItem[]
  quickActions?: QuickAction[]
  stats?: SidebarStats
  showStats?: boolean
  showQuickActions?: boolean
  className?: string
  onNavigate?: (href: string) => void
}

const defaultNavigation: SidebarNavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Overview and insights",
  },
  {
    title: "Crypto Wallets",
    icon: Wallet,
    children: [
      { title: "All Wallets", href: "/crypto/wallets", icon: Wallet },
      { title: "Add Wallet", href: "/crypto/wallets/add", icon: Plus },
      { title: "Import/Export", href: "/crypto/import-export", icon: Download },
    ],
  },
  {
    title: "Accounts",
    icon: CreditCard,
    children: [
      { title: "All Accounts", href: "/accounts", icon: CreditCard },
      { title: "Account Groups", href: "/accounts/groups", icon: Users },
      { title: "Add Account", href: "/accounts/add", icon: Plus },
    ],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    children: [
      { title: "Portfolio Analytics", href: "/analytics", icon: PieChart },
      { title: "Performance", href: "/analytics/performance", icon: TrendingUp },
      { title: "Reports", href: "/analytics/reports", icon: FileText },
    ],
  },
  {
    title: "Goals & Planning",
    href: "/goals",
    icon: Target,
    description: "Financial goals and planning",
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar,
    description: "Events and reminders",
  },
  {
    title: "Settings",
    icon: Settings,
    children: [
      { title: "Profile", href: "/settings/profile", icon: Users },
      { title: "Security", href: "/settings/security", icon: Shield },
      { title: "Notifications", href: "/settings/notifications", icon: Bell },
      { title: "Import/Export", href: "/settings/import-export", icon: Upload },
    ],
  },
  {
    title: "Help & Support",
    href: "/help",
    icon: HelpCircle,
    description: "Documentation and support",
  },
]

const defaultQuickActions: QuickAction[] = [
  {
    title: "Add Wallet",
    description: "Connect a crypto wallet",
    icon: Plus,
    href: "/crypto/wallets/add",
    variant: "primary",
  },
  {
    title: "Import Data",
    description: "Import transactions",
    icon: Upload,
    href: "/settings/import-export",
    variant: "secondary",
  },
  {
    title: "View Reports",
    description: "Generate analytics",
    icon: FileText,
    href: "/analytics/reports",
    variant: "default",
  },
]

function SidebarLogo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <div className="relative">
        <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
          <DollarSign className="size-4 text-primary-foreground" />
        </div>
        <div className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-emerald-500" />
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-none">MoneyMappr</span>
          <span className="text-xs text-muted-foreground leading-none">Dashboard</span>
        </div>
      )}
    </div>
  )
}

function SidebarStats({ stats, collapsed }: { stats: SidebarStats; collapsed: boolean }) {
  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-2 py-3">
              <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                <TrendingUp className="size-4" />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <div className="space-y-1">
              <p className="font-medium">${stats.totalValue.toLocaleString()}</p>
              <p className={cn(
                "text-sm",
                stats.change24hPercent >= 0 ? "text-emerald-600" : "text-red-600"
              )}>
                {stats.change24hPercent >= 0 ? "+" : ""}{stats.change24hPercent.toFixed(2)}%
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="px-3 py-4 space-y-3">
      <div>
        <p className="text-sm text-muted-foreground">Portfolio Value</p>
        <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
        <div className="flex items-center gap-1">
          <span className={cn(
            "text-sm font-medium",
            stats.change24hPercent >= 0 ? "text-emerald-600" : "text-red-600"
          )}>
            {stats.change24hPercent >= 0 ? "+" : ""}{stats.change24hPercent.toFixed(2)}%
          </span>
          <span className="text-sm text-muted-foreground">
            (${Math.abs(stats.change24h).toLocaleString()})
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
        <Avatar className="size-8">
          <AvatarImage src={stats.topAsset.logo} />
          <AvatarFallback>{stats.topAsset.symbol}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{stats.topAsset.symbol}</p>
          <p className="text-xs text-muted-foreground">
            ${stats.topAsset.value.toLocaleString()}
          </p>
        </div>
        <div className={cn(
          "text-xs font-medium",
          stats.topAsset.change >= 0 ? "text-emerald-600" : "text-red-600"
        )}>
          {stats.topAsset.change >= 0 ? "+" : ""}{stats.topAsset.change.toFixed(1)}%
        </div>
      </div>
    </div>
  )
}

function SidebarNavItem({ 
  item, 
  collapsed, 
  level = 0 
}: { 
  item: SidebarNavItem; 
  collapsed: boolean; 
  level?: number 
}) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const hasChildren = item.children && item.children.length > 0
  const isActive = item.href ? pathname === item.href : false
  const hasActiveChild = hasChildren && item.children?.some(child => pathname === child.href)

  React.useEffect(() => {
    if (hasActiveChild) {
      setIsOpen(true)
    }
  }, [hasActiveChild])

  if (collapsed && hasChildren) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-2 py-1">
              <Button
                variant={isActive || hasActiveChild ? "secondary" : "ghost"}
                size="sm"
                className="w-8 h-8 p-0"
              >
                {item.icon && <item.icon className="size-4" />}
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <div>
              <p className="font-medium">{item.title}</p>
              {item.children && (
                <div className="mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href || "#"}
                      className="block text-sm text-muted-foreground hover:text-foreground"
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-2 py-1">
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className="w-8 h-8 p-0"
                asChild={!!item.href}
              >
                {item.href ? (
                  <Link href={item.href}>
                    {item.icon && <item.icon className="size-4" />}
                  </Link>
                ) : (
                  <>
                    {item.icon && <item.icon className="size-4" />}
                  </>
                )}
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <div>
              <p className="font-medium">{item.title}</p>
              {item.description && (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (hasChildren) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant={hasActiveChild ? "secondary" : "ghost"}
            className="w-full justify-start gap-2 px-3"
            style={{ paddingLeft: `${12 + level * 16}px` }}
          >
            {item.icon && <item.icon className="size-4" />}
            <span className="flex-1 text-left">{item.title}</span>
            <ChevronRight className={cn(
              "size-4 transition-transform",
              isOpen && "rotate-90"
            )} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {item.children?.map((child) => (
            <SidebarNavItem
              key={child.href || child.title}
              item={child}
              collapsed={false}
              level={level + 1}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start gap-2 px-3"
      style={{ paddingLeft: `${12 + level * 16}px` }}
      asChild={!!item.href}
      disabled={item.disabled}
    >
      {item.href ? (
        <Link href={item.href}>
          {item.icon && <item.icon className="size-4" />}
          <span className="flex-1 text-left">{item.title}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {item.badge}
            </Badge>
          )}
        </Link>
      ) : (
        <>
          {item.icon && <item.icon className="size-4" />}
          <span className="flex-1 text-left">{item.title}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </Button>
  )
}

function SidebarQuickActions({ actions, collapsed }: { actions: QuickAction[]; collapsed: boolean }) {
  if (collapsed) {
    return (
      <div className="px-2 space-y-2">
        {actions.slice(0, 1).map((action) => (
          <TooltipProvider key={action.title}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={action.onClick}
                  asChild={!!action.href}
                >
                  {action.href ? (
                    <Link href={action.href}>
                      <action.icon className="size-4" />
                    </Link>
                  ) : (
                    <action.icon className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div>
                  <p className="font-medium">{action.title}</p>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    )
  }

  return (
    <div className="px-3 space-y-2">
      <p className="text-sm font-medium text-muted-foreground">Quick Actions</p>
      <div className="space-y-1">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant={action.variant === "primary" ? "default" : action.variant === "secondary" ? "secondary" : "ghost"}
            size="sm"
            className="w-full justify-start gap-2"
            onClick={action.onClick}
            asChild={!!action.href}
          >
            {action.href ? (
              <Link href={action.href}>
                <action.icon className="size-4" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{action.title}</span>
                  <span className="text-xs text-muted-foreground">{action.description}</span>
                </div>
              </Link>
            ) : (
              <>
                <action.icon className="size-4" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{action.title}</span>
                  <span className="text-xs text-muted-foreground">{action.description}</span>
                </div>
              </>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}

export function AppSidebar({
  navigation = defaultNavigation,
  quickActions = defaultQuickActions,
  stats,
  showStats = true,
  showQuickActions = true,
  variant,
  size,
  collapsed,
  className,
  onNavigate,
}: AppSidebarProps) {
  const isCollapsed = collapsed || size === "sm"

  return (
    <aside className={cn(sidebarVariants({ variant, size, collapsed }), className)}>
      {/* Logo */}
      <div className="p-2">
        <SidebarLogo collapsed={isCollapsed} />
      </div>

      <Separator />

      {/* Stats */}
      {showStats && stats && (
        <>
          <SidebarStats stats={stats} collapsed={isCollapsed} />
          <Separator />
        </>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2">
        <nav className="space-y-1 py-2">
          {navigation.map((item) => (
            <SidebarNavItem
              key={item.href || item.title}
              item={item}
              collapsed={isCollapsed}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* Quick Actions */}
      {showQuickActions && quickActions.length > 0 && (
        <>
          <Separator />
          <div className="p-2">
            <SidebarQuickActions actions={quickActions} collapsed={isCollapsed} />
          </div>
        </>
      )}

      {/* Footer */}
      {!isCollapsed && (
        <>
          <Separator />
          <div className="p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className="size-3" />
              <span>Pro Plan</span>
              <Star className="size-3 text-yellow-500" />
            </div>
          </div>
        </>
      )}
    </aside>
  )
}

export { sidebarVariants }
export type { AppSidebarProps, SidebarNavItem, QuickAction, SidebarStats }