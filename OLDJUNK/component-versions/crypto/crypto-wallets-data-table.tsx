"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Edit3,
  MoreHorizontal,
  RefreshCw,
  Copy,
  ExternalLink,
  Activity,
  AlertCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  StreamlineFlexFilter2,
  SolarCheckCircleBoldDuotone,
  SolarClockCircleBoldDuotone,
} from "../icons/icons";
import { Toggle } from "../ui/toggle";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { CryptoWallet } from "@/lib/types/crypto";
import { useDeleteCryptoWallet, useSyncCryptoWallet } from "@/lib/queries";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { createAvatar } from "@dicebear/core";
import { botttsNeutral } from "@dicebear/collection";
import { ChainBadge } from "./ui/ChainBadge";
import { useCryptoStore } from "@/lib/stores";

interface CryptoWalletsDataTableProps {
  wallets: CryptoWallet[];
  totalBalance: number;
  isLoading?: boolean;
  hideFilters?: boolean;
}

const ITEMS_PER_PAGE = 20;

// Wallet type display names
const walletTypeLabels: Record<string, string> = {
  HOT_WALLET: "Hot Wallet",
  COLD_WALLET: "Cold Wallet",
  EXCHANGE: "Exchange",
  MULTI_SIG: "Multi-Sig",
  SMART_CONTRACT: "Smart Contract",
};

// Network explorers
const networkExplorers: Record<string, string> = {
  ETHEREUM: "https://etherscan.io/address/",
  POLYGON: "https://polygonscan.com/address/",
  BSC: "https://bscscan.com/address/",
  ARBITRUM: "https://arbiscan.io/address/",
  OPTIMISM: "https://optimistic.etherscan.io/address/",
  AVALANCHE: "https://snowtrace.io/address/",
  SOLANA: "https://solscan.io/account/",
  BITCOIN: "https://blockchair.com/bitcoin/address/",
};

