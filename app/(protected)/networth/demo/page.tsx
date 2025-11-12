'use client';

import { useState } from 'react';
import { NetWorthChart } from '@/components/networth/networth-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, LineChart, Zap } from 'lucide-react';
import Link from 'next/link';
import type { TimePeriod } from '@/lib/types/networth';

type DemoScenario = 'growth' | 'volatile' | 'decline' | 'recovery' | 'steady';

const scenarios: {
  value: DemoScenario;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    value: 'growth',
    label: 'Steady Growth',
    description: 'Consistent upward trajectory with minimal volatility',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'text-green-600',
  },
  {
    value: 'volatile',
    label: 'High Volatility',
    description: 'Significant ups and downs with unpredictable swings',
    icon: <Activity className="h-5 w-5" />,
    color: 'text-orange-600',
  },
  {
    value: 'decline',
    label: 'Market Decline',
    description: 'Downward trend representing market corrections',
    icon: <TrendingDown className="h-5 w-5" />,
    color: 'text-red-600',
  },
  {
    value: 'recovery',
    label: 'V-Shaped Recovery',
    description: 'Initial decline followed by strong recovery',
    icon: <Zap className="h-5 w-5" />,
    color: 'text-blue-600',
  },
  {
    value: 'steady',
    label: 'Steady & Stable',
    description: 'Low volatility with slow, consistent growth',
    icon: <LineChart className="h-5 w-5" />,
    color: 'text-purple-600',
  },
];

export default function NetWorthDemoPage() {
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario>('growth');
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1m');

  return (
    <div className=" max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/networth">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Net Worth
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Net Worth Chart Demo</h1>
          <p className="text-muted-foreground mt-1">
            Explore different financial scenarios with interactive demo data
          </p>
        </div>
      </div>

      {/* Scenario Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {scenarios.map((scenario) => (
          <Card
            key={scenario.value}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedScenario === scenario.value
                ? 'ring-2 ring-primary shadow-md'
                : 'hover:border-primary/50'
            }`}
            onClick={() => setSelectedScenario(scenario.value)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg bg-muted ${scenario.color}`}>
                  {scenario.icon}
                </div>
                {selectedScenario === scenario.value && (
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                )}
              </div>
              <CardTitle className="text-sm mt-3">{scenario.label}</CardTitle>
              <CardDescription className="text-xs">
                {scenario.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Main Chart Display */}
      <Card>
        <CardHeader>
          <CardTitle>
            {scenarios.find(s => s.value === selectedScenario)?.label} Scenario
          </CardTitle>
          <CardDescription>
            Interactive chart showing simulated {selectedScenario} pattern over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NetWorthChart
            mode="demo"
            demoScenario={selectedScenario}
            height={400}
            showPeriodFilter
            showMetrics
            showComparison
            defaultPeriod={selectedPeriod}
            onPeriodChange={(period) => setSelectedPeriod(period)}
          />
        </CardContent>
      </Card>

      {/* Comparison View */}
      <Card>
        <CardHeader>
          <CardTitle>All Scenarios Comparison</CardTitle>
          <CardDescription>
            Compare different scenarios side by side in compact view
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="1m" onValueChange={(v) => setSelectedPeriod(v as TimePeriod)}>
            <TabsList className="mb-6">
              <TabsTrigger value="1w">1 Week</TabsTrigger>
              <TabsTrigger value="1m">1 Month</TabsTrigger>
              <TabsTrigger value="3m">3 Months</TabsTrigger>
              <TabsTrigger value="1y">1 Year</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedPeriod} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {scenarios.map((scenario) => (
                  <Card key={scenario.value}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-md bg-muted ${scenario.color}`}>
                          {scenario.icon}
                        </div>
                        <div>
                          <CardTitle className="text-sm">{scenario.label}</CardTitle>
                          <CardDescription className="text-xs">
                            {scenario.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <NetWorthChart
                        mode="demo"
                        demoScenario={scenario.value}
                        height={200}
                        compact
                        showPeriodFilter={false}
                        defaultPeriod={selectedPeriod}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Features Info */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle>Demo Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">🎯 Multiple Scenarios</h4>
              <p className="text-muted-foreground text-xs">
                Test the chart with 5 different financial patterns including growth,
                volatility, decline, recovery, and steady performance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📊 Realistic Data</h4>
              <p className="text-muted-foreground text-xs">
                Demo data includes realistic assets, liabilities, and net worth
                calculations with appropriate volatility and trends.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">⚡ No API Required</h4>
              <p className="text-muted-foreground text-xs">
                Demo mode generates data locally without making API calls,
                perfect for testing and presentations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Example */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">How to Use Demo Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
            <pre>{`// Import the component
import { NetWorthChart } from '@/components/networth/networth-chart';

// Use demo mode
<NetWorthChart
  mode="demo"
  demoScenario="growth"  // growth | volatile | decline | recovery | steady
  height={400}
  showPeriodFilter
  showMetrics
  showComparison
/>

// Use live mode (default)
<NetWorthChart
  mode="live"  // Fetches real data from API
  height={400}
/>`}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
