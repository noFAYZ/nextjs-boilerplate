'use client';

import { BankingDashboard } from '@/components/banking/BankingDashboard';

export default function BankAccountsPage() {
  return (
    <div className="max-w-3xl mx-auto p-4 lg:p-6 space-y-4">
      <BankingDashboard />
    </div>
  );
}