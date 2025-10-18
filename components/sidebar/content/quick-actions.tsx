'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuickAction } from '../types';

interface SidebarQuickActionsProps {
  actions: QuickAction[];
  onActionClick: (actionId: string) => void;
}

export function SidebarQuickActions({
  actions,
  onActionClick,
}: SidebarQuickActionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 bg-gradient-to-b from-primary to-primary/40 rounded-full" />
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Quick Actions
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              variant="outline"
              className="h-auto flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 hover:border-primary/30 transition-all group relative"
              onClick={() => onActionClick(action.id)}
            >
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-4 w-4 text-primary" />
              </div>

              <div className="text-center">
                <span className="text-xs font-medium line-clamp-2">
                  {action.label}
                </span>
                {action.shortcut && (
                  <kbd className="text-[10px] text-muted-foreground mt-1">
                    {action.shortcut}
                  </kbd>
                )}
              </div>

              {action.badge && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                >
                  {action.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
