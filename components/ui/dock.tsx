"use client"

import * as React from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"

interface DockItem {
  /** Unique identifier for the dock item */
  id: string
  /** Display label shown in tooltip */
  label: string
  /** Icon component to display */
  icon: React.ReactNode
  /** 
   * Click handler function. If both onClick and href are provided, 
   * onClick takes precedence and href will be ignored.
   */
  onClick?: () => void
  /** 
   * URL to navigate to. Supports Ctrl/Cmd+click for new tab.
   * If onClick is also provided, onClick takes precedence.
   */
  href?: string
  /** Badge content (number or text) shown in top-right corner */
  badge?: number | string
  /** Whether the item is disabled */
  disabled?: boolean
  /** Whether the item is currently active (overrides auto-detection) */
  isActive?: boolean
  /** Whether the item can be dragged (future feature) */
  isDraggable?: boolean
  /** Keyboard shortcut text to show in tooltip */
  hotkey?: string
}

interface DockProps {
  items: DockItem[]
  orientation?: "horizontal" | "vertical"
  position?: "bottom" | "top" | "left" | "right" | "bottom-left" | "bottom-right"
  size?: "sm" | "md" | "lg"
  magnification?: boolean
  blur?: boolean
  className?: string
  onItemClick?: (item: DockItem) => void
  activeItems?: string[]
  showActiveIndicator?: boolean
  indicatorStyle?: "windows11" | "macos" | "minimal"
  autoDetectActive?: boolean
  maxMagnification?: number
  springConfig?: {
    stiffness: number
    damping: number
  }
}

const sizeClasses = {
  sm: {
    container: "h-12",
    item: "w-10 h-10",
    magnified: "w-12 h-12",
    icon: "w-5 h-5",
  },
  md: {
    container: "h-14",
    item: "w-12 h-12",
    magnified: "w-14 h-14",
    icon: "w-9 h-9",

  },
  lg: {
    container: "h-16",
    item: "w-14 h-14",
    magnified: "w-16 h-16",
    icon: "w-7 h-7",
  },
}

const defaultSpringConfig = {
  stiffness: 400,
  damping: 25,
}

// Windows 11 Active Indicator Component
const Windows11Indicator = React.memo<{ isActive: boolean; size: string }>(({ isActive, size }) => {
  const sizeConfig = sizeClasses[size as keyof typeof sizeClasses]
  
  if (!isActive) return null
  
  return (
    <motion.div
      className="absolute -bottom-1 left-1/2 bg-orange-700/50 rounded-full"
      initial={{ width: 0, opacity: 0 }}
      animate={{ 
        width: size === 'sm' ? 6 : size === 'md' ? 12 : 14,
        height: size === 'sm' ? 6 : size === 'md' ? 6 : 8,
        opacity: 1,
        x: "-50%"
      }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
    />
  )
})
Windows11Indicator.displayName = "Windows11Indicator"

// macOS Active Indicator Component
const MacOSIndicator = React.memo<{ isActive: boolean; size: string }>(({ isActive, size }) => {
  if (!isActive) return null
  
  return (
    <motion.div
      className="absolute -bottom-1 left-1/2 w-1 h-1 bg-foreground/60 rounded-full"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1, x: "-50%" }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.15 }}
    />
  )
})
MacOSIndicator.displayName = "MacOSIndicator"

