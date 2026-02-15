'use client';

/**
 * Transaction Date Separator
 *
 * Displays a date header row that groups transactions by date
 */

import { TableCell, TableRow } from '@/components/ui/table';
import { SolarCalendarBoldDuotone } from '@/components/icons/icons';

interface TransactionDateSeparatorProps {
  date: string;
  hideAccountColumn?: boolean;
}

export function TransactionDateSeparator({
  date,
  hideAccountColumn = false,
}: TransactionDateSeparatorProps) {
  // colSpan = checkbox(1) + merchant(1) + category(1) + account(1) + pending(1) + amount(1) + actions(1) = 7
  // When hideAccountColumn = true, we skip account column, so = 6
  const colSpan = hideAccountColumn ? 6 : 7;

  return (
    <TableRow className="  shadow-none  ">
      <TableCell colSpan={colSpan} className="bg-secondary items-center">
        <p className="text-[11px] font-semibold flex gap-1 tracking-wider text-muted-foreground">
          <SolarCalendarBoldDuotone className="w-3.5 h-3.5" />
          {date}
        </p>
      </TableCell>
    </TableRow>
  );
}
