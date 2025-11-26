// Custom Account Categories Types
// Based on Accounts System Update - Frontend Integration Guide

// Custom Category Interface
export interface CustomAccountCategory {
  id: string;
  userId?: string;
  organizationId?: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string | null;
  path: string; // e.g., "assets/realestate/rental"
  depth: number; // 1-5
  appliedToTypes: string[]; // Account types this category applies to
  isDefault: boolean;
  children?: CustomAccountCategory[]; // For hierarchical responses
  createdAt: string;
  updatedAt: string;
}

// Create Custom Category Request
export interface CreateCustomCategoryRequest {
  name: string;
  description?: string;
  parentId?: string | null;
  appliedToTypes: string[];
  color?: string;
  icon?: string;
}

// Update Custom Category Request
export interface UpdateCustomCategoryRequest {
  name?: string;
  description?: string;
  parentId?: string | null;
  appliedToTypes?: string[];
  color?: string;
  icon?: string;
}

// Map Account to Category Request
export interface MapAccountToCategoryRequest {
  priority: number; // 1=primary, 2=secondary, etc.
}

// Category with Accounts Response
export interface CustomCategoryWithAccounts {
  category: CustomAccountCategory;
  accountCount: number;
  accounts: Array<{
    id: string;
    name: string;
    type: string;
    subtype?: string;
    balance: number;
    customCategories?: Array<{
      id: string;
      name: string;
      priority: number;
    }>;
  }>;
}

// List Categories Response
export interface ListCategoriesResponse {
  success: boolean;
  data: CustomAccountCategory[];
  count: number;
}

// Category Details Response
export interface CategoryDetailsResponse {
  success: boolean;
  data: CustomAccountCategory;
}

// Create Category Response
export interface CreateCategoryResponse {
  success: boolean;
  data: CustomAccountCategory;
}

// Delete Category Response
export interface DeleteCategoryResponse {
  success: boolean;
  message: string;
}

// Map Account Response
export interface MapAccountResponse {
  success: boolean;
  message: string;
}

// Categories Query Parameters
export interface ListCategoriesParams {
  organizationId?: string;
  includeChildren?: boolean;
  includeAccounts?: boolean;
  appliedToType?: string;
  limit?: number;
  offset?: number;
}
