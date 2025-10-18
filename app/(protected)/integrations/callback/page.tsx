'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function IntegrationCallbackPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing...');

  useEffect(() => {
    const provider = searchParams.get('provider');
    const callbackStatus = searchParams.get('status');
    const errorMessage = searchParams.get('message');
    const code = searchParams.get('code');
    const realmId = searchParams.get('realmId');

    // Determine status
    if (callbackStatus === 'error' || errorMessage) {
      setStatus('error');
      setMessage(decodeURIComponent(errorMessage || 'Connection failed'));
    } else if (callbackStatus === 'success' || code) {
      setStatus('success');
      setMessage('Connection successful! You can close this window.');
    } else {
      setStatus('loading');
      setMessage('Processing connection...');
    }

    // Send message to parent window
    if (window.opener) {
      window.opener.postMessage(
        {
          type: 'INTEGRATION_CALLBACK',
          provider,
          status: callbackStatus === 'error' ? 'error' : 'success',
          message: errorMessage ? decodeURIComponent(errorMessage) : 'Connection successful',
          data: {
            code,
            realmId,
          },
        },
        window.location.origin
      );

      // Auto-close on success after 2 seconds
      if (callbackStatus === 'success' || (code && !errorMessage)) {
        setTimeout(() => {
          window.close();
        }, 2000);
      }
    } else {
      // If no opener (not a popup), redirect to integrations page
      setTimeout(() => {
        window.close();
      }, 3000);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {status === 'loading' && (
              <>
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <h2 className="text-xl font-semibold">Processing Connection</h2>
                <p className="text-sm text-muted-foreground">{message}</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                  Connection Successful!
                </h2>
                <p className="text-sm text-muted-foreground">{message}</p>
                <p className="text-xs text-muted-foreground">This window will close automatically...</p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Connection Failed</h2>
                <p className="text-sm text-muted-foreground">{message}</p>
                <p className="text-xs text-muted-foreground mt-4">
                  You can close this window and try again.
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
