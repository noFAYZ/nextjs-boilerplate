'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CurrencyDisplay } from '@/components/ui/currency-display'
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { calculateCreditUtilization } from '@/lib/utils'
import { NetWorthChart } from '../networth/networth-chart'
import { Card } from '@/components/ui/card'
import { LetsIconsTimeProgressDuotone, PhTerminalDuotone } from '../icons/icons'

export function AccountHeader({ account, accountConfig, analytics, IconComponent }) {
  const utilization =
    account.type === 'CREDIT_CARD'
      ? calculateCreditUtilization(
          parseFloat(account.balance.toString()),
          parseFloat(account.availableBalance?.toString() || '0')
        )
      : 0

  return (
    <Card className="border-border/80 border-b-0 rounded-none hover:shadow-xs p-0">
      <div className="p-3 "  >
        <div className="flex flex-col gap-4">
          {/* TOP ROW: Identity & Balance */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left: Icon & Name */}
            <div className="flex items-center gap-3">
             {/*  <div
                className={cn(
                  'h-11 w-11 rounded-lg flex items-center justify-center shadow-sm border bg-gradient-to-br flex-shrink-0',
                  accountConfig.color
                )}
              >
                <IconComponent className={`h-7 w-7 ${accountConfig.textColor}`} />
              </div> */}
              <div className="h-12 w-12 sm:h-14 sm:w-14  rounded-full border shadow-sm group-hover:shadow-lg bg-muted flex items-center justify-center flex-shrink-0">
              <IconComponent className={`h-7 w-7 `} />
                        </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold tracking-tight text-foreground truncate">
                    {account.name}
                  </h1>
                  <Badge variant="new" className="text-[10px] px-1.5 py-0 h-4.5 font-normal">
                    {accountConfig.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="truncate">{account.institutionName}</span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="font-mono">•••• {account.accountNumber?.slice(-4)}</span>
                </div>
              </div>
            </div>

            {/* Right: Balance */}
            <div className="flex flex-col sm:items-end gap-2">
              <div className="flex flex-col items-end ">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  {account.type === 'CREDIT_CARD' ? 'Remaining' : 'Available'}
                </span>
                <CurrencyDisplay
                  amountUSD={parseFloat(
                    account.availableBalance?.toString() || account.balance.toString()
                  )}
                  className="text-2xl font-bold text-foreground"
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                 <span className="text-muted-foreground">
                  {account.type === 'CREDIT_CARD' ? 'Owed:' : 'Ledger:'}
                </span>
                <CurrencyDisplay
                  amountUSD={parseFloat(account.balance.toString())}
                  variant="compact"
                  className={cn(
                    'font-medium',
                    account.type === 'CREDIT_CARD' && 'text-red-600 dark:text-red-400'
                  )}
                />
              </div>
            </div>
          </div>

    

          {/* BOTTOM ROW: Stats & Utilization */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            {/* Stats Group */}
            <div className="flex items-center gap-6 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              {/* Income */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <ArrowUpRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase">
                    {account.type === "CREDIT_CARD" ? "Payments" : "Income"}
                  </p>
                  <CurrencyDisplay
                    amountUSD={analytics.monthlyIncome}
                    className="text-sm font-semibold text-foreground"
                    formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                  />
                </div>
              </div>

              {/* Expenses */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase">
                    {account.type === "CREDIT_CARD" ? "Spending" : "Expenses"}
                  </p>
                  <CurrencyDisplay
                    amountUSD={analytics.monthlySpending}
                    className="text-sm font-semibold text-foreground"
                    formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                  />
                </div>
              </div>

               {/* Net Flow (Non-Credit) */}
               {account.type !== "CREDIT_CARD" && (
                <div className="flex items-center gap-2 pl-2 border-l border-border/50">
                   <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase">Net Flow</p>
                    <CurrencyDisplay
                      amountUSD={analytics.monthlyIncome - analytics.monthlySpending}
                      className={cn(
                        "text-sm font-semibold",
                         (analytics.monthlyIncome - analytics.monthlySpending) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                      )}
                      formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                    />
                  </div>
                </div>
               )}
            </div>

            {/* Credit Utilization (Credit Only) */}
            {account.type === "CREDIT_CARD" && (
              <div className="flex items-center gap-2 pl-2 border-l border-border/50 flex-1 sm:max-w-[280px] min-w-[200px]">
                 <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <LetsIconsTimeProgressDuotone className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  
                <div className="w-full">
                  <div className="flex justify-between text-[10px] mb-1.5">
                    <span className="text-muted-foreground font-medium">Credit utilization</span>
                    <span className={cn(
                      "font-bold",
                      utilization > 75 ? "text-red-600" : utilization > 50 ? "text-orange-600" : "text-emerald-600"
                    )}>{utilization}%</span>
                  </div>
                  <div className="h-4 bg-accent shadow-inner rounded-xs overflow-hidden relative">
                     <div
                      className={cn(
                        "h-full rounded-xs transition-all duration-300 relative overflow-hidden",
                        utilization > 75 ? "bg-red-500" : utilization > 50 ? "bg-orange-500" : "bg-emerald-500"
                      )}
                      style={{ 
                        width: `${utilization}%`,
                      }}
                    >
                      {/* SVG Pattern Overlay */}
                      <div 
                        className="absolute inset-0 opacity-30" 
                        style={{
                          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.5) 5px, rgba(255,255,255,0.5) 10px)`
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-[10px] mt-1 text-muted-foreground">
                    <span>
                     <CurrencyDisplay amountUSD={parseFloat(account.balance.toString())} variant="compact" className="inline font-medium text-foreground" />
                    </span>
                    <span>
                      <CurrencyDisplay amountUSD={Math.abs(parseFloat(account.balance.toString())) + parseFloat(account.availableBalance?.toString() || "0")} variant="compact" className="inline font-medium text-foreground" />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        
      </div>
      <Separator className="bg-border/50" />
      <NetWorthChart mode='demo' height={200} className='border-0 shadow-none'/>
    </Card>
  )
}
