"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Edit,
  MoreVertical,
  Trash2,
  TrendingUp,
  AlertCircle,
  Target,
  CheckCircle2,
  Trophy,
  Zap,
  Plus,
  X,
  Award,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { useGoal, useDeleteGoal } from "@/lib/queries/use-goal-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/lib/hooks/use-toast";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { MageGoals, SolarCheckCircleBoldDuotone, SolarCalendarBoldDuotone } from "@/components/icons/icons";
import { CircularProgress } from "@/components/goals/goal-card";
import { GoalContributionsChart } from "@/components/goals/goal-contributions-chart";
import { GoalHeader } from "@/components/goals/goal-header";

export default function GoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const goalId = params.id as string;

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Fetch goal data using React Query
  const { data: goal, isLoading, error } = useGoal(goalId);
  const deleteGoalMutation = useDeleteGoal();

  const handleDelete = () => {
    setIsDeleting(true);
    deleteGoalMutation.mutate(goalId, {
      onSuccess: () => {
        toast({
          title: "Goal deleted",
          description: "The goal has been removed successfully.",
        });
        router.push("/goals");
      },
      onError: (error: unknown) => {
        const message = error?.message || "Failed to delete goal";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        setIsDeleting(false);
      },
    });
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
    toast({
      title: "Copied to clipboard",
      description: `${fieldName} has been copied.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="mx-auto space-y-3 max-w-3xl flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading goal details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !goal) {
    return (
      <div className="mx-auto space-y-3 max-w-3xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <div className="p-6 flex flex-col items-center justify-center gap-3 text-center">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">
                Failed to load goal
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {error instanceof Error ? error.message : 'The goal could not be found or loaded'}
              </p>
            </div>
            <Button onClick={() => router.push('/goals')} className="mt-4">
              Back to Goals
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const progressColor = progress >= 100 ? "#54850F" : progress >= 75 ? "#10b981" : progress >= 50 ? "#3b82f6" : "#f59e0b";

  return (
    <div className="mx-auto space-y-3 max-w-3xl">
      {/* Top Navigation */}
      <div className="flex items-center justify-end">
    

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="xs"
            onClick={() => setIsEditModalOpen(true)}
            className="gap-1.5"
          >
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="xs">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Goal
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Goal Header with Chart */}
      <GoalHeader goal={goal} progress={progress} progressColor={progressColor} />

      {/* Tabs - Content Sections */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList variant="pill" className="justify-start overflow-x-auto">
          <TabsTrigger value="overview" variant="pill">
            <Target className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="milestones" variant="pill">
            <Trophy className="h-4 w-4" />
            Milestones
            {(goal.milestones?.length || 0) > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                {(goal.milestones || []).filter(m => m.isAchieved).length}/{goal.milestones?.length || 0}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="contributions" variant="pill">
            <Plus className="h-4 w-4" />
            Contributions
            {(goal.totalContributions || 0) > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                <CurrencyDisplay amountUSD={goal.totalContributions} variant="compact" className="text-xs" />
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="details" variant="pill">
            <Zap className="h-4 w-4" />
            Details
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {/* Timeline */}
            <Card className="border hover:shadow-none border-border/50 p-4">
              <div className="flex items-center gap-3 mb-5">
                <div className="rounded-full bg-muted border p-2">
                  <Calendar className="h-5 w-5 text-foreground/80" />
                </div>
                <h3 className="font-medium text-foreground">Timeline</h3>
              </div>
              <div className="space-y-4 text-sm">
                <InfoRow label="Created" value={formatDate(goal.createdAt || goal.targetDate)} />
                <InfoRow label="Target Date" value={formatDate(goal.targetDate)} />
                <InfoRow label="Days Remaining" value={`${goal.daysRemaining ?? 'N/A'} days`} />
                <InfoRow label="Progress" value={`${progress.toFixed(0)}%`} />
              </div>
            </Card>

            {/* Summary */}
            <Card className="border hover:shadow-none border-border/50 p-4">
              <div className="flex items-center gap-3 mb-5">
                <div className="rounded-full border bg-muted p-2">
                  <DollarSign className="h-5 w-5 text-foreground/80" />
                </div>
                <h3 className="font-medium text-foreground">Summary</h3>
              </div>
              <div className="space-y-4 text-sm">
                <InfoRow label="Current" value={<CurrencyDisplay amountUSD={goal.currentAmount} variant="compact" />} />
                <InfoRow label="Target" value={<CurrencyDisplay amountUSD={goal.targetAmount} variant="compact" />} />
                <InfoRow label="Remaining" value={<CurrencyDisplay amountUSD={Math.max(0, goal.targetAmount - goal.currentAmount)} variant="compact" />} />
                <Separator className="my-3" />
                <InfoRow label="Status" value={goal.isAchieved ? "Achieved ✓" : "In Progress"} />
              </div>
            </Card>

            {/* Progress Info */}
            <Card className="border hover:shadow-none border-border/50 p-4 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-full border bg-muted p-2">
                    <TrendingUp className="h-5 w-5 text-foreground/80" />
                  </div>
                  <h3 className="font-medium text-foreground">Progress</h3>
                </div>
                <Badge variant={goal.onTrack ? "success" : "destructive"} className="text-xs rounded-full">
                  {goal.onTrack ? "On Track" : "Behind"}
                </Badge>
              </div>
              <div className="space-y-4 text-sm">
                <InfoRow label="Completion" value={`${progress.toFixed(1)}%`} />
                <InfoRow label="Total Contributed" value={<CurrencyDisplay amountUSD={goal.totalContributions} variant="compact" />} />
                <InfoRow
                  label="Monthly Average"
                  value={<CurrencyDisplay amountUSD={goal.totalContributions / Math.max(1, Math.ceil((new Date().getTime() - new Date(goal.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30)))} variant="compact" />}
                />
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones" className="space-y-4">
          <Card className="overflow-hidden rounded-xl border-border/60 p-4">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted border shadow p-2">
                  <Trophy className="h-5 w-5 text-foreground/80" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">Milestones</h3>
                  <p className="text-xs text-muted-foreground">
                    {(goal.milestones || []).filter(m => m.isAchieved).length} of {goal.milestones?.length || 0} achieved
                  </p>
                </div>
              </div>
            </div>
            {goal.milestones && goal.milestones.length > 0 ? (
              <div className="space-y-3">
                {(goal.milestones || []).map((milestone) => (
                  <div
                    key={milestone.id}
                    className={cn(
                      "group relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-background/80 to-background/40 p-4 transition-all",
                      milestone.isAchieved ? "hover:shadow-md hover:border-emerald-500/30" : "hover:shadow-md hover:border-primary/30"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100",
                        milestone.isAchieved ? "bg-gradient-to-br from-emerald-500/5 to-transparent" : "bg-gradient-to-br from-primary/5 to-transparent"
                      )}
                    />
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "rounded-lg p-2.5",
                            milestone.isAchieved
                              ? "bg-emerald-500/15 text-emerald-600"
                              : "bg-blue-500/15 text-blue-600"
                          )}
                        >
                          {milestone.isAchieved ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Target className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-base font-semibold">{milestone.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Trophy className="h-3 w-3" />
                            {milestone.targetPercentage}% of goal
                          </p>
                        </div>
                      </div>
                      {milestone.isAchieved && (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                          ✓ {milestone.achievedDate ? formatDate(milestone.achievedDate) : "Achieved"}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Trophy className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No milestones set</p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Contributions Tab */}
        <TabsContent value="contributions" className="space-y-4">
          <Card className="overflow-hidden rounded-xl border-border/60 p-4">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-full bg-muted border shadow p-2">
                <Plus className="h-5 w-5 text-foreground/80" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Contribution Summary</h3>
                <p className="text-xs text-muted-foreground">
                  Track your goal contributions
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Total Contributions */}
              <div className="rounded-lg border border-border/50 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-full bg-emerald-500/15 p-2">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h4 className="text-sm font-medium text-muted-foreground">Total Contributions</h4>
                </div>
                <p className="text-2xl font-bold">
                  <CurrencyDisplay amountUSD={goal.totalContributions} variant="compact" />
                </p>
              </div>

              {/* Recurring Amount */}
              {goal.recurringAmount && (
                <div className="rounded-lg border border-border/50 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-full bg-blue-500/15 p-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 className="text-sm font-medium text-muted-foreground">Recurring Amount</h4>
                  </div>
                  <p className="text-2xl font-bold">
                    <CurrencyDisplay amountUSD={goal.recurringAmount} variant="compact" />
                  </p>
                  {goal.contributionFrequency && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Every {goal.contributionFrequency.toLowerCase()}
                    </p>
                  )}
                </div>
              )}

              {/* Average Contribution */}
              {goal.totalContributions > 0 && (
                <div className="rounded-lg border border-border/50 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-full bg-purple-500/15 p-2">
                      <Award className="h-5 w-5 text-purple-600" />
                    </div>
                    <h4 className="text-sm font-medium text-muted-foreground">Monthly Average</h4>
                  </div>
                  <p className="text-2xl font-bold">
                    <CurrencyDisplay
                      amountUSD={goal.totalContributions / Math.max(1, Math.ceil((new Date().getTime() - new Date(goal.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30)))}
                      variant="compact"
                    />
                  </p>
                </div>
              )}

              {/* Current Progress */}
              <div className="rounded-lg border border-border/50 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-full bg-amber-500/15 p-2">
                    <Target className="h-5 w-5 text-amber-600" />
                  </div>
                  <h4 className="text-sm font-medium text-muted-foreground">Current Amount</h4>
                </div>
                <p className="text-2xl font-bold">
                  <CurrencyDisplay amountUSD={goal.currentAmount} variant="compact" />
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {progress.toFixed(1)}% of target
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border/50">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Tip:</strong> Contributions are tracked automatically based on your goal source and can be manually added through the goal actions menu.
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card className="overflow-hidden rounded-xl border-border/60 p-4">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-base font-semibold">Technical Details</h3>
            </div>
            <div className="space-y-2.5">
              <DetailRow
                label="Goal ID"
                value={goal.id}
                copyable
                onCopy={() => copyToClipboard(goal.id, "Goal ID")}
                copied={copiedField === "Goal ID"}
              />
              <DetailRow label="Status" value={goal.isActive ? "Active" : "Inactive"} />
              <DetailRow label="Priority" value={goal.priority || "N/A"} />
              <DetailRow label="Category" value={goal.category || "N/A"} />
              <DetailRow label="Created" value={formatDate(goal.createdAt || goal.targetDate)} />
              <DetailRow label="Target Date" value={formatDate(goal.targetDate)} />
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{goal.name}&quot;? This action cannot be undone
              and will remove all associated milestones and contributions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Helper Components
interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  copyable?: boolean;
  onCopy?: () => void;
  copied?: boolean;
}

function DetailRow({ label, value, copyable, onCopy, copied }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 p-3 hover:bg-muted/50 transition-colors">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="max-w-xs truncate text-xs font-mono">{value}</span>
        {copyable && onCopy && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-6 w-6"
            onClick={onCopy}
          >
            {copied ? (
              <Check className="h-3 w-3 text-emerald-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
