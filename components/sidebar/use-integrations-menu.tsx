'use client';

import { useMemo } from 'react';
import { Plug, Store } from 'lucide-react';
import { useUserIntegrations } from '@/lib/queries/integrations-queries';
import type { MenuItem } from './types';

export function useIntegrationsMenu(): MenuItem['submenu'] {
  const { data: integrations } = useUserIntegrations();

  return useMemo(() => {
    const baseMenu = [
      {
        id: 'all-integrations',
        label: 'All Integrations',
        href: '/dashboard/integrations',
        icon: Plug,
        description: 'Manage all integrations'
      }
    ];

    // Add connected integrations to submenu
    const connectedIntegrations = integrations
      ?.filter(i => i.status === 'CONNECTED')
      .map(integration => ({
        id: integration.provider.toLowerCase(),
        label: integration.provider.charAt(0).toUpperCase() + integration.provider.slice(1).toLowerCase(),
        href: `/dashboard/integrations/${integration.provider.toLowerCase()}`,
        icon: Store,
        description: `Manage ${integration.provider} integration`
      })) || [];

    return [...baseMenu, ...connectedIntegrations];
  }, [integrations]);
}
