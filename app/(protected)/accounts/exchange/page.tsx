'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Building,
  Shield,
  Clock,
  BarChart3,
  Zap
} from 'lucide-react';

const EXCHANGES = [
  {
    name: 'Binance',
    logo: '/exchanges/binance.png',
    description: 'World&apos;s largest cryptocurrency exchange',
    features: ['Spot Trading', 'Futures', 'Staking', 'NFTs'],
    color: 'from-yellow-500 to-yellow-600',
    status: 'planned'
  },
  {
    name: 'Coinbase',
    logo: '/exchanges/coinbase.png',
    description: 'Leading US-based crypto exchange',
    features: ['Spot Trading', 'Coinbase Pro', 'Earn', 'Vault'],
    color: 'from-blue-500 to-blue-600',
    status: 'planned'
  },
  {
    name: 'Kraken',
    logo: '/exchanges/kraken.png',
    description: 'Secure and reliable crypto trading',
    features: ['Spot Trading', 'Margin', 'Futures', 'Staking'],
    color: 'from-purple-500 to-purple-600',
    status: 'planned'
  },
  {
    name: 'KuCoin',
    logo: '/exchanges/kucoin.png',
    description: 'Advanced crypto trading platform',
    features: ['Spot Trading', 'Futures', 'Bot Trading', 'Pool'],
    color: 'from-green-500 to-green-600',
    status: 'planned'
  },
  {
    name: 'Bybit',
    logo: '/exchanges/bybit.png',
    description: 'Professional derivatives trading',
    features: ['Derivatives', 'Spot Trading', 'Copy Trading', 'Launchpad'],
    color: 'from-orange-500 to-orange-600',
    status: 'planned'
  },
  {
    name: 'OKX',
    logo: '/exchanges/okx.png',
    description: 'Global crypto exchange and Web3 gateway',
    features: ['Trading', 'Web3 Wallet', 'Earn', 'NFT'],
    color: 'from-black to-gray-600',
    status: 'planned'
  },
];

function ExchangeCard({ exchange }: { exchange: typeof EXCHANGES[0] }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 bg-gradient-to-br ${exchange.color} rounded-full flex items-center justify-center`}>
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{exchange.name}</CardTitle>
              <CardDescription className="text-sm">{exchange.description}</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {exchange.status === 'planned' ? 'Planned' : 'Available'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1">
            {exchange.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
          <Button className="w-full" disabled>
            <Plus className="h-4 w-4 mr-2" />
            Connect API
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ExchangeAccountsPage() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto h-16 w-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
          <Building className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exchange Accounts</h1>
          <p className="text-muted-foreground">
            Connect your cryptocurrency exchange accounts via secure API keys
          </p>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <Card className="border-dashed border-2">
        <CardContent className="p-8 text-center">
          <div className="mx-auto h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-orange-600" />
          </div>
          <CardTitle className="mb-2">Coming Soon</CardTitle>
          <CardDescription className="mb-4">
            Exchange API integration is currently in development. You&apos;ll be able to securely connect your favorite 
            exchanges using read-only API keys to track your trading portfolios and transaction history.
          </CardDescription>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Read-only API keys for maximum security</span>
          </div>
        </CardContent>
      </Card>

      {/* Supported Exchanges */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Supported Exchanges</h2>
          <p className="text-muted-foreground">
            Connect with the world&apos;s leading cryptocurrency exchanges
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXCHANGES.map((exchange, index) => (
            <ExchangeCard key={index} exchange={exchange} />
          ))}
        </div>
      </div>

      {/* Features Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Trading Analytics
            </CardTitle>
            <CardDescription>
              Comprehensive analysis of your trading activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                Portfolio performance tracking across exchanges
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                P&L analysis with tax reporting
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                Trading fees and cost basis calculation
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                Multi-exchange portfolio consolidation
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security First
            </CardTitle>
            <CardDescription>
              Your trading data is protected with enterprise-grade security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                Read-only API keys (no trading permissions)
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                Encrypted API key storage
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                IP whitelist support where available
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                Regular security audits and monitoring
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Zap className="h-5 w-5" />
            How Exchange Integration Works
          </CardTitle>
          <CardDescription>
            Simple 3-step process to connect your exchange accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold">Create API Key</h3>
              <p className="text-sm text-muted-foreground">
                Generate a read-only API key in your exchange account settings
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold">Connect Securely</h3>
              <p className="text-sm text-muted-foreground">
                Enter your API credentials in MoneyMappr&apos;s secure form
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="mx-auto h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold">Track Everything</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your portfolio, trades, and performance in real-time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}