'use client';

/**
 * Spending by Category Chart Component
 * Displays pie/bar chart of spending across categories
 */

import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type CategorySpending } from '@/lib/types/budget-analytics';

interface SpendingByCategoryChartProps {
  data: CategorySpending[];
  chartType?: 'pie' | 'bar';
  totalSpending?: number;
}

const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#f97316', // orange
];

export function SpendingByCategoryChart({
  data,
  chartType = 'pie',
  totalSpending,
}: SpendingByCategoryChartProps) {
  interface TooltipPayload {
    payload: CategorySpending;
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
    if (active && payload?.length) {
      const data = payload[0].payload;
      const percent = totalSpending ? ((data.amount / totalSpending) * 100).toFixed(1) : '0';
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-primary">${data.amount.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">{percent}% of total</p>
        </div>
      );
    }
    return null;
  };

  if (chartType === 'bar') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="var(--primary)" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="amount"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Category List */}
        <div className="mt-6 space-y-2">
          {data.map((category, index) => (
            <div key={category.name} className="flex items-center justify-between p-2 rounded hover:bg-secondary">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium">{category.name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">${category.amount.toFixed(2)}</p>
                {totalSpending && (
                  <p className="text-xs text-muted-foreground">
                    {((category.amount / totalSpending) * 100).toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
