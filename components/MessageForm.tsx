'use client';

import { AlignLeft, AlignCenter, AlignRight, User, UserX } from 'lucide-react';
import { MenfessConfig, TextAlignment, FontSize } from '@/types/template';

interface MessageFormProps {
  config: MenfessConfig;
  isDark: boolean;
  onChange: (config: Partial<MenfessConfig>) => void;
}

const MAX_CHARS = 500;

const FONT_SIZES: { value: FontSize; label: string }[] = [
  { value: 'sm', label: 'Kecil' },
  { value: 'md', label: 'Normal' },
  { value: 'lg', label: 'Besar' },
  { value: 'xl', label: 'XL' },
];

const ALIGNMENTS: { value: TextAlignment; icon: React.ReactNode; label: string }[] = [
  { value: 'left', icon: <AlignLeft size={14} />, label: 'Kiri' },
  { value: 'center', icon: <AlignCenter size={14} />, label: 'Tengah' },
  { value: 'right', icon: <AlignRight size={14} />, label: 'Kanan' },
];

export function MessageForm({ config, isDark, onChange }: MessageFormProps) {
  const charCount = config.message.length;
  const charPercent = (charCount / MAX_CHARS) * 100;
  const charColor =
    charPercent >= 90
      ? 'text-red-500'
      : charPercent >= 70
        ? isDark ? 'text-amber-400' : 'text-amber-600'
        : isDark ? 'text-stone-500' : 'text-stone-400';

  const inputBase = `
    w-full rounded-lg px-4 py-3 text-sm font-serif
    border transition-all duration-200 outline-none
    ${isDark
      ? 'bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30'
      : 'bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:ring-1 focus:ring-stone-500/20'
    }
  `;

  const labelClass = `block font-mono text-[10px] tracking-widest uppercase mb-2 ${
    isDark ? 'text-stone-400' : 'text-stone-500'
  }`;

  return (
    <div className="w-full space-y-5">
      {/* Message textarea */}
      <div>
        <label htmlFor="menfess-message" className={labelClass}>
          Pesan Menfess
        </label>
        <div className="relative">
          <textarea
            id="menfess-message"
            value={config.message}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                onChange({ message: e.target.value });
              }
            }}
            placeholder="Tulis pesan menfess kamu di sini..."
            rows={5}
            className={`${inputBase} resize-none leading-relaxed`}
          />
          {/* Character counter */}
          <div
            className={`
              absolute bottom-3 right-3 flex items-center gap-2
            `}
          >
            <span className={`font-mono text-[10px] ${charColor}`}>
              {charCount}/{MAX_CHARS}
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div
          className={`mt-1.5 h-0.5 rounded-full overflow-hidden ${
            isDark ? 'bg-stone-800' : 'bg-stone-100'
          }`}
        >
          <div
            className={`h-full rounded-full transition-all duration-200 ${
              charPercent >= 90
                ? 'bg-red-500'
                : charPercent >= 70
                  ? 'bg-amber-500'
                  : isDark
                    ? 'bg-amber-500'
                    : 'bg-stone-600'
            }`}
            style={{ width: `${Math.min(charPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Controls row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Text alignment */}
        <div>
          <p className={labelClass}>Rata Teks</p>
          <div
            className={`
              flex rounded-lg border overflow-hidden
              ${isDark ? 'border-stone-700' : 'border-stone-200'}
            `}
          >
            {ALIGNMENTS.map(({ value, icon, label }) => (
              <button
                key={value}
                onClick={() => onChange({ textAlignment: value })}
                aria-label={label}
                aria-pressed={config.textAlignment === value}
                className={`
                  flex-1 flex items-center justify-center py-2.5 transition-all duration-200 cursor-pointer
                  ${config.textAlignment === value
                    ? isDark
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-900 text-white'
                    : isDark
                      ? 'text-stone-400 hover:bg-stone-700'
                      : 'text-stone-500 hover:bg-stone-50'
                  }
                `}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Font size */}
        <div>
          <p className={labelClass}>Ukuran Font</p>
          <div
            className={`
              flex rounded-lg border overflow-hidden
              ${isDark ? 'border-stone-700' : 'border-stone-200'}
            `}
          >
            {FONT_SIZES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onChange({ fontSize: value })}
                aria-label={`Font size ${label}`}
                aria-pressed={config.fontSize === value}
                className={`
                  flex-1 flex items-center justify-center py-2.5 text-[10px] font-mono
                  tracking-wide transition-all duration-200 cursor-pointer
                  ${config.fontSize === value
                    ? isDark
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-900 text-white'
                    : isDark
                      ? 'text-stone-400 hover:bg-stone-700'
                      : 'text-stone-500 hover:bg-stone-50'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Anonymous toggle */}
      <div
        className={`
          flex items-center justify-between p-4 rounded-lg border
          transition-colors duration-300
          ${isDark ? 'border-stone-700 bg-stone-800/50' : 'border-stone-200 bg-stone-50'}
        `}
      >
        <div className="flex items-center gap-3">
          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${config.isAnonymous
                ? isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-stone-200 text-stone-600'
                : isDark ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-white'
              }
            `}
          >
            {config.isAnonymous ? <UserX size={15} /> : <User size={15} />}
          </div>
          <div>
            <p
              className={`font-serif text-sm font-semibold ${
                isDark ? 'text-stone-200' : 'text-stone-800'
              }`}
            >
              {config.isAnonymous ? 'Anonim' : 'Tampilkan Nama'}
            </p>
            <p
              className={`font-mono text-[10px] tracking-wide ${
                isDark ? 'text-stone-500' : 'text-stone-400'
              }`}
            >
              {config.isAnonymous ? 'Identitas disembunyikan' : 'Nama akan ditampilkan'}
            </p>
          </div>
        </div>
        {/* Toggle switch */}
        <button
          role="switch"
          aria-checked={!config.isAnonymous}
          onClick={() => onChange({ isAnonymous: !config.isAnonymous })}
          className={`
            relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer
            focus:outline-none focus-visible:ring-2
            ${!config.isAnonymous
              ? isDark ? 'bg-amber-500' : 'bg-stone-900'
              : isDark ? 'bg-stone-700' : 'bg-stone-300'
            }
          `}
        >
          <span
            className={`
              absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white
              transition-transform duration-300 shadow-sm
              ${!config.isAnonymous ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>

      {/* Sender name input (shown when not anonymous) */}
      <div
        className={`
          overflow-hidden transition-all duration-300
          ${config.isAnonymous ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'}
        `}
      >
        <label htmlFor="sender-name" className={labelClass}>
          Nama Pengirim
        </label>
        <input
          id="sender-name"
          type="text"
          value={config.senderName}
          onChange={(e) => onChange({ senderName: e.target.value })}
          placeholder="Nama kamu..."
          maxLength={50}
          className={inputBase}
        />
      </div>

      {/* Recipient & Hashtag (Opsional) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="recipient-name" className={labelClass}>
            Kepada / Penerima (Opsional)
          </label>
          <input
            id="recipient-name"
            type="text"
            value={config.recipientName || ''}
            onChange={(e) => onChange({ recipientName: e.target.value })}
            placeholder="Contoh: @crush atau Si Dia..."
            maxLength={60}
            className={inputBase}
          />
        </div>
        <div>
          <label htmlFor="menfess-hashtag" className={labelClass}>
            Hashtag / Topik (Opsional)
          </label>
          <input
            id="menfess-hashtag"
            type="text"
            value={config.hashtag || ''}
            onChange={(e) => onChange({ hashtag: e.target.value })}
            placeholder="#curhat #kampus #crush"
            maxLength={80}
            className={inputBase}
          />
        </div>
      </div>
    </div>
  );
}
