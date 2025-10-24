"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { Loader2, DollarSign, Bell, Settings, Target } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/lib/hooks/use-toast"
import {
  useCreateBudget,
  useUpdateBudget,
} from "@/lib/queries/use-budget-data"
import type {
  Budget,
  CreateBudgetRequest,
  BudgetCycle,
  BudgetSourceType,
  BudgetRolloverType,
} from "@/lib/types/budget"
import { CurrencyInput } from "@/components/ui/currency-input-group"

interface BudgetFormModalProps {
  open: boolean
  onClose: () => void
  budget?: Budget | null
}

const BUDGET_CYCLES: { value: BudgetCycle; label: string }[] = [
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "YEARLY", label: "Yearly" },
]

const SOURCE_TYPES: { value: BudgetSourceType; label: string; description?: string }[] = [
  { value: "BANK_ACCOUNT", label: "Bank Account", description: "Track spending from a specific bank account" },
  { value: "CATEGORY", label: "Transaction Category", description: "Track spending in a transaction category" },
  { value: "SUBSCRIPTION", label: "Single Subscription", description: "Track a specific subscription" },
  { value: "ALL_SUBSCRIPTIONS", label: "All Subscriptions", description: "Track all your subscriptions combined" },
  { value: "SUBSCRIPTION_CATEGORY", label: "Subscription Category", description: "Track subscriptions in a category (e.g., Streaming)" },
  { value: "ACCOUNT_GROUP", label: "Account Group", description: "Track across multiple accounts" },
  { value: "MANUAL", label: "Manual Tracking", description: "Track transactions manually" },
]

const ROLLOVER_TYPES: { value: BudgetRolloverType; label: string }[] = [
  { value: "NONE", label: "No Rollover" },
  { value: "REMAINING", label: "Full Remaining Amount" },
  { value: "PERCENTAGE", label: "Percentage of Remaining" },
  { value: "FIXED_AMOUNT", label: "Fixed Amount" },
]

const BUDGET_ICONS = ["💰", "🛒", "🏠", "🚗", "🍔", "🎮", "📱", "💊", "✈️", "🎓", "👕", "🎬"]

