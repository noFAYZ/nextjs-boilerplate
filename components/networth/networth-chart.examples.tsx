/**
 * NetWorthChart Component Examples
 *
 * This file contains ready-to-use examples of the NetWorthChart component
 * in different configurations. Copy and paste these into your components.
 */

import { NetWorthChart } from './networth-chart';

/* ============================================
   EXAMPLE 1: Default Live Chart
   ============================================
   The most basic usage with live data from API
*/
export function Example1_BasicLiveChart() {
  return (
    <div className="w-full max-w-4xl">
      <NetWorthChart />
    </div>
  );
}

/* ============================================
   EXAMPLE 2: Full-Featured Chart
   ============================================
   All features enabled with custom height
*/
export function Example2_FullFeatured() {
  return (
    <div className="w-full max-w-6xl">
      <NetWorthChart
        height={500}
        showPeriodFilter
        showMetrics
        showComparison
        defaultPeriod="3m"
        onPeriodChange={(period) => {
          console.log('Period changed to:', period);
        }}
      />
    </div>
  );
}

/* ============================================
   EXAMPLE 3: Compact Chart in Card
   ============================================
   Minimal chart perfect for dashboards
*/
export function Example3_CompactCard() {
  return (
    <div className="w-full max-w-md border rounded-lg p-4 bg-card">
      <h3 className="text-sm font-semibold mb-3">Net Worth</h3>
      <NetWorthChart
        compact
        height={150}
        showPeriodFilter
        defaultPeriod="1m"
      />
    </div>
  );
}

/* ============================================
   EXAMPLE 4: Demo Mode - Growth Scenario
   ============================================
   Perfect for presentations and testing
*/
export function Example4_DemoGrowth() {
  return (
    <div className="w-full max-w-4xl">
      <NetWorthChart
        mode="demo"
        demoScenario="growth"
        height={400}
        showPeriodFilter
        showMetrics
        defaultPeriod="1y"
      />
    </div>
  );
}

