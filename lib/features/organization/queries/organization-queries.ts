/**
 * Organization Queries - Query factory functions for organization-related data
 */

import { useQuery } from '@tanstack/react-query';

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
      try {
        const response = await fetch(`/api/organizations/${id}`);
        if (!response.ok) throw new Error('Failed to fetch organization');
        return response.json();
      } catch (error) {
        console.error('Failed to fetch organization:', error);
        return { success: false, data: null };
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  }),

  organizationMembers: (id: string) => ({
    queryKey: organizationKeys.members(id),
    queryFn: async () => {
      try {
        const response = await fetch(`/api/organizations/${id}/members`);
        if (!response.ok) throw new Error('Failed to fetch members');
        return response.json();
      } catch (error) {
        console.error('Failed to fetch organization members:', error);
        return { success: false, data: [] };
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: false,
  }),

  pendingInvitations: () => ({
    queryKey: organizationKeys.invitations(),
    queryFn: async () => {
      try {
        const response = await fetch(`/api/invitations/pending`);
        if (!response.ok) throw new Error('Failed to fetch invitations');
        return response.json();
      } catch (error) {
        console.error('Failed to fetch pending invitations:', error);
        return { success: false, data: [] };
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  }),

  organizationCryptoWallets: (id?: string) => ({
    queryKey: id ? organizationKeys.wallets(id) : ['crypto', 'wallets'],
    queryFn: async () => {
      try {
        const url = id
          ? `/api/organizations/${id}/crypto-wallets`
          : `/api/crypto-wallets`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch wallets');
        return response.json();
      } catch (error) {
        console.error('Failed to fetch crypto wallets:', error);
        return { success: false, data: [] };
      }
    },
    enabled: !id || !!id,
    staleTime: 1000 * 60 * 5,
    retry: false,
  }),

  organizationCryptoPortfolio: (id?: string) => ({
    queryKey: id ? organizationKeys.portfolio(id) : ['crypto', 'portfolio'],
    queryFn: async () => {
      try {
        const url = id
          ? `/api/organizations/${id}/crypto-portfolio`
          : `/api/crypto-portfolio`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch portfolio');
        return response.json();
      } catch (error) {
        console.error('Failed to fetch crypto portfolio:', error);
        return { success: false, data: null };
      }
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
      try {
        const response = await fetch(`/api/organizations`);
        if (!response.ok) throw new Error('Failed to fetch organizations');
        return response.json();
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
        return { success: false, data: [] };
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function usePersonalOrganization() {
  return useQuery({
    queryKey: [...organizationKeys.all, 'personal'],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/organizations/personal`);
        if (!response.ok) throw new Error('Failed to fetch personal organization');
        return response.json();
      } catch (error) {
        console.error('Failed to fetch personal organization:', error);
        return { success: false, data: null };
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useAcceptInvitationByToken(token: string) {
  return useQuery({
    queryKey: [...organizationKeys.invitations(), 'accept', token],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/invitations/${token}`);
        if (!response.ok) throw new Error('Failed to fetch invitation');
        return response.json();
      } catch (error) {
        console.error('Failed to fetch invitation:', error);
        return { success: false, data: null };
      }
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
      try {
        const response = await fetch(
          `/api/organizations/${organizationId}/crypto-wallets/${walletId}/sync`
        );
        if (!response.ok) throw new Error('Failed to fetch sync status');
        return response.json();
      } catch (error) {
        console.error('Failed to fetch sync status:', error);
        return { success: false, data: null };
      }
    },
    enabled: !!organizationId && !!walletId,
    staleTime: 1000 * 10, // 10 seconds for sync status
    refetchInterval: 3000, // Poll every 3 seconds during sync
    retry: false,
  });
}

export function useOrganizationCryptoWallet(organizationId: string, walletId: string) {
  return useQuery({
    queryKey: [...organizationKeys.wallets(organizationId), walletId],
    queryFn: async () => {
      try {
        const response = await fetch(
          `/api/organizations/${organizationId}/crypto-wallets/${walletId}`
        );
        if (!response.ok) throw new Error('Failed to fetch wallet');
        return response.json();
      } catch (error) {
        console.error('Failed to fetch wallet:', error);
        return { success: false, data: null };
      }
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
      try {
        const response = await fetch(
          `/api/organizations/${organizationId}/banking-accounts`
        );
        if (!response.ok) throw new Error('Failed to fetch banking accounts');
        return response.json();
      } catch (error) {
        console.error('Failed to fetch banking accounts:', error);
        return { success: false, data: [] };
      }
    },
    enabled: !!organizationId,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useUpdateMemberRole() {
  return {
    mutate: async (organizationId: string, memberId: string, role: string) => {
      try {
        const response = await fetch(
          `/api/organizations/${organizationId}/members/${memberId}/role`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role }),
          }
        );
        if (!response.ok) throw new Error('Failed to update member role');
        return response.json();
      } catch (error) {
        console.error('Failed to update member role:', error);
        throw error;
      }
    },
    isLoading: false,
    error: null,
  };
}

export function useRemoveMember() {
  return {
    mutate: async (organizationId: string, memberId: string) => {
      try {
        const response = await fetch(
          `/api/organizations/${organizationId}/members/${memberId}`,
          { method: 'DELETE' }
        );
        if (!response.ok) throw new Error('Failed to remove member');
        return response.json();
      } catch (error) {
        console.error('Failed to remove member:', error);
        throw error;
      }
    },
    isLoading: false,
    error: null,
  };
}

export function useCreateOrganization() {
  return {
    mutate: async (data: any) => {
      try {
        const response = await fetch(`/api/organizations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create organization');
        return response.json();
      } catch (error) {
        console.error('Failed to create organization:', error);
        throw error;
      }
    },
    isLoading: false,
    error: null,
  };
}

export function useUpdateOrganization() {
  return {
    mutate: async (organizationId: string, data: any) => {
      try {
        const response = await fetch(`/api/organizations/${organizationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update organization');
        return response.json();
      } catch (error) {
        console.error('Failed to update organization:', error);
        throw error;
      }
    },
    isLoading: false,
    error: null,
  };
}

export function useInviteUser() {
  return {
    mutate: async (organizationId: string, email: string, role?: string) => {
      try {
        const response = await fetch(
          `/api/organizations/${organizationId}/invite`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, role }),
          }
        );
        if (!response.ok) throw new Error('Failed to invite user');
        return response.json();
      } catch (error) {
        console.error('Failed to invite user:', error);
        throw error;
      }
    },
    isLoading: false,
    error: null,
  };
}
