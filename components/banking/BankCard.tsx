'use client'
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, RefreshCw, ChevronRight, Activity, AlertCircle, CreditCard, Landmark } from "lucide-react";
import { useRouter } from 'next/navigation';
import { CurrencyDisplay } from "../ui/currency-display";
import { FluentBuildingBank28Regular, HugeiconsCreditCard } from "../icons/icons";
import { SolarCheckCircleBoldDuotone, SolarClockCircleBoldDuotone } from "../icons/icons";
import { useSyncBankAccount } from "@/lib/queries";
import { useBankingStore } from "@/lib/stores";

// Bank type gradients
const bankTypeGradients: Record<string, string> = {
  CHECKING: 'from-emerald-500 to-emerald-600',
  SAVINGS: 'from-green-500 to-green-600',
  CREDIT_CARD: 'from-blue-500 to-blue-600',
  INVESTMENT: 'from-purple-500 to-purple-600',
  LOAN: 'from-orange-500 to-orange-600',
  DEFAULT: 'from-gray-500 to-gray-600',
};

// Account type display names
const accountTypeLabels: Record<string, string> = {
  CHECKING: 'Checking',
  SAVINGS: 'Savings',
  CREDIT_CARD: 'Credit Card',
  INVESTMENT: 'Investment',
  LOAN: 'Loan',
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

  const balance = parseFloat(account.availableBalance || account.balance || '0');
  const gradient = bankTypeGradients[account.type] || bankTypeGradients.DEFAULT;
  const accountLabel = accountTypeLabels[account.type] || account.type;
  const lastFour = account.tellerLastFour || account.accountNumber.slice(-4);
  const transactionCount = account._count?.bankTransactions || 0;

  const accountSyncState = realtimeSyncStates[account.id];
  const isSyncing = accountSyncState && ['queued', 'syncing'].includes(accountSyncState.status);

  // Credit card specific calculations
  const isCreditCard = account.type === 'CREDIT_CARD';
  const creditLimit = isCreditCard ? parseFloat(account.ledgerBalance || '0') : 0;
  const creditUsed = isCreditCard ? creditLimit - balance : 0;
  const creditUtilization = isCreditCard && creditLimit > 0
    ? Math.round((creditUsed / creditLimit) * 100)
    : 0;

  const handleAccountClick = () => {
    router.push(`/accounts/bank/${account.id}`);
  };

  const handleCopyAccountNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(account.accountNumber);
  };

  const handleSync = (e: React.MouseEvent) => {
    e.stopPropagation();
    syncAccount(account.id);
  };

  const getSyncStatusIcon = () => {
    if (isSyncing) {
      return <Activity className="h-4 w-4 text-primary animate-pulse" />;
    }

    switch (accountSyncState?.status || account.syncStatus) {
      case 'connected':
      case 'completed':
        return <SolarCheckCircleBoldDuotone className="h-3.5 w-3.5 text-lime-700 dark:text-green-400" />;
      case 'failed':
      case 'error':
        return <AlertCircle className="h-3.5 w-3.5 text-destructive" />;
      default:
        return <SolarClockCircleBoldDuotone className="h-3.5 w-3.5 text-yellow-700" />;
    }
  };

  const getAccountIcon = () => {
    if (isCreditCard) {
      return <HugeiconsCreditCard className="h-6 w-6 text-white" />;
    }
    return <FluentBuildingBank28Regular className="h-6 w-6 text-white" />;
  };

  return (
    <div
      onClick={handleAccountClick}
      className={cn( "group border bg-muted/50 rounded-xl hover:bg-muted/70 transition-colors duration-75 cursor-pointer p-3 min-w-sm" )}>
   
        {/* Header: Icon + Name + Institution */}

        <div className="flex items-center justify-between gap-2.5 mb-2.5">

          <div className="flex items-start gap-2.5">
                    {/* Bank Icon with gradient */}
                    <div className="relative flex-shrink-0">
                      <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center opacity-90", gradient)}>
                        {getAccountIcon()}
                      </div>
                      {/* Sync Status Badge */}
                      <div
                        className="absolute -top-1 -right-1 h-5 w-5 bg-background rounded-full flex items-center justify-center border border-border shadow-sm"
                        title="Sync status"
                      >
                        {getSyncStatusIcon()}
                      </div>
                    </div>

                    {/* Account Name + Institution */}
                    <div className="flex-1 min-w-0">
                      <div className="flex gap-1 items-center mb-0.5">
                      <h3 className="font-bold text-sm truncate " title={account.name}>
                        {account.name}
                      </h3>
                      <div className="flex items-center justify-between">
                      <Badge variant="outline" size="sm" className="text-[10px] px-1.5 py-0 h-5">
                        {accountLabel}
                      </Badge>
                  
                    </div>
          </div>

                      <div className="flex gap-1 items-center">
          <p className="text-[10px] text-muted-foreground truncate">
                        {account.institutionName} 
                      </p>
                      <div className="flex items-center justify-between gap-2">
                      <code className="text-xs font-mono font-semibold tracking-wider text-foreground/70">
                        •••• {lastFour}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyAccountNumber}
                        className="h-5 w-5 p-0 hover:bg-accent rounded"
                        title="Copy Account Number"
                      >
                        <Copy className="h-2.5 w-2.5" />
                      </Button>
                    </div>

                      </div>
                    
                    </div>
          </div>

              <div className="items-end text-end">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider  ">
              {isCreditCard ? 'Available Credit' : 'Balance'}
            </p>
            <div className="font-bold text-base truncate">
              <CurrencyDisplay amountUSD={balance}  />
            </div>
          </div>

        </div>

   

        {/* Transaction Count */}
        {transactionCount > 0 && (
          <div className="mb-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="font-medium">{transactionCount} {transactionCount === 1 ? 'Transaction' : 'Transactions'}</span>
          </div>
        )}

       
        {/* Balance and Actions */}
        <div className="flex items-end justify-between gap-4 pt-2 border-t">
      
 {/* Credit Card Utilization */}
        {isCreditCard && creditLimit > 0 && (
          <div className="w-full">
            <div className="flex items-center justify-between text-[9px] text-muted-foreground mb-1">
              <span>Credit Used</span>
              <span className="font-semibold">{creditUtilization}%</span>
            </div>
            <div className="h-2 bg-accent rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full bg-gradient-to-r transition-all duration-300",
                  creditUtilization > 80 ? "from-red-500 to-red-600" :
                  creditUtilization > 50 ? "from-amber-500 to-amber-600" :
                  "from-green-500 to-green-600"
                )}
                style={{ width: `${creditUtilization}%` }}
              />
            </div>
          </div>
        )}

          {/* Action Buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSync}
              disabled={isSyncing}
              className="h-7 w-7 p-0 rounded-lg hover:bg-accent"
              title={isSyncing ? "Syncing..." : "Sync account"}
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isSyncing && "animate-spin")} />
            </Button>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </div>

        {/* Sync Progress Indicator */}
        {isSyncing && accountSyncState && (
          <div className="mt-2.5 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
              <span className="truncate flex-1">{accountSyncState.message || "Syncing..."}</span>
              {accountSyncState.progress !== undefined && (
                <span className="font-semibold ml-2">{accountSyncState.progress}%</span>
              )}
            </div>
            {accountSyncState.progress !== undefined && (
              <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                <div
                  className={cn("h-full bg-gradient-to-r transition-all duration-300", gradient)}
                  style={{ width: `${accountSyncState.progress}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>
   
  );
};

export default BankCard;
