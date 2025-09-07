import { MainLayout } from '@/components/layout';
import AuthGuard from '@/components/auth/AuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <MainLayout showHeader={true} showSidebar={true}>
        {children}
      </MainLayout>
    </AuthGuard>
  );
}