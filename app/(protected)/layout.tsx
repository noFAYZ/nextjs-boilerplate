import { MainLayout } from '@/components/layout';
import AuthGuard from '@/components/modules/auth/components/AuthGuard';

export default function ProtectedLayout({
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
