"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Loader2, Search, Edit3, ArrowLeft, Check, Calendar, Bell, Sparkles } from "lucide-react";
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
import { useToast } from "@/lib/hooks/useToast";
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
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SUBSCRIPTION_SERVICES } from "@/lib/constants/subscription-services-metadata";
import { getLogoUrl } from "@/lib/services/logo-service";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { CurrencyDisplay } from "../ui/currency-display";
import { MageCalendar2 } from "../icons/icons";
import { ScrollArea } from "../ui/scroll-area";
import { CurrencyInput } from "../ui/currency-input-group";

interface SubscriptionFormModalProps {
  open: boolean;
  onClose: () => void;
  subscription?: UserSubscription | null;
}

type FormStep = "selection" | "plan" | "details";

const POPULAR_SERVICES = SUBSCRIPTION_SERVICES.slice(0, 12);
const BILLING_CYCLES: { value: BillingCycle; label: string }[] = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "SEMI_ANNUAL", label: "Semi-Annual" },
  { value: "YEARLY", label: "Yearly" },
];

const CATEGORIES: { value: SubscriptionCategory; label: string }[] = [
  { value: "STREAMING", label: "Streaming" },
  { value: "MUSIC", label: "Music" },
  { value: "SOFTWARE", label: "Software" },
  { value: "CLOUD_STORAGE", label: "Cloud Storage" },
  { value: "GAMING", label: "Gaming" },
  { value: "FITNESS", label: "Fitness" },
  { value: "PRODUCTIVITY", label: "Productivity" },
  { value: "OTHER", label: "Other" },
];

