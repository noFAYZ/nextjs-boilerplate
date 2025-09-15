import { ApiResponse, AUTH_ERROR_CODES, AuthError, BetterAuthResponse } from './types';
import { logger } from './utils/logger';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  private async getAuthToken(): Promise<string | null> {
    // In a browser environment, get token from better-auth session
    if (typeof window !== 'undefined') {
      try {
        const { getSession } = await import('@/lib/auth-client');
        const result = await getSession();
        
        // Handle different response structures
        if (result && typeof result === 'object') {
          if ('data' in result && result.data?.session?.token) {
            return result.data.session.token;
          }
          if ('session' in result && (result as BetterAuthResponse).session?.token) {
            return (result as BetterAuthResponse).session!.token;
          }
        }
        
        return null;
      } catch {
        return this.token;
      }
    }
    return this.token;
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = await this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private handleError(error: unknown): AuthError {
    if (typeof error === 'object' && error !== null) {
      const err = error as { name?: string; response?: { status: number }; message?: string };
      
      if (err.name === 'NetworkError' || !err.response) {
        logger.error('Network error in API request', error);
        return {
          code: AUTH_ERROR_CODES.NETWORK_ERROR,
          message: 'Network error. Please check your connection.',
        };
      }

      if (err.response?.status === 429) {
        logger.warn('Rate limit exceeded for API request', { status: err.response.status });
        return {
          code: AUTH_ERROR_CODES.RATE_LIMITED,
          message: 'Too many requests. Please try again later.',
        };
      }

      logger.error('API request error', error, { status: err.response?.status });
      return {
        code: AUTH_ERROR_CODES.UNKNOWN_ERROR,
        message: err.message || 'An unexpected error occurred.',
        details: error,
      };
    }

    return {
      code: AUTH_ERROR_CODES.UNKNOWN_ERROR,
      message: 'An unexpected error occurred.',
      details: error,
    };
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = await this.getHeaders();

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

      return data as ApiResponse<T>;
    } catch (error) {
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

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
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
    wallets: Record<string, any>;
    totalWallets: number;
    syncingCount: number;
  }>> {
    return this.get('/crypto/user/wallets/sync/status');
  }
}

export const apiClient = new ApiClient();