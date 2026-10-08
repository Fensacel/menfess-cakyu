'use client';

import { useState, useEffect, useMemo } from 'react';
import { MenfessSubmission, SubmissionStatus } from '@/types/admin';
import { MenfessConfig } from '@/types/template';
import {
  getSubmissions,
  saveSubmissions,
  updateSubmission,
  deleteSubmission,
  addSubmission,
} from '@/lib/storage/submissions';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminStatsCards } from '@/components/admin/AdminStatsCards';
import { AdminQueueList } from '@/components/admin/AdminQueueList';
import { InstagramPostStudio } from '@/components/admin/InstagramPostStudio';
import { NewMenfessModal } from '@/components/admin/NewMenfessModal';

export default function AdminPage() {
  const [isDark, setIsDark] = useState(false);
  const [submissions, setSubmissions] = useState<MenfessSubmission[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | SubmissionStatus>('all');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    const load = () => {
      const data = getSubmissions();
      setSubmissions(data);
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id);
      }
    };

    load();

    const handleUpdate = () => load();
    window.addEventListener('menfess-submissions-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('menfess-submissions-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [selectedId]);

  // Statistics calculation
  const stats = useMemo(() => {
    return {
      total: submissions.length,
      pending: submissions.filter((s) => s.status === 'pending').length,
      approved: submissions.filter((s) => s.status === 'approved').length,
      uploaded: submissions.filter((s) => s.status === 'uploaded').length,
      rejected: submissions.filter((s) => s.status === 'rejected').length,
    };
  }, [submissions]);

  // Selected item
  const selectedSubmission = useMemo(() => {
    return submissions.find((s) => s.id === selectedId) || null;
  }, [submissions, selectedId]);

  // Actions
  const handleUpdateStatus = (
    id: string,
    status: SubmissionStatus,
    extra?: { instagramUrl?: string; rejectionReason?: string; caption?: string }
  ) => {
    const updated = updateSubmission(id, {
      status,
      ...extra,
    });
    setSubmissions(updated);
  };

  const handleUpdateTemplate = (id: string, newTemplateId: string) => {
    const sub = submissions.find((s) => s.id === id);
    if (!sub) return;
    const updated = updateSubmission(id, {
      config: {
        ...sub.config,
        templateId: newTemplateId,
      },
    });
    setSubmissions(updated);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Yakin ingin menghapus menfess ini dari antrean?')) return;
    const updated = deleteSubmission(id);
    setSubmissions(updated);
    if (selectedId === id) {
      setSelectedId(updated[0]?.id || null);
    }
  };

  const handleNewManual = (config: MenfessConfig) => {
    const created = addSubmission(config);
    setSubmissions(getSubmissions());
    setSelectedId(created.id);
  };

  const handleResetData = () => {
    if (!confirm('Reset semua data antrean ke contoh bawaan?')) return;
    localStorage.removeItem('menfess_studio_submissions_v1');
    const fresh = getSubmissions();
    setSubmissions(fresh);
    setSelectedId(fresh[0]?.id || null);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-stone-950 text-stone-100' : 'bg-stone-50 text-stone-900'
      }`}
    >
      {/* Header */}
      <AdminHeader
        isDark={isDark}
        onThemeToggle={() => setIsDark((d) => !d)}
        onNewManual={() => setIsNewModalOpen(true)}
        onResetData={handleResetData}
        pendingCount={stats.pending}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Banner Announcement */}
        <div
          className={`
            p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4
            ${
              isDark
                ? 'bg-gradient-to-r from-stone-900 to-amber-950/20 border-stone-800'
                : 'bg-gradient-to-r from-amber-50/70 to-stone-50 border-amber-900/15'
            }
          `}
        >
          <div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-amber-600 dark:text-amber-400 font-bold">
              ★ Instagram Dispatcher Desk
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold mt-0.5">
              Kelola Antrean & Upload Menfess
            </h2>
            <p className={`text-xs mt-1 max-w-2xl ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
              Review kiriman menfess, unduh canvas gambar resolusi tinggi, salin caption Instagram otomatis, dan tandai saat postingan sudah live di feed Instagram.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className={isDark ? 'text-stone-300' : 'text-stone-700'}>
              Sinkronisasi Lokal Aktif
            </span>
          </div>
        </div>

        {/* Statistics Cards */}
        <AdminStatsCards
          stats={stats}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          isDark={isDark}
        />

        {/* Master-Detail Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Queue List (4 cols) */}
          <div
            className={`
              lg:col-span-4 p-4 rounded-2xl border transition-colors
              ${isDark ? 'border-stone-800 bg-stone-900/40' : 'border-stone-200 bg-stone-100/50'}
            `}
          >
            <AdminQueueList
              submissions={submissions}
              selectedId={selectedId}
              onSelect={(sub) => setSelectedId(sub.id)}
              isDark={isDark}
              activeFilter={activeFilter}
            />
          </div>

          {/* Right Column: Instagram Studio & Workflow (8 cols) */}
          <div className="lg:col-span-8">
            <InstagramPostStudio
              submission={selectedSubmission}
              onUpdateStatus={handleUpdateStatus}
              onUpdateTemplate={handleUpdateTemplate}
              onDelete={handleDelete}
              isDark={isDark}
            />
          </div>
        </div>
      </main>

      {/* Manual Input Modal */}
      <NewMenfessModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleNewManual}
        isDark={isDark}
      />
    </div>
  );
}
