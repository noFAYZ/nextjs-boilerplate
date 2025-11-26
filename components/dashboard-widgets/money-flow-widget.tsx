/*
MoneyFlowWidget — refactor + modern sankey
- All non-UI logic is moved into exported utility functions at the top for easy testing and reuse.
- Component focuses on rendering and interactions (UI).
- Uses orange as brand color (primary gradients), improved opacity/blur for ribbons,
  softer shadows, clearer typography, and subtle motion.

How to use:
- Drop this file into a Next.js "app" or "components" folder.
- It expects the same data hooks as your original file (useBankingTransactions, useBankingGroupedAccounts, useCryptoWallets, useSubscriptions).
- You can import the utilities for unit tests: computeMoneyFlow, layoutFlowNodes, ribbonPath, etc.
*/

'use client';

import React, { useMemo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft } from 'lucide-react';
import { useOrganizationBankingTransactions, useOrganizationBankingGroupedAccounts } from '@/lib/queries/use-organization-data-context';
import { useOrganizationCryptoWallets } from '@/lib/queries/use-organization-data-context';
import { useSubscriptions } from '@/lib/queries';
import { RefetchLoadingOverlay } from '@/components/ui/refetch-loading-overlay';
import { useOrganizationRefetchState } from '@/lib/hooks/use-organization-refetch-state';
import { CardSkeleton } from '@/components/ui/card-skeleton';

/* ------------------------ Types ------------------------ */
export interface FlowNodeBase {
  id: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
  level: 'source' | 'payment' | 'expense';
  icon?: 'bank' | 'crypto' | 'card' | 'wallet';
}

export interface FlowNode extends FlowNodeBase {
  x: number;
  y: number;
  height: number;
  width: number;
}

export interface FlowLink {
  source: string;
  target: string;
  value: number;
  sourceY: number;
  targetY: number;
  width: number;
}

/* ------------------------ Utilities (pure, exported) ------------------------ */
export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Ribbon path: smooth rounded ribbon between two points (keeps consistent thickness)
export function ribbonPath(x0: number, x1: number, y0: number, y1: number, thickness: number) {
  const cpX = lerp(x0, x1, 0.5);
  const half = thickness / 2;
  // Use cubic bezier for smoothness and consistent curvature
  const top = `M ${x0} ${y0 - half} C ${cpX} ${y0 - half} ${cpX} ${y1 - half} ${x1} ${y1 - half}`;
  const bottom = `L ${x1} ${y1 + half} C ${cpX} ${y1 + half} ${cpX} ${y0 + half} ${x0} ${y0 + half} Z`;
  return `${top} ${bottom}`;
}

