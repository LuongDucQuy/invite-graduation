'use client';

import React from 'react';
import { Users, MailCheck, CheckCircle2, XCircle, Clock, MessageSquare, Sparkles } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { DashboardStats } from '@/types/admin';

interface StatsOverviewProps {
  stats: DashboardStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const cards = [
    {
      title: 'Tổng khách mời',
      value: stats.totalGuests,
      sub: `${stats.totalAttendingPax} người tham dự dự kiến`,
      icon: Users,
      color: 'bg-blue-500/10 text-blue-600 border-blue-200',
    },
    {
      title: 'Đã mở thiệp',
      value: stats.openedGuests,
      sub: `${stats.totalGuests > 0 ? Math.round((stats.openedGuests / stats.totalGuests) * 100) : 0}% tỷ lệ mở`,
      icon: MailCheck,
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
    },
    {
      title: 'Xác nhận tham dự',
      value: stats.attendingGuests,
      sub: `${stats.totalAttendingPax} người (kèm bạn bè/gia đình)`,
      icon: CheckCircle2,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Không thể tham dự',
      value: stats.notAttendingGuests,
      sub: 'Đã gửi lời chúc từ xa',
      icon: XCircle,
      color: 'bg-rose-500/10 text-rose-600 border-rose-200',
    },
    {
      title: 'Chưa phản hồi (Pending)',
      value: stats.pendingGuests,
      sub: 'Cần nhắc nhở RSVP',
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-600 border-amber-200',
    },
    {
      title: 'Lời chúc & Tin nhắn',
      value: stats.totalMessages,
      sub: 'Đã gửi vào sổ lưu bút',
      icon: MessageSquare,
      color: 'bg-champagne-500/10 text-champagne-700 border-champagne-300',
    },
  ];

  const rsvpData = [
    { name: 'Sẽ tham dự', value: stats.attendingGuests, color: '#10B981' },
    { name: 'Không tham dự', value: stats.notAttendingGuests, color: '#EF4444' },
    { name: 'Chưa phản hồi', value: stats.pendingGuests, color: '#F59E0B' },
  ].filter((d) => d.value > 0);

  const openData = [
    { name: 'Đã mở thiệp', value: stats.openedGuests, color: '#3B82F6' },
    { name: 'Chưa mở', value: stats.unopenedGuests, color: '#9CA3AF' },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  {c.title}
                </p>
                <h3 className="text-3xl font-bold text-slate-900">{c.value}</h3>
                <p className="text-xs text-slate-500 mt-1">{c.sub}</p>
              </div>
              <div className={`p-3 rounded-xl border ${c.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RSVP Status Chart */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <h4 className="font-semibold text-slate-800 text-base mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-champagne-600" />
            Phân bổ trạng thái RSVP
          </h4>
          <div className="h-64 w-full flex items-center justify-center">
            {rsvpData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={rsvpData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {rsvpData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-sm">Chưa có dữ liệu phản hồi</p>
            )}
          </div>
        </div>

        {/* Open Rate Chart */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <h4 className="font-semibold text-slate-800 text-base mb-4 flex items-center gap-2">
            <MailCheck className="w-4 h-4 text-blue-600" />
            Tỷ lệ mở thiệp mời
          </h4>
          <div className="h-64 w-full flex items-center justify-center">
            {openData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={openData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {openData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-sm">Chưa có dữ liệu mở thiệp</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
