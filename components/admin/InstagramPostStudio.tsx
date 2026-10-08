'use client';

import { useState, useEffect } from 'react';
import { MenfessSubmission, SubmissionStatus } from '@/types/admin';
import { getTemplateById, templates } from '@/lib/canvas/templates';
import { CanvasPreview } from '@/components/CanvasPreview';
import { downloadPNG } from '@/lib/canvas/renderer';
import { formatInstagramCaption } from '@/lib/storage/submissions';
import {
  Download,
  Copy,
  Check,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Trash2,
  Share2,
  Edit3,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { InstagramIcon } from '@/components/icons/InstagramIcon';

interface InstagramPostStudioProps {
  submission: MenfessSubmission | null;
  onUpdateStatus: (
    id: string,
    status: SubmissionStatus,
    extra?: { instagramUrl?: string; rejectionReason?: string; caption?: string }
  ) => void;
  onUpdateTemplate: (id: string, newTemplateId: string) => void;
  onDelete: (id: string) => void;
  isDark: boolean;
}

export function InstagramPostStudio({
  submission,
  onUpdateStatus,
  onUpdateTemplate,
  onDelete,
  isDark,
}: InstagramPostStudioProps) {
  const [caption, setCaption] = useState('');
  const [copied, setCopied] = useState(false);
  const [igUrlInput, setIgUrlInput] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('Mengandung kata kurang pantas/SARA');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);

  // Sync caption when submission changes
  useEffect(() => {
    if (submission) {
      setCaption(submission.caption || formatInstagramCaption({ code: submission.code, config: submission.config }));
      setIgUrlInput(submission.instagramUrl || '');
      setCopied(false);
      setDownloadDone(false);
      setShowRejectModal(false);
    }
  }, [submission]);

  if (!submission) {
    return (
      <div
        className={`
          h-full min-h-[460px] flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed text-center
          ${isDark ? 'border-stone-800 bg-stone-900/30' : 'border-stone-200 bg-stone-50'}
        `}
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            isDark ? 'bg-stone-800 text-stone-500' : 'bg-stone-200 text-stone-400'
          }`}
        >
          <InstagramIcon size={28} />
        </div>
        <h3
          className={`font-serif text-lg font-bold ${
            isDark ? 'text-stone-300' : 'text-stone-700'
          }`}
        >
          Pilih Menfess dari Antrean
        </h3>
        <p
          className={`font-mono text-xs max-w-sm mt-1.5 ${
            isDark ? 'text-stone-500' : 'text-stone-400'
          }`}
        >
          Pilih salah satu menfess di sebelah kiri untuk melihat preview gambar canvas, generate caption Instagram, dan memproses upload.
        </p>
      </div>
    );
  }

  const selectedTemplate = getTemplateById(submission.config.templateId) || templates[0];

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy caption:', err);
    }
  };

  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      const filename = `[${submission.code}]-menfess-instagram.png`;
      downloadPNG(selectedTemplate, submission.config, filename);
      setDownloadDone(true);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleMarkAsUploaded = () => {
    onUpdateStatus(submission.id, 'uploaded', {
      instagramUrl: igUrlInput.trim() || undefined,
      caption,
    });
  };

  const handleConfirmReject = () => {
    onUpdateStatus(submission.id, 'rejected', {
      rejectionReason,
    });
    setShowRejectModal(false);
  };

  const formattedDate = new Date(submission.createdAt).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`
        rounded-2xl border p-5 sm:p-6 transition-colors duration-300 shadow-sm
        ${isDark ? 'border-stone-800 bg-stone-900/60' : 'border-stone-200 bg-white'}
      `}
    >
      {/* Top Banner / Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-stone-200 dark:border-stone-800 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-amber-600 dark:text-amber-400">
              #{submission.code}
            </span>
            <span
              className={`
                px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold tracking-wider border
                ${
                  submission.status === 'uploaded'
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                    : submission.status === 'approved'
                    ? 'bg-sky-500/10 text-sky-500 border-sky-500/30'
                    : submission.status === 'rejected'
                    ? 'bg-red-500/10 text-red-500 border-red-500/30'
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                }
              `}
            >
              Status: {submission.status}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-stone-500">
            <Calendar size={12} />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Quick moderation buttons */}
        <div className="flex items-center gap-2">
          {submission.status !== 'approved' && submission.status !== 'uploaded' && (
            <button
              onClick={() => onUpdateStatus(submission.id, 'approved', { caption })}
              className={`
                px-3 py-1.5 rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 border transition-colors
                ${
                  isDark
                    ? 'bg-sky-500/10 border-sky-500/30 text-sky-400 hover:bg-sky-500/20'
                    : 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100'
                }
              `}
            >
              <CheckCircle2 size={13} />
              Setujui
            </button>
          )}

          {submission.status !== 'rejected' && (
            <button
              onClick={() => setShowRejectModal(true)}
              className={`
                px-3 py-1.5 rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 border transition-colors
                ${
                  isDark
                    ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                    : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                }
              `}
            >
              <XCircle size={13} />
              Tolak
            </button>
          )}

          <button
            onClick={() => onDelete(submission.id)}
            title="Hapus dari antrean"
            className={`
              p-2 rounded-lg border text-stone-400 hover:text-red-500 transition-colors
              ${isDark ? 'border-stone-800 hover:bg-stone-800' : 'border-stone-200 hover:bg-stone-100'}
            `}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Main Grid: Left = Canvas Preview & Template Selector, Right = Instagram Upload Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Canvas Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span
              className={`font-mono text-xs tracking-widest uppercase font-semibold ${
                isDark ? 'text-stone-300' : 'text-stone-700'
              }`}
            >
              Preview Gambar
            </span>
            <span className="font-mono text-[10px] text-stone-500">
              1080 × 1080 px
            </span>
          </div>

          {/* Canvas Component */}
          <div className="max-w-[360px] mx-auto w-full">
            <CanvasPreview
              template={selectedTemplate}
              config={submission.config}
              isDark={isDark}
            />
          </div>

          {/* Change Template Dropdown */}
          <div className="pt-2">
            <label
              className={`block font-mono text-[10px] tracking-widest uppercase mb-1.5 ${
                isDark ? 'text-stone-400' : 'text-stone-500'
              }`}
            >
              Ganti Template Desain:
            </label>
            <div className="relative">
              <select
                value={selectedTemplate.id}
                onChange={(e) => onUpdateTemplate(submission.id, e.target.value)}
                className={`
                  w-full px-3 py-2 text-xs font-serif rounded-lg border outline-none cursor-pointer
                  ${
                    isDark
                      ? 'bg-stone-800 border-stone-700 text-stone-200'
                      : 'bg-stone-50 border-stone-200 text-stone-800'
                  }
                `}
              >
                {templates.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.name} ({tpl.category})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Instagram Publishing Workflow (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2">
            <InstagramIcon size={18} className="text-pink-600 dark:text-pink-400" />
            <h3
              className={`font-serif text-base sm:text-lg font-bold ${
                isDark ? 'text-stone-100' : 'text-stone-900'
              }`}
            >
              Instagram Dispatch Workflow
            </h3>
          </div>

          {/* Steps container */}
          <div className="space-y-4">
            {/* Step 1: Download Image */}
            <div
              className={`
                p-4 rounded-xl border transition-colors
                ${
                  downloadDone
                    ? isDark ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-emerald-200 bg-emerald-50/50'
                    : isDark ? 'border-stone-800 bg-stone-900' : 'border-stone-200 bg-stone-50'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`
                      w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold
                      ${downloadDone ? 'bg-emerald-500 text-white' : 'bg-stone-300 dark:bg-stone-700 text-stone-900 dark:text-stone-100'}
                    `}
                  >
                    1
                  </span>
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider">
                    Download Gambar High-Res
                  </span>
                </div>
                {downloadDone && (
                  <span className="text-emerald-500 text-[11px] font-mono flex items-center gap-1 font-semibold">
                    <Check size={13} /> Siap Di-upload
                  </span>
                )}
              </div>
              <p className={`text-xs mb-3 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                Unduh file gambar PNG 1080×1080 px untuk diposting di feed atau story Instagram.
              </p>
              <button
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className={`
                  w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-mono text-xs
                  tracking-wider uppercase font-semibold transition-all duration-200 cursor-pointer
                  ${
                    isDark
                      ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-sm'
                      : 'bg-stone-900 hover:bg-stone-800 text-white shadow-sm'
                  }
                `}
              >
                <Download size={15} />
                <span>{isDownloading ? 'Menyiapkan Gambar...' : `Download [${submission.code}] PNG`}</span>
              </button>
            </div>

            {/* Step 2: Copy Caption */}
            <div
              className={`
                p-4 rounded-xl border transition-colors
                ${
                  copied
                    ? isDark ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-emerald-200 bg-emerald-50/50'
                    : isDark ? 'border-stone-800 bg-stone-900' : 'border-stone-200 bg-stone-50'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`
                      w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold
                      ${copied ? 'bg-emerald-500 text-white' : 'bg-stone-300 dark:bg-stone-700 text-stone-900 dark:text-stone-100'}
                    `}
                  >
                    2
                  </span>
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider">
                    Caption Instagram
                  </span>
                </div>
                <button
                  onClick={handleCopyCaption}
                  className={`
                    px-2.5 py-1 rounded-md font-mono text-[11px] font-bold flex items-center gap-1.5 transition-all
                    ${
                      copied
                        ? 'bg-emerald-500 text-white'
                        : isDark
                        ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30'
                        : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                    }
                  `}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copied ? 'Tersalin!' : 'Salin Caption'}</span>
                </button>
              </div>

              {/* Editable Caption Textarea */}
              <div className="relative">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={6}
                  className={`
                    w-full p-3 font-serif text-xs rounded-lg border leading-relaxed resize-y outline-none
                    ${
                      isDark
                        ? 'bg-stone-850 border-stone-700 text-stone-200 focus:border-amber-500'
                        : 'bg-white border-stone-200 text-stone-900 focus:border-stone-400'
                    }
                  `}
                />
              </div>
            </div>

            {/* Step 3: Open Instagram Web */}
            <div
              className={`
                p-4 rounded-xl border transition-colors flex items-center justify-between gap-3
                ${isDark ? 'border-stone-800 bg-stone-900' : 'border-stone-200 bg-stone-50'}
              `}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-stone-300 dark:bg-stone-700 text-stone-900 dark:text-stone-100 flex items-center justify-center font-mono text-[10px] font-bold">
                    3
                  </span>
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider">
                    Buka Instagram
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                  Buka tab baru Instagram untuk membuat postingan feed langsung.
                </p>
              </div>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs font-semibold uppercase tracking-wider
                  border transition-colors whitespace-nowrap
                  ${
                    isDark
                      ? 'border-pink-500/40 text-pink-400 bg-pink-500/10 hover:bg-pink-500/20'
                      : 'border-pink-300 text-pink-700 bg-pink-50 hover:bg-pink-100'
                  }
                `}
              >
                <span>Instagram</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Step 4: Mark as Uploaded */}
            <div
              className={`
                p-4 rounded-xl border transition-colors space-y-3
                ${
                  submission.status === 'uploaded'
                    ? isDark ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-emerald-300 bg-emerald-50'
                    : isDark ? 'border-stone-800 bg-stone-900' : 'border-stone-200 bg-stone-50'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-300 dark:bg-stone-700 text-stone-900 dark:text-stone-100 flex items-center justify-center font-mono text-[10px] font-bold">
                  4
                </span>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider">
                  Konfirmasi Upload Instagram
                </span>
              </div>

              <div>
                <label
                  className={`block font-mono text-[10px] tracking-widest uppercase mb-1 ${
                    isDark ? 'text-stone-400' : 'text-stone-500'
                  }`}
                >
                  Link Postingan Instagram (Opsional):
                </label>
                <input
                  type="url"
                  value={igUrlInput}
                  onChange={(e) => setIgUrlInput(e.target.value)}
                  placeholder="https://www.instagram.com/p/..."
                  className={`
                    w-full px-3 py-2 text-xs font-serif rounded-lg border outline-none
                    ${
                      isDark
                        ? 'bg-stone-850 border-stone-700 text-stone-200 placeholder:text-stone-600 focus:border-emerald-500'
                        : 'bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-emerald-600'
                    }
                  `}
                />
              </div>

              <button
                onClick={handleMarkAsUploaded}
                className={`
                  w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-mono text-xs
                  tracking-wider uppercase font-semibold transition-all cursor-pointer shadow-sm
                  ${
                    submission.status === 'uploaded'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : isDark
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }
                `}
              >
                <CheckCircle2 size={15} />
                <span>
                  {submission.status === 'uploaded'
                    ? 'Perbarui Data Postingan IG'
                    : 'Tandai Sudah Diposting di Instagram'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease]">
          <div
            className={`
              w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4
              ${isDark ? 'bg-stone-900 border-stone-700 text-stone-100' : 'bg-white border-stone-200 text-stone-900'}
            `}
          >
            <h3 className="font-serif text-lg font-bold text-red-600 dark:text-red-400">
              Tolak Menfess #{submission.code}
            </h3>
            <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
              Pilih alasan penolakan untuk arsip editorial:
            </p>

            <div className="space-y-2">
              {[
                'Mengandung kata kurang pantas/SARA',
                'Mengandung doxxing/nama pribadi sensitif',
                'Spam atau pesan tidak bermakna',
                'Pesan duplikat',
              ].map((reason) => (
                <label
                  key={reason}
                  className={`
                    flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer
                    ${
                      rejectionReason === reason
                        ? isDark
                          ? 'border-red-500/40 bg-red-500/10 text-red-300'
                          : 'border-red-300 bg-red-50 text-red-800'
                        : isDark
                        ? 'border-stone-800 hover:bg-stone-800'
                        : 'border-stone-200 hover:bg-stone-50'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="rejection-reason"
                    checked={rejectionReason === reason}
                    onChange={() => setRejectionReason(reason)}
                    className="accent-red-600"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className={`
                  flex-1 py-2 rounded-lg font-mono text-xs uppercase font-semibold border
                  ${isDark ? 'border-stone-700 text-stone-300 hover:bg-stone-800' : 'border-stone-200 text-stone-700 hover:bg-stone-100'}
                `}
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReject}
                className="flex-1 py-2 rounded-lg font-mono text-xs uppercase font-semibold bg-red-600 hover:bg-red-700 text-white"
              >
                Tolak Menfess
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
