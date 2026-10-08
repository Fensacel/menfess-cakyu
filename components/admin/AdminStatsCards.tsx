'use client';

import { Clock, CheckCircle2, XCircle, Inbox } from 'lucide-react';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { SubmissionStatus } from '@/types/admin';

interface AdminStatsCardsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    uploaded: number;
    rejected: number;
  };
  activeFilter: 'all' | SubmissionStatus;
  onSelectFilter: (filter: 'all' | SubmissionStatus) => void;
  isDark: boolean;
}

export function AdminStatsCards({
  stats,
  activeFilter,
  onSelectFilter,
  isDark,
}: AdminStatsCardsProps) {
  const cards = [
    {
      id: 'all' as const,
      label: 'Semua Menfess',
      count: stats.total,
      icon: Inbox,
      color: isDark ? 'text-stone-300' : 'text-stone-700',
      activeRing: isDark ? 'ring-stone-400 bg-stone-800/80' : 'ring-stone-800 bg-stone-100',
    },
    {
      id: 'pending' as const,
      label: 'Menunggu Review',
      count: stats.pending,
      icon: Clock,
      color: isDark ? 'text-amber-400' : 'text-amber-600',
      activeRing: isDark ? 'ring-amber-500 bg-amber-500/10' : 'ring-amber-600 bg-amber-50',
    },
    {
      id: 'approved' as const,
      label: 'Siap Di-upload',
      count: stats.approved,
      icon: CheckCircle2,
      color: isDark ? 'text-sky-400' : 'text-sky-600',
      activeRing: isDark ? 'ring-sky-500 bg-sky-500/10' : 'ring-sky-600 bg-sky-50',
    },
    {
      id: 'uploaded' as const,
      label: 'Sudah di Instagram',
      count: stats.uploaded,
      icon: InstagramIcon,
      color: isDark ? 'text-emerald-400' : 'text-emerald-600',
      activeRing: isDark ? 'ring-emerald-500 bg-emerald-500/10' : 'ring-emerald-600 bg-emerald-50',
    },
    {
      id: 'rejected' as const,
      label: 'Ditolak',
      count: stats.rejected,
      icon: XCircle,
      color: isDark ? 'text-red-400' : 'text-red-600',
      activeRing: isDark ? 'ring-red-500 bg-red-500/10' : 'ring-red-600 bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <button
            key={card.id}
            onClick={() => onSelectFilter(card.id)}
            className={`
              p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer
              ${
                isActive
                  ? `ring-2 ${card.activeRing} shadow-md`
                  : isDark
                  ? 'border-stone-800 bg-stone-900/40 hover:bg-stone-900 hover:border-stone-700'
                  : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
              }
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`font-mono text-[10px] tracking-widest uppercase truncate ${
                  isDark ? 'text-stone-400' : 'text-stone-500'
                }`}
              >
                {card.label}
              </span>
              <Icon size={16} className={card.color} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`font-serif text-2xl font-bold ${card.color}`}>
                {card.count}
              </span>
              <span
                className={`font-mono text-[10px] ${
                  isDark ? 'text-stone-500' : 'text-stone-400'
                }`}
              >
                post
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