// Enhanced Dock Item Component
const DockItemComponent = React.memo<{
  item: DockItem
  index: number
  hoveredIndex: number | null
  tooltipVisible: number | null
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick: (e: React.MouseEvent) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  isActive: boolean
  magnification: boolean
  maxMagnification: number
  size: string
  orientation: string
  position: string
  indicatorStyle: string
  springConfig: { stiffness: number; damping: number }
  prefersReducedMotion: boolean
}>(({
  item,
  index,
  hoveredIndex,
  tooltipVisible,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onKeyDown,
  isActive,
  magnification,
  maxMagnification,
  size,
  orientation,
  position,
  indicatorStyle,
  springConfig,
  prefersReducedMotion
}) => {
  const isHorizontal = orientation === "horizontal"
  const sizeConfig = sizeClasses[size as keyof typeof sizeClasses]
  
  const getItemScale = React.useCallback(() => {
    if (!magnification || hoveredIndex === null || prefersReducedMotion) return 1
    
    const distance = Math.abs(index - hoveredIndex)
    if (distance === 0) return Math.min(maxMagnification, 1.2)
    if (distance === 1) return Math.min(maxMagnification * 0.8, 1)
    if (distance === 2) return Math.min(maxMagnification * 0.9, 1)
    return 1
  }, [magnification, hoveredIndex, index, maxMagnification, prefersReducedMotion])

  const getItemTransform = React.useCallback(() => {
    if (!magnification || hoveredIndex === null || prefersReducedMotion) return 0
    
    const distance = Math.abs(index - hoveredIndex)
    const direction = index < hoveredIndex ? -1 : 1
    
    if (distance === 0) return 0
    if (distance === 1) return direction * 1.2
    if (distance === 2) return direction * 0.8
    return 0
  }, [magnification, hoveredIndex, index, prefersReducedMotion])

  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <motion.button
        className={cn(
          "relative flex items-center justify-center rounded-lg transition-colors duration-0 outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 cursor-pointer",
          "hover:bg-accent/70 active:bg-accent/70",
          sizeConfig.item,
          item.disabled && "opacity-50 cursor-not-allowed",
          isActive && "bg-accent "
        )}
        animate={{
          scale: getItemScale(),
          x: isHorizontal ? getItemTransform() : 0,
          y: isHorizontal ? 0 : getItemTransform(),
        }}
        transition={{
          type: "spring",
          ...springConfig,
          duration: prefersReducedMotion ? 0 : undefined
        }}
        onClick={onClick}
        onKeyDown={onKeyDown}
        disabled={item.disabled}
        aria-label={item.label}
        role="button"
        tabIndex={0}
      >
        <div className={cn("flex items-center justify-center text-foreground")}>
          {item.icon}
        </div>
        
        {/* Badge */}
        <AnimatePresence>
          {item.badge && (
            <motion.div
              className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 font-medium"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              {item.badge}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Indicators */}
        <AnimatePresence>
          {indicatorStyle === "windows11" && (
            <Windows11Indicator isActive={isActive} size={size} />
          )}
          {indicatorStyle === "macos" && (
            <MacOSIndicator isActive={isActive} size={size} />
          )}
          {indicatorStyle === "minimal" && isActive && (
            <motion.div
              className="absolute -bottom-0.5 left-1/2 w-6 h-0.5 bg-primary rounded-full"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1, x: "-50%" }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.1 }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Enhanced Tooltip */}
 
        {tooltipVisible === index && (
          <div
            
            className={cn(
              "absolute whitespace-nowrap px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg shadow-lg border z-20 pointer-events-none duration-0 delay-0",
              "backdrop-blur-sm",
              position === "bottom" && "bottom-full mb-3 left-1/2 -translate-x-1/2",
              position === "top" && "top-full mt-3 left-1/2 -translate-x-1/2",
              position === "left" && "left-full ml-3 top-1/2 -translate-y-1/2",
              position === "right" && "right-full mr-3 top-1/2 -translate-y-1/2",
              position === "bottom-left" && "bottom-full mb-3 left-1/2 -translate-x-1/2",
              position === "bottom-right" && "bottom-full mb-3 left-1/2 -translate-x-1/2"
            )}
          >
            <div className="flex flex-col">
              <span className="font-medium">{item.label}</span>
              {item.hotkey && (
                <span className="text-xs text-muted-foreground mt-1">
                  {item.hotkey}
                </span>
              )}
            </div>
            
            {/* Tooltip Arrow */}
            <div className={cn(
              "absolute w-2 h-2 bg-popover border rotate-45",
              position === "bottom" && "top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border-r-0 border-b-0",
              position === "top" && "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 border-l-0 border-t-0",
              position === "left" && "right-full top-1/2 translate-x-1/2 -translate-y-1/2 border-t-0 border-l-0",
              position === "right" && "left-full top-1/2 -translate-x-1/2 -translate-y-1/2 border-b-0 border-r-0",
              position === "bottom-left" && "top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border-r-0 border-b-0",
              position === "bottom-right" && "top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border-r-0 border-b-0"
            )} />
          </div>
        )}
 
    </div>
  )
})
DockItemComponent.displayName = "DockItemComponent"

