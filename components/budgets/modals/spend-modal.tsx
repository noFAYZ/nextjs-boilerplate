import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function SpendModal({
  envelope,
  onClose,
  onSubmit,
  isLoading,
}: {
  envelope: any;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  isLoading: boolean;
}) {
  const [amount, setAmount] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Record Spending</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Category</p>
            <p className="font-semibold">{envelope.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Amount</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="mt-1"
              step="0.01"
              autoFocus
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={() => onSubmit(parseFloat(amount))}
              disabled={isLoading || !amount}
            >
              {isLoading ? 'Recording...' : 'Record'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
