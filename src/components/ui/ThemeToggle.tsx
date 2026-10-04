'use client';

import React, { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'focuslab:theme';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>('system');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
      setTheme(saved);
      applyTheme(saved);
    } else {
      applyTheme('system');
    }
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    if (mode === 'system') {
      root.removeAttribute('data-theme');
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else {
      root.setAttribute('data-theme', mode);
      if (mode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const cycleTheme = () => {
    const next: ThemeMode =
      theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  const getLabel = () => {
    if (theme === 'light') return 'Theme: Light (☀)';
    if (theme === 'dark') return 'Theme: Dark (☾)';
    return 'Theme: System (◐)';
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="min-h-[44px] min-w-[44px] px-2.5 py-1.5 text-xs font-semibold rounded-md border border-border bg-surface-2 text-text hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent inline-flex items-center justify-center gap-1.5"
      aria-label={`Current theme is ${theme}. Click to cycle theme`}
    >
      <span aria-hidden="true" className="font-mono text-xs">
        {theme === 'light' ? '☀' : theme === 'dark' ? '☾' : '◐'}
      </span>
      <span className="hidden sm:inline">{getLabel()}</span>
    </button>
  );
};
