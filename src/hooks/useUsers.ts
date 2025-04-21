import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApiService, User } from '../services/mockApi.js';

/**
 * Custom hook for fetching users using TanStack Query
 */
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await mockApiService.getUsers();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
  });
};

/**
 * Custom hook for fetching a single user by ID
 */
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const response = await mockApiService.getUserById(id);
      if (!response.success || !response.data) {
        throw new Error(response.message);
      }
      return response.data;
    },
    enabled: !!id, // Only run the query if an ID is provided
  });
};

/**
 * Custom hook for creating a new user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: Omit<User, 'id'>) => {
      const response = await mockApiService.createUser(userData);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the users query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
