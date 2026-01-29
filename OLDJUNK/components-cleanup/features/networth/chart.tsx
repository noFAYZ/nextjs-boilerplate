"use client"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useNetWorthHistory, useNetWorthPerformance } from "@/lib/queries"
import { SnapshotGranularity } from "@/lib/types/networth"
export const description = "A linear area chart"

interface ChartDataPoint {
    date: string;
    totalNetWorth: number;
    totalAssets: number;
    totalLiabilities: number;
    change: number;
    changePercent: number;
    formattedDate: string;
  }



const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig
export function ChartAreaLinear() {

      // Live data fetching
  const { data: liveHistory, isLoading: liveLoading, error: liveError, refetch: liveRefetch } = useNetWorthHistory(
    {
      period: '1m',
      granularity: SnapshotGranularity.MONTHLY
  
    }
  );

  const { data: livePerformance } = useNetWorthPerformance(
    {
      period: '1w',

    }
  );

  console.log("live hsis",liveHistory)


  return (
    <Card>
    <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              strokeWidth={22}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="desktop"
              type="linear"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              strokeWidth={3}
            />
          </AreaChart>
        </ChartContainer>
    </Card>
  )
}