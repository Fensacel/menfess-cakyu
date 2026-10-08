'use client';

import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';

interface EditorControlsProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  isDark: boolean;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
}

export function EditorControls({
  currentStep,
  totalSteps,
  canProceed,
  isDark,
  onNext,
  onPrev,
  onReset,
}: EditorControlsProps) {
  const isFirst = currentStep === 1;
  const isLast = currentStep === totalSteps;

  const btnBase = `
    inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
    font-mono text-xs tracking-widest uppercase
    border transition-all duration-200 cursor-pointer
    focus:outline-none focus-visible:ring-2
    disabled:opacity-40 disabled:cursor-not-allowed
  `;

  return (
    <div className="flex items-center justify-between w-full mt-6 pt-4 border-t border-dashed border-current/10">
      {/* Left: Back or Reset */}
      {isFirst ? (
        <button
          onClick={onReset}
          className={`${btnBase} ${
            isDark
              ? 'border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-200'
              : 'border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-700'
          }`}
        >
          Reset
        </button>
      ) : (
        <button
          onClick={onPrev}
          className={`${btnBase} ${
            isDark
              ? 'border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-200'
              : 'border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-700'
          }`}
        >
          <ArrowLeft size={14} />
          Kembali
        </button>
      )}

      {/* Right: Next or label */}
      {!isLast && (
        <button
          onClick={onNext}
          disabled={!canProceed}
          id={`step-${currentStep}-next`}
          className={`${btnBase} ${
            isDark
              ? 'bg-amber-500 border-amber-500 text-stone-950 hover:bg-amber-400 disabled:hover:bg-amber-500'
              : 'bg-stone-900 border-stone-900 text-white hover:bg-stone-700 disabled:hover:bg-stone-900'
          }`}
        >
          {currentStep === totalSteps - 1 ? 'Lanjut ke Download' : 'Lanjut'}
          <ArrowRight size={14} />
        </button>
      )}

      {isLast && (
        <button
          onClick={onReset}
          className={`${btnBase} ${
            isDark
              ? 'border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-200'
              : 'border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-700'
          }`}
        >
          Buat Lagi
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
