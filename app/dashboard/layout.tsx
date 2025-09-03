import { SidebarLayout } from '@/components/sidebar';
import AuthGuard from '@/components/auth/AuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarLayout>
        {children}
      </SidebarLayout>
    </AuthGuard>
  );
}