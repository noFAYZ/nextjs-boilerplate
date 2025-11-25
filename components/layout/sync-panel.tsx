'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { SolarRefreshSquareLinear, SolarCheckSquareBoldDuotone } from '../icons/icons'
import { WifiOff } from 'lucide-react'

interface SyncPanelProps {
  trigger: {
    icon: React.ReactNode
    label: string
    badge?: number | string
  }
  items: React.ReactNode[]
  isExpanded: boolean
  onToggle: () => void
  panelTitle?: React.ReactNode
  emptyMessage?: string
  isConnected?: boolean
  maxHeight?: number
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

const positionClasses = {
  'bottom-right': {
    container: 'bottom-6 right-6',
    panel: 'bottom-full mb-3 right-0',
  },
  'bottom-left': {
    container: 'bottom-6 left-6',
    panel: 'bottom-full mb-3 left-0',
  },
  'top-right': {
    container: 'top-6 right-6',
    panel: 'top-full mt-3 right-0',
  },
  'top-left': {
    container: 'top-6 left-6',
    panel: 'top-full mt-3 left-0',
  },
}

export function SyncPanel({
  trigger,
  items,
  isExpanded = false,
  onToggle,
  panelTitle,
  emptyMessage = 'All synced',
  isConnected = true,
  maxHeight = 600,
  position = 'bottom-right',
}: SyncPanelProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape' && isExpanded) {
        onToggle()
      }
    },
    [isExpanded, onToggle]
  )

  const posClass = positionClasses[position]
  const hasItems = items.length > 0

  return (
    <div
      ref={containerRef}
      className={cn('fixed z-50', posClass.container)}
      onKeyDown={handleKeyDown}
    >
      {/* Expanded Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={cn(
              'absolute w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card backdrop-blur-2xl shadow-2xl overflow-hidden',
              posClass.panel
            )}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
          >
            {/* Panel Header */}
            {panelTitle && (
              <div className="px-4 py-3 border-b border-border bg-muted backdrop-blur-sm">
                {typeof panelTitle === 'string' ? (
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <SolarRefreshSquareLinear className="w-4.5 h-4.5" stroke="2" />
                    {panelTitle}
                  </h3>
                ) : (
                  panelTitle
                )}
              </div>
            )}

            {/* Panel Content */}
            <div
              className="overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
              style={{ maxHeight }}
            >
              {hasItems ? (
                <div className="p-3 space-y-2">
                  {items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.1,
                      }}
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <SolarCheckSquareBoldDuotone className="w-10 h-10 text-green-600 dark:text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">
                    {emptyMessage}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <button
        className={cn(
          'relative flex items-center justify-center rounded-full',
          'bg-card backdrop-blur-xl border border-border shadow-lg',
          'hover:bg-muted hover:border-border transition-all duration-100',
          'cursor-pointer',
          'w-12 h-12 flex-shrink-0',
          isExpanded && 'bg-muted border-border'
        )}
        onClick={onToggle}
        aria-label={trigger.label}
        aria-expanded={isExpanded}
     
       
      >
        <div className="relative flex items-center justify-center">
          {trigger.icon}

        </div>
        
      </button>
          {/* Badge */}
          {trigger.badge !== undefined && (
            <div
              className="absolute -top-2 -right-1 min-w-6 h-6 rounded-full bg-red-500 dark:bg-red-600 text-white text-xs font-bold flex items-center justify-center shadow-lg border border-background"
          
            >
              {typeof trigger.badge === 'number' && trigger.badge > 99 ? '99+' : trigger.badge}
            </div>
          )}

    </div>
  )
}
