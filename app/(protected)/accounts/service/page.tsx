'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Store,
  Calculator,
  FileText,
  Truck,
  CreditCard,
  Clock,
  Shield,
  Zap,
  BarChart3,
  Globe,
  Settings
} from 'lucide-react';
import Link from 'next/link';

const SERVICES = [
  {
    name: 'Shopify',
    icon: Store,
    description: 'E-commerce store management and sales tracking',
    category: 'E-commerce',
    features: ['Sales Analytics', 'Product Performance', 'Customer Insights', 'Inventory Tracking'],
    color: 'from-green-500 to-green-600',
    status: 'planned'
  },
  {
    name: 'QuickBooks',
    icon: Calculator,
    description: 'Comprehensive accounting and bookkeeping',
    category: 'Accounting',
    features: ['Income/Expense Tracking', 'Tax Preparation', 'Invoice Management', 'Financial Reports'],
    color: 'from-blue-500 to-blue-600',
    status: 'planned'
  },
  {
    name: 'Xero',
    icon: FileText,
    description: 'Cloud-based accounting software',
    category: 'Accounting',
    features: ['Bank Reconciliation', 'Invoicing', 'Expense Claims', 'Financial Reporting'],
    color: 'from-cyan-500 to-cyan-600',
    status: 'planned'
  },
  {
    name: 'Stripe',
    icon: CreditCard,
    description: 'Payment processing and financial services',
    category: 'Payments',
    features: ['Payment Analytics', 'Revenue Recognition', 'Customer Lifetime Value', 'Churn Analysis'],
    color: 'from-purple-500 to-purple-600',
    status: 'planned'
  },
  {
    name: 'PayPal',
    icon: Globe,
    description: 'Digital payments and money transfers',
    category: 'Payments',
    features: ['Transaction History', 'Balance Tracking', 'Dispute Management', 'Tax Reporting'],
    color: 'from-blue-600 to-indigo-600',
    status: 'planned'
  },
  {
    name: 'Amazon Seller',
    icon: Truck,
    description: 'Amazon marketplace sales and fulfillment',
    category: 'E-commerce',
    features: ['Sales Dashboard', 'FBA Analytics', 'Advertising Performance', 'Inventory Reports'],
    color: 'from-orange-500 to-orange-600',
    status: 'planned'
  },
];

const CATEGORIES = [
  { name: 'E-commerce', count: 2, icon: Store, color: 'bg-green-100 text-green-800' },
  { name: 'Accounting', count: 2, icon: Calculator, color: 'bg-blue-100 text-blue-800' },
  { name: 'Payments', count: 2, icon: CreditCard, color: 'bg-purple-100 text-purple-800' },
];

function ServiceCard({ service }: { service: typeof SERVICES[0] }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 bg-gradient-to-br ${service.color} rounded-full flex items-center justify-center`}>
              <service.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{service.name}</CardTitle>
              <CardDescription className="text-sm">{service.description}</CardDescription>
            </div>
          </div>
          <div className="text-right space-y-1">
            <Badge variant="outline" className="text-xs">
              {service.category}
            </Badge>
            <br />
            <Badge variant="secondary" className="text-xs">
              {service.status === 'planned' ? 'Planned' : 'Available'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1">
            {service.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
          <Button className="w-full" disabled>
            <Plus className="h-4 w-4 mr-2" />
            Connect Service
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CategoryCard({ category }: { category: typeof CATEGORIES[0] }) {
  return (
    <Card className="text-center">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-3">
          <div className={`h-12 w-12 ${category.color} rounded-full flex items-center justify-center`}>
            <category.icon className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-lg">{category.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{category.count} services</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ServiceAccountsPage() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
          <Settings className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Services</h1>
          <p className="text-muted-foreground">
            Connect your business tools and services for comprehensive financial insights
          </p>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <Card className="border-dashed border-2">
        <CardContent className="p-8 text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-indigo-600" />
          </div>
          <CardTitle className="mb-2">Coming Soon</CardTitle>
          <CardDescription className="mb-4">
            Business service integrations are currently in development. Connect your e-commerce platforms, 
            accounting software, and payment processors to get a complete view of your business finances.
          </CardDescription>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secure OAuth and API integrations</span>
          </div>
        </CardContent>
      </Card>

      {/* Categories Overview */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Service Categories</h2>
          <p className="text-muted-foreground">
            Organize your business data by service type
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </div>
      </div>

      {/* Supported Services */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Supported Services</h2>
          <p className="text-muted-foreground">
            Connect with popular business tools and platforms
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>

      {/* Features Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Business Intelligence
            </CardTitle>
            <CardDescription>
              Transform your business data into actionable insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                Revenue and profit analysis across platforms
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                Customer acquisition and retention metrics
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                Cash flow forecasting and budgeting
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                Tax-ready financial reporting
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Automation & Efficiency
            </CardTitle>
            <CardDescription>
              Streamline your financial workflows and reporting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                Automated data synchronization
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                Smart expense categorization
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                Scheduled financial reports
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                Alert notifications for key metrics
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Integration Benefits */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Globe className="h-5 w-5" />
            Why Connect Your Business Services?
          </CardTitle>
          <CardDescription>
            Unlock the full potential of your business data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Unified Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                See all your business metrics in one place
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Real-time Updates</h3>
              <p className="text-sm text-muted-foreground">
                Automatic data sync keeps everything current
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="mx-auto h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">Smart Reporting</h3>
              <p className="text-sm text-muted-foreground">
                Automated financial reports for taxes and planning
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="mx-auto h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold">Secure Integration</h3>
              <p className="text-sm text-muted-foreground">
                Bank-level security for all your business data
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}