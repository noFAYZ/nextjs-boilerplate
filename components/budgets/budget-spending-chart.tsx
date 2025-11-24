'use client';

import React, { useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { cn } from '@/lib/utils';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from '@/components/ui/chart';

interface SpendingData {
  month: string;
  formattedDate: string;
  spent: number;
  budget: number;
}

interface BudgetSpendingChartProps {
  budgetId: string;
  budgetName: string;
  budgetAmount: number;
  spent: number;
  className?: string;
  height?: number;
}

// Generate demo monthly spending data
function generateDemoData(budgetName: string, budgetAmount: number): SpendingData[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();

  return months.slice(0, currentMonth + 1).map((month, index) => {
    const baseSpending = budgetAmount * 0.6 + Math.random() * budgetAmount * 0.3;
    const variance = Math.sin(index * 0.5) * budgetAmount * 0.1;
    const spent = Math.round(Math.max(100, baseSpending + variance));

    return {
      month,
      formattedDate: month,
      spent,
      budget: budgetAmount,
    };
  });
}

// Custom dot component for line chart
interface CustomDotProps {
  cx?: number;
  cy?: number;
  fill?: string;
  stroke?: string;
}

const CustomSpendingDot = ({ cx, cy }: CustomDotProps) => {
  if (typeof cx !== 'number' || typeof cy !== 'number') return null;

  return (
    <g>
      <circle cx={cx} cy={cy} r={3} fill="white" stroke="var(--chart-1)" strokeWidth={2} />
    </g>
  );
};

// Custom tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as SpendingData;

  return (
    <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
      <div className="space-y-2">
        <time className="text-xs text-muted-foreground font-medium">{data.month}</time>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold">
            <CurrencyDisplay amountUSD={data.spent} variant="compact" />
          </span>
          <span className="text-xs text-muted-foreground">spent</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold">
            <CurrencyDisplay amountUSD={data.budget} variant="compact" />
          </span>
          <span className="text-xs text-muted-foreground">budget</span>
        </div>
      </div>
    </div>
  );
};

export function BudgetSpendingChart({
  budgetId,
  budgetName,
  budgetAmount,
  spent,
  className,
  height = 220,
}: BudgetSpendingChartProps) {
  // Generate demo data
  const chartData = useMemo(() => generateDemoData(budgetName, budgetAmount), [budgetName, budgetAmount]);

  // Calculate average spending
  const stats = useMemo(() => {
    if (chartData.length === 0) return { average: 0, total: 0, max: 0 };

    const totalSpending = chartData.reduce((sum, d) => sum + d.spent, 0);
    const average = Math.round(totalSpending / chartData.length);
    const spendings = chartData.map(d => d.spent);
    const max = Math.max(...spendings);

    return { average, total: totalSpending, max };
  }, [chartData]);

  const chartConfig = {
    spent: {
      label: 'Spent',
      color: 'var(--chart-1)',
    },
    budget: {
      label: 'Budget',
      color: 'var(--chart-2)',
    },
  } satisfies ChartConfig;

  return (
    <div className={cn('relative overflow-hidden bg-card rounded-md', className)} style={{ height }}>
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ left: -20, right: 20 }}
            barSize={45}
            barCategoryGap={12}
          >
            <defs>
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.6} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} strokeDasharray="3 3" />

            <XAxis
              dataKey="formattedDate"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={8}
              interval="preserveStartEnd"
            />

            <YAxis
              tick={false}
              tickLine={false}
              axisLine={false}
              width={30}
            />

            <ReferenceLine
              y={stats.average}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              opacity={0.4}
              label={{
                value: 'Avg',
                position: 'right',
                fill: 'var(--muted-foreground)',
                fontSize: 10,
                fontWeight: 500,
              }}
            />

            <ChartTooltip content={<CustomTooltip />} cursor={false} />

            <Bar
              dataKey="spent"
              fill="url(#spendingGradient)"
              radius={[8, 8, 0, 0]}
              isAnimationActive={true}
              animationDuration={500}
              activeBar={false}
            />

            <Line
              dataKey="spent"
              stroke="var(--chart-1)"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={<CustomSpendingDot />}
              isAnimationActive={true}
              animationDuration={500}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
