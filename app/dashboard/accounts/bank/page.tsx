'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Building2,
  CreditCard,
  Landmark,
  PiggyBank,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react';
import Link from 'next/link';

const BANK_TYPES = [
  {
    icon: Landmark,
    title: 'Traditional Bank',
    description: 'Connect your checking, savings, and credit accounts',
    features: ['Account balances', 'Transaction history', 'Bill tracking'],
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: CreditCard,
    title: 'Credit Cards',
    description: 'Track spending, balances, and reward points',
    features: ['Balance tracking', 'Payment reminders', 'Reward analysis'],
    color: 'from-green-500 to-green-600'
  },
  {
    icon: PiggyBank,
    title: 'Investment Accounts',
    description: 'Monitor your brokerage and retirement accounts',
    features: ['Portfolio tracking', 'Performance analysis', 'Asset allocation'],
    color: 'from-purple-500 to-purple-600'
  },
];

function BankTypeCard({ bankType }: { bankType: typeof BANK_TYPES[0] }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 bg-gradient-to-br ${bankType.color} rounded-full flex items-center justify-center`}>
            <bankType.icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">{bankType.title}</CardTitle>
            <CardDescription>{bankType.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-4">
          {bankType.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-1.5 w-1.5 bg-primary rounded-full" />
              {feature}
            </li>
          ))}
        </ul>
        <Button className="w-full" disabled>
          <Plus className="h-4 w-4 mr-2" />
          Connect Account
        </Button>
      </CardContent>
    </Card>
  );
}

export default function BankAccountsPage() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-green-600 rounded-full flex items-center justify-center">
          <Building2 className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bank Accounts</h1>
          <p className="text-muted-foreground">
            Connect your traditional banking accounts for complete financial visibility
          </p>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <Card className="border-dashed border-2">
        <CardContent className="p-8 text-center">
          <div className="mx-auto h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <CardTitle className="mb-2">Coming Soon</CardTitle>
          <CardDescription className="mb-4">
            Bank account integration is currently in development. You'll be able to connect your traditional banking accounts, 
            credit cards, and investment accounts to get a complete view of your finances.
          </CardDescription>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Bank-level security with read-only access</span>
          </div>
        </CardContent>
      </Card>

      {/* Bank Types Preview */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">What You'll Be Able to Connect</h2>
          <p className="text-muted-foreground">
            Securely link all your financial accounts in one place
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BANK_TYPES.map((bankType, index) => (
            <BankTypeCard key={index} bankType={bankType} />
          ))}
        </div>
      </div>

      {/* Features Preview */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Powerful Banking Features
          </CardTitle>
          <CardDescription>
            Everything you need to manage your traditional finances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Account Management</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                  Real-time balance tracking across all accounts
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                  Automatic transaction categorization
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                  Monthly spending analysis and budgets
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
                  Bill tracking and payment reminders
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Security & Privacy</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                  Bank-level 256-bit SSL encryption
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                  Read-only access to your accounts
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                  No storage of banking credentials
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                  SOC 2 Type II compliant infrastructure
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}