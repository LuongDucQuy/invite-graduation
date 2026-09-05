'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { AdminService } from '@/services/admin.service';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { GalleryItem } from '@/types/invitation';

interface GalleryManagerProps {
  eventId: string;
}

export function GalleryManager({ eventId }: GalleryManagerProps) {
  const { success, error } = useToast();
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    imageUrl: '',
    caption: '',
    sortOrder: 1,
  });

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getGalleries(eventId);
      setGalleries(data);
    } catch (err: any) {
      error('Lỗi tải danh sách ảnh', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, [eventId]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      imageUrl: '',
      caption: '',
      sortOrder: galleries.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      imageUrl: item.imageUrl,
      caption: item.caption || '',
      sortOrder: item.sortOrder,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await AdminService.updateGallery(editingItem.id, {
          ...formData,
          sortOrder: Number(formData.sortOrder),
        });
        success('Cập nhật thành công', 'Ảnh đã được chỉnh sửa');
      } else {
        await AdminService.createGallery({
          eventId,
          ...formData,
          sortOrder: Number(formData.sortOrder),
        });
        success('Thêm thành công', 'Ảnh mới đã được thêm');
      }
      setIsModalOpen(false);
      fetchGalleries();
    } catch (err: any) {
      error('Lỗi lưu ảnh', err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa ảnh này?')) return;
    try {
      await AdminService.deleteGallery(id);
      success('Đã xóa ảnh');
      fetchGalleries();
    } catch (err: any) {
      error('Lỗi xóa ảnh', err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Thư Viện Ảnh (Gallery)</h2>
          <p className="text-sm text-slate-500">
            Quản lý các hình ảnh kỷ niệm, ảnh tốt nghiệp hiển thị trong thiệp
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-champagne-600 hover:bg-champagne-700 text-white font-medium text-sm shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Ảnh Mới</span>
        </button>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="text-center py-10 text-slate-400">Đang tải danh sách ảnh...</div>
      ) : galleries.length === 0 ? (
        <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-200">
          Chưa có hình ảnh nào trong thư viện
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleries.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.caption || 'Gallery photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono">
                  #{item.sortOrder}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-700 line-clamp-2 mb-3">
                  {item.caption || '(Không có chú thích)'}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <a
                    href={item.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-champagne-700 hover:underline flex items-center gap-1"
                  >
                    Xem gốc <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Chỉnh Sửa Ảnh' : 'Thêm Ảnh Mới Vào Thư Viện'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Đường dẫn URL Hình Ảnh *
            </label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Chú thích ảnh (Caption)
            </label>
            <input
              type="text"
              placeholder="VD: Kỷ niệm ngày chụp kỷ yếu"
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Thứ tự hiển thị
            </label>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 1 })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
            />
          </div>

          {formData.imageUrl && (
            <div>
              <p className="text-xs text-slate-500 mb-1">Xem trước ảnh:</p>
              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-champagne-600 hover:bg-champagne-700 text-white font-medium text-sm"
            >
              Lưu Ảnh
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
