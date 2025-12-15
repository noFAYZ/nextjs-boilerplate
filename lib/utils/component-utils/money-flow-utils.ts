export interface SankeyNode {
    name: string;
  }
  
  export interface SankeyLink {
    source: number;
    target: number;
    value: number;
  }
  
  export interface MoneyFlowData {
    nodes: SankeyNode[];
    links: SankeyLink[];
  }

interface FlowDataInputs {
  transactionsResponse?: { data: unknown[] } | unknown[];
  accountsResponse?: { data: unknown[] } | unknown[];
  cryptoWalletsResponse?: unknown[];
  subscriptionsResponse?: { data: unknown[] };
}

export function calculateMoneyFlow({
  transactionsResponse,
  accountsResponse,
  cryptoWalletsResponse,
}: FlowDataInputs) {
  if (!transactionsResponse || !accountsResponse) {
    return { nodes: [], links: [], totalBankMoney: 0, totalCryptoMoney: 0, totalExpenses: 0 };
  }

  const transactions = Array.isArray(transactionsResponse)
    ? transactionsResponse
    : transactionsResponse?.data || [];
  const accounts = Array.isArray(accountsResponse)
    ? accountsResponse
    : accountsResponse?.data || [];
  const cryptoWallets = cryptoWalletsResponse || [];

  let totalBankMoney = 0;
  let totalCryptoMoney = 0;
  let totalExpenses = 0;

  const accountFlows: Record<string, { expenses: number; accountType: string }> = {};
  const expensesByCategory: Record<string, { amount: number; fromAccounts: Record<string, number> }> = {};

  accounts.forEach((account) => {
    totalBankMoney += Number(account.currentBalance || account.balance || account.availableBalance || 0);
  });

  cryptoWallets.forEach((wallet) => {
    totalCryptoMoney += Number(wallet?.totalBalanceUsd || wallet?.totalBalance || 0);
  });

  const totalMoney = totalBankMoney + totalCryptoMoney;

  transactions.forEach((transaction) => {
    if (transaction.type === 'DEBIT' || transaction.amount < 0) {
      const amount = Math.abs(transaction.amount);
      const accountId = transaction.accountId;
      if (!accountFlows[accountId]) {
        const account = accounts.find((a) => a.id === accountId);
        accountFlows[accountId] = {
          expenses: 0,
          accountType: account?.accountType || 'DEPOSITORY',
        };
      }
      accountFlows[accountId].expenses += amount;
      totalExpenses += amount;

      const category = transaction.category || 'Other';
      if (!expensesByCategory[category]) {
        expensesByCategory[category] = { amount: 0, fromAccounts: {} };
      }
      expensesByCategory[category].amount += amount;
      expensesByCategory[category].fromAccounts[accountId] =
        (expensesByCategory[category].fromAccounts[accountId] || 0) + amount;
    }
  });

  const nodeWidth = 40;

  const nodes: SankeyNode[] = [];
  const links: SankeyLink[] = [];

  const addNode = (
    id: string,
    label: string,
    value: number,
    color: string,
    level: 'source' | 'payment' | 'expense'
  ) => {
    nodes.push({
      id,
      label,
      value,
      percentage: totalMoney > 0 ? (value / totalMoney) * 100 : 0,
      color,
      level,
      x: 0,
      y: 0,
      height: 0,
      width: nodeWidth,
    });
  };

  addNode('source-bank', 'Bank', totalBankMoney, '#22c55e', 'source');
  addNode('source-crypto', 'Crypto', totalCryptoMoney, '#f97316', 'source');

  const topAccounts = Object.entries(accountFlows)
    .sort(([, a], [, b]) => b.expenses - a.expenses)
    .slice(0, 3);

  topAccounts.forEach(([accountId, flow], i) => {
    addNode(
      `payment-${accountId}`,
      `Account ${i + 1}`,
      flow.expenses,
      ['#3b82f6', '#06b6d4', '#0ea5e9'][i % 3],
      'payment'
    );
    links.push({ source: 'source-bank', target: `payment-${accountId}`, value: flow.expenses });
  });

  Object.entries(expensesByCategory)
    .slice(0, 5)
    .forEach(([category, data], i) => {
      addNode(`expense-${category}`, category, data.amount, ['#8b5cf6', '#0ea5e9', '#14b8a6'][i % 3], 'expense');
      topAccounts.forEach(([accountId]) => {
        if (data.fromAccounts[accountId]) {
          links.push({
            source: `payment-${accountId}`,
            target: `expense-${category}`,
            value: data.fromAccounts[accountId],
          });
        }
      });
    });

  return { nodes, links, totalBankMoney, totalCryptoMoney, totalExpenses };
}

export const d3Interpolate = (a: number, b: number, t: number) => a + (b - a) * t;
