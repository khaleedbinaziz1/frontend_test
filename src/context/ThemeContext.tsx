'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeSettings {
  typography: {
    headingFont: string;
    bodyFont: string;
    baseSize: string;
    scale: number;
  };
}

const defaultTheme: ThemeSettings = {
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    baseSize: '16px',
    scale: 1.25
  }
};

interface ThemeContextType {
  theme: ThemeSettings;
  updateTheme: (newTheme: ThemeSettings) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Function to apply theme to CSS variables
const applyThemeToCSS = (theme: ThemeSettings) => {
  const root = document.documentElement;
  root.style.setProperty('--font-heading', `'${theme.typography.headingFont}', sans-serif`);
  root.style.setProperty('--font-body', `'${theme.typography.bodyFont}', sans-serif`);
  root.style.setProperty('--font-size-base', theme.typography.baseSize);
  root.style.setProperty('--font-scale', String(theme.typography.scale || 1.25));
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        try {
          const parsedTheme = JSON.parse(savedTheme);
          if (parsedTheme.typography) {
            parsedTheme.typography.scale = Number(parsedTheme.typography.scale) || 1.25;
          }
          return parsedTheme;
        } catch (e) {
          console.error('Error parsing saved theme:', e);
        }
      }
    }
    return defaultTheme;
  });

  useEffect(() => {
    applyThemeToCSS(theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', JSON.stringify(theme));
    }
  }, [theme]);

  const updateTheme = (newTheme: ThemeSettings) => {
    setTheme(newTheme);
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('theme');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
