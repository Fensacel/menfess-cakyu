'use client';

import { useState, useCallback } from 'react';
import { MenfessConfig, TextAlignment, FontSize } from '@/types/template';
import { templates, getTemplateById } from '@/lib/canvas/templates';
import { addSubmission } from '@/lib/storage/submissions';
import { Send, CheckCircle2, Sparkles, ExternalLink, X } from 'lucide-react';
import Link from 'next/link';
import { StepIndicator } from './StepIndicator';
import { TemplateSelector } from './TemplateSelector';
import { MessageForm } from './MessageForm';
import { CanvasPreview } from './CanvasPreview';
import { EditorControls } from './EditorControls';
import { DownloadButton } from './DownloadButton';

const TOTAL_STEPS = 3;

const DEFAULT_CONFIG: MenfessConfig = {
  templateId: '',
  message: '',
  senderName: '',
  isAnonymous: true,
  textAlignment: 'center',
  fontSize: 'md',
  recipientName: '',
  hashtag: '',
};

interface EditorProps {
  isDark: boolean;
}

export function Editor({ isDark }: EditorProps) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<MenfessConfig>(DEFAULT_CONFIG);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedTemplate = config.templateId
    ? getTemplateById(config.templateId) ?? null
    : null;

  const handleConfigChange = useCallback((partial: Partial<MenfessConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleTemplateSelect = useCallback((id: string) => {
    setConfig((prev) => ({ ...prev, templateId: id }));
  }, []);

  const handleNext = useCallback(() => {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }, []);

  const handlePrev = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const handleReset = useCallback(() => {
    setStep(1);
    setConfig(DEFAULT_CONFIG);
  }, []);

  const handleSubmitToAdmin = useCallback(() => {
    if (!config.message.trim() || !config.templateId) return;
    setIsSubmitting(true);
    try {
      const res = addSubmission(config);
      setSubmittedCode(res.code);
    } finally {
      setIsSubmitting(false);
    }
  }, [config]);

  const canProceed =
    step === 1 ? !!config.templateId : step === 2 ? config.message.trim().length > 0 : true;

  const sectionBase = `
    w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16
  `;

  return (
    <section
      id="editor"
      className={`
        min-h-screen transition-colors duration-300
        ${isDark ? 'bg-stone-950' : 'bg-stone-50'}
      `}
    >
      {/* Section header */}
      <div
        className={`
          border-b py-6 px-4 sm:px-6 transition-colors duration-300
          ${isDark ? 'border-stone-800 bg-stone-950' : 'border-stone-200 bg-white'}
        `}
      >
        <div className="max-w-6xl mx-auto">
          <p
            className={`font-mono text-[10px] tracking-[0.3em] uppercase mb-3 ${
              isDark ? 'text-stone-500' : 'text-stone-400'
            }`}
          >
            ★ Editor Menfess
          </p>
          <StepIndicator currentStep={step} isDark={isDark} />
        </div>
      </div>

      <div className={sectionBase}>
        {/* Step 1: Template Selection */}
        {step === 1 && (
          <div className="space-y-8 animate-[fadeIn_0.3s_ease]">
            <TemplateSelector
              templates={templates}
              selectedId={config.templateId || null}
              isDark={isDark}
              onSelect={handleTemplateSelect}
            />
            <EditorControls
              currentStep={step}
              totalSteps={TOTAL_STEPS}
              canProceed={canProceed}
              isDark={isDark}
              onNext={handleNext}
              onPrev={handlePrev}
              onReset={handleReset}
            />
          </div>
        )}

        {/* Step 2: Message + Preview */}
        {step === 2 && (
          <div className="animate-[fadeIn_0.3s_ease]">
            <div className="mb-8 text-center">
              <h2
                className={`font-serif text-2xl sm:text-3xl font-bold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-stone-100' : 'text-stone-900'
                }`}
              >
                Tulis Pesanmu
              </h2>
              <p
                className={`font-mono text-xs tracking-widest uppercase transition-colors duration-300 ${
                  isDark ? 'text-stone-500' : 'text-stone-400'
                }`}
              >
                Langkah 2 — Lihat preview secara real-time
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left: Form */}
              <div>
                <MessageForm
                  config={config}
                  isDark={isDark}
                  onChange={handleConfigChange}
                />
              </div>

              {/* Right: Preview */}
              <div className="lg:sticky lg:top-24">
                <CanvasPreview
                  template={selectedTemplate}
                  config={config}
                  isDark={isDark}
                />
              </div>
            </div>

            <EditorControls
              currentStep={step}
              totalSteps={TOTAL_STEPS}
              canProceed={canProceed}
              isDark={isDark}
              onNext={handleNext}
              onPrev={handlePrev}
              onReset={handleReset}
            />
          </div>
        )}

        {/* Step 3: Download */}
        {step === 3 && (
          <div className="animate-[fadeIn_0.3s_ease]">
            <div className="mb-8 text-center">
              <h2
                className={`font-serif text-2xl sm:text-3xl font-bold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-stone-100' : 'text-stone-900'
                }`}
              >
                Download Menfess
              </h2>
              <p
                className={`font-mono text-xs tracking-widest uppercase transition-colors duration-300 ${
                  isDark ? 'text-stone-500' : 'text-stone-400'
                }`}
              >
                Langkah 3 — Simpan gambar ke perangkat
              </p>
            </div>

            <div className="max-w-lg mx-auto space-y-6">
              {/* Final preview */}
              <CanvasPreview
                template={selectedTemplate}
                config={config}
                isDark={isDark}
              />

              {/* Template & message info */}
              <div
                className={`
                  rounded-xl border p-4 space-y-2
                  transition-colors duration-300
                  ${isDark ? 'border-stone-800 bg-stone-900' : 'border-stone-200 bg-white'}
                `}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-[10px] tracking-widest uppercase ${
                      isDark ? 'text-stone-500' : 'text-stone-400'
                    }`}
                  >
                    Template
                  </span>
                  <span
                    className={`font-serif text-sm font-semibold ${
                      isDark ? 'text-stone-200' : 'text-stone-800'
                    }`}
                  >
                    {selectedTemplate?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-[10px] tracking-widest uppercase ${
                      isDark ? 'text-stone-500' : 'text-stone-400'
                    }`}
                  >
                    Ukuran Output
                  </span>
                  <span
                    className={`font-serif text-sm ${
                      isDark ? 'text-stone-200' : 'text-stone-800'
                    }`}
                  >
                    1080 × 1080 px (PNG)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-[10px] tracking-widest uppercase ${
                      isDark ? 'text-stone-500' : 'text-stone-400'
                    }`}
                  >
                    Pengirim
                  </span>
                  <span
                    className={`font-serif text-sm ${
                      isDark ? 'text-stone-200' : 'text-stone-800'
                    }`}
                  >
                    {config.isAnonymous ? 'Anonim' : config.senderName || '—'}
                  </span>
                </div>
              </div>

              {/* Download button */}
              <DownloadButton
                template={selectedTemplate}
                config={config}
                isDark={isDark}
              />

              {/* Submit to Admin Instagram Button */}
              <div
                className={`
                  p-4 rounded-xl border text-center space-y-3
                  transition-colors duration-300
                  ${isDark ? 'border-amber-500/30 bg-amber-500/5' : 'border-amber-800/20 bg-amber-50/50'}
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles size={16} className={isDark ? 'text-amber-400' : 'text-amber-700'} />
                  <p
                    className={`font-serif text-sm font-bold ${
                      isDark ? 'text-amber-300' : 'text-amber-900'
                    }`}
                  >
                    Mau Di-upload ke Akun Instagram?
                  </p>
                </div>
                <p
                  className={`text-xs ${
                    isDark ? 'text-stone-400' : 'text-stone-600'
                  }`}
                >
                  Kirim menfess ini ke antrean Admin agar direview dan diposting ke feed Instagram resmi kami.
                </p>
                <button
                  onClick={handleSubmitToAdmin}
                  disabled={isSubmitting}
                  className={`
                    w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-mono text-xs
                    tracking-widest uppercase font-semibold transition-all duration-200 cursor-pointer shadow-sm
                    ${isDark
                      ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20'
                      : 'bg-stone-900 hover:bg-stone-800 text-white shadow-stone-900/10'
                    }
                  `}
                >
                  <Send size={15} />
                  {isSubmitting ? 'Mengirim...' : 'Kirim Menfess ke Admin IG'}
                </button>
              </div>

              {/* Controls */}
              <EditorControls
                currentStep={step}
                totalSteps={TOTAL_STEPS}
                canProceed={canProceed}
                isDark={isDark}
                onNext={handleNext}
                onPrev={handlePrev}
                onReset={handleReset}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modal Sukses Kirim ke Admin */}
      {submittedCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease]">
          <div
            className={`
              w-full max-w-md p-6 sm:p-8 rounded-2xl border shadow-2xl space-y-5 text-center relative
              ${isDark ? 'bg-stone-900 border-stone-700 text-stone-100' : 'bg-white border-stone-200 text-stone-900'}
            `}
          >
            <button
              onClick={() => setSubmittedCode(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <span className="font-mono text-xs tracking-widest uppercase text-amber-600 dark:text-amber-400 font-bold">
                Berhasil Terkirim
              </span>
              <h3 className="font-serif text-2xl font-bold mt-1">
                Menfess Masuk Antrean!
              </h3>
              <p className={`text-xs mt-2 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                Menfess kamu telah diterima oleh Admin dengan nomor identifikasi:
              </p>
              <div
                className={`
                  mt-3 py-2 px-4 rounded-lg font-mono text-base font-bold tracking-wider inline-block
                  ${isDark ? 'bg-stone-800 text-amber-400 border border-stone-700' : 'bg-stone-100 text-stone-900 border border-stone-300'}
                `}
              >
                #{submittedCode}
              </div>
            </div>

            <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
              Admin kami akan memverifikasi dan mengunggah gambar menfess ini ke Instagram beserta caption dan hashtag yang sesuai.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/admin"
                className={`
                  flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-mono text-xs
                  tracking-widest uppercase font-semibold transition-colors
                  ${isDark ? 'bg-stone-800 hover:bg-stone-700 text-stone-200' : 'bg-stone-100 hover:bg-stone-200 text-stone-800'}
                `}
              >
                <ExternalLink size={14} />
                Portal Admin
              </Link>
              <button
                onClick={() => setSubmittedCode(null)}
                className={`
                  flex-1 py-2.5 px-4 rounded-lg font-mono text-xs tracking-widest uppercase font-semibold transition-colors
                  ${isDark ? 'bg-amber-500 hover:bg-amber-400 text-stone-950' : 'bg-stone-900 hover:bg-stone-800 text-white'}
                `}
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
