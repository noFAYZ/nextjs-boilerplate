"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building,
  Building2,
  Store,
  FolderOpen,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  CreditCard,
  ArrowUpRight,
  Eye,
  MoreHorizontal,
  Activity,
  Heart,
  SearchIcon
} from "lucide-react";
import Link from "next/link";
import StreamlineUltimateAccountingCoins, { GuidanceBank, MageDashboard, SolarWalletBoldDuotone, StreamlineFlexWallet } from "@/components/icons/icons";
import { AccountGroupsGrid } from "@/components/accounts/AccountGroupsGrid";
import { useGroupedAccounts } from "@/lib/hooks/use-account-groups";
import type { AccountGroup } from "@/lib/types/account-groups";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ACCOUNT_TYPES = [
  {
    id: "wallet",
    title: "Crypto Wallets",
    description:
      "Connect and track your cryptocurrency wallets across multiple networks",
    icon: SolarWalletBoldDuotone,
    href: "/dashboard/accounts/wallet",
    addHref: "/dashboard/accounts/wallet/add",
    color: "from-orange-500/60 to-pink-600/60",
    features: [
      "Multi-network support",
      "Real-time balance tracking",
      "Transaction history",
      "DeFi positions",
    ],
    status: "active",
    count: "5 wallets",
  },
  {
    id: "bank",
    title: "Bank Accounts",
    description:
      "Link your traditional banking accounts for complete financial visibility",
    icon: Building2,
    href: "/dashboard/accounts/bank",
    addHref: "/dashboard/accounts/bank/add",
    color: "from-green-500 to-blue-600",
    features: [
      "Account balances",
      "Transaction categorization",
      "Bill tracking",
      "Spending analysis",
    ],
    status: "coming-soon",
    count: "Coming soon",
  },
  {
    id: "exchange",
    title: "Exchanges",
    description: "Connect cryptocurrency exchanges via secure API keys",
    icon: Building,
    href: "/dashboard/accounts/exchange",
    addHref: "/dashboard/accounts/exchange/add",
    color: "from-orange-500 to-red-600",
    features: [
      "Trading analytics",
      "Portfolio tracking",
      "P&L analysis",
      "Multi-exchange view",
    ],
    status: "coming-soon",
    count: "Coming soon",
  },
  {
    id: "service",
    title: "Business Services",
    description:
      "Integrate with business tools like Shopify, QuickBooks, and payment processors",
    icon: Store,
    href: "/dashboard/accounts/service",
    addHref: "/dashboard/accounts/service/add",
    color: "from-indigo-500 to-purple-600",
    features: [
      "Revenue tracking",
      "Expense management",
      "Tax reporting",
      "Business insights",
    ],
    status: "coming-soon",
    count: "Coming soon",
  },
];

// Enhanced Account Type Card Component
function EnhancedAccountTypeCard({
  accountType,
  index,
}: {
  accountType: (typeof ACCOUNT_TYPES)[0];
  index: number;
}) {
  const isActive = accountType.status === "active";
  
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isActive) {
      return (
        <Link href={accountType.href}>
          <Card className={cn(
            "group relative overflow-hidden cursor-pointer transition-all duration-100 hover:shadow-2xl",
            "  border-1 hover:border-primary/20",
            "bg-gradient-to-br from-background to-muted/30"
          )}>
            {children}
          </Card>
        </Link>
      );
    }
    return (
      <Card className={cn(
        "relative overflow-hidden opacity-60 border-dashed",
        "bg-gradient-to-br from-muted/30 to-muted/60"
      )}>
        {children}
      </Card>
    );
  };

  return (
    <CardWrapper>
      <CardContent className="p-3 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/10 to-primary/20" />
        </div>
  
        <div className="relative space-y-4">
          {/* Icon and Title */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center transition-all duration-100",
                  "bg-gradient-to-br shadow-lg",
                  accountType.color,
       
                )}
              >
                <accountType.icon className="h-6 w-6 text-white" />
              </div>
              
              
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  {accountType.title}
                </h3>
          
            </div>
            
            {isActive && (
              <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-100" />
            )}
          </div>

          {/* Features */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge
                variant={isActive ? "default" : "secondary"}
                className="text-[10px] rounded-md px-2 py-0"
              >
                {isActive ? "Active" : "Coming Soon"}
              </Badge>
              <span className="text-xs font-semibold text-muted-foreground">
                {accountType.count}
              </span>
            </div>
            
          
          </div>
        </div>
        
        {/* Hover Effect Overlay */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}
      </CardContent>
    </CardWrapper>
  );
}

