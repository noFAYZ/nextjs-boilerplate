'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGlobalUIStore } from '@/lib/stores/ui-stores';
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
  href: string;
}

const ADD_MENU_ITEMS: AddMenuItem[] = [
  {
    id: 'account',
    label: 'Add Account',
    description: 'Connect a bank or financial account',
    icon: <DuoIconsBank className="h-6 w-6" />,
    href: '/dashboard/accounts/connect',
  },
  {
    id: 'subscription',
    label: 'Add Subscription',
    description: 'Track recurring subscriptions',
    icon: <SolarCalendarBoldDuotone className="h-6 w-6" />,
    href: '/dashboard/subscriptions/add',
  },
  {
    id: 'goal',
    label: 'Add Goal',
    description: 'Create a new financial goal',
    icon: <MageGoals className="h-6 w-6" />,
    href: '/dashboard/goals/new',
  },
  {
    id: 'crypto',
    label: 'Add Crypto',
    description: 'Connect a crypto wallet',
    icon: <SolarWalletBoldDuotone className="h-6 w-6" />,
    href: '/dashboard/crypto/wallets/add',
  },
];

export function AddMenuDialog() {
  const isOpen = useGlobalUIStore((state) => state.isAddMenuOpen);
  const closeAddMenu = useGlobalUIStore((state) => state.closeAddMenu);
  const router = useRouter();

  const handleMenuItemClick = (href: string) => {
    closeAddMenu();
    router.push(href);
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeAddMenu}>
      <DialogContent showCloseButton className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Choose what you'd like to add to your MoneyMappr account
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {ADD_MENU_ITEMS.map((item) => (
            <Button
              key={item.id}
              variant="outline"
              className="h-auto flex items-start justify-start gap-3 p-4 text-left hover:bg-accent"
              onClick={() => handleMenuItemClick(item.href)}
            >
              <div className="text-muted-foreground flex-shrink-0 mt-0.5">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
