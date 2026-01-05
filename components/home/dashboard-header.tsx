'use client';

import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Target, ArrowUpLeft, ArrowDownLeft } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Card } from '../ui/card';
import { MemoryArrowTopRight, SolarPieChart2BoldDuotone } from '../icons/icons';
import { CurrencyDisplay } from '../ui/currency-display';

/**
 * Dashboard Header Component - Matches exact design from reference image
 * Uses static demo data for now
 */
export function DashboardHeader() {
  const user = useAuthStore((state) => state.user);

  // Get user name
  const firstName = useMemo(() => {
    return user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Alex';
  }, [user]);

  // Static demo data
  const netWorthAmount = 124000;
  const assetPercentage = 74;
  const totalIncome = 5600;
  const totalExpense = 2460;
  const budgetLimit = 3300;
  const budgetSpent = 2460;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div>
      {/* Greeting 

     <div className="flex items-center justify-between mb-8">
  <h1 className="text-2xl font-medium text-foreground">
    Hi, {firstName}
  </h1>

  <div className="relative  flex justify-end  ">
  <img
    src="/feature/2.webp" // update path as needed
    alt="Preview"
    className="z-10 h-16 w-16 rounded-lg  object-cover"
  />

 
  <div className="pointer-events-none absolute inset-0 rounded-r-full bg-gradient-to-l " />
</div>
</div>*/}

      {/* Main layout: Networth on left, Metrics on right */}
      <div className="flex flex-wrap justify-between items-end gap-8">
        {/* Left: Net Worth Section */}
        <div className='space-y-4 gap-2'>
          <p className="text-xs font-medium text-muted-foreground  tracking-wider mb-2">
            Total Networth
          </p>
          
          <CurrencyDisplay amountUSD={netWorthAmount} variant='3xl' />

          {/* Asset/Liability Progress Bar */}
          <div className="space-y-2 mt-4">
            <div className="flex gap-0 h-5 rounded-lg overflow-hidden bg-transparent w-full">
              {/* Assets bar - green */}
              <div
                className="bg-[rgb(164,204,52)]"
                style={{ width: `${assetPercentage}%` }}
              />
              {/* Liabilities bar - yellow */}
              <div
                className="bg-[rgb(255,220,210)]"
                style={{ width: `${100 - assetPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium w-64">
              <span>Assets: {assetPercentage}%</span>
              <span>Liabilities: {100 - assetPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Right: Metrics Cards */}
        <div className=" grid grid-cols-2  gap-1">
          {/* Income Card - Bright Lime Green */}
          <Card className="rounded-lg  w-40 h-16 bg-[hsl(75.79,100%,70.2%)]">
            <div className="flex items-center gap-2  ">
              <ArrowDownLeft className="h-5 w-5 bg-[hsl(76,65%,54%)] text-[hsl(76,47%,27%)]" strokeWidth={2.5} />
              <h3 className="text-gray-800 text-xs upp">Income</h3>
            </div>
            <div className="text-lg text-gray-800 text-end ">
              {formatCurrency(totalIncome)}
            </div>
          </Card>

          {/* Expense Card - Light Pink/Salmon */}
          <Card className="rounded-lg  w-40 h-16 bg-[rgb(255,220,210)] d">
            <div className="flex items-center gap-2  ">
              <MemoryArrowTopRight className="h-5 w-5 bg-[rgb(240,185,169)]  text-[rgb(141,62,40)]" strokeWidth={2.5} />
              <h3 className=" text-xs text-gray-700">Expense</h3>
            </div>


            <div className="text-lg text-end text-gray-800">
              {formatCurrency(totalExpense)}
            </div>
          </Card>

          {/* Budget Limit Card - Bright Lime Green 
          <Card className="rounded-lg  col-span-2    ">
         
            <div className='flex text-[11px] items-end gap-1'>
  <span className='text-base font-bold' >
                {formatCurrency(budgetSpent)}  
              </span>of
              <span >
                 {formatCurrency(budgetLimit)}
              </span>
            </div>
           
            <div className="space-y-2 flex items-center gap-4 font-bold text-sm">
              <div className="w-full bg-[rgb(255,246,182)] rounded-lg h-4 overflow-hidden">
                <div
                  className="bg-[rgb(173,210,72)] h-full transition-all"
                  style={{
                    width: `${Math.min((budgetSpent / budgetLimit) * 100, 100)}%`,
                  }}
                />
              </div>${Math.min((budgetSpent / budgetLimit) * 100, 100).toFixed()}%
            

            </div>
          </Card>*/}
        </div>
      </div>
    </div>
  );
}
