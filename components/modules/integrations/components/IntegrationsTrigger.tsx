'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link as LinkIcon, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IntegrationsDialog } from './IntegrationsDialog';
import { useUserIntegrations } from '@/lib/queries/integrations-queries';

interface IntegrationsTriggerProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showBadge?: boolean;
  showConnectedCount?: boolean;
  className?: string;
  icon?: React.ReactNode;
  label?: string;
}

export function IntegrationsTrigger({
  variant = 'outline',
  size = 'sm',
  showBadge = false,
  showConnectedCount = true,
  className,
  icon,
  label = 'Integrations',
}: IntegrationsTriggerProps) {
  const { data: integrationsData } = useUserIntegrations();
  const integrations = integrationsData || [];

  const connectedCount = integrations.filter((i) => i.status === 'CONNECTED').length;
  const hasErrors = integrations.some((i) => i.status === 'ERROR' || i.status === 'TOKEN_EXPIRED');

  const renderIcon = () => {
    if (icon) return icon;
    if (connectedCount > 0) return <Zap className="w-4 h-4" />;
    return <LinkIcon className="w-4 h-4" />;
  };

  return (
    <IntegrationsDialog
      trigger={
        <Button variant={variant} size={size} className={cn('relative', className)}>
          {renderIcon()}
          {size !== 'icon' && (
            <>
              <span className="ml-2">{label}</span>
              {showConnectedCount && connectedCount > 0 && (
                <Badge variant="secondary" size="sm" className="ml-2">
                  {connectedCount}
                </Badge>
              )}
            </>
          )}

          {/* Notification badge for errors */}
          {showBadge && hasErrors && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background animate-pulse" />
          )}

          {/* Notification badge for connected count */}
          {showBadge && !hasErrors && connectedCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-background" />
          )}
        </Button>
      }
    />
  );
}

// Compact version for mobile/toolbar
export function IntegrationsTriggerCompact() {
  const { data: integrationsData } = useUserIntegrations();
  const integrations = integrationsData || [];

  const connectedCount = integrations.filter((i) => i.status === 'CONNECTED').length;

  return (
    <IntegrationsDialog
      trigger={
        <Button variant="ghost" size="icon" className="relative">
          <Sparkles className="w-5 h-5" />
          {connectedCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[10px] font-medium">
              {connectedCount > 9 ? '9+' : connectedCount}
            </span>
          )}
        </Button>
      }
    />
  );
}

// Icon-only version
export function IntegrationsTriggerIcon() {
  const { data: integrationsData } = useUserIntegrations();
  const integrations = integrationsData || [];

  const hasErrors = integrations.some((i) => i.status === 'ERROR' || i.status === 'TOKEN_EXPIRED');

  return (
    <IntegrationsDialog
      trigger={
        <Button variant="outline" size="icon" className="relative">
          <LinkIcon className="w-4 h-4" />
          {hasErrors && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background animate-pulse" />
          )}
        </Button>
      }
    />
  );
}
