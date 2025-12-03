import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { toast } from 'sonner';

export function AssignAmountPopover({
  onClose,
  triggerElement,
  totalBalance,
  groups,
  onAssign,
}: {
  onClose: () => void;
  triggerElement?: HTMLElement | null;
  totalBalance: number;
  groups: any[];
  onAssign: (groupId: string, amount: number) => Promise<void>;
}) {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const [isAssigning, setIsAssigning] = useState(false);

  React.useEffect(() => {
    if (triggerElement) {
      const rect = triggerElement.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
  }, [triggerElement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || !amount || parseFloat(amount) <= 0) {
      toast.error('Please select a group and enter an amount');
      return;
    }

    const numAmount = parseFloat(amount);
    if (numAmount > totalBalance) {
      toast.error(`Amount cannot exceed available balance (${totalBalance})`);
      return;
    }

    setIsAssigning(true);
    try {
      await onAssign(selectedGroup, numAmount);
      setSelectedGroup('');
      setAmount('');
    } catch (error) {
      toast.error('Failed to assign amount');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <>
      {/* Click outside to close */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      {/* Popover */}
      <div
        className="fixed z-50 bg-card border border-border/40 rounded-lg shadow-lg p-4 space-y-4 w-72"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h3 className="font-semibold text-sm">Assign to Categories</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Available: <CurrencyDisplay amountUSD={totalBalance} variant="compact" />
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Group Selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Group</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              disabled={isAssigning}
              className="w-full px-2 py-1.5 text-sm border border-border/40 rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="">Select a group...</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Amount</label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isAssigning}
              step="0.01"
              min="0"
              max={totalBalance}
              className="h-8 text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-2 border-t">
            <Button
              variant="outline"
              size="xs"
              onClick={onClose}
              disabled={isAssigning}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="xs"
              disabled={isAssigning || !selectedGroup || !amount}
            >
              {isAssigning ? 'Assigning...' : 'Assign'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
