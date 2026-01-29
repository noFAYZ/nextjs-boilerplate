'use client';

import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  X,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IntegrationCardCompact } from './IntegrationCardCompact';
import { IntegrationDisconnectDialog } from './IntegrationDisconnectDialog';
import {
  useAvailableProviders,
  useUserIntegrations,
  useConnectProvider,
  useDisconnectProvider,
  useSyncProvider,
} from '@/lib/queries/integrations-queries';
import { useIntegrationsStore } from '@/lib/stores/integrations-store';
import { IntegrationProvider } from '@/lib/types/integrations';

interface IntegrationsDialogProps {
  trigger?: React.ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function IntegrationsDialog({
  trigger,
  defaultOpen = false,
  onOpenChange,
}: IntegrationsDialogProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'connected' | 'available'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [disconnectingProvider, setDisconnectingProvider] = useState<{ provider: IntegrationProvider; name: string } | null>(null);

  // Queries
  const { data: providersData, isLoading: providersLoading } = useAvailableProviders();
  const { data: integrationsData, isLoading: integrationsLoading } = useUserIntegrations();

  // Mutations
  const connectMutation = useConnectProvider();
  const disconnectMutation = useDisconnectProvider();
  const syncMutation = useSyncProvider();

  // Store
  const getIntegrationByProvider = useIntegrationsStore((state) => state.getIntegrationByProvider);

  const providers = providersData || [];
  const integrations = integrationsData || [];

  // Statistics
  const stats = useMemo(() => {
    const total = integrations.length;
    const connected = integrations.filter((i) => i.status === 'CONNECTED').length;
    const error = integrations.filter((i) => i.status === 'ERROR' || i.status === 'TOKEN_EXPIRED').length;
    const pending = integrations.filter((i) => i.status === 'PENDING_AUTH').length;

    return { total, connected, error, pending };
  }, [integrations]);

  // Filtered providers
  const filteredProviders = useMemo(() => {
    let filtered = providers;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (provider) =>
          provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((provider) => provider.category === selectedCategory);
    }

    // Tab filter
    if (activeTab === 'connected') {
      filtered = filtered.filter((provider) => {
        const integration = getIntegrationByProvider(provider.provider);
        return integration?.status === 'CONNECTED';
      });
    } else if (activeTab === 'available') {
      filtered = filtered.filter((provider) => {
        const integration = getIntegrationByProvider(provider.provider);
        return !integration || integration.status !== 'CONNECTED';
      });
    }

    return filtered;
  }, [providers, searchQuery, selectedCategory, activeTab, getIntegrationByProvider]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(providers.map((p) => p.category).filter(Boolean));
    return Array.from(cats);
  }, [providers]);

  // Handlers
  const handleConnect = async (provider: IntegrationProvider) => {
    connectMutation.mutate(provider);
  };

  const handleDisconnect = async (provider: IntegrationProvider, name: string) => {
    setDisconnectingProvider({ provider, name });
  };

  const handleSync = async (provider: IntegrationProvider) => {
    syncMutation.mutate({ provider });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const isLoading = providersLoading || integrationsLoading;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <LinkIcon className="w-4 h-4 mr-2" />
            Integrations
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-5xl h-[85vh] p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Integrations
              </DialogTitle>
              <DialogDescription className="mt-1">
                Connect your favorite tools and services
              </DialogDescription>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium">{stats.connected}</span>
              </div>
              {stats.error > 0 && (
                <div className="flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium">{stats.error}</span>
                </div>
              )}
              {stats.pending > 0 && (
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium">{stats.pending}</span>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Search & Filters */}
        <div className="px-6 py-4 border-b space-y-3 bg-muted/20">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          {/* Tabs & Categories */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'connected' | 'available')} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-3 sm:w-auto">
                <TabsTrigger value="all" className="text-xs">
                  All
                </TabsTrigger>
                <TabsTrigger value="connected" className="text-xs">
                  Connected
                  {stats.connected > 0 && (
                    <Badge variant="secondary" size="sm" className="ml-1.5">
                      {stats.connected}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="available" className="text-xs">
                  Available
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
                <Button
                  variant={selectedCategory === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="h-7 text-xs shrink-0"
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="h-7 text-xs capitalize shrink-0"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 px-6">
          <div className="py-4">
            {isLoading ? (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : filteredProviders.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {filteredProviders.map((provider) => {
                  const integration = getIntegrationByProvider(provider.provider);
                  const isSyncing = syncMutation.isPending && syncMutation.variables?.provider === provider.provider;
                  const isConnecting = connectMutation.isPending && connectMutation.variables === provider.provider;

                  return (
                    <IntegrationCardCompact
                      key={provider.provider}
                      provider={provider}
                      integration={integration || undefined}
                      onConnect={() => handleConnect(provider.provider)}
                      onDisconnect={() => handleDisconnect(provider.provider, provider.name)}
                      onSync={() => handleSync(provider.provider)}
                      isConnecting={isConnecting}
                      isSyncing={isSyncing}
                      variant="minimal"
                    />
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium">No integrations found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {searchQuery ? 'Try adjusting your search or filters' : 'Check back soon for new integrations'}
                  </p>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory(null);
                      }}
                      className="mt-4"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>

      {/* Disconnect Dialog */}
      {disconnectingProvider && (
        <IntegrationDisconnectDialog
          open={!!disconnectingProvider}
          onOpenChange={(open) => {
            if (!open) setDisconnectingProvider(null);
          }}
          provider={disconnectingProvider.provider}
          providerName={disconnectingProvider.name}
          onConfirm={() => {
            disconnectMutation.mutate(disconnectingProvider.provider);
            setDisconnectingProvider(null);
          }}
          isLoading={disconnectMutation.isPending}
        />
      )}
    </Dialog>
  );
}
