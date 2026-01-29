'use client';

/**
 * Transaction Table Loading Skeleton
 *
 * Displays a loading skeleton with shimmer effect while transactions are loading
 */

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

interface TransactionTableSkeletonProps {
  hideAccountColumn?: boolean;
  rowCount?: number;
}

export function TransactionTableSkeleton({
  hideAccountColumn = false,
  rowCount = 4,
}: TransactionTableSkeletonProps) {
  const colSpan = hideAccountColumn ? 5 : 6;

  return (
    <div className="space-y-3">
      {/* Search/Filter Skeleton */}
      <div className="h-10 bg-muted animate-pulse rounded-lg" />

      {/* Table Skeleton */}
      <div className="rounded-xl overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableBody>
              {[...Array(rowCount)].map((_, i) => (
                <TableRow key={i} className="border-b border-border/30">
                  {/* Merchant Cell Skeleton */}
                  <TableCell className="px-2 sm:px-4 py-2 sm:py-3 w-[20%] overflow-hidden">
                    <div className="flex gap-3">
                      <div className="h-6 w-6 bg-muted rounded-full flex-shrink-0 animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  </TableCell>

                  {/* Category Cell Skeleton (hidden on mobile) */}
                  <TableCell className="hidden lg:table-cell px-2 sm:px-4 py-2 sm:py-3 w-[20%] overflow-hidden">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  </TableCell>

                  {/* Account Cell Skeleton (hidden if hideAccountColumn) */}
                  {!hideAccountColumn && (
                    <TableCell className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3 w-[10%] overflow-hidden">
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    </TableCell>
                  )}

                  {/* Amount Cell Skeleton */}
                  <TableCell className="px-2 sm:px-4 py-2 sm:py-3 w-[10%]">
                    <div className="h-4 w-16 bg-muted rounded ml-auto animate-pulse" />
                  </TableCell>

                  {/* Attachments Cell Skeleton */}
                  <TableCell className="px-2 sm:px-4 py-2 sm:py-3 w-[8%]">
                    <div className="h-4 w-12 bg-muted rounded mx-auto animate-pulse" />
                  </TableCell>

                  {/* Actions Cell Skeleton */}
                  <TableCell className="px-1 sm:px-4 py-2 sm:py-3 w-[5%]">
                    <div className="h-6 w-6 bg-muted rounded ml-auto animate-pulse" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