export default function AccountsPage() {
  const { stats } = useGroupedAccounts();

  const handleGroupSelect = (group: AccountGroup) => {
    // Navigate to group detail page or show group contents
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="mx-auto max-w-7xl space-y-8 p-6">
        {/* Page Header */}
        <div className="flex flex-col gap-6">
        
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Total Value Card */}
         
                <div className="flex items-center justify-between col-span-1 md:col-span-2">
                  <div className="space-y-1">
                   
                      <p className="text-[10px] font-medium text-muted-foreground uppercase">Total Value</p>
                  
                    <div className="space-y-1">
                      <p className="text-3xl font-bold tracking-tight">${stats.totalValue.toLocaleString()}</p>
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 font-medium">+12.5%</span>
                        <span className="text-muted-foreground">this month</span>
                      </div>
                    </div>
                  </div>
             
                </div>
           
            
            {/* Bank Accounts Card */}
            <Card className="group hover:shadow-lg  ">
              <CardContent className="flex p-4">
                
                <div className="flex-1 space-y-1">
                  <p className="text-2xl font-bold">{stats.totalAccounts}</p>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Bank Accounts</p>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <div className="h-1 w-1 rounded-full bg-green-600" />
                    <span>3 active</span>
                  </div>
             
                </div>
                     <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </CardContent>
            </Card>

            {/* Crypto Wallets Card */}
            <Card className="group hover:shadow-lg ">
              <CardContent className="flex p-4">
              
                <div className="flex-1 space-y-1">
                  <p className="text-2xl font-bold">{stats.totalWallets}</p>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Crypto Wallets</p>
                  <div className="flex items-center gap-1 text-xs text-orange-600">
                    <div className="h-1 w-1 rounded-full bg-orange-600" />
                    <span>5 synced</span>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions Bar
        <Card className="border-dashed border-2 hover:border-solid hover:bg-accent/50 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Quick Actions</h3>
                  <p className="text-xs text-muted-foreground">Add accounts, create groups, or connect new services</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Building2 className="h-3 w-3 mr-1" />
                  Add Bank
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <StreamlineFlexWallet className="h-3 w-3 mr-1" />
                  Add Wallet
                </Button>
                <Button size="sm" className="text-xs">
                  <FolderOpen className="h-3 w-3 mr-1" />
                  Create Group
                </Button>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Enhanced Account Types Section 
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Account Types</h2>
              <p className="text-sm text-muted-foreground">Connect different types of financial accounts</p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              View All
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACCOUNT_TYPES.map((accountType, index) => (
              <EnhancedAccountTypeCard 
                key={accountType.id} 
                accountType={accountType}
                index={index}
              />
            ))}
          </div>
        </div>*/}

        {/* Account Groups with Enhanced Design */}
        <div className="space-y-6">
          <AccountGroupsGrid
            onGroupSelect={handleGroupSelect}
            limit={8}
          />
           <Tabs defaultValue="tab1" className="flex flex-col gap-2">
            <TabsList variant="minimal" size="default">
              <TabsTrigger variant="minimal" value="tab1">
                <StreamlineUltimateAccountingCoins className="w-5 h-5" />
                Assets
              </TabsTrigger>
              <TabsTrigger variant="minimal" value="tab2">
                <SearchIcon className="w-5 h-5" />
                Explore
              </TabsTrigger>
              <TabsTrigger variant="minimal" value="tab3">
                <Heart className="w-5 h-5" />
                Favorites
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4 p-4 bg-background rounded-lg">
              <p className="text-muted-foreground">Floating action tabs with elevated design and shadow effects.</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
