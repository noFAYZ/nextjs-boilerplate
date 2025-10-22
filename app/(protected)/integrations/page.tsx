'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/lib/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  RefreshCw,
  Download,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  Filter,
  Settings,
  Zap,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IntegrationCard } from '@/components/integrations/IntegrationCard';
import { IntegrationSyncProgress } from '@/components/integrations/IntegrationSyncProgress';
import { IntegrationConnectPopup } from '@/components/integrations/IntegrationConnectPopup';
import { IntegrationDisconnectDialog } from '@/components/integrations/IntegrationDisconnectDialog';
import {
  useAvailableProviders,
  useUserIntegrations,
  useIntegrationsSummary,
  useConnectProvider,
  useDisconnectProvider,
  useSyncProvider,
  useRefreshAllIntegrations,
} from '@/lib/queries/integrations-queries';
import { useIntegrationsStore, integrationsSelectors } from '@/lib/stores/integrations-store';
import { IntegrationProvider, IntegrationStatus } from '@/lib/types/integrations';

export default function IntegrationsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'connected' | 'available'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [connectingProvider, setConnectingProvider] = useState<{ provider: IntegrationProvider; name: string } | null>(null);
  const [disconnectingProvider, setDisconnectingProvider] = useState<{ provider: IntegrationProvider; name: string } | null>(null);

  // Queries
  const { data: providersData, isLoading: providersLoading } = useAvailableProviders();
  const { data: integrationsData, isLoading: integrationsLoading, refetch: refetchIntegrations } = useUserIntegrations();
  const { data: summary } = useIntegrationsSummary();

  // Mutations
  const connectMutation = useConnectProvider();
  const disconnectMutation = useDisconnectProvider();
  const syncMutation = useSyncProvider();
  const refreshAllMutation = useRefreshAllIntegrations();

  // Store
  const filters = useIntegrationsStore((state) => state.filters);
  const viewPreferences = useIntegrationsStore((state) => state.viewPreferences);
  const setFilters = useIntegrationsStore((state) => state.setFilters);
  const getIntegrationByProvider = useIntegrationsStore((state) => state.getIntegrationByProvider);

  const providers = providersData || [];
  const integrations = integrationsData || [];

  // Listen for OAuth callback messages from popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'INTEGRATION_CALLBACK') {
        const { provider, status, message } = event.data;

        if (status === 'success') {
          console.log('Integration connected:', provider);
          toast({
            title: 'Integration Connected',
            description: `${provider} has been connected successfully.`,
          });
          refetchIntegrations();
        } else {
          toast({
            title: 'Connection Failed',
            description: message || 'Failed to connect integration.',
            variant: 'destructive',
          });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [toast, refetchIntegrations]);

  // Filtered providers based on search and category
  const filteredProviders = useMemo(() => {
    let filtered = providers;

    if (searchQuery) {
      filtered = filtered.filter(
        (provider) =>
          provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((provider) => provider.category === selectedCategory);
    }

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

  // Statistics
  const stats = useMemo(() => {
    const total = integrations.length;
    const connected = integrations.filter((i) => i.status === 'CONNECTED').length;
    const error = integrations.filter((i) => i.status === 'ERROR' || i.status === 'TOKEN_EXPIRED').length;
    const pending = integrations.filter((i) => i.status === 'PENDING_AUTH').length;

    return { total, connected, error, pending };
  }, [integrations]);

  // Handlers
  const handleConnect = async (providerConfig: { provider: IntegrationProvider; name: string }) => {
    setConnectingProvider({
      provider: providerConfig.provider,
      name: providerConfig.name,
    });
  };

  const handleDisconnect = async (provider: IntegrationProvider, name: string) => {
    setDisconnectingProvider({ provider, name });
  };

  const handleSync = async (provider: IntegrationProvider) => {
    syncMutation.mutate({ provider });
  };

  const isLoading = providersLoading || integrationsLoading;

  return (
    <div className="max-w-7xl mx-auto">
      <div className=" space-y-8">
        {/* Hero Header with Gradient */}
        <div className="relative overflow-hidden rounded-xl  border bg-card p-3 md:p-3">
          <div className="relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
               
                  <h1 className="text-md font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Integrations
                  </h1>
                </div>
                <p className="text-xs text-muted-foreground max-w-2xl">
                  Connect your favorite tools and automate your financial workflows seamlessly
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {stats.connected > 0 && (
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() => refreshAllMutation.mutate()}
                    disabled={refreshAllMutation.isPending}
                  
                  >
                    <RefreshCw className={cn('w-4 h-4 mr-1', refreshAllMutation.isPending && 'animate-spin')} />
                    {refreshAllMutation.isPending ? 'Syncing...' : 'Sync All'}
                  </Button>
                )}
                <Button variant="outline" size="xs" >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-500/10 to-orange-600/5 hover:shadow-lg transition-all duration-100 group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">   <div className="text-3xl font-bold text-foreground">{stats.total}</div> Integrations</CardTitle>

              
              <div className="p-2 rounded-xl bg-blue-orange/10">
                <LinkIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>

          </Card>

          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 hover:shadow-lg transition-all duration-100 group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground"><div className="text-3xl font-bold text-foreground">{stats.connected}</div>Connected</CardTitle>
              <div className="p-2 rounded-xl bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
   
          </Card>

          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-500/10 to-amber-600/5 hover:shadow-lg transition-all duration-100 group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground"><div className="text-3xl font-bold text-foreground">{stats.pending}</div>Pending</CardTitle>
              <div className="p-2 rounded-xl bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </CardHeader>
         
          </Card>

          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-red-500/10 to-red-600/5 hover:shadow-lg transition-all duration-100 group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">  <div className="text-3xl font-bold text-foreground">{stats.error}</div>Errors</CardTitle>
              <div className="p-2 rounded-xl bg-red-500/10">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
          
          </Card>
        </div>

        {/* Search & Filter Section */}
        <div className="">
   
            <div className="flex  flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1 bg-muted rounded-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                <Input
                  placeholder="Search integrations, providers, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-9 bg-muted border-0 shadow-sm focus-visible:ring-2"
                />
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-fit lg:w-auto" >
                <TabsList className=" p-1  h-9" variant={'floating'} size={'sm'}>
                  <TabsTrigger value="all" variant="ghost" className="gap-2" size={'sm'}>
                    <Sparkles className="w-4 h-4" />
                    All
                  </TabsTrigger>
                  <TabsTrigger value="connected" variant="ghost" className="gap-2" size={'sm'}>
                    <CheckCircle2 className="w-4 h-4" />
                    Connected
                    {stats.connected > 0 && (
                      <Badge variant="secondary" size="sm">
                        {stats.connected}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="available" variant="ghost" className="gap-2" size={'sm'}>
                    <LinkIcon className="w-4 h-4" />
                    Available
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Category Pills */}
            {categories.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-2 scrollbar-hide">
                <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                <Button
                  variant={selectedCategory === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="rounded-full"
                >
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize rounded-full"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
        
        </div>

        {/* Active Syncs - Compact Version */}
        {stats.connected > 0 && (
<>
              {integrations
                .filter((i) => i.status === 'CONNECTED')
                .map((integration) => (
                  <IntegrationSyncProgress
                    key={integration.id}
                    provider={integration.provider}
                    showCard={false}
                    className="border-0 rounded-xl bg-background/50"
                  />
                ))}</>
         
        )}

        {/* Integrations Grid - Modern Layout */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  ">
          {isLoading ? (
            <>
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-muted rounded-lg w-3/4" />
                        <div className="h-4 bg-muted rounded w-full" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-24 bg-muted rounded-xl" />
                    <div className="h-10 bg-muted rounded-lg" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : filteredProviders.length > 0 ? (
            filteredProviders.map((provider) => {
              const integration = getIntegrationByProvider(provider.provider);
              const isSyncing = syncMutation.isPending && syncMutation.variables?.provider === provider.provider;
              const isConnecting = connectingProvider?.provider === provider.provider;

              return (
                <IntegrationCard
                  key={provider.provider}
                  provider={provider}
                  integration={integration || undefined}
                  onConnect={() => handleConnect(provider)}
                  onDisconnect={() => handleDisconnect(provider.provider, provider.name)}
                  onSync={() => handleSync(provider.provider)}
                  isConnecting={isConnecting}
                  isSyncing={isSyncing}
                />
              );
            })
          ) : (
            <div className="col-span-full">
              <Card className="border-dashed border-2 bg-muted/20">
                <CardContent className="py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center">
                      <Search className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-md font-semibold">No integrations found</h3>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        {searchQuery
                          ? 'Try adjusting your search or filters to find what you need'
                          : 'Get started by connecting your first integration'}
                      </p>
                    </div>
                    {searchQuery && (
                      <Button
                        variant="outline"
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
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Connect Popup */}
      {connectingProvider && (
        <IntegrationConnectPopup
          open={!!connectingProvider}
          onOpenChange={(open) => {
            if (!open) setConnectingProvider(null);
          }}
          provider={connectingProvider.provider}
          providerName={connectingProvider.name}
          onSuccess={() => {
            toast({
              title: 'Integration Connected',
              description: `${connectingProvider.name} has been connected successfully.`,
            });
            refetchIntegrations();
            setConnectingProvider(null);
          }}
          onError={(error) => {
            toast({
              title: 'Connection Failed',
              description: error,
              variant: 'destructive',
            });
          }}
        />
      )}

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
    </div>
  );
}
