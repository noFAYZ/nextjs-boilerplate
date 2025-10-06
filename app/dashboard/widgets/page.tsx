import { NetWorthWidget } from '@/components/dashboard-widgets/net-worth-widget';

export default function WidgetsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Widgets</h1>
        <p className="text-muted-foreground">
          View your financial overview with customizable widgets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <NetWorthWidget />
        </div>
      </div>
    </div>
  );
}
