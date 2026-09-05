'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { EventSettings } from '@/components/admin/EventSettings';
import { AdminService } from '@/services/admin.service';
import { EventData } from '@/types/invitation';
import { useToast } from '@/components/ui/Toast';

export default function AdminEventsPage() {
  const { error } = useToast();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const primary = await AdminService.getPrimaryEvent();
        setEvent(primary);
      } catch (err: any) {
        error('Lỗi tải thông tin sự kiện', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [error]);

  return (
    <AdminLayout>
      {loading ? (
        <div className="py-20 text-center text-slate-400">Đang tải thông tin sự kiện...</div>
      ) : event ? (
        <EventSettings event={event} onUpdate={(updated) => setEvent(updated)} />
      ) : (
        <div className="py-12 text-center text-slate-400">Chưa tìm thấy sự kiện nào</div>
      )}
    </AdminLayout>
  );
}
