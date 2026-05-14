import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('vibetape-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.setProperty('--bg-primary', '#020617');
      root.style.setProperty('--bg-secondary', '#050a1f');
      root.style.setProperty('--bg-card', '#070e2b');
      root.style.setProperty('--text-primary', '#FFFFFF');
      root.style.setProperty('--text-secondary', '#A1A1AA');
      root.style.setProperty('--border-color', 'rgba(255,255,255,0.05)');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.style.setProperty('--bg-primary', '#F8FAFC');
      root.style.setProperty('--bg-secondary', '#FFFFFF');
      root.style.setProperty('--bg-card', '#F1F5F9');
      root.style.setProperty('--text-primary', '#0F172A');
      root.style.setProperty('--text-secondary', '#64748B');
      root.style.setProperty('--border-color', 'rgba(0,0,0,0.08)');
    }
    localStorage.setItem('vibetape-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
