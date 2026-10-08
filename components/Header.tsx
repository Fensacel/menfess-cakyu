'use client';

import Link from 'next/link';
import { Feather, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  isDark: boolean;
  onThemeToggle: () => void;
}

export function Header({ isDark, onThemeToggle }: HeaderProps) {
  return (
    <header
      className={`
        sticky top-0 z-50 w-full
        border-b backdrop-blur-md transition-colors duration-300
        ${isDark
          ? 'bg-stone-950/90 border-stone-800'
          : 'bg-stone-50/90 border-stone-200'
        }
      `}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group" aria-label="Menfess Studio Home">
          <div
            className={`
              w-8 h-8 rounded-sm flex items-center justify-center transition-colors
              ${isDark ? 'bg-amber-500' : 'bg-stone-900'}
            `}
          >
            <Feather size={16} className={isDark ? 'text-stone-950' : 'text-white'} />
          </div>
          <span
            className={`
              font-serif text-sm sm:text-base font-bold tracking-widest uppercase
              transition-colors duration-300
              ${isDark ? 'text-stone-100' : 'text-stone-900'}
            `}
          >
            Menfess Studio
          </span>
        </a>

        {/* Nav + Toggle */}
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden sm:flex items-center gap-5">
            {['Editor', 'Template', 'Tentang'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`
                  text-xs tracking-widest uppercase font-medium
                  transition-colors duration-200
                  ${isDark
                    ? 'text-stone-400 hover:text-stone-100'
                    : 'text-stone-500 hover:text-stone-900'
                  }
                `}
              >
                {item}
              </a>
            ))}
          </nav>


          <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
        </div>
      </div>
    </header>
  );
}
