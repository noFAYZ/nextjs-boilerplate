'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { QuickAction } from '../types'

interface SidebarQuickActionsProps {
  actions: QuickAction[]
  onActionClick: (actionId: string) => void
}

export function SidebarQuickActions({
  actions,
  onActionClick,
}: SidebarQuickActionsProps) {
  return (
    <div className="space-y-4 ">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-4 rounded-full bg-gradient-to-b from-primary to-primary/50" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Quick Actions
        </span>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-visible">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.id}
              onClick={() => onActionClick(action.id)}
              className={cn(
                'relative group flex flex-col items-center justify-center gap-2 rounded-xl border border-transparent bg-muted/30 p-3 text-center backdrop-blur-sm  hover:border-primary/30 hover:bg-muted/50 hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] cursor-pointer overflow-visible'
              )}
            >
              {/* Icon Wrapper */}
              <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300">
                <Icon className="h-5 w-5 text-primary" />
              </div>

              {/* Label + Shortcut */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-[12px] font-medium leading-tight text-foreground">
                  {action.label}
                </span>
          
              </div>

              {/* Badge */}
              {action.badge && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] z-10"
                >
                  {action.badge}
                </Badge>
              )}

          
            </button>
          )
        })}
      </div>
    </div>
  )
}