// computeMoneyFlow: takes raw data arrays and returns nodes+links (pure)
export function computeMoneyFlow({ transactions = [], accounts = [], cryptoWallets = [], subscriptions = [] }: {
  transactions?: Array<Record<string, unknown>>;
  accounts?: Array<Record<string, unknown>>;
  cryptoWallets?: Array<Record<string, unknown>>;
  subscriptions?: Array<Record<string, unknown>>;
}) {
  let totalBankMoney = 0;
  let totalCryptoMoney = 0;
  let totalExpenses = 0;

  const accountFlows: Record<string, { expenses: number; accountType?: string; accountNumber?: string; name?: string }> = {};
  const expensesByCategory: Record<string, { amount: number; fromAccounts: Record<string, number> }> = {};

  accounts.forEach((a: Record<string, unknown>) => {
    const balance = Number(a.currentBalance ?? a.balance ?? a.availableBalance ?? 0) || 0;
    totalBankMoney += balance;
  });

  cryptoWallets.forEach((w: Record<string, unknown>) => {
    const walletBalance = Number(w?.totalBalanceUsd ?? w?.totalBalance ?? 0) || 0;
    totalCryptoMoney += walletBalance;
  });

  transactions.forEach((t: Record<string, unknown>) => {
    const isDebit = t.type === 'DEBIT' || Number(t.amount) < 0;
    if (!isDebit) return;
    const amount = Math.abs(Number(t.amount) || 0);
    const accountId = (t.accountId as string) ?? 'unknown';
    if (!accountFlows[accountId]) {
      const acc = accounts.find((x: Record<string, unknown>) => x.id === accountId) || {};
      accountFlows[accountId] = {
        expenses: 0,
        accountType: acc.accountType as string,
        accountNumber: acc.accountNumber as string,
        name: acc.name as string
      };
    }
    accountFlows[accountId].expenses += amount;
    totalExpenses += amount;

    const category = (t.category as string) ?? 'Other';
    if (!expensesByCategory[category]) expensesByCategory[category] = { amount: 0, fromAccounts: {} };
    expensesByCategory[category].amount += amount;
    expensesByCategory[category].fromAccounts[accountId] = (expensesByCategory[category].fromAccounts[accountId] || 0) + amount;
  });

  // subscriptions
  let totalSubscriptionCost = 0;
  subscriptions.forEach((s: Record<string, unknown>) => {
    if (s.status === 'ACTIVE' && s.amount) {
      const monthly = s.billingCycle === 'YEARLY' ? (s.amount as number) / 12 : (s.amount as number);
      totalSubscriptionCost += monthly;
    }
  });

  if (totalSubscriptionCost > 0) {
    const topAccountIds = Object.entries(accountFlows).sort(([, a], [, b]) => b.expenses - a.expenses).slice(0, 3).map(([id]) => id);
    expensesByCategory['Subscriptions'] = { amount: totalSubscriptionCost, fromAccounts: {} };
    totalExpenses += totalSubscriptionCost;
    topAccountIds.forEach(id => {
      expensesByCategory['Subscriptions'].fromAccounts[id] = totalSubscriptionCost / topAccountIds.length;
      accountFlows[id].expenses += totalSubscriptionCost / topAccountIds.length;
    });
  }

  const effectiveBankMoney = totalBankMoney > 0 ? totalBankMoney : (totalExpenses > 0 && accounts.length > 0 ? totalExpenses : 0);
  const effectiveCryptoMoney = totalCryptoMoney > 0 ? totalCryptoMoney : 0;
  const effectiveTotal = effectiveBankMoney + effectiveCryptoMoney || 1;

  // construct basic nodes and raw links
  const basicNodes: Array<Omit<FlowNode, 'x' | 'y' | 'height' | 'width'>> = [];
  const rawLinks: Array<{ source: string; target: string; value: number }> = [];

  if (effectiveBankMoney > 0 || accounts.length > 0) {
    basicNodes.push({ id: 'source-bank', label: 'Bank', value: effectiveBankMoney, percentage: (effectiveBankMoney / effectiveTotal) * 100, color: '#ff7a18', level: 'source', icon: 'bank' });
  }
  if (effectiveCryptoMoney > 0 || cryptoWallets.length > 0) {
    basicNodes.push({ id: 'source-crypto', label: 'Crypto', value: effectiveCryptoMoney, percentage: (effectiveCryptoMoney / effectiveTotal) * 100, color: '#f97316', level: 'source', icon: 'crypto' });
  }

  const topAccounts = Object.entries(accountFlows).sort(([, a], [, b]) => b.expenses - a.expenses).slice(0, 3);
  const paymentColors = ['#fb923c', '#f59e0b', '#f97316'];
  topAccounts.forEach(([accountId, flow], i) => {
    const acc = accounts.find((a: Record<string, unknown>) => a.id === accountId) || {};
    const isCard = acc.accountType === 'CREDIT';
    const label = isCard ? `Card •${String(acc.accountNumber ?? '').slice(-4)}` : (acc.name as string) ?? `Acct •${String(acc.accountNumber ?? '').slice(-4)}`;
    basicNodes.push({ id: `payment-${accountId}`, label, value: flow.expenses, percentage: (flow.expenses / Math.max(totalExpenses, 1)) * 100, color: paymentColors[i % paymentColors.length], level: 'payment', icon: isCard ? 'card' : 'wallet' });

    // connect sources -> payments proportionally
    if (effectiveBankMoney > 0) rawLinks.push({ source: 'source-bank', target: `payment-${accountId}`, value: (flow.expenses / Math.max(totalExpenses, 1)) * effectiveBankMoney });
    if (effectiveCryptoMoney > 0) rawLinks.push({ source: 'source-crypto', target: `payment-${accountId}`, value: (flow.expenses / Math.max(totalExpenses, 1)) * effectiveCryptoMoney });
  });

  const expenseColors = ['#fca5a5', '#fbcfe8', '#fcd34d', '#a7f3d0', '#c7d2fe'];
  Object.entries(expensesByCategory).sort(([, a], [, b]) => b.amount - a.amount).slice(0, 6).forEach(([cat, data], idx) => {
    basicNodes.push({ id: `expense-${cat}`, label: cat, value: data.amount, percentage: (data.amount / Math.max(totalExpenses, 1)) * 100, color: expenseColors[idx % expenseColors.length], level: 'expense' });
    topAccounts.forEach(([accountId]) => {
      const flowAmount = data.fromAccounts[accountId] || 0;
      if (flowAmount > 0) rawLinks.push({ source: `payment-${accountId}`, target: `expense-${cat}`, value: flowAmount });
    });
  });

  return { basicNodes, rawLinks, totals: { totalBankMoney: effectiveBankMoney, totalCryptoMoney: effectiveCryptoMoney, totalExpenses } };
}

