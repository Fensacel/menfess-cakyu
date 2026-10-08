'use client';

import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Editor } from '@/components/Editor';

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleThemeToggle = () => setIsDark((d) => !d);

  const handleStart = () => {
    editorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-stone-950 text-stone-100' : 'bg-stone-50 text-stone-900'
      }`}
    >
      <Header isDark={isDark} onThemeToggle={handleThemeToggle} />
      <main>
        <Hero isDark={isDark} onStart={handleStart} />
        <div ref={editorRef}>
          <Editor isDark={isDark} />
        </div>

        {/* Footer */}
        <footer
          className={`
            border-t py-8 px-4 text-center
            transition-colors duration-300
            ${isDark ? 'border-stone-800 bg-stone-950' : 'border-stone-200 bg-white'}
          `}
        >
          <div className="max-w-6xl mx-auto">
            <p
              className={`font-mono text-[10px] tracking-widest uppercase mb-2 ${
                isDark ? 'text-stone-600' : 'text-stone-400'
              }`}
            >
              ★ Menfess Studio ★
            </p>
            <p
              className={`font-serif text-xs ${isDark ? 'text-stone-700' : 'text-stone-300'}`}
            >
              Dibuat dengan ❤ — Client-side only, tidak ada data yang dikirim ke server.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
