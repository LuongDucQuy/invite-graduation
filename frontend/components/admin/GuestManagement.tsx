'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Plus,
  FileSpreadsheet,
  Copy,
  ExternalLink,
  Edit2,
  Trash2,
  Check,
  CheckCircle2,
  XCircle,
  Clock,
  MailCheck,
  Filter,
} from 'lucide-react';
import { AdminService } from '@/services/admin.service';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { formatDateTime } from '@/lib/utils';
import { RsvpStatus } from '@/types/invitation';

interface GuestManagementProps {
  eventId: string;
}

export function GuestManagement({ eventId }: GuestManagementProps) {
  const { success, error, info } = useToast();
  const [guests, setGuests] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [rsvpFilter, setRsvpFilter] = useState('');
  const [openedFilter, setOpenedFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);

  // Form State
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    relationship: '',
    numberOfGuests: 1,
    rsvpStatus: 'PENDING' as RsvpStatus,
  });

  // CSV Import State
  const [csvText, setCsvText] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const fetchGuests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await AdminService.getGuests({
        eventId,
        search: search.trim() || undefined,
        rsvpStatus: rsvpFilter || undefined,
        isOpened: openedFilter !== '' ? openedFilter === 'true' : undefined,
        page,
        limit: 20,
      });
      setGuests(res.guests);
      setTotal(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (err: any) {
      error('Lỗi tải danh sách khách mời', err.message);
    } finally {
      setLoading(false);
    }
  }, [eventId, search, rsvpFilter, openedFilter, page, error]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  const handleCopyLink = (token: string, name: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const inviteUrl = `${origin}/invite/${token}`;
    navigator.clipboard.writeText(inviteUrl);
    success('Đã sao chép link!', `Đã sao chép đường link thiệp riêng cho ${name}`);
  };

  const handleCreateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) return;

    try {
      await AdminService.createGuest({
        eventId,
        name: formState.name,
        email: formState.email || undefined,
        phone: formState.phone || undefined,
        relationship: formState.relationship || undefined,
        numberOfGuests: Number(formState.numberOfGuests) || 1,
      });
      success('Thêm khách thành công!', `Đã tạo thiệp mời cho ${formState.name}`);
      setIsAddModalOpen(false);
      setFormState({ name: '', email: '', phone: '', relationship: '', numberOfGuests: 1, rsvpStatus: 'PENDING' });
      fetchGuests();
    } catch (err: any) {
      error('Lỗi tạo khách mời', err.message);
    }
  };

  const handleUpdateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuest) return;

    try {
      await AdminService.updateGuest(selectedGuest.id, {
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        relationship: formState.relationship,
        numberOfGuests: Number(formState.numberOfGuests),
        rsvpStatus: formState.rsvpStatus,
      });
      success('Cập nhật thành công!', `Đã lưu thông tin cho ${formState.name}`);
      setIsEditModalOpen(false);
      setSelectedGuest(null);
      fetchGuests();
    } catch (err: any) {
      error('Lỗi cập nhật', err.message);
    }
  };

  const handleDeleteGuest = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa khách mời "${name}" không?`)) return;

    try {
      await AdminService.deleteGuest(id);
      success('Đã xóa khách mời', `Đã xóa ${name} khỏi danh sách`);
      fetchGuests();
    } catch (err: any) {
      error('Lỗi xóa khách mời', err.message);
    }
  };

  const handleOpenEdit = (guest: any) => {
    setSelectedGuest(guest);
    setFormState({
      name: guest.name,
      email: guest.email || '',
      phone: guest.phone || '',
      relationship: guest.relationship || '',
      numberOfGuests: guest.numberOfGuests || 1,
      rsvpStatus: guest.rsvpStatus,
    });
    setIsEditModalOpen(true);
  };

  const handleImportCsv = async () => {
    if (!csvText.trim()) return;

    setIsImporting(true);
    try {
      const lines = csvText.trim().split('\n');
      const parsedGuests: any[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Skip header if line starts with name
        if (i === 0 && (line.toLowerCase().includes('name') || line.toLowerCase().includes('tên'))) {
          continue;
        }

        const parts = line.split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
        if (parts[0]) {
          parsedGuests.push({
            name: parts[0],
            email: parts[1] || undefined,
            phone: parts[2] || undefined,
            relationship: parts[3] || undefined,
            numberOfGuests: parts[4] ? parseInt(parts[4], 10) : 1,
          });
        }
      }

      if (parsedGuests.length === 0) {
        throw new Error('Không tìm thấy dòng dữ liệu hợp lệ trong nội dung CSV');
      }

      await AdminService.importGuests(eventId, parsedGuests);
      success('Import thành công!', `Đã thêm ${parsedGuests.length} khách mời vào danh sách.`);
      setIsImportModalOpen(false);
      setCsvText('');
      fetchGuests();
    } catch (err: any) {
      error('Lỗi Import CSV', err.message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Quản Lý Khách Mời</h2>
          <p className="text-sm text-slate-500">
            Tổng cộng: <strong>{total}</strong> khách mời &bull; Mỗi khách có một đường link thiệp riêng biệt
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-sm transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={() => {
              setFormState({ name: '', email: '', phone: '', relationship: '', numberOfGuests: 1, rsvpStatus: 'PENDING' });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-champagne-600 hover:bg-champagne-700 text-white font-medium text-sm shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Khách Mới</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo tên, email, sđt, quan hệ, token..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 outline-none text-sm text-slate-800"
          />
        </div>

        {/* RSVP Filter */}
        <select
          value={rsvpFilter}
          onChange={(e) => {
            setRsvpFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none bg-white w-full md:w-auto"
        >
          <option value="">Tất cả RSVP</option>
          <option value="ATTENDING">✓ Sẽ tham dự</option>
          <option value="NOT_ATTENDING">✕ Không tham dự</option>
          <option value="PENDING">⏳ Chưa phản hồi</option>
        </select>

        {/* Opened Filter */}
        <select
          value={openedFilter}
          onChange={(e) => {
            setOpenedFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none bg-white w-full md:w-auto"
        >
          <option value="">Tất cả trạng thái mở</option>
          <option value="true">Đã mở thiệp</option>
          <option value="false">Chưa mở thiệp</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Khách Mời</th>
                <th className="px-6 py-3.5">Mối Quan Hệ</th>
                <th className="px-6 py-3.5">Trạng Thái RSVP</th>
                <th className="px-6 py-3.5">Đã Mở</th>
                <th className="px-6 py-3.5">Link Thiệp Riêng</th>
                <th className="px-6 py-3.5 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Đang tải dữ liệu khách mời...
                  </td>
                </tr>
              ) : guests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    Không tìm thấy khách mời nào phù hợp
                  </td>
                </tr>
              ) : (
                guests.map((g) => {
                  return (
                    <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{g.name}</div>
                        <div className="text-xs text-slate-400">
                          {g.phone || g.email || 'Chưa có thông tin liên lạc'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {g.relationship || 'Khách mời'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {g.rsvpStatus === 'ATTENDING' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Tham dự ({g.numberOfGuests} pax)
                          </span>
                        )}
                        {g.rsvpStatus === 'NOT_ATTENDING' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            Không thể đến
                          </span>
                        )}
                        {g.rsvpStatus === 'PENDING' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            Chưa phản hồi
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {g.openedAt ? (
                          <span className="text-xs text-blue-600 flex items-center gap-1 font-medium" title={formatDateTime(g.openedAt)}>
                            <MailCheck className="w-4 h-4" />
                            {formatDateTime(g.openedAt).split(' ')[0]}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Chưa mở</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono font-bold bg-slate-100 px-2 py-1 rounded text-champagne-800 border border-slate-200">
                            {g.inviteToken}
                          </code>
                          <button
                            onClick={() => handleCopyLink(g.inviteToken, g.name)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-champagne-700 hover:bg-champagne-50 transition-colors"
                            title="Sao chép link thiệp"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <a
                            href={`/invite/${g.inviteToken}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Mở xem trước thiệp"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(g)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteGuest(g.id, g.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Xóa khách"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>
              Trang {page} / {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >
                Trước
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Thêm Khách Mời Mới">
        <form onSubmit={handleCreateGuest} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Tên khách mời *</label>
            <input
              type="text"
              required
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
              placeholder="VD: Nguyễn Văn A"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Số điện thoại</label>
              <input
                type="text"
                value={formState.phone}
                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
                placeholder="0901234567"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Mối quan hệ</label>
              <input
                type="text"
                value={formState.relationship}
                onChange={(e) => setFormState({ ...formState, relationship: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
                placeholder="Bạn thân, Gia đình..."
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Email</label>
            <input
              type="email"
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
              placeholder="guest@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Số lượng người đi kèm (Pax)</label>
            <input
              type="number"
              min={1}
              max={10}
              value={formState.numberOfGuests}
              onChange={(e) => setFormState({ ...formState, numberOfGuests: parseInt(e.target.value, 10) || 1 })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-champagne-600 hover:bg-champagne-700 text-white font-medium text-sm"
            >
              Tạo Khách Mời
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Chỉnh Sửa Khách Mời">
        <form onSubmit={handleUpdateGuest} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Tên khách mời *</label>
            <input
              type="text"
              required
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Số điện thoại</label>
              <input
                type="text"
                value={formState.phone}
                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Mối quan hệ</label>
              <input
                type="text"
                value={formState.relationship}
                onChange={(e) => setFormState({ ...formState, relationship: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Trạng thái RSVP</label>
              <select
                value={formState.rsvpStatus}
                onChange={(e) => setFormState({ ...formState, rsvpStatus: e.target.value as RsvpStatus })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800 bg-white"
              >
                <option value="PENDING">PENDING (Chưa phản hồi)</option>
                <option value="ATTENDING">ATTENDING (Sẽ tham dự)</option>
                <option value="NOT_ATTENDING">NOT_ATTENDING (Không thể đến)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Số lượng khách (Pax)</label>
              <input
                type="number"
                min={1}
                max={10}
                value={formState.numberOfGuests}
                onChange={(e) => setFormState({ ...formState, numberOfGuests: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
              />
            </div>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-medium text-sm"
            >
              Lưu Thay Đổi
            </button>
          </div>
        </form>
      </Modal>

      {/* CSV Import Modal */}
      <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} title="Import Danh Sách Khách Từ CSV" maxWidth="lg">
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Dán nội dung danh sách theo định dạng CSV (mỗi dòng một khách):
            <br />
            <code className="bg-slate-100 p-1 rounded font-mono text-slate-700 block mt-1">
              Tên, Email, Số điện thoại, Quan hệ, Số người
            </code>
          </p>
          <textarea
            rows={8}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 outline-none"
            placeholder={`Nguyễn Văn A, a@example.com, 0901234567, Bạn thân, 2\nTrần Văn B, b@example.com, 0912345678, Đồng nghiệp, 1\nLê Thị C, c@example.com, 0923456789, Gia đình, 3`}
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsImportModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleImportCsv}
              disabled={isImporting || !csvText.trim()}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm disabled:opacity-50"
            >
              {isImporting ? 'Đang import...' : 'Tiến Hành Import'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
