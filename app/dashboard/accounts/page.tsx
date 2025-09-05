'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight,
  Building,
  Building2,
  Plus,
  Store,
  Wallet,
  TrendingUp,
  Shield,
  Zap,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

const ACCOUNT_TYPES = [
  {
    id: 'wallet',
    title: 'Crypto Wallets',
    description: 'Connect and track your cryptocurrency wallets across multiple networks',
    icon: Wallet,
    href: '/dashboard/accounts/wallet',
    addHref: '/dashboard/accounts/wallet/add',
    color: 'from-blue-500 to-purple-600',
    features: ['Multi-network support', 'Real-time balance tracking', 'Transaction history', 'DeFi positions'],
    status: 'active',
    count: '5 wallets'
  },
  {
    id: 'bank',
    title: 'Bank Accounts',
    description: 'Link your traditional banking accounts for complete financial visibility',
    icon: Building2,
    href: '/dashboard/accounts/bank',
    addHref: '/dashboard/accounts/bank/add',
    color: 'from-green-500 to-blue-600',
    features: ['Account balances', 'Transaction categorization', 'Bill tracking', 'Spending analysis'],
    status: 'coming-soon',
    count: 'Coming soon'
  },
  {
    id: 'exchange',
    title: 'Exchanges',
    description: 'Connect cryptocurrency exchanges via secure API keys',
    icon: Building,
    href: '/dashboard/accounts/exchange',
    addHref: '/dashboard/accounts/exchange/add',
    color: 'from-orange-500 to-red-600',
    features: ['Trading analytics', 'Portfolio tracking', 'P&L analysis', 'Multi-exchange view'],
    status: 'coming-soon',
    count: 'Coming soon'
  },
  {
    id: 'service',
    title: 'Business Services',
    description: 'Integrate with business tools like Shopify, QuickBooks, and payment processors',
    icon: Store,
    href: '/dashboard/accounts/service',
    addHref: '/dashboard/accounts/service/add',
    color: 'from-indigo-500 to-purple-600',
    features: ['Revenue tracking', 'Expense management', 'Tax reporting', 'Business insights'],
    status: 'coming-soon',
    count: 'Coming soon'
  },
];

function AccountTypeCard({ accountType }: { accountType: typeof ACCOUNT_TYPES[0] }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 bg-gradient-to-br ${accountType.color} rounded-full flex items-center justify-center`}>
              <accountType.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{accountType.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={accountType.status === 'active' ? 'default' : 'secondary'}>
                  {accountType.status === 'active' ? 'Active' : 'Coming Soon'}
                </Badge>
                <span className="text-sm text-muted-foreground">{accountType.count}</span>
              </div>
            </div>
          </div>
        </div>
        <CardDescription className="mt-2">
          {accountType.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {accountType.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-1.5 w-1.5 bg-primary rounded-full" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2 pt-2">
          <Link href={accountType.href} className="flex-1">
            <Button variant="outline" className="w-full group-hover:border-primary transition-colors">
              View {accountType.title}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          {accountType.status === 'active' && (
            <Link href={accountType.addHref}>
              <Button size="sm" className="px-3">
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AccountsPage() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Account Management</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect all your financial accounts in one secure platform for complete visibility and control
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Connected Accounts</p>
                <p className="text-3xl font-bold">5</p>
              </div>
              <Wallet className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-3xl font-bold">$42,350</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Sync</p>
                <p className="text-3xl font-bold">2m ago</p>
              </div>
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Types */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Account Types</h2>
          <p className="text-muted-foreground">
            Choose from different account types to build your complete financial picture
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ACCOUNT_TYPES.map((accountType) => (
            <AccountTypeCard key={accountType.id} accountType={accountType} />
          ))}
        </div>
      </div>

      {/* Features Overview */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="h-5 w-5" />
            Why Connect Your Accounts?
          </CardTitle>
          <CardDescription>
            Unlock powerful financial insights and management tools
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
                See all your finances in one comprehensive view
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Real-time Sync</h3>
              <p className="text-sm text-muted-foreground">
                Automatic updates keep your data current
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="mx-auto h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">Smart Analytics</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered insights for better decisions
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="mx-auto h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold">Bank-level Security</h3>
              <p className="text-sm text-muted-foreground">
                Enterprise-grade protection for your data
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/dashboard/accounts/wallet/add">
            <Button size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Crypto Wallet
            </Button>
          </Link>
          <Link href="/dashboard/accounts/bank">
            <Button variant="outline" size="lg" disabled>
              <Building2 className="h-4 w-4 mr-2" />
              Connect Bank Account
            </Button>
          </Link>
          <Link href="/dashboard/accounts/exchange">
            <Button variant="outline" size="lg" disabled>
              <Building className="h-4 w-4 mr-2" />
              Add Exchange API
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}