// layoutFlowNodes: positions nodes and produces FlowNode + FlowLink arrays
export function layoutFlowNodes(basicNodes: Array<Omit<FlowNode, 'x' | 'y' | 'height' | 'width'>>, rawLinks: Array<{ source: string; target: string; value: number }>, opts = { svgW: 980, svgH: 420, nodeW: 64, nodePad: 18 }) {
  const { svgW, svgH, nodeW, nodePad } = opts;
  const colX = { source: 24, payment: svgW / 2 - nodeW / 2, expense: svgW - 24 - nodeW };

  const createPositioned = (arr: Array<Omit<FlowNode, 'x' | 'y' | 'height' | 'width'>>, x: number) => {
    if (!arr || arr.length === 0) return [] as FlowNode[];
    const values = arr.map(a => a.value);
    const totalVal = Math.max(values.reduce((s, v) => s + v, 0), 1);
    const available = svgH - nodePad * (arr.length + 1);
    let curY = nodePad;
    return arr.map(a => {
      const h = Math.max(44, (a.value / totalVal) * (available * 0.92));
      const node: FlowNode = { ...a, x, y: curY, height: h, width: nodeW } as FlowNode;
      curY += h + nodePad;
      return node;
    });
  };

  const positioned = [
    ...createPositioned(basicNodes.filter(n => n.level === 'source'), colX.source),
    ...createPositioned(basicNodes.filter(n => n.level === 'payment'), colX.payment),
    ...createPositioned(basicNodes.filter(n => n.level === 'expense'), colX.expense),
  ];

  const nodeMap = new Map(positioned.map(n => [n.id, n]));
  const sourceOffsets = new Map<string, number>();
  const targetOffsets = new Map<string, number>();

  const positionedLinks: FlowLink[] = rawLinks.map(l => {
    const s = nodeMap.get(l.source);
    const t = nodeMap.get(l.target);
    if (!s || !t) return { ...l, sourceY: 0, targetY: 0, width: 0 } as FlowLink;
    const so = sourceOffsets.get(l.source) || 0;
    const to = targetOffsets.get(l.target) || 0;
    const linkH = clamp((l.value / Math.max(s.value, 1)) * s.height, 2, s.height);
    sourceOffsets.set(l.source, so + linkH);
    targetOffsets.set(l.target, to + linkH);
    return { ...l, sourceY: s.y + so + linkH / 2, targetY: t.y + to + linkH / 2, width: linkH } as FlowLink;
  }).filter(l => l.width > 0);

  return { nodes: positioned, links: positionedLinks };
}

