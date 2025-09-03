'use client';

import AuthGuard from '@/components/auth/AuthGuard';import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome, {user?.name || user?.email}!
              </h1>
              <p className="text-muted-foreground">
                MoneyMappr Dashboard - Manage your finances with ease
              </p>
            </div>
            <Button onClick={handleSignOut} variant="destructive">
              Sign Out
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
                <CardDescription>Your current account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Plan:</strong> {user?.currentPlan}</p>
                  <p><strong>Status:</strong> {user?.status}</p>
                  <p><strong>Email Verified:</strong> {user?.emailVerified ? 'Yes' : 'No'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get started with these actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    Connect Bank Account
                  </Button>
                  <Button className="w-full" variant="outline">
                    Add Crypto Wallet
                  </Button>
                  <Button className="w-full" variant="outline">
                    View Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support</CardTitle>
                <CardDescription>Need help? We&apos;re here for you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    Contact Support
                  </Button>
                  <Button className="w-full" variant="outline">
                    View Documentation
                  </Button>
                  <Button className="w-full" variant="outline">
                    FAQ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}