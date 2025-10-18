"use client"
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight, CheckCircle, Circle, ArrowRight, Star, Bell, Settings, Home, User, Search, Heart } from "lucide-react"

const tabsListVariants = cva(
  "inline-flex items-center justify-center gap-2 w-fit",
  {
    variants: {
      variant: {
        default: "bg-muted rounded-lg p-1",
        floating: " shadow-lg rounded-xl p-2 border border-border",
        segmented: "bg-muted rounded-lg p-1",
        outline: "bg-background border rounded-xl p-1 border-border",
        steps: "bg-transparent",
        accent: " rounded-xl p-1 shadow-sm",
        sidebar: "bg-transparent flex-col w-fit",
        card: "bg-muted rounded-xl p-0.5 shadow-sm border",
        minimal: "bg-transparent border-b border-border",
        ghost: "bg-muted/70 rounded-2xl p-1",
        pill: "bg-transparent rounded-full p-1",
        badge: "bg-transparent rounded-lg p-1",
        progress: "bg-muted rounded-lg p-1",
        animated: "bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-1",
        // New innovative variants
        floatingAction: " shadow-xl rounded-2xl p-3 ",
        iconOnly: "bg-transparent rounded-full p-2",
        stacked: "bg-accent rounded-lg p-2 shadow-sm",
        timeline: "bg-transparent flex-col w-fit",
        glass: "bg-muted backdrop-blur-md rounded-xl p-2 border border-white/10",
        hologram: "bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 rounded-xl p-1 border border-white/10",
        cyber: "bg-orange-100/50 border border-amber-500/30 rounded-none p-1",
      },
      size: {
        sm: "text-xs",
        default: "text-sm", 
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const tabsTriggerVariants = cva(
  "inline-flex items-center  gap-2 font-medium whitespace-nowrap transition-all duration-100 ease-out relative cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "rounded-md px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 data-[state=active]:bg-background data-[state=active]:shadow-sm",
        floating: "rounded-lg px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        accent: "rounded-lg px-2 py-1 text-muted-foreground hover:text-foreground hover:bg-background/80 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-sm",
        segmented: "rounded-md px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-background/50 data-[state=active]:bg-foreground data-[state=active]:shadow-sm data-[state=active]:text-background",
        steps: "flex items-center gap-2 text-muted-foreground hover:text-foreground data-[state=active]:text-primary data-[state=active]:font-semibold",
        sidebar: "flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary w-full justify-start",
        card: "rounded-xl px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground border border-transparent data-[state=active]:border-border",
        minimal: "rounded-none border-b-2 border-transparent px-0 py-3 text-muted-foreground hover:text-foreground hover:border-border data-[state=active]:border-primary/80 data-[state=active]:text-foreground",
        ghost: "py-3 px-2 hover:bg-muted rounded-lg data-[state=active]:bg-muted data-[state=active]:hover:bg-muted/70",
        outline: "py-0 px-2 border border-transparent data-[state=active]:border-border hover:bg-muted rounded-lg data-[state=active]:bg-muted data-[state=active]:hover:bg-muted/70",
        pill: "rounded-full px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 data-[state=active]:bg-foreground data-[state=active]:text-background",
        badge: "rounded-lg px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 data-[state=active]:bg-background data-[state=active]:shadow-sm relative data-[state=active]:text-foreground before:content-[''] before:absolute before:top-0 before:right-0 before:w-2 before:h-2 before:bg-red-500 before:rounded-full",
        progress: "rounded-lg px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 data-[state=active]:bg-primary/10 data-[state=active]:text-primary",
        animated: "rounded-lg px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-background/70 data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-primary/20",
        // New innovative variants
        floatingAction: "rounded-xl px-5 py-3 text-muted-foreground hover:text-foreground hover:bg-background/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        iconOnly: "rounded-full p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        stacked: "rounded-lg px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 data-[state=active]:bg-background data-[state=active]:shadow-md border border-transparent data-[state=active]:border-border transform data-[state=active]:-translate-y-1",
        timeline: "flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary w-full justify-start text-start",
        glass: "rounded-lg px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-background/50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/40 data-[state=active]:to-pink-500/40 data-[state=active]:text-foreground/80 backdrop-blur-sm",
        hologram: "rounded-lg px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-background/50 data-[state=active]:bg-background/80 data-[state=active]:text-foreground",
        cyber: "rounded-lg px-4 py-2 text-amber-400/70 hover:text-amber-300 hover:bg-amber-500/10 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300",
      },
      size: {
        sm: "text-xs px-2 py-1.5",
        default: "text-sm px-3 py-2",
        lg: "text-base px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.Root> {}
interface TabsListProps extends 
  React.ComponentProps<typeof TabsPrimitive.List>,
  VariantProps<typeof tabsListVariants> {}
interface TabsTriggerProps extends 
  React.ComponentProps<typeof TabsPrimitive.Trigger>,
  VariantProps<typeof tabsTriggerVariants> {}

const Tabs = ({ className, ...props }: TabsProps) => (
  <TabsPrimitive.Root
    data-slot="tabs"
    className={cn("flex flex-col gap-2", className)}
    {...props}
  />
)

const TabsList = ({ className, variant, size, ...props }: TabsListProps) => (
  <TabsPrimitive.List
    data-slot="tabs-list"
    className={cn(tabsListVariants({ variant, size }), className)}
    {...props}
  />
)

const TabsTrigger = ({ className, variant, size, ...props }: TabsTriggerProps) => (
  <TabsPrimitive.Trigger
    data-slot="tabs-trigger"
    className={cn(tabsTriggerVariants({ variant, size }), className)}
    {...props}
  />
)

const TabsContent = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) => (
  <TabsPrimitive.Content
    data-slot="tabs-content"
    className={cn("flex-1 outline-none animate-fade-in", className)}
    {...props}
  />
)

// Icon-enhanced components
const IconTabsList = ({ children, className, variant, size, ...props }: TabsListProps) => (
  <TabsList variant={variant} size={size} className={cn("gap-1", className)} {...props}>
    {React.Children.map(children, (child, index) => (
      <div className="relative group">
        {child}
        {index < React.Children.count(children) - 1 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-px bg-border hidden group-data-[orientation=horizontal]:block" />
        )}
      </div>
    ))}
  </TabsList>
)

const IconTabsTrigger = ({ 
  icon, 
  badge, 
  className, 
  variant, 
  size, 
  children, 
  ...props 
}: TabsTriggerProps & { icon?: React.ReactNode; badge?: React.ReactNode }) => (
  <TabsTrigger variant={variant} size={size} className={cn("relative", className)} {...props}>
    <div className="flex items-center gap-2">
      {icon}
      {children}
      {badge && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </div>
  </TabsTrigger>
)

const StepIndicator = ({ step, completed, className }: { step: number; completed?: boolean; className?: string }) => (
  <div className={cn("flex items-center gap-2", className)}>
    <div className={cn(
      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
      completed 
        ? "bg-green-500 text-white" 
        : "bg-muted text-muted-foreground"
    )}>
      {completed ? <CheckCircle className="w-4 h-4" /> : step}
    </div>
    {step < 3 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
  </div>
)

export { Tabs, TabsList, TabsTrigger, TabsContent, IconTabsList, IconTabsTrigger, StepIndicator }