import React from 'react';
import { LucideSun, LucideMoon, LucideMonitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.js';
import { Button } from './ui/Button.js';

/**
 * Theme toggle component that allows switching between light, dark, and system themes
 */
export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, isDarkMode } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme('light')}
        className={`${theme === 'light' ? 'bg-gray-100 dark:bg-gray-700' : ''} transition-colors duration-200`}
        title="Light mode"
      >
        <LucideSun
          className={`h-5 w-5 ${!isDarkMode ? 'text-amber-500' : 'text-gray-400 dark:text-gray-300'}`}
        />
        <span className="sr-only">Light mode</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme('dark')}
        className={`${theme === 'dark' ? 'bg-gray-100 dark:bg-gray-700' : ''} transition-colors duration-200`}
        title="Dark mode"
      >
        <LucideMoon className={`h-5 w-5 ${isDarkMode ? 'text-indigo-400' : 'text-gray-400'}`} />
        <span className="sr-only">Dark mode</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme('system')}
        className={`${theme === 'system' ? 'bg-gray-100 dark:bg-gray-700' : ''} transition-colors duration-200`}
        title="System preference"
      >
        <LucideMonitor
          className={`h-5 w-5 ${theme === 'system' ? (isDarkMode ? 'text-indigo-400' : 'text-amber-500') : 'text-gray-400 dark:text-gray-300'}`}
        />
        <span className="sr-only">System preference</span>
      </Button>
    </div>
  );
};

export default ThemeToggle;
