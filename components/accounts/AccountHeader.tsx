import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CurrencyDisplay } from '@/components/ui/currency-display'
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { calculateCreditUtilization } from '@/lib/utils'
import { NetWorthChart } from '../networth/networth-chart'
import { Card } from '@/components/ui/card'

export function AccountHeader({ account, accountConfig, analytics, IconComponent }) {
  const utilization =
    account.type === 'CREDIT_CARD'
      ? calculateCreditUtilization(
          parseFloat(account.balance.toString()),
          parseFloat(account.availableBalance?.toString() || '0')
        )
      : 0

  return (
    <div className="space-y-6">
      <Card className="p-6" variant="outlined">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left Section — Account Info */}
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'h-14 w-14 rounded-xl flex items-center justify-center shadow-sm border bg-gradient-to-br',
                accountConfig.color
              )}
            >
              <IconComponent className={`h-8 w-8 ${accountConfig.textColor}`} />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {account.name}
                </h1>
                <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-5">
                  {accountConfig.label}
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground/80">{account.institutionName}</span>
                <Separator orientation="vertical" className="h-3" />
                <span className="font-mono text-xs">•••• {account.accountNumber.slice(-4)}</span>
              </div>
            </div>
          </div>

          {/* Right Section — Balance */}
          <div className="flex flex-col items-start md:items-end bg-muted/30 p-4 rounded-xl border border-border/50 min-w-[200px]">
            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
              {account.type === 'CREDIT_CARD' ? 'Available Credit' : 'Available Balance'}
            </p>
            <CurrencyDisplay
              amountUSD={parseFloat(
                account.availableBalance?.toString() || account.balance.toString()
              )}
              className="text-3xl font-bold text-foreground"
            />
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="text-muted-foreground">
                {account.type === 'CREDIT_CARD' ? 'Current Balance:' : 'Ledger Balance:'}
              </span>
              <CurrencyDisplay
                amountUSD={parseFloat(account.balance.toString())}
                variant="compact"
                className={cn(
                  'font-semibold',
                  account.type === 'CREDIT_CARD' && 'text-red-600 dark:text-red-400'
                )}
              />
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Income / Deposits */}
          <div className="group relative border border-border/60 flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-muted/50 hover:border-border/80">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
              <ArrowUpRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                {account.type === "CREDIT_CARD"
                  ? "Payments"
                  : account.type === "SAVINGS"
                  ? "Deposits"
                  : "Income"}
              </p>
              <CurrencyDisplay
                amountUSD={analytics.monthlyIncome}
                className="text-lg font-bold text-foreground"
                formatOptions={{
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }}
              />
            </div>
          </div>

          {/* Expenses / Withdrawals */}
          <div className="group relative border border-border/60 flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-muted/50 hover:border-border/80">
            <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/20 transition-colors">
              <ArrowDownRight className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                {account.type === "CREDIT_CARD"
                  ? "Spending"
                  : account.type === "SAVINGS"
                  ? "Withdrawals"
                  : "Expenses"}
              </p>
              <CurrencyDisplay
                amountUSD={analytics.monthlySpending}
                className="text-lg font-bold text-foreground"
                formatOptions={{
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }}
              />
            </div>
          </div>

          {/* Credit Utilization or Net Flow */}
          {account.type === "CREDIT_CARD" ? (
            <div className="group relative border border-border/60 flex flex-col justify-center gap-2 p-3 rounded-xl transition-all hover:bg-muted/50 hover:border-border/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">Credit Utilization</span>
                <span
                  className={cn(
                    "font-bold",
                    utilization > 75
                      ? "text-red-600 dark:text-red-400"
                      : utilization > 50
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  )}
                >
                  {utilization}%
                </span>
              </div>
              
              <div className="h-2 bg-muted rounded-full overflow-hidden w-full">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500 ease-out",
                    utilization > 75
                      ? "bg-red-500"
                      : utilization > 50
                      ? "bg-orange-500"
                      : "bg-emerald-500"
                  )}
                  style={{ width: `${utilization}%` }}
                />
              </div>
              
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Limit: <CurrencyDisplay amountUSD={Math.abs(parseFloat(account.balance.toString())) + parseFloat(account.availableBalance?.toString() || "0")} variant="compact" className="inline" /></span>
                <span>{utilization > 75 ? 'High' : utilization > 50 ? 'Moderate' : 'Good'}</span>
              </div>
            </div>
          ) : (
             <div className="group relative border border-border/60 flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-muted/50 hover:border-border/80">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground">Net Flow</p>
                <CurrencyDisplay
                  amountUSD={analytics.monthlyIncome - analytics.monthlySpending}
                  className={cn(
                    "text-lg font-bold",
                    (analytics.monthlyIncome - analytics.monthlySpending) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                  )}
                  formatOptions={{
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      <NetWorthChart mode='demo' height={200}/>
    </div>
  )
}
