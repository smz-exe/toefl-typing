import React from 'react';

/**
 * About page component that is lazy-loaded for demonstration purposes
 * This component is intentionally simple to show how lazy loading works
 */
export const About: React.FC = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          About This Template
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          This is a demonstration of a lazy-loaded component. When you navigate to this page, the
          JavaScript for this component is loaded on demand, reducing the initial bundle size.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors duration-200">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Template Features
        </h2>

        <ul className="space-y-2 list-disc pl-5 text-gray-600 dark:text-gray-300">
          <li>TypeScript for type safety</li>
          <li>React with functional components and hooks</li>
          <li>TailwindCSS for utility-first styling</li>
          <li>Vite for fast development and optimized builds</li>
          <li>React Router for client-side routing</li>
          <li>TanStack Query for data fetching</li>
          <li>React Hook Form with Zod for form validation</li>
          <li>Shadcn/ui components for consistent design</li>
          <li>Zustand for global state management</li>
          <li>Vitest for unit testing</li>
          <li>Code splitting and lazy loading</li>
        </ul>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
          <h3 className="text-md font-medium text-blue-800 dark:text-blue-300 mb-2">
            Lazy Loading Implementation
          </h3>
          <pre className="text-sm overflow-x-auto p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
            {`
// In App.tsx or your router configuration
import { lazy, Suspense } from 'react';

// Lazy load the About component
const About = lazy(() => import('./pages/About'));

// Use with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <About />
</Suspense>
            `}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default About;
