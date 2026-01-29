/**
 * Session Timeout Warning Modal
 * Shows warning to user when session is about to expire
 */

'use client';

import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, AlertTriangle, RefreshCw, LogOut } from 'lucide-react';
import { useSessionWarning } from '@/lib/hooks/use-session-timeout';

interface SessionTimeoutModalProps {
  // Optional props for customization
  title?: string;
  description?: string;
  extendButtonText?: string;
  logoutButtonText?: string;
  autoLogoutText?: string;
}

export function SessionTimeoutModal({
  title = "Session Expiring Soon",
  description = "Your session will expire soon due to inactivity. Would you like to extend your session?",
  extendButtonText = "Stay Logged In",
  logoutButtonText = "Log Out Now",
  autoLogoutText = "You will be automatically logged out in"
}: SessionTimeoutModalProps) {
  const {
    showModal,
    countdown,
    formatTimeRemaining,
    onExtendSession,
    onLogout,
    onDismiss,
    isRefreshing,
  } = useSessionWarning();

  // Auto-dismiss modal if countdown reaches zero
  useEffect(() => {
    if (countdown <= 0 && showModal) {
      onDismiss();
    }
  }, [countdown, showModal, onDismiss]);

  // Calculate progress percentage (assuming 5 minute warning period)
  const warningPeriod = 5 * 60 * 1000; // 5 minutes in milliseconds
  const progressPercentage = Math.max(0, Math.min(100, (countdown / warningPeriod) * 100));

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!showModal) return;

      switch (event.key) {
        case 'Enter':
          event.preventDefault();
          onExtendSession();
          break;
        case 'Escape':
          event.preventDefault();
          onLogout();
          break;
        case ' ':
          event.preventDefault();
          onExtendSession();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showModal, onExtendSession, onLogout]);

  if (!showModal) return null;

  const minutes = Math.floor(countdown / 60000);
  const seconds = Math.floor((countdown % 60000) / 1000);

  return (
    <Dialog open={showModal} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-warning">
            <AlertTriangle className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Countdown Display */}
          <Alert className="border-warning/20 bg-warning/5">
            <Clock className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{autoLogoutText}:</span>
              <span className="font-mono font-bold text-lg">
                {minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}s`}
              </span>
            </AlertDescription>
          </Alert>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Time Remaining</span>
              <span>{formatTimeRemaining()}</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2"
              aria-label={`Time remaining: ${formatTimeRemaining()}`}
            />
          </div>

          {/* Activity Hint */}
          <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
            <p>
              💡 <strong>Tip:</strong> Any activity on the page (clicking, typing, scrolling) will reset your session timer.
            </p>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> or <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Space</kbd> - Stay logged in</p>
            <p><kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Esc</kbd> - Log out now</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onLogout}
            className="flex items-center gap-2"
            disabled={isRefreshing}
          >
            <LogOut className="h-4 w-4" />
            {logoutButtonText}
          </Button>
          
          <Button
            onClick={onExtendSession}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            {isRefreshing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
            {isRefreshing ? 'Extending...' : extendButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Session status indicator component for the header/navbar
export function SessionStatusIndicator() {
  const {
    showModal,
    countdown,
    formatTimeRemaining,
  } = useSessionWarning();

  // Only show indicator when session is about to expire but modal isn't shown
  const shouldShow = countdown > 0 && countdown <= 5 * 60 * 1000 && !showModal;

  if (!shouldShow) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-warning/10 border border-warning/20 rounded-full text-sm">
      <Clock className="h-4 w-4 text-warning" />
      <span className="text-warning font-medium">
        Session expires in {formatTimeRemaining()}
      </span>
    </div>
  );
}

export default SessionTimeoutModal;