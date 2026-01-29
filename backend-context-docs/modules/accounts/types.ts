// Accounts Module Type Definitions

export interface AccountGroup {
  id: string;
  userId: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  accountCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupMember {
  id: string;
  groupId: string;
  accountId: string;
  accountType: 'crypto' | 'banking';
  addedAt: Date;
}

export interface AccountPreference {
  id: string;
  accountId: string;
  includeInPortfolio: boolean;
  autoSync: boolean;
  customLabel?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupPortfolio {
  groupId: string;
  totalBalance: number;
  accountCount: number;
  accounts: Array<{
    id: string;
    balance: number;
    type: string;
  }>;
}

export interface CreateGroupDTO {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface UpdateGroupDTO {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface UpdatePreferenceDTO {
  includeInPortfolio?: boolean;
  autoSync?: boolean;
  customLabel?: string;
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export class AccountServiceError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AccountServiceError';
  }
}
