'use client';

import Link from 'next/link';
import { ArrowLeft, Feather, Plus, RefreshCw } from 'lucide-react';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { ThemeToggle } from '@/components/ThemeToggle';

interface AdminHeaderProps {
  isDark: boolean;
  onThemeToggle: () => void;
  onNewManual: () => void;
  onResetData: () => void;
  pendingCount: number;
}

export function AdminHeader({
  isDark,
  onThemeToggle,
  onNewManual,
  onResetData,
  pendingCount,
}: AdminHeaderProps) {
  return (
    <header
      className={`
        sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-300
        ${isDark ? 'bg-stone-950/90 border-stone-800' : 'bg-stone-50/95 border-stone-200'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono tracking-wider uppercase
              transition-colors duration-200
              ${isDark
                ? 'border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200 bg-stone-900/60'
                : 'border-stone-200 hover:border-stone-300 text-stone-600 hover:text-stone-900 bg-white'
              }
            `}
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">Studio</span>
          </Link>

          <div className="h-5 w-[1px] bg-stone-300 dark:bg-stone-800 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div
              className={`
                w-8 h-8 rounded-sm flex items-center justify-center transition-colors
                ${isDark ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-white'}
              `}
            >
              <InstagramIcon size={17} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className={`
                    font-serif text-sm sm:text-base font-bold tracking-wider uppercase
                    ${isDark ? 'text-stone-100' : 'text-stone-900'}
                  `}
                >
                  Admin Instagram
                </h1>
                {pendingCount > 0 && (
                  <span className="animate-pulse bg-red-500 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {pendingCount} Antrean
                  </span>
                )}
              </div>
              <p
                className={`font-mono text-[9px] tracking-widest uppercase hidden sm:block ${
                  isDark ? 'text-stone-500' : 'text-stone-400'
                }`}
              >
                Editorial Desk & Content Dispatcher
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onResetData}
            title="Reset data demo ke awal"
            className={`
              p-2 rounded-lg border text-xs transition-colors hidden sm:flex items-center gap-1.5 font-mono
              ${isDark
                ? 'border-stone-800 hover:bg-stone-800 text-stone-400 hover:text-stone-200'
                : 'border-stone-200 hover:bg-stone-100 text-stone-500 hover:text-stone-800'
              }
            `}
          >
            <RefreshCw size={13} />
            <span className="text-[10px] uppercase">Reset Demo</span>
          </button>

          <button
            onClick={onNewManual}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider uppercase font-semibold
              transition-all duration-200 shadow-sm
              ${isDark
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
              }
            `}
          >
            <Plus size={14} />
            <span>Tambah</span>
          </button>

          <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
        </div>
      </div>
    </header>
  );
}
