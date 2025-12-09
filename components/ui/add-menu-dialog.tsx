'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGlobalUIStore } from '@/lib/stores/ui-stores';
import { useBankingUIStore } from '@/lib/stores/ui-stores';
import { useSubscriptionUIStore } from '@/lib/stores/ui-stores';
import { useCryptoUIStore } from '@/lib/stores/ui-stores';
import { useGoalsStore } from '@/lib/stores/ui-stores';
import {
  DuoIconsBank,
  MageGoals,
  SolarWalletBoldDuotone,
  SolarCalendarBoldDuotone,
} from '@/components/icons/icons';

interface AddMenuItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

export function AddMenuDialog() {
  const isOpen = useGlobalUIStore((state) => state.isAddMenuOpen);
  const closeAddMenu = useGlobalUIStore((state) => state.closeAddMenu);

  // Banking actions
  const openConnectAccountModal = useBankingUIStore(
    (state) => state.openConnectAccountModal
  );

  // Subscription actions
  const openCreateSubscriptionModal = useSubscriptionUIStore(
    (state) => state.openCreateModal
  );

  // Crypto actions
  const openCreateWalletModal = useCryptoUIStore(
    (state) => state.openCreateWalletModal
  );

  // Goals actions
  const setIsCreatingGoal = useGoalsStore(
    (state) => state.setIsCreatingGoal
  );

  const ADD_MENU_ITEMS: AddMenuItem[] = [
    {
      id: 'account',
      label: 'Add Account',
      description: 'Connect a bank or financial account',
      icon: <DuoIconsBank className="h-6 w-6" />,
      action: () => {
        closeAddMenu();
        openConnectAccountModal();
      },
    },
    {
      id: 'subscription',
      label: 'Add Subscription',
      description: 'Track recurring subscriptions',
      icon: <SolarCalendarBoldDuotone className="h-6 w-6" />,
      action: () => {
        closeAddMenu();
        openCreateSubscriptionModal();
      },
    },
    {
      id: 'goal',
      label: 'Add Goal',
      description: 'Create a new financial goal',
      icon: <MageGoals className="h-6 w-6" />,
      action: () => {
        closeAddMenu();
        setIsCreatingGoal(true);
      },
    },
    {
      id: 'crypto',
      label: 'Add Crypto',
      description: 'Connect a crypto wallet',
      icon: <SolarWalletBoldDuotone className="h-6 w-6" />,
      action: () => {
        closeAddMenu();
        openCreateWalletModal();
      },
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={closeAddMenu}>
      <DialogContent showCloseButton className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Add New Item</DialogTitle>
          <DialogDescription className="text-xs">
            Choose what you'd like to add to your MoneyMappr account
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-2">
          {ADD_MENU_ITEMS.map((item) => (
            <Button
              key={item.id}
              variant="outline2"
              className="h-auto flex items-center justify-start gap-4 p-3 text-left group hover:shadow-md transition-all duration-200"
              onClick={item.action}
            >
              <div className="text-orange-500 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[13px] leading-snug">{item.label}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <div className="text-muted-foreground group-hover:text-orange-500 transition-colors flex-shrink-0">
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
