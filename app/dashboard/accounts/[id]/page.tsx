"use client";

import { useParams, useRouter } from "next/navigation";
import { usePostHogPageView } from "@/lib/hooks/usePostHogPageView";
import { useAccountDetails, useAccountTransactions } from "@/lib/queries/use-accounts-data";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = params.id as string;

  usePostHogPageView("account_detail");

  // Fetch account data
  const { data: account, isLoading: isLoadingAccount, error: accountError } = useAccountDetails(accountId);
  const { data: transactionsData, isLoading: isLoadingTransactions } = useAccountTransactions(accountId, {
    limit: 50,
    page: 1,
  });

  if (isLoadingAccount) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (accountError || !account) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Account Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The account you're looking for doesn't exist or you don't have permission to view it.
          </p>
        </div>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{account?.name}</h1>
          <p className="text-muted-foreground text-sm">
            {account?.type} • {account?.institutionName}
          </p>
        </div>
      </div>

      {/* Account Stats Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground mb-1">Current Balance</p>
          <p className="text-2xl font-bold">
            {account?.currentBalance?.toLocaleString("en-US", {
              style: "currency",
              currency: account?.currency || "USD",
            })}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground mb-1">Available Balance</p>
          <p className="text-2xl font-bold">
            {account?.availableBalance?.toLocaleString("en-US", {
              style: "currency",
              currency: account?.currency || "USD",
            })}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground mb-1">Account Status</p>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                account?.isActive ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <p className="text-sm font-medium">
              {account?.isActive ? "Active" : "Inactive"}
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground mb-1">Account Type</p>
          <p className="text-sm font-medium">{account?.type}</p>
        </div>
      </div>

      {/* Balance Chart Placeholder */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Balance History</h2>
        <p className="text-sm text-muted-foreground">
          Coming soon: Balance history chart visualization
        </p>
        {/* TODO: Add BalanceTrendChart component */}
      </div>

      {/* Transactions Section */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>

        {isLoadingTransactions ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : transactionsData?.data?.length ? (
          <div className="space-y-3">
            {/* TODO: Add transaction list component */}
            <p className="text-sm text-muted-foreground">
              {transactionsData.data.length} transactions available
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No transactions yet</p>
        )}
      </div>

      {/* Account Metadata */}
      {account?.notes && (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-2">Notes</h3>
          <p className="text-sm text-foreground">{account.notes}</p>
        </div>
      )}

      {/* Account Tags */}
      {account?.tags && account.tags.length > 0 && (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {account.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
