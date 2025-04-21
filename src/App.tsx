import React, { useEffect, lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Home from './pages/Home.js';
import Dashboard from './pages/Dashboard.js';
import Users from './pages/Users.js';
import Login from './pages/Login.js';
// Lazy load the About page for code splitting demonstration
const About = lazy(() => import('./pages/About.js'));
import Layout from './components/layout/Layout.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { authService } from './services/authService.js';
import { useUserStore } from './store/useUserStore.js';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Define routes
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Layout>
          <Dashboard />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute>
        <Layout>
          <Users />
        </Layout>
      </ProtectedRoute>
    ),
  },
  // About page with lazy loading
  {
    path: '/about',
    element: (
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }
      >
        <Layout>
          <About />
        </Layout>
      </Suspense>
    ),
  },
  // Catch-all route for 404
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

/**
 * Main App component that sets up the application with React Router and TanStack Query
 */
function App() {
  // Initialize authentication from stored token
  useEffect(() => {
    const initializeAuth = async () => {
      await authService.initAuth();
    };

    initializeAuth();
  }, []);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
