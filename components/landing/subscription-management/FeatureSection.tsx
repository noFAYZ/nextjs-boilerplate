"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Wallet,
  PieChart,
  Target,
  Users,
  TrendingUp,
  Bell,
  LucideArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PhUsersDuotone, SolarPieChart2BoldDuotone, SolarWalletBoldDuotone } from "@/components/icons/icons";
import WalletCard from "@/components/crypto/WalletCard";
import { BudgetCard } from "@/components/budgets/budget-card";
import { GoalCard } from "@/components/goals/goal-card";
import { SubscriptionCard } from "@/components/subscriptions/subscription-card";
import { Card } from "@/components/ui/card";

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
    name: "Spotify",
    amount: 9.99,
    billingCycle: "MONTHLY" as const,
    nextBillingDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    status: "ACTIVE" as const,
    category: "Music",
    websiteUrl: "spotify.com",
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
        "w-full text-left p-6 rounded-3xl transition-all duration-0  border ",
        isActive
          ? "bg-accent/40  border-border/50"
          : "bg-none  border-transparent hover:bg-card "
      )}
    >
      <div className="flex items-start gap-3">

        <div
          className={cn(
            "flex items-center justify-center h-9 w-9 rounded-xl",
            "bg-gradient-to-br shadow-xs ring-1 ring-inset ring-foreground/10 from-muted to-accent"
          )}
        >

          <Icon
            className={cn(
              "h-6 w-6",
             "text-muted-foreground"
            )}
          />
        </div>

        <div className="flex-1">
          <div
            className={cn(
              "text-sm font-bold uppercase tracking-wider mb-1",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            {feature.tag}
          </div>
          <h3 className="text-lg font-semibold mb-1.5 text-foreground">
            {feature.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {feature.description}
          </p>
          <Button className="inline-flex items-center   text-[11px] h-7" size="sm" variant="steel">
            Learn more
            <LucideArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function WalletsStackVisual() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      {DEMO_WALLETS.map((wallet, idx) => (
        <motion.div
          key={wallet.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <WalletCard wallet={wallet} />
        </motion.div>
      ))}
    </div>
  );
}

function BudgetsVisual() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      {DEMO_BUDGETS.map((budget, idx) => (
        <motion.div
          key={budget.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <BudgetCard budget={budget as any} />
        </motion.div>
      ))}
    </div>
  );
}

function InsightsVisual() {
  const categories = [
    { name: "Groceries", amount: 1245, percentage: 28, icon: "🛒" },
    { name: "Dining", amount: 856, percentage: 19, icon: "🍽️" },
    { name: "Transport", amount: 654, percentage: 15, icon: "🚗" },
    { name: "Entertainment", amount: 432, percentage: 10, icon: "🎬" },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-1">Top Spending Categories</h3>
          <p className="text-sm text-muted-foreground">This month</p>
        </div>

        <div className="space-y-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="font-medium text-sm">{cat.name}</span>
                </div>
                <span className="text-sm font-bold">${cat.amount}</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.percentage}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SubscriptionsVisual() {
  return (
    <div className="grid grid-cols-1 gap-4 w-full max-w-2xl mx-auto">
      {DEMO_SUBSCRIPTIONS.map((subscription, idx) => (
        <motion.div
          key={subscription.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <SubscriptionCard subscription={subscription as any} />
        </motion.div>
      ))}
    </div>
  );
}

function GoalsVisual() {
  return (
    <div className="grid grid-cols-1 gap-4 w-full max-w-2xl mx-auto">
      {DEMO_GOALS.map((goal, idx) => (
        <motion.div
          key={goal.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <GoalCard goal={goal as any} />
        </motion.div>
      ))}
    </div>
  );
}

function AlertsVisual() {
  const upcomingBills = [
    { name: "Netflix", amount: 15.99, dueDate: "in 3 days", icon: "🎬" },
    { name: "Spotify", amount: 9.99, dueDate: "in 5 days", icon: "🎵" },
    { name: "Adobe CC", amount: 54.99, dueDate: "in 12 days", icon: "🎨" },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="p-6">
        <div className="mb-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Upcoming Bills</h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">
              Next 30 days
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {upcomingBills.map((bill, idx) => (
            <motion.div
              key={bill.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{bill.icon}</span>
                <div>
                  <div className="font-semibold text-sm">{bill.name}</div>
                  <div className="text-xs text-muted-foreground">Due {bill.dueDate}</div>
                </div>
              </div>
              <div className="text-sm font-bold">${bill.amount}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total upcoming</span>
            <span className="text-lg font-bold">$80.97</span>
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
    <section className="relative w-full py-16 md:py-24 bg-muted/60">
      <div className="container  mx-auto px-6 ">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Everything, in one app
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Connect your accounts and MoneyMappr will do the heavy lifting to
            categorize your finances. From there, you can track, budget,
            collaborate, and set goals specific to you.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center  rounded-2xl">
          {/* Left Features */}
          <div className="lg:col-span-4 space-y-4">
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
          <div className="lg:col-span-4 flex items-center justify-center min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="w-full"
              >
                <CenterVisual type={activeFeature.visual} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Features */}
          <div className="lg:col-span-4 space-y-4">
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

        {/* Mobile Feature Selector */}
        <div className="lg:hidden mt-8 flex flex-wrap justify-center gap-2">
          {FEATURES.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                activeFeature.id === feature.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {feature.tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
