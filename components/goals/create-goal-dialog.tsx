"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Target,
  DollarSign,
  Calendar,
  Flag,
  Tag,
  FileText,
  Plus,
  X,
  Loader2
} from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { goalsApi } from "@/lib/services/goals-api"
import { useGoalsStore } from "@/lib/stores/goals-store"
import { useBankingStore } from "@/lib/stores/banking-store"
import { useCryptoStore } from "@/lib/stores/crypto-store"
import { toast } from "sonner"
import type {
  Goal,
  CreateGoalRequest,
  GoalType,
  GoalCategory,
  GoalPriority,
  GoalSourceType,
  ContributionFrequency
} from "@/lib/types/goals"
import { MageCalendar2, MageGoals, MdiDollar, SolarCheckCircleBoldDuotone, TablerEyeDollar } from "../icons/icons"
import { useCurrency } from "@/lib/contexts/currency-context"

// Form schema
const goalFormSchema = z.object({
  name: z.string().min(1, "Goal name is required").max(100, "Name too long"),
  description: z.string().optional(),
  type: z.enum([
    "SAVINGS",
    "EMERGENCY_FUND",
    "INVESTMENT",
    "CRYPTO",
    "DEBT_PAYOFF",
    "NET_WORTH",
    "SPENDING_LIMIT",
    "INCOME",
    "CUSTOM"
  ] as const),
  category: z.enum([
    "PERSONAL",
    "FAMILY",
    "EDUCATION",
    "RETIREMENT",
    "TRAVEL",
    "HOME",
    "VEHICLE",
    "BUSINESS",
    "HEALTH",
    "OTHER"
  ] as const).optional(),
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const),
  targetAmount: z.number().min(0.01, "Target amount must be positive"),
  startingAmount: z.number().min(0, "Starting amount cannot be negative").optional(),
  currency: z.string().default("USD"),
  startDate: z.date().optional(),
  targetDate: z.date(),
  sourceType: z.enum([
    "MANUAL",
    "BANK_ACCOUNT",
    "CRYPTO_WALLET",
    "ACCOUNT_GROUP",
    "ALL_ACCOUNTS",
    "ALL_CRYPTO",
    "PORTFOLIO"
  ] as const),
  accountId: z.string().optional(),
  cryptoWalletId: z.string().optional(),
  accountGroupId: z.string().optional(),
  recurringAmount: z.number().min(0).optional(),
  contributionFrequency: z.enum([
    "DAILY",
    "WEEKLY",
    "MONTHLY",
    "QUARTERLY",
    "YEARLY"
  ] as const).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  notifyOnMilestone: z.boolean().default(true),
  notifyOnCompletion: z.boolean().default(true),
}).refine((data) => {
  // Validate that target date is after start date
  if (data.startDate && data.targetDate) {
    return data.targetDate > data.startDate;
  }
  return true;
}, {
  message: "Target date must be after start date",
  path: ["targetDate"],
})

type GoalFormValues = z.infer<typeof goalFormSchema>

interface Milestone {
  name: string
  description?: string
  targetPercentage: number
  celebration?: string
}

interface CreateGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  goal?: Goal
}

const GOAL_TYPES: { value: GoalType; label: string }[] = [
  { value: "SAVINGS", label: "Savings" },
  { value: "EMERGENCY_FUND", label: "Emergency Fund" },
  { value: "INVESTMENT", label: "Investment" },
  { value: "CRYPTO", label: "Cryptocurrency" },
  { value: "DEBT_PAYOFF", label: "Debt Payoff" },
  { value: "NET_WORTH", label: "Net Worth" },
  { value: "SPENDING_LIMIT", label: "Spending Limit" },
  { value: "INCOME", label: "Income Goal" },
  { value: "CUSTOM", label: "Custom" },
]

