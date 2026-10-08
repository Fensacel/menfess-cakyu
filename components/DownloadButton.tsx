'use client';

import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { TemplateConfig, MenfessConfig } from '@/types/template';
import { downloadPNG } from '@/lib/canvas/renderer';

interface DownloadButtonProps {
  template: TemplateConfig | null;
  config: MenfessConfig;
  isDark: boolean;
}

export function DownloadButton({ template, config, isDark }: DownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (!template) return;
    setIsLoading(true);
    try {
      // Small delay to show loading state
      await new Promise((r) => setTimeout(r, 150));
      const filename = `menfess-${template.id}-${Date.now()}.png`;
      downloadPNG(template, config, filename);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = !template || isLoading;

  return (
    <button
      onClick={handleDownload}
      disabled={isDisabled}
      id="download-png-btn"
      className={`
        w-full flex items-center justify-center gap-3
        px-8 py-4 rounded-xl font-serif text-sm tracking-widest uppercase
        border-2 transition-all duration-300 cursor-pointer
        focus:outline-none focus-visible:ring-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isDark
          ? 'bg-amber-500 border-amber-400 text-stone-950 hover:bg-amber-400 disabled:hover:bg-amber-500'
          : 'bg-stone-900 border-stone-900 text-white hover:bg-stone-700 disabled:hover:bg-stone-900'
        }
      `}
    >
      {isLoading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>Menyiapkan...</span>
        </>
      ) : (
        <>
          <Download size={18} />
          <span>Download PNG</span>
        </>
      )}
    </button>
  );
}
