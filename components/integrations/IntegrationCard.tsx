'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  ProviderConfig,
  Integration,
  IntegrationStatus,
} from '@/lib/types/integrations';
import { formatDistanceToNow } from 'date-fns';
import { IntuitLogo, PayPalLogo, StripeLogo, TablerPlugConnected, XeroLogo } from '../icons/icons';

interface IntegrationCardProps {
  provider: ProviderConfig;
  integration?: Integration;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onSync?: () => void;
  onSettings?: () => void;
  isConnecting?: boolean;
  isSyncing?: boolean;
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
    label: 'Token Expired',
    variant: 'error',
    icon: <AlertCircle className="w-3 h-3" />,
  },
  REAUTH_REQUIRED: {
    label: 'Reauth Required',
    variant: 'warning',
    icon: <AlertCircle className="w-3 h-3" />,
  },
};


const providerLogos = {
  stripe: StripeLogo,
  paypal: PayPalLogo,
  quickbooks: IntuitLogo,
  xero: XeroLogo,
  shopify: '/logos/shopify.png',
  square: '/logos/square.png',
  'google-ads': '/logos/google-ads.png',
  'facebook-ads': '/logos/facebook-ads.png',
  salesforce: '/logos/salesforce.png',
  hubspot: '/logos/hubspot.png',
  netsuite: '/logos/netsuite.png',
  'microsoft-dynamics': '/logos/microsoft-dynamics.png',
  'amazon-seller-central': '/logos/amazon-seller-central.png',
}

const categoryColors: Record<string, string> = {
  accounting: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  payments: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  banking: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  ecommerce: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
};

export function IntegrationCard({
  provider,
  integration,
  onConnect,
  onDisconnect,
  onSync,
  onSettings,
  isConnecting,
  isSyncing,
}: IntegrationCardProps) {
  const router = useRouter();
  const isConnected = integration?.status === 'CONNECTED';
  const status = integration?.status;
  const statusInfo = status ? statusConfig[status] : null;

  const handleCardClick = () => {
    router.push(`/dashboard/integrations/${provider.provider.toLowerCase()}`);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      className={cn('relative  bg-background border border-border dark:bg-muted/30  p-4 rounded-2xl space-y-2 justify-between overflow-hidden transition-all hover:shadow-md cursor-pointer', isConnected && 'border-primary/20', isSyncing && 'border-blue-500/30')}
      onClick={handleCardClick}
    >
      {/* Status indicator stripe */}
      {isConnected && !isSyncing && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50" />}
      {isSyncing && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-400 animate-pulse" />}

        <div className="flex items-start justify-between gap-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Provider Logo/Icon */}
            <div
              className={cn(
                'w-12 h-12  flex items-center justify-center shrink-0 ')}
            >
              {provider.provider ? (
               providerLogos[(provider.provider).toLowerCase() as keyof typeof providerLogos] ? (
                typeof providerLogos[(provider.provider).toLowerCase() as keyof typeof providerLogos] === 'string' ? (
                  <img
                    src={providerLogos[(provider.provider).toLowerCase() as keyof typeof providerLogos] as string}
                    alt={`${provider.name} logo`}
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  React.createElement(providerLogos[(provider.provider).toLowerCase() as keyof typeof providerLogos] as React.ComponentType<React.SVGProps<SVGSVGElement>>, { className: 'w-6 h-6' })
                )
               ) : (
                <div className="text-sm font-medium">{provider.name.charAt(0)}</div>
               )
              ) : (
                <LinkIcon className="w-6 h-6" />
              )}
            </div>

            {/* Provider Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-base truncate">{provider.name}</CardTitle>
                {statusInfo && (
                  <Badge variant={statusInfo.variant} size="sm" className="shrink-0">
                    {statusInfo.icon}
                    {statusInfo.label}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs line-clamp-2">{provider.description}</CardDescription>
            </div>
          </div>

          {/* Actions Menu (for connected integrations) */}
          {isConnected && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="shrink-0">
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
    
        {/* Connection Info (if connected) */}
        {integration && isConnected && (
          <div className="space-y-2 text-xs">
            {integration.lastSyncAt && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last synced:</span>
                <div className="flex items-center gap-1 text-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {isSyncing ? 'Syncing now...' : formatDistanceToNow(new Date(integration.lastSyncAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            )}

            {integration.syncFrequency && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sync frequency:</span>
                <Badge variant="outline" size="sm">
                  {integration.syncFrequency.toLowerCase().replace('_', ' ')}
                </Badge>
              </div>
            )}

            {integration.autoSync && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Auto-sync:</span>
                <Badge variant="success" size="sm">
                  Enabled
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Features */}
        {!integration && !isConnected && provider.features && provider.features.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Features:</p>
            <div className="flex flex-wrap gap-1">
              {provider.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="soft" size="sm" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {provider.features.length > 3 && (
                <Badge variant="soft" size="sm" className="text-xs">
                  +{provider.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
     
     <div className='w-full flex justify-end' onClick={(e) => e.stopPropagation()}>    {isConnected ? (
          <div className="flex gap-2 ">
            {onSync && (
              <Button onClick={(e) => { e.stopPropagation(); onSync(); }} disabled={isSyncing} variant="outline" size="xs" className="flex-1">
                <RefreshCw className={cn('w-4 h-4 mr-1', isSyncing && 'animate-spin')} />
                {isSyncing ? 'Syncing...' : 'Sync'}
              </Button>
            )}
          </div>
        ) : (
          <Button onClick={(e) => { e.stopPropagation(); onConnect?.(); }} disabled={isConnecting} className=" justify-end" size="xs">
            <TablerPlugConnected className="w-4 h-4 mr-1" />
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
        )}</div>
    
   </Card> );
}
