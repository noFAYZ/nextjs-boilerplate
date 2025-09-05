'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { User, Crown, Zap } from 'lucide-react';
import { useViewMode } from '@/lib/contexts/view-mode-context';
import { cn } from '@/lib/utils';

interface GlobalViewSwitcherProps {
  className?: string;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function GlobalViewSwitcher({ 
  className, 
  showLabels = true,
  size = 'md' 
}: GlobalViewSwitcherProps) {
  const { viewMode, setViewMode, isProMode, isBeginnerMode } = useViewMode();

  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-9 text-sm',
    lg: 'h-10 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  };

  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-1 bg-muted/50 p-1 rounded-lg border", className)}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isBeginnerMode ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('beginner')}
              className={cn(
                sizeClasses[size],
                "px-3 font-medium transition-all relative",
                isBeginnerMode 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <User className={cn(iconSizes[size], "mr-2")} />
              {showLabels && 'Beginner'}
              {isBeginnerMode && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <p className="font-medium">Beginner Mode</p>
              <p className="text-xs text-muted-foreground">Card-based interface, simplified view</p>
              <p className="text-xs text-muted-foreground">Max width: 768px</p>
            </div>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isProMode ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('pro')}
              className={cn(
                sizeClasses[size],
                "px-3 font-medium transition-all relative",
                isProMode 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Crown className={cn(iconSizes[size], "mr-2")} />
              {showLabels && 'Pro'}
              <Badge 
                variant="outline" 
                className={cn(
                  "ml-2 text-xs px-1.5 py-0 border-0",
                  isProMode 
                    ? "bg-primary/10 text-primary" 
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Zap className="h-2 w-2 mr-1" />
                Advanced
              </Badge>
              {isProMode && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <p className="font-medium">Pro Mode</p>
              <p className="text-xs text-muted-foreground">Data tables, full-width layout</p>
              <p className="text-xs text-muted-foreground">Max width: Full screen</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

// Compact version for mobile/header use
export function CompactViewSwitcher({ className }: { className?: string }) {
  const { toggleViewMode, isProMode } = useViewMode();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
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
          <p>Switch to {isProMode ? 'Beginner' : 'Pro'} Mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}