import type {
  TellerTransaction,
  BankTransaction,
  BankTransactionType,
  TellerTransactionCategory,
  CounterpartyType,
  BankTransactionStatus,
  BankTransactionProcessingStatus
} from '@/lib/types/banking';

/**
 * Processes a Teller transaction and converts it to our internal BankTransaction format
 */
export class BankingTransactionProcessor {
  /**
   * Convert Teller transaction to internal BankTransaction format
   */
  static processTellerTransaction(
    tellerTransaction: TellerTransaction,
    userId: string,
    accountId: string,
    accountName?: string,
    institutionName?: string
  ): Omit<BankTransaction, 'id' | 'createdAt' | 'updatedAt'> {
    const amount = parseFloat(tellerTransaction.amount);

    return {
      userId,
      accountId,
      tellerTransactionId: tellerTransaction.id,
      amount: amount,
      description: tellerTransaction.description,
      date: tellerTransaction.date,
      category: this.mapTellerCategory(tellerTransaction.category),
      status: tellerTransaction.status as BankTransactionStatus,
      type: this.determineTransactionType(amount),
      merchantName: this.extractMerchantName(tellerTransaction),
      counterpartyName: tellerTransaction.counterparty?.name || null,
      counterpartyType: tellerTransaction.counterparty?.type as CounterpartyType | undefined,
      processingStatus: tellerTransaction.processing_status as BankTransactionProcessingStatus,
      runningBalance: tellerTransaction.running_balance ? parseFloat(tellerTransaction.running_balance) : null,
      tellerType: tellerTransaction.type,
      tellerRawData: tellerTransaction,
      account: {
        name: accountName || 'Unknown Account',
        institutionName: institutionName || 'Unknown Institution'
      }
    };
  }

  /**
   * Process multiple Teller transactions
   */
  static processTellerTransactions(
    tellerTransactions: TellerTransaction[],
    userId: string,
    accountId: string,
    accountName?: string,
    institutionName?: string
  ): Omit<BankTransaction, 'id' | 'createdAt' | 'updatedAt'>[] {
    return tellerTransactions.map(transaction =>
      this.processTellerTransaction(transaction, userId, accountId, accountName, institutionName)
    );
  }

  /**
   * Determine if transaction is debit or credit based on amount
   */
  private static determineTransactionType(amount: number): BankTransactionType {
    return amount < 0 ? 'debit' : 'credit';
  }

  /**
   * Map Teller category to a simpler string format
   */
  private static mapTellerCategory(category?: TellerTransactionCategory | null): string | undefined {
    if (!category) return undefined;

    // Convert enum to readable format
    const categoryMap: Record<TellerTransactionCategory, string> = {
      [TellerTransactionCategory.Accommodation]: 'Accommodation',
      [TellerTransactionCategory.Advertising]: 'Advertising',
      [TellerTransactionCategory.Bar]: 'Bar',
      [TellerTransactionCategory.Charity]: 'Charity',
      [TellerTransactionCategory.Clothing]: 'Clothing',
      [TellerTransactionCategory.Dining]: 'Dining',
      [TellerTransactionCategory.Education]: 'Education',
      [TellerTransactionCategory.Electronics]: 'Electronics',
      [TellerTransactionCategory.Entertainment]: 'Entertainment',
      [TellerTransactionCategory.Fuel]: 'Fuel',
      [TellerTransactionCategory.General]: 'General',
      [TellerTransactionCategory.Groceries]: 'Groceries',
      [TellerTransactionCategory.Health]: 'Health',
      [TellerTransactionCategory.Home]: 'Home',
      [TellerTransactionCategory.Income]: 'Income',
      [TellerTransactionCategory.Insurance]: 'Insurance',
      [TellerTransactionCategory.Investment]: 'Investment',
      [TellerTransactionCategory.Loan]: 'Loan',
      [TellerTransactionCategory.Office]: 'Office',
      [TellerTransactionCategory.Phone]: 'Phone',
      [TellerTransactionCategory.Service]: 'Service',
      [TellerTransactionCategory.Shopping]: 'Shopping',
      [TellerTransactionCategory.Software]: 'Software',
      [TellerTransactionCategory.Sport]: 'Sport',
      [TellerTransactionCategory.Tax]: 'Tax',
      [TellerTransactionCategory.Transport]: 'Transport',
      [TellerTransactionCategory.Transportation]: 'Transportation',
      [TellerTransactionCategory.Utilities]: 'Utilities',
    };

    return categoryMap[category] || 'General';
  }

