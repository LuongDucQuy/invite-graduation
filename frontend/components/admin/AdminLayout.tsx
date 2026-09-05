'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Clock,
  Image as ImageIcon,
  MessageSquare,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('graduation_admin_token');
    const userStr = localStorage.getItem('graduation_admin_user');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    if (userStr) {
      try {
        setAdminUser(JSON.parse(userStr));
      } catch {}
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('graduation_admin_token');
    localStorage.removeItem('graduation_admin_user');
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/events', label: 'Sự Kiện', icon: Calendar },
    { href: '/admin/guests', label: 'Khách Mời', icon: Users },
    { href: '/admin/timeline', label: 'Lịch Trình', icon: Clock },
    { href: '/admin/gallery', label: 'Thư Viện Ảnh', icon: ImageIcon },
    { href: '/admin/messages', label: 'Lời Chúc & Lưu Bút', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-navy-950 text-white border-b border-slate-800">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-champagne-400" />
          <span className="font-serif font-bold text-base tracking-wide">Graduation Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-900"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-navy-950 text-slate-300 flex flex-col justify-between border-r border-slate-800/80 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
            <div className="w-10 h-10 rounded-xl bg-champagne-500/20 border border-champagne-500/40 flex items-center justify-center text-champagne-400 shadow-inner">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-white text-base tracking-wide">
                Graduation Hub
              </h1>
              <p className="text-[11px] text-champagne-400 font-sans tracking-wider uppercase">
                Admin Portal
              </p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-champagne-500/15 text-champagne-300 border border-champagne-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-champagne-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800/60 bg-navy-900/40">
          <div className="flex items-center justify-between mb-3 px-2">
            <div>
              <p className="text-xs text-slate-400">Đang đăng nhập:</p>
              <p className="text-sm font-semibold text-white">{adminUser?.username || 'admin'}</p>
            </div>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        <div className="p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}