/* ------------------------ React Component (UI) ------------------------ */
export default function MoneyFlowWidget() {
  // Data hooks (organization-aware)
  const { data: transactionsResponse, isLoading: transactionsLoading } = useOrganizationBankingTransactions({ limit: 1000 });
  const { data: accountsResponse, isLoading: accountsLoading } = useOrganizationBankingGroupedAccounts();
  const { data: cryptoWalletsResponse, isLoading: cryptoLoading } = useOrganizationCryptoWallets();
  const { data: subscriptionsResponse, isLoading: subscriptionsLoading } = useSubscriptions({ status: 'ACTIVE' });
  const { isRefetching } = useOrganizationRefetchState();

  const [hoverInfo, setHoverInfo] = useState<null | { x: number; y: number; title: string; body?: string }>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const { nodes, links, totalBankMoney, totalCryptoMoney, totalExpenses } = useMemo(() => {
    if (!transactionsResponse || !accountsResponse) return { nodes: [], links: [], totalBankMoney: 0, totalCryptoMoney: 0, totalExpenses: 0 };

    const transactions = Array.isArray(transactionsResponse) ? transactionsResponse : transactionsResponse?.data || [];
    const accounts = Array.isArray(accountsResponse) ? accountsResponse : accountsResponse?.data || [];
    const cryptoWallets = cryptoWalletsResponse || [];
    const subscriptions = subscriptionsResponse?.data || [];

    const { basicNodes, rawLinks, totals } = computeMoneyFlow({ transactions, accounts, cryptoWallets, subscriptions });
    const { nodes, links } = layoutFlowNodes(basicNodes, rawLinks, { svgW: 980, svgH: 420, nodeW: 64, nodePad: 18 });

    return { nodes, links, totalBankMoney: totals.totalBankMoney, totalCryptoMoney: totals.totalCryptoMoney, totalExpenses: totals.totalExpenses };
  }, [transactionsResponse, accountsResponse, cryptoWalletsResponse, subscriptionsResponse]);

  const loading = transactionsLoading || accountsLoading || cryptoLoading || subscriptionsLoading;
  const totalMoney = totalBankMoney + totalCryptoMoney;

  const handleLinkHover = (e: React.MouseEvent, link: FlowLink) => {
    setHoverInfo({ x: e.clientX, y: e.clientY, title: `${(link.value).toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}`, body: `From ${link.source} → ${link.target}` });
  };
  const clearHover = () => setHoverInfo(null);

  if (loading) {
    return <CardSkeleton variant="chart" />;
  }

  const sourceCount = nodes.filter(n => n.level === 'source').length;
  if (sourceCount === 0 && totalExpenses === 0) {
    return (
      <div className="relative rounded-2xl border border-border bg-background p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Money Flow</h3>
          <Link href="/dashboard/accounts">
            <Badge variant="outline" className="text-[11px]">Connect</Badge>
          </Link>
        </div>
        <div className="py-12 text-center">
          <ArrowRightLeft className="h-12 w-12 mx-auto text-muted-foreground/60" />
          <p className="mt-3 text-sm text-muted-foreground">No flows to show — link a bank or wallet to visualize money flow.</p>
        </div>
        <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl border border-border bg-background p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground">Money Flow</h3>
          <p className="text-[11px] text-muted-foreground/80">Interactive sankey — sources → payment methods → expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground mr-2">Total</div>
          <div className="text-sm font-semibold">{(totalMoney).toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</div>
          <Link href="/dashboard/accounts">
            <Badge variant="outline" className="text-[11px]">Details</Badge>
          </Link>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg ref={svgRef} viewBox="0 0 980 420" width="980" height="420" preserveAspectRatio="xMidYMid meet" className="w-full h-[420px]">
          <defs>
            <linearGradient id="orangeA" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#ff7a18" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffb86b" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="orangeB" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.9" />
            </linearGradient>
            <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="6" stdDeviation="10" floodOpacity="0.06"/>
            </filter>
          </defs>

          {/* Links: draw first (behind nodes) with subtle blur + glass effect */}
          <g>
            {links.map((link, i) => {
              const s = nodes.find(n => n.id === link.source);
              const t = nodes.find(n => n.id === link.target);
              if (!s || !t) return null;
              const x0 = s.x + s.width;
              const x1 = t.x;
              const pathD = ribbonPath(x0, x1, link.sourceY, link.targetY, Math.max(4, link.width));

              // pick gradient based on source
              const isFromBank = link.source === 'source-bank';
              const fill = isFromBank ? 'url(#orangeA)' : 'url(#orangeB)';

              return (
                <motion.path
                  key={`link-${i}`}
                  d={pathD}
                  fill={fill}
                  opacity={0.85}
                  style={{ filter: 'blur(0.12px)', mixBlendMode: 'normal' }}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.95 }}
                  transition={{ duration: 0.55 + i * 0.02 }}
                  onMouseMove={(e) => handleLinkHover(e, link)}
                  onMouseLeave={clearHover}
                  className="cursor-pointer"
                />
              );
            })}
          </g>

          {/* Node shadows (subtle) */}
          <g>
            {nodes.map((node) => (
              <rect key={`nshadow-${node.id}`} x={node.x - 2} y={node.y + 6} width={node.width + 4} height={node.height} rx={14} fill="#000" opacity={0.04} />
            ))}
          </g>

          {/* Nodes */}
          <g>
            {nodes.map((node) => {
              const centerX = node.width / 2;
              const labelY = -10;
              return (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                  <rect
                    width={node.width}
                    height={node.height}
                    rx={14}
                    fill={node.color.startsWith('#f') ? 'url(#orangeB)' : node.color}
                    style={{ filter: 'drop-shadow(0 10px 18px rgba(20,20,20,0.06))' }}
                    className="cursor-pointer"
                    onMouseEnter={(e) => setHoverInfo({ x: e.clientX, y: e.clientY, title: node.label, body: `${node.value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} • ${node.percentage.toFixed(0)}%` })}
                    onMouseLeave={() => setHoverInfo(null)}
                  />

                  {/* minimal accent stripe */}
                  <rect x={4} y={4} width={6} height={Math.min(64, node.height - 8)} rx={3} fill="#ffffff" opacity={0.08} />

                  {/* Node label */}
                  <text x={centerX} y={labelY} textAnchor="middle" className="font-medium text-[11px] fill-foreground">{node.label}</text>

                  {/* Big % */}
                  <text x={centerX} y={node.height / 2 - 6} textAnchor="middle" className="font-semibold text-[12px] fill-white">{node.percentage.toFixed(0)}%</text>

                  <text x={centerX} y={node.height / 2 + 14} textAnchor="middle" className="text-[11px] fill-white/90">{(node.value >= 1000 ? `${(node.value / 1000).toFixed(1)}k` : node.value.toFixed(0))}</text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Mini legend */}
      <div className="absolute right-4 bottom-4 bg-background/90 border border-border rounded-lg px-3 py-2 text-xs shadow-sm flex gap-3 items-center">
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-gradient-to-r from-[#ff7a18] to-[#ffb86b] block" /> Bank</div>
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#fb923c] block" /> Crypto</div>
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#f59e0b] block" /> Payments</div>
      </div>

      {/* Tooltip (HTML overlay for crisp text) */}
      {hoverInfo && (
        <div style={{ left: hoverInfo.x + 12, top: hoverInfo.y + 8 }} className="pointer-events-none fixed z-50 px-3 py-2 rounded-md text-xs bg-card border border-border shadow-lg">
          <div className="font-semibold">{hoverInfo.title}</div>
          {hoverInfo.body && <div className="text-[11px] text-muted-foreground mt-1">{hoverInfo.body}</div>}
        </div>
      )}
      <RefetchLoadingOverlay isLoading={isRefetching} label="Updating..." />
    </div>
  );
}
