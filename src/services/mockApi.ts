import { z } from 'zod';
import { delay } from '../lib/utils.js';

/**
 * Mock user data schema
 */
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'guest']),
});

export type User = z.infer<typeof UserSchema>;

/**
 * Mock users data
 */
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'guest',
  },
];

/**
 * Mock API response schema
 */
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    success: z.boolean(),
    message: z.string(),
  });

export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message: string;
};

/**
 * Mock API service
 */
export const mockApiService = {
  /**
   * Get all users
   */
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    // Simulate API delay
    await delay(500);

    return {
      data: MOCK_USERS,
      success: true,
      message: 'Users fetched successfully',
    };
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<ApiResponse<User | null>> => {
    // Simulate API delay
    await delay(500);

    const user = MOCK_USERS.find((user) => user.id === id);

    if (!user) {
      return {
        data: null,
        success: false,
        message: `User with ID ${id} not found`,
      };
    }

    return {
      data: user,
      success: true,
      message: 'User fetched successfully',
    };
  },

  /**
   * Create a new user
   */
  createUser: async (userData: Omit<User, 'id'>): Promise<ApiResponse<User>> => {
    // Simulate API delay
    await delay(500);

    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substring(2, 9),
    };

    // In a real app, we would add the user to the database
    // For this mock, we'll just return the new user

    return {
      data: newUser,
      success: true,
      message: 'User created successfully',
    };
  },
};
