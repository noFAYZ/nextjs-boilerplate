'use client';

/**
 * Accept Invitation Page
 *
 * Page users land on when clicking invitation email link
 * Token is extracted from URL and used to accept invitation
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useAcceptInvitationByToken, usePendingInvitations } from '@/lib/queries/use-organization-data';
import { useOrganizationStore } from '@/lib/stores/organization-store';

interface PageProps {
  params: { token: string };
}

export default function AcceptInvitationPage({ params }: PageProps) {
  const router = useRouter();
  const { setSelectedOrganization } = useOrganizationStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState('');
  const [organizationName, setOrganizationName] = useState('');

  const acceptMutation = useAcceptInvitationByToken();
  const { refetch: refetchInvitations } = usePendingInvitations();

  useEffect(() => {
    const acceptInvitation = async () => {
      if (isProcessing) return;
      setIsProcessing(true);

      try {
        const response = await acceptMutation.mutateAsync({
          token: params.token,
        });

        if (response.success) {
          setOrganizationName(response.data.organizationName);
          setStatus('success');
          refetchInvitations();

          // Set the organization in context store and redirect
          setTimeout(() => {
            setSelectedOrganization(response.data.organizationId);
            router.push('/dashboard');
          }, 3000);
        } else {
          setStatus('error');
          setErrorMessage('Failed to accept invitation. The invitation may have expired.');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage('An error occurred while processing your invitation.');
        console.error('Error accepting invitation:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    acceptInvitation();
  }, [params.token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="bg-background border border-input rounded-lg shadow-lg p-8 max-w-md w-full space-y-6">
        {status === 'processing' && (
          <>
            <div className="flex justify-center">
              <Loader className="w-12 h-12 text-primary animate-spin" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Processing Invitation</h2>
              <p className="text-muted-foreground">
                Please wait while we process your invitation...
              </p>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-green-600">Invitation Accepted!</h2>
              <p className="text-muted-foreground">
                You've been added to <span className="font-semibold">{organizationName}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting you to the dashboard...
              </p>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center">
              <AlertCircle className="w-12 h-12 text-destructive" />
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-destructive">Invitation Error</h2>
              <p className="text-muted-foreground">{errorMessage}</p>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
