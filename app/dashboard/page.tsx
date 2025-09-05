'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/contexts/AuthContext';
import { WelcomeBanner } from '@/components/onboarding/welcome-banner';
import { User, CreditCard, Settings, Wallet, PieChart, FileText, TrendingUp, Bell, DollarSign, Activity, ArrowDown } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 md:hidden">
              {/* Mobile menu trigger will be handled by Sidebar component */}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Banner for new users */}
          <WelcomeBanner />
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,234.00</div>
                <p className="text-xs text-muted-foreground">
                  +15.3% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$3,421.12</div>
                <p className="text-xs text-muted-foreground">
                  -8.2% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  2 crypto, 6 bank accounts
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Wallets & Accounts
                </CardTitle>
                <CardDescription>Manage your connected accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Link href="/dashboard/wallets/crypto">
                    <Button className=" justify-start" variant="outline">
                      <Wallet className="w-4 h-4 mr-2" />
                      Crypto Wallets (2)
                    </Button>
                  </Link>
                  <Link href="/dashboard/wallets/bank">
                    <Button className=" justify-start" variant="outline">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Bank Accounts (6)
                    </Button>
                  </Link>
                  <Link href="/dashboard/wallets/add">
                    <Button className=" justify-start" variant="outline">
                      <User className="w-4 h-4 mr-2" />
                      Add New Wallet
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Portfolio Overview
                </CardTitle>
                <CardDescription>Track your investment performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Link href="/dashboard/portfolio">
                    <Button className="justify-start" variant="outline">
                      <PieChart className="w-4 h-4 mr-2" />
                      Portfolio Overview
                    </Button>
                  </Link>
                  <Link href="/dashboard/portfolio/holdings">
                    <Button className="justify-start" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      View Holdings
                    </Button>
                  </Link>
                  <Link href="/dashboard/portfolio/performance">
                    <Button className="justify-start" variant="outline">
                      <Activity className="w-4 h-4 mr-2" />
                      Performance
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account & Goals
                </CardTitle>
                <CardDescription>Manage account and financial goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Link href="/dashboard/profile">
                    <Button className=" justify-start" variant="outline">
                      <User className="w-4 h-4 mr-2" />
                      Profile Settings
                    </Button>
                  </Link>
                  <Link href="/dashboard/goals">
                    <Button className=" justify-start" variant="outline">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Financial Goals
                    </Button>
                  </Link>
                  <Link href="/dashboard/subscription">
                    <Button className=" justify-start" variant="outline">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Subscription
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Salary Deposit</p>
                    <p className="text-sm text-muted-foreground">Bank of America • 2 hours ago</p>
                  </div>
                  <p className="font-semibold text-green-600 dark:text-green-400">+$3,200.00</p>
                </div>
                
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Bitcoin Purchase</p>
                    <p className="text-sm text-muted-foreground">Coinbase Pro • 1 day ago</p>
                  </div>
                  <p className="font-semibold text-red-600 dark:text-red-400">-$500.00</p>
                </div>
                
                <div className="pt-4 w-full flex justify-center">
                  <Link href="/dashboard/transactions">
                    <Button variant="outline" className="">
                      <ArrowDown size={16}/> View All
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}