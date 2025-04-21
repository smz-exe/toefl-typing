import React, { useState } from 'react';
import { UserForm } from '../components/UserForm.js';
import { Button } from '../components/ui/Button.js';
import { LucideCode, LucideSettings, LucideUser, LucideLayout } from 'lucide-react';
import UIShowcase from '../components/UIShowcase.js';

// Define the form data type
interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'guest';
}

/**
 * Home page component showcasing various features of the template
 */
export const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'form' | 'api' | 'buttons' | 'showcase'>('form');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<UserFormData | null>(null);

  const handleFormSubmit = (data: UserFormData) => {
    setFormData(data);
    setFormSubmitted(true);
    // In a real app, you would call the API service here
    // apiService.createUser(data);
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to TypeScript Modern Web Boilerplate
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          A modern web application template built with React, TypeScript, TailwindCSS, and more.
          This template includes everything you need to build a modern web application.
        </p>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('form')}
            className={`${
              activeTab === 'form'
                ? 'border-primary text-primary dark:text-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
          >
            <LucideUser className="h-5 w-5 mr-2" />
            Form Example
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`${
              activeTab === 'api'
                ? 'border-primary text-primary dark:text-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
          >
            <LucideCode className="h-5 w-5 mr-2" />
            API Example
          </button>
          <button
            onClick={() => setActiveTab('buttons')}
            className={`${
              activeTab === 'buttons'
                ? 'border-primary text-primary dark:text-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
          >
            <LucideSettings className="h-5 w-5 mr-2" />
            Button Components
          </button>
          <button
            onClick={() => setActiveTab('showcase')}
            className={`${
              activeTab === 'showcase'
                ? 'border-primary text-primary dark:text-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
          >
            <LucideLayout className="h-5 w-5 mr-2" />
            UI Showcase
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'form' && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors duration-200">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              User Form with React Hook Form + Zod
            </h2>
            {formSubmitted ? (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 px-4 py-3 rounded transition-colors duration-200">
                  Form submitted successfully!
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                  <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                    {JSON.stringify(formData, null, 2)}
                  </pre>
                </div>
                <Button onClick={() => setFormSubmitted(false)}>Submit Another</Button>
              </div>
            ) : (
              <UserForm onSubmit={handleFormSubmit} />
            )}
          </div>
        )}

        {activeTab === 'api' && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors duration-200">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              API Integration with TanStack Query
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                This example demonstrates how to use TanStack Query with a typed API service. In a
                real application, this would fetch data from your backend.
              </p>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                  {`
// Import the necessary hooks
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api';

// Example API call with TanStack Query
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: () => apiService.getUsers()
});
                  `}
                </pre>
              </div>
              <Button
                onClick={() => {
                  // This would trigger a refetch in a real app
                  alert('In a real app, this would fetch data from your API');
                }}
              >
                Simulate API Call
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'buttons' && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors duration-200">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Button Variants
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              <div className="space-y-2">
                <Button variant="default">Default</Button>
                <p className="text-sm text-gray-500 dark:text-gray-400">Default</p>
              </div>
              <div className="space-y-2">
                <Button variant="destructive">Destructive</Button>
                <p className="text-sm text-gray-500 dark:text-gray-400">Destructive</p>
              </div>
              <div className="space-y-2">
                <Button variant="outline">Outline</Button>
                <p className="text-sm text-gray-500 dark:text-gray-400">Outline</p>
              </div>
              <div className="space-y-2">
                <Button variant="secondary">Secondary</Button>
                <p className="text-sm text-gray-500 dark:text-gray-400">Secondary</p>
              </div>
              <div className="space-y-2">
                <Button variant="ghost">Ghost</Button>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ghost</p>
              </div>
              <div className="space-y-2">
                <Button variant="link">Link</Button>
                <p className="text-sm text-gray-500 dark:text-gray-400">Link</p>
              </div>
            </div>

            <h2 className="text-lg font-medium text-gray-900 dark:text-white mt-8 mb-4">
              Button Sizes
            </h2>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="space-y-2">
                <Button size="default">Default</Button>
                <p className="text-sm text-gray-500 dark:text-gray-400">Default</p>
              </div>
              <div className="space-y-2">
                <Button size="sm">Small</Button>
                <p className="text-sm text-gray-500 dark:text-gray-400">Small</p>
              </div>
              <div className="space-y-2">
                <Button size="lg">Large</Button>
                <p className="text-sm text-gray-500 dark:text-gray-400">Large</p>
              </div>
              <div className="space-y-2">
                <Button size="icon">
                  <LucideSettings className="h-4 w-4" />
                </Button>
                <p className="text-sm text-gray-500 dark:text-gray-400">Icon</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'showcase' && <UIShowcase />}
      </div>
    </div>
  );
};

export default Home;
