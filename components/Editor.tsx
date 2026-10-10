'use client';

import { useState, useCallback } from 'react';
import { MenfessConfig, TextAlignment, FontSize } from '@/types/template';
import { templates, getTemplateById } from '@/lib/canvas/templates';
import { renderToCanvas } from '@/lib/canvas/renderer';
import { Send, CheckCircle2, Sparkles, X, Loader2 } from 'lucide-react';
import { StepIndicator } from './StepIndicator';
import { TemplateSelector } from './TemplateSelector';
import { MessageForm } from './MessageForm';
import { CanvasPreview } from './CanvasPreview';
import { EditorControls } from './EditorControls';
import { ColorCustomizer } from './ColorCustomizer';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    setSubmitSuccess(false);
    setErrorMessage('');
  }, []);

  const handleSubmitMenfess = async () => {
    if (!config.message.trim() || !config.templateId || !selectedTemplate) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const offscreenCanvas = document.createElement('canvas');
      renderToCanvas(offscreenCanvas, selectedTemplate, config, 1);
      const imageBase64 = offscreenCanvas.toDataURL('image/png', 1.0);

      const res = await fetch('/api/submit-menfess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_id: config.templateId,
          message: config.message,
          sender_name: config.isAnonymous ? null : config.senderName || null,
          recipient_name: config.recipientName || null,
          hashtag: config.hashtag || null,
          song: config.song || null,
          image_base64: imageBase64,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat mengirim menfess.');
      }

      setSubmitSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Menfess gagal dikirim. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

              {/* Right: Preview & Color Customizer */}
              <div className="lg:sticky lg:top-24 space-y-6">
                <CanvasPreview
                  template={selectedTemplate}
                  config={config}
                  isDark={isDark}
                />
                <ColorCustomizer
                  customColors={config.customColors}
                  onChange={(colors) => handleConfigChange({ customColors: colors })}
                  onReset={() => handleConfigChange({ customColors: undefined })}
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

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div className="animate-[fadeIn_0.3s_ease]">
            <div className="mb-8 text-center">
              <h2
                className={`font-serif text-2xl sm:text-3xl font-bold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-stone-100' : 'text-stone-900'
                }`}
              >
                Live Preview & Kirim
              </h2>
              <p
                className={`font-mono text-xs tracking-widest uppercase transition-colors duration-300 ${
                  isDark ? 'text-stone-500' : 'text-stone-400'
                }`}
              >
                Langkah 3 — Periksa tampilan akhir menfess kamu
              </p>
            </div>

            <div className="max-w-lg mx-auto space-y-6">
              {/* Final preview */}
              <CanvasPreview
                template={selectedTemplate}
                config={config}
                isDark={isDark}
              />

              <ColorCustomizer
                customColors={config.customColors}
                onChange={(colors) => handleConfigChange({ customColors: colors })}
                onReset={() => handleConfigChange({ customColors: undefined })}
                isDark={isDark}
              />

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono text-center">
                  {errorMessage}
                </div>
              )}

              {/* Submit button */}
              <button
                onClick={handleSubmitMenfess}
                disabled={isSubmitting}
                className={`
                  w-full flex items-center justify-center gap-3
                  px-8 py-4 rounded-xl font-serif text-sm tracking-widest uppercase font-bold
                  border-2 transition-all duration-300 cursor-pointer shadow-lg
                  focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    isDark
                      ? 'bg-amber-500 border-amber-400 text-stone-950 hover:bg-amber-400'
                      : 'bg-stone-900 border-stone-900 text-white hover:bg-stone-800'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Mengirim Menfess...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Kirim Menfess</span>
                  </>
                )}
              </button>

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
      {submitSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease]">
          <div
            className={`
              w-full max-w-md p-6 sm:p-8 rounded-2xl border shadow-2xl space-y-5 text-center relative
              ${isDark ? 'bg-stone-900 border-stone-700 text-stone-100' : 'bg-white border-stone-200 text-stone-900'}
            `}
          >
            <button
              onClick={handleReset}
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
                Menfess kamu telah dikirim ke Admin dan sedang menunggu moderasi.
              </p>
            </div>

            <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
              Admin kami akan memverifikasi dan menyetujui menfess ini untuk dipublikasikan.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleReset}
                className={`
                  w-full py-2.5 px-4 rounded-lg font-mono text-xs tracking-widest uppercase font-semibold transition-colors
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
