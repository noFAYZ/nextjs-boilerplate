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

interface ContributionData {
  month: string;
  formattedDate: string;
  contributions: number;
  cumulativeTarget: number;
  target: number;
}

interface GoalContributionsChartProps {
  goalId: string;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContributions?: number;
  className?: string;
  height?: number;
}

// Generate demo monthly contribution data
function generateDemoData(goalName: string): ContributionData[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();

  let cumulativeTarget = 0;
  return months.slice(0, currentMonth + 1).map((month, index) => {
    const baseContribution = 150 + Math.random() * 200;
    const variance = Math.sin(index * 0.5) * 50;
    const contributions = Math.round(baseContribution + variance);
    const target = 180;
    cumulativeTarget += target;

    return {
      month,
      formattedDate: month,
      contributions: Math.max(80, contributions),
      cumulativeTarget,
      target,
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

const CustomContributionDot = ({ cx, cy }: CustomDotProps) => {
  if (typeof cx !== 'number' || typeof cy !== 'number') return null;

  return (
    <g>
      <circle cx={cx} cy={cy} r={3} fill="white" stroke="var(--chart-1)" strokeWidth={2} />
    </g>
  );
};

// Custom tooltip matching networth-chart style
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ContributionData }> }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as ContributionData;

  return (
    <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
      <div className="space-y-2">
        <time className="text-xs text-muted-foreground font-medium">{data.month}</time>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold">
            <CurrencyDisplay amountUSD={data.contributions} variant="compact" />
          </span>
          <span className="text-xs text-muted-foreground">contributed</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold">
            <CurrencyDisplay amountUSD={data.cumulativeTarget} variant="compact" />
          </span>
          <span className="text-xs text-muted-foreground">target</span>
        </div>
      </div>
    </div>
  );
};

export function GoalContributionsChart({
  goalId,
  goalName,
  targetAmount,
  currentAmount,
  monthlyContributions,
  className,
  height = 350,
}: GoalContributionsChartProps) {
  // Generate demo data
  const chartData = useMemo(() => generateDemoData(goalName), [goalName]);

  // Calculate stats
  const stats = useMemo(() => {
    if (chartData.length === 0) return { average: 0, total: 0, max: 0, isPositive: false };

    const totalContributions = chartData.reduce((sum, d) => sum + d.contributions, 0);
    const average = Math.round(totalContributions / chartData.length);
    const contributions = chartData.map(d => d.contributions);
    const max = Math.max(...contributions);
    const lastMonth = chartData[chartData.length - 1];
    const previousMonth = chartData[chartData.length - 2];

    const isPositive = !previousMonth || lastMonth.contributions >= previousMonth.contributions;

    return { average, total: totalContributions, max, isPositive };
  }, [chartData]);

  // Calculate average line value
  const averageLineValue = useMemo(() => {
    return stats.average;
  }, [stats.average]);

  const chartConfig = {
    contributions: {
      label: 'Contributions',
      color: 'var(--chart-1)',
    },
    cumulativeTarget: {
      label: 'Target Progress',
      color: 'var(--chart-2)',
    },
  } satisfies ChartConfig;

  return (
    <div className={cn('relative overflow-hidden bg-card rounded-md', className)} style={{ height }}>
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ left:-20,right: 20, }}
              barSize={45}
              barCategoryGap={12}
            >
              <defs>
                <linearGradient id="contributionGradient" x1="0" y1="0" x2="0" y2="1">
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
                y={averageLineValue}
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
                dataKey="contributions"
                fill="url(#contributionGradient)"
                radius={[8, 8, 0, 0]}
                isAnimationActive={true}
                animationDuration={500}
                activeBar={false}
              />

              <Line
                dataKey="contributions"
                stroke="var(--chart-1)"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={<CustomContributionDot />}
                isAnimationActive={true}
                animationDuration={500}
              />
            </ComposedChart>
          </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
