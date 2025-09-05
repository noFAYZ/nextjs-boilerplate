'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, Table2, User, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewMode = 'beginner' | 'pro';

interface ViewSwitcherProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

export function ViewSwitcher({ viewMode, onViewModeChange, className }: ViewSwitcherProps) {
  return (
    <div className={cn("flex items-center gap-1 bg-muted p-1 rounded-lg", className)}>
      <Button
        variant={viewMode === 'beginner' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('beginner')}
        className={cn(
          "h-8 px-3 text-xs font-medium transition-all",
          viewMode === 'beginner' 
            ? "bg-background text-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <User className="h-3 w-3 mr-1.5" />
        Beginner
        <Badge variant="outline" className="ml-1.5 text-xs px-1.5 py-0">
          Cards
        </Badge>
      </Button>
      
      <Button
        variant={viewMode === 'pro' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('pro')}
        className={cn(
          "h-8 px-3 text-xs font-medium transition-all",
          viewMode === 'pro' 
            ? "bg-background text-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Crown className="h-3 w-3 mr-1.5" />
        Pro
        <Badge variant="outline" className="ml-1.5 text-xs px-1.5 py-0">
          Table
        </Badge>
      </Button>
    </div>
  );
}