export function CryptoWalletsDataTable({
  wallets,
  totalBalance,
  isLoading,
  hideFilters = false,
}: CryptoWalletsDataTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"balance" | "name" | "lastSync">("balance");
  const [filterBy, setFilterBy] = useState<"all" | "hot" | "cold" | "exchange">("all");
  const [toggleFilters, setToggleFilters] = useState(false);

  const { mutate: deleteWallet } = useDeleteCryptoWallet();
  const { mutate: syncWallet } = useSyncCryptoWallet();
  const { realtimeSyncStates } = useCryptoStore();

  // Filter and search wallets
  const filteredWallets = wallets.filter((wallet) => {
    const matchesSearch =
      wallet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.network.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterBy === "hot") return wallet.type === "HOT_WALLET";
    if (filterBy === "cold") return wallet.type === "COLD_WALLET";
    if (filterBy === "exchange") return wallet.type === "EXCHANGE";
    return true;
  });

  // Sort wallets
  const sortedWallets = [...filteredWallets].sort((a, b) => {
    switch (sortBy) {
      case "balance":
        return parseFloat(b.totalBalanceUsd) - parseFloat(a.totalBalanceUsd);
      case "name":
        return a.name.localeCompare(b.name);
      case "lastSync":
        if (!a.lastSyncAt) return 1;
        if (!b.lastSyncAt) return -1;
        return new Date(b.lastSyncAt).getTime() - new Date(a.lastSyncAt).getTime();
      default:
        return 0;
    }
  });

  // Paginate wallets
  const totalPages = Math.ceil(sortedWallets.length / ITEMS_PER_PAGE);
  const paginatedWallets = sortedWallets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = (walletId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this wallet?")) {
      deleteWallet(walletId);
    }
  };

  const handleSync = (walletId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    syncWallet(walletId);
  };

  const handleEdit = (walletId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/accounts/wallet/${walletId}/edit`);
  };

  const handleRowClick = (walletId: string) => {
    router.push(`/accounts/wallet/${walletId}`);
  };

  const handleCopyAddress = (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getExplorerUrl = (network: string, address: string) => {
    const baseUrl = networkExplorers[network];
    return baseUrl ? `${baseUrl}${address}` : "#";
  };

  const getSyncStatusIcon = (walletId: string) => {
    const syncState = realtimeSyncStates[walletId];
    const isSyncing = syncState && ['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(syncState.status);

    if (isSyncing) {
      return <Activity className="h-3 w-3 text-primary animate-pulse" />;
    }

    switch (syncState?.status) {
      case 'completed':
        return <SolarCheckCircleBoldDuotone className="h-3.5 w-3.5 text-lime-700 dark:text-green-400" />;
      case 'failed':
        return <AlertCircle className="h-3.5 w-3.5 text-destructive" />;
      default:
        return <SolarClockCircleBoldDuotone className="h-3.5 w-3.5 text-yellow-700" />;
    }
  };

  const getSyncStatusBadge = (walletId: string, syncStatus?: string) => {
    const syncState = realtimeSyncStates[walletId];
    const isSyncing = syncState && ['queued', 'syncing', 'syncing_assets', 'syncing_transactions', 'syncing_nfts', 'syncing_defi'].includes(syncState.status);

    type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "muted";

    if (isSyncing) {
      return <Badge variant="warning">Syncing</Badge>;
    }

    const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
      SUCCESS: { label: "Synced", variant: "success" },
      ERROR: { label: "Error", variant: "destructive" },
      SYNCING: { label: "Syncing", variant: "warning" },
    };

    const config = statusConfig[syncStatus || "SUCCESS"] || { label: "Unknown", variant: "muted" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="rounded-xl">
          <div className="h-12 bg-muted rounded-xl animate-pulse" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters - Only show if not hidden */}
      {!hideFilters && (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4">
            {/* Left: Value */}
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Total Balance
              </span>
              <div className="text-xl font-bold">
                <CurrencyDisplay
                  amountUSD={totalBalance}
                  variant="default"
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Right: Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:items-center">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  placeholder="Search wallets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
              <Toggle
                className="px-2 gap-1.5"
                title="Filters"
                variant="outline"
                onClick={() => setToggleFilters(!toggleFilters)}
              >
                <StreamlineFlexFilter2 className="h-4 w-4" />
                Filters
              </Toggle>
            </div>
          </div>

          {/* Sort & Filter */}
          <div
            className={`px-4 gap-2 sm:justify-end ${
              toggleFilters ? "flex" : "hidden"
            }`}
          >
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balance">By Balance</SelectItem>
                <SelectItem value="name">By Name</SelectItem>
                <SelectItem value="lastSync">By Last Sync</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterBy}
              onValueChange={(value) => setFilterBy(value as typeof filterBy)}
            >
              <SelectTrigger className="w-[140px] h-9">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wallets</SelectItem>
                <SelectItem value="hot">Hot Wallets</SelectItem>
                <SelectItem value="cold">Cold Wallets</SelectItem>
                <SelectItem value="exchange">Exchanges</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* Data Table */}
      <div className="bg-card p-4 rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-[250px] font-bold">NAME</TableHead>
              <TableHead className="font-bold">ADDRESS</TableHead>
              <TableHead className="font-bold">NETWORK</TableHead>
              <TableHead className="font-bold">TYPE</TableHead>
              <TableHead className="font-bold text-right">BALANCE</TableHead>
              <TableHead className="font-bold text-center">ASSETS</TableHead>
              <TableHead className="font-bold text-center">NFTs</TableHead>
              <TableHead className="font-bold">LAST SYNCED</TableHead>
              <TableHead className="text-center font-bold">STATUS</TableHead>
              <TableHead className="text-right font-bold">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedWallets.map((wallet) => {
              const balance = parseFloat(wallet.totalBalanceUsd || "0");
              const avataUrl = createAvatar(botttsNeutral, {
                size: 128,
                seed: wallet.address,
                radius: 20,
              }).toDataUri();
              const walletTypeLabel = walletTypeLabels[wallet.type] || wallet.type;

              return (
                <TableRow
                  key={wallet.id}
                  className="group border-none cursor-pointer"
                  onClick={() => handleRowClick(wallet.id)}
                >
                  {/* NAME */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-lg bg-muted flex-shrink-0">
                        <Image src={avataUrl} fill alt="Wallet Avatar" className="rounded-lg" unoptimized />
                        <div
                          className="absolute -top-1 -right-1 h-5 w-5 bg-background rounded-full flex items-center justify-center border border-border"
                          title="Sync status"
                        >
                          {getSyncStatusIcon(wallet.id)}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-col gap-0.5">
                          <p className="font-semibold text-sm truncate">
                            {wallet.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Created {formatDistanceToNow(new Date(wallet.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* ADDRESS */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-mono">{formatAddress(wallet.address)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => handleCopyAddress(wallet.address, e)}
                        title="Copy Address"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-6 w-6 p-0"
                        title="View on Explorer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a
                          href={getExplorerUrl(wallet.network, wallet.address)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </TableCell>

                  {/* NETWORK */}
                  <TableCell>
                    <ChainBadge network={wallet.network} />
                  </TableCell>

                  {/* TYPE */}
                  <TableCell>
                    <span className="text-sm">{walletTypeLabel}</span>
                  </TableCell>

                  {/* BALANCE */}
                  <TableCell className="text-right">
                    <div className="font-semibold text-sm">
                      <CurrencyDisplay
                        amountUSD={balance}
                        variant="compact"
                      />
                    </div>
                  </TableCell>

                  {/* ASSETS */}
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-sm font-medium">
                        {wallet.assetCount}
                      </span>
                    </div>
                  </TableCell>

                  {/* NFTs */}
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                      <span className="text-sm font-medium">
                        {wallet.nftCount}
                      </span>
                    </div>
                  </TableCell>

                  {/* LAST SYNCED */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <SolarClockCircleBoldDuotone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {wallet.lastSyncAt
                          ? formatDistanceToNow(new Date(wallet.lastSyncAt), { addSuffix: true })
                          : "Never"}
                      </span>
                    </div>
                  </TableCell>

                  {/* STATUS */}
                  <TableCell className="text-center">
                    {getSyncStatusBadge(wallet.id, wallet.syncStatus)}
                  </TableCell>

                  {/* ACTION */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={(e) => handleSync(wallet.id, e)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Sync
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => handleEdit(wallet.id, e)}
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(wallet.id);
                          }}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleSync(wallet.id, e as React.MouseEvent<HTMLDivElement>)}>
                            <RefreshCw className="h-3.5 w-3.5 mr-2" />
                            Sync Wallet
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleCopyAddress(wallet.address, e as React.MouseEvent<HTMLDivElement>)}>
                            <Copy className="h-3.5 w-3.5 mr-2" />
                            Copy Address
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a
                              href={getExplorerUrl(wallet.network, wallet.address)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-3.5 w-3.5 mr-2" />
                              View on Explorer
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => handleDelete(wallet.id, e as React.MouseEvent<HTMLDivElement>)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {filteredWallets.length === 0 && (
        <div className="text-center py-12 border rounded-lg">
          <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">
            {searchTerm || filterBy !== "all"
              ? "No wallets match your criteria"
              : "No wallets found"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm || filterBy !== "all"
              ? "Try adjusting your search or filters"
              : "Connect your first wallet to get started"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredWallets.length)} of{" "}
            {filteredWallets.length} wallets
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 px-3"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              <span className="text-sm font-medium bg-primary text-primary-foreground px-3 py-1 rounded">
                {currentPage}
              </span>
              <span className="text-sm text-muted-foreground">
                of {totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 px-3"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
