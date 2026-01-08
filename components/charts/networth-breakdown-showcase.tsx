'use client';

import { useState } from 'react';
import { NetWorthBreakdownChart } from './networth-breakdown-chart';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

/**
 * Showcase Component for NetWorthBreakdownChart
 *
 * Demonstrates various configurations and use cases
 * of the NetWorthBreakdownChart component.
 */

export function NetWorthBreakdownShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="w-full space-y-8 p-6">
      {/* Header */}
      <section className="space-y-2">
        <h1 className="text-3xl font-bold">NetWorth Breakdown Chart</h1>
        <p className="text-muted-foreground">
          Enterprise-grade asset breakdown visualization with interactive filtering,
          export functionality, and responsive design.
        </p>
      </section>

      {/* Feature Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">🎨 Modern Design</h3>
            <p className="text-xs text-muted-foreground">
              Clean, professional interface with smooth animations
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">♿ Accessible</h3>
            <p className="text-xs text-muted-foreground">
              WCAG 2.1 AA compliant with full keyboard support
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">⚡ Performant</h3>
            <p className="text-xs text-muted-foreground">
              Optimized with memoization and lazy rendering
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">🔧 Modular</h3>
            <p className="text-xs text-muted-foreground">
              Composable and extensible architecture
            </p>
          </div>
        </Card>
      </section>

      {/* Showcase Tabs */}
      <Tabs defaultValue="vertical" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="vertical">Vertical</TabsTrigger>
          <TabsTrigger value="horizontal">Horizontal</TabsTrigger>
          <TabsTrigger value="compact">Compact</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        {/* Vertical Bar Chart */}
        <TabsContent value="vertical" className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Vertical Bar Chart</h2>
            <p className="text-sm text-muted-foreground">
              Default vertical layout with all features enabled
            </p>
          </div>

          <NetWorthBreakdownChart
            orientation="vertical"
            height={450}
            showLegend={true}
            allowFiltering={true}
            showPercentages={true}
            showValues={true}
            onCategoryToggle={(categoryId, visible) => {
              setSelectedCategory(visible ? categoryId : null);
            }}
          />
        </TabsContent>

        {/* Horizontal Bar Chart */}
        <TabsContent value="horizontal" className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Horizontal Bar Chart</h2>
            <p className="text-sm text-muted-foreground">
              Alternative layout useful for category name readability
            </p>
          </div>

          <NetWorthBreakdownChart
            orientation="horizontal"
            height={400}
            showLegend={true}
            allowFiltering={true}
          />
        </TabsContent>

        {/* Compact Mode */}
        <TabsContent value="compact" className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Compact Widget</h2>
            <p className="text-sm text-muted-foreground">
              Minimal version for embedded views and dashboards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NetWorthBreakdownChart
              compact={true}
              height={300}
              orientation="vertical"
              showLegend={true}
            />

            <NetWorthBreakdownChart
              compact={true}
              height={300}
              orientation="horizontal"
              showLegend={true}
            />
          </div>
        </TabsContent>

        {/* Custom Configuration */}
        <TabsContent value="custom" className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Custom Configuration</h2>
            <p className="text-sm text-muted-foreground">
              With specific categories hidden and custom height
            </p>
          </div>

          <NetWorthBreakdownChart
            orientation="vertical"
            height={350}
            defaultVisibleCategories={['stocks', 'crypto', 'real-estate']}
            allowFiltering={true}
            showPercentages={true}
            showLegend={true}
          />
        </TabsContent>

        {/* Code Examples */}
        <TabsContent value="code" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Basic Import</h3>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
{`import { NetWorthBreakdownChart } from '@/components/charts';`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Vertical Chart</h3>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
{`<NetWorthBreakdownChart
  orientation="vertical"
  height={450}
  showLegend={true}
  allowFiltering={true}
  showPercentages={true}
  onCategoryToggle={(categoryId, visible) => {
    console.log(\`\${categoryId}: \${visible ? 'shown' : 'hidden'}\`);
  }}
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Horizontal Chart</h3>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
{`<NetWorthBreakdownChart
  orientation="horizontal"
  height={400}
  showLegend={true}
  allowFiltering={true}
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">With TanStack Query (Future)</h3>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
{`import { useNetWorthBreakdown } from '@/lib/queries';

export function Dashboard() {
  const { data, isLoading } = useNetWorthBreakdown();

  if (isLoading) return <Skeleton />;

  return (
    <NetWorthBreakdownChart
      mode={data ? 'live' : 'demo'}
      data={data}
      height={500}
    />
  );
}`}
              </pre>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Props Documentation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Props Reference</h2>

        <div className="grid gap-4">
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  orientation
                </code>
                <Badge variant="secondary">vertical | horizontal</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Chart layout direction. Default: 'vertical'
              </p>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  height
                </code>
                <Badge variant="secondary">number</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Chart height in pixels. Min: 250, Max: 1000, Default: 400
              </p>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  showLegend
                </code>
                <Badge variant="secondary">boolean</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Display legend with category names. Default: true
              </p>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  allowFiltering
                </code>
                <Badge variant="secondary">boolean</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Enable interactive category filtering. Default: true
              </p>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  showPercentages
                </code>
                <Badge variant="secondary">boolean</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Display percentage labels on bars. Default: true
              </p>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  onCategoryToggle
                </code>
                <Badge variant="secondary">function</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Callback when category visibility changes: (categoryId, visible)  
              </p>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  mode
                </code>
                <Badge variant="secondary">demo | live</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Data source. Default: 'demo' (use 'live' with TanStack Query)
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Features List */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Key Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-2">✅ Enterprise-Grade</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Strict TypeScript typing</li>
              <li>• Comprehensive error handling</li>
              <li>• Data validation & sanitization</li>
              <li>• Production-ready quality</li>
            </ul>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-2">🎨 Modern UX</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Smooth animations</li>
              <li>• Interactive hover effects</li>
              <li>• Responsive legend</li>
              <li>• Export to CSV</li>
            </ul>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-2">⚡ Performance</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Memoized computations</li>
              <li>• Lazy rendering</li>
              <li>• Efficient data pipeline</li>
              <li>• Minimal re-renders</li>
            </ul>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-2">♿ Accessible</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• WCAG 2.1 AA compliant</li>
              <li>• Semantic HTML</li>
              <li>• ARIA labels</li>
              <li>• Keyboard navigation</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <section className="border-t pt-6 space-y-2">
        <p className="text-sm text-muted-foreground">
          📚 For detailed documentation, see <code className="bg-muted px-2 py-1 rounded">CHARTS.md</code>
        </p>
        <p className="text-sm text-muted-foreground">
          🚀 Ready to integrate with TanStack Query for live data
        </p>
      </section>
    </div>
  );
}
