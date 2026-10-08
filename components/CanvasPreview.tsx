'use client';

import { useEffect, useRef } from 'react';
import { TemplateConfig, MenfessConfig } from '@/types/template';
import { renderToCanvas } from '@/lib/canvas/renderer';

interface CanvasPreviewProps {
  template: TemplateConfig | null;
  config: MenfessConfig;
  isDark: boolean;
}

export function CanvasPreview({ template, config, isDark }: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!template || !canvasRef.current) return;
    renderToCanvas(canvasRef.current, template, config, 1);
  }, [template, config]);

  if (!template) {
    return (
      <div
        className={`
          w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-3
          border-2 border-dashed transition-colors duration-300
          ${isDark ? 'border-stone-700 bg-stone-900' : 'border-stone-200 bg-stone-50'}
        `}
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isDark ? 'bg-stone-800' : 'bg-stone-100'
          }`}
        >
          <span className="text-2xl">🖼️</span>
        </div>
        <p
          className={`font-mono text-xs tracking-widest uppercase text-center ${
            isDark ? 'text-stone-600' : 'text-stone-400'
          }`}
        >
          Pilih template
          <br />
          untuk melihat preview
        </p>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {/* Canvas wrapper - maintains 1:1 ratio */}
      <div className="relative w-full aspect-square overflow-hidden rounded-xl shadow-2xl">
        <canvas
          ref={canvasRef}
          id="menfess-canvas"
          className="w-full h-full"
          style={{ imageRendering: 'crisp-edges' }}
          aria-label="Menfess preview canvas"
        />
      </div>
      {/* Info label */}
      <div className="flex items-center justify-between mt-2 px-1">
        <span
          className={`font-mono text-[10px] tracking-widest uppercase ${
            isDark ? 'text-stone-600' : 'text-stone-400'
          }`}
        >
          Live Preview
        </span>
        <span
          className={`font-mono text-[10px] tracking-widest uppercase ${
            isDark ? 'text-stone-600' : 'text-stone-400'
          }`}
        >
          1080 × 1080 px
        </span>
      </div>
    </div>
  );
}
