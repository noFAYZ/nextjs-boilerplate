'use client';

import React from 'react';
import {
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Upload,
  ChevronRight,
  Loader2,
  Plus,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SolarLockKeyholeBoldDuotone } from '../../icons/icons';
import { getLogoUrl } from '@/lib/services/logo-service';
import { POPULAR_CONNECTIONS } from './constants';

interface InitialViewProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  plaidError: string | null;
  plaidLinkError: string | null;
  plaidReady: boolean;
  plaidLoading: boolean;
  openPlaidLink: () => void;
  handleManualAccountClick: () => void;
}

export function InitialView({
  searchQuery,
  setSearchQuery,
  plaidError,
  plaidLinkError,
  plaidReady,
  plaidLoading,
  openPlaidLink,
  handleManualAccountClick,
}: InitialViewProps) {
  return (
    <>
      <DialogHeader className="pb-3">
        <DialogTitle className="text-lg font-semibold">Add an Account</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {/* ERROR MESSAGE */}
        {(plaidError || plaidLinkError) && (
          <div className="flex gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-300">{plaidError || plaidLinkError}</p>
          </div>
        )}

        {/* SEARCH BAR */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60 z-10" />
          <Input
            placeholder="Search banks, brokerages, cards..."
            className="pl-9 h-10"
            variant='outline'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* POPULAR CONNECTIONS */}
        {searchQuery === '' && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground px-1">Popular Connections</p>
            <div className="grid grid-cols-2 gap-2">
              {POPULAR_CONNECTIONS.map((connection) => (
                <button
                  key={connection.name}
                  onClick={openPlaidLink}
                  disabled={!plaidReady || plaidLoading}
                  className={cn(
                    'flex items-center gap-2 p-2 rounded-lg shadow-sm border border-border/80',
                    'bg-card hover:bg-card/80 transition-colors duration-100 cursor-pointer text-left text-sm hover:translate-y-[-1px]',
                    (!plaidReady || plaidLoading) && 'opacity-50 cursor-not-allowed'
                  )}
                >
                 
                    {plaidLoading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-foreground/50" />
                    ) : (
                      <Avatar className="flex  h-8 w-8 bg-muted rounded-full items-center justify-center shadow-md group-hover:shadow-lg">
                        <AvatarImage
                          src={getLogoUrl(connection.logo)}
                          alt={connection.name}
                          className="h-full w-full object-fill rounded-full"
                        />
                        <AvatarFallback className="bg-muted text-primary font-semibold">
                          {connection.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                 
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground text-xs truncate">{connection.name}</div>
                    <div className="text-xs text-muted-foreground">{connection.category}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SEARCH RESULTS */}
        {searchQuery !== '' && (
          <div className="space-y-2">
            {POPULAR_CONNECTIONS.filter(
              (conn) =>
                conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                conn.category.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((connection) => (
              <button
                key={connection.name}
                onClick={openPlaidLink}
                disabled={!plaidReady || plaidLoading}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-lg border border-border/80',
                  'bg-card hover:bg-muted/40 transition-colors duration-100 cursor-pointer text-left',
                  (!plaidReady || plaidLoading) && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className="flex h-10 w-10 shadow border items-center justify-center bg-muted rounded-lg flex-shrink-0">
                  {plaidLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-foreground/50" />
                  ) : (
                    <Avatar className="flex  bg-muted  rounded-full items-center justify-center shadow-md group-hover:shadow-lg">
                      <AvatarImage
                        src={getLogoUrl(connection.logo)}
                        alt={connection.name}
                        className="h-full w-full object-fill rounded-full"
                      />
                      <AvatarFallback className="bg-muted text-primary font-semibold">
                        {connection.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-foreground">{connection.name}</div>
                  <div className="text-xs text-muted-foreground">{connection.category}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/70 flex-shrink-0 ml-2" />
              </button>
            ))}
            {POPULAR_CONNECTIONS.filter(
              (conn) =>
                conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                conn.category.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">No connections found</p>
            )}
          </div>
        )}

        <Separator />

        {/* IMPORT OPTION */}
        <button
          onClick={() => {}}
          className={cn(
            'w-full flex items-center gap-3 p-3 shadow-sm rounded-lg border border-border/80 group',
            'bg-card hover:bg-card/20 transition-colors duration-100 cursor-pointer text-left'
          )}
        >
          <div className="flex h-10 w-10 shadow border items-center justify-center bg-muted text-foreground/50 rounded-full ">
            <Upload className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm text-foreground">Import from File</h3>
            <p className="text-xs text-muted-foreground">Bulk import accounts from CSV or Excel</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground/70 flex-shrink-0" />
        </button>

        {/* ADD MANUAL ACCOUNT OPTION */}
        <div className="flex justify-center">
          <Button
            onClick={handleManualAccountClick}
            variant='outline2'
            className='bg-card hover:bg-card/80 '
            icon={<div className="flex h-6 w-6 shadow-xs border items-center justify-center bg-muted text-foreground/50 rounded-full ">
              <Plus className="h-4 w-4" />
            </div>}
          >
            <h3 className="ml-1 font-medium ">Add Manually</h3>
          </Button>
        </div>

        {/* SECURITY NOTE */}
        <div className="flex gap-2 p-2 rounded-lg bg-blue-100 dark:bg-blue-400/20 ">
          <SolarLockKeyholeBoldDuotone className="h-4 w-4 text-blue-800  flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 dark:text-blue-300 tracking-tight">
            Your information is secure. We use Plaid to securely connect your accounts.
          </p>
        </div>
      </div>
    </>
  );
}
