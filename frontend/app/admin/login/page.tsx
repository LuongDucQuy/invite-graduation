'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Lock, User, Sparkles, ArrowRight } from 'lucide-react';
import { AdminService } from '@/services/admin.service';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123456');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await AdminService.login(username, password);
      localStorage.setItem('graduation_admin_token', res.token);
      localStorage.setItem('graduation_admin_user', JSON.stringify(res.admin));
      success('Đăng nhập thành công', `Chào mừng ${res.admin.username}!`);
      router.push('/admin/dashboard');
    } catch (err: any) {
      error('Đăng nhập thất bại', err.message || 'Tài khoản hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-cream-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,rgba(11,19,43,0.95)_70%,rgba(6,11,24,1)_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-[#121C33]/90 backdrop-blur-xl border border-champagne-500/30 rounded-3xl p-8 shadow-2xl">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-champagne-500/20 border border-champagne-500/40 flex items-center justify-center mx-auto mb-4 text-champagne-400">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-cream-50">Admin Portal</h1>
          <p className="text-xs text-champagne-300 uppercase tracking-widest mt-1 font-sans">
            Graduation Invitation System
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Tên đăng nhập
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-slate-700 text-white text-sm focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 outline-none"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-slate-700 text-white text-sm focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Seed demo quick note */}
          <div className="p-3 rounded-xl bg-champagne-500/10 border border-champagne-500/20 text-xs text-champagne-200">
            <p className="font-semibold">Tài khoản demo mặc định:</p>
            <p className="font-mono mt-0.5">admin / Admin@123456</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#E5C378] hover:to-[#D4AF37] text-navy-950 font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-champagne-500/20 transition-all disabled:opacity-50 mt-6"
          >
            <span>{loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-slate-400 hover:text-champagne-300 transition-colors">
            &larr; Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
