'use client';

import { ChevronDown } from 'lucide-react';

interface HeroProps {
  isDark: boolean;
  onStart: () => void;
}

export function Hero({ isDark, onStart }: HeroProps) {
  return (
    <section
      id="hero"
      className={`
        relative min-h-[70vh] flex flex-col items-center justify-center
        px-4 py-20 overflow-hidden
        transition-colors duration-300
        ${isDark ? 'bg-stone-950' : 'bg-stone-50'}
      `}
    >
      {/* Decorative background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            currentColor,
            currentColor 1px,
            transparent 1px,
            transparent 80px
          ), repeating-linear-gradient(
            90deg,
            currentColor,
            currentColor 1px,
            transparent 1px,
            transparent 80px
          )`,
          color: isDark ? '#ffffff' : '#000000',
        }}
      />

      {/* Decorative top line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[3px] transition-colors duration-300 ${
          isDark ? 'bg-amber-500' : 'bg-stone-900'
        }`}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Tagline */}
        <p
          className={`
            font-mono text-xs tracking-[0.3em] uppercase mb-8
            transition-colors duration-300
            ${isDark ? 'text-amber-500' : 'text-stone-500'}
          `}
        >
          "The pen is mightier than the sword."
        </p>

        {/* Main heading */}
        <h1
          className={`
            font-serif text-5xl sm:text-6xl md:text-7xl font-bold
            leading-tight tracking-tight mb-6
            transition-colors duration-300
            ${isDark ? 'text-stone-50' : 'text-stone-900'}
          `}
        >
          Kirim{' '}
          <span className={isDark ? 'text-amber-400' : 'text-red-800'}>
            Menfess
          </span>
        </h1>

        {/* Decorative line */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div
            className={`h-px w-16 transition-colors duration-300 ${
              isDark ? 'bg-stone-700' : 'bg-stone-300'
            }`}
          />
          <div
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              isDark ? 'bg-amber-500' : 'bg-red-800'
            }`}
          />
          <div
            className={`h-px w-16 transition-colors duration-300 ${
              isDark ? 'bg-stone-700' : 'bg-stone-300'
            }`}
          />
        </div>

        {/* Subheading */}
        <p
          className={`
            font-serif text-lg sm:text-xl leading-relaxed mb-12 max-w-xl mx-auto
            transition-colors duration-300
            ${isDark ? 'text-stone-400' : 'text-stone-600'}
          `}
        >
          Pilih template desain kesukaanmu, tulis pesan, dan lihat pratinjau
          langsung!
        </p>

        {/* CTA Button */}
        <button
          onClick={onStart}
          className={`
            group inline-flex items-center gap-3
            px-8 py-4 rounded-sm font-serif text-sm tracking-widest uppercase
            border transition-all duration-300 cursor-pointer
            ${isDark
              ? 'bg-amber-500 border-amber-400 text-stone-950 hover:bg-amber-400'
              : 'bg-stone-900 border-stone-900 text-white hover:bg-stone-700'
            }
          `}
        >
          Mulai Buat Menfess
          <ChevronDown
            size={16}
            className="transition-transform duration-300 group-hover:translate-y-0.5"
          />
        </button>
      </div>

      {/* Bottom scroll indicator */}
      <div
        className={`
          absolute bottom-8 left-1/2 -translate-x-1/2
          flex flex-col items-center gap-1 opacity-40
          ${isDark ? 'text-stone-400' : 'text-stone-500'}
        `}
      >
        <span className="font-mono text-[10px] tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-current animate-pulse" />
      </div>
    </section>
  );
}