export function Dock({
  items,
  orientation = "horizontal",
  position = "bottom",
  size = "md",
  magnification = true,
  blur = true,
  className,
  onItemClick,
  activeItems = [],
  showActiveIndicator = true,
  indicatorStyle = "windows11",
  autoDetectActive = true,
  maxMagnification = 1.4,
  springConfig = defaultSpringConfig,
}: DockProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const [tooltipVisible, setTooltipVisible] = React.useState<number | null>(null)
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1)
  
  const pathname = usePathname()
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()
  
  const containerRef = React.useRef<HTMLDivElement>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const isHorizontal = orientation === "horizontal"
  const sizeConfig = sizeClasses[size]

  // Auto-detect active items based on current pathname
  const activeItemIds = React.useMemo(() => {
    if (!autoDetectActive) return activeItems

    // Find items that match the current pathname
    const matchingItems = items.filter(item => item.href && pathname.startsWith(item.href))

    // If multiple items match, select the one with the longest matching path (most specific)
    const bestMatch = matchingItems.reduce((prev, current) => {
      if (!prev) return current
      return (current.href?.length || 0) > (prev.href?.length || 0) ? current : prev
    }, null as typeof items[0] | null)

    const detectedActive = bestMatch ? [bestMatch.id] : []

    return [...activeItems, ...detectedActive]
  }, [items, pathname, activeItems, autoDetectActive])

  // Enhanced item click handler with router navigation and button functionality
  const handleItemClick = React.useCallback((item: DockItem, event: React.MouseEvent) => {
    if (item.disabled) return
    
    // If item has both href and onClick, prefer onClick behavior
    if (item.onClick) {
      event.preventDefault()
      item.onClick()
      onItemClick?.(item)
      return
    }
    
    // If item has href, handle navigation
    if (item.href) {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault()
        window.open(item.href, '_blank')
      } else {
        event.preventDefault()
        router.push(item.href)
      }
      onItemClick?.(item)
      return
    }
    
    // If neither href nor onClick, just call the global handler
    event.preventDefault()
    onItemClick?.(item)
  }, [router, onItemClick])

  // Keyboard navigation
  const handleKeyDown = React.useCallback((event: React.KeyboardEvent, item: DockItem, index: number) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        handleItemClick(item, event as any)
        break
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        setFocusedIndex(Math.min(index + 1, items.length - 1))
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        setFocusedIndex(Math.max(index - 1, 0))
        break
      case 'Home':
        event.preventDefault()
        setFocusedIndex(0)
        break
      case 'End':
        event.preventDefault()
        setFocusedIndex(items.length - 1)
        break
    }
  }, [items.length, handleItemClick])

  // Focus management
  React.useEffect(() => {
    if (focusedIndex >= 0 && containerRef.current) {
      const button = containerRef.current.querySelector(`button:nth-child(${focusedIndex + 1})`) as HTMLButtonElement
      button?.focus()
    }
  }, [focusedIndex])

  // Tooltip delay management
  const handleMouseEnter = React.useCallback((index: number) => {
    setHoveredIndex(index)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setTooltipVisible(index)
    }, 600)
  }, [])

  const handleMouseLeave = React.useCallback(() => {
    setHoveredIndex(null)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setTooltipVisible(null)
  }, [])

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const containerClasses = cn(
    "flex items-center justify-center p-3 rounded-none border shadow-xl transition-all duration-0",
    blur && "backdrop-blur-xl bg-background/80 supports-[backdrop-filter]:bg-background/60",
    !blur && "bg-card",
    isHorizontal ? "flex-row gap-2" : "flex-col gap-2",
    isHorizontal ? sizeConfig.container : `w-16 min-h-[220px]`,
    className
  )

  return (
    <div
      className={cn(
        "fixed z-50",
        position === "bottom" && "bottom-4 left-1/2 -translate-x-1/2",
        position === "top" && "top-4 left-1/2 -translate-x-1/2",
        position === "left" && "left-4 top-1/2 -translate-y-1/2",
        position === "right" && "right-4 top-1/2 -translate-y-1/2",
        position === "bottom-left" && "bottom-4 left-4",
        position === "bottom-right" && "bottom-4 right-4"
      )}
    >
      <motion.div 
        className={containerClasses}
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.1 }}
        role="navigation"
        aria-label="Dock navigation"
      >
        {items.map((item, index) => {
          const isActive = showActiveIndicator && (
            item.isActive || 
            activeItemIds.includes(item.id)
          )
          
          return (
            <DockItemComponent
              key={item.id}
              item={item}
              index={index}
              hoveredIndex={hoveredIndex}
              tooltipVisible={tooltipVisible}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => handleItemClick(item, e)}
              onKeyDown={(e) => handleKeyDown(e, item, index)}
              isActive={isActive}
              magnification={magnification}
              maxMagnification={maxMagnification}
              size={size}
              orientation={orientation}
              position={position}
              indicatorStyle={indicatorStyle}
              springConfig={springConfig}
              prefersReducedMotion={prefersReducedMotion || false}
            />
          )
        })}
      </motion.div>
    </div>
  )
}

// Enhanced FloatingDock with more configuration options
interface FloatingDockProps {
  items: DockItem[]
  className?: string
  position?: "bottom" | "top" | "left" | "right" | "bottom-left" | "bottom-right"
  size?: "sm" | "md" | "lg"
  indicatorStyle?: "windows11" | "macos" | "minimal"
  activeItems?: string[]
  autoDetectActive?: boolean
}

