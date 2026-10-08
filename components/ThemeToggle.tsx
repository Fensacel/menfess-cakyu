'use client';

import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`
        relative inline-flex items-center justify-center w-10 h-10 rounded-full
        border transition-all duration-300 cursor-pointer
        ${isDark
          ? 'border-stone-600 bg-stone-800 text-amber-400 hover:bg-stone-700'
          : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
        }
      `}
    >
      <span className="sr-only">{isDark ? 'Light mode' : 'Dark mode'}</span>
      <span
        className="transition-all duration-300"
        style={{ transform: isDark ? 'rotate(0deg)' : 'rotate(180deg)' }}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </span>
    </button>
  );
}
