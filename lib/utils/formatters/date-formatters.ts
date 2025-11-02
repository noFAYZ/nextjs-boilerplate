/**
 * Date Formatting Utilities
 * Centralized date and time formatting
 */

import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';

/**
 * Format date with default pattern
 */
export function formatDate(
  date: string | Date,
  pattern: string = 'MMM d, yyyy'
): string {
  return format(new Date(date), pattern);
}

/**
 * Format time with default pattern
 */
export function formatTime(
  date: string | Date,
  use24Hour: boolean = false
): string {
  const pattern = use24Hour ? 'HH:mm' : 'h:mm a';
  return format(new Date(date), pattern);
}

/**
 * Format date and time together
 */
export function formatDateTime(
  date: string | Date,
  use24Hour: boolean = false
): string {
  const datePattern = 'MMM d, yyyy';
  const timePattern = use24Hour ? 'HH:mm' : 'h:mm a';
  return format(new Date(date), `${datePattern} ${timePattern}`);
}

/**
 * Format date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Format date with smart relative formatting
 * - Today: "Today at 3:30 PM"
 * - Yesterday: "Yesterday at 3:30 PM"
 * - This week: "Monday at 3:30 PM"
 * - This month: "Jan 15 at 3:30 PM"
 * - Older: "Jan 15, 2024"
 */
export function formatSmartDate(
  date: string | Date,
  use24Hour: boolean = false
): string {
  const d = new Date(date);
  const timePattern = use24Hour ? 'HH:mm' : 'h:mm a';

  if (isToday(d)) {
    return `Today at ${format(d, timePattern)}`;
  }

  if (isYesterday(d)) {
    return `Yesterday at ${format(d, timePattern)}`;
  }

  if (isThisWeek(d)) {
    return `${format(d, 'EEEE')} at ${format(d, timePattern)}`;
  }

  if (isThisMonth(d)) {
    return `${format(d, 'MMM d')} at ${format(d, timePattern)}`;
  }

  return format(d, 'MMM d, yyyy');
}

/**
 * Get time range label
 */
export function getTimeRangeLabel(range: string): string {
  const labels: Record<string, string> = {
    '24h': 'Last 24 Hours',
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days',
    '1y': 'Last Year',
    'all': 'All Time',
    '7_days': 'Last 7 Days',
    '30_days': 'Last 30 Days',
    'this_month': 'This Month',
    'last_month': 'Last Month',
  };
  return labels[range] || range;
}

/**
 * Check if date is stale (older than specified hours)
 */
export function isStaleDate(date: string | Date, staleHours: number = 24): boolean {
  const d = new Date(date);
  const now = new Date();
  const diffHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);
  return diffHours > staleHours;
}
