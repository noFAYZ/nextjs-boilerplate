"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Building2,
  TrendingUp,
  Wallet,
  Layers,
  Grid3x3,
  LayoutList,
  ArrowUpRight,
  CheckCircle2,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUserIntegrations } from "@/lib/queries/integrations-queries";
import { RequestIntegrationDialog } from "@/components/integrations/RequestIntegrationDialog";
import {
  ExchangeBinance,
  ExchangeCoinbase,
  ExchangeKraken,
  ExchangeOkx,
  ExchangeBybit,
  ExchangeKucoin,
  ExchangeCryptoCom,
  WalletMetamask,
  WalletTrust,
  WalletPhantom,
  WalletLedger,
  WalletExodus,
  WalletRabby,
} from "@web3icons/react";
import {
  IntuitLogo,
  MageDashboard,
  MynauiGridOne,
  PayPalLogo,
  SolarWalletMoneyLinear,
  StreamlineFlexWallet,
  StreamlineUltimateCryptoCurrencyBitcoinDollarExchangeBold,
  StripeLogo,
  TellerLogo,
  XeroLogo,
} from "@/components/icons/icons";

// Integration data
const INTEGRATION_DATA = {
  banking: [
    /*     { id: 'plaid', name: 'Plaid', description: 'Connect 11,000+ banks instantly', icon: '🏦', status: 'available', category: 'banking' },
    { id: 'yodlee', name: 'Yodlee', description: 'Global bank aggregation', icon: '🌐', status: 'available', category: 'banking' }, */
    {
      id: "teller",
      name: "Teller",
      description: "Modern banking API",
      icon: <TellerLogo />,
      status: "available",
      category: "banking",
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Financial Connections",
      icon: <StripeLogo className="w-9 h-9" />,
      status: "available",
      category: "banking",
    },
  ],
  exchanges: [
 /*    {
      id: "coinbase",
      name: "Coinbase",
      description: "Leading US exchange",
      icon: <ExchangeCoinbase variant="branded" size="44" />,
      status: "available",
      category: "exchange",
    },
    {
      id: "binance",
      name: "Binance",
      description: "World's largest exchange",
      icon: <ExchangeBinance variant="branded" size="44" />,
      status: "available",
      category: "exchange",
    },
    {
      id: "kraken",
      name: "Kraken",
      description: "Secure crypto trading",
      icon: <ExchangeKraken variant="branded" size="44" />,
      status: "available",
      category: "exchange",
    },
    {
      id: "okx",
      name: "OKX",
      description: "Global crypto exchange",
      icon: <ExchangeOkx variant="branded" size="44" />,
      status: "available",
      category: "exchange",
    },
    {
      id: "bybit",
      name: "Bybit",
      description: "Derivatives trading",
      icon: (
        <ExchangeBybit
          variant="background"
          size="44"
          className="rounded-full"
        />
      ),
      status: "available",
      category: "exchange",
    },
    {
      id: "kucoin",
      name: "KuCoin",
      description: "Advanced trading",
      icon: <ExchangeKucoin variant="branded" size="44" />,
      status: "available",
      category: "exchange",
    },
    {
      id: "crypto-com",
      name: "Crypto.com",
      description: "Buy, sell & earn",
      icon: <ExchangeCryptoCom variant="branded" size="44" />,
      status: "available",
      category: "exchange",
    }, */
  ],
   wallets: [
  /*  {
      id: "metamask",
      name: "MetaMask",
      description: "Ethereum wallet",
      icon: <WalletMetamask variant="branded" size="44" />,
      status: "available",
      category: "wallet",
    },
    {
      id: "trust-wallet",
      name: "Trust Wallet",
      description: "Multi-chain wallet",
      icon: <WalletTrust variant="branded" size="44" />,
      status: "available",
      category: "wallet",
    },
    {
      id: "phantom",
      name: "Phantom",
      description: "Solana & Ethereum",
      icon: <WalletPhantom variant="branded" size="44" />,
      status: "available",
      category: "wallet",
    },
    {
      id: "ledger",
      name: "Ledger",
      description: "Hardware security",
      icon: <WalletLedger variant="branded" size="44" />,
      status: "available",
      category: "wallet",
    },
    {
      id: "exodus",
      name: "Exodus",
      description: "Multi-asset wallet",
      icon: <WalletExodus variant="branded" size="44" />,
      status: "available",
      category: "wallet",
    },
    {
      id: "rabby",
      name: "Rabby",
      description: "DeFi wallet",
      icon: <WalletRabby variant="branded" size="44" />,
      status: "available",
      category: "wallet",
    }, */
  ],
  services: [
    {
      id: "quickbooks",
      name: "QuickBooks",
      description: "Accounting software",
      icon: <IntuitLogo className="w-9 h-9" />,
      status: "available",
      category: "accounting",
    },
 /*    {
      id: "xero",
      name: "Xero",
      description: "Cloud accounting",
      icon: <XeroLogo className="w-9 h-9" />,
      status: "available",
      category: "accounting",
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Global payments",
      icon: <PayPalLogo className="w-10 h-10" />,
      status: "available",
      category: "payments",
    }, */
  ],
};

const CATEGORIES = [
  { id: "all", name: "All", icon: MynauiGridOne, count: 26 },
  { id: "banking", name: "Banking", icon: Building2, count: 4 },
  {
    id: "exchange",
    name: "Exchanges",
    icon: StreamlineUltimateCryptoCurrencyBitcoinDollarExchangeBold,
    count: 8,
  },
  { id: "wallet", name: "Wallets", icon: SolarWalletMoneyLinear, count: 6 },
  { id: "services", name: "Services", icon: Layers, count: 4 },
];

