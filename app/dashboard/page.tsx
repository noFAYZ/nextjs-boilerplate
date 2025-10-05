'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore, selectUser } from '@/lib/stores';
import { WelcomeBanner } from '@/components/onboarding/welcome-banner';
import {
  User,
  CreditCard,
  Settings,
  Wallet,
  PieChart,
  FileText,
  TrendingUp,
  TrendingDown,
  Bell,
  DollarSign,
  Activity,
  ArrowRight,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Repeat,
  ShoppingCart,
  Home,
  Zap,
  Target,
  BarChart3,
  Calendar,
  Clock,
  Sparkles,
  TrendingUpDown,
  Layers,
  CircleDollarSign,
  Send,
  Download,
  Globe,
  Receipt
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from 'recharts';

export default function DashboardPage() {
  const user = useAuthStore(selectUser);

  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const brandColor = '#FF6900';

  // Mock data
  const stats = [
    {
      label: 'Total Balance',
      value: '$45,231.89',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      subtitle: 'All accounts'
    },
    {
      label: 'Income',
      value: '$12,234',
      change: '+15.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      subtitle: 'This month'
    },
    {
      label: 'Expenses',
      value: '$3,421',
      change: '-8.2%',
      trend: 'down',
      icon: CreditCard,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      subtitle: 'Saved'
    },
    {
      label: 'Investments',
      value: '$28,450',
      change: '+12.5%',
      trend: 'up',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      subtitle: 'Portfolio'
    }
  ];

  const quickActions = [
    { icon: Send, label: 'Send', href: '/dashboard/send', color: brandColor },
    { icon: Download, label: 'Request', href: '/dashboard/request', color: '#3b82f6' },
    { icon: Repeat, label: 'Exchange', href: '/dashboard/exchange', color: '#8b5cf6' },
    { icon: Receipt, label: 'Bills', href: '/dashboard/bills', color: '#10b981' }
  ];

  const recentTransactions = [
    {
      id: 1,
      type: 'income',
      title: 'Salary Deposit',
      subtitle: 'Bank of America',
      amount: '+$3,200',
      time: '2h ago',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20'
    },
    {
      id: 2,
      type: 'expense',
      title: 'Bitcoin Purchase',
      subtitle: 'Coinbase Pro',
      amount: '-$500',
      time: '1d ago',
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20'
    },
    {
      id: 3,
      type: 'expense',
      title: 'Grocery',
      subtitle: 'Whole Foods',
      amount: '-$142.50',
      time: '2d ago',
      icon: ShoppingCart,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20'
    }
  ];

  const portfolioGrowth = [
    { month: 'Jan', value: 38500 },
    { month: 'Feb', value: 39200 },
    { month: 'Mar', value: 41000 },
    { month: 'Apr', value: 42300 },
    { month: 'May', value: 43800 },
    { month: 'Jun', value: 45231 }
  ];

  const cryptoHoldings = [
    { name: 'Bitcoin', symbol: 'BTC', amount: '0.234', value: '$5,420', change: '+12.4%', trend: 'up' },
    { name: 'Ethereum', symbol: 'ETH', amount: '2.45', value: '$2,890', change: '+8.2%', trend: 'up' },
    { name: 'Solana', symbol: 'SOL', amount: '45.2', value: '$610', change: '-3.1%', trend: 'down' }
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-5 p-4 md:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {greeting}, {firstName}! 👋
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="xs" className="gap-1.5">
              <Bell className="h-3.5 w-3.5" />
              <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center text-[9px]">
                3
              </Badge>
            </Button>
            <Link href="/dashboard/settings">
              <Button variant="outline" size="xs">
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Stats Grid - Glassmorphism Cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isPositive = stat.trend === 'up';
            const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

            return (
              <Card
                key={stat.label}
                className="relative overflow-hidden border border-border bg-background dark:bg-card backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-100 group"
              >
             
                <CardHeader className="flex flex-row items-center justify-between  relative">
                  <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </CardTitle>
                  <div className={`p-2 rounded-xl ${stat.bgColor} transition-transform group-hover:scale-110`}>
                    <Icon className={`h-3.5 w-3.5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1 relative">
                  <div className="text-xl font-bold tracking-tight">
                    {stat.value}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground">
                      {stat.subtitle}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`gap-0.5 text-[10px] px-1.5 py-0 ${isPositive ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'}`}
                    >
                      <TrendIcon className="h-2.5 w-2.5" />
                      {stat.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions - Floating Buttons */}
       
            <div className="grid grid-cols-4 max-w-3xl mx-auto gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.label} href={action.href}>
                    <Button variant={'outline'} className="w-full h-fit flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted/50 transition-all group">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110" style={{ backgroundColor: `${action.color}15` }}>
                        <Icon className="h-5 w-5" style={{ color: action.color }} />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{action.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
   

        {/* Main Content Grid */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Portfolio Chart - Modern Gradient */}
          <Card className="lg:col-span-2 border-0 bg-gradient-to-br from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-800/50 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" style={{ color: brandColor }} />
                    Portfolio Growth
                  </CardTitle>
                  <CardDescription className="text-[10px] mt-1">Last 6 months performance</CardDescription>
                </div>
                <Button variant="ghost" size="xs" className="text-[10px]">View More</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-3xl font-bold mb-1">$45,231.89</div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+17.5% vs last period</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={portfolioGrowth} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={brandColor} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={brandColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={brandColor}
                    strokeWidth={2}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Crypto Holdings - Compact */}
          <Card className="border-0 bg-gradient-to-br from-purple-50/50 to-white dark:from-purple-950/20 dark:to-zinc-900 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Wallet className="h-4 w-4 text-purple-600" />
                Crypto Holdings
              </CardTitle>
              <CardDescription className="text-[10px]">Top 3 positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cryptoHoldings.map((crypto) => (
                  <div key={crypto.symbol} className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xs">
                        {crypto.symbol.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-xs">{crypto.name}</p>
                        <p className="text-[10px] text-muted-foreground">{crypto.amount} {crypto.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-xs">{crypto.value}</p>
                      <Badge
                        variant="secondary"
                        className={`text-[9px] px-1.5 py-0 ${crypto.trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400'}`}
                      >
                        {crypto.change}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Link href="/dashboard/crypto">
                  <Button variant="outline" size="xs" className="w-full mt-2 gap-1 text-[10px]">
                    View All
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions & Goals */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 border-0 bg-gradient-to-br from-white to-blue-50/30 dark:from-zinc-900 dark:to-blue-950/10 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-[10px] mt-1">Latest transactions</CardDescription>
                </div>
                <Link href="/dashboard/transactions">
                  <Button variant="ghost" size="xs" className="gap-1 text-[10px]">
                    View All
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentTransactions.map((transaction) => {
                  const Icon = transaction.icon;
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all group cursor-pointer"
                    >
                      <div className={`p-2 rounded-xl ${transaction.bgColor} group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-4 w-4 ${transaction.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{transaction.title}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          {transaction.subtitle}
                          <span>•</span>
                          <Clock className="h-2.5 w-2.5" />
                          {transaction.time}
                        </p>
                      </div>
                      <div className={`font-semibold text-sm ${transaction.type === 'income' ? 'text-green-600' : 'text-foreground'}`}>
                        {transaction.amount}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Savings Goals - Circular Progress */}
          <Card className="border-0 bg-gradient-to-br from-green-50/50 to-white dark:from-green-950/20 dark:to-zinc-900 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                Savings Goal
              </CardTitle>
              <CardDescription className="text-[10px]">Vacation fund</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-2">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted/20"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.88)}`}
                      strokeLinecap="round"
                    />
                    <circle
                      cx={64 + 56 * Math.cos((0.88 * 2 * Math.PI) - Math.PI / 2)}
                      cy={64 + 56 * Math.sin((0.88 * 2 * Math.PI) - Math.PI / 2)}
                      r="4"
                      fill="#10b981"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold">88%</div>
                    <div className="text-[10px] text-muted-foreground">$4,400</div>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <p className="text-xs text-muted-foreground">of $5,000 goal</p>
                </div>
              </div>

              {/* Mini Goals Grid */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="p-2 rounded-lg bg-muted/30">
                  <div className="text-[10px] text-muted-foreground mb-1">Emergency</div>
                  <div className="text-xs font-semibold">$7,200</div>
                  <div className="h-1 bg-muted rounded-full mt-1">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <div className="text-[10px] text-muted-foreground mb-1">House</div>
                  <div className="text-xs font-semibold">$22,500</div>
                  <div className="h-1 bg-muted rounded-full mt-1">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bills & Subscriptions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: 'Spotify', amount: '$5.99', date: 'Apr 03', icon: '🎵', color: 'bg-green-100 dark:bg-green-950/20' },
            { name: 'Netflix', amount: '$15.99', date: 'Apr 05', icon: '📺', color: 'bg-red-100 dark:bg-red-950/20' },
            { name: 'Adobe', amount: '$52.99', date: 'Apr 10', icon: '🎨', color: 'bg-purple-100 dark:bg-purple-950/20' },
            { name: 'AWS', amount: '$23.50', date: 'Apr 12', icon: '☁️', color: 'bg-orange-100 dark:bg-orange-950/20' }
          ].map((bill) => (
            <Card key={bill.name} className="border-0 bg-gradient-to-br from-white to-zinc-50/50 dark:from-zinc-900/80 dark:to-zinc-800/50 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${bill.color} flex items-center justify-center text-lg`}>
                    {bill.icon}
                  </div>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0">{bill.date}</Badge>
                </div>
                <div className="font-semibold text-sm mb-0.5">{bill.name}</div>
                <div className="text-lg font-bold" style={{ color: brandColor }}>{bill.amount}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Spending Insights & Budget Tracker */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Category Spending - Radial Progress */}
          <Card className="border-0 bg-gradient-to-br from-orange-50/50 to-white dark:from-orange-950/20 dark:to-zinc-900 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-orange-600" />
                    Spending by Category
                  </CardTitle>
                  <CardDescription className="text-[10px] mt-1">This month breakdown</CardDescription>
                </div>
                <Button variant="ghost" size="xs" className="text-[10px]">Details</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { category: 'Food', amount: '$520', percentage: 32, color: '#FF6900', icon: '🍔' },
                  { category: 'Shopping', amount: '$340', percentage: 21, color: '#8b5cf6', icon: '🛍️' },
                  { category: 'Transport', amount: '$280', percentage: 17, color: '#3b82f6', icon: '🚗' },
                  { category: 'Entertainment', amount: '$210', percentage: 13, color: '#10b981', icon: '🎮' }
                ].map((cat) => (
                  <div key={cat.category} className="relative">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all group">
                      <div className="relative">
                        <svg className="w-14 h-14 -rotate-90">
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-muted/20"
                          />
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            fill="none"
                            stroke={cat.color}
                            strokeWidth="4"
                            strokeDasharray={`${2 * Math.PI * 24}`}
                            strokeDashoffset={`${2 * Math.PI * 24 * (1 - cat.percentage / 100)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-lg">
                          {cat.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">{cat.category}</p>
                        <p className="text-sm font-bold">{cat.amount}</p>
                        <p className="text-[10px] text-muted-foreground">{cat.percentage}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Budget Progress */}
          <Card className="border-0 bg-gradient-to-br from-pink-50/50 to-white dark:from-pink-950/20 dark:to-zinc-900 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4 text-pink-600" />
                    Monthly Budget
                  </CardTitle>
                  <CardDescription className="text-[10px] mt-1">15 days remaining</CardDescription>
                </div>
                <Button variant="ghost" size="xs" className="text-[10px]">Adjust</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold">$1,350</span>
                  <span className="text-sm text-muted-foreground">of $2,000</span>
                </div>
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-pink-500 to-orange-500"
                    style={{ width: '67%' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-end pr-2">
                    <span className="text-[9px] font-bold text-white drop-shadow-lg">67%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'Housing', spent: 580, budget: 800, color: '#FF6900' },
                  { name: 'Groceries', spent: 320, budget: 500, color: '#8b5cf6' },
                  { name: 'Utilities', spent: 150, budget: 200, color: '#3b82f6' }
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{item.name}</span>
                        <span className="text-[10px] text-muted-foreground">${item.spent}/${item.budget}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(item.spent / item.budget) * 100}%`,
                            backgroundColor: item.color
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Portfolio & Performance */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Asset Allocation - Donut Chart */}
          <Card className="border-0 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-zinc-900 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-600" />
                Asset Allocation
              </CardTitle>
              <CardDescription className="text-[10px]">Portfolio distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90">
                    {/* Stocks - 40% */}
                    <circle
                      cx="80"
                      cy="80"
                      r="60"
                      fill="none"
                      stroke="#FF6900"
                      strokeWidth="24"
                      strokeDasharray={`${2 * Math.PI * 60 * 0.4} ${2 * Math.PI * 60}`}
                      strokeLinecap="round"
                    />
                    {/* Crypto - 30% */}
                    <circle
                      cx="80"
                      cy="80"
                      r="60"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="24"
                      strokeDasharray={`${2 * Math.PI * 60 * 0.3} ${2 * Math.PI * 60}`}
                      strokeDashoffset={`${-2 * Math.PI * 60 * 0.4}`}
                      strokeLinecap="round"
                    />
                    {/* Bonds - 20% */}
                    <circle
                      cx="80"
                      cy="80"
                      r="60"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="24"
                      strokeDasharray={`${2 * Math.PI * 60 * 0.2} ${2 * Math.PI * 60}`}
                      strokeDashoffset={`${-2 * Math.PI * 60 * 0.7}`}
                      strokeLinecap="round"
                    />
                    {/* Cash - 10% */}
                    <circle
                      cx="80"
                      cy="80"
                      r="60"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="24"
                      strokeDasharray={`${2 * Math.PI * 60 * 0.1} ${2 * Math.PI * 60}`}
                      strokeDashoffset={`${-2 * Math.PI * 60 * 0.9}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold">$28.4K</p>
                    <p className="text-[10px] text-muted-foreground">Total</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4 w-full text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FF6900' }} />
                    <span className="text-[10px] text-muted-foreground">Stocks</span>
                    <span className="font-semibold ml-auto">40%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="text-[10px] text-muted-foreground">Crypto</span>
                    <span className="font-semibold ml-auto">30%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[10px] text-muted-foreground">Bonds</span>
                    <span className="font-semibold ml-auto">20%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[10px] text-muted-foreground">Cash</span>
                    <span className="font-semibold ml-auto">10%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Gainers */}
          <Card className="border-0 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-zinc-900 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                Top Gainers
              </CardTitle>
              <CardDescription className="text-[10px]">Best performers today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { symbol: 'AAPL', name: 'Apple Inc.', change: '+5.2%', amount: '$182.45', color: 'from-green-500 to-emerald-500' },
                  { symbol: 'BTC', name: 'Bitcoin', change: '+3.8%', amount: '$67,890', color: 'from-orange-500 to-amber-500' },
                  { symbol: 'ETH', name: 'Ethereum', change: '+2.4%', amount: '$3,245', color: 'from-blue-500 to-cyan-500' }
                ].map((stock, index) => (
                  <div key={stock.symbol} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-all group">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stock.color} flex items-center justify-center text-white font-bold text-xs`}>
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold">{stock.symbol}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold">{stock.amount}</p>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 text-[9px] px-1.5 py-0">
                        {stock.change}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cashflow Meter */}
          <Card className="border-0 bg-gradient-to-br from-cyan-50/50 to-white dark:from-cyan-950/20 dark:to-zinc-900 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUpDown className="h-4 w-4 text-cyan-600" />
                Cashflow Meter
              </CardTitle>
              <CardDescription className="text-[10px]">Income vs Expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-2">
                {/* Semi-circle gauge */}
                <div className="relative w-40 h-24">
                  <svg className="w-full h-full" viewBox="0 0 160 80">
                    {/* Background arc */}
                    <path
                      d="M 20 80 A 60 60 0 0 1 140 80"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-muted/20"
                    />
                    {/* Progress arc (70% positive) */}
                    <path
                      d="M 20 80 A 60 60 0 0 1 132 52"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    {/* Needle */}
                    <line
                      x1="80"
                      y1="80"
                      x2="80"
                      y2="30"
                      stroke={brandColor}
                      strokeWidth="3"
                      strokeLinecap="round"
                      transform="rotate(54 80 80)"
                    />
                    <circle cx="80" cy="80" r="6" fill={brandColor} />
                  </svg>
                  <div className="absolute bottom-0 left-0 right-0 text-center">
                    <p className="text-2xl font-bold text-green-600">+$8.8K</p>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full mt-4 text-xs">
                  <div className="text-center">
                    <p className="text-[10px] text-muted-foreground">Income</p>
                    <p className="font-semibold text-green-600">$12.2K</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-muted-foreground">Expenses</p>
                    <p className="font-semibold text-red-600">$3.4K</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Health Score */}
        <Card className="border-0 bg-gradient-to-br from-violet-50/50 via-purple-50/30 to-white dark:from-violet-950/20 dark:via-purple-950/10 dark:to-zinc-900 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-violet-600" />
                  Financial Health Score
                </CardTitle>
                <CardDescription className="text-[10px] mt-1">Overall financial wellbeing</CardDescription>
              </div>
              <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400">Excellent</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { label: 'Savings Rate', score: 85, max: 100, color: '#10b981', icon: '💰' },
                { label: 'Debt Ratio', score: 22, max: 100, color: '#3b82f6', icon: '📊' },
                { label: 'Investment', score: 78, max: 100, color: '#8b5cf6', icon: '📈' },
                { label: 'Emergency Fund', score: 92, max: 100, color: '#FF6900', icon: '🛡️' }
              ].map((metric) => (
                <div key={metric.label} className="relative">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30">
                    <div className="text-2xl">{metric.icon}</div>
                    <div className="flex-1">
                      <p className="text-xs font-medium mb-1">{metric.label}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${metric.score}%`,
                              backgroundColor: metric.color
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold" style={{ color: metric.color }}>{metric.score}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
