/**
 * Organization Queries - Query factory functions for organization-related data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// Query Keys Factory
export const organizationKeys = {
  all: ['organization'] as const,
  lists: () => [...organizationKeys.all, 'list'] as const,
  list: (params?: any) => [...organizationKeys.lists(), params] as const,
  detail: (id: string) => [...organizationKeys.all, 'detail', id] as const,
  members: (id: string) => [...organizationKeys.detail(id), 'members'] as const,
  invitations: () => [...organizationKeys.all, 'invitations'] as const,
  wallets: (id: string) => [...organizationKeys.detail(id), 'wallets'] as const,
  portfolio: (id: string) => [...organizationKeys.detail(id), 'portfolio'] as const,
};

// Query Options Factories
export const organizationQueries = {
  organization: (id: string) => ({
    queryKey: organizationKeys.detail(id),
    queryFn: async () => {
      return apiClient.get(`/organizations/${id}`);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  }),

  organizationMembers: (id: string) => ({
    queryKey: organizationKeys.members(id),
    queryFn: async () => {
      return apiClient.get(`/organizations/${id}/members`);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: false,
  }),

  pendingInvitations: () => ({
    queryKey: organizationKeys.invitations(),
    queryFn: async () => {
      return apiClient.get(`/invitations/pending`);
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  }),

  organizationCryptoWallets: (id?: string) => ({
    queryKey: id ? organizationKeys.wallets(id) : ['crypto', 'wallets'],
    queryFn: async () => {
      const endpoint = id
        ? `/organizations/${id}/crypto-wallets`
        : `/crypto-wallets`;
      return apiClient.get(endpoint);
    },
    enabled: !id || !!id,
    staleTime: 1000 * 60 * 5,
    retry: false,
  }),

  organizationCryptoPortfolio: (id?: string) => ({
    queryKey: id ? organizationKeys.portfolio(id) : ['crypto', 'portfolio'],
    queryFn: async () => {
      const endpoint = id
        ? `/organizations/${id}/crypto-portfolio`
        : `/crypto-portfolio`;
      return apiClient.get(endpoint);
    },
    enabled: !id || !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes (portfolio data changes less frequently)
    retry: false,
  }),
};

// Convenience hook exports
export function useOrganization(organizationId: string) {
  return useQuery(organizationQueries.organization(organizationId));
}

export function useOrganizationMembers(organizationId: string) {
  return useQuery(organizationQueries.organizationMembers(organizationId));
}

export function usePendingInvitations() {
  return useQuery(organizationQueries.pendingInvitations());
}

export function useOrganizationCryptoWallets(organizationId?: string) {
  return useQuery(organizationQueries.organizationCryptoWallets(organizationId));
}

export function useOrganizationCryptoPortfolio(organizationId?: string) {
  return useQuery(organizationQueries.organizationCryptoPortfolio(organizationId));
}

// Additional organization-related queries
export function useOrganizations() {
  return useQuery({
    queryKey: organizationKeys.lists(),
    queryFn: async () => {
      return apiClient.get(`/organizations`);
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}


export function useAcceptInvitationByToken(token: string) {
  return useQuery({
    queryKey: [...organizationKeys.invitations(), 'accept', token],
    queryFn: async () => {
      return apiClient.get(`/invitations/${token}`);
    },
    enabled: !!token,
    staleTime: 1000 * 60,
    retry: false,
  });
}

export function useOrganizationSyncCryptoWallet(organizationId: string, walletId: string) {
  return useQuery({
    queryKey: [...organizationKeys.wallets(organizationId), 'sync', walletId],
    queryFn: async () => {
      return apiClient.get(`/organizations/${organizationId}/crypto-wallets/${walletId}/sync`);
    },
    enabled: !!organizationId && !!walletId,
    staleTime: 1000 * 10, // 10 seconds for sync status
    refetchInterval: 3000, // Poll every 3 seconds during sync
    retry: false,
  });
}

export function useOrganizationCryptoWallet(organizationId: string | null | undefined, walletId: string) {
  return useQuery({
    queryKey: [...organizationKeys.wallets(organizationId || ''), walletId],
    queryFn: async () => {
      return apiClient.get(`/organizations/${organizationId}/crypto-wallets/${walletId}`);
    },
    enabled: !!organizationId && !!walletId,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useOrganizationBankingAccounts(organizationId: string) {
  return useQuery({
    queryKey: [...organizationKeys.detail(organizationId), 'banking-accounts'],
    queryFn: async () => {
      return apiClient.get(`/organizations/${organizationId}/banking-accounts`);
    },
    enabled: !!organizationId,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useUpdateMemberRole() {
  return {
    mutate: async (organizationId: string, memberId: string, role: string) => {
      return apiClient.put(`/organizations/${organizationId}/members/${memberId}/role`, { role });
    },
    isLoading: false,
    error: null,
  };
}

export function useRemoveMember() {
  return {
    mutate: async (organizationId: string, memberId: string) => {
      return apiClient.delete(`/organizations/${organizationId}/members/${memberId}`);
    },
    isLoading: false,
    error: null,
  };
}

export function useCreateOrganization() {
  return {
    mutate: async (data: any) => {
      return apiClient.post(`/organizations`, data);
    },
    isLoading: false,
    error: null,
  };
}

export function useUpdateOrganization() {
  return {
    mutate: async (organizationId: string, data: any) => {
      return apiClient.put(`/organizations/${organizationId}`, data);
    },
    isLoading: false,
    error: null,
  };
}

export function useOrganizationDeleteCryptoWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ organizationId, walletId }: { organizationId: string; walletId: string }) => {
      return apiClient.delete(`/organizations/${organizationId}/crypto-wallets/${walletId}`);
    },
    onSuccess: (_, { organizationId, walletId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: organizationKeys.wallets(organizationId) });
      queryClient.invalidateQueries({ queryKey: organizationKeys.portfolio(organizationId) });
    },
  });
}

export function useInviteUser() {
  return {
    mutate: async (organizationId: string, email: string, role?: string) => {
      return apiClient.post(`/organizations/${organizationId}/invite`, { email, role });
    },
    isLoading: false,
    error: null,
  };
}
