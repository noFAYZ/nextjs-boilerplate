'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, AlertCircle, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CurrencyDisplay } from "../ui/currency-display";
import {
  FluentBuildingBank28Regular,
  HugeiconsCreditCard,
  SolarCheckCircleBoldDuotone,
  SolarClockCircleBoldDuotone,
} from "../icons/icons";
import { useSyncBankAccount } from "@/lib/queries";
import { useBankingStore } from "@/lib/stores";
import { Card } from "../ui/card";

const bankTypeGradients: Record<string, string> = {
  CHECKING: "from-emerald-500 to-emerald-600",
  SAVINGS: "from-green-500 to-green-600",
  CREDIT_CARD: "from-blue-500 to-blue-600",
  INVESTMENT: "from-purple-500 to-purple-600",
  LOAN: "from-orange-500 to-orange-600",
  DEFAULT: "from-gray-500 to-gray-600",
};

const accountTypeLabels: Record<string, string> = {
  CHECKING: "Checking",
  SAVINGS: "Savings",
  CREDIT_CARD: "Credit Card",
  INVESTMENT: "Investment",
  LOAN: "Loan",
};

interface BankAccount {
  id: string;
  name: string;
  type: string;
  institutionName: string;
  accountNumber: string;
  balance: string;
  currency?: string;
  syncStatus?: string;
  tellerLastFour?: string;
  availableBalance?: string;
  ledgerBalance?: string;
  _count?: {
    bankTransactions: number;
  };
}

interface BankCardProps {
  account: BankAccount;
}

const BankCard: React.FC<BankCardProps> = ({ account }) => {
  const router = useRouter();
  const { realtimeSyncStates } = useBankingStore();
  const { mutate: syncAccount } = useSyncBankAccount();

  const balance = parseFloat(account.availableBalance || account.balance || "0");
  const gradient = bankTypeGradients[account.type] || bankTypeGradients.DEFAULT;
  const accountLabel = accountTypeLabels[account.type] || account.type;
  const lastFour = account.tellerLastFour || account.accountNumber.slice(-4);

  const accountSyncState = realtimeSyncStates[account.id];
  const isSyncing =
    accountSyncState && ["queued", "syncing"].includes(accountSyncState.status);

  const isCreditCard = account.type === "CREDIT_CARD";
  const creditLimit = isCreditCard ? parseFloat(account.ledgerBalance || "0") : 0;
  const creditUsed = isCreditCard ? creditLimit - balance : 0;
  const creditUtilization =
    isCreditCard && creditLimit > 0
      ? Math.round((creditUsed / creditLimit) * 100)
      : 0;

  const handleAccountClick = () => router.push(`/accounts/bank/${account.id}`);

  const handleCopyAccountNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(account.accountNumber);
  };

  const getSyncStatusIcon = () => {
    if (isSyncing)
      return <Activity className="h-4 w-4 text-primary animate-spin" />;

    switch (accountSyncState?.status || account.syncStatus) {
      case "connected":
      case "completed":
        return (
          <SolarCheckCircleBoldDuotone className="h-4 w-4 text-lime-600 dark:text-green-400" />
        );
      case "failed":
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return (
          <SolarClockCircleBoldDuotone className="h-4 w-4 text-yellow-600" />
        );
    }
  };

  const getAccountIcon = () =>
    isCreditCard ? (
      <HugeiconsCreditCard className="h-6 w-6 text-white" />
    ) : (
      <FluentBuildingBank28Regular className="h-6 w-6 text-white" />
    );

  return (
    <Card
     
      onClick={handleAccountClick}
 
      className={cn(
        "group relative   border border-border/60 bg-card backdrop-blur-sm",
        "shadow-sm transition-all cursor-pointer overflow-hidden p-3 space-y-3"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="relative">
            <div
              className={cn(
                "h-11 w-11 rounded-full bg-gradient-to-br flex items-center justify-center shadow-inner",
                gradient
              )}
            >
              {getAccountIcon()}
            </div>
            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border bg-background shadow-sm">
              {getSyncStatusIcon()}
            </div>
          </div>

          {/* Bank Info */}
          <div className="min-w-0">
            <h3
              className="font-semibold text-sm leading-tight truncate"
              title={account.name}
            >
              {account.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="truncate">{account.institutionName}</span>
              <code className="text-xs font-mono text-muted-foreground/80">
                •••• {lastFour}
              </code>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyAccountNumber}
                className="h-4 w-4 hover:bg-accent"
                title="Copy Account Number"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
            {isCreditCard ? "Available Credit" : "Balance"}
          </p>
          <CurrencyDisplay
            amountUSD={balance}
            className="font-bold text-base sm:text-lg"
          />
        </div>
      </div>

      {/* Credit Utilization */}
      {isCreditCard && creditLimit > 0 && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Credit Used</span>
            <span className="font-semibold">{creditUtilization}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${creditUtilization}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full bg-gradient-to-r",
                creditUtilization > 80
                  ? "from-red-500 to-red-600"
                  : creditUtilization > 50
                  ? "from-amber-500 to-amber-600"
                  : "from-green-500 to-green-600"
              )}
            />
          </div>
        </div>
      )}

      {/* Sync progress */}
      {isSyncing && accountSyncState && (
        <div className="border-t border-border/50 pt-2.5">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span className="truncate">
              {accountSyncState.message || "Syncing..."}
            </span>
            {accountSyncState.progress !== undefined && (
              <span className="font-semibold">{accountSyncState.progress}%</span>
            )}
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${accountSyncState.progress || 0}%`,
              }}
              transition={{ duration: 0.4 }}
              className={cn("h-full bg-gradient-to-r", gradient)}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default BankCard;
