import { User } from '../types/index.js';
import { delay } from '../lib/utils.js';
import { useUserStore } from '../store/useUserStore.js';

// Helper to check browser environment
const isBrowser = typeof window !== 'undefined';

// Safe localStorage implementation for non-browser environments
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (isBrowser) {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (isBrowser) {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (isBrowser) {
      localStorage.removeItem(key);
    }
  },
};

// Safe Base64 encoding/decoding functions
const safeEncode = (str: string): string => {
  if (isBrowser) {
    return btoa(str);
  }
  // Fallback for Node.js environment
  return Buffer.from(str).toString('base64');
};

const safeDecode = (str: string): string => {
  if (isBrowser) {
    return atob(str);
  }
  // Fallback for Node.js environment
  return Buffer.from(str, 'base64').toString();
};

// 🔧 Mock JWT implementation for demonstration purposes
const MOCK_SECRET = 'typescript-web-secret-key';

/**
 * Simple mock JWT token generator
 * In a real app, this would be handled by a proper JWT library
 */
const generateMockToken = (user: User): string => {
  const header = safeEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = safeEncode(
    JSON.stringify({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      exp: Date.now() + 3600000, // 1 hour expiration
    }),
  );
  const signature = safeEncode(`${MOCK_SECRET}:${header}.${payload}`);

  return `${header}.${payload}.${signature}`;
};

/**
 * Mock credentials for demonstration
 */
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Authentication service with mock JWT implementation
 *
 * @example
 * // Login with email and password
 * const { success, user, token } = await authService.login('admin@example.com', 'password');
 *
 * // Check if token is valid
 * const isValid = authService.verifyToken(token);
 *
 * // Logout
 * authService.logout();
 */
export const authService = {
  /**
   * Login with email and password
   */
  login: async (email: string, password: string) => {
    // Simulate API delay
    await delay(800);

    // Find user by email (in a real app, we would check password hash)
    // Simple password validation for mock implementation
    const isValidPassword = password && password.length > 0;
    if (!isValidPassword) {
      return { success: false, message: 'Password is required' };
    }

    const user = MOCK_USERS.find((u) => u.email === email);

    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Generate token
    const token = generateMockToken(user);

    // Store token in localStorage
    safeLocalStorage.setItem('auth_token', token);

    // Update global state
    useUserStore.getState().login(user);

    return { success: true, user, token };
  },

  /**
   * Logout current user
   */
  logout: () => {
    // Remove token from localStorage
    safeLocalStorage.removeItem('auth_token');

    // Update global state
    useUserStore.getState().logout();

    return { success: true };
  },

  /**
   * Verify if token is valid
   */
  verifyToken: (token: string) => {
    try {
      // In a real app, we would verify the signature and check expiration
      const [, payloadBase64] = token.split('.');
      const payload = JSON.parse(safeDecode(payloadBase64));

      // Check if token is expired
      return payload.exp > Date.now();
    } catch (error) {
      return false;
    }
  },

  /**
   * Get current auth token
   */
  getToken: () => {
    return safeLocalStorage.getItem('auth_token');
  },

  /**
   * Initialize auth from stored token
   */
  initAuth: async () => {
    const token = safeLocalStorage.getItem('auth_token');

    if (token) {
      try {
        // Verify token
        const isValid = authService.verifyToken(token);

        if (isValid) {
          // Decode token to get user info
          const [, payloadBase64] = token.split('.');
          const payload = JSON.parse(safeDecode(payloadBase64));

          // Find user by ID
          const user = MOCK_USERS.find((u) => u.id === payload.sub);

          if (user) {
            // Update global state
            useUserStore.getState().login(user);
            return { success: true, user };
          }
        }

        // Token is invalid or user not found
        safeLocalStorage.removeItem('auth_token');
      } catch (error) {
        safeLocalStorage.removeItem('auth_token');
      }
    }

    return { success: false };
  },
};
