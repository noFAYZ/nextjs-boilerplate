'use client';

import { useState } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Repeat,
  ArrowUpDown,
  ExternalLink,
  Calendar,
  Clock,
  Download,
  Tag,
  Trash2,
  MoreHorizontal,
  Edit
} from 'lucide-react';
import { formatDate, formatDistanceToNow, formatRelative } from 'date-fns';
import { cn } from '@/lib/utils';
import { formatBusinessTime, formatRelativeTime, formatTime, parseTimestampz, parseTimestampzString, timestampzPresets, timestampzToReadable } from '@/lib/utils/time';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import {
  CategorizeTransactionsDialog,
  DeleteTransactionsDialog,
  ExportTransactionsDialog,
  UpdateTransactionsDialog
} from '@/components/crypto/TransactionOperationsDialog';

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

interface TransactionsDataTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
  walletAddress?: string;
}

const ITEMS_PER_PAGE = 25;

export function TransactionsDataTable({ transactions, isLoading, walletAddress }: TransactionsDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'gas'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'send' | 'receive' | 'swap'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'failed'>('all');
  
  // Bulk operations state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [isCategorizeDialogOpen, setIsCategorizeDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

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

  // Bulk operation handlers
  const toggleTransactionSelection = (transactionId: string) => {
    setSelectedTransactions(prev => 
      prev.includes(transactionId)
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const enterSelectionMode = () => {
    setIsSelectionMode(true);
    setSelectedTransactions([]);
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedTransactions([]);
  };

  const getSelectedTransactionsData = () => {
    return sortedTransactions.filter(tx => selectedTransactions.includes(tx.id));
  };

  const handleBulkCategorize = () => {
    setIsCategorizeDialogOpen(true);
  };

  const handleBulkDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleBulkExport = () => {
    setIsExportDialogOpen(true);
  };

  const handleBulkUpdate = () => {
    setIsUpdateDialogOpen(true);
  };

  // Mock operation handlers (replace with actual API calls)
  const handleCategorizeConfirm = async (transactionIds: string[]) => {
    // Simulate categorization
    const success = transactionIds.filter(() => Math.random() > 0.1);
    const failed = transactionIds.filter(id => !success.includes(id));
    return { success, failed };
  };

  const handleDeleteConfirm = async (transactionIds: string[]) => {
    // Simulate deletion
    const success = transactionIds.filter(() => Math.random() > 0.05);
    const failed = transactionIds.filter(id => !success.includes(id));
    return { success, failed };
  };

  const handleExportConfirm = async (transactionIds: string[]) => {
    // Simulate export
    const success = transactionIds.filter(() => Math.random() > 0.02);
    const failed = transactionIds.filter(id => !success.includes(id));
    return { success, failed };
  };

  const handleUpdateConfirm = async (transactionIds: string[]) => {
    // Simulate update
    const success = transactionIds.filter(() => Math.random() > 0.1);
    const failed = transactionIds.filter(id => !success.includes(id));
    return { success, failed };
  };

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
    if (status !== 'CONFIRMED') return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950';
    
    switch (type) {
      case 'RECEIVE':
        return 'text-green-600 bg-green-50 dark:bg-green-950';
      case 'SEND':
        return 'text-red-600 bg-red-50 dark:bg-red-950';
      case 'SWAP':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-950';
      default:
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950';
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

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="border rounded-lg">
          <div className="h-12 bg-muted animate-pulse" />
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="h-16 border-t bg-muted/50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {/* Filters */}
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
        <div className="flex gap-2">
          {!isSelectionMode ? (
            <>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'date' | 'value' | 'gas')}>
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">By Date</SelectItem>
                  <SelectItem value="value">By Value</SelectItem>
                  <SelectItem value="gas">By Gas</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={enterSelectionMode}
                disabled={transactions.length === 0}
              >
                <MoreHorizontal className="h-4 w-4 mr-1" />
                Select
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedTransactions.length} selected
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBulkCategorize}
                disabled={selectedTransactions.length === 0}
              >
                <Tag className="h-4 w-4 mr-1" />
                Categorize
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBulkExport}
                disabled={selectedTransactions.length === 0}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBulkUpdate}
                disabled={selectedTransactions.length === 0}
              >
                <Edit className="h-4 w-4 mr-1" />
                Update
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleBulkDelete}
                disabled={selectedTransactions.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={exitSelectionMode}
              >
                Cancel
              </Button>
            </div>
          )}
          <Select value={filterBy} onValueChange={(value) => setFilterBy(value as 'all' | 'send' | 'receive' | 'swap')}>
            <SelectTrigger className="w-[120px] h-9">
              <Filter className="h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="receive">Receive</SelectItem>
              <SelectItem value="send">Send</SelectItem>
              <SelectItem value="swap">Swap</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'confirmed' | 'pending' | 'failed')}>
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {isSelectionMode && (
                <TableHead className="w-[40px]">
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={selectedTransactions.length === paginatedTransactions.length && paginatedTransactions.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTransactions(paginatedTransactions.map(tx => tx.id));
                        } else {
                          setSelectedTransactions([]);
                        }
                      }}
                    />
                  </div>
                </TableHead>
              )}
            <TableHead className="w-[80px]">Date</TableHead>
            <TableHead className="">Label</TableHead>
              <TableHead className="w-[80px]">Type</TableHead>
              
              <TableHead className="w-[120px]">Hash</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Value (USD)</TableHead>
              <TableHead className="text-right">Gas</TableHead>
              <TableHead className="w-[80px]">Status</TableHead>
              <TableHead className="w-[80px]">Network</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((tx) => (
              <TableRow 
                key={tx.id} 
                className={`group ${isSelectionMode ? 'cursor-pointer' : ''} ${
                  selectedTransactions.includes(tx.id) ? 'bg-muted/50' : ''
                }`}
                onClick={isSelectionMode ? () => toggleTransactionSelection(tx.id) : undefined}
              >
                {isSelectionMode && (
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="rounded"
                        checked={selectedTransactions.includes(tx.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleTransactionSelection(tx.id);
                        }}
                      />
                    </div>
                  </TableCell>
                )}
                    <TableCell>
                  <div className={cn(
                    "text-xs flex items-center gap-1",
                   
                  )}>
                   
                    <span>{timestampzPresets.chat(tx.timestamp)} </span>
                
                  </div>
                </TableCell>
                <TableCell>
                  <div className={cn(
                    "text-xs",
                   
                  )}>
                    <span>{tx.notes} </span>
                
                  </div>
                </TableCell>
                <TableCell >
                
                  <Badge variant="outline" className="gap-2 text-xs pl-1 " s>  
                    <div className={cn(
                    "inline-flex items-center justify-center h-5 w-5 rounded-full",
                    getTransactionColor(tx.type, tx.status)
                  )}>
                    {getTransactionIcon(tx.type)}
                    
                  </div>
                        {tx.type}
                      </Badge>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                    {formatAddress(tx.hash)}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                    
                      <span className="font-medium text-sm">{tx.assetSymbol}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                     
                      {tx.methodName && (
                        <span className="text-xs text-muted-foreground">{tx.methodName}</span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div>
                    <p className="font-medium text-sm">{tx.value}</p>
                    <p className="text-xs text-muted-foreground">{tx.assetSymbol}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {tx.valueUsd ? (
                    <p className="font-medium">
                      <CurrencyDisplay amountUSD={tx.valueUsd} variant="small" />
                    </p>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                {tx.gasCostUsd ? (
                    <p className="text-sm">
                      <CurrencyDisplay
                        amountUSD={Number(tx.gasCostUsd)}
                        variant="compact"
                        formatOptions={{ maximumFractionDigits: 3 }}
                      />
                    </p>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      tx.status === 'CONFIRMED' ? 'default' : 
                      tx.status === 'PENDING' ? 'secondary' : 
                      'destructive'
                    } 
                    className="text-xs"
                  >
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell>
                <Badge variant="secondary" className="text-xs">
                        {tx.network}
                      </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <a
                      href={getNetworkExplorerUrl(tx.network, tx.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View on explorer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
        <div className="text-center py-12 border rounded-lg">
          <ArrowUpDown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">
            {searchTerm || filterBy !== 'all' || statusFilter !== 'all' ? 'No transactions match your criteria' : 'No transactions found'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm || filterBy !== 'all' || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Transactions will appear here after syncing'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length} transactions
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
              <span className="text-sm text-muted-foreground">of {totalPages}</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 px-3"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Progress Dialogs */}
      <CategorizeTransactionsDialog
        open={isCategorizeDialogOpen}
        onOpenChange={setIsCategorizeDialogOpen}
        transactions={getSelectedTransactionsData()}
        onConfirm={handleCategorizeConfirm}
      />
      
      <DeleteTransactionsDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        transactions={getSelectedTransactionsData()}
        onConfirm={handleDeleteConfirm}
      />
      
      <ExportTransactionsDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        transactions={getSelectedTransactionsData()}
        onConfirm={handleExportConfirm}
        exportFormat="CSV"
      />
      
      <UpdateTransactionsDialog
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        transactions={getSelectedTransactionsData()}
        onConfirm={handleUpdateConfirm}
        updateType="categories"
      />
    </div>
  );
}