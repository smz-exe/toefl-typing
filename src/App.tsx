import React, { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Home from './pages/Home.js';
import TypingPractice from './pages/TypingPractice.js';
import PassageLibrary from './pages/PassageLibrary.js';
import Statistics from './pages/Statistics.js';
import Settings from './pages/Settings.js';
// Lazy load the About page for code splitting demonstration
const About = lazy(() => import('./pages/About.js'));
import Layout from './components/layout/Layout.js';
import { ThemeProvider } from './context/ThemeContext.js';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Create a query client

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
    path: '/practice/:passageId?',
    element: (
      <Layout>
        <TypingPractice />
      </Layout>
    ),
  },
  {
    path: '/passages',
    element: (
      <Layout>
        <PassageLibrary />
      </Layout>
    ),
  },
  {
    path: '/statistics',
    element: (
      <Layout>
        <Statistics />
      </Layout>
    ),
  },
  {
    path: '/settings',
    element: (
      <Layout>
        <Settings />
      </Layout>
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
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
