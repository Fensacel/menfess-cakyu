'use client';

import { Check } from 'lucide-react';

interface Step {
  number: number;
  label: string;
}

const STEPS: Step[] = [
  { number: 1, label: 'Template' },
  { number: 2, label: 'Pesan' },
  { number: 3, label: 'Download' },
];

interface StepIndicatorProps {
  currentStep: number;
  isDark: boolean;
}

export function StepIndicator({ currentStep, isDark }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full max-w-xs sm:max-w-sm mx-auto">
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isActive = currentStep === step.number;
        const isLast = index === STEPS.length - 1;

        return (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step circle */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  text-xs font-bold transition-all duration-300
                  ${isCompleted
                    ? isDark
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-900 text-white'
                    : isActive
                      ? isDark
                        ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-400'
                        : 'bg-white border-2 border-stone-900 text-stone-900'
                      : isDark
                        ? 'bg-stone-800 border border-stone-700 text-stone-500'
                        : 'bg-stone-100 border border-stone-300 text-stone-400'
                  }
                `}
              >
                {isCompleted ? <Check size={14} /> : step.number}
              </div>
              <span
                className={`
                  text-[10px] font-mono tracking-widest uppercase whitespace-nowrap
                  transition-colors duration-300
                  ${isActive
                    ? isDark ? 'text-amber-400' : 'text-stone-900'
                    : isDark ? 'text-stone-600' : 'text-stone-400'
                  }
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className="flex-1 mx-2 mb-5">
                <div
                  className={`
                    h-px transition-all duration-500
                    ${isCompleted
                      ? isDark ? 'bg-amber-500' : 'bg-stone-900'
                      : isDark ? 'bg-stone-700' : 'bg-stone-200'
                    }
                  `}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
