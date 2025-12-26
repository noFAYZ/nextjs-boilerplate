"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

// CSS animations for fast, efficient performance
const animationStyles = `
  @keyframes expand {
    from {
      width: 0;
    }
    to {
      width: var(--target-width, 100%);
    }
  }
`;
import {
  ArrowRight,
  Wallet,
  PieChart,
  Target,
  Users,
  TrendingUp,
  Bell,
  LucideArrowRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PhUsersDuotone, SolarPieChart2BoldDuotone, SolarWalletBoldDuotone } from "@/components/icons/icons";
import WalletCard from "@/components/crypto/WalletCard";
import { BudgetCard } from "@/components/budgets/budget-card";
import { GoalCard } from "@/components/goals/goal-card";
import { SubscriptionCard } from "@/components/subscriptions/subscription-card";
import { Card } from "@/components/ui/card";
import { NetWorthWidget } from "@/components/dashboard-widgets";
import { SpendingCategoriesWidget } from "@/components/dashboard-widgets";
import { UpcomingBillsWidget } from "@/components/dashboard-widgets";
import { ScrollReveal } from "../scroll-reveal";
import { BgGradient } from "../bg/bg-gradient";
import Image from "next/image";

// Demo Data
const DEMO_WALLETS = [
  {
    id: "demo-1",
    name: "Main Wallet",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    network: "ethereum",
    totalBalanceUsd: "45,234.50",
    chain: "ethereum",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    name: "Crypto Savings",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    network: "bitcoin",
    totalBalanceUsd: "28,750.00",
    chain: "bitcoin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-3",
    name: "Trading Wallet",
    address: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    network: "polygon",
    totalBalanceUsd: "12,456.75",
    chain: "polygon",
    createdAt: new Date().toISOString(),
  },
];

