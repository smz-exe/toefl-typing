import React from 'react';
import { Outlet } from 'react-router-dom';
import { LucideGithub } from 'lucide-react';
import Navigation from './Navigation.js';

interface LayoutProps {
  children?: React.ReactNode;
}

/**
 * Main layout component that provides consistent structure across pages
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navigation />

      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            TypeScript Modern Web Boilerplate
          </h1>
          <div className="flex space-x-2">
            <a
              href="https://github.com/smz-exe/typescript-modern-web-boilerplate"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <LucideGithub className="h-5 w-5 mr-2" />
              GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children || <Outlet />}</div>
      </main>

      <footer className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} TypeScript Modern Web Boilerplate. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
