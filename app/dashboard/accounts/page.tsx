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
} from "lucide-react";
import Link from "next/link";
import { GuidanceBank, SolarWalletBoldDuotone } from "@/components/icons/icons";
import { AccountGroupsGrid } from "@/components/accounts/AccountGroupsGrid";
import { useGroupedAccounts } from "@/lib/hooks/use-account-groups";
import type { AccountGroup } from "@/lib/types/account-groups";
import { Separator } from "@/components/ui/separator";

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

function AccountTypeCard({
  accountType,
}: {
  accountType: (typeof ACCOUNT_TYPES)[0];
}) {
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (accountType.status === "active") {
      return (
        <Link href={accountType.href}>
          <Card className="group hover:shadow-lg py-2 px-3 cursor-pointer transition-all">
            {children}
          </Card>
        </Link>
      );
    }
    return (
      <Card className="py-2 px-3 opacity-60">
        {children}
      </Card>
    );
  };

  return (
    <CardWrapper>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 bg-gradient-to-br ${accountType.color} rounded-[0.7rem] flex items-center justify-center`}
          >
            <accountType.icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-sm">{accountType.title}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                className="text-[10px] rounded-[0.5rem]"
                variant={
                  accountType.status === "active" ? "outline" : "secondary"
                }
              >
                {accountType.status === "active" ? "Active" : "Coming Soon"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {accountType.count}
              </span>
            </div>
          </div>
        </div>
        {accountType.status === "active" && (
          <ArrowRight className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
        )}
      </div>
    </CardWrapper>
  );
}

export default function AccountsPage() {
  const { stats } = useGroupedAccounts();

  const handleGroupSelect = (group: AccountGroup) => {
    // Navigate to group detail page or show group contents
    console.log('Selected group:', group);
  };

  return (
    <div className="mx-auto p-6 max-w-7xl space-y-20">
      {/* Quick Stats */}
      <div className="flex items-center justify-between gap-4">
    
         
              <div>
                <p className="text-3xl md:text-4xl font-bold">${stats.totalValue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground uppercase">Total Value</p>
              </div>
          
      

              
         
            <div className="flex flex-col md:flex-row items-center gap-2">



             <div className="bg-muted flex md:flex-col gap-2 md:gap-0 items-baseline px-4 py-1 rounded-lg">

         
                <p className="text-lg font-semibold">{stats.totalAccounts}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Bank Accounts</p>
              </div>
              <Separator orientation="vertical" className="hidden md:flex h-6" />
              <div className="bg-muted flex md:flex-col gap-2 md:gap-0 items-baseline px-4 py-1 rounded-lg">
                <p className="text-lg font-semibold">{stats.totalWallets}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Crypto Wallets</p>
              </div>
            </div>
         
      </div>

      {/* Account Types 
    
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACCOUNT_TYPES.map((accountType) => (
              <AccountTypeCard key={accountType.id} accountType={accountType} />
            ))}
          </div>*/}
        
      {/* Account Groups */}
      <div className="space-y-8">
   
        
        
        <AccountGroupsGrid
          onGroupSelect={handleGroupSelect}
          limit={6}
        />
      </div>
      
    </div>
  );
}
