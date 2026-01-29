'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Link as LinkIcon,
  RefreshCw,
  Settings,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreVertical,
  ExternalLink,
  Zap,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  ProviderConfig,
  Integration,
  IntegrationStatus,
} from '@/lib/types/integrations';
import { formatDistanceToNow } from 'date-fns';

interface IntegrationCardCompactProps {
  provider: ProviderConfig;
  integration?: Integration;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onSync?: () => void;
  onSettings?: () => void;
  isConnecting?: boolean;
  isSyncing?: boolean;
  variant?: 'default' | 'minimal';
}

const statusConfig: Record<
  IntegrationStatus,
  {
    label: string;
    variant: 'default' | 'success' | 'warning' | 'error' | 'muted';
    icon: React.ReactNode;
  }
> = {
  CONNECTED: {
    label: 'Connected',
    variant: 'success',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  DISCONNECTED: {
    label: 'Disconnected',
    variant: 'muted',
    icon: <XCircle className="w-3 h-3" />,
  },
  ERROR: {
    label: 'Error',
    variant: 'error',
    icon: <AlertCircle className="w-3 h-3" />,
  },
  PENDING_AUTH: {
    label: 'Pending',
    variant: 'warning',
    icon: <AlertCircle className="w-3 h-3" />,
  },
  TOKEN_EXPIRED: {
    label: 'Expired',
    variant: 'error',
    icon: <AlertCircle className="w-3 h-3" />,
  },
  REAUTH_REQUIRED: {
    label: 'Reauth',
    variant: 'warning',
    icon: <AlertCircle className="w-3 h-3" />,
  },
};

const categoryColors: Record<string, string> = {
  accounting: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
  payments: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30',
  banking: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
  ecommerce: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
};

export function IntegrationCardCompact({
  provider,
  integration,
  onConnect,
  onDisconnect,
  onSync,
  onSettings,
  isConnecting,
  isSyncing,
  variant = 'default',
}: IntegrationCardCompactProps) {
  const isConnected = integration?.status === 'CONNECTED';
  const status = integration?.status;
  const statusInfo = status ? statusConfig[status] : null;

  if (variant === 'minimal') {
    return (
      <div
        className={cn(
          'group relative overflow-hidden rounded-xl border bg-gradient-to-br transition-all hover:shadow-lg hover:scale-[1.02]',
          provider.category
            ? categoryColors[provider.category]
            : 'from-slate-500/10 to-slate-600/10 border-slate-500/20',
          isConnected && 'ring-2 ring-primary/20'
        )}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Logo */}
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border bg-background/50 backdrop-blur-sm'
                )}
              >
                {provider.logo ? (
                  <img src={provider.logo} alt={provider.name} className="w-6 h-6 object-contain" />
                ) : (
                  <LinkIcon className="w-5 h-5 text-muted-foreground" />
                )}
              </div>

              {/* Name & Status */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{provider.name}</h3>
                {statusInfo && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Badge variant={statusInfo.variant} size="sm" className="text-xs">
                      {statusInfo.icon}
                      {statusInfo.label}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {isConnected && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {onSync && (
                    <DropdownMenuItem onClick={onSync} disabled={isSyncing}>
                      <RefreshCw className={cn('w-3.5 h-3.5 mr-2', isSyncing && 'animate-spin')} />
                      Sync
                    </DropdownMenuItem>
                  )}
                  {onSettings && (
                    <DropdownMenuItem onClick={onSettings}>
                      <Settings className="w-3.5 h-3.5 mr-2" />
                      Settings
                    </DropdownMenuItem>
                  )}
                  {provider.documentation && (
                    <DropdownMenuItem asChild>
                      <a href={provider.documentation} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3.5 h-3.5 mr-2" />
                        Docs
                      </a>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {onDisconnect && (
                    <DropdownMenuItem onClick={onDisconnect} className="text-destructive focus:text-destructive">
                      <Trash2 className="w-3.5 h-3.5 mr-2" />
                      Disconnect
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Quick Info */}
          {integration && isConnected && integration.lastSyncAt && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
              <Clock className="w-3 h-3" />
              <span>Synced {formatDistanceToNow(new Date(integration.lastSyncAt), { addSuffix: true })}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="flex gap-2">
            {isConnected ? (
              onSync && (
                <Button onClick={onSync} disabled={isSyncing} variant="outline" size="sm" className="w-full h-8">
                  <RefreshCw className={cn('w-3.5 h-3.5 mr-1.5', isSyncing && 'animate-spin')} />
                  {isSyncing ? 'Syncing...' : 'Sync'}
                </Button>
              )
            ) : (
              <Button onClick={onConnect} disabled={isConnecting} className="w-full h-8" size="sm">
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                {isConnecting ? 'Connecting...' : 'Connect'}
              </Button>
            )}
          </div>
        </div>

        {/* Connected indicator */}
        {isConnected && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md hover:border-primary/30',
        isConnected && 'border-primary/20 shadow-sm'
      )}
    >
      {/* Status stripe */}
      {isConnected && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Logo */}
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-sm',
              provider.category
                ? categoryColors[provider.category]
                : 'from-slate-500/10 to-slate-600/10 border-slate-500/20'
            )}
          >
            {provider.logo ? (
              <img src={provider.logo} alt={provider.name} className="w-7 h-7 object-contain" />
            ) : (
              <LinkIcon className="w-6 h-6 text-muted-foreground" />
            )}
          </div>

          {/* Info & Actions */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1 truncate">{provider.name}</h3>
                {statusInfo && (
                  <Badge variant={statusInfo.variant} size="sm" className="mb-2">
                    {statusInfo.icon}
                    {statusInfo.label}
                  </Badge>
                )}
              </div>

              {isConnected && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="shrink-0 -mt-1 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    {onSync && (
                      <DropdownMenuItem onClick={onSync} disabled={isSyncing}>
                        <RefreshCw className={cn('w-4 h-4 mr-2', isSyncing && 'animate-spin')} />
                        Sync Now
                      </DropdownMenuItem>
                    )}
                    {onSettings && (
                      <DropdownMenuItem onClick={onSettings}>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                    )}
                    {provider.documentation && (
                      <DropdownMenuItem asChild>
                        <a href={provider.documentation} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Documentation
                        </a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {onDisconnect && (
                      <DropdownMenuItem onClick={onDisconnect} className="text-destructive focus:text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Disconnect
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{provider.description}</p>
          </div>
        </div>

        {/* Connection Info */}
        {integration && isConnected && (
          <div className="space-y-2 mb-3">
            {integration.lastSyncAt && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Last sync</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="font-medium">{formatDistanceToNow(new Date(integration.lastSyncAt), { addSuffix: true })}</span>
                </div>
              </div>
            )}

            {integration.autoSync && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Auto-sync</span>
                <Badge variant="success" size="sm">
                  <Zap className="w-3 h-3 mr-1" />
                  Enabled
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {isConnected ? (
            onSync && (
              <Button onClick={onSync} disabled={isSyncing} variant="outline" size="sm" className="flex-1">
                <RefreshCw className={cn('w-4 h-4 mr-2', isSyncing && 'animate-spin')} />
                {isSyncing ? 'Syncing...' : 'Sync'}
              </Button>
            )
          ) : (
            <Button onClick={onConnect} disabled={isConnecting} className="flex-1" size="sm">
              <LinkIcon className="w-4 h-4 mr-2" />
              {isConnecting ? 'Connecting...' : 'Connect'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
