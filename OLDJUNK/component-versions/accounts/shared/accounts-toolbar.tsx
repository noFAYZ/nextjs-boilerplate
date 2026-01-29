'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  Search,
  Filter,
  LayoutGrid,
  LayoutList,
  Eye,
  EyeOff,
  X,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAccountsUIStore } from '@/lib/stores/accounts-ui-store';

interface AccountsToolbarProps {
  accountCount: number;
  isLoading?: boolean;
  onSearchChange?: (query: string) => void;
}

/**
 * Toolbar for accounts view with search, filters, sort, and view mode toggle
 */
export function AccountsToolbar({
  accountCount,
  isLoading = false,
  onSearchChange,
}: AccountsToolbarProps) {
  const {
    viewPreferences,
    filters,
    setAccountsView,
    setSearchQuery,
    setBalanceVisible,
    setSortBy,
    setSortOrder,
    setCategoryFilter,
    setAccountTypeFilter,
    setSourceFilter,
    clearFilters,
  } = useAccountsUIStore();

  const [searchValue, setSearchValue] = useState(filters.searchQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Debounce search input
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      onSearchChange?.(value);

      // Debounce the store update
      const timer = setTimeout(() => {
        setSearchQuery(value);
      }, 300);

      return () => clearTimeout(timer);
    },
    [setSearchQuery, onSearchChange]
  );

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters?.accountTypes?.length > 0) count++;
    if (filters?.categories?.length > 0) count++;
    if (filters?.sources?.length > 0) count++;
    if (filters?.sortBy !== 'name') count++;
    if (filters?.searchQuery) count++;
    return count;
  }, [filters]);

  // Account categories for filter
  const categories = [
    { value: 'CASH', label: 'Cash' },
    { value: 'CREDIT', label: 'Credit Cards' },
    { value: 'INVESTMENTS', label: 'Investments' },
    { value: 'ASSETS', label: 'Assets' },
    { value: 'LIABILITIES', label: 'Liabilities' },
    { value: 'CRYPTO', label: 'Crypto' },
  ];

  // Account sources for filter
  const sources = [
    { value: 'MANUAL', label: 'Manual' },
    { value: 'PLAID', label: 'Plaid' },
    { value: 'TELLER', label: 'Teller' },
    { value: 'ZERION', label: 'Zerion' },
  ];

  // Sort options
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'balance', label: 'Balance' },
    { value: 'type', label: 'Type' },
    { value: 'institution', label: 'Institution' },
    { value: 'lastSync', label: 'Last Synced' },
  ];

  return (
    <div className="space-y-4">
      {/* Main toolbar row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-card border border-border/50 rounded-lg">
        {/* Left section: Search and filters */}
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
          {/* Search input */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search accounts..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 h-9"
              disabled={isLoading}
            />
          </div>

          {/* Filter button with count */}
          <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2"
                disabled={isLoading}
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Filters</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Category filter */}
              <div className="px-2 py-2 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Category</p>
                {categories.map((cat) => (
                  <DropdownMenuCheckboxItem
                    key={cat.value}
                    checked={(filters?.categories || []).includes(cat.value as any)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setCategoryFilter([...(filters?.categories || []), cat.value as any]);
                      } else {
                        setCategoryFilter(
                          (filters?.categories || []).filter((c) => c !== cat.value)
                        );
                      }
                    }}
                  >
                    {cat.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>

              <DropdownMenuSeparator />

              {/* Source filter */}
              <div className="px-2 py-2 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Source</p>
                {sources.map((src) => (
                  <DropdownMenuCheckboxItem
                    key={src.value}
                    checked={(filters?.sources || []).includes(src.value as any)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSourceFilter([...(filters?.sources || []), src.value as any]);
                      } else {
                        setSourceFilter(
                          (filters?.sources || []).filter((s) => s !== src.value)
                        );
                      }
                    }}
                  >
                    {src.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>

              <DropdownMenuSeparator />

              {/* Clear filters button */}
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    clearFilters();
                    setIsFilterOpen(false);
                  }}
                  className="w-full justify-start text-xs text-muted-foreground"
                >
                  <X className="h-3 w-3 mr-2" />
                  Clear all filters
                </Button>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear filters button (inline) */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 text-xs"
              disabled={isLoading}
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Right section: Sort, Balance visibility, View toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Account count */}
          <span className="text-sm text-muted-foreground hidden xs:inline">
            {isLoading ? (
              <span className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading...
              </span>
            ) : (
              `${accountCount} ${accountCount === 1 ? 'account' : 'accounts'}`
            )}
          </span>

          {/* Sort dropdown */}
          <Select value={filters.sortBy} onValueChange={setSortBy} disabled={isLoading}>
            <SelectTrigger className="w-32 h-9 text-xs hidden sm:inline-flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  Sort by {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Balance visibility toggle */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setBalanceVisible(!viewPreferences.balanceVisible)}
            title={viewPreferences.balanceVisible ? 'Hide balances' : 'Show balances'}
            disabled={isLoading}
            className="h-9 w-9"
          >
            {viewPreferences.balanceVisible ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>

          {/* View mode toggle */}
          <div className="flex items-center border border-border/50 rounded-lg p-0.5 h-9">
            <Button
              variant={viewPreferences.accountsView === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setAccountsView('table')}
              className="h-7 px-2.5 rounded"
              disabled={isLoading}
              title="Table view"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={viewPreferences.accountsView === 'card' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setAccountsView('card')}
              className="h-7 px-2.5 rounded"
              disabled={isLoading}
              title="Card view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active filters chips (mobile) */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 px-4">
          {filters?.searchQuery && (
            <Badge variant="secondary" className="gap-1.5 pl-2.5">
              <Search className="h-3 w-3" />
              {filters.searchQuery}
            </Badge>
          )}

          {(filters?.categories || []).length > 0 &&
            filters?.categories?.map((cat) => (
              <Badge key={cat} variant="secondary" className="gap-1.5 pl-2.5">
                {categories.find((c) => c.value === cat)?.label || cat}
              </Badge>
            ))}

          {(filters?.sources || []).length > 0 &&
            filters?.sources?.map((src) => (
              <Badge key={src} variant="secondary" className="gap-1.5 pl-2.5">
                {sources.find((s) => s.value === src)?.label || src}
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
}
