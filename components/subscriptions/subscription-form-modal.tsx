"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/lib/hooks/use-toast";
import {
  useCreateSubscription,
  useUpdateSubscription,
} from "@/lib/queries/use-subscription-data";
import type {
  UserSubscription,
  CreateSubscriptionRequest,
  SubscriptionCategory,
  BillingCycle,
} from "@/lib/types/subscription";

interface SubscriptionFormModalProps {
  open: boolean;
  onClose: () => void;
  subscription?: UserSubscription | null;
}

export function SubscriptionFormModal({
  open,
  onClose,
  subscription,
}: SubscriptionFormModalProps) {
  const { toast } = useToast();
  const { mutate: createSubscription, isPending: isCreating } = useCreateSubscription();
  const { mutate: updateSubscription, isPending: isUpdating } = useUpdateSubscription();

  const { register, handleSubmit, reset, setValue, watch } = useForm<CreateSubscriptionRequest>({
    defaultValues: subscription || {
      name: "",
      amount: 0,
      currency: "USD",
      billingCycle: "MONTHLY",
      category: "OTHER",
      autoRenew: true,
      notifyBeforeBilling: true,
      notifyDaysBefore: 3,
    },
  });

  React.useEffect(() => {
    if (subscription) {
      reset(subscription);
    } else {
      reset({
        name: "",
        amount: 0,
        currency: "USD",
        billingCycle: "MONTHLY",
        category: "OTHER",
        autoRenew: true,
        notifyBeforeBilling: true,
        notifyDaysBefore: 3,
      });
    }
  }, [subscription, reset]);

  const onSubmit = (data: CreateSubscriptionRequest) => {
    if (subscription) {
      updateSubscription(
        { id: subscription.id, updates: data },
        {
          onSuccess: () => {
            toast({
              title: "Subscription updated",
              description: "Your subscription has been updated successfully.",
            });
            onClose();
          },
          onError: () => {
            toast({
              title: "Error",
              description: "Failed to update subscription. Please try again.",
              variant: "destructive",
            });
          },
        }
      );
    } else {
      createSubscription(data, {
        onSuccess: () => {
          toast({
            title: "Subscription created",
            description: "Your subscription has been added successfully.",
          });
          onClose();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to create subscription. Please try again.",
            variant: "destructive",
          });
        },
      });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {subscription ? "Edit Subscription" : "Add Subscription"}
          </DialogTitle>
          <DialogDescription>
            {subscription
              ? "Update your subscription details"
              : "Add a new subscription to track your recurring expenses"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Subscription Name *</Label>
              <Input
                id="name"
                placeholder="Netflix, Spotify, etc."
                {...register("name", { required: true })}
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="15.99"
                {...register("amount", { required: true, valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                placeholder="USD"
                {...register("currency")}
              />
            </div>

            <div>
              <Label htmlFor="billingCycle">Billing Cycle</Label>
              <Select
                defaultValue={watch("billingCycle")}
                onValueChange={(value) => setValue("billingCycle", value as BillingCycle)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY">Daily</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="BIWEEKLY">Bi-weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                  <SelectItem value="SEMI_ANNUAL">Semi-annual</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                defaultValue={watch("category")}
                onValueChange={(value) => setValue("category", value as SubscriptionCategory)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STREAMING">Streaming</SelectItem>
                  <SelectItem value="MUSIC">Music</SelectItem>
                  <SelectItem value="SOFTWARE">Software</SelectItem>
                  <SelectItem value="CLOUD_STORAGE">Cloud Storage</SelectItem>
                  <SelectItem value="GAMING">Gaming</SelectItem>
                  <SelectItem value="FITNESS">Fitness</SelectItem>
                  <SelectItem value="PRODUCTIVITY">Productivity</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Optional description"
                {...register("description")}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="merchantName">Merchant Name</Label>
              <Input
                id="merchantName"
                placeholder="Company name"
                {...register("merchantName")}
              />
            </div>

            <div>
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                type="url"
                placeholder="https://example.com"
                {...register("websiteUrl")}
              />
            </div>

            <div>
              <Label htmlFor="cancellationUrl">Cancellation URL</Label>
              <Input
                id="cancellationUrl"
                type="url"
                placeholder="https://example.com/cancel"
                {...register("cancellationUrl")}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes"
                rows={3}
                {...register("notes")}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {subscription ? "Update" : "Add"} Subscription
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
