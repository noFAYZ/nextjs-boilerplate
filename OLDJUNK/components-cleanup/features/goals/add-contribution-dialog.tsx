"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { PlusCircle, DollarSign, Calendar, FileText, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Card } from "@/components/ui/card"
import { CurrencyDisplay } from "@/components/ui/currency-display"
import { Progress } from "@/components/ui/progress"
import { useCurrency } from "@/lib/contexts/currency-context"
import type { Goal } from "@/lib/types/goals"
import { MageGoals, TablerEyeDollar } from "../icons/icons"

// Form schema
const contributionFormSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  date: z.date(),
  note: z.string().optional(),
})

type ContributionFormValues = z.infer<typeof contributionFormSchema>

interface AddContributionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal: Goal | null
  onConfirm: (amount: number, date: string, note?: string) => Promise<void>
  isLoading?: boolean
}

export function AddContributionDialog({
  open,
  onOpenChange,
  goal,
  onConfirm,
  isLoading = false,
}: AddContributionDialogProps) {
  const { currencySymbol } = useCurrency()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<ContributionFormValues>({
    resolver: zodResolver(contributionFormSchema),
    defaultValues: {
      amount: 0,
      date: new Date(),
      note: "",
    },
  })

  // Reset form when dialog opens/closes or goal changes
  React.useEffect(() => {
    if (open && goal) {
      form.reset({
        amount: 0,
        date: new Date(),
        note: "",
      })
    }
  }, [open, goal, form])

  const onSubmit = async (data: ContributionFormValues) => {
    if (!goal) return

    setIsSubmitting(true)
    try {
      await onConfirm(data.amount, data.date.toISOString(), data.note)
      onOpenChange(false)
      form.reset()
    } catch (error) {
      // Error handling is done in parent component
      console.error("Failed to add contribution:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!goal) return null

  const currentProgress = (goal.currentAmount / goal.targetAmount) * 100
  const amountValue = form.watch("amount") || 0
  const newProgress = Math.min(((goal.currentAmount + amountValue) / goal.targetAmount) * 100, 100)
  const progressIncrease = newProgress - currentProgress

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-md">
            <PlusCircle className="size-5 text-primary" />
            Add Contribution
          </DialogTitle>
          <DialogDescription>
            Add a contribution to &quot;{goal.name}&quot;
          </DialogDescription>
        </DialogHeader>

        {/* Goal Summary Card */}
        <Card className="border-border/50 p-4 bg-muted/30">
          <div className="flex items-start gap-3 mb-3">
            <div className="size-9 rounded-lg bg-primary flex items-center justify-center shadow-sm flex-shrink-0">
              {goal.icon && goal.icon !== 'null' ? (
                <span className="text-base">{goal.icon}</span>
              ) : (
                <MageGoals className="size-5 text-white" stroke="2" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold mb-1">{goal.name}</h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Current Progress</span>
                <span className="font-bold">{currentProgress.toFixed(1)}%</span>
              </div>
              <Progress value={currentProgress} className="h-1.5 mt-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/30">
            <div>
              <p className="text-[10px] text-muted-foreground mb-1">Current</p>
              <CurrencyDisplay
                amountUSD={goal.currentAmount}
                className="text-sm font-bold"
              />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground mb-1">Target</p>
              <CurrencyDisplay
                amountUSD={goal.targetAmount}
                className="text-sm font-bold"
              />
            </div>
          </div>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Amount Field */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contribution Amount *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        {currencySymbol}
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="100.00"
                        className="pl-7"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter the amount you&apos;re contributing
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Field */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Contribution Date *</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      onDateChange={(date) => field.onChange(date)}
                      placeholder="Select date"
                      disablePastDates={false}
                    />
                  </FormControl>
                  <FormDescription>
                    When is this contribution made?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Note Field */}
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a note about this contribution..."
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Impact Preview */}
            {amountValue > 0 && (
              <Card className="border-emerald-200/50 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <TablerEyeDollar className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                    Impact Preview
                  </h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-700 dark:text-emerald-300">New Progress</span>
                    <span className="font-bold text-emerald-900 dark:text-emerald-100">
                      {newProgress.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={newProgress}
                    className="h-2 bg-emerald-200 dark:bg-emerald-900/50"
                  />
                  <div className="flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400">
                    <span>Progress increase: +{progressIncrease.toFixed(1)}%</span>
                    <CurrencyDisplay
                      amountUSD={goal.targetAmount - (goal.currentAmount + amountValue)}
                      className="text-[10px] font-bold"
                    />
                    <span className="ml-1">remaining</span>
                  </div>
                </div>
              </Card>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting || isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <PlusCircle className="size-4 mr-2" />
                    Add Contribution
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
