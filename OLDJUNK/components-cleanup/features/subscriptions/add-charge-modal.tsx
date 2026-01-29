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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/hooks/useToast";
import { useAddCharge } from "@/lib/queries/use-subscription-data";
import { ChargeStatus } from "@/lib/types/subscription";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const addChargeSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Amount must be a positive number"
  ),
  currency: z.string().min(1, "Currency is required"),
  chargeDate: z.date({
    required_error: "Charge date is required",
  }),
  status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED", "CANCELLED"]),
  description: z.string().optional(),
  transactionId: z.string().optional(),
  failureReason: z.string().optional(),
});

type AddChargeFormData = z.infer<typeof addChargeSchema>;

interface AddChargeModalProps {
  open: boolean;
  onClose: () => void;
  subscriptionId: string;
  subscriptionName: string;
  defaultCurrency?: string;
}

export function AddChargeModal({
  open,
  onClose,
  subscriptionId,
  subscriptionName,
  defaultCurrency = "USD",
}: AddChargeModalProps) {
  const { toast } = useToast();
  const { mutate: addCharge, isPending } = useAddCharge();

  const form = useForm<AddChargeFormData>({
    resolver: zodResolver(addChargeSchema),
    defaultValues: {
      amount: "",
      currency: defaultCurrency,
      chargeDate: new Date(),
      status: "COMPLETED",
      description: "",
      transactionId: "",
      failureReason: "",
    },
  });

  const watchedStatus = form.watch("status");

  React.useEffect(() => {
    if (open) {
      form.reset({
        amount: "",
        currency: defaultCurrency,
        chargeDate: new Date(),
        status: "COMPLETED",
        description: "",
        transactionId: "",
        failureReason: "",
      });
    }
  }, [open, defaultCurrency, form]);

  const onSubmit = (data: AddChargeFormData) => {
    addCharge(
      {
        subscriptionId,
        chargeData: {
          amount: Number(data.amount),
          currency: data.currency,
          chargeDate: data.chargeDate.toISOString(),
          status: data.status as ChargeStatus,
          description: data.description || undefined,
          transactionId: data.transactionId || undefined,
          failureReason: data.failureReason || undefined,
        },
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            toast({
              title: "Charge added",
              description: `Successfully added charge of ${data.currency} ${data.amount} to ${subscriptionName}.`,
            });
            onClose();
          } else {
            toast({
              title: "Error",
              description: response.error?.message || "Failed to add charge. Please try again.",
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
          console.error("Failed to add charge:", error);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Manual Charge</DialogTitle>
          <DialogDescription>
            Add a manual charge for {subscriptionName}. This will be recorded in the charge history.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Currency */}
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency *</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                        <SelectItem value="INR">INR</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Charge Date */}
              <FormField
                control={form.control}
                name="chargeDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Charge Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
                        <SelectItem value="REFUNDED">Refunded</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Transaction ID */}
            <FormField
              control={form.control}
              name="transactionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction ID (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., txn_1234567890"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes about this charge..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Failure Reason - Only show if status is FAILED */}
            {watchedStatus === "FAILED" && (
              <FormField
                control={form.control}
                name="failureReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Failure Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain why the charge failed..."
                        className="resize-none"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                Add Charge
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
