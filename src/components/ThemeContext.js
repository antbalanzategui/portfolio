import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
      } else if (savedTheme === null) {
        setIsDarkMode(false);
        localStorage.setItem('theme', 'light');
      }
      setLoading(false);
  
      // Update global styling based on theme
      document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);
  
    const toggleTheme = () => {
      const newTheme = isDarkMode ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      setIsDarkMode(!isDarkMode);
    };
  
    const themeContextValue = {
      isDarkMode,
      toggleTheme,
      currentTheme: isDarkMode ? 'dark' : 'light',
    };
  
    if (loading) {
      return (
        <nav>
          <div>Loading...</div>
        </nav>
      );
    }
  
    return (
      <ThemeContext.Provider value={themeContextValue}>
        {children}
      </ThemeContext.Provider>
    );
  };
  
