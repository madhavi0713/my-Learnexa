import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') ?? 'light';
  });

  useEffect(() => {
    // Apply to <html> — NOT <body> — ensures 100% coverage
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply immediately on first load before render (prevents flash)
  useEffect(() => {
    const saved = localStorage.getItem('theme') ?? 'light';
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () =>
    setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