const GOAL_CATEGORIES: { value: GoalCategory; label: string }[] = [
  { value: "PERSONAL", label: "Personal" },
  { value: "FAMILY", label: "Family" },
  { value: "EDUCATION", label: "Education" },
  { value: "RETIREMENT", label: "Retirement" },
  { value: "TRAVEL", label: "Travel" },
  { value: "HOME", label: "Home" },
  { value: "VEHICLE", label: "Vehicle" },
  { value: "BUSINESS", label: "Business" },
  { value: "HEALTH", label: "Health" },
  { value: "OTHER", label: "Other" },
]

const PRIORITIES: { value: GoalPriority; label: string; color: string }[] = [
  { value: "CRITICAL", label: "Critical", color: "destructive" },
  { value: "HIGH", label: "High", color: "warning" },
  { value: "MEDIUM", label: "Medium", color: "default" },
  { value: "LOW", label: "Low", color: "secondary" },
]

const SOURCE_TYPES: { value: GoalSourceType; label: string; description: string }[] = [
  { value: "MANUAL", label: "Manual Tracking", description: "Track progress manually" },
  { value: "BANK_ACCOUNT", label: "Bank Account", description: "Link to a specific bank account" },
  { value: "CRYPTO_WALLET", label: "Crypto Wallet", description: "Link to a crypto wallet" },
  { value: "ACCOUNT_GROUP", label: "Account Group", description: "Link to an account group" },
  { value: "ALL_ACCOUNTS", label: "All Accounts", description: "Track across all accounts" },
  { value: "ALL_CRYPTO", label: "All Crypto", description: "Track all crypto holdings" },
  { value: "PORTFOLIO", label: "Portfolio", description: "Track entire portfolio" },
]

const CONTRIBUTION_FREQUENCIES: { value: ContributionFrequency; label: string }[] = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "YEARLY", label: "Yearly" },
]

