'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { QuickAction } from './types';

interface SidebarQuickActionsProps {
  actions: QuickAction[];
  onActionClick: (actionId: string) => void;
}

export function SidebarQuickActions({ actions, onActionClick }: SidebarQuickActionsProps) {
  return (
    <div className="space-y-6">
      {/* Financial Widget / Mini Dashboard */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 bg-gradient-to-b from-primary to-primary/40 rounded-full" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Portfolio</span>
        </div>
        
        <div className="relative overflow-hidden rounded-2xl bg-white border border-border/50 p-4 group shadow-md hover:shadow-lg hover:shadow-primary/10 transition-all duration-200">
      
          
          <div className="relative space-y-3">
            {/* Portfolio Value */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground/70 font-medium">Total Value</div>
                <div className="text-lg font-bold text-foreground">$124,567.89</div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-600 font-semibold">+12.4%</span>
              </div>
            </div>

            {/* Mini Chart Visualization */}
            <div className="relative h-12 bg-gradient-to-r from-muted/30 to-muted/20 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-end justify-between px-1 py-1">
                {/* Simple bar chart representation */}
                {[65, 70, 45, 85, 75, 90, 80, 95, 85, 100].map((height, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-t from-primary/60 to-primary/80 rounded-sm transition-all duration-100 hover:from-primary/80 hover:to-primary"
                    style={{ 
                      height: `${height}%`, 
                      width: '8%',
                      animationDelay: `${i * 100}ms`
                    }}
                  />
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-primary/10 opacity-50" />
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">Crypto</span>
                <span className="font-semibold text-foreground ml-auto">68%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Stocks</span>
                <span className="font-semibold text-foreground ml-auto">32%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-gradient-to-b from-primary to-primary/40 rounded-full" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Quick Actions</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => {
            const ActionIcon = action.icon;
            
            return (
              <button
                key={action.id}
                onClick={() => onActionClick(action.id)}
                className="group relative flex flex-col items-center gap-2 rounded-md p-2 text-sm  hover:bg-gradient-to-br hover:from-background/95 hover:to-muted/50  hover:shadow-lg hover:shadow-primary/15 hover:scale-[1.02] active:scale-[0.98] border border-transparent  hover:border cursor-pointer "
              
              >
         
                
           
                
                <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-muted to-primary/10">
       
                  
                  <ActionIcon className="h-6 w-6 text-muted-foreground relative z-10" />
                </div>
                
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <span className="text-xs text-center font-bold leading-tight group-hover:text-foreground transition-colors duration-300">
                    {action.label}
                  </span>
              {/*     {action.shortcut && (
                    <span className="text-[10px] text-muted-foreground/60 font-mono bg-muted/60 px-2 py-1 rounded-lg group-hover:bg-primary/15 group-hover:text-primary group-hover:shadow-md transition-all duration-300 border border-muted/30 group-hover:border-primary/30">
                      {action.shortcut}
                    </span>
                  )} */}
                </div>
                
                {action.badge && (
                  <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-destructive via-destructive/90 to-destructive/80 text-[11px] font-black text-destructive-foreground   animate-pulse">
                    <span className="relative z-10">{action.badge}</span>
                
                  </span>
                )}
                
           
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}