export function SubscriptionFormModal({
  open,
  onClose,
  subscription,
}: SubscriptionFormModalProps) {
  const { toast } = useToast();
  const { mutate: createSubscription, isPending: isCreating } = useCreateSubscription();
  const { mutate: updateSubscription, isPending: isUpdating } = useUpdateSubscription();

  const [step, setStep] = React.useState<FormStep>("selection");
  const [selectedService, setSelectedService] = React.useState<Record<string, unknown> | null>(null);
  const [selectedPlan, setSelectedPlan] = React.useState<Record<string, unknown> | null>(null);
  const [manualEntry, setManualEntry] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateSubscriptionRequest>({
    defaultValues: {
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

  const isPending = isCreating || isUpdating;

  // Reset form when opening/closing
  React.useEffect(() => {
    if (open) {
      if (subscription) {
        reset(subscription);
        setManualEntry(true);
        setStep("details");
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
        setStep("selection");
        setSelectedService(null);
        setSelectedPlan(null);
        setManualEntry(false);
        setSearchQuery("");
      }
    }
  }, [open, subscription, reset]);

  // Handle service selection
  const handleSelectService = (service: Record<string, unknown>) => {
    setSelectedService(service);
    setValue("name", service.name);
    setValue("merchantName", service.merchantName);
    setValue("category", service.category.toUpperCase() as SubscriptionCategory);
    setValue("websiteUrl", service.websiteUrl);
    setValue("cancellationUrl", service.cancellationUrl);

    // If only one plan, auto-select it
    if (service.plans?.length === 1) {
      handleSelectPlan(service.plans[0]);
      setStep("details");
    } else if (service.plans?.length > 0) {
      setStep("plan");
    } else {
      setStep("details");
    }
  };

  // Handle plan selection
  const handleSelectPlan = (plan: Record<string, unknown>) => {
    setSelectedPlan(plan);
    setValue("amount", plan.amount);
    setValue("currency", plan.currency);
    setValue("billingCycle", plan.billingCycle as BillingCycle);
    setStep("details");
  };

  // Handle manual entry
  const handleManualEntry = () => {
    setManualEntry(true);
    setStep("details");
  };

  // Filter services based on search
  const filteredServices = React.useMemo(() => {
    if (!searchQuery.trim()) return POPULAR_SERVICES;

    const query = searchQuery.toLowerCase();
    return SUBSCRIPTION_SERVICES.filter(
      (service) =>
        service.name.toLowerCase().includes(query) ||
        service.merchantName.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query) ||
        service.tags.some((tag) => tag.toLowerCase().includes(query))
    ).slice(0, 12);
  }, [searchQuery]);

  const onSubmit = (data: CreateSubscriptionRequest) => {
    const action = subscription ? updateSubscription : createSubscription;
    const payload = subscription ? { id: subscription.id, updates: data } : data;
    const isCreate = !subscription;

    // Close dialog immediately for create
    if (isCreate) {
      onClose();
    }

    action(payload as CreateSubscriptionRequest | { id: string; updates: CreateSubscriptionRequest }, {
      onSuccess: () => {
        toast({
          title: subscription ? "Subscription updated" : "Subscription created",
          description: "Your subscription has been saved successfully.",
        });
        // Close dialog for updates
        if (!isCreate) {
          onClose();
        }
      },
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : "Failed to save subscription. Please try again.";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose} >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step !== "selection" && !manualEntry && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -ml-2"
                onClick={() => setStep(step === "details" ? (selectedService?.plans?.length > 1 ? "plan" : "selection") : "selection")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            {subscription ? "Edit Subscription" : "Add Subscription"}
          </DialogTitle>
          <DialogDescription>
            {step === "selection" && "Choose a popular service or search for your subscription"}
            {step === "plan" && "Select your plan"}
            {step === "details" && "Enter subscription details and billing information"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 ">
          {/* STEP 1: SERVICE SELECTION */}
          {step === "selection" && !manualEntry && (
            <div className="space-y-4 pb-4">
              {/* Search Bar */}
              <div className="relative">
                
                <Input
                  placeholder="Search for Netflix, Spotify, Disney+..."
                  value={searchQuery}
                  leftIcon={<Search className=" h-4 w-4 text-muted-foreground" />}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Popular Services Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {searchQuery ? "Search Results" : "Popular Services"}
                  </h3>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleManualEntry}
                    icon={<Edit3 className="h-4 w-4 mr-1" />}
                  >
                    
                    Enter Manually
                  </Button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {filteredServices.map((service) => {
                    const logoUrl = getLogoUrl(service.websiteUrl);
                    return (
                      <Card
                        key={service.name}
                        className={cn(
                          "cursor-pointer transition-all hover:shadow-md hover:scale-102 border-2 duration-75",
                          "hover:border-primary/20"
                        )}
                        onClick={() => handleSelectService(service)}
                      >
                        <CardContent className="p-4 flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                            {logoUrl ? (
                              <img
                                src={logoUrl}
                                alt={service.name}
                                className="w-12 h-12 object-fill"
                              />
                            ) : (
                              <Sparkles className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-medium line-clamp-1">
                              {service.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground line-clamp-1">
                              {service.category}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {filteredServices.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No services found</p>
                    <Button onClick={handleManualEntry} variant="outline" size="sm">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Enter Manually Instead
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: PLAN SELECTION */}
          {step === "plan" && selectedService && !manualEntry && (
            <div className="space-y-4 pb-4">
              {/* Selected Service Header */}
              <Card className="bg-muted/50 rounded-none border-none">
                <CardContent className="px-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center overflow-hidden">
                    {getLogoUrl(selectedService.websiteUrl) ? (
                      <img
                        src={getLogoUrl(selectedService.websiteUrl)!}
                        alt={selectedService.name}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <Sparkles className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{selectedService.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedService.merchantName}
                    </p>
                  </div>
                  <Badge variant="secondary">{selectedService.category}</Badge>
                </CardContent>
              </Card>

              {/* Plan Selection */}
              <div>
                <h3 className="text-sm font-medium mb-3">Choose your plan</h3>
                <div className="grid gap-3">
                  {selectedService.plans.map((plan: { name: string; billingCycle: string; amount: number; currency: string }) => (
                    <Card
                      key={plan.name}
                      className={cn(
                        "cursor-pointer transition-all py-0 hover:shadow-md border-2 rounded-xl",
                        selectedPlan?.name === plan.name
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/70"
                      )}
                      onClick={() => handleSelectPlan(plan)}
                    >
                      <CardContent className="px-2 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{plan.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {plan.billingCycle.toLowerCase()}
                            </Badge>
                          </div>
                          {plan.description && (
                            <p className="text-sm text-muted-foreground">
                              {plan.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-xl font-bold">
                             
                              <CurrencyDisplay amountUSD={plan.amount.toFixed(2)} variant='large' />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              per {plan.billingCycle.toLowerCase()}
                            </div>
                          </div>
                          {selectedPlan?.name === plan.name && (
                            <Check className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleManualEntry}
                variant="link"
                size="sm"
                className="w-full"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Enter custom amount instead
              </Button>
            </div>
          )}

          {/* STEP 3: DETAILS FORM */}
          {step === "details" && (
            <>
            <ScrollArea className="h-[calc(90vh-16rem)] pr-4">
            <form id="subscription-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-2">
              {/* Selected Service Summary */}
              {selectedService && !manualEntry && (
                <Card className="bg-muted/50 border-none rounded-none">
                  <CardContent className="px-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center overflow-hidden">
                      {getLogoUrl(selectedService.websiteUrl) ? (
                        <img
                          src={getLogoUrl(selectedService.websiteUrl)!}
                          alt={selectedService.name}
                          
                          className="w-12 h-12 object-fill"
                        />
                      ) : (
                        <Sparkles className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{selectedService.name}</h3>
                      {selectedPlan && (
                        <p className="text-sm text-muted-foreground">
                          {selectedPlan.name} — {selectedPlan.currency} {selectedPlan.amount}/{selectedPlan.billingCycle.toLowerCase()}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleManualEntry}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Basic Information */}
              <div className="space-y-2">
          
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 ">
                 
                    <Input
                      id="name"
                      label="Service Name"
                      required
                      placeholder="e.g., Netflix, Spotify"
                      {...register("name", { required: "Service name is required" })}
                      disabled={!manualEntry && !!selectedService}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                    )}
                  </div>

          

          <CurrencyInput
            label="Amount"
            placeholder="15.99"
            step="0.01"
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
                     value={watch("billingCycle")}
                      onValueChange={(value) => setValue("billingCycle", value as BillingCycle)}
                    >
                      <SelectTrigger label="Billing Cycle">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BILLING_CYCLES.map((cycle) => (
                          <SelectItem key={cycle.value} value={cycle.value} className="text-sm">
                            {cycle.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                   
                    <Select
                      value={watch("category")}
                      onValueChange={(value) => setValue("category", value as SubscriptionCategory)}
                    >
                      <SelectTrigger  label="Category" >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Billing Details */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <MageCalendar2 className="h-4 w-4" />
                  Billing Details
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                  
                    <Input
                      id="startDate"
                      label="Start Date"
                      type="date"
                      {...register("startDate")}
                    />
                  </div>

                  <div>
            
                    <Input
                    label="Next Billing Date"
                      id="nextBillingDate"
                      type="date"
                      {...register("nextBillingDate")}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Notifications */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoRenew">Auto-renewal</Label>
                      <p className="text-xs text-muted-foreground">
                        This subscription renews automatically
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
                      <Label htmlFor="notifyBeforeBilling">Billing reminder</Label>
                      <p className="text-xs text-muted-foreground">
                        Get notified before billing
                      </p>
                    </div>
                    <Switch
                      id="notifyBeforeBilling"
                      checked={watch("notifyBeforeBilling")}
                      onCheckedChange={(checked) => setValue("notifyBeforeBilling", checked)}
                    />
                  </div>

                  {watch("notifyBeforeBilling") && (
                    <div>
                     
                      <Input
                        id="notifyDaysBefore"
                        type="number"
                      
                        label="Remind me (days before)"
                        min="1"
                        max="30"
                        {...register("notifyDaysBefore", { valueAsNumber: true })}
                      />
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Additional Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Additional Information (Optional)</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                 
                    <Input
                      id="merchantName"
                      label="Merchant Name"
                      placeholder="Company name"
                      {...register("merchantName")}
                      disabled={!manualEntry && !!selectedService}
                    />
                  </div>

                  <div>
                    <Label htmlFor="websiteUrl"></Label>
                    <Input
                      id="websiteUrl"
                      
                      type="url"
                      label="Website URL"
                      placeholder="https://example.com"
                      {...register("websiteUrl")}
                      disabled={!manualEntry && !!selectedService}
                    />
                  </div>

                  <div>
            
                    <Input
                      id="cancellationUrl"
                      label="Cancellation URL"
                      type="url"
                      placeholder="https://example.com/cancel"
                      {...register("cancellationUrl")}
                      disabled={!manualEntry && !!selectedService}
                    />
                  </div>

                  <div className="col-span-2">
              
                    <Input
                    label="Description"
                      id="description"
                      placeholder="Optional description"
                      {...register("description")}
                    />
                  </div>

                  <div className="col-span-2">
                 
                    <Textarea
                    label="Notes"
                      id="notes"
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
              <Button type="submit" form="subscription-form" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {subscription ? "Update" : "Add"} Subscription
              </Button>
            </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