export function CreateGoalDialog({
  open,
  onOpenChange,
  onSuccess,
  goal,
}: CreateGoalDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [milestones, setMilestones] = React.useState<Milestone[]>([])
  const [currentTag, setCurrentTag] = React.useState("")
  const [currentStep, setCurrentStep] = React.useState(0)
  const { addGoal, updateGoal, setIsCreatingGoal } = useGoalsStore()
  const { accounts: bankAccounts } = useBankingStore()
  const { wallets: cryptoWallets } = useCryptoStore()
  const isEditing = !!goal

  const {currencySymbol} = useCurrency()

  const steps = [
    { id: 'basics', label: 'Basics', icon: MageGoals },
    { id: 'financial', label: 'Financial', icon: TablerEyeDollar },
    { id: 'timeline', label: 'Timeline', icon: MageCalendar2 },
    { id: 'tracking', label: 'Tracking', icon: Flag },
    { id: 'extras', label: 'Extras', icon: Plus },
  ]

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "SAVINGS",
      category: undefined,
      priority: "MEDIUM",
      targetAmount: 0,
      startingAmount: 0,
      currency: "USD",
      startDate: new Date(),
      targetDate: undefined,
      sourceType: "MANUAL",
      accountId: "",
      cryptoWalletId: "",
      accountGroupId: "",
      recurringAmount: undefined,
      contributionFrequency: undefined,
      icon: "",
      color: "",
      tags: [],
      notes: "",
      notifyOnMilestone: true,
      notifyOnCompletion: true,
    },
  })

  // Populate form when editing
  React.useEffect(() => {
    if (goal && open) {
      form.reset({
        name: goal.name,
        description: goal.description || "",
        type: goal.type,
        category: goal.category || undefined,
        priority: goal.priority,
        targetAmount: goal.targetAmount,
        startingAmount: goal.startingAmount || 0,
        currency: goal.currency,
        startDate: new Date(goal.startDate),
        targetDate: new Date(goal.targetDate),
        sourceType: goal.sourceType,
        accountId: goal.accountId || undefined,
        cryptoWalletId: goal.cryptoWalletId || undefined,
        accountGroupId: goal.accountGroupId || undefined,
        recurringAmount: goal.recurringAmount || undefined,
        contributionFrequency: goal.contributionFrequency || undefined,
        icon: goal.icon || undefined,
        color: goal.color || undefined,
        tags: goal.tags || [],
        notes: goal.notes || "",
        notifyOnMilestone: goal.notifyOnMilestone ?? true,
        notifyOnCompletion: goal.notifyOnCompletion ?? true,
      })

      // Set milestones
      if (goal.milestones && goal.milestones.length > 0) {
        setMilestones(
          goal.milestones.map(m => ({
            name: m.name,
            description: m.description,
            targetPercentage: m.targetPercentage,
            celebration: m.celebration,
          }))
        )
      }
    } else if (!open) {
      // Reset form when dialog closes
      form.reset()
      setMilestones([])
      setCurrentStep(0)
    }
  }, [goal, open, form])

  const tags = form.watch("tags") || []
  const sourceType = form.watch("sourceType")

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      form.setValue("tags", [...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    form.setValue("tags", tags.filter(t => t !== tag))
  }

  const handleAddMilestone = () => {
    const newMilestone: Milestone = {
      name: `Milestone ${milestones.length + 1}`,
      targetPercentage: 25 * (milestones.length + 1),
    }
    setMilestones([...milestones, newMilestone])
  }

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index))
  }

  const handleMilestoneChange = (index: number, field: keyof Milestone, value: string | number) => {
    const updated = [...milestones]
    updated[index] = { ...updated[index], [field]: value }
    setMilestones(updated)
  }

  const validateStep = async (step: number): Promise<boolean> => {
    const fieldsToValidate: Record<number, (keyof GoalFormValues)[]> = {
      0: ['name', 'type', 'priority'],
      1: ['targetAmount'],
      2: ['targetDate'],
      3: ['sourceType'],
      4: [],
    }

    const fields = fieldsToValidate[step] || []
    if (fields.length === 0) return true

    const result = await form.trigger(fields)
    return result
  }

  const handleNext = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canGoNext = currentStep < steps.length - 1
  const canGoBack = currentStep > 0

  const onSubmit = async (data: GoalFormValues) => {
    setIsSubmitting(true)
    setIsCreatingGoal(true)

    try {
      if (isEditing && goal) {
        // Update existing goal
        const updateData = {
          ...data,
          targetDate: data.targetDate.toISOString(),
          startDate: data.startDate?.toISOString(),
        }

        const response = await goalsApi.updateGoal(goal.id, updateData)

        if (response.success && response.data) {
          updateGoal(response.data)
          toast.success("Goal updated successfully!", {
            description: `${response.data.name} has been updated.`,
          })
          onOpenChange(false)
          form.reset()
          setMilestones([])
          onSuccess?.()
        } else {
          throw new Error("Failed to update goal")
        }
      } else {
        // Create new goal
        const requestData: CreateGoalRequest = {
          ...data,
          targetDate: data.targetDate.toISOString(),
          startDate: data.startDate?.toISOString(),
          milestones: milestones.map((m, index) => ({
            ...m,
            sortOrder: index,
          })),
        }

        const response = await goalsApi.createGoal(requestData)

        if (response.success && response.data) {
          addGoal(response.data)
          toast.success("Goal created successfully!", {
            description: `${response.data.name} has been added to your goals.`,
          })
          onOpenChange(false)
          form.reset()
          setMilestones([])
          onSuccess?.()
        } else {
          throw new Error("Failed to create goal")
        }
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} goal:`, error)
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} goal`, {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsSubmitting(false)
      setIsCreatingGoal(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-4  flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-md">
            <MageGoals className="size-5 text-primary" stroke="2"/>
            {isEditing ? 'Edit Goal' : 'Create New Goal'}
          </DialogTitle>
    
        </DialogHeader>

        {/* Enhanced Stepper Progress */}
        <div className=" justify-center flex-shrink-0 ">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep

              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(index)}
                      disabled={isSubmitting}
                      className={cn(
                        "relative size-10 rounded-2xl flex items-center justify-center transition-all duration-200 ease-in-out cursor-pointer",
                        isActive && "bg-primary text-primary-foreground shadow-lg scale-110 ring-4 ring-primary/20",
                        isCompleted && "bg-lime-700 text-primary-foreground shadow-md hover:scale-105",
                        !isActive && !isCompleted && "bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105"
                      )}
                    >
                      {isCompleted ? <SolarCheckCircleBoldDuotone className="" /> : 
                      <StepIcon className={cn(
                        "transition-all duration-200",
                        isActive ? "size-5" : "size-4"
                      )} />}
                     
                    </button>
                    <span className={cn(
                      "text-xs font-medium transition-all duration-200",
                      isActive && "text-primary font-semibold",
                      isCompleted && "text-lime-700",
                      !isActive && !isCompleted && "text-muted-foreground"
                    )}>
                      {step.label}
                    </span>
                  </div>
        
                </React.Fragment>
              )
            })}
          </div>

       
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 p-2 flex flex-col overflow-hidden gap-6">
            <div className="flex-1 overflow-y-auto px-1">
              {/* Step 0: Basic Information */}
              {currentStep === 0 && (
                <div className="space-y-4 animate-in fade-in-50 duration-300">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-1">Basic Information</h3>
                    <p className="text-sm text-muted-foreground">Start by giving your goal a name and setting its priority.</p>
                  </div>

                  <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Emergency Fund" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your goal..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GOAL_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GOAL_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PRIORITIES.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
                </div>
              )}

              {/* Step 1: Financial Details */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in-50 duration-200">
       
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="targetAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Amount *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="10000"
                          leftIcon={currencySymbol}
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startingAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starting Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0"
                          leftIcon={currencySymbol}
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

           

              <FormField
  control={form.control}
  name="recurringAmount"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Recurring Contribution</FormLabel>
      <div className="flex items-center rounded-lg border  bg-background overflow-hidden  transition-all">
        {/* Input Field */}
        <div className="flex-1 relative">
        
          <Input
            type="number"
            step="0.01"
            placeholder="500"
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pl-7 rounded-none"
            {...field}
            value={field.value || ""}
            leftIcon={currencySymbol}
            onChange={(e) => {
              const value = e.target.value
              field.onChange(value ? parseFloat(value) : undefined)
            }}
          />
        </div>

        {/* Frequency Selector */}
        <FormField
          control={form.control}
          name="contributionFrequency"
          render={({ field: freqField }) => (
            <Select
              onValueChange={freqField.onChange}
              defaultValue={freqField.value}
            >
              <FormControl>
                <SelectTrigger className="w-[130px] border-none border-l-1  rounded-none">
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {CONTRIBUTION_FREQUENCIES.map((freq) => (
                  <SelectItem key={freq.value} value={freq.value} className="">
                    {freq.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <FormDescription>
        Set how much and how often you want to contribute.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>


                </div>
              )}

              {/* Step 2: Timeline */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in-50 duration-300">
          

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          onDateChange={(date) => {
                            field.onChange(date);
                          }}
                          placeholder="Pick a start date"
                          disablePastDates={false}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        When do you want to start tracking this goal?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetDate"
                  render={({ field }) => {
                    const startDate = form.watch("startDate");
                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel>Target Date *</FormLabel>
                        <FormControl>
                          <DatePicker
                            date={field.value}
                            onDateChange={(date) => {
                              field.onChange(date);
                            }}
                            placeholder="Pick a target date"
                            disablePastDates={true}
                            minDate={startDate || new Date()}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          When do you want to achieve this goal?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
                </div>
              )}

              {/* Step 3: Source Configuration / Progress Tracking */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in-50 duration-300">
           

              <FormField
                control={form.control}
                name="sourceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SOURCE_TYPES.map((source) => (
                          <SelectItem key={source.value} value={source.value} className="p-1">
                            <div className="flex flex-col items-start">
                              <span>{source.label}</span>
                              <span className="text-xs text-muted-foreground">
                                {source.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Source-specific fields with functional dropdowns */}
              {sourceType === "BANK_ACCOUNT" && (
                <FormField
                  control={form.control}
                  name="accountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Account *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a bank account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bankAccounts.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              No bank accounts available. Connect a bank account first.
                            </div>
                          ) : (
                            bankAccounts
                              .filter(acc => acc.isActive)
                              .map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  <div className="flex flex-col items-start">
                                    <span className="font-medium">{account.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {account.institutionName} • ${account.balance.toLocaleString()}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Link this goal to a specific bank account for automatic tracking
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {sourceType === "CRYPTO_WALLET" && (
                <FormField
                  control={form.control}
                  name="cryptoWalletId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crypto Wallet *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a crypto wallet" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cryptoWallets.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              No crypto wallets available. Add a wallet first.
                            </div>
                          ) : (
                            cryptoWallets
                              .filter(wallet => wallet.isActive)
                              .map((wallet) => (
                                <SelectItem key={wallet.id} value={wallet.id}>
                                  <div className="flex flex-col items-start">
                                    <span className="font-medium">{wallet.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {wallet.network} • ${parseFloat(wallet.totalBalanceUsd).toLocaleString()}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Link this goal to a specific crypto wallet for automatic tracking
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
                </div>
              )}

              {/* Step 4: Extras (Milestones, Tags, Notes) */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in-50 duration-300">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-1">Additional Details</h3>
                    <p className="text-sm text-muted-foreground">Add milestones, tags, and notes to enrich your goal.</p>
                  </div>

                  {/* Milestones */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Milestones</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddMilestone}
                >
                  <Plus className="size-4 mr-1" />
                  Add Milestone
                </Button>
              </div>

              {milestones.length > 0 && (
                <div className="space-y-3">
                  {milestones.map((milestone, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="Milestone name"
                                value={milestone.name}
                                onChange={(e) => handleMilestoneChange(index, "name", e.target.value)}
                              />
                              <Input
                                type="number"
                                placeholder="25"
                                value={milestone.targetPercentage}
                                onChange={(e) => handleMilestoneChange(index, "targetPercentage", parseFloat(e.target.value))}
                                className="w-24"
                              />
                              <span className="text-sm text-muted-foreground">%</span>
                            </div>
                            <Input
                              placeholder="Celebration message (optional)"
                              value={milestone.celebration || ""}
                              onChange={(e) => handleMilestoneChange(index, "celebration", e.target.value)}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleRemoveMilestone(index)}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
                  </div>

                  {/* Tags */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold">Tags</h3>

              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                  leftIcon={<Tag className="size-4" />}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTag}
                  disabled={!currentTag.trim()}
                >
                  Add
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

                  {/* Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional notes or details..."
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Navigation Footer */}
            <DialogFooter className="flex-shrink-0 ">
              <div className="flex items-center justify-between w-full">
                <Button
                  type="button"
                  variant="outline"
                  size={'sm'}
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>

                <div className="flex gap-2">
                  {canGoBack && (
                    <Button
                      type="button"
                      variant="outline"
                      size={'sm'}
                      onClick={handleBack}
                      disabled={isSubmitting}
                    >
                      Back
                    </Button>
                  )}

                  {canGoNext ? (
                    <Button
                    size={'sm'}
                      type="button"
                      onClick={handleNext}
                      disabled={isSubmitting}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting} size={'sm'}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 mr-1 animate-spin" />
                          {isEditing ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        <>
                          <MageGoals className="size-4 mr-1" stroke="2" />
                          {isEditing ? 'Update Goal' : 'Create Goal'}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
