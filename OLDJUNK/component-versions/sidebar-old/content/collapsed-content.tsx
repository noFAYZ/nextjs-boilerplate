'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { QuickAction } from '../types';

interface SidebarCollapsedContentProps {
  submenu?: Array<Record<string, unknown>>;
  actions: QuickAction[];
  onMobileClose?: () => void;
  onActionClick: (actionId: string) => void;
}

export function SidebarCollapsedContent({
  actions,
  onActionClick,
}: SidebarCollapsedContentProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-2">
      {actions.slice(0, 3).map((action) => {
        const Icon = action.icon;
        return (
          <TooltipProvider key={action.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-lg relative"
                  onClick={() => onActionClick(action.id)}
                >
                  <Icon className="h-4 w-4" />
                  {action.badge && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full text-[10px] flex items-center justify-center text-white">
                      {action.badge}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{action.label}</p>
                {action.shortcut && (
                  <kbd className="text-[10px] text-muted-foreground">{action.shortcut}</kbd>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}
