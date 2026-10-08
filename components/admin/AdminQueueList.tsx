'use client';

import { useState } from 'react';
import { MenfessSubmission, SubmissionStatus } from '@/types/admin';
import { Search, Clock, CheckCircle2, XCircle, ArrowUpDown } from 'lucide-react';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { getTemplateById } from '@/lib/canvas/templates';

interface AdminQueueListProps {
  submissions: MenfessSubmission[];
  selectedId: string | null;
  onSelect: (sub: MenfessSubmission) => void;
  isDark: boolean;
  activeFilter: 'all' | SubmissionStatus;
}

export function AdminQueueList({
  submissions,
  selectedId,
  onSelect,
  isDark,
  activeFilter,
}: AdminQueueListProps) {
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter & Search
  const filtered = submissions.filter((sub) => {
    if (activeFilter !== 'all' && sub.status !== activeFilter) {
      return false;
    }
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      sub.code.toLowerCase().includes(q) ||
      sub.config.message.toLowerCase().includes(q) ||
      sub.config.senderName.toLowerCase().includes(q) ||
      (sub.config.recipientName && sub.config.recipientName.toLowerCase().includes(q))
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return sortAsc ? timeA - timeB : timeB - timeA;
  });

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Menunggu',
          icon: Clock,
          classes: isDark
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            : 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'approved':
        return {
          label: 'Siap Upload',
          icon: CheckCircle2,
          classes: isDark
            ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
            : 'bg-sky-50 text-sky-700 border-sky-200',
        };
      case 'uploaded':
        return {
          label: 'Di Instagram',
          icon: InstagramIcon,
          classes: isDark
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'rejected':
        return {
          label: 'Ditolak',
          icon: XCircle,
          classes: isDark
            ? 'bg-red-500/10 text-red-400 border-red-500/30'
            : 'bg-red-50 text-red-700 border-red-200',
        };
    }
  };

  const formatTime = (iso: string) => {
    try {
      const date = new Date(iso);
      const diffMs = Date.now() - date.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return 'Baru saja';
      if (diffMin < 60) return `${diffMin}m lalu`;
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour}j lalu`;
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Search & Sort toolbar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            size={14}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              isDark ? 'text-stone-500' : 'text-stone-400'
            }`}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pesan, kode (#MF-), pengirim..."
            className={`
              w-full pl-9 pr-3 py-2 text-xs font-serif rounded-lg border outline-none
              ${
                isDark
                  ? 'bg-stone-900 border-stone-800 text-stone-200 placeholder:text-stone-600 focus:border-amber-500'
                  : 'bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-stone-400'
              }
            `}
          />
        </div>

        <button
          onClick={() => setSortAsc((prev) => !prev)}
          title={sortAsc ? 'Urutkan Terlama ke Terbaru' : 'Urutkan Terbaru ke Terlama'}
          className={`
            p-2 rounded-lg border text-xs flex items-center justify-center transition-colors
            ${
              isDark
                ? 'border-stone-800 hover:bg-stone-850 text-stone-400 bg-stone-900'
                : 'border-stone-200 hover:bg-stone-50 text-stone-600 bg-white'
            }
          `}
        >
          <ArrowUpDown size={14} />
        </button>
      </div>

      {/* List count summary */}
      <div className="flex items-center justify-between px-1">
        <span
          className={`font-mono text-[10px] tracking-widest uppercase ${
            isDark ? 'text-stone-500' : 'text-stone-400'
          }`}
        >
          Antrean ({sorted.length})
        </span>
      </div>

      {/* Cards Scroll Container */}
      <div className="space-y-2.5 overflow-y-auto max-h-[calc(100vh-280px)] pr-1 custom-scrollbar">
        {sorted.length === 0 ? (
          <div
            className={`
              p-8 text-center rounded-xl border border-dashed
              ${isDark ? 'border-stone-800 text-stone-600' : 'border-stone-200 text-stone-400'}
            `}
          >
            <p className="font-serif text-sm">Tidak ada menfess yang cocok</p>
            <p className="font-mono text-[10px] mt-1">Coba ganti filter atau kata kunci pencarian</p>
          </div>
        ) : (
          sorted.map((sub) => {
            const isSelected = sub.id === selectedId;
            const badge = getStatusBadge(sub.status);
            const template = getTemplateById(sub.config.templateId);
            const Icon = badge.icon;

            return (
              <div
                key={sub.id}
                onClick={() => onSelect(sub)}
                className={`
                  p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 relative
                  ${
                    isSelected
                      ? isDark
                        ? 'border-amber-500/80 bg-stone-850 shadow-lg ring-1 ring-amber-500/40'
                        : 'border-stone-900 bg-amber-50/40 shadow-md ring-1 ring-stone-900/10'
                      : isDark
                      ? 'border-stone-800 bg-stone-900/60 hover:bg-stone-850 hover:border-stone-700'
                      : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                  }
                `}
              >
                {/* Header row: Code, Template badge, Status badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold tracking-wider text-amber-600 dark:text-amber-400">
                      #{sub.code}
                    </span>
                    <span
                      className={`
                        font-mono text-[9px] px-2 py-0.5 rounded border uppercase tracking-wider
                        ${
                          isDark
                            ? 'bg-stone-800 border-stone-700 text-stone-400'
                            : 'bg-stone-100 border-stone-200 text-stone-600'
                        }
                      `}
                    >
                      {template?.name || 'Custom'}
                    </span>
                  </div>

                  <span
                    className={`
                      inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full border font-medium
                      ${badge.classes}
                    `}
                  >
                    <Icon size={10} />
                    {badge.label}
                  </span>
                </div>

                {/* Message snippet */}
                <p
                  className={`
                    font-serif text-xs line-clamp-2 leading-relaxed mb-2
                    ${isDark ? 'text-stone-200' : 'text-stone-800'}
                  `}
                >
                  "{sub.config.message}"
                </p>

                {/* Footer info: Sender/To & Time */}
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span
                    className={`truncate max-w-[180px] ${
                      isDark ? 'text-stone-400' : 'text-stone-500'
                    }`}
                  >
                    {sub.config.isAnonymous ? 'Anonim' : sub.config.senderName || 'Anonim'}
                    {sub.config.recipientName ? ` → ${sub.config.recipientName}` : ''}
                  </span>
                  <span className={isDark ? 'text-stone-500' : 'text-stone-400'}>
                    {formatTime(sub.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
