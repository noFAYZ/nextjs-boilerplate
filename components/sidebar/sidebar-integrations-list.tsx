'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle, Loader2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserIntegrations } from '@/lib/queries/integrations-queries';
import { IntuitLogo, PayPalLogo, StripeLogo, XeroLogo } from '../icons/icons';
import type { IntegrationStatus } from '@/lib/types/integrations';

interface SidebarIntegrationsListProps {
  onMobileClose: () => void;
}

const providerLogos = {
  stripe: StripeLogo,
  paypal: PayPalLogo,
  quickbooks: IntuitLogo,
  xero: XeroLogo,
};

const statusIcons: Record<IntegrationStatus, React.ReactNode> = {
  CONNECTED: <CheckCircle2 className="w-3 h-3 text-emerald-500" />,
  DISCONNECTED: <XCircle className="w-3 h-3 text-muted-foreground" />,
  ERROR: <AlertCircle className="w-3 h-3 text-red-500" />,
  PENDING_AUTH: <AlertCircle className="w-3 h-3 text-amber-500" />,
  TOKEN_EXPIRED: <AlertCircle className="w-3 h-3 text-red-500" />,
  REAUTH_REQUIRED: <AlertCircle className="w-3 h-3 text-amber-500" />,
};

export function SidebarIntegrationsList({ onMobileClose }: SidebarIntegrationsListProps) {
  const router = useRouter();
  const { data: integrations, isLoading } = useUserIntegrations();

  const handleIntegrationClick = (provider: string) => {
    router.push(`/dashboard/integrations/${provider.toLowerCase()}`);
    onMobileClose();
  };

  const handleAddClick = () => {
    router.push('/dashboard/accounts/integrations');
    onMobileClose();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const connectedIntegrations = integrations?.filter(i => i.status === 'CONNECTED') || [];

  return (
    <div className="space-y-2">
      {connectedIntegrations.length > 0 ? (
        <>
          {connectedIntegrations.map((integration) => {
            const LogoComponent = providerLogos[integration.provider.toLowerCase() as keyof typeof providerLogos];

            return (
              <button
                key={integration.id}
                onClick={() => handleIntegrationClick(integration.provider)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent transition-colors text-left group cursor-pointer"
              >
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  {LogoComponent ? (
                    <LogoComponent className="w-8 h-8" />
                  ) : (
                    <div className="w-5 h-5 rounded bg-muted flex items-center justify-center text-xs font-medium">
                      {integration.provider.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold truncate capitalize">
                      {integration.provider}
                    </span>
                    {statusIcons[integration.status]}
                  </div>
                  {integration.lastSyncAt && (
                    <span className="text-xs text-muted-foreground">
                      Last synced: {new Date(integration.lastSyncAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </>
      ) : (
        <div className="py-8 text-center space-y-3">
          <div className="text-sm text-muted-foreground">No integrations connected</div>
        </div>
      )}

<div className='flex justify-center'>
  <Button
        variant="default"
        size="xs"
        onClick={handleAddClick}
        className=" justify-center gap-1 mt-2"
      >
        <Plus className="w-4 h-4" />
        Add Integration
      </Button>
</div>
      
    </div>
  );
}
