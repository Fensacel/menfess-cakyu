'use client';

import { TemplateConfig } from '@/types/template';
import { TemplateCard } from './TemplateCard';

interface TemplateSelectorProps {
  templates: TemplateConfig[];
  selectedId: string | null;
  isDark: boolean;
  onSelect: (id: string) => void;
}

export function TemplateSelector({ templates, selectedId, isDark, onSelect }: TemplateSelectorProps) {
  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2
          className={`font-serif text-2xl sm:text-3xl font-bold mb-2 transition-colors duration-300 ${
            isDark ? 'text-stone-100' : 'text-stone-900'
          }`}
        >
          Pilih Template
        </h2>
        <p
          className={`font-mono text-xs tracking-widest uppercase transition-colors duration-300 ${
            isDark ? 'text-stone-500' : 'text-stone-400'
          }`}
        >
          Langkah 1 — Tentukan gaya visual menfess kamu
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedId === template.id}
            isDark={isDark}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
