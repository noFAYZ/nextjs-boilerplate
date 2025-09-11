"use client"

import * as React from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"

interface DockItem {
  id: string
  label: string
  icon: React.ReactNode
  onClick?: () => void
  badge?: number | string
  disabled?: boolean
  href?: string
  isActive?: boolean
  isDraggable?: boolean
  hotkey?: string
}

interface DockProps {
  items: DockItem[]
  orientation?: "horizontal" | "vertical"
  position?: "bottom" | "top" | "left" | "right"
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
          "relative flex items-center justify-center rounded-full transition-colors duration-0 outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 cursor-pointer",
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
              position === "right" && "right-full mr-3 top-1/2 -translate-y-1/2"
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
              position === "right" && "left-full top-1/2 -translate-x-1/2 -translate-y-1/2 border-b-0 border-r-0"
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
    
    const detectedActive = items
      .filter(item => item.href && pathname.startsWith(item.href))
      .map(item => item.id)
    
    return [...activeItems, ...detectedActive]
  }, [items, pathname, activeItems, autoDetectActive])

  // Enhanced item click handler with router navigation
  const handleItemClick = React.useCallback((item: DockItem, event: React.MouseEvent) => {
    event.preventDefault()
    if (item.disabled) return
    
    if (item.href) {
      if (event.ctrlKey || event.metaKey) {
        window.open(item.href, '_blank')
      } else {
        router.push(item.href)
      }
    }
    
    item.onClick?.()
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
    "flex items-center justify-center p-3 rounded-full border shadow-xl transition-all duration-0",
    blur && "backdrop-blur-xl bg-background/80 supports-[backdrop-filter]:bg-background/60",
    !blur && "bg-accent/50",
    isHorizontal ? "flex-row gap-2" : "flex-col gap-2",
    isHorizontal ? sizeConfig.container : `w-16 min-h-[200px]`,
    className
  )

  return (
    <div
      className={cn(
        "fixed z-50",
        position === "bottom" && "bottom-4 left-1/2 -translate-x-1/2",
        position === "top" && "top-4 left-1/2 -translate-x-1/2",
        position === "left" && "left-4 top-1/2 -translate-y-1/2",
        position === "right" && "right-4 top-1/2 -translate-y-1/2"
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
  position?: "bottom" | "top" | "left" | "right"
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
              "relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-150",
              "hover:bg-accent/70 active:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              item.disabled && "opacity-50 cursor-not-allowed",
              isActive && "bg-accent/50 shadow-sm"
            )}
            onClick={() => item.onClick?.()}
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