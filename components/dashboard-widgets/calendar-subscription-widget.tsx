'use client';

import { useMemo, useState } from 'react';
import { ArrowLeftIcon, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useSubscriptions } from '@/lib/queries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getLogoUrl } from '@/lib/services/logo-service';
import { cn } from '@/lib/utils';
import type { UserSubscription } from '@/lib/types/subscription';
import Link from 'next/link';
import { MageCalendar2, SolarCalendarBoldDuotone } from '@/components/icons/icons';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { CardSkeleton } from '../ui/card-skeleton';

// Helper to get days in a month
function getDaysInMonth(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days: Date[] = [];

  // Add previous month's days to fill the first week
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, -i);
    days.push(prevDate);
  }

  // Add current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  // Add next month's days to fill the last week
  const remainingDays = 7 - (days.length % 7);
  if (remainingDays < 7) {
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
  }

  return days;
}

// Stacked Avatar Group Component
function StackedSubscriptionAvatars({
  subscriptions,
  maxVisible = 2,
}: {
  subscriptions: UserSubscription[];
  maxVisible?: number;
}) {
  const visibleSubs = subscriptions.slice(0, maxVisible);
  const remaining = subscriptions.length - maxVisible;

  return (
    <div className=":data-[slot=avatar]:ring-background flex -space-x-5 *:data-[slot=avatar]:ring-2 ">
      {visibleSubs.map((sub, index) => (
        <Avatar
          key={sub.id}
          className="h-9 w-9 rounded-full shadow-sm ring-1 ring-muted dark:ring-white/10 transition-transform group-hover:scale-102"
          style={{ zIndex: maxVisible - index }}
        >
          {sub.websiteUrl ? (
            <AvatarImage
              src={getLogoUrl(sub.websiteUrl) || ''}
              alt={sub.name}
              className="object-contain bg-background rounded-full"
            />
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-muted to-primary/5 text-[8px] font-bold text-primary">
              {sub.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
      ))}
      {remaining > 0 && (
        <div className="h-9 w-9 rounded-full border-[2px] border-border bg-gradient-to-br from-muted to-accent flex items-center justify-center shadow-sm  transition-transform group-hover:scale-102">
          <span className="text-[10px] font-bold text-foreground/70">
            +{remaining}
          </span>
        </div>
      )}
    </div>
  );
}

// Date Detail Modal
function DateDetailModal({
  date,
  subscriptions,
  isOpen,
  onClose,
}: {
  date: Date | null;
  subscriptions: UserSubscription[];
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!date) return null;

  const totalAmount = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const dateString = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0">
        {/* Modern Header with Gradient */}
        <div className="relative px-4 pt-4 bg-card border-b border-border/80">
          <DialogHeader>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ">
                <SolarCalendarBoldDuotone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-base font-semibold text-foreground">
                  {dateString}
                </DialogTitle>
              </div>
            </div>

            {/* Stats Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-sm border-border/50">
                <Sparkles className="h-3 w-3 mr-1" />
                {subscriptions.length} subscription{subscriptions.length !== 1 ? 's' : ''}
              </Badge>
              <div className="h-1 w-1 rounded-full bg-border" />
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border/50">
                <span className="text-[10px] text-muted-foreground font-medium">Total:</span>
                <CurrencyDisplay
                  amountUSD={totalAmount}
                  variant="compact"
                  className="text-sm font-bold text-foreground"
                />
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Subscription List with Custom Scrollbar */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {subscriptions.map((subscription, index) => (
            <Link
              key={subscription.id}
              href={`/subscriptions/${subscription.id}`}
              onClick={onClose}
            >
              <Card
                className="group relative flex-row items-center gap-3 mb-2  "
                style={{
                  animation: `fadeInUp 0.2s ease-out ${index * 0.05}s both`
                }}
                interactive
              >
             

                <Avatar className="h-10 w-10 rounded-full shadow-sm ring-1 ring-border/50 group-hover:ring-primary/20 transition-all relative z-10">
                  {subscription.websiteUrl ? (
                    <AvatarImage
                      src={getLogoUrl(subscription.websiteUrl) || ''}
                      alt={subscription.name}
                      className="object-contain bg-background rounded-full "
                    />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-xs font-bold text-primary rounded-xl">
                      {subscription.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex-1 min-w-0 relative z-10">
                  <h4 className="font-semibold text-sm truncate text-foreground group-hover:text-primary transition-colors">
                    {subscription.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-xs text-muted-foreground">
                      {subscription.billingCycle === 'MONTHLY'
                        ? 'Monthly'
                        : subscription.billingCycle === 'YEARLY'
                        ? 'Yearly'
                        : subscription.billingCycle}
                    </p>
                    {subscription.autoRenew && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          Auto-renew
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <CurrencyDisplay
                  amountUSD={subscription.amount}
          
                  className="text-foreground relative z-10"
                />
              </Card>
            </Link>
          ))}
        </div>

        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}

export function CalendarSubscriptionWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isRefetching } = useOrganizationRefetchState();

  const { data: subscriptionsResponse, isLoading } = useSubscriptions({
    sortBy: 'nextBillingDate',
    sortOrder: 'asc',
  });

  // Group subscriptions by date
  const subscriptionsByDate = useMemo(() => {
    if (!subscriptionsResponse) return new Map<string, UserSubscription[]>();

    const map = new Map<string, UserSubscription[]>();
    
    // Extract the data array from the response object - handle both formats
    let subscriptions: UserSubscription[] = [];
    if (Array.isArray(subscriptionsResponse)) {
      subscriptions = subscriptionsResponse;
    } else if (subscriptionsResponse.data && Array.isArray(subscriptionsResponse.data)) {
      subscriptions = subscriptionsResponse.data;
    }

    console.log('[Calendar Widget] Processing subscriptions:', subscriptions.length);

    subscriptions.forEach((sub) => {
      if (sub.nextBillingDate && sub.status === 'ACTIVE') {
        const date = new Date(sub.nextBillingDate);
        const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }
        map.get(dateKey)!.push(sub);
      }
    });

    console.log('[Calendar Widget] Subscriptions by date:', map.size, 'dates');

    return map;
  }, [subscriptionsResponse]);

  const days = useMemo(
    () => getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()),
    [currentDate]
  );

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: Date, subs: UserSubscription[]) => {
    if (subs.length > 0) {
      setSelectedDate(date);
      setIsModalOpen(true);
    }
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getDateKey = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  const selectedDateSubs = selectedDate
    ? subscriptionsByDate.get(getDateKey(selectedDate)) || []
    : [];

  // Loading State
  if (isLoading) {
    return <CardSkeleton variant="chart" />;
  }

  return (
    <>
      <Card className="relative h-full w-full flex flex-col border border-border/50">
        {/* Modern Header */}
        <div className="flex items-center justify-between mb-2">
      
        
          <div className="flex items-center gap-2">
       
        
          <div className="h-6 w-6 rounded-xl bg-indigo-300  flex items-center justify-center">
            <MageCalendar2 className="h-5 w-5 text-indigo-900" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Subscriptions</h3>
  
       
            
         
         
        </div>

          {/* Navigation Controls */}
          <div className="flex items-center ">
            <Button
              onClick={goToPreviousMonth}
              className=" rounded-r-none border-r-0"
              aria-label="Previous month"
              variant='outline'
           
              size='icon-sm'
            >
             <ChevronLeft className="h-4 w-4 " />
            </Button>
            <Button
              onClick={goToToday}
              className=" h-8  rounded-none text-xs"
              variant='outline'
           size="sm"
            >
              Today
            </Button>
            <Button
              onClick={goToNextMonth}
              className=" rounded-l-none border-l-0"
              variant='outline'
              size='icon-sm'
        
            >
              <ChevronRight className="h-4 w-4 " />
            </Button>
          </div>
        </div>

        {/* Month/Year Display */}
        <div className="text-center mb-3  border-b border-border/30">
          <h4 className="text-lg font-semibold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {currentDate.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </h4>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-3  mx-auto">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 px-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center text-[11px] font-bold text-muted-foreground/70 uppercase tracking-wider py-2 bg-card rounded-full"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2 ">
            {days.map((date, index) => {
              const dateKey = getDateKey(date);
              const subscriptions = subscriptionsByDate.get(dateKey) || [];
              const hasSubscriptions = subscriptions.length > 0;
              const isCurrent = isCurrentMonth(date);
              const isTodayDate = isToday(date);

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date, subscriptions)}
                  disabled={!hasSubscriptions}
                  className={cn(
                    'group relative aspect-square rounded-xl md:rounded-3xl transition-all duration-75',
                    'flex flex-col items-center justify-center ',
                    'border-1',
                    isCurrent
                      ? 'border-0 dark:bg-muted bg-accent/70 backdrop-blur-sm'
                      : 'border-transparent bg-background',
                    isTodayDate &&
                      'ring-2 ring-primary/50 ring-offset-2 ring-offset-background ',
                    hasSubscriptions &&
                      isCurrent &&
                      ' hover:shadow-xs hover:shadow-primary/5 cursor-pointer hover:scale-102 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/5',
                    hasSubscriptions &&
                      !isCurrent &&
                      'hover:bg-muted/30 cursor-pointer hover:scale-102',
                    !hasSubscriptions && 'cursor-default opacity-60 hover:opacity-80'
                  )}
                >
                  {/* Background Gradient on Hover */}
                  {hasSubscriptions && isCurrent && (
                    <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-200" />
                  )}

                  {/* Date Number */}
                  <span
                    className={cn(
                      'text-sm font-semibold mb-0.5 relative z-10 transition-all',
                      isCurrent ? 'text-foreground' : 'text-transparent',
                      isTodayDate && 'text-primary font-bold text-sm',
                      hasSubscriptions && 'group-hover:text-primary'
                    )}
                  >
                    {date.getDate()}
                  </span>

                  {/* Subscription Avatars */}
                  {hasSubscriptions && isCurrent && (
                    <div className="relative z-10">
                      <StackedSubscriptionAvatars
                        subscriptions={subscriptions}
                        maxVisible={2}
                      />
                    </div>
                  )}

                  {/* Dot indicator for subscriptions on other month days */}
                  {hasSubscriptions && !isCurrent && (
                    <div className="flex gap-0.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary/50 animate-pulse" />
                    </div>
                  )}

                  {/* Subscription Count Badge */}
                  {hasSubscriptions && isCurrent && subscriptions.length > 0 && (
                    <div className="absolute top-0 right-0 h-4 min-w-[16px] px-1 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <span className="text-[10px] font-bold text-primary-foreground">
                        {subscriptions.length}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>


        <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
      </Card>

      {/* Date Detail Modal */}
      <DateDetailModal
        date={selectedDate}
        subscriptions={selectedDateSubs}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
