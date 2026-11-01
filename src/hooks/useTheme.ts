import { useState, useEffect } from 'react';
import type { ReaderSettings } from '../types';

const THEMES = {
  light: {
    bg: 'bg-gradient-to-br from-ivory-50 via-ivory-100 to-ivory-50',
    text: 'text-charcoal-900',
    container: 'bg-ivory-50',
    border: 'border-ivory-300',
  },
  sepia: {
    bg: 'bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50',
    text: 'text-amber-900',
    container: 'bg-amber-100',
    border: 'border-amber-300',
  },
  dark: {
    bg: 'bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900',
    text: 'text-ivory-100',
    container: 'bg-charcoal-800',
    border: 'border-charcoal-700',
  },
};

export function useTheme() {
  const [theme, setTheme] = useState<ReaderSettings['theme']>('sepia');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as ReaderSettings['theme'];
    if (saved && (saved === 'light' || saved === 'sepia' || saved === 'dark')) {
      setTheme(saved);
      document.documentElement.dataset.theme = saved;
    } else {
      document.documentElement.dataset.theme = 'sepia';
    }
  }, []);

  const changeTheme = (newTheme: ReaderSettings['theme']) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.dataset.theme = newTheme;
  };

  const getThemeClasses = () => THEMES[theme];

  return { theme, changeTheme, getThemeClasses };
}
