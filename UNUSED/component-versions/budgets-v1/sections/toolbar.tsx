import { Button } from '@/components/ui/button';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function BudgetsToolbar({
  selectedMonth,
  onMonthChange,
  totalBalance,
  showBalances,
  onAssignClick,
}: {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
  totalBalance: number;
  showBalances: boolean;
  onAssignClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const handlePrevMonth = () => {
    const prev = new Date(selectedMonth);
    prev.setMonth(prev.getMonth() - 1);
    onMonthChange(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(selectedMonth);
    next.setMonth(next.getMonth() + 1);
    onMonthChange(next);
  };

  const handleToday = () => {
    onMonthChange(new Date());
  };

  // Format month for display
  const monthValue = selectedMonth.toISOString().substring(0, 7);
  const monthDisplay = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(selectedMonth);

  return (
    <div className="flex items-center justify-between px-1 py-2">
      {/* Month Selector */}
      <div className="flex items-center gap-0">
        <Button
          variant="outline"
          size="xs"
          className='border-r-0'
          onClick={handlePrevMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Select
          value={monthValue}
          onValueChange={(value) => {
            const [year, month] = value.split('-');
            onMonthChange(new Date(parseInt(year), parseInt(month) - 1));
          }}
        >
          <SelectTrigger size='xs'>
            <SelectValue placeholder={monthDisplay}>{monthDisplay}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => {
              const date = new Date(new Date().getFullYear(), new Date().getMonth() - (11 - i));
              const dateStr = date.toISOString().substring(0, 7);
              const displayStr = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
              return (
                <SelectItem key={dateStr} value={dateStr}>
                  {displayStr}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="xs"
            className='border-l-0'
          onClick={handleNextMonth}
        >
          <ChevronRight className="h-4 w-4 " />
        </Button>

        <Button
          variant="secondary"
          size="xs"
          onClick={handleToday}
          className="text-xs ml-2"
        >
          Today
        </Button>

        
      </div>

      {/* Ready to Assign Button */}
      {totalBalance > 0 && (
        <Button
          className="gap-2 "
          onClick={onAssignClick}
          variant='successbrand'
          size='sm'
        >
          Ready to Assign
          <span  >
            {showBalances ? (
              <CurrencyDisplay amountUSD={totalBalance} variant="small" />
            ) : (
              '••••'
            )}
          </span>
        </Button>
      )}
    </div>
  );
}