/* ============================================
   EXAMPLE 5: Demo Mode - All Scenarios Grid
   ============================================
   Display all demo scenarios side by side
*/
export function Example5_AllScenarios() {
  const scenarios = [
    { id: 'growth', name: 'Steady Growth', description: 'Consistent upward trend' },
    { id: 'volatile', name: 'High Volatility', description: 'Significant swings' },
    { id: 'decline', name: 'Market Decline', description: 'Downward correction' },
    { id: 'recovery', name: 'V-Shaped Recovery', description: 'Strong rebound' },
    { id: 'steady', name: 'Steady & Stable', description: 'Low volatility' },
  ] as const;

  return (
    <div className="w-full space-y-8">
      <h2 className="text-2xl font-bold">Demo Scenarios</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="border rounded-lg p-4 bg-card">
            <div className="mb-3">
              <h3 className="font-semibold">{scenario.name}</h3>
              <p className="text-xs text-muted-foreground">{scenario.description}</p>
            </div>
            <NetWorthChart
              mode="demo"
              demoScenario={scenario.id}
              compact
              height={180}
              showPeriodFilter={false}
              defaultPeriod="3m"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   EXAMPLE 6: Responsive Dashboard Widget
   ============================================
   Adapts to different screen sizes
*/
export function Example6_ResponsiveDashboard() {
  return (
    <div className="w-full">
      {/* Desktop: Full chart */}
      <div className="hidden lg:block">
        <NetWorthChart
          height={350}
          showPeriodFilter
          showMetrics
          showComparison
        />
      </div>

      {/* Tablet: Compact chart */}
      <div className="hidden md:block lg:hidden">
        <NetWorthChart
          height={250}
          showPeriodFilter
          showMetrics
        />
      </div>

      {/* Mobile: Minimal chart */}
      <div className="block md:hidden">
        <NetWorthChart
          compact
          height={150}
          showPeriodFilter={false}
        />
      </div>
    </div>
  );
}

/* ============================================
   EXAMPLE 7: Chart with External Controls
   ============================================
   Control chart externally with React state
*/
export function Example7_ExternalControls() {
  const [period, setPeriod] = React.useState<'1m' | '3m' | '1y'>('1m');
  const [scenario, setScenario] = React.useState<'growth' | 'volatile'>('growth');

  return (
    <div className="w-full max-w-4xl space-y-4">
      {/* External Controls */}
      <div className="flex gap-4 items-center border rounded-lg p-4 bg-card">
        <div>
          <label className="text-sm font-medium mb-2 block">Scenario:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setScenario('growth')}
              className={`px-3 py-1.5 text-sm rounded ${
                scenario === 'growth' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              Growth
            </button>
            <button
              onClick={() => setScenario('volatile')}
              className={`px-3 py-1.5 text-sm rounded ${
                scenario === 'volatile' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              Volatile
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Period:</label>
          <div className="flex gap-2">
            {(['1m', '3m', '1y'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-sm rounded ${
                  period === p ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <NetWorthChart
        mode="demo"
        demoScenario={scenario}
        defaultPeriod={period}
        height={400}
        showMetrics
        onPeriodChange={(newPeriod) => {
          if (newPeriod === '1m' || newPeriod === '3m' || newPeriod === '1y') {
            setPeriod(newPeriod);
          }
        }}
      />
    </div>
  );
}

/* ============================================
   EXAMPLE 8: Multiple Period Comparison
   ============================================
   Show same data across different time periods
*/
export function Example8_PeriodComparison() {
  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold">Period Comparison</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(['1w', '1m', '3m', '1y'] as const).map((period) => (
          <div key={period} className="border rounded-lg p-3 bg-card">
            <h3 className="text-sm font-semibold mb-3 uppercase">{period}</h3>
            <NetWorthChart
              mode="demo"
              demoScenario="growth"
              compact
              height={120}
              showPeriodFilter={false}
              defaultPeriod={period}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   EXAMPLE 9: Loading and Error States
   ============================================
   Shows how the chart handles different states
*/
export function Example9_StateHandling() {
  return (
    <div className="w-full max-w-4xl space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Normal State (with data)</h3>
        <NetWorthChart mode="demo" demoScenario="growth" height={300} />
      </div>

      {/* Note: Error and loading states are automatically handled by the component
          when using live mode and the API is unavailable or loading */}
    </div>
  );
}

/* ============================================
   EXAMPLE 10: Portfolio Dashboard
   ============================================
   Real-world usage in a portfolio dashboard
*/
export function Example10_PortfolioDashboard() {
  return (
    <div className="w-full max-w-7xl space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 bg-card">
          <p className="text-sm text-muted-foreground">Total Net Worth</p>
          <p className="text-3xl font-bold">$267,450</p>
          <p className="text-sm text-green-600">+12.5% this month</p>
        </div>
        <div className="border rounded-lg p-4 bg-card">
          <p className="text-sm text-muted-foreground">Total Assets</p>
          <p className="text-3xl font-bold">$367,450</p>
        </div>
        <div className="border rounded-lg p-4 bg-card">
          <p className="text-sm text-muted-foreground">Total Liabilities</p>
          <p className="text-3xl font-bold">$100,000</p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="border rounded-lg p-6 bg-card">
        <NetWorthChart
          mode="demo"
          demoScenario="growth"
          height={400}
          showPeriodFilter
          showMetrics
          showComparison
          defaultPeriod="1y"
        />
      </div>

      {/* Compact Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 bg-card">
          <h3 className="font-semibold mb-3">Assets Growth</h3>
          <NetWorthChart
            mode="demo"
            demoScenario="growth"
            compact
            height={150}
            defaultPeriod="3m"
          />
        </div>
        <div className="border rounded-lg p-4 bg-card">
          <h3 className="font-semibold mb-3">Recent Activity</h3>
          <NetWorthChart
            mode="demo"
            demoScenario="volatile"
            compact
            height={150}
            defaultPeriod="1m"
          />
        </div>
      </div>
    </div>
  );
}

// Import React for Example 7
import * as React from 'react';

/* ============================================
   EXAMPLE 11: Chart in Modal/Dialog
   ============================================
   Using the chart in a modal or dialog
*/
export function Example11_ModalChart() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
      >
        View Chart
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Net Worth Timeline</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted rounded-lg"
              >
                ✕
              </button>
            </div>
            <NetWorthChart
              mode="demo"
              demoScenario="growth"
              height={400}
              showPeriodFilter
              showMetrics
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================
   USAGE NOTES
   ============================================

   1. All examples use demo mode for easy testing
   2. To use live data, simply remove the mode="demo" prop
   3. The component handles loading, error, and empty states automatically
   4. All monetary values are formatted automatically
   5. The component is fully responsive
   6. Dark mode is supported out of the box

   Quick Tips:
   - Use compact mode for widgets and small spaces
   - Use showComparison to display average reference line
   - Export button is included by default in full mode
   - All animations are optimized for performance

*/
