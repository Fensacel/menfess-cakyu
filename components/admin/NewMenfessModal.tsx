'use client';

import { useState } from 'react';
import { MenfessConfig } from '@/types/template';
import { templates } from '@/lib/canvas/templates';
import { X, Plus, Sparkles } from 'lucide-react';

interface NewMenfessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (config: MenfessConfig) => void;
  isDark: boolean;
}

export function NewMenfessModal({
  isOpen,
  onClose,
  onSubmit,
  isDark,
}: NewMenfessModalProps) {
  const [templateId, setTemplateId] = useState(templates[0].id);
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [recipientName, setRecipientName] = useState('');
  const [hashtag, setHashtag] = useState('#menfess #curhat');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSubmit({
      templateId,
      message: message.trim(),
      senderName: senderName.trim(),
      isAnonymous,
      textAlignment: 'center',
      fontSize: 'md',
      recipientName: recipientName.trim() || undefined,
      hashtag: hashtag.trim() || undefined,
    });

    // Reset
    setMessage('');
    setSenderName('');
    setRecipientName('');
    setIsAnonymous(true);
    onClose();
  };

  const inputBase = `
    w-full rounded-lg px-3 py-2 text-xs font-serif border outline-none
    ${
      isDark
        ? 'bg-stone-850 border-stone-700 text-stone-100 placeholder:text-stone-600 focus:border-amber-500'
        : 'bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-stone-500'
    }
  `;

  const labelClass = `block font-mono text-[10px] tracking-widest uppercase mb-1 ${
    isDark ? 'text-stone-400' : 'text-stone-500'
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease]">
      <div
        className={`
          w-full max-w-lg p-6 rounded-2xl border shadow-2xl space-y-4 relative
          ${isDark ? 'bg-stone-900 border-stone-700 text-stone-100' : 'bg-white border-stone-200 text-stone-900'}
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-amber-500" />
          <h3 className="font-serif text-lg font-bold">Input Menfess Manual</h3>
        </div>
        <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
          Tambahkan menfess kiriman DM Instagram, WhatsApp, atau sumber lain langsung ke antrean.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Template */}
          <div>
            <label className={labelClass}>Pilih Desain Template</label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className={inputBase}
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.category})
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className={labelClass}>Isi Pesan Menfess *</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan menfess di sini..."
              className={`${inputBase} resize-none leading-relaxed`}
            />
          </div>

          {/* Sender & Anonim */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Nama Pengirim</label>
              <input
                type="text"
                disabled={isAnonymous}
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Nama / @username"
                className={`${inputBase} disabled:opacity-40`}
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded accent-amber-500"
                />
                <span>Kirim Anonim</span>
              </label>
            </div>
          </div>

          {/* Recipient & Hashtag */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Penerima (Opsional)</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="@crush atau Si Dia"
                className={inputBase}
              />
            </div>
            <div>
              <label className={labelClass}>Hashtag (Opsional)</label>
              <input
                type="text"
                value={hashtag}
                onChange={(e) => setHashtag(e.target.value)}
                placeholder="#menfess #curhat"
                className={inputBase}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`
                flex-1 py-2.5 rounded-lg font-mono text-xs uppercase font-semibold border transition-colors
                ${isDark ? 'border-stone-700 text-stone-300 hover:bg-stone-800' : 'border-stone-200 text-stone-700 hover:bg-stone-100'}
              `}
            >
              Batal
            </button>
            <button
              type="submit"
              className={`
                flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-mono text-xs uppercase font-semibold
                transition-all shadow-sm
                ${isDark ? 'bg-amber-500 hover:bg-amber-400 text-stone-950' : 'bg-stone-900 hover:bg-stone-800 text-white'}
              `}
            >
              <Plus size={14} />
              <span>Tambah Antrean</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