export default function IntegrationsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

  // Fetch user integrations to check connection status
  const { data: userIntegrations } = useUserIntegrations();

  const allIntegrations = useMemo(() => {
    return [
      ...INTEGRATION_DATA.banking,
      ...INTEGRATION_DATA.exchanges,
      ...INTEGRATION_DATA.wallets,
      ...INTEGRATION_DATA.services,
    ];
  }, []);

  const filteredIntegrations = useMemo(() => {
    let filtered = allIntegrations;

    if (searchQuery) {
      filtered = filtered.filter(
        (integration) =>
          integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          integration.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (integration) => integration.category === selectedCategory
      );
    }

    return filtered;
  }, [allIntegrations, searchQuery, selectedCategory]);

  const getCategoryData = (categoryId: string) => {
    if (categoryId === "all") return allIntegrations;
    return allIntegrations.filter((i) => i.category == categoryId);
  };

  // Get connection type for routing
  const getConnectionType = (category: string) => {
    if (category === 'banking') return 'bank';
    if (category === 'exchange') return 'exchange';
    if (category === 'wallet') return 'wallet';
    if (category === 'accounting' || category === 'payments') return 'service';
    return 'exchange'; // default
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-20">
        <div>
          <h1 className="text-xl font-semibold">Integrations</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Connect your accounts and services
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="xs" onClick={() => setIsRequestDialogOpen(true)}>
            <Plus className="h-3 w-3 mr-1" />
            Request Integration
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex justify-center w-full mb-12">
      <div className="relative w-full max-w-lg ">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10 group " /> 
      <Input
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-card border border-border shadow-none  hover:bg-card/60 focus:outline-none focus:ring-0 focus:ring-ring transition-colors text-left pl-9 h-11"
              >
               
              </Input>

              </div>
  {/*       <div className="relative w-full max-w-sm group-hover:translate-y-[2px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10 group " />
          <Input
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 text-sm border-2 focus:ring-none border-border bg-background/50 backdrop-blur-sm hover:bg-accent/50 hover:text-accent-foreground  active:scale-[0.98]  rounded-2xl  shadow-[0_4px_0_0_rgb(218,217,212)] hover:shadow-[0_2px_0_0_rgb(218,217,212)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-75  dark:shadow-[0_3px_0_0_rgb(47,47,41)] dark:hover:shadow-[0_1px_0_0_rgb(47,47,41)]"
          />
        </div> */}
      </div>
      {/* Category Tabs */}
      <div className="flex justify-center w-full">
        <div className="inline-flex items-center gap-2 flex-wrap justify-center">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "secondary" : "outline"}
              size="xs"
              onClick={() => setSelectedCategory(category.id)}
              className={cn("gap-1.5 transition-all")}
            >
              <category.icon className="h-3.5 w-3.5" />
              <span>{category.name}</span>
              <Badge
                variant={selectedCategory === category.id ? "pro" : "muted"}
                size="sm"
                className={cn(
                  "ml-0.5 min-w-[20px] justify-center",
                  selectedCategory === category.id &&
                    "bg-background/20 text-primary-foreground border-0"
                )}
              >
                {getCategoryData(category.id).length}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsContent value={selectedCategory} className="mt-4">
          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {filteredIntegrations.map((integration) => {
                const userIntegration = userIntegrations?.find(
                  (ui) => ui.provider.toLowerCase() === integration.id.toLowerCase()
                );
                const isConnected = userIntegration?.status === 'CONNECTED';

                return (
                  <IntegrationGridCard
                    key={integration.id}
                    integration={integration}
                    isConnected={isConnected}
                  />
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {filteredIntegrations.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <div className="h-12 w-12 rounded-lg bg-muted mx-auto mb-3 flex items-center justify-center">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-medium mb-1">
                  No integrations found
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Try adjusting your search or filters
                </p>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Request Integration Dialog */}
      <RequestIntegrationDialog
        open={isRequestDialogOpen}
        onOpenChange={setIsRequestDialogOpen}
      />
    </div>
  );
}

// Grid Card Component
function IntegrationGridCard({ integration, isConnected }: { integration: any; isConnected?: boolean }) {
  const getConnectionType = (category: string) => {
    if (category === 'banking') return 'bank';
    if (category === 'exchange') return 'exchange';
    if (category === 'wallet') return 'wallet';
    if (category === 'accounting' || category === 'payments') return 'service';
    return 'exchange'; // default
  };

  return (
    <Link href={`/accounts/connection?integration=${integration.id}&type=${getConnectionType(integration.category)}`}>
      <Card
      interactive
        className={cn(
          "group relative bg-card flex flex-col border items-center justify-center text-center rounded-lg",
          "p-2 h-full transition-all duration-75  ",
          "cursor-pointer",
          isConnected && "ring-2 ring-green-500/30 border-green-500/50"
        )}
      >
        {/* Connected Badge */}
        {isConnected && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge
              variant="default"
              className="bg-green-600 hover:bg-green-600 text-white shadow-lg flex items-center gap-1 px-2 py-0.5"
              size="sm"
            >
              <CheckCircle2 className="w-3 h-3" />
              Active
            </Badge>
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-2 p-0 relative">
          <span className="text-2xl">{integration.icon}</span>

          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            {integration.name}
          </h3>
        </div>
        <ArrowUpRight
          className={cn(
            "absolute top-4 right-4 h-4 w-4 text-muted-foreground",
            "opacity-0 group-hover:opacity-100 translate-x-1 -translate-y-1",
            "transition-all duration-100"
          )}
        />
      </Card>
    </Link>
  );
}
