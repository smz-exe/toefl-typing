import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/index.js';

// 🚀 Simple Zustand store with persistence
interface UserState {
  // State
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
}

/**
 * Global user store with persistence
 *
 * @example
 * // In a component
 * const { user, login, logout } = useUserStore();
 *
 * // Login a user
 * login({ id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' });
 *
 * // Access user data
 * console.log(user?.name);
 *
 * // Logout
 * logout();
 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,

      // Actions
      setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
      login: (user: User) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage', // localStorage key
      partialize: (state: UserState) => ({ user: state.user }), // Only persist user data
    },
  ),
);
