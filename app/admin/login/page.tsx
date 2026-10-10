'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Lock, Mail, KeyRound, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (supabase) {
        // Authenticate via Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message || 'Login gagal. Periksa email dan password.');
          setLoading(false);
          return;
        }

        // Verify role admin in server/profiles
        const session = data.session;
        if (session) {
          // Check role via API or profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError || !profile || profile.role !== 'admin') {
            await supabase.auth.signOut();
            setErrorMsg('Akses ditolak: Akun Anda belum terdaftar sebagai admin di database (tabel profiles).');
            setLoading(false);
            return;
          }

          localStorage.setItem('admin_access_token', session.access_token);
          router.push('/admin');
        }
      } else {
        // Fallback demo mode if Supabase credentials are not set in env yet
        if (email === 'admin@menfess.com' && password === 'admin123') {
          localStorage.setItem('admin_access_token', 'demo-admin-session-token');
          router.push('/admin');
        } else {
          setErrorMsg('Email atau password salah (Demo: admin@menfess.com / admin123)');
        }
      }
    } catch (err: any) {
      setErrorMsg('Terjadi kesalahan saat login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 p-8 rounded-2xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-mono text-stone-500 hover:text-stone-300 transition-colors mb-2"
          >
            <ArrowLeft size={14} /> Kembali ke Studio
          </Link>
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
            <Lock size={24} />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-wider uppercase">
            ADMIN PANEL
          </h1>
          <p className="font-mono text-xs text-stone-400">
            Masuk untuk verifikasi dan mengelola menfess
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block font-mono text-xs text-stone-400 uppercase tracking-widest">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-stone-500" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@menfess.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-mono text-xs text-stone-400 uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 text-stone-500" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-serif font-bold text-sm tracking-wider uppercase transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
