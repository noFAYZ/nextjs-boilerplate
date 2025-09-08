"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { 
  OperationItem, 
  OperationStatus, 
  ProgressDialogProps,
  ProgressOperationResult 
} from "@/lib/types/progress";
import { 
  getStatusColor, 
  getStatusBadgeVariant, 
  getStatusText 
} from "@/lib/types/progress";

interface OperationState {
  status: 'idle' | 'processing' | 'completed';
  items: OperationItem[];
}

export function ProgressDialog({
  open,
  onOpenChange,
  items,
  onConfirm,
  title = "Processing Items",
  description,
  confirmButtonText = "Process",
  destructive = false,
  icon: IconComponent,
  iconColor = "text-blue-600",
  iconBgColor = "bg-blue-100 dark:bg-blue-900/20"
}: ProgressDialogProps) {
  const [operationState, setOperationState] = useState<OperationState>({
    status: 'idle',
    items: []
  });

  // Calculate progress statistics
  const totalItems = items.length;
  const processingItems = operationState.items.length > 0 ? operationState.items : items;
  const completedItems = processingItems.filter(
    item => item.status === 'success' || item.status === 'error' || item.status === 'cancelled'
  ).length;
  const successCount = processingItems.filter(item => item.status === 'success').length;
  const errorCount = processingItems.filter(item => item.status === 'error').length;
  const cancelledCount = processingItems.filter(item => item.status === 'cancelled').length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const isProcessing = operationState.status === 'processing';
  const isCompleted = operationState.status === 'completed';

  const handleConfirm = async () => {
    setOperationState({ status: 'processing', items: [...items] });
    
    // Initialize all items as processing state
    const initialItems: OperationItem[] = items.map(item => ({
      ...item,
      status: 'processing' as OperationStatus
    }));
    setOperationState({ status: 'processing', items: initialItems });

    // Add visual delays for better UX
    for (let i = 0; i < initialItems.length; i++) {
      setOperationState(prev => ({
        ...prev,
        items: prev.items.map((item, index) => 
          index === i ? { ...item, status: 'processing' } : item
        )
      }));
      
      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    try {
      const result: ProgressOperationResult = await onConfirm(items.map(item => item.id));

      // Update final states based on results
      setOperationState(prev => ({
        status: 'completed',
        items: prev.items.map(item => ({
          ...item,
          status: result.success.includes(item.id) ? 'success' : 'error',
          error: result.success.includes(item.id) ? undefined : 'Operation failed'
        }))
      }));
    } catch (error) {
      console.error('Operation failed:', error);
      // Mark all as error
      setOperationState(prev => ({
        status: 'completed',
        items: prev.items.map(item => ({
          ...item,
          status: 'error',
          error: 'Unexpected error occurred'
        }))
      }));
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onOpenChange(false);
      // Reset states after a delay to prevent visual glitch
      setTimeout(() => {
        setOperationState({ status: 'idle', items: [] });
      }, 150);
    }
  };

  const getStatusIcon = (status: OperationStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-muted-foreground" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
    }
  };

  const getOperationTitle = () => {
    if (isProcessing) return `Processing ${title}`;
    if (isCompleted) return `${title} Complete`;
    return title;
  };

  const getOperationDescription = () => {
    if (!isProcessing && !isCompleted && description) {
      return description;
    }
    if (isProcessing) {
      return `Processing items... Please wait while we complete your request.`;
    }
    if (isCompleted) {
      return `Operation completed. ${successCount} of ${totalItems} items processed successfully.${errorCount > 0 ? ` ${errorCount} items failed.` : ''}`;
    }
    return `You are about to process ${totalItems} item${totalItems > 1 ? 's' : ''}. This action may take some time to complete.`;
  };

  const DefaultIcon = destructive ? XCircle : CheckCircle2;
  const DisplayIcon = IconComponent || DefaultIcon;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              destructive 
                ? "bg-red-100 dark:bg-red-900/20" 
                : iconBgColor
            )}>
              <DisplayIcon className={cn(
                "h-5 w-5",
                destructive ? "text-red-600" : iconColor
              )} />
            </div>
            {getOperationTitle()}
          </DialogTitle>
          <DialogDescription>
            {getOperationDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress bar when processing */}
          {(isProcessing || isCompleted) && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{completedItems}/{totalItems}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Items list */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {processingItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-colors",
                  item.status === 'success' && "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800",
                  item.status === 'error' && "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800",
                  item.status === 'processing' && "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800",
                  item.status === 'cancelled' && "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800"
                )}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <p className={cn("font-medium text-sm", getStatusColor(item.status))}>
                      {item.name}
                    </p>
                    {item.error && (
                      <p className="text-xs text-red-600 mt-1">{item.error}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={getStatusBadgeVariant(item.status)} 
                    className={cn(
                      "text-xs",
                      item.status === 'success' && "border-green-300 text-green-700",
                      item.status === 'error' && "border-red-300 text-red-700",
                      item.status === 'processing' && "border-blue-300 text-blue-700",
                      item.status === 'cancelled' && "border-orange-300 text-orange-700"
                    )}
                  >
                    {getStatusText(item.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Summary when completed */}
          {isCompleted && (
            <div className="p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2 text-sm">
                {errorCount === 0 ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-green-700 dark:text-green-400">
                      All items processed successfully
                    </span>
                  </>
                ) : successCount === 0 ? (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-red-700 dark:text-red-400">
                      No items were processed successfully
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-orange-700 dark:text-orange-400">
                      {successCount} successful, {errorCount} failed
                      {cancelledCount > 0 && `, ${cancelledCount} cancelled`}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          {!isProcessing && !isCompleted && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                variant={destructive ? "destructive" : "default"} 
                onClick={handleConfirm}
              >
                {confirmButtonText}
              </Button>
            </>
          )}
          {isProcessing && (
            <Button disabled>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </Button>
          )}
          {isCompleted && (
            <Button onClick={handleClose}>
              {errorCount === 0 ? 'Done' : 'Close'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Convenience component for delete operations
export function DeleteProgressDialog({
  open,
  onOpenChange,
  items,
  onConfirm,
  itemType = "items"
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: OperationItem[];
  onConfirm: (itemIds: string[]) => Promise<{ success: string[]; failed: string[] }>;
  itemType?: string;
}) {
  return (
    <ProgressDialog
      open={open}
      onOpenChange={onOpenChange}
      items={items}
      onConfirm={onConfirm}
      title={`Delete ${itemType}`}
      description={`You are about to delete ${items.length} ${itemType}${items.length > 1 ? 's' : ''}. This action cannot be undone.`}
      confirmButtonText={`Delete ${items.length} ${itemType}${items.length > 1 ? 's' : ''}`}
      destructive={true}
      icon={XCircle}
      iconColor="text-red-600"
      iconBgColor="bg-red-100 dark:bg-red-900/20"
    />
  );
}

// Convenience component for sync operations
export function SyncProgressDialog({
  open,
  onOpenChange,
  items,
  onConfirm,
  title = "Sync Items"
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: OperationItem[];
  onConfirm: (itemIds: string[]) => Promise<{ success: string[]; failed: string[] }>;
  title?: string;
}) {
  return (
    <ProgressDialog
      open={open}
      onOpenChange={onOpenChange}
      items={items}
      onConfirm={onConfirm}
      title={title}
      description={`Synchronizing ${items.length} item${items.length > 1 ? 's' : ''}. This may take a moment.`}
      confirmButtonText={`Sync ${items.length} Item${items.length > 1 ? 's' : ''}`}
      destructive={false}
      icon={Loader2}
      iconColor="text-blue-600"
      iconBgColor="bg-blue-100 dark:bg-blue-900/20"
    />
  );
}