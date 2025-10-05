"use client"

import * as React from "react"
import { Search, ChevronRight, Hash, File, Settings, Users, Zap, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface CommandItem {
  id: string
  title: string
  description?: string
  keywords?: string[]
  icon?: React.ReactNode
  shortcut?: string[]
  category: string
  action?: () => void
  href?: string
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items?: CommandItem[]
  placeholder?: string
  emptyMessage?: string
  className?: string
}

const defaultItems: CommandItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "View your financial overview",
    icon: <Hash className="size-4" />,
    category: "Navigation",
    keywords: ["home", "overview", "summary"],
    shortcut: ["⌘", "1"],
    href: "/dashboard",
  },
  {
    id: "wallets",
    title: "Crypto Wallets",
    description: "Manage your cryptocurrency wallets",
    icon: <Sparkles className="size-4" />,
    category: "Navigation", 
    keywords: ["crypto", "bitcoin", "ethereum", "wallet"],
    shortcut: ["⌘", "2"],
    href: "/dashboard/accounts/wallet",
  },
  {
    id: "groups",
    title: "Account Groups",
    description: "Organize accounts into groups",
    icon: <Users className="size-4" />,
    category: "Navigation",
    keywords: ["groups", "organize", "accounts"],
    shortcut: ["⌘", "3"],
    href: "/dashboard/accounts/groups",
  },
  {
    id: "portfolios",
    title: "Portfolios",
    description: "View portfolio analytics and charts",
    icon: <File className="size-4" />,
    category: "Navigation",
    keywords: ["portfolio", "analytics", "charts", "performance"],
    shortcut: ["⌘", "4"],
    href: "/dashboard/portfolios",
  },
  {
    id: "subscription",
    title: "Subscription",
    description: "Manage your subscription plan",
    icon: <Sparkles className="size-4" />,
    category: "Navigation",
    keywords: ["subscription", "plan", "billing", "upgrade"],
    shortcut: ["⌘", "5"],
    href: "/dashboard/subscription",
  },
  {
    id: "add-wallet",
    title: "Add Wallet",
    description: "Connect a new cryptocurrency wallet",
    icon: <Sparkles className="size-4" />,
    category: "Actions",
    keywords: ["add", "new", "wallet", "connect"],
    shortcut: ["⌘", "N"],
    href: "/dashboard/accounts/wallet/add",
  },
  {
    id: "settings",
    title: "Settings",
    description: "Configure your account preferences",
    icon: <Settings className="size-4" />,
    category: "Preferences",
    keywords: ["config", "preferences", "profile"],
    shortcut: ["⌘", ","],
    href: "/dashboard/settings",
  },
  {
    id: "profile",
    title: "Profile",
    description: "Edit your profile information",
    icon: <Users className="size-4" />,
    category: "Preferences",
    keywords: ["profile", "account", "personal"],
    href: "/dashboard/profile",
  },
  {
    id: "theme",
    title: "Toggle Theme",
    description: "Switch between light and dark mode",
    icon: <Zap className="size-4" />,
    category: "Preferences",
    keywords: ["dark", "light", "mode", "appearance"],
    shortcut: ["⌘", "T"],
    action: () => {
      document.documentElement.classList.toggle("dark")
    },
  },
]

export function CommandPalette({
  open,
  onOpenChange,
  items = defaultItems,
  placeholder = "Type a command or search...",
  emptyMessage = "No results found.",
  className,
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Filter items based on query
  const filteredItems = React.useMemo(() => {
    if (!query) return items

    const normalizedQuery = query.toLowerCase()
    return items.filter(item => {
      const searchText = [
        item.title,
        item.description,
        ...(item.keywords || [])
      ].join(" ").toLowerCase()
      
      return searchText.includes(normalizedQuery)
    })
  }, [items, query])

  // Group filtered items by category
  const groupedItems = React.useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}
    
    filteredItems.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = []
      }
      groups[item.category].push(item)
    })
    
    return groups
  }, [filteredItems])

  // Reset selection when items change
  React.useEffect(() => {
    setSelectedIndex(0)
  }, [filteredItems])

  // Focus input when opened
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0)
      setQuery("")
      setSelectedIndex(0)
    }
  }, [open])

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex(prev => 
            Math.min(prev + 1, filteredItems.length - 1)
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case "Enter":
          e.preventDefault()
          const selectedItem = filteredItems[selectedIndex]
          if (selectedItem) {
            handleItemSelect(selectedItem)
          }
          break
        case "Escape":
          onOpenChange(false)
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, filteredItems, selectedIndex, onOpenChange])

  const handleItemSelect = (item: CommandItem) => {
    if (item.action) {
      item.action()
    } else if (item.href) {
      window.location.href = item.href
    }
    onOpenChange(false)
  }

  const renderShortcut = (shortcut: string[]) => (
    <div className="flex items-center gap-1">
      {shortcut.map((key, index) => (
        <kbd key={index} className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          {key}
        </kbd>
      ))}
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("overflow-hidden p-0 shadow-2xl max-w-2xl", className)}>
        <div className="flex flex-col max-h-[600px]">
          {/* Header */}
          <DialogTitle className="sr-only">Command Palette</DialogTitle>
          <div className="flex items-center border-b px-4 py-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              ref={inputRef}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="py-14 px-4 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            ) : (
              <div className="py-2">
                {Object.entries(groupedItems).map(([category, categoryItems]) => (
                  <div key={category}>
                    <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {category}
                    </div>
                    {categoryItems.map((item, categoryIndex) => {
                      const globalIndex = filteredItems.indexOf(item)
                      const isSelected = globalIndex === selectedIndex
                      
                      return (
                        <div
                          key={item.id}
                          className={cn(
                            "flex cursor-pointer select-none items-center px-4 py-3 text-sm outline-none transition-colors",
                            isSelected 
                              ? "bg-accent text-accent-foreground" 
                              : "hover:bg-accent/50"
                          )}
                          onClick={() => handleItemSelect(item)}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {item.icon && (
                              <div className="flex-shrink-0 text-muted-foreground">
                                {item.icon}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">
                                {item.title}
                              </div>
                              {item.description && (
                                <div className="text-muted-foreground text-xs truncate mt-0.5">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {item.shortcut && renderShortcut(item.shortcut)}
                            <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-4 py-2 text-xs text-muted-foreground bg-muted/30">
            <div className="flex items-center justify-between">
              <span>Navigate with ↑↓ arrows</span>
              <span>Press Enter to select</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook to manage command palette state
export function useCommandPalette() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return {
    open,
    setOpen,
    toggle: () => setOpen(open => !open),
  }
}

export type { CommandItem, CommandPaletteProps }