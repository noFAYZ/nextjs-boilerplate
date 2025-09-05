'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Repeat,
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { TransactionsDataTable } from './transactions-data-table';
import { useViewMode } from '@/lib/contexts/view-mode-context';

interface Transaction {
  id: string;
  hash: string;
  type: 'SEND' | 'RECEIVE' | 'SWAP' | 'CONTRACT_INTERACTION';
  status: 'CONFIRMED' | 'PENDING' | 'FAILED';
  timestamp: string;
  network: string;
  assetSymbol: string;
  valueFormatted: string;
  valueUsd?: number;
  gasCostUsd?: number;
  fromAddress?: string;
  toAddress?: string;
  methodName?: string;
}

interface WalletTransactionsProps {
  transactions: Transaction[];
  isLoading?: boolean;
  walletAddress?: string;
}

const ITEMS_PER_PAGE = 20;

export function WalletTransactions({ transactions, isLoading, walletAddress }: WalletTransactionsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'gas'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'send' | 'receive' | 'swap'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'failed'>('all');
  const { isBeginnerMode, isProMode } = useViewMode();

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.assetSymbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.methodName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filterBy !== 'all') {
      const filterMap: Record<string, string[]> = {
        send: ['SEND'],
        receive: ['RECEIVE'],
        swap: ['SWAP']
      };
      if (!filterMap[filterBy]?.includes(tx.type)) return false;
    }
    
    if (statusFilter !== 'all' && tx.status.toLowerCase() !== statusFilter) return false;
    
    return true;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case 'value':
        return (b.valueUsd || 0) - (a.valueUsd || 0);
      case 'gas':
        return (b.gasCostUsd || 0) - (a.gasCostUsd || 0);
      default:
        return 0;
    }
  });

  // Paginate transactions
  const totalPages = Math.ceil(sortedTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'RECEIVE':
        return <ArrowDown className="h-4 w-4" />;
      case 'SEND':
        return <ArrowUp className="h-4 w-4" />;
      case 'SWAP':
        return <Repeat className="h-4 w-4" />;
      default:
        return <ArrowUpDown className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string, status: string) => {
    if (status !== 'CONFIRMED') return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
    
    switch (type) {
      case 'RECEIVE':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'SEND':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      case 'SWAP':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300';
      default:
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
    }
  };

  const getNetworkExplorerUrl = (network: string, hash: string) => {
    const explorers: Record<string, string> = {
      ETHEREUM: `https://etherscan.io/tx/${hash}`,
      POLYGON: `https://polygonscan.com/tx/${hash}`,
      BSC: `https://bscscan.com/tx/${hash}`,
      ARBITRUM: `https://arbiscan.io/tx/${hash}`,
      OPTIMISM: `https://optimistic.etherscan.io/tx/${hash}`,
      AVALANCHE: `https://snowtrace.io/tx/${hash}`,
      SOLANA: `https://explorer.solana.com/tx/${hash}`,
    };
    return explorers[network] || '#';
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const totalValue = transactions
    .filter(tx => tx.status === 'CONFIRMED' && tx.valueUsd)
    .reduce((sum, tx) => sum + (tx.valueUsd || 0), 0);

  return (
    <div className="space-y-4">
      {/* Header with Stats and View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5" />
            Transaction History
          </h3>
          <p className="text-sm text-muted-foreground">
            {transactions.length} transactions • ${totalValue.toLocaleString()} total volume
          </p>
        </div>
      </div>

      {/* Filters and Search - Beginner View Only */}
      {isBeginnerMode && (
        <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-full sm:w-[120px] h-9">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="value">Value</SelectItem>
            <SelectItem value="gas">Gas</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
          <SelectTrigger className="w-full sm:w-[120px] h-9">
            <Filter className="h-4 w-4" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="receive">Receive</SelectItem>
            <SelectItem value="send">Send</SelectItem>
            <SelectItem value="swap">Swap</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-full sm:w-[120px] h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        </div>
      )}

      {/* Conditional Rendering based on View Mode */}
      {isBeginnerMode ? (
        /* Beginner View - Cards */
        <div className="space-y-2">
          {paginatedTransactions.map((tx) => (
          <Card key={tx.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Transaction Icon */}
                <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${getTransactionColor(tx.type, tx.status)}`}>
                  {getTransactionIcon(tx.type)}
                </div>
                
                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge 
                      variant={tx.status === 'CONFIRMED' ? 'default' : 
                              tx.status === 'PENDING' ? 'secondary' : 'destructive'} 
                      className="text-xs"
                    >
                      {tx.type}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${tx.status === 'FAILED' ? 'border-red-200 text-red-600' : ''}`}
                    >
                      {tx.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {tx.network}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">
                      {tx.valueFormatted} {tx.assetSymbol}
                    </p>
                    {tx.valueUsd && (
                      <p className="font-medium">${tx.valueUsd.toLocaleString()}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(tx.timestamp))} ago</span>
                    </div>
                    
                  {/*   {tx.gasCostUsd && (
                      <span className="text-xs">Gas: ${tx.gasCostUsd.toFixed(3)}</span>
                    )} */}
                  </div>
                  
                  {/* Address Info */}
                  {(tx.fromAddress || tx.toAddress) && (
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {tx.fromAddress && (
                        <div className="flex items-center gap-1">
                          <span>From:</span>
                          <code className="bg-muted px-1 rounded">{formatAddress(tx.fromAddress)}</code>
                        </div>
                      )}
                      {tx.toAddress && (
                        <div className="flex items-center gap-1">
                          <span>To:</span>
                          <code className="bg-muted px-1 rounded">{formatAddress(tx.toAddress)}</code>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Method Name */}
                  {tx.methodName && (
                    <div className="mt-1">
                      <Badge variant="outline" className="text-xs">
                        {tx.methodName}
                      </Badge>
                    </div>
                  )}
                </div>
                
                {/* Explorer Link */}
                <div className="flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 w-8 p-0"
                  >
                    <a
                      href={getNetworkExplorerUrl(tx.network, tx.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View on explorer"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      ) : (
        /* Pro View - Data Table */
        <TransactionsDataTable 
          transactions={transactions}
          isLoading={isLoading}
          walletAddress={walletAddress}
        />
      )}

      {/* Empty State for Beginner View Only */}
      {isBeginnerMode && filteredTransactions.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <ArrowUpDown className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {searchTerm || filterBy !== 'all' || statusFilter !== 'all' ? 'No transactions match your filters' : 'No transactions found'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {searchTerm || filterBy !== 'all' || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Transactions will appear here after syncing'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pagination for Beginner View Only */}
      {isBeginnerMode && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
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