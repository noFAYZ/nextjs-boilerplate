'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CurrencyDisplay } from '@/components/ui/currency-display'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { calculateCreditUtilization } from '@/lib/utils'
import CompactStatCard from '../ui/StatsCard'
import { LetsIconsTimeProgressDuotone } from '../icons/icons'

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
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between  rounded">
        {/* Left Section — Account Info */}
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'h-14 w-14 rounded-2xl flex items-center justify-center shadow-md text-white bg-gradient-to-br',
              accountConfig.color
            )}
          >
            <IconComponent className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">{account.name}</h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>{account.institutionName}</span>
              <Separator orientation="vertical" className="h-3" />
              <span className="font-mono">****{account.accountNumber.slice(-4)}</span>
              <Badge variant="secondary" className="text-xs">
                {accountConfig.label}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Section — Balance */}
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-1">
            {account.type === 'CREDIT_CARD' ? 'Available Credit' : 'Available Balance'}
          </p>
          <CurrencyDisplay
            amountUSD={parseFloat(
              account.availableBalance?.toString() || account.balance.toString()
            )}
            className="text-3xl font-bold text-foreground"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {account.type === 'CREDIT_CARD' ? 'Balance Owed: ' : 'Ledger: '}
            <CurrencyDisplay
              amountUSD={parseFloat(account.balance.toString())}
              variant="compact"
              className={cn(
                'inline font-semibold',
                account.type === 'CREDIT_CARD' && 'text-red-700 dark:text-red-400'
              )}
            />
          </p>
        </div>
      </div>

{/* STATS GRID */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* LEFT COLUMN: Income + Expenses side by side */}
  <div className="flex flex-col sm:flex-row gap-4 w-full">
    {/* Income / Deposits */}
    <div className="flex-1">
      <CompactStatCard
        title={
          account.type === "CREDIT_CARD"
            ? "Payments"
            : account.type === "SAVINGS"
            ? "Deposits"
            : "Income"
        }
        variant="success"
        value={
          <CurrencyDisplay
            amountUSD={analytics.monthlyIncome}
            className="text-base font-semibold"
            formatOptions={{
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }}
          />
        }
        icon={ArrowUpRight}
      />
    </div>

    {/* Expenses / Withdrawals */}
    <div className="flex-1">
      <CompactStatCard
        title={
          account.type === "CREDIT_CARD"
            ? "Spending"
            : account.type === "SAVINGS"
            ? "Withdrawals"
            : "Expenses"
        }
        variant="destructive"
        value={
          <CurrencyDisplay
            amountUSD={analytics.monthlySpending}
            className="text-base font-semibold"
            formatOptions={{
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }}
          />
        }
        icon={ArrowDownRight}
      />
    </div>
  </div>

  {/* RIGHT COLUMN: Credit Utilization */}
  {account.type === "CREDIT_CARD" && (
    <div className="w-full">
      <CompactStatCard
        title="Credit Utilization"
        variant="primary"
        icon={LetsIconsTimeProgressDuotone}
        value={
          <div className="space-y-1.5">
            {/* Progress Bar */}
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500 ease-out",
                  utilization > 75
                    ? "bg-red-500"
                    : utilization > 50
                    ? "bg-orange-400"
                    : "bg-green-500"
                )}
                style={{ width: `${utilization}%` }}
              />
            </div>

            {/* Bottom Info */}
            <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground">
              <span>
                Limit:{" "}
                <CurrencyDisplay
                  amountUSD={
                    Math.abs(parseFloat(account.balance.toString())) +
                    parseFloat(account.availableBalance?.toString() || "0")
                  }
                  variant="compact"
                  className="inline font-medium"
                />
              </span>
              <span
                className={cn(
                  "font-semibold",
                  utilization > 75
                    ? "text-red-600 dark:text-red-400"
                    : utilization > 50
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-lime-600 dark:text-lime-400"
                )}
              >
                {utilization}%{" "}
                {utilization > 75
                  ? "(High)"
                  : utilization > 50
                  ? "(Moderate)"
                  : "(Good)"}
              </span>
            </div>
          </div>
        }
      />
    </div>
  )}
</div>

    </div>
  )
}
