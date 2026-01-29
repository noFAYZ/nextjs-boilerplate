'use client'

import React, { useState } from 'react'
import { ChevronRight, ChevronDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CurrencyDisplay } from '@/components/ui/currency-display'
import { motion, AnimatePresence } from 'framer-motion'

interface AssetCategory {
  id: string
  name: string
  totalBalance: number
  changeAmount: number
  changePct: number
  holdings?: {
    id: string
    name: string
    balance: number
  }[]
}

export function NetWorthAccordion({ categories }: { categories: AssetCategory[] }) {
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  return (
    <Card className="border rounded-xl">
      <CardContent className="p-0">
        {categories.map((cat, idx) => {
          const isOpen = openCategory === cat.id
          const positive = cat.changeAmount > 0

          return (
            <div key={cat.id}>
              <button
                onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                className={cn(
                  'w-full flex items-center justify-between py-4 px-5 transition-colors hover:bg-muted/40',
                  idx !== categories.length - 1 && 'border-b'
                )}
              >
                {/* Left side: Category name + performance change */}
                <div className="flex items-center gap-3">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div>
                    <div className="font-medium">{cat.name}</div>
                    <div
                      className={cn(
                        'text-xs flex items-center gap-1',
                        positive
                          ? 'text-green-500'
                          : cat.changeAmount === 0
                          ? 'text-muted-foreground'
                          : 'text-red-500'
                      )}
                    >
                      <TrendingUp className="h-3 w-3" />
                      <span>
                        {positive ? '+' : ''}
                        <CurrencyDisplay amountUSD={cat.changeAmount} /> ({cat.changePct.toFixed(2)}%)
                      </span>
                      <span className="text-muted-foreground ml-1">1 month</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Total balance */}
                <div className="text-right">
                  <CurrencyDisplay amountUSD={cat.totalBalance} variant="default" />
                </div>
              </button>

              {/* Collapsible content */}
              <AnimatePresence initial={false}>
                {isOpen && cat.holdings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="bg-muted/20 px-8 py-3 space-y-2">
                      {cat.holdings.map((h) => (
                        <div
                          key={h.id}
                          className="flex items-center justify-between text-sm py-1"
                        >
                          <span className="text-muted-foreground">{h.name}</span>
                          <CurrencyDisplay amountUSD={h.balance} />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
