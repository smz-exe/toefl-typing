import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Theme provider component that manages the application theme
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    return savedTheme || 'system';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Update the theme when it changes
  useEffect(() => {
    const root = window.document.documentElement;

    // Save theme to localStorage
    localStorage.setItem('theme', theme);

    // Remove previous theme classes
    root.classList.remove('light', 'dark');

    // Determine if dark mode should be applied
    let darkMode = false;

    if (theme === 'system') {
      // Check system preference
      darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      darkMode = theme === 'dark';
    }

    // Apply the appropriate class
    root.classList.add(darkMode ? 'dark' : 'light');
    setIsDarkMode(darkMode);
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const root = window.document.documentElement;
      const isDark = mediaQuery.matches;

      root.classList.remove('light', 'dark');
      root.classList.add(isDark ? 'dark' : 'light');
      setIsDarkMode(isDark);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value = {
    theme,
    setTheme,
    isDarkMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Custom hook to use the theme context
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
