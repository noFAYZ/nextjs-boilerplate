"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cva, type VariantProps } from "class-variance-authority"
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Home,
  Wallet,
  BarChart3,
  CreditCard,
  HelpCircle,
  ChevronDown,
  Plus,
  DollarSign,
  TrendingUp,
  Shield,
  Zap,
  Moon,
  Sun,
  Monitor,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const headerVariants = cva(
  "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
  {
    variants: {
      variant: {
        default: "border-border",
        elevated: "shadow-sm border-border/50",
        minimal: "border-transparent",
        glass: "bg-background/50 border-border/30",
      },
      size: {
        sm: "h-12",
        default: "h-14",
        lg: "h-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface NavItem {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
  description?: string
  external?: boolean
  disabled?: boolean
}

interface User {
  name: string
  email: string
  avatar?: string
  plan?: "free" | "pro" | "ultimate"
  balance?: number
}

interface AppHeaderProps extends VariantProps<typeof headerVariants> {
  user?: User
  navigation?: NavItem[]
  showSearch?: boolean
  showNotifications?: boolean
  showThemeToggle?: boolean
  notificationCount?: number
  className?: string
  onSearch?: (query: string) => void
  onNotificationClick?: () => void
  onProfileClick?: () => void
  onSignOut?: () => void
}

const defaultNavigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Financial overview and insights",
  },
  {
    title: "Crypto Wallets",
    href: "/crypto/wallets",
    icon: Wallet,
    description: "Manage cryptocurrency portfolios",
  },
  {
    title: "Accounts",
    href: "/accounts",
    icon: CreditCard,
    description: "Bank accounts and traditional assets",
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    description: "Advanced financial analytics",
  },
]

function Logo({ className }: { className?: string }) {
  return (
    <Link href="/dashboard" className={cn("flex items-center space-x-2", className)}>
      <div className="relative">
        <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
          <DollarSign className="size-4 text-primary-foreground" />
        </div>
        <div className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-emerald-500" />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg leading-none">MoneyMappr</span>
        <span className="text-xs text-muted-foreground leading-none">Financial Dashboard</span>
      </div>
    </Link>
  )
}

function SearchBar({ onSearch, className }: { onSearch?: (query: string) => void; className?: string }) {
  const [query, setQuery] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search transactions, wallets, or assets..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9 pr-4 w-96 max-w-full"
      />
    </form>
  )
}

function NotificationButton({ count, onClick }: { count?: number; onClick?: () => void }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative h-9 w-9 p-0"
            onClick={onClick}
          >
            <Bell className="size-4" />
            {count && count > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                {count > 99 ? "99+" : count}
              </Badge>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {count && count > 0 ? `${count} new notifications` : "No new notifications"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function ThemeToggle() {
  const [theme, setTheme] = React.useState("system")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
          <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 size-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 size-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 size-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function UserMenu({ 
  user, 
  onProfileClick, 
  onSignOut 
}: { 
  user?: User; 
  onProfileClick?: () => void; 
  onSignOut?: () => void 
}) {
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/auth/login">Sign In</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/auth/signup">Sign Up</Link>
        </Button>
      </div>
    )
  }

  const getPlanBadge = (plan?: string) => {
    switch (plan) {
      case "pro":
        return <Badge variant="default" className="bg-blue-500">Pro</Badge>
      case "ultimate":
        return <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500">Ultimate</Badge>
      default:
        return <Badge variant="outline">Free</Badge>
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 pl-2 pr-3">
          <Avatar className="size-7 mr-2">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
          <ChevronDown className="ml-2 size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            {getPlanBadge(user.plan)}
          </div>
          {user.balance !== undefined && (
            <div className="mt-2 pt-2 border-t">
              <p className="text-sm text-muted-foreground">Portfolio Value</p>
              <p className="text-lg font-semibold">${user.balance.toLocaleString()}</p>
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onProfileClick}>
          <User className="mr-2 size-4" />
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Wallet className="mr-2 size-4" />
          Manage Wallets
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Shield className="mr-2 size-4" />
            Security
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <Shield className="mr-2 size-4" />
              Two-Factor Auth
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 size-4" />
              Privacy Settings
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem>
          <TrendingUp className="mr-2 size-4" />
          {user.plan === "free" ? "Upgrade Plan" : "Billing"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <HelpCircle className="mr-2 size-4" />
          Help & Support
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSignOut}>
          <LogOut className="mr-2 size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MobileNav({ navigation }: { navigation: NavItem[] }) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 md:hidden">
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <div className="flex flex-col h-full">
          <div className="pb-4">
            <Logo />
          </div>
          <nav className="flex-1 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {Icon && <Icon className="size-4" />}
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    {item.description && (
                      <div className="text-xs opacity-70">{item.description}</div>
                    )}
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>
          <div className="pt-4 border-t">
            <Button className="w-full" size="sm">
              <Plus className="mr-2 size-4" />
              Add Wallet
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function DesktopNav({ navigation }: { navigation: NavItem[] }) {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        
        return (
          <TooltipProvider key={item.href}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="relative"
                  asChild
                >
                  <Link href={item.href}>
                    {Icon && <Icon className="mr-2 size-4" />}
                    {item.title}
                    {item.badge && (
                      <Badge variant="destructive" className="ml-2 h-5 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
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
      })}
    </nav>
  )
}

export function AppHeader({
  user,
  navigation = defaultNavigation,
  showSearch = true,
  showNotifications = true,
  showThemeToggle = true,
  notificationCount,
  variant,
  size,
  className,
  onSearch,
  onNotificationClick,
  onProfileClick,
  onSignOut,
}: AppHeaderProps) {
  return (
    <header className={cn(headerVariants({ variant, size }), className)}>
      <div className="container flex h-full items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <MobileNav navigation={navigation} />
          <Logo className="hidden md:flex" />
          <DesktopNav navigation={navigation} />
        </div>

        {/* Center Section - Search */}
        {showSearch && (
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <SearchBar onSearch={onSearch} className="w-full" />
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {showSearch && (
            <Button variant="ghost" size="sm" className="lg:hidden h-9 w-9 p-0">
              <Search className="size-4" />
            </Button>
          )}
          
          {showNotifications && (
            <NotificationButton 
              count={notificationCount} 
              onClick={onNotificationClick} 
            />
          )}
          
          {showThemeToggle && <ThemeToggle />}
          
          <UserMenu 
            user={user}
            onProfileClick={onProfileClick}
            onSignOut={onSignOut}
          />
        </div>
      </div>
    </header>
  )
}

export { headerVariants }
export type { AppHeaderProps, NavItem, User }