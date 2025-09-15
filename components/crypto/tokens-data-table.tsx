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
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Coins,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MageCaretDownFill,
  MageCaretUpFill,
  StreamlineFlexFilter2,
} from "../icons/icons";
import { ZERION_CHAINS } from "@/lib/constants/chains";
import { Toggle } from "../ui/toggle";
import { CurrencyDisplay } from "@/components/ui/currency-display";

interface TokenPosition {
  id: string;
  asset: {
    name: string;
    symbol: string;
    logoUrl?: string;
    network: string;
  };
  balance: string;
  balanceUsd: number;
  dayChangePct?: number;
  assets?: Array<{
    symbol: string;
    amount: string;
  }>;
}

interface TokensDataTableProps {
  tokens: TokenPosition[];
  totalValue: number;
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 20;

export function TokensDataTable({
  tokens,
  totalValue,
  isLoading,
}: TokensDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"value" | "change" | "name">("value");
  const [filterBy, setFilterBy] = useState<
    "all" | "profitable" | "losing" | "major"
  >("all");
  const [toggleFilters, setToggleFilters] = useState(false);
  // Filter and search tokens
  const filteredTokens = tokens.filter((token) => {
    const matchesSearch =
      token.asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.asset.symbol.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterBy === "profitable") return (token.dayChangePct || 0) > 0;
    if (filterBy === "losing") return (token.dayChangePct || 0) < 0;
    if (filterBy === "major") return token.balanceUsd >= 100;
    return true;
  });

  // Sort tokens
  const sortedTokens = [...filteredTokens].sort((a, b) => {
    switch (sortBy) {
      case "value":
        return b.balanceUsd - a.balanceUsd;
      case "change":
        return (b.dayChangePct || 0) - (a.dayChangePct || 0);
      case "name":
        return a.asset.name.localeCompare(b.asset.name);
      default:
        return 0;
    }
  });

  // Paginate tokens
  const totalPages = Math.ceil(sortedTokens.length / ITEMS_PER_PAGE);
  const paginatedTokens = sortedTokens.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className=" rounded-xl">
          <div className="h-12 bg-muted rounded-xl animate-pulse" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16  bg-muted/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4">
        {/* Left: Value */}

        <div className=" ">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
            Value
          </span>

          <div className="text-xl font-bold">
            <CurrencyDisplay
              amountUSD={totalValue}
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
              placeholder="Search tokens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          <Toggle
            className=" px-2 gap-1.5"
            title="Filters"
            variant={"outline"}
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
        } `}
      >
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="value">By Value</SelectItem>
            <SelectItem value="change">By Change</SelectItem>
            <SelectItem value="name">By Name</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filterBy}
          onValueChange={(value: any) => setFilterBy(value)}
        >
          <SelectTrigger className="w-[140px] h-9">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tokens</SelectItem>
            <SelectItem value="profitable">Profitable</SelectItem>
            <SelectItem value="losing">Losing</SelectItem>
            <SelectItem value="major">Major ($100+)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Data Table */}
      <div className=" bg-card p-4 rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none ">
              <TableHead className="w-[200px] font-bold">Token</TableHead>
              <TableHead className="text-right font-bold">
                Portfolio %
              </TableHead>
              <TableHead className="text-right font-bold">Price</TableHead>
              <TableHead className="text-right font-bold">Balance</TableHead>
              <TableHead className="text-right font-bold">
                Value (USD)
              </TableHead>
              <TableHead className="text-right font-bold">24h Change</TableHead>

              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTokens.map((token) => (
              <TableRow key={token.id} className="group border-none">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-full  bg-muted flex-shrink-0">
                      {token.asset.logoUrl ? (
                        <Image
                          src={token.asset.logoUrl}
                          alt={token.asset.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center rounded-full justify-center bg-primary text-primary-foreground">
                          <span className="font-bold text-xs">
                            {token.asset.symbol.charAt(0)}
                          </span>
                        </div>
                      )}

                      {/* Chain Badge */}
                      {(() => {
                        const chain = ZERION_CHAINS.find(
                          (c) =>
                            c.attributes?.name?.toLowerCase() ===
                            token.asset.network.toLowerCase()
                        );
                        if (!chain) return null;
                        return (
                          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border border-background bg-background overflow-hidden shadow-md">
                            <Image
                              src={chain.attributes.icon.url}
                              alt={chain.attributes.name}
                              width={22}
                              height={22}
                              className="object-contain"
                            />
                          </div>
                        );
                      })()}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="font-semibold text-sm truncate">
                          {token.asset.symbol}
                        </p>
                        <Badge variant="outline" className="text-xs rounded-sm">
                          {token.asset.name}
                        </Badge>
                      </div>

                      {/* <span className="text-xs text-muted-foreground">
                        {token.asset.network}
                      </span> */}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-12 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            (token.balanceUsd / totalValue) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium min-w-[40px]">
                      {((token.balanceUsd / totalValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div>
                    <p className="font-medium text-sm">
                      <CurrencyDisplay
                        amountUSD={Number(token?.asset?.priceUsd) || 0}
                        variant="small"
                        isLoading={isLoading}
                        formatOptions={{ maximumFractionDigits: 4 }}
                      />
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {token?.asset?.change24h}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <div>
                    <p className="font-medium text-sm">
                      {Number(token.balance).toLocaleString(undefined, {
                        maximumFractionDigits: 4,
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {token.asset.symbol}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <p className="font-medium">
                    <CurrencyDisplay
                      amountUSD={token.balanceUsd}
                      variant="small"
                      isLoading={isLoading}
                    />
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    {token.dayChangePct !== undefined ? (
                      <Badge
                        className={cn(
                          "flex items-center justify-end gap-1 rounded-xs",
                          token.dayChangePct >= 0
                            ? "bg-green-500/20 rounded-xs text-green-700 hover:bg-green-500/30"
                            : "bg-red-500/20 rounded-xs 0 hover:bg-red-500/30 text-red-700"
                        )}
                      >
                        {token.dayChangePct >= 0 ? (
                          <MageCaretUpFill className="h-4 w-4" />
                        ) : (
                          <MageCaretDownFill className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          {Math.abs(token.dayChangePct).toFixed(2)}%
                        </span>
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Sub-assets expansion for DeFi tokens */}
      {paginatedTokens.some(
        (token) => token.assets && token.assets.length > 0
      ) && (
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Eye className="h-3 w-3" />
          <span>Some tokens contain underlying DeFi assets</span>
        </div>
      )}

      {/* Empty State */}
      {filteredTokens.length === 0 && (
        <div className="text-center py-12 border rounded-lg">
          <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">
            {searchTerm || filterBy !== "all"
              ? "No tokens match your criteria"
              : "No tokens found"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm || filterBy !== "all"
              ? "Try adjusting your search or filters"
              : "Sync your wallet to see token holdings"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredTokens.length)} of{" "}
            {filteredTokens.length} tokens
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