  /**
   * Extract merchant name from transaction details or counterparty
   */
  private static extractMerchantName(transaction: TellerTransaction): string | undefined {
    // Try to get merchant from counterparty first
    if (transaction.counterparty?.name) {
      return transaction.counterparty.name;
    }

    // Try to get merchant from details
    if (transaction.details?.merchant?.name) {
      return transaction.details.merchant.name;
    }

    // Try to extract from description as fallback
    // This is a simple heuristic - you might want to improve this
    const description = transaction.description;
    if (description && description.length > 0) {
      // Remove common prefixes/suffixes that aren't merchant names
      const cleanedDescription = description
        .replace(/^(DEBIT|CREDIT|PURCHASE|PAYMENT|WITHDRAWAL|DEPOSIT)\s+/i, '')
        .replace(/\s+(DEBIT|CREDIT|PURCHASE|PAYMENT|WITHDRAWAL|DEPOSIT)$/i, '')
        .replace(/\s+\d{2}\/\d{2}.*$/, '') // Remove dates
        .replace(/\s+#\d+.*$/, '') // Remove reference numbers
        .trim();

      return cleanedDescription || undefined;
    }

    return undefined;
  }

  /**
   * Validate that a Teller transaction has all required fields
   */
  static validateTellerTransaction(transaction: unknown): transaction is TellerTransaction {
    return (
      typeof transaction === 'object' &&
      transaction !== null &&
      typeof transaction.id === 'string' &&
      typeof transaction.account_id === 'string' &&
      typeof transaction.amount === 'string' &&
      typeof transaction.date === 'string' &&
      typeof transaction.description === 'string' &&
      typeof transaction.processing_status === 'string' &&
      typeof transaction.status === 'string' &&
      typeof transaction.type === 'string' &&
      typeof transaction.links === 'object'
    );
  }

  /**
   * Filter out duplicate transactions based on Teller transaction ID
   */
  static deduplicateTransactions(
    existingTransactions: BankTransaction[],
    newTransactions: Omit<BankTransaction, 'id' | 'createdAt' | 'updatedAt'>[]
  ): Omit<BankTransaction, 'id' | 'createdAt' | 'updatedAt'>[] {
    const existingTellerIds = new Set(
      existingTransactions.map(t => t.tellerTransactionId)
    );

    return newTransactions.filter(
      transaction => !existingTellerIds.has(transaction.tellerTransactionId)
    );
  }

  /**
   * Sort transactions by date (newest first)
   */
  static sortTransactionsByDate<T extends { date: string }>(transactions: T[]): T[] {
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * Create a sync summary for processed transactions
   */
  static createSyncSummary(
    processedTransactions: Omit<BankTransaction, 'id' | 'createdAt' | 'updatedAt'>[],
    totalFromTeller: number
  ) {
    const newCount = processedTransactions.length;
    const creditCount = processedTransactions.filter(t => t.type === 'credit').length;
    const debitCount = processedTransactions.filter(t => t.type === 'debit').length;
    const pendingCount = processedTransactions.filter(t => t.status === 'pending').length;
    const postedCount = processedTransactions.filter(t => t.status === 'posted').length;

    const totalAmount = processedTransactions.reduce((sum, t) => sum + t.amount, 0);

    return {
      totalFromTeller,
      newTransactions: newCount,
      creditTransactions: creditCount,
      debitTransactions: debitCount,
      pendingTransactions: pendingCount,
      postedTransactions: postedCount,
      totalAmount,
      dateRange: processedTransactions.length > 0 ? {
        earliest: Math.min(...processedTransactions.map(t => new Date(t.date).getTime())),
        latest: Math.max(...processedTransactions.map(t => new Date(t.date).getTime()))
      } : null
    };
  }
}

// Export the processor class and utility functions
export const tellerTransactionProcessor = BankingTransactionProcessor;

// Convenience functions for direct use
export const processTellerTransaction = BankingTransactionProcessor.processTellerTransaction;
export const processTellerTransactions = BankingTransactionProcessor.processTellerTransactions;
export const validateTellerTransaction = BankingTransactionProcessor.validateTellerTransaction;
export const deduplicateTransactions = BankingTransactionProcessor.deduplicateTransactions;
export const sortTransactionsByDate = BankingTransactionProcessor.sortTransactionsByDate;
export const createSyncSummary = BankingTransactionProcessor.createSyncSummary;