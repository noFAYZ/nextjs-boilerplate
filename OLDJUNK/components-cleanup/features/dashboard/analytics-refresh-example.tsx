'use client';

/**
 * Example component showing how to use RefreshAnalyticsButton in a widget
 * This demonstrates various usage patterns and integration options
 */

import { RefreshAnalyticsButton } from '@/components/ui/refresh-analytics-button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export function AnalyticsRefreshExample() {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Refresh Analytics Button Examples</CardTitle>
        <CardDescription>
          Various ways to use the refresh analytics button component
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Example 1: Icon only (default) */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Icon Only (Ghost Variant)</h3>
          <RefreshAnalyticsButton />
        </div>

        {/* Example 2: With text */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">With Text Label</h3>
          <RefreshAnalyticsButton showText />
        </div>

        {/* Example 3: Outline variant */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Outline Variant</h3>
          <RefreshAnalyticsButton variant="outline" showText />
        </div>

        {/* Example 4: Secondary variant */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Secondary Variant</h3>
          <RefreshAnalyticsButton variant="secondary" showText />
        </div>

        {/* Example 5: Large size */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Large Size</h3>
          <RefreshAnalyticsButton size="lg" showText />
        </div>

        {/* Example 6: With callback */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">With Completion Callback</h3>
          <RefreshAnalyticsButton
            showText
            onRefreshComplete={() => {
              console.log('Analytics refreshed successfully!');
            }}
          />
        </div>

        {/* Example 7: Custom styling */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Custom Styling</h3>
          <RefreshAnalyticsButton
            variant="outline"
            showText
            className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950"
          />
        </div>
      </CardContent>
    </Card>
  );
}
