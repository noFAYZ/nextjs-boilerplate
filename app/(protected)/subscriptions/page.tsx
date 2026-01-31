"use client";

import * as React from "react";
import { Plus, LayoutGrid, List } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { usePostHogPageView } from '@/lib/shared/hooks';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionList } from "@/components/modules/subscriptions/components/subscription-list";
import { SubscriptionFormModal } from "@/components/modules/subscriptions/components/subscription-form-modal";
import { SubscriptionsFloatingToolbar } from "@/components/modules/subscriptions/components/subscriptions-floating-toolbar";
import { useSubscriptionUIStore } from '@/lib/features/subscriptions/stores';
import { useDeleteSubscription, useSubscriptions } from "@/lib/features/subscriptions/queries";
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
import { useToast } from '@/lib/shared/hooks';

export default function SubscriptionsPage() {
  usePostHogPageView('subscriptions');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ============================================
  // State: Modals & Dialogs
  // ============================================
  const [modals, setModals] = React.useState({
    formModal: { isOpen: false, subscription: null as UserSubscription | null },
    deleteDialog: { isOpen: false, subscription: null as UserSubscription | null },
  });

  // ============================================
  // State: Selection
  // ============================================
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const { setActiveTab, ui, viewPreferences, setSubscriptionsView } = useSubscriptionUIStore();
  const { data: subscriptions = [] } = useSubscriptions();
  const { mutate: deleteSubscription, isPending: isDeleting } = useDeleteSubscription();

  // ============================================
  // Modal & Dialog Handlers
  // ============================================
  const openFormModal = React.useCallback((subscription: UserSubscription | null) => {
    setModals((prev) => ({
      ...prev,
      formModal: { isOpen: true, subscription },
    }));
  }, []);

  const closeFormModal = React.useCallback(() => {
    setModals((prev) => ({
      ...prev,
      formModal: { isOpen: false, subscription: null },
    }));
  }, []);

  const openDeleteDialog = React.useCallback((subscription: UserSubscription) => {
    setModals((prev) => ({
      ...prev,
      deleteDialog: { isOpen: true, subscription },
    }));
  }, []);

  const closeDeleteDialog = React.useCallback(() => {
    setModals((prev) => ({
      ...prev,
      deleteDialog: { isOpen: false, subscription: null },
    }));
  }, []);

  // ============================================
  // Data Handlers
  // ============================================
  const handleRefresh = React.useCallback(async () => {
    await queryClient.refetchQueries({ queryKey: ['subscriptions'] });
  }, [queryClient]);

  const handleEdit = React.useCallback(
    (subscription: UserSubscription) => {
      openFormModal(subscription);
    },
    [openFormModal]
  );

  const handleDelete = React.useCallback(
    (subscription: UserSubscription) => {
      openDeleteDialog(subscription);
    },
    [openDeleteDialog]
  );

  const handleAddNew = React.useCallback(() => {
    openFormModal(null);
  }, [openFormModal]);

  const confirmDelete = React.useCallback(() => {
    if (modals.deleteDialog.subscription) {
      deleteSubscription(modals.deleteDialog.subscription.id, {
        onSuccess: () => {
          toast({
            title: "Subscription deleted",
            description: "The subscription has been removed successfully.",
            variant: 'success'
          });
          closeDeleteDialog();
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
  }, [modals.deleteDialog.subscription, deleteSubscription, closeDeleteDialog, toast]);

  const handleClearSelection = React.useCallback(() => {
    setSelectedIds([]);
  }, []);

  // ============================================
  // Computed Values
  // ============================================
  const selectedSubscriptions = React.useMemo(
    () => subscriptions.filter((s) => selectedIds.includes(s.id)),
    [subscriptions, selectedIds]
  );

  const totalMonthlySpend = React.useMemo(
    () => selectedSubscriptions.reduce((total, sub) => total + (sub.monthlyEquivalent || 0), 0),
    [selectedSubscriptions]
  );


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
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        </TabsContent>

        <TabsContent value="active" className="mt-6 pb-32">
          <SubscriptionList
            activeTab="active"
            onEdit={handleEdit}
            onDelete={handleDelete}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        </TabsContent>

        <TabsContent value="trial" className="mt-6 pb-32">
          <SubscriptionList
            activeTab="trial"
            onEdit={handleEdit}
            onDelete={handleDelete}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6 pb-32">
          <SubscriptionList
            activeTab="cancelled"
            onEdit={handleEdit}
            onDelete={handleDelete}
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
        onClearSelection={handleClearSelection}
        onDelete={handleDelete}
        isLoading={isDeleting}
      />

      {/* Modals & Sheets */}
      <SubscriptionFormModal
        open={modals.formModal.isOpen}
        onClose={closeFormModal}
        subscription={modals.formModal.subscription}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={modals.deleteDialog.isOpen} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{modals.deleteDialog.subscription?.name}&quot;? This action cannot be
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
