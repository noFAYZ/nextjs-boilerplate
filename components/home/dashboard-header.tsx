'use client';

import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Target, ArrowUpLeft, ArrowDownLeft } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Card } from '../ui/card';
import { MemoryArrowTopRight, SolarPieChart2BoldDuotone } from '../icons/icons';
import { CurrencyDisplay } from '../ui/currency-display';
import { useAllAccounts } from '@/lib/queries';
import { NetWorthChart } from '../networth/networth-chart';
import { NetWorthBreakdownShowcase } from '../charts/networth-breakdown-showcase';

/**
 * Dashboard Header Component - Matches exact design from reference image
 * Uses static demo data for now
 */
export function DashboardHeader() {
  const user = useAuthStore((state) => state.user);
  const { data: accountsData, isLoading, refetch } = useAllAccounts();

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

  const netWorth = useMemo(() => {
    const typedData = accountsData as AccountsResponse | undefined;
    return typedData?.summary?.totalNetWorth ?? 0;
  }, [accountsData?.summary?.totalNetWorth]);
    /**
   * Get summary data with asset and liability breakdown
   * This provides the same calculation as the sidebar
   */
    const summaryData = useMemo(() => {
      const typedData = accountsData as AccountsResponse | undefined;
      return typedData?.summary || null;
    }, [accountsData?.summary]);
  
    // Calculate assets and liabilities percentages (same as sidebar)
    const { assetsPercent, liabilitiesPercent } = useMemo(() => {
      if (!summaryData) return { assetsPercent: 0, liabilitiesPercent: 0 };
  
      const totalAssets = summaryData.totalAssets || 0;
      const totalLiabilities = Math.abs(summaryData.totalLiabilities || 0);
      const total = totalAssets + totalLiabilities;
  
      const assetsPercent = total > 0 ? Math.round((totalAssets / total) * 100) : 0;
      const liabilitiesPercent = 100 - assetsPercent;
  
      return { assetsPercent, liabilitiesPercent };
    }, [summaryData]);

 
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
      <div className="flex  justify-between items-center gap-8  p-4 pb-0 bg-muted rounded-2xl  ">
        {/* Left: Net Worth Section */}
     

     
  {/* Main Card – Pure Apple Glass */}
  <Card className="p-3 w-[40%]  border-none bg-transparent shadow-none hover:shadow-none" >
   

    {/* Content */}
    <div className="relative space-y-6">

      {/* Header – Clean & Hierarchical */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium text-black/50 dark:text-white/50 tracking-wider uppercase">
            Total Net Worth
          </p>
          <h2 className="mt-2 text-4xl font-semibold text-black dark:text-white tracking-tight">
            {netWorth ? (
              <CurrencyDisplay
                amountUSD={netWorth}
                variant="3xl"
                className=" font-medium"
              />
            ) : (
              "—"
            )}
          </h2>
        </div>

        {/* Subtle positive trend */}
        {netWorth > 0 && (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 11l5-5 5 5" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l5-5 5 5" />
            </svg>
            <span className="text-sm font-medium">+12.4%</span>
          </div>
        )}
      </div>

{/* Allocation Section - Assets vs Liabilities */}
{(summaryData?.totalAssets ?? 0) > 0 || (summaryData?.totalLiabilities ?? 0) > 0 ? (
  <div className="space-y-3">
    {/* Allocation bar with SVG pattern overlays */}
    <div className="relative w-full h-8 rounded-sm overflow-hidden bg-black/5 dark:bg-white/5 backdrop-blur-md shadow-inner border border-black/5 dark:border-white/10">
      {/* Glossy overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 to-black/10 mix-blend-overlay" />

      {/* SVG Patterns Definition */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <defs>
          {/* Assets: Diagonal lines pattern */}
          <pattern id="pattern-ASSETS-BAR" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="white" strokeWidth="1.2" strokeOpacity="0.2" />
          </pattern>

          {/* Liabilities: Dots pattern */}
          <pattern id="pattern-LIABILITIES-BAR" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.2" fill="white" fillOpacity="0.18" />
          </pattern>
        </defs>
      </svg>

      {/* Assets bar */}
      {assetsPercent > 0 && (
        <div
          style={{ width: `${assetsPercent}%` }}
          className="h-full relative inline-block transition-all duration-500 ease-out group"
        >
          {/* Base color */}
          <div className="h-full w-full bg-[rgb(188,201,135)]" />

          {/* Pattern overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <rect width="100" height="100" fill="url(#pattern-ASSETS-BAR)" />
          </svg>

          {/* Hover highlight */}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </div>
      )}

      {/* Liabilities bar */}
      {liabilitiesPercent > 0 && (
        <div
          style={{ width: `${liabilitiesPercent}%` }}
          className="h-full relative inline-block transition-all duration-500 ease-out group"
        >
          {/* Base color */}
          <div className="h-full w-full bg-[#F0B9A9]" />

          {/* Pattern overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <rect width="100" height="100" fill="url(#pattern-LIABILITIES-BAR)" />
          </svg>

          {/* Hover highlight */}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </div>
      )}
    </div>

    {/* Legend */}
    <div className="grid grid-cols-2 gap-2.5">
      {assetsPercent > 0 && (
        <div className="flex items-center gap-2">
          {/* Color dot */}
          <div className="w-3 h-3 rounded-full shadow-sm bg-[rgb(188,201,135)]" />

          {/* Text */}
          <div className="flex items-baseline gap-1">
            <span className="text-[12px] font-medium text-black/70 dark:text-white/70">
              Assets
            </span>
            <span className="text-[12px] font-semibold text-black dark:text-white">
              {assetsPercent}%
            </span>
          </div>
        </div>
      )}
      {liabilitiesPercent > 0 && (
        <div className="flex items-center gap-2">
          {/* Color dot */}
          <div className="w-3 h-3 rounded-full shadow-sm bg-[#F0B9A9]" />

          {/* Text */}
          <div className="flex items-baseline gap-1">
            <span className="text-[12px] font-medium text-black/70 dark:text-white/70">
              Liabilities
            </span>
            <span className="text-[12px] font-semibold text-black dark:text-white">
              {liabilitiesPercent}%
            </span>
          </div>
        </div>
      )}
    </div>
  </div>
) : null}


  
    </div>

   
  </Card>



        {/* Right: Metrics Cards */}
        <div className='flex gap-4  w-full'>
            {/*      <div className=" grid grid-cols-1  gap-1">
           Income Card - Bright Lime Green
          <Card className="rounded-lg  w-40 h-16 bg-[hsl(75.79,100%,70.2%)]">
            <div className="flex items-center gap-2  ">
              <ArrowDownLeft className="h-5 w-5 bg-[hsl(76,65%,54%)] text-[hsl(76,47%,27%)]" strokeWidth={2.5} />
              <h3 className="text-gray-800 text-xs upp">Income</h3>
            </div>
            <div className="text-lg text-gray-800 text-end ">
              {formatCurrency(totalIncome)}
            </div>
          </Card>


          <Card className="rounded-lg  w-40 h-16 bg-[rgb(255,220,210)] d">
            <div className="flex items-center gap-2  ">
              <MemoryArrowTopRight className="h-5 w-5 bg-[rgb(240,185,169)]  text-[rgb(141,62,40)]" strokeWidth={2.5} />
              <h3 className=" text-xs text-gray-700">Expense</h3>
            </div>


            <div className="text-lg text-end text-gray-800">
              {formatCurrency(totalExpense)}
            </div>
          </Card> */}



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
          </Card>
        </div>*/}
        <NetWorthChart mode="demo" height={150} className="border-0 bg-transparent shadow-none border-none   -mr-4 -mt-2  "  compact/>
       
        </div>
          
      </div> 
    </div>
  );
}
