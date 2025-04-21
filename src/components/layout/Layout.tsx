import React from 'react';
import { Outlet } from 'react-router-dom';
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

      {/* Header removed to provide more space for the typing interface */}

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children || <Outlet />}</div>
      </main>

      <footer className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} TOEFL Typing Practice. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
