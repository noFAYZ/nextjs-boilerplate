'use client';

import { useMemo, useState } from 'react';
import { ShoppingBag, Utensils, Home, Car, Zap, Wallet } from 'lucide-react';
import { useTopSpendingCategories } from '@/lib/queries/banking-queries';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { Badge } from '../ui/badge';
import { TimePeriodSelector, TimePeriod } from '../ui/time-period-selector';
import { CurrencyDisplay } from '../ui/currency-display';
import { RefetchLoadingOverlay } from '../ui/refetch-loading-overlay';
import type { LucideIcon } from 'lucide-react';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  groceries: ShoppingBag,
  dining: Utensils,
  shopping: ShoppingBag,
  home: Home,
  transport: Car,
  transportation: Car,
  utilities: Zap,
  fuel: Car,
  general: Wallet,
  entertainment: Utensils,
  health: Home,
};

// Use brand colors matching the design system
const CATEGORY_COLORS = [
  {
    light: 'oklch(0.5654 0.1326 44.2407)', // chart-1
    dark: 'oklch(0.5654 0.1326 44.2407)',
    gradient: 'from-[oklch(0.5654_0.1326_44.2407)] to-[oklch(0.5110_0.1345_39.2633)]',
    bg: 'bg-[oklch(0.5654_0.1326_44.2407)]'
  },
  {
    light: 'oklch(0.3816 0.0713 76.6811)', // chart-2
    dark: 'oklch(0.7129 0.0484 55.0557)',
    gradient: 'from-[oklch(0.3816_0.0713_76.6811)] to-[oklch(0.5654_0.1326_44.2407)]',
    bg: 'bg-[oklch(0.3816_0.0713_76.6811)] dark:bg-[oklch(0.7129_0.0484_55.0557)]'
  },
  {
    light: 'oklch(0.8842 0.0302 94.3733)', // chart-3
    dark: 'oklch(0.2217 0.0077 95.4081)',
    gradient: 'from-[oklch(0.8842_0.0302_94.3733)] to-[oklch(0.5654_0.1326_44.2407)]',
    bg: 'bg-[oklch(0.8842_0.0302_94.3733)] dark:bg-[oklch(0.2217_0.0077_95.4081)]'
  },
  {
    // Rustic Copper — rich earthy accent
    light: 'oklch(0.65 0.12 30)',
    dark: 'oklch(0.50 0.10 30)',
    gradient: 'from-[oklch(0.65_0.12_30)] to-[oklch(0.50_0.10_30)]',
    bg: 'bg-[oklch(0.65_0.12_30)] dark:bg-[oklch(0.50_0.10_30)]',
  },
  {
    light: 'oklch(0.5677 0.0418 42.7476)', // chart-5
    dark: 'oklch(0.5677 0.0418 42.7476)',
    gradient: 'from-[oklch(0.5677_0.1418_42.7476)] to-[oklch(0.5110_0.1345_39.2633)]',
    bg: 'bg-[oklch(0.5677_0.0418_42.7476)]'
  },
];

