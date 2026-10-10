'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MenfessSubmission, SubmissionStatus } from '@/types/admin';
import { getTemplateById } from '@/lib/canvas/templates';
import {
  LogOut,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Download,
  Loader2,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function AdminDashboardPage() {
  const [submissions, setSubmissions] = useState<MenfessSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | SubmissionStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const router = useRouter();

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_access_token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const res = await fetch('/api/admin/submissions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_access_token');
        router.push('/admin/login');
        return;
      }

      const data = await res.json();
      if (data.submissions) {
        setSubmissions(data.submissions);
      }
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_access_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchSubmissions();
  }, [router]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const res = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Gagal mengubah status.');
        return;
      }

      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, status } : sub))
      );

      if (status === 'approved') {
        showToast('Menfess berhasil di-approve.');
      } else {
        showToast('Menfess ditolak.');
      }
    } catch (err) {
      showToast('Gagal memperbarui status.');
    }
  };

  const handleDownloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast('Gambar berhasil di-download!');
    } catch (err) {
      // Fallback direct link download
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = filename;
      a.target = '_blank';
      a.click();
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('admin_access_token');
    router.push('/admin/login');
  };

  const filteredSubmissions = submissions
    .filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.message.toLowerCase().includes(q) ||
        (s.sender_name && s.sender_name.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === 'pending').length,
    approved: submissions.filter((s) => s.status === 'approved').length,
    rejected: submissions.filter((s) => s.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans">
      <header className="border-b border-stone-800 bg-stone-900/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 font-bold font-serif flex items-center justify-center text-lg">
              M
            </div>
            <div>
              <h1 className="font-serif font-bold text-base tracking-wider uppercase text-stone-100">
                MENFESS ADMIN
              </h1>
              <p className="font-mono text-[9px] text-stone-400 tracking-widest uppercase">
                Dashboard Moderasi & Antrean
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSubmissions}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
              title="Refresh data"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono tracking-wider uppercase transition-colors"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-amber-500 text-stone-950 font-mono text-xs font-bold px-4 py-3 rounded-xl shadow-xl animate-bounce">
          {notification}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
              Pending
            </span>
            <div className="flex items-center justify-between">
              <span className="font-serif text-3xl font-bold text-amber-400">
                {stats.pending}
              </span>
              <Clock size={20} className="text-amber-400/50" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
              Approved
            </span>
            <div className="flex items-center justify-between">
              <span className="font-serif text-3xl font-bold text-emerald-400">
                {stats.approved}
              </span>
              <CheckCircle2 size={20} className="text-emerald-400/50" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
              Rejected
            </span>
            <div className="flex items-center justify-between">
              <span className="font-serif text-3xl font-bold text-red-400">
                {stats.rejected}
              </span>
              <XCircle size={20} className="text-red-400/50" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
              Total
            </span>
            <div className="flex items-center justify-between">
              <span className="font-serif text-3xl font-bold text-stone-200">
                {stats.total}
              </span>
              <Filter size={20} className="text-stone-500" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-stone-900 border border-stone-800">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase font-semibold transition-colors whitespace-nowrap ${
                  statusFilter === filter
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                [ {filter} ]
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 text-stone-500" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pesan / pengirim..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-stone-500 flex flex-col items-center gap-2">
            <Loader2 size={24} className="animate-spin text-amber-500" />
            <span className="font-mono text-xs uppercase tracking-widest">
              Memuat data menfess...
            </span>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="py-16 text-center text-stone-500 border border-dashed border-stone-800 rounded-2xl">
            <p className="font-serif text-base">Tidak ada menfess ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubmissions.map((sub) => {
              const template = getTemplateById(sub.template_id);

              return (
                <div
                  key={sub.id}
                  className="rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden flex flex-col justify-between hover:border-stone-700 transition-colors"
                >
                  <div className="p-5 space-y-4">
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-950 border border-stone-800 group">
                      {sub.image_url ? (
                        <img
                          src={sub.image_url}
                          alt="Menfess Render"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-600 font-mono text-xs">
                          No Image
                        </div>
                      )}
                      <button
                        onClick={() => setPreviewImage(sub.image_url)}
                        className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-stone-100 font-mono text-xs gap-2"
                      >
                        <Eye size={16} /> Lihat Gambar Full
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="px-2.5 py-1 rounded-md bg-stone-800 text-stone-300 border border-stone-700 uppercase tracking-wider">
                        {template?.name || sub.template_id}
                      </span>

                      <span
                        className={`px-2.5 py-1 rounded-full border uppercase tracking-wider font-bold text-[10px] ${
                          sub.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : sub.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="font-serif text-sm text-stone-200 line-clamp-3 leading-relaxed">
                        "{sub.message}"
                      </p>
                    </div>

                    <div className="text-[11px] font-mono text-stone-400 border-t border-stone-800/80 pt-3 space-y-1">
                      <div>
                        Pengirim:{' '}
                        <span className="text-stone-200 font-semibold">
                          {sub.sender_name || 'Anonim'}
                        </span>
                      </div>
                      <div>
                        Waktu:{' '}
                        <span className="text-stone-400">
                          {new Date(sub.created_at).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-stone-800 bg-stone-950/50 flex gap-3">
                    <button
                      onClick={() => handleDownloadImage(sub.image_url, `menfess-${sub.id}.png`)}
                      className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
                    >
                      <Download size={15} />
                      Download
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(sub.id, 'rejected')}
                      className="px-4 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    >
                      <XCircle size={15} />
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="relative max-w-2xl w-full bg-stone-900 border border-stone-700 rounded-2xl p-4 space-y-4">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 p-1 rounded-full bg-stone-800 text-stone-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="font-serif text-sm font-bold text-stone-300">
              Preview Full Render PNG
            </h3>
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-stone-950 border border-stone-800">
              <img
                src={previewImage}
                alt="Full Preview"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
