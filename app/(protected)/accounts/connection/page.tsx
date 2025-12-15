'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CheckCircle2, Lock, CreditCard, Loader2, Building2, AlertCircle, Shield, Eye, RefreshCw, DollarSign, Receipt, FileText, Users, Package, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { Stepper, useStepper, type Step } from '@/components/ui/stepper';
import { DataSelectionAccordion } from '@/components/integrations/DataSelectionAccordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from "@/lib/hooks/useToast";
import { cn } from '@/lib/utils';
import { bankingMutations } from '@/lib/queries/banking-queries';
import { bankingApi } from '@/lib/services/banking-api';
import { useConnectProvider, useSyncProvider } from '@/lib/queries/integrations-queries';
import type { IntegrationProvider } from '@/lib/types/integrations';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { FluentBuildingBank28Regular, FluentBuildingBankLink28Regular } from '@/components/icons/icons';
import posthog from 'posthog-js';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Teller Connect Widget Interface
interface TellerConnectInstance {
  open: () => void;
  close: () => void;
}

interface TellerConnectConfig {
  applicationId: string;
  environment: 'sandbox' | 'production';
  onSuccess: (enrollment: unknown) => void;
  onExit: () => void;
  onEvent: (event: unknown) => void;
}

declare global {
  interface Window {
    TellerConnect: {
      setup: (config: TellerConnectConfig) => TellerConnectInstance;
    };
    Stripe?: (publishableKey: string) => StripeInstance;
  }
}

// Stripe.js Financial Connections Interface (from official docs)
interface StripeFinancialConnectionsAccount {
  id: string;
  object: string;
  category?: string;
  display_name?: string;
  institution_name?: string;
  last4?: string;
}

interface StripeFinancialConnectionsSession {
  id: string;
  accounts: StripeFinancialConnectionsAccount[];
}

interface StripeCollectResult {
  financialConnectionsSession: StripeFinancialConnectionsSession;
  error?: {
    message: string;
    type: string;
    code?: string;
  };
}

interface StripeInstance {
  // Official Stripe.js method for Financial Connections
  collectFinancialConnectionsAccounts: (params: {
    clientSecret: string;
  }) => Promise<StripeCollectResult>;
}

// Bank Connection Steps
const BANK_STEPS: Step[] = [
  { id: 'intro', title: 'Introduction', description: 'Security information' },
  { id: 'connect', title: 'Connect', description: 'Select your bank' },
  { id: 'select', title: 'Select Accounts', description: 'Choose accounts' },
  { id: 'sync', title: 'Sync', description: 'Import accounts' },
  { id: 'complete', title: 'Complete', description: 'All set!' },
];

// Service Connection Steps
const SERVICE_STEPS: Step[] = [
  { id: 'intro', title: 'Introduction', description: 'Get started' },
  { id: 'authorize', title: 'Authorize', description: 'Grant access' },
  { id: 'select', title: 'Select Data', description: 'Choose what to sync' },
  { id: 'sync', title: 'Sync', description: 'Import data' },
  { id: 'complete', title: 'Complete', description: 'All set!' },
];

function ConnectionPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const integrationType = searchParams.get('type') || 'exchange';
  const integrationId = searchParams.get('integration') || '';

  // Stepper state
  const steps = integrationType === 'bank' ? BANK_STEPS : SERVICE_STEPS;
  const stepper = useStepper(steps.length);

  // Bank connection state (Teller)
  const [isTellerScriptLoaded, setIsTellerScriptLoaded] = useState(false);
  const [tellerError, setTellerError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const tellerInstanceRef = useRef<TellerConnectInstance | null>(null);
  const [tellerEnrollment, setTellerEnrollment] = useState<Record<string, unknown> | null>(null);
  const [bankPreviewData, setBankPreviewData] = useState<Record<string, unknown> | null>(null);
  const [isLoadingBankPreview, setIsLoadingBankPreview] = useState(false);
  const [selectedBankAccountIds, setSelectedBankAccountIds] = useState<string[]>([]);

  // Stripe Financial Connections state
  const [isStripeScriptLoaded, setIsStripeScriptLoaded] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const stripeInstanceRef = useRef<StripeInstance | null>(null);
  const [stripeSessionId, setStripeSessionId] = useState<string | null>(null);

  // Service connection state (QuickBooks, etc.)
  const [authWindow, setAuthWindow] = useState<Window | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, unknown> | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isWaitingForAuth, setIsWaitingForAuth] = useState(false);
  const [isAlreadyConnected, setIsAlreadyConnected] = useState(false);
  const [syncPreferences, setSyncPreferences] = useState({
    syncAccounts: true,
    syncTransactions: true,
    syncInvoices: true,
    syncBills: true,
    syncCustomers: false,
    syncVendors: false,
    selectedAccountIds: [] as string[],
    selectedTransactionIds: [] as string[],
    selectedInvoiceIds: [] as string[],
    selectedBillIds: [] as string[],
    selectedCustomerIds: [] as string[],
    selectedVendorIds: [] as string[],
  });
  const connectServiceMutation = useConnectProvider();
  const syncServiceMutation = useSyncProvider();

  // Mutations
  const connectBankMutation = bankingMutations.useConnectAccount();
  const connectStripeMutation = bankingMutations.useConnectStripeAccount();

  const getIntegrationName = () => {
    return integrationId.charAt(0).toUpperCase() + integrationId.slice(1).replace(/[-_]/g, ' ');
  };

  const getProviderType = (): IntegrationProvider => {
    return integrationId.toUpperCase() as IntegrationProvider;
  };

  // Selection helper functions
  const toggleItemSelection = (type: 'accounts' | 'transactions' | 'invoices' | 'bills' | 'customers' | 'vendors', itemId: string) => {
    const key = `selected${type.charAt(0).toUpperCase() + type.slice(1, -1)}Ids` as keyof typeof syncPreferences;
    const currentIds = syncPreferences[key] as string[];

    setSyncPreferences(prev => ({
      ...prev,
      [key]: currentIds.includes(itemId)
        ? currentIds.filter(id => id !== itemId)
        : [...currentIds, itemId]
    }));
  };

  const toggleSelectAll = (type: 'accounts' | 'transactions' | 'invoices' | 'bills' | 'customers' | 'vendors', allIds: string[]) => {
    const key = `selected${type.charAt(0).toUpperCase() + type.slice(1, -1)}Ids` as keyof typeof syncPreferences;
    const currentIds = syncPreferences[key] as string[];

    setSyncPreferences(prev => ({
      ...prev,
      [key]: currentIds.length === allIds.length ? [] : allIds
    }));
  };

  const isAllSelected = (type: 'accounts' | 'transactions' | 'invoices' | 'bills' | 'customers' | 'vendors', allIds: string[]) => {
    const key = `selected${type.charAt(0).toUpperCase() + type.slice(1, -1)}Ids` as keyof typeof syncPreferences;
    const currentIds = syncPreferences[key] as string[];
    return currentIds.length === allIds.length && allIds.length > 0;
  };

  // Check if already connected on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      if (integrationType === 'service' && integrationId) {
        const isConnected = await checkConnectionStatus();

        if (isConnected) {
          console.log('QuickBooks already connected, jumping to selection step');
          setIsAlreadyConnected(true);
          toast({
            title: 'Already Connected',
            description: 'QuickBooks is already connected. Select what to sync.',
          });
          // Jump directly to selection step (Step 2 = Select Data)
          stepper.goToStep(2);
          fetchPreviewData();
        }
      } else if (integrationType === 'bank') {
        // For banks, check if there are existing bank accounts
        // If user is reconnecting, they can still go through the flow
        console.log('Bank connection flow - starting from beginning');
      }
    };

    checkExistingConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Load Teller Connect SDK for Teller banks
  useEffect(() => {
    if (integrationType === 'bank' && integrationId === 'teller' && stepper.currentStep >= 1) {
      const loadTellerScript = () => {
        if (typeof window !== 'undefined' && window.TellerConnect) {
          setIsTellerScriptLoaded(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.teller.io/connect/connect.js';
        script.async = true;
        script.onload = () => {
          setIsTellerScriptLoaded(true);
          setTellerError(null);
        };
        script.onerror = () => {
          setTellerError('Failed to load Teller Connect SDK');
        };

        document.head.appendChild(script);
      };

      loadTellerScript();
    }
  }, [integrationType, integrationId, stepper.currentStep]);

  // Load Stripe SDK for Stripe banks
  useEffect(() => {
    if (integrationType === 'bank' && integrationId === 'stripe' && stepper.currentStep >= 1) {
      const loadStripeScript = () => {
        if (typeof window !== 'undefined' && window.Stripe) {
          const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
          if (publishableKey) {
            stripeInstanceRef.current = window.Stripe(publishableKey);
            setIsStripeScriptLoaded(true);
          } else {
            setStripeError('Stripe publishable key not configured');
          }
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        script.onload = () => {
          const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
          if (publishableKey && window.Stripe) {
            stripeInstanceRef.current = window.Stripe(publishableKey);
            setIsStripeScriptLoaded(true);
            setStripeError(null);
          } else {
            setStripeError('Stripe publishable key not configured');
          }
        };
        script.onerror = () => {
          setStripeError('Failed to load Stripe SDK');
        };

        document.head.appendChild(script);
      };

      loadStripeScript();
    }
  }, [integrationType, integrationId, stepper.currentStep]);

  // Initialize Teller Connect
  useEffect(() => {
    if (!isTellerScriptLoaded || stepper.currentStep !== 1 || integrationType !== 'bank' || integrationId !== 'teller') {
      return;
    }

    const applicationId = process.env.NEXT_PUBLIC_TELLER_APPLICATION_ID;
    const environment = (process.env.NEXT_PUBLIC_TELLER_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production';

    if (!applicationId) {
      setTellerError('Teller application ID not configured');
      return;
    }

    try {
      const tellerConfig = {
        applicationId,
        environment,
        onSuccess: async (enrollment: unknown) => {
          try {
            // Validate enrollment data
            const enrollmentData = enrollment as Record<string, unknown>;
            const accessToken = enrollmentData?.accessToken;
            const enrollmentInfo = enrollmentData?.enrollment as Record<string, unknown>;

            if (!enrollmentData || !accessToken || !enrollmentInfo) {
              throw new Error('Invalid enrollment data received from Teller');
            }

            // Store enrollment data
            const processedEnrollment = {
              accessToken: accessToken as string,
              enrollment: {
                id: (enrollmentInfo.id as string) || '',
                institution: {
                  id: ((enrollmentInfo.institution as Record<string, unknown>)?.id as string) || '',
                  name: ((enrollmentInfo.institution as Record<string, unknown>)?.name as string) || ''
                }
              }
            };

            setTellerEnrollment(processedEnrollment);

            // Move to account selection step (step 2 for banks)
            stepper.nextStep();

            // Fetch preview of available accounts
            await fetchBankPreviewData(processedEnrollment);
          } catch (error: unknown) {
            const err = error as Error;
            console.error('Teller enrollment error:', error);
            toast({
              title: 'Authorization Failed',
              description: err?.message || 'Failed to process bank authorization. Please try again.',
              variant: 'destructive',
            });
            // Stay on connection step
            stepper.goToStep(1);
          }
        },
        onExit: () => {
          console.log('User exited Teller Connect');
        },
        onEvent: (event: unknown) => {
          console.log('Teller event:', event);
        }
      };

      tellerInstanceRef.current = window.TellerConnect.setup(tellerConfig);
    } catch (error) {
      console.error('Failed to initialize Teller:', error);
      setTellerError('Failed to initialize Teller Connect');
    }
  }, [isTellerScriptLoaded, stepper.currentStep, integrationType, integrationId, connectBankMutation, stepper, toast]);

  // Fetch preview data from QuickBooks
  const fetchPreviewData = async () => {
    setIsLoadingPreview(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/integrations/quickbooks/preview?limit=50`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch preview (${response.status})`);
      }

      const data = await response.json();

      if (!data.data) {
        throw new Error('No preview data available');
      }

      setPreviewData(data.data);
    } catch (error: unknown) {
      const err = error as Error;
      console.error('QuickBooks preview error:', error);
      toast({
        title: 'Failed to Load Data',
        description: err?.message || 'Unable to retrieve QuickBooks data. Please try again.',
        variant: 'destructive',
      });

      // Go back to authorize step on error
      stepper.prevStep();
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // Fetch bank accounts preview from Teller
  const fetchBankPreviewData = async (enrollment: Record<string, unknown>) => {
    setIsLoadingBankPreview(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/banking/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ enrollment }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch preview (${response.status})`);
      }

      const data = await response.json();

      if (!data.data || !data.data.accounts || data.data.accounts.length === 0) {
        throw new Error('No accounts available from this bank');
      }

      setBankPreviewData(data.data);
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Bank preview error:', error);
      toast({
        title: 'Failed to Load Accounts',
        description: err?.message || 'Unable to retrieve bank accounts. Please try again.',
        variant: 'destructive',
      });

      // Go back to connection step on error
      stepper.prevStep();
    } finally {
      setIsLoadingBankPreview(false);
    }
  };

  // Save sync preferences
  const saveSyncPreferences = async () => {
    try {
      // Validate that at least one category is enabled
      const hasEnabledCategory = Object.values(syncPreferences).some(
        (value, index) => index < 6 && value === true
      );

      if (!hasEnabledCategory) {
        toast({
          title: 'No Data Selected',
          description: 'Please enable at least one data type to sync.',
          variant: 'destructive',
        });
        return false;
      }

      // Build preferences object with selected IDs only for enabled categories
      const preferences = {
        syncAccounts: syncPreferences.syncAccounts,
        syncTransactions: syncPreferences.syncTransactions,
        syncInvoices: syncPreferences.syncInvoices,
        syncBills: syncPreferences.syncBills,
        syncCustomers: syncPreferences.syncCustomers,
        syncVendors: syncPreferences.syncVendors,
        selectedAccountIds: syncPreferences.syncAccounts && syncPreferences.selectedAccountIds.length > 0
          ? syncPreferences.selectedAccountIds
          : null,
        selectedTransactionIds: syncPreferences.syncTransactions && syncPreferences.selectedTransactionIds.length > 0
          ? syncPreferences.selectedTransactionIds
          : null,
        selectedInvoiceIds: syncPreferences.syncInvoices && syncPreferences.selectedInvoiceIds.length > 0
          ? syncPreferences.selectedInvoiceIds
          : null,
        selectedBillIds: syncPreferences.syncBills && syncPreferences.selectedBillIds.length > 0
          ? syncPreferences.selectedBillIds
          : null,
        selectedCustomerIds: syncPreferences.syncCustomers && syncPreferences.selectedCustomerIds.length > 0
          ? syncPreferences.selectedCustomerIds
          : null,
        selectedVendorIds: syncPreferences.syncVendors && syncPreferences.selectedVendorIds.length > 0
          ? syncPreferences.selectedVendorIds
          : null,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/integrations/quickbooks/sync-preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to save preferences (${response.status})`);
      }

      return true;
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Save preferences error:', error);
      toast({
        title: 'Failed to Save Preferences',
        description: err?.message || 'Unable to save sync preferences. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Check if QuickBooks is connected
  const checkConnectionStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/integrations/quickbooks/status`, {
        credentials: 'include',
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.data?.connected === true;
    } catch (error) {
      console.error('Connection status check failed:', error);
      return false;
    }
  };

  // Handle service OAuth connection
  const handleServiceAuth = async () => {
    try {
      const response = await connectServiceMutation.mutateAsync(getProviderType());

      if (response.data?.authorizationUrl) {
        // Open OAuth window
        const width = 600;
        const height = 700;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        const popup = window.open(
          response.data.authorizationUrl,
          'oauth_window',
          `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!popup) {
          toast({
            title: 'Popup Blocked',
            description: 'Please allow popups for this site and try again',
            variant: 'destructive',
          });
          return;
        }

        setAuthWindow(popup);
        setIsWaitingForAuth(true);

        console.log('OAuth popup opened, starting polling...');

        // Poll for window close
        const checkClosed = setInterval(async () => {
          console.log('Checking popup status...', popup.closed);

          if (!popup || popup.closed) {
            console.log('Popup closed, processing...');
            clearInterval(checkClosed);
            setIsWaitingForAuth(false);

            // Wait a moment for backend to process callback
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Check if connection was successful
            console.log('Checking connection status...');
            const isConnected = await checkConnectionStatus();
            console.log('Connection status:', isConnected);

            if (isConnected) {
              // After OAuth completes successfully, fetch preview data
              toast({
                title: 'Authorization Successful',
                description: 'Loading your QuickBooks data...',
              });
              stepper.nextStep(); // Move to select step
              fetchPreviewData();
            } else {
              toast({
                title: 'Authorization Complete',
                description: 'Loading available data...',
              });
              // Still proceed even if status check is uncertain
              stepper.nextStep();
              fetchPreviewData();
            }
          }
        }, 300); // Check more frequently

        // Safety timeout - force continue after 60 seconds
        setTimeout(() => {
          if (isWaitingForAuth) {
            console.log('Timeout reached, forcing continue...');
            clearInterval(checkClosed);
            setIsWaitingForAuth(false);
            toast({
              title: 'Authorization Timeout',
              description: 'Proceeding anyway. If data doesn\'t load, please try again.',
              variant: 'default',
            });
            stepper.nextStep();
            fetchPreviewData();
          }
        }, 60000);
      }
    } catch (error: unknown) {
      const err = error as Error;
      setIsWaitingForAuth(false);
      toast({
        title: 'Authorization Failed',
        description: err?.message || 'Failed to start authorization',
        variant: 'destructive',
      });
    }
  };

  // Manual continue after auth (if auto-progress fails)
  const handleManualContinue = async () => {
    setIsWaitingForAuth(false);
    stepper.nextStep();
    fetchPreviewData();
  };

  const handleProceedToSync = async () => {
    // Save preferences first
    const saved = await saveSyncPreferences();
    if (saved) {
      posthog.capture('service_sync_preferences_confirmed', {
        integration_provider: getProviderType(),
        sync_accounts: syncPreferences.syncAccounts,
        sync_transactions: syncPreferences.syncTransactions,
        sync_invoices: syncPreferences.syncInvoices,
        sync_bills: syncPreferences.syncBills,
        sync_customers: syncPreferences.syncCustomers,
        sync_vendors: syncPreferences.syncVendors,
      });
      stepper.nextStep(); // Move to sync step
      handleServiceSync();
    }
  };

  const handleServiceSync = async () => {
    setSyncProgress(0);

    try {
      // Start sync (backend will use saved preferences)
      await syncServiceMutation.mutateAsync({
        provider: getProviderType(),
        syncData: syncPreferences,
      });

      // Simulate progress
      const interval = setInterval(() => {
        setSyncProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            stepper.nextStep(); // Move to complete
            return 100;
          }
          return prev + 10;
        });
      }, 500);
    } catch (error: unknown) {
      const err = error as Error;
      toast({
        title: 'Sync Failed',
        description: err?.message || 'Failed to sync data',
        variant: 'destructive',
      });
    }
  };

  // Fetch Stripe account preview
  const fetchStripePreviewData = async (sessionId: string) => {
    setIsLoadingBankPreview(true);
    try {
      const response = await bankingApi.getStripeAccountsPreview(sessionId);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch Stripe accounts');
      }
      console.log("FIAMANANANA A ",response.data)
      setBankPreviewData(response.data);
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Stripe preview error:', error);
      toast({
        title: 'Failed to Load Accounts',
        description: err?.message || 'Unable to retrieve Stripe account data. Please try again.',
        variant: 'destructive',
      });
      // Go back to connection step on error
      stepper.prevStep();
    } finally {
      setIsLoadingBankPreview(false);
    }
  };

  const handleBankConnect = async () => {
    // Handle Teller connection
    if (integrationId === 'teller' && tellerInstanceRef.current) {
      tellerInstanceRef.current.open();
      return;
    }

    // Handle Stripe connection
    if (integrationId === 'stripe' && stripeInstanceRef.current) {
      try {
        setIsConnecting(true);

        // Create and collect Financial Connections accounts using Stripe.js
        // Backend creates the session and returns clientSecret
        // Frontend uses Stripe.js collectFinancialConnectionsAccounts to open modal

        // Get clientSecret from backend
        const sessionResponse = await bankingApi.createStripeSession();

        if (!sessionResponse.success) {
          const errorMessage = sessionResponse.error?.message || 'Failed to create Stripe session';
          throw { message: errorMessage };
        }

        const { clientSecret } = sessionResponse.data;

        // Collect Financial Connections accounts using Stripe.js
        const { financialConnectionsSession, error } = await stripeInstanceRef.current.collectFinancialConnectionsAccounts({
          clientSecret,
        });

        if (error) {
          throw { message: error.message || 'Failed to connect accounts' };
        }

      
        // Store session ID for later use
        const sessionId = financialConnectionsSession.id;
        setStripeSessionId(sessionId);

        // Move to account selection step
        stepper.nextStep();

        // Set preview data from Stripe response
        setIsLoadingBankPreview(true);

        const accounts = financialConnectionsSession?.accounts || [];
        const institutionName = accounts[0]?.institution_name || 'Your Bank';

        console.log("FIAMANANANA B ",financialConnectionsSession)

        setBankPreviewData({
          institutionName,
          totalAccounts: accounts.length,
          accounts: accounts,
          sessionId
        });
  console.log(bankPreviewData)
        setIsLoadingBankPreview(false);

      } catch (error: unknown) {
        const err = error as Error & { message?: string };
        console.error('Stripe connection error:', error);
        toast({
          title: 'Connection Failed',
          description: err?.message || 'Failed to connect via Stripe. Please try again.',
          variant: 'destructive',
        });
        setStripeError(err?.message || 'Connection failed');
      } finally {
        setIsConnecting(false);
      }
      return;
    }

    toast({
      title: 'Configuration Error',
      description: 'Bank connection not properly configured',
      variant: 'destructive',
    });
  };

  const handleConnectSelectedBankAccounts = async () => {
    // Validate we have necessary data based on integration type
    if (integrationId === 'teller' && !tellerEnrollment) {
      toast({
        title: 'Connection Error',
        description: 'Missing enrollment data. Please try connecting again.',
        variant: 'destructive',
      });
      stepper.goToStep(1);
      return;
    }

    if (integrationId === 'stripe' && !stripeSessionId) {
      toast({
        title: 'Connection Error',
        description: 'Missing session data. Please try connecting again.',
        variant: 'destructive',
      });
      stepper.goToStep(1);
      return;
    }

    if (selectedBankAccountIds.length === 0) {
      toast({
        title: 'No Accounts Selected',
        description: 'Please select at least one account to import.',
        variant: 'destructive',
      });
      return;
    }

    posthog.capture('bank_accounts_import_confirmed', {
      integration_provider: integrationId,
      selected_account_count: selectedBankAccountIds.length,
    });

    setIsConnecting(true);
    stepper.nextStep(); // Move to sync step

    try {
      if (integrationId === 'teller') {
        await connectBankMutation.mutateAsync({
          enrollment: tellerEnrollment,
          selectedAccountIds: selectedBankAccountIds.length > 0 ? selectedBankAccountIds : undefined,
        });
      } else if (integrationId === 'stripe') {
        await connectStripeMutation.mutateAsync({
          sessionId: stripeSessionId!,
          selectedAccountIds: selectedBankAccountIds.length > 0 ? selectedBankAccountIds : undefined,
        });
      }

      // Simulate sync progress
      const interval = setInterval(() => {
        setSyncProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            stepper.nextStep(); // Move to complete step
            return 100;
          }
          return prev + 10;
        });
      }, 300);

    } catch (error: unknown) {
      const err = error as Error & { response?: { data?: { message?: string } } };
      console.error('Bank connection error:', error);

      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to connect bank accounts';

      toast({
        title: 'Connection Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      // Go back to selection step on error
      stepper.goToStep(2);
      setSyncProgress(0);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleFinish = () => {
    toast({
      title: 'Connection Successful',
      description: `${getIntegrationName()} has been connected successfully.`,
    });

    if (integrationType === 'bank') {
      router.push('/accounts/bank');
    } else {
      router.push('/accounts/integrations');
    }
  };

  return (
    <div className="max-w-4xl mx-auto  space-y-6">
      {/* Back Button */}
      <Link href="/accounts/integrations">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Integrations
        </Button>
      </Link>

    

      {/* Stepper */}
      <Stepper steps={steps} currentStep={stepper.currentStep} variant="indicator" className='max-w-3xl mx-auto py-10' />

      {/* Step Content */}
      <Card className=' border-0'>
        <CardContent className="p-8">
          {/* Bank Flow */}
          {integrationType === 'bank' && (
            <>
              {/* Step 0: Introduction */}
              {stepper.currentStep === 0 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto h-20 w-20 bg-muted rounded-2xl flex items-center justify-center mb-4">
                      <FluentBuildingBankLink28Regular className="h-12 w-12 text-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Connect Your Bank Securely</h2>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      {integrationId === 'stripe'
                        ? 'We use Stripe Financial Connections to securely connect to your bank. Your credentials are never stored on our servers.'
                        : 'We use Teller to securely connect to over 10,000+ banks. Your credentials are never stored on our servers.'}
                    </p>
                  </div>

                  <div className="grid gap-3 max-w-lg mx-auto">
                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-sm">Bank-Level Security</h3>
                        <p className="text-xs text-muted-foreground">
                          256-bit encryption protects your data at all times
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <Lock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-sm">Read-Only Access</h3>
                        <p className="text-xs text-muted-foreground">
                          We can only view your data, never move funds
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <FluentBuildingBank28Regular className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-sm">10,000+ Banks Supported</h3>
                        <p className="text-xs text-muted-foreground">
                          Connect to most major banks and credit unions
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 mt-8">
                    <Button variant="outline" onClick={() => router.back()} >
                      Cancel
                    </Button>
                    <Button onClick={() => stepper.nextStep()} >
                      Get Started
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 1: Connect Bank */}
              {stepper.currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Select Your Bank</h2>
                    <p className="text-sm text-muted-foreground">
                      {integrationId === 'stripe'
                        ? 'Click the button below to open Stripe Financial Connections'
                        : 'Click the button below to open the secure Teller Connect window'}
                    </p>
                  </div>

                  {(tellerError || stripeError) && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{tellerError || stripeError}</AlertDescription>
                    </Alert>
                  )}

                  {integrationId === 'teller' && !isTellerScriptLoaded && !tellerError && (
                    <Alert>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <AlertDescription>Loading secure connection...</AlertDescription>
                    </Alert>
                  )}

                  {integrationId === 'stripe' && !isStripeScriptLoaded && !stripeError && (
                    <Alert>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <AlertDescription>Loading Stripe SDK...</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={() => stepper.prevStep()}>
                      Back
                    </Button>
                    <Button
                      onClick={handleBankConnect}
                      disabled={
                        (integrationId === 'teller' && (!isTellerScriptLoaded || !!tellerError)) ||
                        (integrationId === 'stripe' && (!isStripeScriptLoaded || !!stripeError)) ||
                        isConnecting
                      }
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <FluentBuildingBankLink28Regular className="h-5 w-5 mr-1" />
                          Connect Bank
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Select Accounts */}
              {stepper.currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold mb-2">Select Accounts to Import</h2>
                    <p className="text-sm text-muted-foreground">
                      {bankPreviewData ? `${bankPreviewData.institutionName} · ${bankPreviewData.totalAccounts} accounts found` : 'Choose which accounts you want to sync'}
                    </p>
                  </div>

                  {isLoadingBankPreview ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                      <p className="text-sm text-muted-foreground">Loading available accounts...</p>
                    </div>
                  ) : !bankPreviewData ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        <AlertCircle className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium mb-2">Failed to Load Accounts</h3>
                      <p className="text-sm text-muted-foreground mb-4">Unable to retrieve accounts from your bank.</p>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => stepper.prevStep()}>
                          Go Back
                        </Button>
                        <Button onClick={() => tellerEnrollment && fetchBankPreviewData(tellerEnrollment)}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Retry
                        </Button>
                      </div>
                    </div>
                  ) : bankPreviewData?.accounts && bankPreviewData.accounts.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full" defaultValue="accounts">
                      <DataSelectionAccordion
                        value="accounts"
                        title="Bank Accounts"
                        description={`Found ${bankPreviewData.totalAccounts} accounts from ${bankPreviewData.institutionName}`}
                        icon={FluentBuildingBank28Regular}
                        color="amber"
                        totalCount={bankPreviewData.totalAccounts}
                        previewItems={bankPreviewData.accounts || []}
                        isEnabled={true}
                        selectedIds={selectedBankAccountIds}
                        onToggleEnabled={() => {}}
                        onToggleItem={(itemId) => {
                          setSelectedBankAccountIds(prev =>
                            prev.includes(itemId)
                              ? prev.filter(id => id !== itemId)
                              : [...prev, itemId]
                          );
                        }}
                        onToggleAll={(allIds) => {
                          setSelectedBankAccountIds(
                            selectedBankAccountIds.length === allIds.length ? [] : allIds
                          );
                        }}
                        renderItemContent={(item: Record<string, unknown>) => {
                          // Support both Teller and Stripe account structures
                          const isStripeAccount = item.object === 'financial_connections.account';

                          const accountName = isStripeAccount ? (item.display_name as string) : (item.name as string);
                          const accountType = isStripeAccount ? (item.subcategory as string) : (item.subtype as string);
                          const accountLast4 = isStripeAccount ? (item.last4 as string) : (item.lastFour as string);

                          // Handle Stripe balance structure
                          let accountBalance = 0;
                          if (isStripeAccount) {
                            const balance = item.balance as Record<string, unknown>;
                            // Stripe: balance.current.usd (in cents) or balance.cash.available.usd (in cents)
                            const balanceInCents = (balance?.current as Record<string, unknown>)?.usd as number ||
                                                  ((balance?.cash as Record<string, unknown>)?.available as Record<string, unknown>)?.usd as number || 0;
                            accountBalance = balanceInCents / 100; // Convert cents to dollars
                          } else {
                            // Teller: balance.available (already in dollars)
                            const balance = item.balance as Record<string, unknown>;
                            accountBalance = (balance?.available as number) || 0;
                          }

                          return (
                            <div className="flex justify-between items-center gap-4 w-full">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold">{accountName}</span>
                                  {item.status === 'closed' && (
                                    <Badge variant="muted" size="sm">Closed</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span className="capitalize">{accountType?.replace('_', ' ')}</span>
                                  <span>****{accountLast4}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  ${accountBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                                {item.type === 'credit' && ((item.balance as Record<string, unknown>)?.ledger as number) < 0 && (
                                  <p className="text-xs text-red-600 dark:text-red-400">
                                    Owe: ${Math.abs(((item.balance as Record<string, unknown>)?.ledger as number) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        }}
                      />
                    </Accordion>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>No accounts available to import</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-center gap-3 mt-6 pt-6 border-t">
                    <Button variant="outline" onClick={() => stepper.prevStep()}>
                      Back
                    </Button>
                    <Button
                      onClick={handleConnectSelectedBankAccounts}
                      disabled={isLoadingBankPreview || selectedBankAccountIds.length === 0}
                    >
                      Import {selectedBankAccountIds.length} Account{selectedBankAccountIds.length !== 1 ? 's' : ''}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Syncing */}
              {stepper.currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Syncing Your Accounts</h2>
                    <p className="text-sm text-muted-foreground">
                      Please wait while we import your bank accounts and transactions
                    </p>
                  </div>

                  <div className="max-w-md mx-auto">
                    <Progress value={syncProgress} className="h-2" />
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      {syncProgress}% complete
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Complete */}
              {stepper.currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Connection Successful!</h2>
                    <p className="text-sm text-muted-foreground">
                      Your bank account has been connected and synced successfully
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <Button onClick={handleFinish}>
                      Go to Banking Dashboard
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Service Flow (QuickBooks, etc.) */}
          {integrationType === 'service' && (
            <>
              {/* Step 0: Introduction */}
              {stepper.currentStep === 0 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Shield className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">
                      {isAlreadyConnected ? 'Reconnect' : 'Connect'} {getIntegrationName()}
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      {isAlreadyConnected
                        ? `${getIntegrationName()} is already connected. You can reconnect to update your authorization.`
                        : `Securely connect your ${getIntegrationName()} account using OAuth`
                      }
                    </p>
                  </div>

                  {isAlreadyConnected && (
                    <Alert>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription>
                        Your {getIntegrationName()} account is currently active. You can skip to data selection or reconnect to refresh your authorization.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid gap-3 max-w-lg mx-auto">
                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-sm">Secure OAuth Connection</h3>
                        <p className="text-xs text-muted-foreground">
                          Industry-standard OAuth protocol ensures maximum security
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <Eye className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-sm">Read-Only Access</h3>
                        <p className="text-xs text-muted-foreground">
                          We can only view your data, never make changes
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-sm">Full Control</h3>
                        <p className="text-xs text-muted-foreground">
                          Revoke access anytime from your settings
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 mt-8">
                    <Button variant="outline" onClick={() => router.back()}>
                      Cancel
                    </Button>
                    <Button onClick={() => stepper.nextStep()}>
                      Get Started
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 1: Authorize */}
              {stepper.currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Authorize {getIntegrationName()}</h2>
                    <p className="text-sm text-muted-foreground">
                      You&apos;ll be redirected to {getIntegrationName()} to grant access
                    </p>
                  </div>

                  {isWaitingForAuth && (
                    <Alert>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <AlertDescription>
                        Waiting for authorization to complete. Complete the process in the popup window.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={() => stepper.prevStep()} disabled={isWaitingForAuth}>
                      Back
                    </Button>
                    <Button
                      onClick={handleServiceAuth}
                      disabled={connectServiceMutation.isPending || isWaitingForAuth}
                    >
                      {connectServiceMutation.isPending ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Connecting...</>
                      ) : (
                        <><Shield className="h-4 w-4 mr-2" />Authorize Connection</>
                      )}
                    </Button>
                    {isWaitingForAuth && (
                      <Button variant="outline" onClick={handleManualContinue}>
                        Continue Anyway
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Select Data */}
              {stepper.currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold mb-2">Select Data to Sync</h2>
                    <p className="text-sm text-muted-foreground">
                      Choose which data types and specific items you want to import from {getIntegrationName()}
                    </p>
                  </div>

                  {isLoadingPreview ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                      <p className="text-sm text-muted-foreground">Loading available data...</p>
                    </div>
                  ) : (
                    <Accordion type="multiple" className="w-full space-y-0" defaultValue={['accounts', 'transactions']}>
                        {/* Accounts */}
                        {previewData?.accounts?.available && (
                          <DataSelectionAccordion
                            value="accounts"
                            title="Accounts"
                            description="Chart of accounts, bank accounts, credit cards"
                            icon={DollarSign}
                            color="blue"
                            totalCount={previewData.accounts.count}
                            previewItems={previewData.accounts.preview || []}
                            isEnabled={syncPreferences.syncAccounts}
                            selectedIds={syncPreferences.selectedAccountIds}
                            onToggleEnabled={(checked) =>
                              setSyncPreferences((prev) => ({ ...prev, syncAccounts: !!checked }))
                            }
                            onToggleItem={(itemId) => toggleItemSelection('accounts', itemId)}
                            onToggleAll={(allIds) => toggleSelectAll('accounts', allIds)}
                            renderItemContent={(item: Record<string, unknown>) => (
                              <div className="flex justify-between items-center gap-4 w-full">
                                <span className="font-semibold truncate">{item.name as string}</span>
                                <span className="text-xs text-muted-foreground bg-muted/70 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium">
                                  {item.type as string}
                                </span>
                              </div>
                            )}
                          />
                        )}

                        {/* Transactions */}
                        {previewData?.transactions?.available && (
                          <DataSelectionAccordion
                            value="transactions"
                            title="Transactions"
                            description="Financial transactions and journal entries"
                            icon={Receipt}
                            color="green"
                            totalCount={previewData.transactions.count}
                            previewItems={previewData.transactions.preview || []}
                            isEnabled={syncPreferences.syncTransactions}
                            selectedIds={syncPreferences.selectedTransactionIds}
                            onToggleEnabled={(checked) =>
                              setSyncPreferences((prev) => ({ ...prev, syncTransactions: !!checked }))
                            }
                            onToggleItem={(itemId) => toggleItemSelection('transactions', itemId)}
                            onToggleAll={(allIds) => toggleSelectAll('transactions', allIds)}
                            renderItemContent={(item: Record<string, unknown>) => (
                              <div className="flex justify-between items-center gap-4 w-full">
                                <span className="font-semibold truncate">{(item.description || item.number || item.id) as string}</span>
                                <span className="text-xs font-bold text-foreground bg-muted/70 px-3 py-1.5 rounded-lg whitespace-nowrap">
                                  ${item.amount as number}
                                </span>
                              </div>
                            )}
                          />
                        )}

                        {/* Invoices */}
                        {previewData?.invoices?.available && (
                          <DataSelectionAccordion
                            value="invoices"
                            title="Invoices"
                            description="Customer invoices and sales receipts"
                            icon={FileText}
                            color="purple"
                            totalCount={previewData.invoices.count}
                            previewItems={previewData.invoices.preview || []}
                            isEnabled={syncPreferences.syncInvoices}
                            selectedIds={syncPreferences.selectedInvoiceIds}
                            onToggleEnabled={(checked) =>
                              setSyncPreferences((prev) => ({ ...prev, syncInvoices: !!checked }))
                            }
                            onToggleItem={(itemId) => toggleItemSelection('invoices', itemId)}
                            onToggleAll={(allIds) => toggleSelectAll('invoices', allIds)}
                            renderItemContent={(item: Record<string, unknown>) => (
                              <div className="flex justify-between items-center gap-4 w-full">
                                <span className="font-semibold truncate">{(item.number || item.id) as string}</span>
                                <span className="text-xs font-bold text-foreground bg-muted/70 px-3 py-1.5 rounded-lg whitespace-nowrap">
                                  ${item.amount as number}
                                </span>
                              </div>
                            )}
                          />
                        )}

                        {/* Bills */}
                        {previewData?.bills?.available && (
                          <DataSelectionAccordion
                            value="bills"
                            title="Bills"
                            description="Vendor bills and expenses"
                            icon={Receipt}
                            color="orange"
                            totalCount={previewData.bills.count}
                            previewItems={previewData.bills.preview || []}
                            isEnabled={syncPreferences.syncBills}
                            selectedIds={syncPreferences.selectedBillIds}
                            onToggleEnabled={(checked) =>
                              setSyncPreferences((prev) => ({ ...prev, syncBills: !!checked }))
                            }
                            onToggleItem={(itemId) => toggleItemSelection('bills', itemId)}
                            onToggleAll={(allIds) => toggleSelectAll('bills', allIds)}
                            renderItemContent={(item: Record<string, unknown>) => (
                              <div className="flex justify-between items-center gap-4 w-full">
                                <span className="font-semibold truncate">{(item.number || item.id) as string}</span>
                                <span className="text-xs font-bold text-foreground bg-muted/70 px-3 py-1.5 rounded-lg whitespace-nowrap">
                                  ${item.amount as number}
                                </span>
                              </div>
                            )}
                          />
                        )}

                        {/* Customers */}
                        {previewData?.customers?.available && (
                          <DataSelectionAccordion
                            value="customers"
                            title="Customers"
                            description="Customer list and contact information"
                            icon={Users}
                            color="cyan"
                            totalCount={previewData.customers.count}
                            previewItems={previewData.customers.preview || []}
                            isEnabled={syncPreferences.syncCustomers}
                            selectedIds={syncPreferences.selectedCustomerIds}
                            onToggleEnabled={(checked) =>
                              setSyncPreferences((prev) => ({ ...prev, syncCustomers: !!checked }))
                            }
                            onToggleItem={(itemId) => toggleItemSelection('customers', itemId)}
                            onToggleAll={(allIds) => toggleSelectAll('customers', allIds)}
                            renderItemContent={(item: Record<string, unknown>) => (
                              <span className="font-semibold truncate">{(item.name || item.displayName) as string}</span>
                            )}
                          />
                        )}

                        {/* Vendors */}
                        {previewData?.vendors?.available && (
                          <DataSelectionAccordion
                            value="vendors"
                            title="Vendors"
                            description="Vendor list and supplier information"
                            icon={Package}
                            color="amber"
                            totalCount={previewData.vendors.count}
                            previewItems={previewData.vendors.preview || []}
                            isEnabled={syncPreferences.syncVendors}
                            selectedIds={syncPreferences.selectedVendorIds}
                            onToggleEnabled={(checked) =>
                              setSyncPreferences((prev) => ({ ...prev, syncVendors: !!checked }))
                            }
                            onToggleItem={(itemId) => toggleItemSelection('vendors', itemId)}
                            onToggleAll={(allIds) => toggleSelectAll('vendors', allIds)}
                            renderItemContent={(item: Record<string, unknown>) => (
                              <span className="font-semibold truncate">{(item.name || item.displayName) as string}</span>
                            )}
                          />
                        )}
                      </Accordion>
                  )}

                  <div className="flex justify-center gap-3 mt-6 pt-6 border-t">
                    <Button variant="outline" onClick={() => stepper.prevStep()}>
                      Back
                    </Button>
                    <Button
                      onClick={handleProceedToSync}
                      disabled={isLoadingPreview || !Object.values(syncPreferences).some((v) => v === true)}
                    >
                      Continue to Sync
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Syncing */}
              {stepper.currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Syncing Your Data</h2>
                    <p className="text-sm text-muted-foreground">
                      Please wait while we import your data from {getIntegrationName()}
                    </p>
                  </div>

                  <div className="max-w-md mx-auto">
                    <Progress value={syncProgress} className="h-2" />
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      {syncProgress}% complete
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Complete */}
              {stepper.currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Connection Successful!</h2>
                    <p className="text-sm text-muted-foreground">
                      {getIntegrationName()} has been connected successfully
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <Button onClick={handleFinish}>
                      Go to Integrations
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function IntegrationConnectionPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-6">Loading...</div>}>
      <ConnectionPageContent />
    </Suspense>
  );
}
