"use client";

import * as React from "react";
import { Plus, Search, Filter, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SubscriptionList } from "@/components/subscriptions/subscription-list";
import { SubscriptionAnalytics } from "@/components/subscriptions/subscription-analytics";
import { SubscriptionFormModal } from "@/components/subscriptions/subscription-form-modal";
import { SubscriptionFiltersSheet } from "@/components/subscriptions/subscription-filters-sheet";
import { useSubscriptionUIStore } from "@/lib/stores/subscription-ui-store";
import { useDeleteSubscription } from "@/lib/queries/use-subscription-data";
import { useToast } from "@/lib/hooks/use-toast";
import type { UserSubscription } from "@/lib/types/subscription";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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

export default function SubscriptionsPage() {
  const { toast } = useToast();
  const [selectedSubscription, setSelectedSubscription] = React.useState<UserSubscription | null>(
    null
  );
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = React.useState<UserSubscription | null>(
    null
  );

  const {
    viewPreferences,
    filters,
    setSubscriptionsView,
    setSearchQuery,
    setActiveTab,
    ui,
  } = useSubscriptionUIStore();

  const { mutate: deleteSubscription, isPending: isDeleting } = useDeleteSubscription();

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
    <div className="max-5xl mx-auto flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Subscriptions</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-muted-foreground text-xs mt-1">
            Track and manage your recurring subscriptions
          </p>
        </div>
        <Button onClick={handleAddNew} size={'xs'}>
          <Plus className="mr-1 h-4 w-4" />
          Add Subscription
        </Button>
      </div>

      {/* Analytics */}
      <SubscriptionAnalytics />


      {/* Tabs */}
      <Tabs value={ui.activeTab} onValueChange={(value: any) => setActiveTab(value)} >
        <div className="flex items-center justify-between">
        <TabsList variant={'card'} size="sm">
          <TabsTrigger value="all" variant={'card'} size="sm" >All</TabsTrigger>
          <TabsTrigger value="active" variant={'card'} size="sm">Active</TabsTrigger>
          <TabsTrigger value="trial" variant={'card'} size="sm">Trial</TabsTrigger>
          <TabsTrigger value="cancelled" variant={'card'} size="sm">Cancelled</TabsTrigger>
        </TabsList>
              {/* Filters and View Controls */}
      <div className="flex items-center justify-between min-w-sm gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
            <Input
              placeholder="Search subscriptions..."
              className="pl-9"
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon-sm">
                {viewPreferences.subscriptionsView === "grid" ? (
                  <LayoutGrid className="h-4 w-4" />
                ) : (
                  <List className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>View</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSubscriptionsView("grid")}>
                <LayoutGrid className="mr-2 h-4 w-4" />
                Grid
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSubscriptionsView("list")}>
                <List className="mr-2 h-4 w-4" />
                List
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSubscriptionsView("compact")}>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Compact
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="icon-sm" onClick={() => setIsFiltersOpen(true)}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
</div>

        <TabsContent value="all" className="mt-6">
          <SubscriptionList
            activeTab="all"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={(sub) => setSelectedSubscription(sub)}
          />
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <SubscriptionList
            activeTab="active"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={(sub) => setSelectedSubscription(sub)}
          />
        </TabsContent>

        <TabsContent value="trial" className="mt-6">
          <SubscriptionList
            activeTab="trial"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={(sub) => setSelectedSubscription(sub)}
          />
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          <SubscriptionList
            activeTab="cancelled"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={(sub) => setSelectedSubscription(sub)}
          />
        </TabsContent>
      </Tabs>

      {/* Modals & Sheets */}
      <SubscriptionFormModal
        open={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedSubscription(null);
        }}
        subscription={selectedSubscription}
      />

      <SubscriptionFiltersSheet open={isFiltersOpen} onClose={() => setIsFiltersOpen(false)} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{subscriptionToDelete?.name}"? This action cannot be
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