export function BudgetFormModal({
  open,
  onClose,
  budget,
}: BudgetFormModalProps) {
  const { toast } = useToast()
  const { mutate: createBudget, isPending: isCreating } = useCreateBudget()
  const { mutate: updateBudget, isPending: isUpdating } = useUpdateBudget()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateBudgetRequest>({
    defaultValues: {
      name: "",
      description: "",
      icon: "💰",
      color: "#10b981",
      amount: 0,
      currency: "USD",
      cycle: "MONTHLY",
      sourceType: "MANUAL",
      rolloverType: "NONE",
      enableAlerts: true,
      alert50Percent: true,
      alert75Percent: true,
      alert90Percent: true,
      alertExceeded: true,
      alertDaysBefore: 3,
      emailNotifications: true,
      pushNotifications: true,
      autoRenew: true,
      autoAdjust: false,
      tags: [],
      priority: 0,
    },
  })

  const isPending = isCreating || isUpdating
  const sourceType = watch("sourceType")
  const rolloverType = watch("rolloverType")
  const enableAlerts = watch("enableAlerts")

  // Reset form when opening/closing
  React.useEffect(() => {
    if (open) {
      if (budget) {
        reset(budget)
      } else {
        reset({
          name: "",
          description: "",
          icon: "💰",
          color: "#10b981",
          amount: 0,
          currency: "USD",
          cycle: "MONTHLY",
          sourceType: "MANUAL",
          rolloverType: "NONE",
          enableAlerts: true,
          alert50Percent: true,
          alert75Percent: true,
          alert90Percent: true,
          alertExceeded: true,
          alertDaysBefore: 3,
          emailNotifications: true,
          pushNotifications: true,
          autoRenew: true,
          autoAdjust: false,
          tags: [],
          priority: 0,
        })
      }
    }
  }, [open, budget, reset])

  const onSubmit = (data: CreateBudgetRequest) => {
    const action = budget ? updateBudget : createBudget
    const payload = budget ? { id: budget.id, updates: data } : data

    action(payload as any, {
      onSuccess: () => {
        toast({
          title: budget ? "Budget updated" : "Budget created",
          description: "Your budget has been saved successfully.",
        })
        onClose()
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error?.error?.message || "Failed to save budget. Please try again.",
          variant: "destructive",
        })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {budget ? "Edit Budget" : "Create Budget"}
          </DialogTitle>
          <DialogDescription>
            Set up your budget with spending limits and tracking preferences
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-16rem)] pr-4">
          <form id="budget-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-2">
            {/* Basic Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Target className="h-4 w-4" />
                Basic Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Input
                    id="name"
                    label="Budget Name"
                    required
                    placeholder="e.g., Grocery Budget, Entertainment"
                    {...register("name", { required: "Budget name is required" })}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <Input
                    id="description"
                    label="Description (Optional)"
                    placeholder="Brief description of this budget"
                    {...register("description")}
                  />
                </div>

                {/* Icon Selector */}
                <div>
                  <Label>Icon</Label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {BUDGET_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setValue("icon", icon)}
                        className={`
                          p-2 text-2xl rounded-lg border-2 transition-all
                          ${watch("icon") === icon
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-muted-foreground"
                          }
                        `}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Picker */}
                <div>
                  <Label htmlFor="color">Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="color"
                      type="color"
                      {...register("color")}
                      className="h-10 w-20"
                    />
                    <Input
                      value={watch("color")}
                      onChange={(e) => setValue("color", e.target.value)}
                      placeholder="#10b981"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Budget Amount */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Budget Amount
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <CurrencyInput
                  label="Amount"
                  placeholder="500.00"
                  step="0.01"
                  required
                  clearable
                  register={register}
                  name="amount"
                  currencyProps={{
                    name: "currency",
                    setValue: setValue,
                    watch: watch,
                  }}
                  errorMessage={errors.amount?.message}
                  state={errors.amount ? 'error' : 'default'}
                />

                <div>
                  <Select
                    value={watch("cycle")}
                    onValueChange={(value) => setValue("cycle", value as BudgetCycle)}
                  >
                    <SelectTrigger label="Billing Cycle">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGET_CYCLES.map((cycle) => (
                        <SelectItem key={cycle.value} value={cycle.value}>
                          {cycle.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Tracking Source */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Tracking Source
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Select
                    value={watch("sourceType")}
                    onValueChange={(value) => setValue("sourceType", value as BudgetSourceType)}
                  >
                    <SelectTrigger label="Source Type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SOURCE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {SOURCE_TYPES.find(t => t.value === sourceType)?.description}
                  </p>
                </div>

                {/* Conditional source ID inputs */}
                {sourceType === "BANK_ACCOUNT" && (
                  <div className="col-span-2">
                    <Input
                      id="accountId"
                      label="Account ID"
                      placeholder="Enter account ID"
                      {...register("accountId")}
                    />
                  </div>
                )}

                {sourceType === "CATEGORY" && (
                  <div className="col-span-2">
                    <Input
                      id="categoryId"
                      label="Category ID"
                      placeholder="Enter category ID"
                      {...register("categoryId")}
                    />
                  </div>
                )}

                {sourceType === "SUBSCRIPTION" && (
                  <div className="col-span-2">
                    <Input
                      id="subscriptionId"
                      label="Subscription ID"
                      placeholder="Enter subscription ID"
                      {...register("subscriptionId")}
                    />
                  </div>
                )}

                {sourceType === "SUBSCRIPTION_CATEGORY" && (
                  <div className="col-span-2">
                    <Select
                      value={watch("subscriptionCategory") as string}
                      onValueChange={(value) => setValue("subscriptionCategory" as any, value)}
                    >
                      <SelectTrigger label="Subscription Category">
                        <SelectValue placeholder="Select category" />
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
                )}

                {sourceType === "ACCOUNT_GROUP" && (
                  <div className="col-span-2">
                    <Input
                      id="accountGroupId"
                      label="Account Group ID"
                      placeholder="Enter account group ID"
                      {...register("accountGroupId")}
                    />
                  </div>
                )}

                <div>
                  <Input
                    id="startDate"
                    label="Start Date (Optional)"
                    type="date"
                    {...register("startDate")}
                  />
                </div>

                <div>
                  <Input
                    id="endDate"
                    label="End Date (Optional)"
                    type="date"
                    {...register("endDate")}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Rollover Settings */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Rollover Settings</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Select
                    value={watch("rolloverType")}
                    onValueChange={(value) => setValue("rolloverType", value as BudgetRolloverType)}
                  >
                    <SelectTrigger label="Rollover Type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLLOVER_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {rolloverType === "PERCENTAGE" && (
                  <div>
                    <Input
                      id="rolloverPercentage"
                      label="Rollover Percentage"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="50"
                      {...register("rolloverPercentage", { valueAsNumber: true })}
                    />
                  </div>
                )}

                {rolloverType === "FIXED_AMOUNT" && (
                  <div>
                    <Input
                      id="rolloverAmount"
                      label="Rollover Amount"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="100.00"
                      {...register("rolloverAmount", { valueAsNumber: true })}
                    />
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Alert Settings */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Alert Settings
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableAlerts">Enable Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified about budget spending
                    </p>
                  </div>
                  <Switch
                    id="enableAlerts"
                    checked={watch("enableAlerts")}
                    onCheckedChange={(checked) => setValue("enableAlerts", checked)}
                  />
                </div>

                {enableAlerts && (
                  <>
                    <div className="grid grid-cols-2 gap-4 ml-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="alert50Percent"
                          checked={watch("alert50Percent")}
                          onCheckedChange={(checked) => setValue("alert50Percent", checked)}
                        />
                        <Label htmlFor="alert50Percent" className="text-sm">
                          Alert at 50%
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="alert75Percent"
                          checked={watch("alert75Percent")}
                          onCheckedChange={(checked) => setValue("alert75Percent", checked)}
                        />
                        <Label htmlFor="alert75Percent" className="text-sm">
                          Alert at 75%
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="alert90Percent"
                          checked={watch("alert90Percent")}
                          onCheckedChange={(checked) => setValue("alert90Percent", checked)}
                        />
                        <Label htmlFor="alert90Percent" className="text-sm">
                          Alert at 90%
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="alertExceeded"
                          checked={watch("alertExceeded")}
                          onCheckedChange={(checked) => setValue("alertExceeded", checked)}
                        />
                        <Label htmlFor="alertExceeded" className="text-sm">
                          Alert when exceeded
                        </Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input
                          id="alertDaysBefore"
                          label="Alert Days Before Period End"
                          type="number"
                          min="1"
                          max="30"
                          {...register("alertDaysBefore", { valueAsNumber: true })}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailNotifications" className="text-sm">
                        Email Notifications
                      </Label>
                      <Switch
                        id="emailNotifications"
                        checked={watch("emailNotifications")}
                        onCheckedChange={(checked) => setValue("emailNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="pushNotifications" className="text-sm">
                        Push Notifications
                      </Label>
                      <Switch
                        id="pushNotifications"
                        checked={watch("pushNotifications")}
                        onCheckedChange={(checked) => setValue("pushNotifications", checked)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* Additional Settings */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Additional Settings</h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoRenew">Auto-renew</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically renew for next period
                    </p>
                  </div>
                  <Switch
                    id="autoRenew"
                    checked={watch("autoRenew")}
                    onCheckedChange={(checked) => setValue("autoRenew", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoAdjust">Auto-adjust</Label>
                    <p className="text-xs text-muted-foreground">
                      Adjust budget based on predictions
                    </p>
                  </div>
                  <Switch
                    id="autoAdjust"
                    checked={watch("autoAdjust")}
                    onCheckedChange={(checked) => setValue("autoAdjust", checked)}
                  />
                </div>

                <div>
                  <Input
                    id="priority"
                    label="Priority (0-10)"
                    type="number"
                    min="0"
                    max="10"
                    placeholder="0"
                    {...register("priority", { valueAsNumber: true })}
                  />
                </div>

                <div className="col-span-2">
                  <Textarea
                    id="notes"
                    label="Notes (Optional)"
                    placeholder="Additional notes or reminders"
                    rows={3}
                    {...register("notes")}
                  />
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>

        {/* Form Actions - Fixed at bottom */}
        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" form="budget-form" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {budget ? "Update" : "Create"} Budget
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
