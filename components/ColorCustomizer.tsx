'use client';

import { Palette, RotateCcw } from 'lucide-react';
import { CustomColors } from '@/types/template';

interface ColorCustomizerProps {
  customColors?: CustomColors;
  onChange: (colors: CustomColors) => void;
  onReset: () => void;
  isDark: boolean;
}

export const COLOR_PRESETS = [
  {
    name: 'Red Classic (Asli)',
    frame: '#D8000C',
    card: '#17212F',
    text: '#FFFFFF',
    title: '#000000',
  },
  {
    name: 'Ocean Blue',
    frame: '#0284C7',
    card: '#0F172A',
    text: '#FFFFFF',
    title: '#000000',
  },
  {
    name: 'Emerald Green',
    frame: '#059669',
    card: '#064E3B',
    text: '#FFFFFF',
    title: '#000000',
  },
  {
    name: 'Neon Purple',
    frame: '#7C3AED',
    card: '#1E1B4B',
    text: '#FFFFFF',
    title: '#000000',
  },
  {
    name: 'Monochrome Black',
    frame: '#18181B',
    card: '#27272A',
    text: '#FFFFFF',
    title: '#000000',
  },
  {
    name: 'Barbie Pink',
    frame: '#DB2777',
    card: '#18181B',
    text: '#FFFFFF',
    title: '#000000',
  },
  {
    name: 'Sunset Orange',
    frame: '#EA580C',
    card: '#1C1917',
    text: '#FFFFFF',
    title: '#000000',
  },
  {
    name: 'Vintage Espresso',
    frame: '#78350F',
    card: '#292524',
    text: '#FEF3C7',
    title: '#451A03',
  },
];

export function ColorCustomizer({
  customColors,
  onChange,
  onReset,
  isDark,
}: ColorCustomizerProps) {
  const currentFrame = customColors?.frameColor || '#D8000C';
  const currentCard = customColors?.cardColor || '#17212F';
  const currentText = customColors?.textColor || '#FFFFFF';

  const labelClass = `block font-mono text-[10px] tracking-widest uppercase mb-1.5 ${
    isDark ? 'text-stone-400' : 'text-stone-500'
  }`;

  return (
    <div
      className={`
        p-4 rounded-xl border space-y-4 transition-colors
        ${isDark ? 'border-stone-800 bg-stone-900/60' : 'border-stone-200 bg-stone-50/70'}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette size={16} className={isDark ? 'text-amber-400' : 'text-amber-600'} />
          <h4
            className={`font-serif text-sm font-bold ${
              isDark ? 'text-stone-200' : 'text-stone-800'
            }`}
          >
            Kustomisasi Warna Desain
          </h4>
        </div>

        <button
          onClick={onReset}
          title="Reset ke warna awal"
          className={`
            p-1.5 rounded-lg border text-[11px] font-mono flex items-center gap-1 transition-colors
            ${
              isDark
                ? 'border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                : 'border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }
          `}
        >
          <RotateCcw size={12} />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Preset Palettes */}
      <div>
        <span className={labelClass}>Tema Warna 1-Klik</span>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {COLOR_PRESETS.map((preset) => {
            const isSelected =
              currentFrame.toLowerCase() === preset.frame.toLowerCase() &&
              currentCard.toLowerCase() === preset.card.toLowerCase();

            return (
              <button
                key={preset.name}
                title={preset.name}
                onClick={() =>
                  onChange({
                    frameColor: preset.frame,
                    cardColor: preset.card,
                    textColor: preset.text,
                    titleColor: preset.title,
                  })
                }
                className={`
                  relative h-9 rounded-lg border flex overflow-hidden p-0.5 transition-all
                  ${
                    isSelected
                      ? 'ring-2 ring-amber-500 scale-105 shadow-md border-transparent'
                      : isDark
                      ? 'border-stone-700 hover:scale-105'
                      : 'border-stone-300 hover:scale-105'
                  }
                `}
              >
                {/* Visual preview of frame + card */}
                <div
                  className="w-full h-full rounded flex items-center justify-center p-1"
                  style={{ backgroundColor: preset.frame }}
                >
                  <div
                    className="w-full h-full rounded-sm"
                    style={{ backgroundColor: preset.card }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Color Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {/* Frame Color */}
        <div
          className={`
            p-2.5 rounded-lg border flex items-center justify-between
            ${isDark ? 'border-stone-800 bg-stone-850' : 'border-stone-200 bg-white'}
          `}
        >
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-wider text-stone-500">
              Warna Bingkai
            </span>
            <span className="font-mono text-xs font-semibold">{currentFrame.toUpperCase()}</span>
          </div>
          <input
            type="color"
            value={currentFrame}
            onChange={(e) =>
              onChange({
                ...customColors,
                frameColor: e.target.value,
              })
            }
            className="w-8 h-8 rounded border-0 cursor-pointer p-0 bg-transparent"
          />
        </div>

        {/* Card Color */}
        <div
          className={`
            p-2.5 rounded-lg border flex items-center justify-between
            ${isDark ? 'border-stone-800 bg-stone-850' : 'border-stone-200 bg-white'}
          `}
        >
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-wider text-stone-500">
              Warna Kotak
            </span>
            <span className="font-mono text-xs font-semibold">{currentCard.toUpperCase()}</span>
          </div>
          <input
            type="color"
            value={currentCard}
            onChange={(e) =>
              onChange({
                ...customColors,
                cardColor: e.target.value,
              })
            }
            className="w-8 h-8 rounded border-0 cursor-pointer p-0 bg-transparent"
          />
        </div>

        {/* Text Color */}
        <div
          className={`
            p-2.5 rounded-lg border flex items-center justify-between
            ${isDark ? 'border-stone-800 bg-stone-850' : 'border-stone-200 bg-white'}
          `}
        >
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-wider text-stone-500">
              Warna Teks
            </span>
            <span className="font-mono text-xs font-semibold">{currentText.toUpperCase()}</span>
          </div>
          <input
            type="color"
            value={currentText}
            onChange={(e) =>
              onChange({
                ...customColors,
                textColor: e.target.value,
              })
            }
            className="w-8 h-8 rounded border-0 cursor-pointer p-0 bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