const DEMO_BUDGETS = [
  {
    id: "demo-budget-1",
    name: "Monthly Expenses",
    amount: 3500,
    spent: 2450,
    remaining: 1050,
    period: "MONTHLY" as const,
    categories: ["Groceries", "Dining", "Transport"],
    status: "ACTIVE" as const,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    percentageUsed: 70,
    isOnTrack: true,
    isExceeded: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-budget-2",
    name: "Entertainment",
    amount: 500,
    spent: 425,
    remaining: 75,
    period: "MONTHLY" as const,
    categories: ["Streaming", "Games"],
    status: "ACTIVE" as const,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    percentageUsed: 85,
    isOnTrack: true,
    isExceeded: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEMO_GOALS = [
  {
    id: "demo-goal-1",
    name: "Dream Vacation",
    targetAmount: 15000,
    currentAmount: 4500,
    deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "HIGH" as const,
    category: "Travel",
    description: "Trip to Europe",
  },
  {
    id: "demo-goal-2",
    name: "Emergency Fund",
    targetAmount: 10000,
    currentAmount: 8500,
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "CRITICAL" as const,
    category: "Savings",
    description: "Financial safety net",
  },
];

const DEMO_SUBSCRIPTIONS = [
  {
    id: "demo-sub-1",
    name: "Netflix",
    amount: 15.99,
    billingCycle: "MONTHLY" as const,
    nextBillingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "ACTIVE" as const,
    category: "Entertainment",
    websiteUrl: "netflix.com",
  },
  {
    id: "demo-sub-2",
    name: "Claude",
    amount: 9.99,
    billingCycle: "MONTHLY" as const,
    nextBillingDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    status: "ACTIVE" as const,
    category: "AI",
    websiteUrl: "claude.ai",
  },
  {
    id: "demo-sub-3",
    name: "Adobe Creative Cloud",
    amount: 54.99,
    billingCycle: "MONTHLY" as const,
    nextBillingDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: "ACTIVE" as const,
    category: "Software",
    websiteUrl: "adobe.com",
  },
  {
    id: "demo-sub-3",
    name: "Dropbox Pro",
    amount: 54.99,
    billingCycle: "MONTHLY" as const,
    nextBillingDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: "ACTIVE" as const,
    category: "Software",
    websiteUrl: "dropbox.com",
  },
];

// Demo data for visualization widgets
const DEMO_NET_WORTH_ALLOCATION = [
  { category: "CASH", amount: 32680, percent: 38, color: "bg-green-600/70" },
  { category: "INVESTMENTS", amount: 27060, percent: 31, color: "bg-lime-600/60" },
  { category: "CRYPTO", amount: 15400, percent: 18, color: "bg-orange-50" },
  { category: "ASSETS", amount: 10920, percent: 13, color: "bg-l-200/85" },
];

const DEMO_NET_WORTH_ACCOUNTS = {
  CASH: [
    { id: "acc-1", name: "Checking Account", balance: 18000 },
    { id: "acc-2", name: "Savings Account", balance: 14680 },
  ],
  INVESTMENTS: [
    { id: "inv-1", name: "S&P 500 ETF", balance: 18000 },
    { id: "inv-2", name: "Bond Portfolio", balance: 9060 },
  ],
  CRYPTO: [
    { id: "crypto-1", name: "Bitcoin Holdings", balance: 9600 },
    { id: "crypto-2", name: "Ethereum & Others", balance: 5800 },
  ],
  ASSETS: [
    { id: "asset-1", name: "Home Equity", balance: 10920 },
  ],
};

const DEMO_SPENDING_CATEGORIES = [
  { name: "Groceries", value: 1200, percentage: 35 },
  { name: "Entertainment", value: 600, percentage: 17 },
  { name: "Transport", value: 450, percentage: 13 },
  { name: "Utilities", value: 350, percentage: 10 },
  { name: "Dining", value: 800, percentage: 25 },
];

const DEMO_UPCOMING_BILLS = [
  {
    id: "bill-1",
    name: "Netflix",
    amount: 15.99,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Entertainment",
  },
  {
    id: "bill-2",
    name: "Spotify",
    amount: 9.99,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Music",
  },
  {
    id: "bill-3",
    name: "Electric Bill",
    amount: 125.50,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Utilities",
  },
];

const FEATURES = [
  {
    id: "track",
    tag: "TRACK",
    title: "Know where you stand",
    description:
      "From your net worth to day-to-day spending and cash flow, feel confident about where you're at.",
    icon: SolarWalletBoldDuotone,
    position: "left",
    visual: "cards-stack",
  },
  {
    id: "budget",
    tag: "BUDGET",
    title: "Budgeting that fits your life",
    description:
      "Create a budget that flexes to your needs - and not the other way around - so you can stay focused on the things that matter most.",
    icon: SolarPieChart2BoldDuotone,
    position: "left",
    visual: "budget-card",
  },
  {
    id: "insights",
    tag: "INSIGHTS",
    title: "Understand your spending",
    description:
      "Visualize where your money goes with detailed category breakdowns and spending patterns over time.",
    icon: TrendingUp,
    position: "left",
    visual: "insights-card",
  },
  {
    id: "subscriptions",
    tag: "SUBSCRIPTIONS",
    title: "Never miss a payment",
    description:
      "Track all your recurring subscriptions in one place and get notified before charges hit your account.",
    icon: Bell,
    position: "right",
    visual: "collaboration-card",
  },
  {
    id: "plan",
    tag: "PLAN",
    title: "Set goals and crush them",
    description:
      "From planning a vacation to a home remodel — track your goals and adjust your cash flow to make sure you stick the landing.",
    icon: Target,
    position: "right",
    visual: "goals-card",
  },
  {
    id: "alerts",
    tag: "UPCOMING BILLS",
    title: "Stay ahead of your bills",
    description:
      "See all upcoming bills and subscriptions in one view so you're never surprised by charges.",
    icon: Bell,
    position: "right",
    visual: "alerts-card",
  },
];

function FeatureButton({
  feature,
  isActive,
  onClick,
}: {
  feature: (typeof FEATURES)[0];
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = feature.icon;

  return (
    <div
      onClick={onClick}
      onMouseEnter={onClick}
      className={cn(
        "w-full text-left p-3  transition-all duration-0  border cursor-default ",
        isActive
          ? "bg-card border-border/80"
          : "bg-none  border-transparent hover:bg-card "
      )}
    >
      <div className="flex items-start gap-3 group">

        <div
          className={cn(
            "flex items-center justify-center h-9 w-9 rounded-full",
            " bg-card   shadow-lg border ",
            isActive && "bg-orange-100 dark:bg-orange-400/10"
          )}
        >

          <Icon
            className={cn(
              "h-5 w-5",
             "text-orange-800"
            )}
          />
        </div>

        <div className="flex-1">
          <div
            className={cn(
              "text-xs font-bold uppercase tracking-tight ",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            {feature.tag}
          </div>
          <h3 className="text-lg font-bold mb-3 text-foreground">
            {feature.title}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-sm mb-4">
            {feature.description}
          </p>
          <Button className="inline-flex items-center   text-[11px] h-7" size="sm" variant="brand">
            Learn more
            <LucideArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function WalletsStackVisual() {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const totalNetWorth = DEMO_NET_WORTH_ALLOCATION.reduce((sum, item) => sum + item.amount, 0);

  const categoryConfig: Record<string, { icon: string; label: string; dot: string }> = {
    CASH: { icon: "$", label: "Cash", dot: "bg-orange-600" },
    INVESTMENTS: { icon: "📈", label: "Investments", dot: "bg-orange-400" },
    CRYPTO: { icon: "₿", label: "Crypto", dot: "bg-orange-300" },
    ASSETS: { icon: "🏠", label: "Assets", dot: "bg-orange-200" },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="relative border border-border/50 shadow-xs gap-4 h-full w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h3 className="text-sm font-semibold text-foreground">Net Worth</h3>
        </div>

        <div
          className="px-4 pb-4 animate-in fade-in duration-100"
        >
          <div className="space-y-6">
            {/* Net Worth Header */}
            <div className="relative rounded-2xl p-4 bg-gradient-to-br from-accent/50 via-accent/60 to-accent/50 dark:from-accent/80 dark:via-accent/50 dark:to-accent/80 border-dashed border-2 border-accent/80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium text-black/50 dark:text-white/50 tracking-wider uppercase">
                      Total Net Worth
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-black dark:text-white">
                      ${totalNetWorth.toLocaleString()}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 11l5-5 5 5" />
                    </svg>
                    <span className="text-sm font-medium">+12.4%</span>
                  </div>
                </div>

                {/* Allocation Bar */}
                <div className="relative w-full h-8 rounded-lg overflow-hidden bg-black/5 dark:bg-white/5">
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 to-black/10 mix-blend-overlay" />
                  {DEMO_NET_WORTH_ALLOCATION.map((item) => (
                    <div
                      key={item.category}
                      style={{ width: `${item.percent}%` }}
                      className={cn("h-full relative inline-block transition-all duration-300", item.color)}
                    />
                  ))}
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2.5">
                  {DEMO_NET_WORTH_ALLOCATION.map((item) => {
                    const cfg = categoryConfig[item.category];
                    return (
                      <div key={item.category} className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full shadow-sm", cfg.dot)} />
                        <div className="flex items-baseline gap-1">
                          <span className="text-[12px] font-medium text-black/70 dark:text-white/70">
                            {cfg.label}
                          </span>
                          <span className="text-[12px] font-semibold text-black dark:text-white">
                            {item.percent}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Category List */}
            <div className="space-y-1.5">
              {DEMO_NET_WORTH_ALLOCATION.map((item) => {
                const cfg = categoryConfig[item.category];
                const accounts = DEMO_NET_WORTH_ACCOUNTS[item.category as keyof typeof DEMO_NET_WORTH_ACCOUNTS] || [];
                const isExpanded = expandedGroup === item.category;

                return (
                  <div key={item.category}>
                    {/* Category Header */}
                    <button
                      onClick={() => setExpandedGroup(isExpanded ? null : item.category)}
                      className="group relative border border-border/70 w-full flex items-center gap-2.5 p-2 rounded-lg transition-colors duration-200 cursor-pointer bg-muted/50 hover:bg-muted/50"
                    >
                      <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0 text-sm">
                        {cfg.icon}
                      </div>

                      <div className="flex-1 min-w-0 text-left">
                        <div className="font-semibold text-sm text-foreground">{cfg.label}</div>
                        <div className="text-[10px] font-medium text-muted-foreground">
                          {accounts.length} {accounts.length === 1 ? "account" : "accounts"}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="text-right">
                          <div className="font-semibold text-sm text-foreground">${item.amount.toLocaleString()}</div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Accounts */}
                    {isExpanded && (
                      <div className="space-y-1 mt-1 ml-2 transition-all duration-200">
                        {accounts.map((account) => (
                          <div
                            key={account.id}
                            className="group relative border border-border/60 flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
                          >
                            <div className="h-6 w-6 rounded bg-muted flex items-center justify-center flex-shrink-0 text-xs">
                              📊
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">{account.name}</p>
                            </div>
                            <div className="flex-shrink-0">
                              <p className="text-xs font-semibold text-foreground">
                                ${account.balance.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function BudgetsVisual() {
  return (
    <div className="w-full max-w-md mx-auto space-y-3">

        {DEMO_BUDGETS.map((budget, idx) => (
          <div
            key={budget.id}
            className="animate-in fade-in slide-in-from-bottom-2 duration-200"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <BudgetCard budget={budget as Record<string, unknown>} />
          </div>
        ))}

    </div>
  );
}

function InsightsVisual() {
  const totalSpending = DEMO_SPENDING_CATEGORIES.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="relative border border-border/50 shadow-xs p-6 overflow-hidden">
        <div
          className="space-y-4 animate-in fade-in zoom-in duration-300"
        >
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Monthly Spending</h3>
            <div className="text-3xl font-bold text-foreground">${totalSpending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </div>

          <div className="space-y-3 pt-4">
            {DEMO_SPENDING_CATEGORIES.map((category, idx) => (
              <div
                key={category.name}
                className="space-y-1 animate-in fade-in slide-in-from-left-3 duration-300"
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{category.name}</span>
                  <span className="text-muted-foreground">${category.value}</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-in"
                    style={{
                      animation: `expand ${0.4 + idx * 0.02}s ease-out ${idx * 0.04}s both`,
                    }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">{category.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function SubscriptionsVisual() {
  return (
    <div className="w-full max-w-md mx-auto space-y-3">

        {DEMO_SUBSCRIPTIONS.map((subscription, idx) => (
          <div
            key={subscription.id}
            className="animate-in fade-in slide-in-from-bottom-2 duration-200"
            style={{ animationDelay: `${idx * 0.06}s` }}
          >
            <SubscriptionCard subscription={subscription as UserSubscription} />
          </div>
        ))}

    </div>
  );
}

function GoalsVisual() {
  return (
    <div className="w-full max-w-md mx-auto space-y-3">

        {DEMO_GOALS.map((goal, idx) => (
          <div
            key={goal.id}
            className="animate-in fade-in slide-in-from-bottom-2 duration-200"
            style={{ animationDelay: `${idx * 0.06}s` }}
          >
            <GoalCard goal={goal as Goal} className="opacity-100"/>
          </div>
        ))}

    </div>
  );
}

function AlertsVisual() {
  const totalUpcoming = DEMO_UPCOMING_BILLS.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="relative border border-border/50 shadow-xs p-6 overflow-hidden">
        <div
          className="space-y-4 animate-in fade-in zoom-in duration-300"
        >
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Upcoming Bills</h3>
            <div className="text-3xl font-bold text-foreground">${totalUpcoming.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Next 30 days</p>
          </div>

          <div className="space-y-2 pt-4">
            {DEMO_UPCOMING_BILLS.map((bill, idx) => {
              const daysUntilDue = Math.ceil(
                (new Date(bill.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200 animate-in fade-in slide-in-from-left-3 duration-300"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-foreground">{bill.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400">
                        {daysUntilDue}d
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{bill.category}</p>
                  </div>
                  <div className="text-right ml-2">
                    <div className="font-semibold text-sm text-foreground">${bill.amount.toFixed(2)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}

function CenterVisual({ type }: { type: string }) {
  switch (type) {
    case "cards-stack":
      return <WalletsStackVisual />;
    case "budget-card":
      return <BudgetsVisual />;
    case "insights-card":
      return <InsightsVisual />;
    case "collaboration-card":
      return <SubscriptionsVisual />;
    case "goals-card":
      return <GoalsVisual />;
    case "alerts-card":
      return <AlertsVisual />;
    default:
      return <WalletsStackVisual />;
  }
}

export default function MoneyMapprFeatureSection() {
  const [activeFeature, setActiveFeature] = useState(FEATURES[0]);

  const leftFeatures = FEATURES.filter((f) => f.position === "left");
  const rightFeatures = FEATURES.filter((f) => f.position === "right");

  return (
    <>
      <style>{animationStyles}</style>
      <section className="relative w-full py-20 md:py-50  ">
      <div className="max-w-7xl   mx-auto  ">
        {/* Header */}
   
        <ScrollReveal>
       
          
       <div className="relative max-w-lg mx-auto  mb-8 text-center">
     <div className="mx-auto  text-center ">
       <h2 className="text-3xl md:text-4xl font-bold mb-4">
       Everything, in one app
       </h2>
       <p className="text-sm md:text-base text-muted-foreground">
       Connect your accounts and MoneyMappr will do the heavy lifting to
            categorize your finances. From there, you can track, budget,
            collaborate, and set goals specific to you. </p>
     </div>
   </div>


     </ScrollReveal>




    {/* Mobile Feature Selector */}
    <div className="lg:hidden my-8 overflow-x-auto pb-2">
          <div className="flex gap-2 justify-center flex-wrap">
            {FEATURES.map((feature) => (
              <Button
                key={feature.id}
                onClick={() => setActiveFeature(feature)}
                variant={activeFeature.id === feature.id ? "steel" : "outline2"}
                className="duration-150 transition-all flex-shrink-0 whitespace-nowrap"
                size="sm"
              >
                {feature.tag}
              </Button>
            ))}
          </div>
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center rounded-2xl bg-background">
          {/* Left Features */}
          <div className="hidden sm:block lg:col-span-4 space-y-12">
            {leftFeatures.map((feature) => (
              <FeatureButton
                key={feature.id}
                feature={feature}
                isActive={activeFeature.id === feature.id}
                onClick={() => setActiveFeature(feature)}
              />
            ))}
          </div>

          {/* Center Visual */}
          <div className="relative lg:col-span-4 flex items-center justify-center h-full w-full bg-muted p-4 rounded-lg">
{/*           <BgGradient  className=" rounded-xl border shadow over" from="hsl(8.18,25%,82.75%)" to="hsl(20.77,65%,68.63%)"  /> */}
            <div
              key={activeFeature.id}
              className="w-full  animate-in fade-in duration-150"
            >     
                       
              <CenterVisual type={activeFeature.visual} />
            </div>
          </div>

          {/* Right Features */}
          <div className="hidden sm:block lg:col-span-4 space-y-12">
            {rightFeatures.map((feature) => (
              <FeatureButton
                key={feature.id}
                feature={feature}
                isActive={activeFeature.id === feature.id}
                onClick={() => setActiveFeature(feature)}
              />
            ))}
          </div>
        </div>


      </div>
      {/* 61  */}
      <Image src="/patterns/shape-61.svg" alt="Mappr logo" width={500} height={500} className="absolute left-0 bottom-0 -z-20 object-contain" priority />
   
      <Image src="/patterns/shape-61.svg" alt="Mappr logo" width={100} height={100} className="absolute right-50 top-0 -z-20 object-contain" priority />
      <Image src="/patterns/shape-61.svg" alt="Mappr logo" width={300} height={300} className="absolute right-4 top-20 -z-20 object-contain" priority />
    </section>
    </>
  );
}
