/**
 * Common types used throughout the application
 */

/**
 * User type representing a user in the system
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date | string;
}

/**
 * API response wrapper type
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  success: boolean;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated response type
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

/**
 * Theme type for the application
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Sort direction type
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort options type
 */
export interface SortOptions {
  field: string;
  direction: SortDirection;
}
