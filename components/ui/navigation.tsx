"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigationVariants = cva(
  "flex",
  {
    variants: {
      orientation: {
        horizontal: "flex-row items-center",
        vertical: "flex-col items-start",
      },
      spacing: {
        tight: "gap-1",
        normal: "gap-2",
        loose: "gap-4",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      spacing: "normal",
    },
  }
)

const navigationItemVariants = cva(
  "inline-flex items-center justify-start text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-md px-3 py-2",
        ghost: "text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md px-3 py-2",
        pill: "text-muted-foreground hover:text-foreground hover:bg-accent rounded-full px-4 py-2",
        underline: "text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-primary pb-1",
        sidebar: "text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-md px-3 py-2 w-full justify-start",
      },
      size: {
        sm: "text-xs px-2 py-1.5 h-7",
        default: "text-sm px-3 py-2 h-9",
        lg: "text-base px-4 py-2.5 h-10",
      },
      active: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        active: true,
        className: "text-foreground bg-accent",
      },
      {
        variant: "ghost", 
        active: true,
        className: "text-foreground bg-accent",
      },
      {
        variant: "pill",
        active: true,
        className: "text-primary-foreground bg-primary",
      },
      {
        variant: "underline",
        active: true,
        className: "text-foreground border-primary",
      },
      {
        variant: "sidebar",
        active: true,
        className: "text-foreground bg-accent",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      active: false,
    },
  }
)

export interface NavigationItem {
  id: string
  label: string
  href?: string
  icon?: React.ReactNode
  badge?: {
    text: string
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
  external?: boolean
  disabled?: boolean
  children?: NavigationItem[]
  onClick?: () => void
}

interface NavigationProps extends VariantProps<typeof navigationVariants> {
  items: NavigationItem[]
  className?: string
  itemClassName?: string
  itemVariant?: VariantProps<typeof navigationItemVariants>["variant"]
  itemSize?: VariantProps<typeof navigationItemVariants>["size"]
  collapsible?: boolean
  showIcons?: boolean
}

export function Navigation({
  items,
  orientation,
  spacing,
  className,
  itemClassName,
  itemVariant = "default",
  itemSize = "default",
  collapsible = false,
  showIcons = true,
}: NavigationProps) {
  const pathname = usePathname()

  const isActive = (item: NavigationItem): boolean => {
    if (item.href === pathname) return true
    if (item.children) {
      return item.children.some(child => isActive(child))
    }
    return false
  }

  const renderItem = (item: NavigationItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const active = isActive(item)

    if (hasChildren && collapsible) {
      return (
        <CollapsibleNavigationItem
          key={item.id}
          item={item}
          variant={itemVariant}
          size={itemSize}
          active={active}
          depth={depth}
          showIcons={showIcons}
          className={itemClassName}
        />
      )
    }

    if (hasChildren && !collapsible) {
      return (
        <DropdownNavigationItem
          key={item.id}
          item={item}
          variant={itemVariant}
          size={itemSize}
          active={active}
          showIcons={showIcons}
          className={itemClassName}
        />
      )
    }

    return (
      <NavigationItemComponent
        key={item.id}
        item={item}
        variant={itemVariant}
        size={itemSize}
        active={active}
        depth={depth}
        showIcons={showIcons}
        className={itemClassName}
      />
    )
  }

  return (
    <nav className={cn(navigationVariants({ orientation, spacing, className }))}>
      {items.map(item => renderItem(item))}
    </nav>
  )
}

interface NavigationItemComponentProps extends VariantProps<typeof navigationItemVariants> {
  item: NavigationItem
  depth?: number
  showIcons?: boolean
  className?: string
}

function NavigationItemComponent({
  item,
  variant,
  size,
  active,
  depth = 0,
  showIcons = true,
  className,
}: NavigationItemComponentProps) {
  const content = (
    <>
      {showIcons && item.icon && (
        <span className="mr-2">{item.icon}</span>
      )}
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <Badge variant={item.badge.variant} className="ml-2 text-xs">
          {item.badge.text}
        </Badge>
      )}
      {item.external && <ExternalLink className="ml-2 size-3" />}
    </>
  )

  const baseClassName = cn(
    navigationItemVariants({ variant, size, active }),
    depth > 0 && "ml-6",
    item.disabled && "pointer-events-none opacity-50",
    className
  )

  if (item.href) {
    return (
      <Link href={item.href} className={baseClassName}>
        {content}
      </Link>
    )
  }

  return (
    <button onClick={item.onClick} className={baseClassName}>
      {content}
    </button>
  )
}

interface CollapsibleNavigationItemProps extends NavigationItemComponentProps {
  item: NavigationItem
}

function CollapsibleNavigationItem({
  item,
  variant,
  size,
  active,
  depth = 0,
  showIcons,
  className,
}: CollapsibleNavigationItemProps) {
  const [isOpen, setIsOpen] = React.useState(active)

  React.useEffect(() => {
    if (active) setIsOpen(true)
  }, [active])

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            navigationItemVariants({ variant, size, active }),
            depth > 0 && "ml-6",
            "w-full justify-between",
            className
          )}
        >
          <div className="flex items-center">
            {showIcons && item.icon && (
              <span className="mr-2">{item.icon}</span>
            )}
            <span>{item.label}</span>
            {item.badge && (
              <Badge variant={item.badge.variant} className="ml-2 text-xs">
                {item.badge.text}
              </Badge>
            )}
          </div>
          {isOpen ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1">
        {item.children?.map(child => (
          <NavigationItemComponent
            key={child.id}
            item={child}
            variant={variant}
            size={size}
            active={isActive(child)}
            depth={depth + 1}
            showIcons={showIcons}
            className={className}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

function DropdownNavigationItem({
  item,
  variant,
  size,
  active,
  showIcons,
  className,
}: NavigationItemComponentProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            navigationItemVariants({ variant, size, active }),
            "gap-1",
            className
          )}
        >
          {showIcons && item.icon && item.icon}
          <span>{item.label}</span>
          {item.badge && (
            <Badge variant={item.badge.variant} className="text-xs">
              {item.badge.text}
            </Badge>
          )}
          <ChevronDown className="size-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {item.children?.map((child, index) => (
          <React.Fragment key={child.id}>
            {index > 0 && child.id.startsWith("separator") && (
              <DropdownMenuSeparator />
            )}
            <DropdownMenuItem asChild disabled={child.disabled}>
              {child.href ? (
                <Link href={child.href} className="flex items-center">
                  {showIcons && child.icon && (
                    <span className="mr-2">{child.icon}</span>
                  )}
                  <span>{child.label}</span>
                  {child.badge && (
                    <Badge variant={child.badge.variant} className="ml-auto text-xs">
                      {child.badge.text}
                    </Badge>
                  )}
                  {child.external && <ExternalLink className="ml-2 size-3" />}
                </Link>
              ) : (
                <button onClick={child.onClick} className="flex items-center w-full">
                  {showIcons && child.icon && (
                    <span className="mr-2">{child.icon}</span>
                  )}
                  <span>{child.label}</span>
                  {child.badge && (
                    <Badge variant={child.badge.variant} className="ml-auto text-xs">
                      {child.badge.text}
                    </Badge>
                  )}
                </button>
              )}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Helper function to check if item is active
function isActive(item: NavigationItem): boolean {
  const pathname = usePathname()
  if (item.href === pathname) return true
  if (item.children) {
    return item.children.some(child => isActive(child))
  }
  return false
}

export { navigationVariants, navigationItemVariants }