export function SpendingCategoriesWidget() {
  const [period, setPeriod] = useState<TimePeriod>('this_month');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Fetch data directly with selected period - get all categories for total
  const { data: spendingCategories, isLoading: spendingCategoriesLoading } = useTopSpendingCategories({
    period,
    limit: 50, // Get all categories for accurate total
  });

  // Check if organization data is being refetched
  const { isRefetching } = useOrganizationRefetchState();

  // Calculate total from ALL categories
  const totalSpending = useMemo(() => {
    if (!spendingCategories || spendingCategories.length === 0) return 0;
    return spendingCategories.reduce((sum, cat) => sum + cat.totalSpending, 0);
  }, [spendingCategories]);

  // Show only top 5 in chart
  const categoryData = useMemo(() => {
    if (!spendingCategories || spendingCategories.length === 0) {
      return [];
    }

    // Take only top 5 for visualization
    return spendingCategories.slice(0, 5).map((cat, index) => ({
      category: cat.category.charAt(0).toUpperCase() + cat.category.slice(1),
      amount: cat.totalSpending,
      percentage: cat.percentOfTotal,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
      icon: CATEGORY_ICONS[cat.category.toLowerCase()] || Wallet,
    }));
  }, [spendingCategories]);

  const topCategory = categoryData[0];
  const otherCategories = categoryData.slice(1, 5);

  // Always show top category in center when not hovering
  const displayedCategory = hoveredCategory
    ? categoryData.find(cat => cat.category === hoveredCategory)
    : topCategory;

  const formatPercentage = (percentage: number) => {
    return percentage.toFixed(1) + '%';
  };


  // Show skeleton when initially loading
  if (spendingCategoriesLoading) {
    return (
      <div className="rounded-xl border border-border bg-background dark:bg-card p-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-medium text-muted-foreground">Spending categories</h3>
          <TimePeriodSelector
            value={period}
            onChange={setPeriod}
            size="xs"
            variant="ghost"
          />
        </div>
        <div className="flex flex-col items-center justify-center h-60">
          <div className="relative w-40 h-40 mb-4">
            <div className="absolute inset-0 rounded-full bg-muted/50 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-2 w-full">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (categoryData.length === 0) {
    return (
      <div className="relative rounded-xl border border-border bg-background dark:bg-card p-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-medium text-muted-foreground">Spending categories</h3>
          <TimePeriodSelector
            value={period}
            onChange={setPeriod}
            size="xs"
            variant="ghost"
          />
        </div>
        <div className="relative py-12 text-center">
          <Wallet className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
          <p className="text-xs text-muted-foreground">
            No spending data available.
          </p>
          <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl border border-border bg-background dark:bg-card p-3 shadow-xs dark:shadow-none">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-muted-foreground">Spending categories</h3>
        <TimePeriodSelector
          value={period}
          onChange={setPeriod}
          size="xs"
          variant="ghost"
        />
      </div>

      {/* Modern Donut Chart */}
      <div className="flex flex-col items-center mb-4">
        <div className="relative w-44 h-44">
          {/* Total Spent Badge - Top Right */}
          <div className="absolute -top-1 -right-18 border text-foreground px-2.5 py-1 rounded-lg shadow-md z-10 dark:bg-muted/60">
            <div className="text-[8px] font-medium uppercase tracking-wider opacity-90">Total Spent</div>
            <CurrencyDisplay
              amountUSD={totalSpending}
              variant="compact"
              className="text-xs font-semibold"
              formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
            />
          </div>

          {/* SVG Donut Chart */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 176 176">
            <defs>
              {categoryData.map((cat, index) => (
                <linearGradient key={`grad-${index}`} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%" >
                  <stop offset="0%" stopColor={cat.color.light} className="dark:hidden" />
                  <stop offset="100%" stopColor={cat.color.light} stopOpacity="0.9" className="dark:hidden" />
                  <stop offset="0%" stopColor={cat.color.dark} className="hidden dark:block" />
                  <stop offset="100%" stopColor={cat.color.dark} stopOpacity="0.9" className="hidden dark:block" />
                </linearGradient>
              ))}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background Circle */}
            <circle
              cx="88"
              cy="88"
              r="72"
              fill="none"
              stroke="currentColor"
              strokeWidth="18"
              className="text-muted/15"
            />

            {/* Category Segments */}
            {categoryData.map((cat, index) => {
              const radius = 72;
              const strokeWidth = 22;
              const circumference = 2 * Math.PI * radius;
              const prevPercent = categoryData
                .slice(0, index)
                .reduce((sum, c) => sum + c.percentage, 0);

              // Calculate gap to prevent overlap with rounded caps
              // Each round cap extends by half the stroke width on each side
              const capRadius = strokeWidth /8;
              const gapInDegrees = (capRadius / radius) * (180 / Math.PI) * 1; // Gap in degrees
              const gapPercent = (gapInDegrees / 360) * 100; // Convert to percentage

              const segmentLength = ((cat.percentage - gapPercent) / 100) * circumference;
              const strokeDasharray = `${segmentLength} ${circumference}`;
              const strokeDashoffset = -((prevPercent / 100) * circumference + ((gapPercent / 100) * circumference * index));
              const isHovered = hoveredCategory === cat.category;

              return (
                <circle
                  key={cat.category}
                  cx="88"
                  cy="88"
                  r={radius}
                  fill="none"
                  stroke={`url(#gradient-${index})`}
                  strokeWidth={isHovered ? "32" : "24"}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="butt"
                  className="transition-all duration-75 cursor-pointer"
                  style={{
                    filter: isHovered ? 'url(#glow)' : 'none',
                    opacity: hoveredCategory && !isHovered ? 0.4 : 1
                  }}
                  onMouseEnter={() => setHoveredCategory(cat.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                />
              );
            })}
          </svg>

          {/* Center Display - Always shows a category */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
            {displayedCategory && (() => {
              const Icon = displayedCategory.icon;
              return (
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 ${displayedCategory.color.bg} shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                    {displayedCategory.category}
                  </span>
                  <CurrencyDisplay
                    amountUSD={displayedCategory.amount}
                    variant="default"
                    className="text-lg font-bold text-foreground leading-tight"
                    formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                  />
                  <Badge variant="outline" size="sm" className="text-[10px] h-4 font-medium mt-1 px-1.5">
                    {formatPercentage(displayedCategory.percentage)}
                  </Badge>
                </div>
              );
            })()}
          </div>
        </div>
      </div>


      {/* Other Categories - Compact Grid */}
      {otherCategories.length > 0 && (
        <div className=" grid grid-cols-2 gap-2">
          {otherCategories.map((category) => {
            const Icon = category.icon;
            const isHovered = hoveredCategory === category.category;

            return (
              <div
                key={category.category}
                className={`group relative  items-center gap-2 p-2 rounded-lg border transition-all duration-75 cursor-pointer ${
                  isHovered
                    ? 'bg-muted/80 border-border shadow-sm'
                    : 'bg-muted/60 border-border/40 hover:border-border hover:bg-card/70'
                }`}
                onMouseEnter={() => setHoveredCategory(category.category)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
             
<div className='flex items-center gap-2'>
                {/* Icon */}
                <div className={`w-7 h-7 rounded-md flex items-center justify-center ${category.color.bg} shadow-sm transition-transform duration-75`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[11px] font-semibold text-foreground capitalize truncate">
                      {category.category}
                    </span>
                
                  </div>
                   {/* Amount */}
                <div className="text-xs font-bold text-muted-foreground shrink-0">
                  <CurrencyDisplay
                    amountUSD={category.amount}
                    variant="compact"
                    className="inline"
                    formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                  />     <Badge variant="outline" size="sm" className="text-[10px] h-3.5 ml-1 px-1 font-semibold shrink-0">
                      {formatPercentage(category.percentage)}
                    </Badge>
                </div>

                </div>
</div>
               
              </div>
            );
          })}
        </div>
      )}
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
    </div>
  );
}