export function FloatingDock({ 
  items, 
  className,
  position = "bottom",
  size = "md",
  indicatorStyle = "windows11",
  activeItems,
  autoDetectActive = true
}: FloatingDockProps) {
  return (
    <Dock
      items={items}
      position={position}
      magnification={true}
      blur={true}
      size={size}
      indicatorStyle={indicatorStyle}
      activeItems={activeItems}
      autoDetectActive={autoDetectActive}
      className={className}
    />
  )
}

// Enhanced MiniDock with active states and better accessibility
interface MiniDockProps {
  items: DockItem[]
  className?: string
  showActiveIndicator?: boolean
  activeItems?: string[]
}

export function MiniDock({ 
  items, 
  className, 
  showActiveIndicator = true,
  activeItems = []
}: MiniDockProps) {
  const pathname = usePathname()
  const router = useRouter()
  
  // Enhanced click handler for MiniDock items
  const handleItemClick = React.useCallback((item: DockItem, event: React.MouseEvent) => {
    if (item.disabled) return
    
    // If item has both href and onClick, prefer onClick behavior
    if (item.onClick) {
      event.preventDefault()
      item.onClick()
      return
    }
    
    // If item has href, handle navigation
    if (item.href) {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault()
        window.open(item.href, '_blank')
      } else {
        event.preventDefault()
        router.push(item.href)
      }
    }
  }, [router])
  
  return (
    <div 
      className={cn("flex items-center gap-1 p-2 rounded-xl w-fit bg-muted/50 backdrop-blur-sm", className)}
      role="navigation"
      aria-label="Mini dock navigation"
    >
      {items.map((item) => {
        const isActive = showActiveIndicator && (
          item.isActive ||
          activeItems.includes(item.id) ||
          (item.href && pathname.startsWith(item.href))
        )
        
        return (
          <button
            key={item.id}
            className={cn(
              "relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-75",
              "hover:bg-accent/70 active:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              item.disabled && "opacity-50 cursor-not-allowed",
              isActive && "bg-accent/50 shadow-sm"
            )}
            onClick={(e) => handleItemClick(item, e)}
            disabled={item.disabled}
            title={item.label}
            aria-label={item.label}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              {item.icon}
            </div>
            
            {/* Badge */}
            <AnimatePresence>
              {item.badge && (
                <motion.div
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-1 text-[10px] font-medium"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {item.badge}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Active Indicator */}
            {showActiveIndicator && isActive && (
              <motion.div
                className="absolute -bottom-0.5 left-1/2 w-1 h-1 bg-primary rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, x: "-50%" }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

// Enhanced useDock hook with more functionality
export function useDock(defaultItems: DockItem[] = []) {
  const [items, setItems] = React.useState<DockItem[]>(defaultItems)
  const [recentItems, setRecentItems] = React.useState<DockItem[]>([])

  const addItem = React.useCallback((item: DockItem, position?: number) => {
    setItems(prev => {
      if (typeof position === 'number') {
        const newItems = [...prev]
        newItems.splice(position, 0, item)
        return newItems
      }
      return [...prev, item]
    })
  }, [])

  const removeItem = React.useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
    setRecentItems(prev => prev.filter(item => item.id !== id))
  }, [])

  const updateItem = React.useCallback((id: string, updates: Partial<DockItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ))
  }, [])

  const moveItem = React.useCallback((fromIndex: number, toIndex: number) => {
    setItems(prev => {
      const newItems = [...prev]
      const [movedItem] = newItems.splice(fromIndex, 1)
      newItems.splice(toIndex, 0, movedItem)
      return newItems
    })
  }, [])

  const setBadge = React.useCallback((id: string, badge: number | string | undefined) => {
    updateItem(id, { badge })
  }, [updateItem])

  const setActive = React.useCallback((id: string, isActive: boolean) => {
    updateItem(id, { isActive })
  }, [updateItem])

  const toggleActive = React.useCallback((id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ))
  }, [])

  const addToRecent = React.useCallback((item: DockItem, maxRecent = 5) => {
    setRecentItems(prev => {
      const filtered = prev.filter(recentItem => recentItem.id !== item.id)
      return [item, ...filtered].slice(0, maxRecent)
    })
  }, [])

  const clearRecent = React.useCallback(() => {
    setRecentItems([])
  }, [])

  const findItem = React.useCallback((id: string) => {
    return items.find(item => item.id === id)
  }, [items])

  const findItemIndex = React.useCallback((id: string) => {
    return items.findIndex(item => item.id === id)
  }, [items])

  const getActiveItems = React.useCallback(() => {
    return items.filter(item => item.isActive)
  }, [items])

  const hasItem = React.useCallback((id: string) => {
    return items.some(item => item.id === id)
  }, [items])

  const bulkUpdate = React.useCallback((updates: Array<{ id: string; updates: Partial<DockItem> }>) => {
    setItems(prev => prev.map(item => {
      const update = updates.find(u => u.id === item.id)
      return update ? { ...item, ...update.updates } : item
    }))
  }, [])

  const reset = React.useCallback(() => {
    setItems(defaultItems)
    setRecentItems([])
  }, [defaultItems])

  return {
    items,
    setItems,
    recentItems,
    addItem,
    removeItem,
    updateItem,
    moveItem,
    setBadge,
    setActive,
    toggleActive,
    addToRecent,
    clearRecent,
    findItem,
    findItemIndex,
    getActiveItems,
    hasItem,
    bulkUpdate,
    reset,
  }
}

// Windows 11-style Dock Preset
export function createWindows11Dock(items: DockItem[], options?: Partial<DockProps>) {
  return (
    <Dock
      items={items}
      position="bottom"
      size="md"
      indicatorStyle="windows11"
      magnification={true}
      blur={true}
      showActiveIndicator={true}
      autoDetectActive={true}
      maxMagnification={1.3}
      springConfig={{ stiffness: 300, damping: 20 }}
      {...options}
    />
  )
}

// macOS-style Dock Preset  
export function createMacOSDock(items: DockItem[], options?: Partial<DockProps>) {
  return (
    <Dock
      items={items}
      position="bottom"
      size="lg"
      indicatorStyle="macos"
      magnification={true}
      blur={true}
      showActiveIndicator={true}
      autoDetectActive={true}
      maxMagnification={1.6}
      springConfig={{ stiffness: 400, damping: 25 }}
      {...options}
    />
  )
}

// Minimal Dock Preset
export function createMinimalDock(items: DockItem[], options?: Partial<DockProps>) {
  return (
    <Dock
      items={items}
      position="bottom"
      size="sm"
      indicatorStyle="minimal"
      magnification={false}
      blur={false}
      showActiveIndicator={true}
      autoDetectActive={true}
      {...options}
    />
  )
}

// Bottom-Left Corner Dock Preset
export function createBottomLeftDock(items: DockItem[], options?: Partial<DockProps>) {
  return (
    <Dock
      items={items}
      position="bottom-left"
      size="md"
      indicatorStyle="windows11"
      magnification={true}
      blur={true}
      showActiveIndicator={true}
      autoDetectActive={true}
      maxMagnification={1.2}
      springConfig={{ stiffness: 350, damping: 22 }}
      {...options}
    />
  )
}

// Bottom-Right Corner Dock Preset  
export function createBottomRightDock(items: DockItem[], options?: Partial<DockProps>) {
  return (
    <Dock
      items={items}
      position="bottom-right"
      size="md"
      indicatorStyle="windows11"
      magnification={true}
      blur={true}
      showActiveIndicator={true}
      autoDetectActive={true}
      maxMagnification={1.2}
      springConfig={{ stiffness: 350, damping: 22 }}
      {...options}
    />
  )
}

// Expandable Dock Component for Notifications/Wallets
export interface ExpandableItem {
  id: string
  title: string
  subtitle?: string
  status?: "success" | "warning" | "error" | "loading" | "idle"
  timestamp?: string
  icon?: React.ReactNode
  onClick?: () => void
  badge?: number | string
}

export interface ExpandableDockProps {
  /** Main dock button configuration */
  trigger: {
    icon: React.ReactNode
    label: string
    badge?: number | string
  }
  /** Items to show in the expanded list */
  items: ExpandableItem[]
  /** Whether the dock is currently expanded */
  isExpanded: boolean
  /** Callback when dock expansion state changes */
  onToggle: () => void
  /** Maximum height of the expanded list */
  maxHeight?: number
  /** Custom className for styling */
  className?: string
  /** Title for the expanded panel */
  panelTitle?: string
  /** Empty state message */
  emptyMessage?: string
  /** Loading state */
  isLoading?: boolean
  /** Dock position */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
}

const statusColors = {
  success: "text-green-600 bg-green-300 dark:bg-green-900/20",
  warning: "text-yellow-600 bg-yellow-300 dark:bg-yellow-900/20", 
  error: "text-red-600 bg-red-300 dark:bg-red-900/20",
  loading: "text-blue-600 bg-blue-300 dark:bg-blue-900/20",
  idle: "text-gray-600 bg-gray-300 dark:bg-gray-900/20"
}

export function ExpandableDock({
  trigger,
  items,
  isExpanded,
  onToggle,
  maxHeight = 400,
  className,
  panelTitle,
  emptyMessage = "No items to show",
  isLoading = false,
  position = "bottom-right"
}: ExpandableDockProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isExpanded) {
          onToggle()
        }
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded, onToggle])

  // Keyboard handling
  const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isExpanded) {
      onToggle()
    }
  }, [isExpanded, onToggle])

  const getPositionClasses = () => {
    switch (position) {
      case "bottom-right":
        return "bottom-4 right-4"
      case "bottom-left":
        return "bottom-4 left-4"
      case "top-right":
        return "top-4 right-4"
      case "top-left":
        return "top-4 left-4"
      default:
        return "bottom-4 right-4"
    }
  }

  const getPanelPositionClasses = () => {
    const isBottom = position.includes("bottom")
    const isRight = position.includes("right")
    
    return cn(
      "absolute max-w-[90vw] sm:w-80 w-72",
      isBottom ? "bottom-full mb-2" : "top-full mt-2",
      isRight ? "right-0" : "left-0"
    )
  }

  return (
    <div 
      ref={containerRef}
      className={cn("fixed z-50", getPositionClasses(), className)}
      onKeyDown={handleKeyDown}
    >
      {/* Expanded Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={cn(
              "bg-background backdrop-blur-xl border rounded-xl shadow-xl overflow-hidden",
              getPanelPositionClasses()
            )}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: prefersReducedMotion ? 0 : 0.1,
              ease: "easeOut"
            }}
          >
            {/* Panel Header */}
            {panelTitle && (
              <div className="px-4 py-3 border-b bg-muted/30">
                <h3 className="font-semibold text-sm">{panelTitle}</h3>
              </div>
            )}

            {/* Panel Content */}
            <div 
              className="overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
              style={{ 
                maxHeight: typeof window !== 'undefined' && window.innerWidth < 768 
                  ? Math.min(maxHeight, window.innerHeight * 0.5) // Max 50% of viewport height on mobile
                  : maxHeight 
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  {emptyMessage}
                </div>
              ) : (
                <div className="py-1">
                  {items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: prefersReducedMotion ? 0 : index * 0.05,
                        duration: prefersReducedMotion ? 0 : 0.1 
                      }}
                    >
                      <button
                        className={cn(
                          "w-full px-4 py-2  flex items-start gap-2 hover:bg-muted transition-colors text-left",
                          item.onClick && "cursor-pointer"
                        )}
                        onClick={() => {
                          item.onClick?.()
                          if (item.onClick) onToggle()
                        }}
                        disabled={!item.onClick}
                      >
                        {/* Status Indicator 
                        {item.status && (
                          <div className={cn(
                            "w-3 h-3 rounded-full mt-2 flex-shrink-0",
                            statusColors[item.status]
                          )} />
                        )}*/}

                        {/* Item Icon */}
                        {item.icon && (
                          <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center text-muted-foreground">
                            {item.icon}
                          </div>
                        )}

                        {/* Item Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-xs truncate">{item.title}</h4>
                            {item.badge && (
                              <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          
                          {item.subtitle && (
                            <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                              {item.subtitle}
                            </p>
                          )}
                          
                          {item.timestamp && (
                            <time className="text-[11px] text-muted-foreground/70 mt-1 block">
                              {item.timestamp}
                            </time>
                          )}
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        className={cn(
          "relative flex items-center justify-center rounded-full",
          "bg-card backdrop-blur-xl border shadow-xl",
          "hover:bg-accent active:bg-accent transition-all duration-0",
          "focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 cursor-pointer",
          "touch-manipulation", // Better touch handling
          // Mobile: larger touch target, Desktop: standard size
          "w-14 h-14 sm:w-12 sm:h-12",
          isExpanded && "bg-muted"
        )}
        onClick={onToggle}
        aria-label={trigger.label}
        aria-expanded={isExpanded}
        transition={{ 
          duration: prefersReducedMotion ? 0 : 0.05,
          ease: "easeOut" 
        }}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          {trigger.icon}
        </div>

        {/* Badge */}
        <AnimatePresence>
          {trigger.badge && (
            <motion.div
              className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-medium"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.09 }}
            >
              {trigger.badge}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

// Hook for managing expandable dock state
export function useExpandableDock(initialExpanded = false) {
  const [isExpanded, setIsExpanded] = React.useState(initialExpanded)
  const [items, setItems] = React.useState<ExpandableItem[]>([])

  const toggle = React.useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  const expand = React.useCallback(() => {
    setIsExpanded(true)
  }, [])

  const collapse = React.useCallback(() => {
    setIsExpanded(false)
  }, [])

  const addItem = React.useCallback((item: ExpandableItem) => {
    setItems(prev => [item, ...prev])
  }, [])

  const removeItem = React.useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])

  const updateItem = React.useCallback((id: string, updates: Partial<ExpandableItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ))
  }, [])

  const clearItems = React.useCallback(() => {
    setItems([])
  }, [])

  return {
    isExpanded,
    items,
    setItems,
    toggle,
    expand,
    collapse,
    addItem,
    removeItem,
    updateItem,
    clearItems
  }
}

