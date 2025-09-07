"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { SolarWalletBoldDuotone } from "@/components/icons/icons";

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
  return (
    <Card className="group hover:shadow-lg py-2 px-3 cursor-pointer">
     
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
               
              </div>
            </div>
          </div>


              <ArrowRight className="h-5 w-5 mr-2" />
          
        </div>
     
      

    </Card>
  );
}

export default function AccountsPage() {
  return (
    <div className=" mx-auto py-6 max-w-7xl space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Total Value
          </p>
          <p className="text-3xl font-bold">$42,350</p>
        </div>
  

 
      </div>

      {/* Account Types */}
    
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {ACCOUNT_TYPES.map((accountType) => (
            <AccountTypeCard key={accountType.id} accountType={accountType} />
          ))}
        </div>
     



    </div>
  );
}
