'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, MessageSquare, Heart, Clock, User } from 'lucide-react';
import { AdminService } from '@/services/admin.service';
import { useToast } from '@/components/ui/Toast';
import { MessageItem } from '@/types/invitation';
import { formatDateTime } from '@/lib/utils';

interface MessagesModerationProps {
  eventId: string;
}

export function MessagesModeration({ eventId }: MessagesModerationProps) {
  const { success, error } = useToast();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getMessages(eventId);
      setMessages(data);
    } catch (err: any) {
      error('Lỗi tải danh sách lời chúc', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [eventId]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa lời chúc này?')) return;
    try {
      await AdminService.deleteMessage(id);
      success('Đã xóa lời chúc');
      fetchMessages();
    } catch (err: any) {
      error('Lỗi xóa lời chúc', err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-slate-900">Sổ Lưu Bút &amp; Lời Chúc</h2>
        <p className="text-sm text-slate-500">
          Tổng cộng: <strong>{messages.length}</strong> lời chúc được gửi từ khách mời
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400">Đang tải danh sách lời chúc...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-200">
          Chưa có lời chúc nào từ khách mời
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-champagne-100 text-champagne-800 font-serif font-bold text-xs flex items-center justify-center">
                      {msg.guestName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{msg.guestName}</h4>
                      <p className="text-[11px] text-slate-400">{formatDateTime(msg.createdAt)}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Xóa lời chúc"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-slate-700 font-light leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
