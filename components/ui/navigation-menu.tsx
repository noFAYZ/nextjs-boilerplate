import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Root
function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

// List
const NavigationMenuList = ({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) => (
  <NavigationMenuPrimitive.List
    data-slot="navigation-menu-list"
    className={cn("group flex flex-1 list-none items-center justify-center gap-0.5", className)}
    {...props}
  />
)

// Item
const NavigationMenuItem = ({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) => (
  <NavigationMenuPrimitive.Item
    data-slot="navigation-menu-item"
    className={cn("relative", className)}
    {...props}
  />
)

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-2 py-2 text-sm font-medium  disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
)

// Trigger
const NavigationMenuTrigger = ({
  className,
  children,

  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) => (
  <NavigationMenuPrimitive.Trigger
    data-slot="navigation-menu-trigger"
    className={cn(navigationMenuTriggerStyle(), className)}
    {...props}
  >
    {children}
    <ChevronDownIcon
      className="relative top-[1px] ml-1 size-3 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
)

// Content (cleaned)
const NavigationMenuContent = ({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) => (
  <NavigationMenuPrimitive.Content
    data-slot="navigation-menu-content"
    className={cn(
      "top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto",
      "group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground",
      "group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow",
      className
    )}
    {...props}
  />
)

// Viewport (animations removed)
const NavigationMenuViewport = ({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) => (
  <div className="absolute top-[120%] left-0 isolate z-50 flex justify-center">
    <NavigationMenuPrimitive.Viewport
      data-slot="navigation-menu-viewport"
      className={cn(
        "origin-top-center bg-popover text-popover-foreground relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-3xl border shadow md:w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      {...props}
    />
  </div>
)

// Link
const NavigationMenuLink = ({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) => (
  <NavigationMenuPrimitive.Link
    data-slot="navigation-menu-link"
    className={cn(
      "data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex flex-col gap-1 rounded-2xl p-2 text-sm  outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
      className
    )}
    {...props}
  />
)

// Indicator (no animations)
const NavigationMenuIndicator = ({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) => (
  <NavigationMenuPrimitive.Indicator
    data-slot="navigation-menu-indicator"
    className={cn("top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden", className)}
    {...props}
  >
    <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
  </NavigationMenuPrimitive.Indicator>
)

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
 NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
