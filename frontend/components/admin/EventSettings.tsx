'use client';

import React, { useState } from 'react';
import { Save, Calendar, Clock, MapPin, Music, Image as ImageIcon, Sparkles } from 'lucide-react';
import { AdminService } from '@/services/admin.service';
import { useToast } from '@/components/ui/Toast';
import { EventData } from '@/types/invitation';

interface EventSettingsProps {
  event: EventData;
  onUpdate: (updated: EventData) => void;
}

export function EventSettings({ event, onUpdate }: EventSettingsProps) {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    title: event.title || '',
    graduateName: event.graduateName || '',
    graduateMessage: event.graduateMessage || '',
    description: event.description || '',
    eventDate: event.eventDate ? new Date(event.eventDate).toISOString().slice(0, 16) : '',
    startTime: event.startTime || '',
    endTime: event.endTime || '',
    venueName: event.venueName || '',
    venueAddress: event.venueAddress || '',
    googleMapUrl: event.googleMapUrl || '',
    coverImage: event.coverImage || '',
    avatarImage: event.avatarImage || '',
    backgroundMusic: event.backgroundMusic || '',
    dressCode: event.dressCode || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await AdminService.updateEvent(event.id, {
        ...formData,
        eventDate: formData.eventDate,
      });
      success('Lưu thành công!', 'Thông tin sự kiện đã được cập nhật.');
      onUpdate(updated);
    } catch (err: any) {
      error('Lỗi lưu thông tin', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Thông Tin Lễ Tốt Nghiệp</h2>
          <p className="text-sm text-slate-500">
            Cấu hình nội dung, địa điểm, thời gian và giao diện thiệp mời
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-champagne-600 hover:bg-champagne-700 text-white font-medium text-sm shadow-md transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
        </button>
      </div>

      {/* Basic Info */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-semibold text-slate-800 text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-champagne-600" /> Thông tin cơ bản
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Tên Tân Cử Nhân *
            </label>
            <input
              type="text"
              required
              value={formData.graduateName}
              onChange={(e) => setFormData({ ...formData, graduateName: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Tiêu đề thiệp *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
            Lời chào / Lời mời ngắn từ Tân Cử Nhân
          </label>
          <textarea
            rows={2}
            value={formData.graduateMessage}
            onChange={(e) => setFormData({ ...formData, graduateMessage: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
            placeholder="Quý rất vui khi được chia sẻ một cột mốc đặc biệt này cùng bạn..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
            Đoạn giới thiệu / Cảm xúc về ngày lễ
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
          />
        </div>
      </div>

      {/* Date, Time & Venue */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-semibold text-slate-800 text-base flex items-center gap-2">
          <Calendar className="w-4 h-4 text-champagne-600" /> Thời gian &amp; Địa điểm
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Ngày giờ sự kiện (Target Countdown) *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Giờ bắt đầu hiển thị *
            </label>
            <input
              type="text"
              required
              placeholder="VD: 18:30"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Giờ kết thúc dự kiến
            </label>
            <input
              type="text"
              placeholder="VD: 21:30"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Tên địa điểm / Hội trường *
            </label>
            <input
              type="text"
              required
              value={formData.venueName}
              onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Địa chỉ chi tiết *
            </label>
            <input
              type="text"
              required
              value={formData.venueAddress}
              onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Đường dẫn Google Maps URL
            </label>
            <input
              type="url"
              value={formData.googleMapUrl}
              onChange={(e) => setFormData({ ...formData, googleMapUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
              placeholder="https://maps.google.com/?q=..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Quy định Dress Code
            </label>
            <input
              type="text"
              value={formData.dressCode}
              onChange={(e) => setFormData({ ...formData, dressCode: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
              placeholder="Semi-formal / Elegant (Trắng, Be, Pastel)"
            />
          </div>
        </div>
      </div>

      {/* Media & Music */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-semibold text-slate-800 text-base flex items-center gap-2">
          <Music className="w-4 h-4 text-champagne-600" /> Hình ảnh &amp; Nhạc nền
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Ảnh Cover / Backdrop URL
            </label>
            <input
              type="url"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Ảnh Avatar Tân Cử Nhân URL
            </label>
            <input
              type="url"
              value={formData.avatarImage}
              onChange={(e) => setFormData({ ...formData, avatarImage: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
            Đường dẫn file MP3 Nhạc nền (Background Music)
          </label>
          <input
            type="url"
            value={formData.backgroundMusic}
            onChange={(e) => setFormData({ ...formData, backgroundMusic: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
            placeholder="https://assets.mixkit.co/.../music.mp3"
          />
        </div>
      </div>
    </form>
  );
}
