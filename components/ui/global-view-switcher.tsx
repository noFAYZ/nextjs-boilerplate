"use client"

import * as React from "react"
import { User, Crown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useViewMode } from "@/lib/contexts/view-mode-context"
import { GameIconsUpgrade, PhUser } from "../icons"

interface GlobalViewSwitcherProps {
  className?: string
  showLabels?: boolean
  size?: "sm" | "md" | "lg"
}

function GlobalViewSwitcher({ 
  className, 
  showLabels = true,
  size = "md" 
}: GlobalViewSwitcherProps) {
  const { viewMode, setViewMode, isProMode, isBeginnerMode, toggleViewMode } = useViewMode()

  const sizeClasses = {
    sm: "h-8 text-xs",
    md: "h-9 text-sm",
    lg: "h-10 text-base"
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  }

  return (
    <TooltipProvider>
      <div 
        data-slot="global-view-switcher"
        className={cn("flex items-center w-fit mx-auto gap-1 bg-muted p-1 rounded-lg border", className)}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isBeginnerMode ? "outline" : "ghost"}
              size="sm"
              onClick={toggleViewMode}
              className={cn(
                sizeClasses[size],
                "px-3 font-medium transition-all text-xs relative",
                isBeginnerMode 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <PhUser className={cn(iconSizes[size], "mr-2")} />
              {showLabels && "Lite"}
              {isBeginnerMode && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-background outline shadow-md">
            <div className="text-center">
              <p className="font-medium text-foreground">Beginner Mode</p>
              <p className="text-xs text-muted-foreground">Card-based interface, simplified view</p>
              <p className="text-xs text-muted-foreground">Max width: 768px</p>
            </div>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isProMode ? "outline" : "ghost"}
              size="sm"
              onClick={toggleViewMode}
              className={cn(
                sizeClasses[size],
                "px-3 font-medium transition-all relative text-xs",
                isProMode 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <GameIconsUpgrade className={cn(iconSizes[size], "mr-2")} />
              {showLabels && "Pro"}
        
              {isProMode && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-background outline shadow-md">
            <div className="text-center ">
              <p className="font-medium text-foreground">Pro Mode</p>
              <p className="text-xs text-muted-foreground">Data tables, full-width layout</p>
              <p className="text-xs text-muted-foreground">Max width: Full screen</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

// Compact version for mobile/header use
function CompactViewSwitcher({ className }: { className?: string }) {
  const { toggleViewMode, isProMode } = useViewMode()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            data-slot="compact-view-switcher"
            variant="outline"
            size="sm"
            onClick={toggleViewMode}
            className={cn(
              "h-8 w-8 p-0 transition-all",
              isProMode ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-green-500 bg-green-50 dark:bg-green-950",
              className
            )}
          >
            {isProMode ? (
              <Crown className="h-4 w-4 text-blue-600" />
            ) : (
              <User className="h-4 w-4 text-green-600" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Switch to {isProMode ? "Beginner" : "Pro"} Mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { GlobalViewSwitcher, CompactViewSwitcher }