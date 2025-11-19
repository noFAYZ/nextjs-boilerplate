import { ApiResponse, AUTH_ERROR_CODES, API_ERROR_CODES, AuthError, BetterAuthResponse } from './types';
import { logger } from './utils/logger';
import { errorHandler } from './utils/error-handler';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private consecutiveFailures: number = 0;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';
  }

  private notifyErrorHandler(error: { code: string; message: string }) {
    // Notify the global error handler if available
    if (typeof window !== 'undefined') {
      const globalWindow = window as unknown as Record<string, unknown>;
      if (globalWindow.showBackendError) {
        (globalWindow.showBackendError as (error: { code: string; message: string }) => void)(error);
      }
    }
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  private async getHeaders(organizationId?: string): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Get organization from context store if not explicitly provided
    let orgId = organizationId;
    if (!orgId && typeof window !== 'undefined') {
      try {
        // Dynamically import to avoid circular dependencies
        const { useOrganizationStore } = await import('@/lib/stores/organization-store');
        const selectedOrgId = useOrganizationStore.getState().selectedOrganizationId;
        if (selectedOrgId) {
          orgId = selectedOrgId;
        }
      } catch (error) {
        // Organization store not available, skip
      }
    }

    // Add organization context if available (via header and query param for maximum compatibility)
    if (orgId) {
      headers['X-Organization-Id'] = orgId;
      console.log('[ApiClient] Adding organization header:', { orgId, header: 'X-Organization-Id' });
    } else {
      console.log('[ApiClient] No organization ID, sending request without org header');
    }

    return headers;
  }

  private handleError(error: unknown): AuthError {
    // Use centralized error handler
    const appError = errorHandler.handleError(error, 'api-client', {
      showToast: false, // Don't show toast here, let the caller decide
      logError: true,
      throwError: false
    });

    // Track consecutive failures for backend errors
    if (appError.code === 'BACKEND_UNREACHABLE' || appError.code === 'BACKEND_DOWN') {
      this.consecutiveFailures++;

      // Trigger global error handler after 2 consecutive failures
      if (this.consecutiveFailures >= 2) {
        setTimeout(() => {
          this.notifyErrorHandler({
            code: appError.code,
            message: appError.message
          });
        }, 100);
      }
    } else {
      // Reset consecutive failures for non-backend errors
      this.consecutiveFailures = 0;
    }

    return {
      code: appError.code,
      message: appError.message,
      details: appError.details,
    };
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    organizationId?: string
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = await this.getHeaders(organizationId);

      const response = await fetch(url, {
        headers,
        credentials: 'include', // Include cookies for better-auth
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific HTTP status codes
        if (response.status === 401) {
          // Unauthorized - token might be expired
          logger.warn('Unauthorized API request', { endpoint, status: 401 });
          throw {
            response,
            message: 'Authentication required',
            code: 'UNAUTHORIZED',
            details: data,
          };
        }
        
        if (response.status === 403) {
          // Forbidden - insufficient permissions
          logger.warn('Forbidden API request', { endpoint, status: 403 });
          throw {
            response,
            message: 'Insufficient permissions',
            code: 'FORBIDDEN',
            details: data,
          };
        }

        if (response.status === 404) {
          // API endpoint not implemented yet (common during development)
          logger.info('API endpoint not yet implemented', { endpoint, status: 404 });
          throw {
            response,
            message: 'Feature not yet available',
            code: 'NOT_IMPLEMENTED',
            details: data,
          };
        }

        logger.error('API request failed', { endpoint, status: response.status, error: data.error });
        throw {
          response,
          message: data.error?.message || 'Request failed',
          details: data,
        };
      }

      // Reset consecutive failures on successful response
      this.consecutiveFailures = 0;

      return data as ApiResponse<T>;
    } catch (error) {
      // Check if error has a code property (thrown by us in the try block)
      if (error && typeof error === 'object' && 'code' in error) {
        const err = error as { code: string; message?: string; details?: unknown };
        return {
          success: false,
          error: {
            code: err.code,
            message: err.message || 'Request failed',
            details: err.details,
          },
        };
      }

      // Otherwise use the centralized error handler
      const authError = this.handleError(error);

      return {
        success: false,
        error: {
          code: authError.code,
          message: authError.message,
          details: authError.details,
        },
      };
    }
  }

  async get<T>(endpoint: string, organizationId?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, organizationId);
  }

  async post<T>(endpoint: string, data?: unknown, organizationId?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, organizationId);
  }

  async put<T>(endpoint: string, data?: unknown, organizationId?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }, organizationId);
  }

  async patch<T>(endpoint: string, data?: unknown, organizationId?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }, organizationId);
  }

  async delete<T>(endpoint: string, organizationId?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, organizationId);
  }

  // Authentication specific methods
  async getCurrentSession(): Promise<ApiResponse<{ user: unknown; session: unknown }>> {
    return this.get('/session');
  }

  async getUserProfile(): Promise<ApiResponse<unknown>> {
    return this.get('/profile');
  }

  async updateUserProfile(data: unknown): Promise<ApiResponse<unknown>> {
    return this.patch('/profile', data);
  }

  async getUserStats(): Promise<ApiResponse<unknown>> {
    return this.get('/stats');
  }

  async deleteUserAccount(): Promise<ApiResponse<unknown>> {
    return this.delete('/account');
  }

  // Health check method
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await fetch(`${this.baseURL.replace('/api/v1', '')}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Health check failed with status: ${response.status}`);
      }

      const healthData = await response.json() as { status: string; timestamp: string };

      // Reset consecutive failures on successful health check
      this.consecutiveFailures = 0;

      return healthData;
    } catch (error) {
      logger.error('Health check failed', error);
      this.handleError(error);
      throw error;
    }
  }

  // Get current backend status
  getBackendStatus() {
    return {
      consecutiveFailures: this.consecutiveFailures,
      isHealthy: this.consecutiveFailures < 2,
    };
  }

  // Server-Sent Events (SSE) support
  async createEventSource(endpoint: string, options?: {
    withCredentials?: boolean;
    onOpen?: () => void;
    onMessage?: (event: MessageEvent) => void;
    onError?: (event: Event) => void;
    timeout?: number;
  }): Promise<EventSource> {
    const token = await this.getAuthToken();
    const url = new URL(`${this.baseURL}${endpoint}`);

    // Add auth token as query parameter for SSE
    

    const eventSource = new EventSource(url.toString(), {
      withCredentials: true
    });

    // Setup event listeners if provided
    if (options?.onOpen) {
      eventSource.onopen = options.onOpen;
    }

    if (options?.onMessage) {
      eventSource.onmessage = options.onMessage;
    }

    if (options?.onError) {
      eventSource.onerror = options.onError;
    }

    // Optional timeout handling
    if (options?.timeout) {
      setTimeout(() => {
        if (eventSource.readyState === EventSource.CONNECTING) {
          eventSource.close();
          if (options.onError) {
            options.onError(new Event('timeout'));
          }
        }
      }, options.timeout);
    }

    return eventSource;
  }

  // Crypto-specific API methods
  async triggerWalletSync(walletId: string, syncOptions?: {
    syncAssets?: boolean;
    syncTransactions?: boolean;
    syncNFTs?: boolean;
    syncDeFi?: boolean;
  }): Promise<ApiResponse<unknown>> {
    return this.post(`/crypto/wallets/${walletId}/sync`, {
      syncAssets: true,
      syncTransactions: true,
      syncNFTs: true,
      syncDeFi: true,
      ...syncOptions
    });
  }

  async getWalletSyncStatus(): Promise<ApiResponse<{
    wallets: Record<string, unknown>;
    totalWallets: number;
    syncingCount: number;
  }>> {
    return this.get('/crypto/user/wallets/sync/status');
  }
}

export const apiClient = new ApiClient();