/*
EXPANDABLE DOCK USAGE EXAMPLES:

// Example 1: Notifications Dock
function NotificationsDock() {
  const notifications = useExpandableDock()
  
  const notificationItems: ExpandableItem[] = [
    {
      id: '1',
      title: 'New message from John',
      subtitle: 'Hey, let\'s discuss the project details...',
      status: 'idle',
      timestamp: '2 min ago',
      icon: <MessageSquare className="w-4 h-4" />,
      onClick: () => {
        // Navigate to message
        router.push('/messages/john')
      }
    },
    {
      id: '2', 
      title: 'Payment received',
      subtitle: '$1,250.00 from Crypto Wallet',
      status: 'success',
      timestamp: '5 min ago',
      icon: <DollarSign className="w-4 h-4" />,
      badge: 'New',
      onClick: () => {
        // Show payment details
        setShowPaymentModal(true)
      }
    },
    {
      id: '3',
      title: 'Sync error',
      subtitle: 'Failed to sync Bitcoin wallet data',
      status: 'error', 
      timestamp: '10 min ago',
      icon: <AlertCircle className="w-4 h-4" />,
      onClick: () => {
        // Retry sync
        retryWalletSync('bitcoin-wallet-id')
      }
    }
  ]
  
  return (
    <ExpandableDock
      trigger={{
        icon: <Bell className="w-4 h-4" />,
        label: 'Notifications',
        badge: notificationItems.length
      }}
      items={notificationItems}
      isExpanded={notifications.isExpanded}
      onToggle={notifications.toggle}
      panelTitle="Notifications" 
      position="bottom-right"
    />
  )
}

// Example 2: Wallet Tracker Dock
function WalletTrackerDock() {
  const walletTracker = useExpandableDock()
  const [wallets, setWallets] = React.useState<ExpandableItem[]>([])
  
  React.useEffect(() => {
    // Fetch wallet data
    const mockWallets: ExpandableItem[] = [
      {
        id: 'btc-wallet',
        title: 'Bitcoin Wallet',
        subtitle: '1.2547 BTC • $52,341.23',
        status: 'success',
        timestamp: 'Last sync: 30s ago',
        icon: <Bitcoin className="w-4 h-4" />,
        onClick: () => router.push('/wallets/btc')
      },
      {
        id: 'eth-wallet', 
        title: 'Ethereum Wallet',
        subtitle: '15.42 ETH • $31,245.67',
        status: 'loading',
        timestamp: 'Syncing...',
        icon: <Ethereum className="w-4 h-4" />,
        onClick: () => router.push('/wallets/eth')
      },
      {
        id: 'ada-wallet',
        title: 'Cardano Wallet', 
        subtitle: '2,450 ADA • $1,234.56',
        status: 'warning',
        timestamp: 'Sync delayed: 5min',
        icon: <Wallet className="w-4 h-4" />,
        badge: '!',
        onClick: () => router.push('/wallets/ada')
      },
      {
        id: 'sol-wallet',
        title: 'Solana Wallet',
        subtitle: 'Connection failed',
        status: 'error',
        timestamp: 'Last sync: 2hrs ago',
        icon: <AlertTriangle className="w-4 h-4" />,
        onClick: () => retryConnection('sol-wallet')
      }
    ]
    setWallets(mockWallets)
  }, [])
  
  const activeWallets = wallets.filter(w => w.status === 'success').length
  const totalWallets = wallets.length
  
  return (
    <ExpandableDock
      trigger={{
        icon: <Wallet className="w-4 h-4" />,
        label: 'Wallet Tracker',
        badge: `${activeWallets}/${totalWallets}`
      }}
      items={wallets}
      isExpanded={walletTracker.isExpanded}
      onToggle={walletTracker.toggle}
      panelTitle="Crypto Wallets"
      position="bottom-left"
      maxHeight={500}
    />
  )
}

// Example 3: System Status Dock
function SystemStatusDock() {
  const systemStatus = useExpandableDock()
  const [isLoading, setIsLoading] = React.useState(false)
  
  const statusItems: ExpandableItem[] = [
    {
      id: 'api-status',
      title: 'API Server',
      subtitle: 'All services operational',
      status: 'success',
      timestamp: 'Last check: 1min ago',
      icon: <Server className="w-4 h-4" />
    },
    {
      id: 'database',
      title: 'Database',
      subtitle: 'Connection stable',
      status: 'success', 
      timestamp: 'Last check: 30s ago',
      icon: <Database className="w-4 h-4" />
    },
    {
      id: 'backup',
      title: 'Backup Service',
      subtitle: 'Daily backup in progress',
      status: 'loading',
      timestamp: 'Started: 10min ago',
      icon: <HardDrive className="w-4 h-4" />
    }
  ]
  
  return (
    <ExpandableDock
      trigger={{
        icon: <Activity className="w-4 h-4" />,
        label: 'System Status',
        badge: statusItems.filter(item => item.status === 'error').length || undefined
      }}
      items={statusItems}
      isExpanded={systemStatus.isExpanded}
      onToggle={systemStatus.toggle}
      panelTitle="System Status"
      isLoading={isLoading}
      position="top-right"
    />
  )
}

// Example 4: Using with custom hook management
function CustomDockExample() {
  const dock = useExpandableDock()
  
  // Add items dynamically
  const addNotification = (title: string, type: 'success' | 'error' | 'warning') => {
    dock.addItem({
      id: Date.now().toString(),
      title,
      subtitle: `Notification of type: ${type}`,
      status: type === 'success' ? 'success' : type === 'error' ? 'error' : 'warning',
      timestamp: 'Just now',
    })
  }
  
  return (
    <div>
      <button onClick={() => addNotification('Success!', 'success')}>
        Add Success
      </button>
      <button onClick={() => addNotification('Error occurred', 'error')}>
        Add Error  
      </button>
      <button onClick={() => dock.clearItems()}>
        Clear All
      </button>
      
      <ExpandableDock
        trigger={{
          icon: <Bell className="w-4 h-4" />,
          label: 'Dynamic Notifications',
          badge: dock.items.length || undefined
        }}
        items={dock.items}
        isExpanded={dock.isExpanded}
        onToggle={dock.toggle}
        panelTitle="Dynamic Items"
        emptyMessage="No notifications yet"
      />
    </div>
  )
}

// ORIGINAL DOCK USAGE EXAMPLES:

// Example 1: Items with navigation (href)
const navigationItems: DockItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Home />,
    href: '/dashboard', // Navigate to dashboard page
    hotkey: '⌘+1'
  },
  {
    id: 'settings',
    label: 'Settings', 
    icon: <Settings />,
    href: '/settings', // Navigate to settings page
    badge: 2
  }
]

// Example 2: Items with actions (onClick)
const actionItems: DockItem[] = [
  {
    id: 'save',
    label: 'Save Document',
    icon: <Save />,
    onClick: () => {
      // Perform save action
    },
    hotkey: '⌘+S'
  },
  {
    id: 'export',
    label: 'Export Data',
    icon: <Download />,
    onClick: () => {
      // Perform export action
      exportData()
    },
    badge: 'new'
  }
]

// Example 3: Mixed items (navigation + actions)
const mixedItems: DockItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <Home />,
    href: '/', // Navigation
  },
  {
    id: 'search',
    label: 'Search',
    icon: <Search />,
    onClick: () => {
      // Action - open search modal
      setShowSearchModal(true)
    },
    hotkey: '⌘+K'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: <User />,
    href: '/profile', // Navigation
    isActive: true // Force active state
  }
]

// Usage in component
function MyDockComponent() {
  return (
    <div>
      {/* Windows 11 style dock with navigation items - center bottom *\/}
      {createWindows11Dock(navigationItems)}
      
      {/* Custom dock with mixed items - bottom left corner *\/}
      <Dock
        items={mixedItems}
        position="bottom-left"
        indicatorStyle="windows11"
        showActiveIndicator={true}
        autoDetectActive={true}
        onItemClick={(item) => {
        }}
      />
      
      {/* FloatingDock in bottom-right corner *\/}
      <FloatingDock
        items={actionItems}
        position="bottom-right"
        indicatorStyle="macos"
        className="opacity-90"
      />
      
      {/* Using preset functions for corner positioning *\/}
      {createBottomLeftDock(navigationItems)}
      {createBottomRightDock(actionItems)}
      
      {/* Mini dock for toolbar *\/}
      <MiniDock
        items={actionItems}
        showActiveIndicator={false}
        className="my-4"
      />
    </div>
  )
}
*/