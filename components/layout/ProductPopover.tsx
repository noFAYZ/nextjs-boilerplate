"use client";

import * as React from "react";
import Link from "next/link";
import {
  PieChart,
  Store,
  Target,
  Bot,
  Newspaper,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  BasilAppsSolid,
  DuoIconsBank,
  MageGoals,
  PhBrainDuotone,
  SolarInboxInBoldDuotone,
  SolarPieChart2BoldDuotone,
  SolarWalletMoneyBoldDuotone,
} from "../icons/icons";
import { Badge } from "../ui/badge";

export function ProductPopover() {
  const [isOpen, setIsOpen] = React.useState(false);

  const products = [
    {
      title: "Bank Portfolio",
      description:
        "Track all your bank accounts, balances, and transactions in one place.",
      icon: DuoIconsBank,
      color: "text-blue-600 dark:text-blue-400",
      gradient: "from-blue-500/10 to-blue-600/0",
      disabled: true,
    },
    {
      title: "Crypto Portfolio",
      description:
        "Manage your crypto assets and monitor performance across wallets.",
      icon: SolarWalletMoneyBoldDuotone,
      color: "text-orange-800 dark:text-orange-600",
      gradient: "from-orange-500/10 to-orange-600/0",
      disabled: true,
    },
    {
      title: "Subscription Management",
      description:
        "Keep track of all your recurring payments and cancel unwanted ones.",
      icon: SolarInboxInBoldDuotone,
      color: "text-purple-600 dark:text-purple-400",
      gradient: "from-purple-500/10 to-purple-600/0",
      link: "/subscriptions",
      disabled: false,
    },
  ];

  const tools = [
    {
      title: "Expense Tracker",
      description:
        "Automatically categorize and visualize your spending habits.",
      icon: SolarPieChart2BoldDuotone,
      color: "text-emerald-600 dark:text-emerald-400",
      gradient: "from-emerald-500/10 to-emerald-600/0",
      disabled: true,
    },
    {
      title: "Budget & Goal Management",
      description:
        "Plan budgets, set savings goals, and track your progress easily.",
      icon: MageGoals,
      color: "text-amber-600 dark:text-amber-400",
      gradient: "from-amber-500/10 to-amber-600/0",
      disabled: true,
    },
    {
      title: "Mappr AI",
      description:
        "Your AI assistant for personalized financial insights and automation.",
      icon: PhBrainDuotone,
      color: "text-indigo-600 dark:text-indigo-400",
      gradient: "from-indigo-500/10 to-indigo-600/0",
      disabled: true,
    },
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        asChild
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Button
          variant="ghost"
          size="icon"
          className="rounded-md hover:bg-muted transition-all focus-visible:ring-0"
          aria-label="Open product menu"
        >
          <BasilAppsSolid className="w-6 h-6" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn("min-w-3xl p-4 rounded-2xl border border-border bg-card")}
        align="start"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Products */}
          <div className="space-y-3">
            {products.map(
              (
                { title, description, icon: Icon, color, gradient, link, disabled },
                i
              ) => {
                const Wrapper = disabled ? "div" : Link;
                const wrapperProps = disabled
                  ? {}
                  : { href: link ?? "#", className: "no-underline" };

                return (
                  <Wrapper key={title} {...(wrapperProps as any)}>
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn(
                        "relative flex items-center gap-3 p-2 rounded-xl border drop-shadow-sm transition-all group overflow-hidden",
                        disabled
                          ? "opacity-70"
                          : "bg-muted/50 hover:bg-muted/70 hover:shadow-sm cursor-pointer"
                      )}
                    >
                      {disabled && (
                        <div className="absolute inset-0 bg-background/65 backdrop-blur-[1px] flex items-center justify-center rounded-xl z-10">
                          <Badge
                            variant="max"
                            className="text-[10px] px-2 py-[2px] rounded-full "
                          >
                            Coming Soon
                          </Badge>
                        </div>
                      )}

                      <div
                        className={cn(
                          "relative flex items-center justify-center w-11 h-11 rounded-lg bg-accent shrink-0",
                          gradient
                        )}
                      >
                        <Icon className={cn("w-7 h-7", color)} />
                      </div>

                      <div className="flex-1 text-sm leading-snug">
                        <span className="font-semibold text-sm">{title}</span>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {description}
                        </p>
                      </div>
                    </motion.div>
                  </Wrapper>
                );
              }
            )}
          </div>

          {/* Right: Smart Tools */}
          <div className="space-y-3">
            {tools.map(
              ({ title, description, icon: Icon, color, gradient, disabled }, i) => {
                const Wrapper = disabled ? "div" : Link;
                const wrapperProps = disabled
                  ? {}
                  : { href: "#", className: "no-underline" };

                return (
                  <Wrapper key={title} {...(wrapperProps as any)}>
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className={cn(
                        "relative flex items-center gap-3 p-2 rounded-xl border border-border transition-all drop-shadow-sm group overflow-hidden shadow",
                        disabled
                          ? "opacity-70"
                          : "bg-muted/50 hover:bg-muted/70 hover:shadow-sm cursor-pointer"
                      )}
                    >
                      {disabled && (
                        <div className="absolute inset-0 bg-background/65 backdrop-blur-[1px] flex items-center justify-center rounded-xl z-10">
                          <Badge
                            variant="max"
                            className="text-[10px] px-2 py-[2px] rounded-full "
                          >
                            Coming Soon
                          </Badge>
                        </div>
                      )}

                      <div
                        className={cn(
                          "relative flex items-center justify-center w-11 h-11 rounded-lg bg-accent shrink-0",
                          gradient
                        )}
                      >
                        <Icon className={cn("w-7 h-7", color)} />
                      </div>

                      <div className="flex-1 text-xs leading-snug">
                        <span className="font-semibold text-sm">{title}</span>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {description}
                        </p>
                      </div>
                    </motion.div>
                  </Wrapper>
                );
              }
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
