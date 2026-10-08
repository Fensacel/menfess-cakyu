'use client';

import { Check } from 'lucide-react';
import { TemplateConfig } from '@/types/template';

interface TemplateCardProps {
  template: TemplateConfig;
  isSelected: boolean;
  isDark: boolean;
  onSelect: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Vintage: 'bg-amber-100 text-amber-800',
  Modern: 'bg-blue-100 text-blue-800',
  Minimalis: 'bg-stone-100 text-stone-700',
};

const CATEGORY_COLORS_DARK: Record<string, string> = {
  Vintage: 'bg-amber-900/30 text-amber-400',
  Modern: 'bg-blue-900/30 text-blue-400',
  Minimalis: 'bg-stone-700 text-stone-300',
};

export function TemplateCard({ template, isSelected, isDark, onSelect }: TemplateCardProps) {
  const catClass = isDark
    ? CATEGORY_COLORS_DARK[template.category] || 'bg-stone-700 text-stone-300'
    : CATEGORY_COLORS[template.category] || 'bg-stone-100 text-stone-700';

  return (
    <button
      onClick={() => onSelect(template.id)}
      className={`
        relative group w-full text-left rounded-xl overflow-hidden
        border-2 transition-all duration-300 cursor-pointer
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        ${isSelected
          ? isDark
            ? 'border-amber-500 shadow-lg shadow-amber-500/10'
            : 'border-stone-900 shadow-lg shadow-stone-900/10'
          : isDark
            ? 'border-stone-700 hover:border-stone-500'
            : 'border-stone-200 hover:border-stone-400'
        }
        ${isDark ? 'bg-stone-900' : 'bg-white'}
      `}
      aria-pressed={isSelected}
      aria-label={`Template ${template.name}`}
    >
      {/* Thumbnail */}
      <div
        className="relative w-full aspect-square overflow-hidden"
        style={{
          background:
            template.backgroundType === 'gradient' && template.gradientColors
              ? `linear-gradient(135deg, ${template.gradientColors.join(', ')})`
              : template.thumbnail,
        }}
      >
        {/* Template mini preview */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
          {/* Mini decorative bars */}
          {template.id === 'classic-dark' && (
            <>
              <div className="w-full h-4 bg-amber-200/80 mb-2" />
              <div className="w-full flex-1 bg-stone-100/90 flex items-center justify-center p-2">
                <div className="text-center">
                  <p className="text-[8px] font-serif font-bold text-stone-800 tracking-widest leading-tight">
                    Cakrawala University
                  </p>
                  <div className="mt-1 space-y-0.5">
                    <div className="h-0.5 bg-stone-400/40 rounded" />
                    <div className="h-0.5 bg-stone-400/40 rounded w-3/4 mx-auto" />
                    <div className="h-0.5 bg-stone-400/40 rounded w-1/2 mx-auto" />
                  </div>
                </div>
              </div>
              <div className="w-full h-4 bg-amber-200/80 mt-2" />
            </>
          )}
          {template.id === 'blue-sky-glass' && (
            <>
              <p className="text-[8px] font-mono font-bold text-sky-400 tracking-widest mb-2">
                M E N F E S S
              </p>
              <p className="text-[10px] font-bold text-white tracking-wider mb-3">SUARA HATI</p>
              <div className="w-5/6 rounded-lg border border-white/20 bg-white/10 p-2 flex flex-col gap-1">
                <div className="h-0.5 bg-white/30 rounded" />
                <div className="h-0.5 bg-white/30 rounded w-3/4 mx-auto" />
                <div className="h-0.5 bg-white/20 rounded w-1/2 mx-auto" />
              </div>
            </>
          )}
          {template.id === 'white-minimal' && (
            <>
              <div className="w-full h-0.5 bg-red-800 mb-3" />
              <p className="text-[8px] font-serif font-bold text-red-800 tracking-widest mb-1">
                MENFESS
              </p>
              <p className="text-[10px] font-serif font-bold text-stone-900 tracking-wide mb-2">
                PESAN RAHASIA
              </p>
              <div className="border border-stone-200 bg-white w-5/6 p-2 flex flex-col gap-1">
                <div className="h-0.5 bg-stone-300/60 rounded" />
                <div className="h-0.5 bg-stone-300/60 rounded w-3/4 mx-auto" />
              </div>
              <div className="w-full h-0.5 bg-red-800 mt-3" />
            </>
          )}
        </div>

        {/* Selected overlay */}
        {isSelected && (
          <div
            className={`
              absolute inset-0 flex items-end justify-end p-2
              bg-gradient-to-t from-black/30 to-transparent
            `}
          >
            <div
              className={`
                w-6 h-6 rounded-full flex items-center justify-center
                ${isDark ? 'bg-amber-500' : 'bg-stone-900'}
              `}
            >
              <Check size={12} className="text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Card info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className={`
              font-serif text-sm font-bold leading-tight
              transition-colors duration-200
              ${isDark ? 'text-stone-100' : 'text-stone-900'}
            `}
          >
            {template.name}
          </h3>
          <span className={`shrink-0 text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full tracking-wide ${catClass}`}>
            {template.category}
          </span>
        </div>
        <p
          className={`
            text-[11px] leading-relaxed
            ${isDark ? 'text-stone-500' : 'text-stone-400'}
          `}
        >
          {template.description}
        </p>
        <p
          className={`
            mt-2 text-[10px] font-mono tracking-widest uppercase
            ${isDark ? 'text-stone-600' : 'text-stone-300'}
          `}
        >
          1:1 • 1080×1080
        </p>
      </div>
    </button>
  );
}
