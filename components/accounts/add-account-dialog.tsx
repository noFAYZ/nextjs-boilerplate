'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Building2,
  TrendingUp,
  Coins,
  Upload,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AccountCategory {
  id: string;
  title: string;
  subtitle: string;
  addedCount: number;
  icons: string[];
  iconColors: string[];
  path: string;
}

export function AddAccountDialog({ open, onOpenChange }: AddAccountDialogProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Account categories configuration
  const categories: AccountCategory[] = [
    {
      id: 'banks',
      title: 'Banks & credit cards',
      subtitle: 'Connect your bank accounts and credit cards',
      addedCount: 0, // This would come from your data in production
      icons: ['💳', '🏦', '💰'],
      iconColors: ['bg-blue-500', 'bg-indigo-500', 'bg-red-500'],
      path: '/accounts/connection?type=bank&integration=stripe',
    },
    {
      id: 'investments',
      title: 'Investments & loans',
      subtitle: 'Track investment accounts and loans',
      addedCount: 0,
      icons: ['📈', '💼', '🏛️'],
      iconColors: ['bg-green-500', 'bg-cyan-500', 'bg-purple-500'],
      path: '/accounts/connection?type=bank&integration=stripe',
    },
    {
      id: 'crypto',
      title: 'Real estate, crypto, and more',
      subtitle: 'Add crypto wallets, real estate, and other assets',
      addedCount: 0,
      icons: ['₿', '🏠'],
      iconColors: ['bg-violet-500', 'bg-orange-500'],
      path: '/accounts/wallet/add',
    },
    {
      id: 'import',
      title: 'Import transaction & balance history',
      subtitle: 'Import from CSV',
      addedCount: 0,
      icons: [],
      iconColors: [],
      path: '/accounts/connection?type=bank&integration=stripe',
    },
  ];

  const handleCategoryClick = (path: string) => {
    onOpenChange(false);
    router.push(path);
  };

  const handleManualAccount = () => {
    onOpenChange(false);
    router.push('/accounts/wallet/add');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 space-y-0">
        
            <DialogTitle className="text-xl font-semibold">
              Add an account
            </DialogTitle>
        
         
        </DialogHeader>

        {/* Search Bar */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
            <Input
              placeholder="Search 13,000 institutions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-muted/50 border-border"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="px-6 pb-6 space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.path)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-xl border shadow-xs border-border cursor-pointer",
                "hover:bg-muted/60 hover:border-border ",
                "group focus:outline-none focus:ring-0 "
              )}
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Left: Title and subtitle */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-sm text-foreground">
                      {category.title}
                    </h3>
                  </div>
                  {category.addedCount > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {category.addedCount} added
                    </p>
                  )}
                </div>

                {/* Right: Icons or special icon */}
                <div className="flex items-center gap-2">
                  {category.id === 'import' ? (
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  ) : (
                    <>
                      {/* Institution Icons */}
                      <div className="flex items-center -space-x-2">
                        {category.icons.map((icon, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "h-8 w-8 rounded-full flex items-center justify-center text-sm ring-2 ring-background",
                              category.iconColors[idx] || 'bg-muted'
                            )}
                          >
                            <span className="text-white">{icon}</span>
                          </div>
                        ))}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Manual Account Button */}
        <div className="px-6 pb-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleManualAccount}
          >
            Add manual account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
