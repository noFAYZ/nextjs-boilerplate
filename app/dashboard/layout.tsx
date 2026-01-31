'use client';

import { MainLayout } from '@/components/layout';
import AuthGuard from '@/components/modules/auth/components/AuthGuard';
import { useViewMode } from '@/lib/contexts/view-mode-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isProMode } = useViewMode();

  return (
    <AuthGuard>
      <MainLayout showHeader={isProMode} showSidebar={true}>
        {children}
      </MainLayout>
    </AuthGuard>
  );
}