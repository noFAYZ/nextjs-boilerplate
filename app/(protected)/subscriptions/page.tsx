"use client";

import * as React from "react";
import { Plus, LayoutGrid, List } from "lucide-react";
import { useQueryClient, useIsFetching } from "@tanstack/react-query";
import { usePostHogPageView } from "@/lib/hooks/usePostHogPageView";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionList } from "@/components/subscriptions/subscription-list";
import { SubscriptionFormModal } from "@/components/subscriptions/subscription-form-modal";
import { UpcomingCharges } from "@/components/subscriptions/upcoming-charges";
import { SubscriptionsFloatingToolbar } from "@/components/subscriptions/subscriptions-floating-toolbar";
import { useSubscriptionUIStore } from "@/lib/stores/subscription-ui-store";
import { useDeleteSubscription, useSubscriptions } from "@/lib/queries/use-subscription-data";
import type { UserSubscription } from "@/lib/types/subscription";
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
import { useToast } from "@/lib/hooks/useToast";

export default function SubscriptionsPage() {
  usePostHogPageView('subscriptions');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();

  const [selectedSubscription, setSelectedSubscription] = React.useState<UserSubscription | null>(
    null
  );
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = React.useState<UserSubscription | null>(
    null
  );
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const { setActiveTab, ui, viewPreferences, setSubscriptionsView } = useSubscriptionUIStore();
  const { data: subscriptions = [], isLoading: isLoadingSubscriptions } = useSubscriptions();

  const { mutate: deleteSubscription, isPending: isDeleting } = useDeleteSubscription();

  const handleRefresh = React.useCallback(async () => {
    await queryClient.refetchQueries({ queryKey: ['subscriptions'] });
  }, [queryClient]);

  // Calculate total monthly spend for selected
  const selectedSubscriptions = subscriptions.filter((s) =>
    selectedIds.includes(s.id)
  );
  const totalMonthlySpend = selectedSubscriptions.reduce(
    (total, sub) => total + (sub.monthlyEquivalent || 0),
    0
  );

  const handleEdit = (subscription: UserSubscription) => {
    setSelectedSubscription(subscription);
    setIsFormModalOpen(true);
  };

  const handleDelete = (subscription: UserSubscription) => {
    setSubscriptionToDelete(subscription);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (subscriptionToDelete) {
      deleteSubscription(subscriptionToDelete.id, {
        onSuccess: () => {
          toast({
            title: "Subscription deleted",
            description: "The subscription has been removed successfully.",
            variant: 'success'
          });
          setIsDeleteDialogOpen(false);
          setSubscriptionToDelete(null);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to delete subscription. Please try again.",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleAddNew = () => {
    setSelectedSubscription(null);
    setIsFormModalOpen(true);
  };


  return (
    <div className=" flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Subscriptions</h1>
          <p className="text-muted-foreground text-xs ">
            Track and manage your recurring subscriptions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
            <Button
              variant={viewPreferences.subscriptionsView === "grid" ? "outline2" : "ghost"}
              size="xs"
                onClick={() => setSubscriptionsView("grid")}
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewPreferences.subscriptionsView === "list" ? "outline2" : "ghost"}
              size="xs"
              onClick={() => setSubscriptionsView("list")}
              title="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleAddNew} size={'xs'}>
            <Plus className="mr-1 h-4 w-4" />
            Add Subscription
          </Button>
        </div>
      </div>

      {/* Upcoming Charges
      <UpcomingCharges /> */}

      {/* Tabs */}
      <Tabs value={ui.activeTab} onValueChange={(value: string) => setActiveTab(value)} >
        <TabsList variant={'pill'}   >
          <TabsTrigger value="all" variant={'pill'}  >All</TabsTrigger>
          <TabsTrigger value="active" variant={'pill'} >Active</TabsTrigger>
          <TabsTrigger value="trial" variant={'pill'} >Trial</TabsTrigger>
          <TabsTrigger value="cancelled" variant={'pill'} >Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 pb-32">
          <SubscriptionList
            activeTab="all"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={(sub) => setSelectedSubscription(sub)}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        </TabsContent>

        <TabsContent value="active" className="mt-6 pb-32">
          <SubscriptionList
            activeTab="active"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={(sub) => setSelectedSubscription(sub)}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        </TabsContent>

        <TabsContent value="trial" className="mt-6 pb-32">
          <SubscriptionList
            activeTab="trial"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={(sub) => setSelectedSubscription(sub)}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6 pb-32">
          <SubscriptionList
            activeTab="cancelled"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={(sub) => setSelectedSubscription(sub)}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        </TabsContent>
      </Tabs>

      {/* Floating Toolbar */}
      <SubscriptionsFloatingToolbar
        selectedCount={selectedIds.length}
        totalMonthlySpend={totalMonthlySpend}
        selectedSubscriptions={selectedSubscriptions}
        onClearSelection={() => setSelectedIds([])}
        onDelete={handleDelete}
        isLoading={isDeleting}
      />

      {/* Modals & Sheets */}
      <SubscriptionFormModal
        open={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedSubscription(null);
        }}
        subscription={selectedSubscription}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{subscriptionToDelete?.name}&quot;? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
