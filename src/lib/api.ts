import { ApiResponse, PaginatedResponse, User } from '@/types';
import { z } from 'zod';

/**
 * Base API URL
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

/**
 * Default request options
 */
const defaultOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * User schema for validation
 */
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().optional(),
  role: z.enum(['admin', 'user', 'guest']),
  createdAt: z
    .string()
    .or(z.date())
    .transform((val) => (typeof val === 'string' ? new Date(val) : val)),
});

// Type for the parsed User from the schema
export type UserFromSchema = z.infer<typeof UserSchema>;

/**
 * API response schema for validation
 */
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    status: z.number(),
    message: z.string(),
    success: z.boolean(),
  });

/**
 * Pagination meta schema for validation
 */
export const PaginationMetaSchema = z.object({
  currentPage: z.number(),
  totalPages: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

/**
 * Paginated response schema for validation
 */
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  ApiResponseSchema(dataSchema.array()).extend({
    meta: PaginationMetaSchema,
  });

/**
 * Generic fetch function with error handling and response parsing
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
  schema?: z.ZodType<T>,
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate response data if schema is provided
    if (schema) {
      return schema.parse(data);
    }

    return data as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Type-safe API response types
type UserApiResponse = ApiResponse<UserFromSchema>;
type UsersApiResponse = ApiResponse<UserFromSchema[]>;
type PaginatedUsersResponse = PaginatedResponse<UserFromSchema>;

/**
 * API service with methods for common operations
 */
export const apiService = {
  /**
   * Get all users
   */
  getUsers: () =>
    fetchApi<UsersApiResponse>(
      '/users',
      { method: 'GET' },
      ApiResponseSchema(UserSchema.array()) as z.ZodType<UsersApiResponse>,
    ),

  /**
   * Get a user by ID
   */
  getUser: (id: string) =>
    fetchApi<UserApiResponse>(
      `/users/${id}`,
      { method: 'GET' },
      ApiResponseSchema(UserSchema) as z.ZodType<UserApiResponse>,
    ),

  /**
   * Create a new user
   */
  createUser: (user: Omit<User, 'id' | 'createdAt'>) =>
    fetchApi<UserApiResponse>(
      '/users',
      {
        method: 'POST',
        body: JSON.stringify(user),
      },
      ApiResponseSchema(UserSchema) as z.ZodType<UserApiResponse>,
    ),

  /**
   * Update a user
   */
  updateUser: (id: string, user: Partial<Omit<User, 'id' | 'createdAt'>>) =>
    fetchApi<UserApiResponse>(
      `/users/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(user),
      },
      ApiResponseSchema(UserSchema) as z.ZodType<UserApiResponse>,
    ),

  /**
   * Delete a user
   */
  deleteUser: (id: string) =>
    fetchApi<ApiResponse<null>>(`/users/${id}`, { method: 'DELETE' }, ApiResponseSchema(z.null())),

  /**
   * Get paginated users
   */
  getPaginatedUsers: (page: number = 1, pageSize: number = 10) =>
    fetchApi<PaginatedUsersResponse>(
      `/users?page=${page}&pageSize=${pageSize}`,
      { method: 'GET' },
      PaginatedResponseSchema(UserSchema) as z.ZodType<PaginatedUsersResponse>,
    ),
};
