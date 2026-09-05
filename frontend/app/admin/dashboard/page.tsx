'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatsOverview } from '@/components/admin/StatsOverview';
import { AdminService } from '@/services/admin.service';
import { DashboardStats } from '@/types/admin';
import { EventData } from '@/types/invitation';
import { useToast } from '@/components/ui/Toast';
import { Sparkles, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { error } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, primaryEvent] = await Promise.all([
          AdminService.getStats(),
          AdminService.getPrimaryEvent(),
        ]);
        setStats(statsData);
        setEvent(primaryEvent);
      } catch (err: any) {
        error('Lỗi tải dữ liệu Dashboard', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [error]);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top welcome banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-[#162238] text-cream-50 border border-champagne-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-500/20 border border-champagne-400/30 text-champagne-300 text-xs font-semibold tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              TỔNG QUAN HỆ THỐNG THIỆP MỜI
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-white">
              {event?.title || 'Lễ Tốt Nghiệp — Lương Đức Quý'}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 font-light">
              Tân Cử Nhân: <strong className="text-champagne-300">{event?.graduateName}</strong> &bull; Ngày: {event?.eventDate ? new Date(event.eventDate).toLocaleDateString('vi-VN') : '20/09/2026'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/guests"
              className="px-4 py-2.5 rounded-xl bg-champagne-600 hover:bg-champagne-700 text-white font-medium text-xs md:text-sm shadow-sm transition-colors"
            >
              Xem Khách Mời
            </Link>
            <Link
              href="/admin/events"
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium text-xs md:text-sm transition-colors"
            >
              Chỉnh Sửa Sự Kiện
            </Link>
          </div>
        </div>

        {/* Analytics & Stats */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">Đang tổng hợp dữ liệu thống kê...</div>
        ) : stats ? (
          <StatsOverview stats={stats} />
        ) : (
          <div className="py-12 text-center text-slate-400">Không có dữ liệu thống kê</div>
        )}
      </div>
    </AdminLayout>
  );
}
