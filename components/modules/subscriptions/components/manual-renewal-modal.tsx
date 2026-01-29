"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/hooks/useToast";
import { useRenewSubscription } from "@/lib/queries/use-subscription-data";
import { Loader2, RefreshCw, Calendar } from "lucide-react";
import { subscriptionsApi } from "@/lib/services/subscriptions-api";

const renewalSchema = z.object({
  amount: z.string().optional().refine(
    (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
    "Amount must be a positive number"
  ),
  notes: z.string().optional(),
});

type RenewalFormData = z.infer<typeof renewalSchema>;

interface ManualRenewalModalProps {
  open: boolean;
  onClose: () => void;
  subscriptionId: string;
  subscriptionName: string;
  defaultAmount: number;
  currency: string;
  billingCycle: string;
}

export function ManualRenewalModal({
  open,
  onClose,
  subscriptionId,
  subscriptionName,
  defaultAmount,
  currency,
  billingCycle,
}: ManualRenewalModalProps) {
  const { toast } = useToast();
  const { mutate: renewSubscription, isPending } = useRenewSubscription();

  const form = useForm<RenewalFormData>({
    resolver: zodResolver(renewalSchema),
    defaultValues: {
      amount: defaultAmount.toString(),
      notes: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        amount: defaultAmount.toString(),
        notes: "",
      });
    }
  }, [open, defaultAmount, form]);

  const onSubmit = (data: RenewalFormData) => {
    renewSubscription(
      {
        subscriptionId,
        renewalData: {
          amount: data.amount ? Number(data.amount) : undefined,
          notes: data.notes || undefined,
        },
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            toast({
              title: "Subscription renewed",
              description: `Successfully renewed ${subscriptionName} for ${subscriptionsApi.formatCurrency(Number(data.amount || defaultAmount), currency)}.`,
            });
            onClose();
          } else {
            toast({
              title: "Error",
              description: response.error?.message || "Failed to renew subscription. Please try again.",
              variant: "destructive",
            });
          }
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
          });
          console.error("Failed to renew subscription:", error);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Manual Renewal
          </DialogTitle>
          <DialogDescription>
            Manually renew {subscriptionName}. This will create a new charge and update the next billing date.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Subscription Info Card */}
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Current Amount</span>
                  <span className="text-base font-semibold">
                    {subscriptionsApi.formatCurrency(defaultAmount, currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Billing Cycle</span>
                  <span className="text-sm">
                    {subscriptionsApi.getBillingCycleDisplayName(billingCycle)}
                  </span>
                </div>
              </div>
            </div>

            {/* Amount Field */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Renewal Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {currency}
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={defaultAmount.toString()}
                        className="pl-16"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Leave blank to use the default amount ({subscriptionsApi.formatCurrency(defaultAmount, currency)})
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes Field */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes about this renewal..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add context or reason for manual renewal
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Info Banner */}
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-xs text-blue-700 dark:text-blue-400">
                  <p className="font-medium mb-1">What happens next:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>A completed charge will be created</li>
                    <li>Next billing date will be calculated based on billing cycle</li>
                    <li>Subscription status will be updated if currently paused/cancelled</li>
                    <li>Total spent will be incremented</li>
                  </ul>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Renew Subscription
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
