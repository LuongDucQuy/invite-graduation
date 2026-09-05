'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { GuestManagement } from '@/components/admin/GuestManagement';
import { AdminService } from '@/services/admin.service';
import { useToast } from '@/components/ui/Toast';

export default function AdminGuestsPage() {
  const { error } = useToast();
  const [eventId, setEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const primary = await AdminService.getPrimaryEvent();
        if (primary) {
          setEventId(primary.id);
        }
      } catch (err: any) {
        error('Lỗi tải sự kiện', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [error]);

  return (
    <AdminLayout>
      {loading ? (
        <div className="py-20 text-center text-slate-400">Đang tải danh sách khách mời...</div>
      ) : eventId ? (
        <GuestManagement eventId={eventId} />
      ) : (
        <div className="py-12 text-center text-slate-400">Không tìm thấy sự kiện liên kết</div>
      )}
    </AdminLayout>
  );
}
