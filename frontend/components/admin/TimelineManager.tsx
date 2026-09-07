"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Clock, Sparkles } from "lucide-react";
import { AdminService } from "@/services/admin.service";
import { useToast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { TimelineItem } from "@/types/invitation";

interface TimelineManagerProps {
  eventId: string;
}

export function TimelineManager({ eventId }: TimelineManagerProps) {
  const { success, error } = useToast();
  const [timelines, setTimelines] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [formData, setFormData] = useState({
    time: "",
    title: "",
    description: "",
    icon: "clock",
    sortOrder: 1,
  });

  const fetchTimelines = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getTimelines(eventId);
      setTimelines(data);
    } catch (err: any) {
      error("Lỗi tải lịch trình", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelines();
  }, [eventId]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      time: "",
      title: "",
      description: "",
      icon: "sparkles",
      sortOrder: timelines.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TimelineItem) => {
    setEditingItem(item);
    setFormData({
      time: item.time,
      title: item.title,
      description: item.description || "",
      icon: item.icon || "clock",
      sortOrder: item.sortOrder,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await AdminService.updateTimeline(editingItem.id, {
          ...formData,
          sortOrder: Number(formData.sortOrder),
        });
        success("Cập nhật thành công", "Mốc thời gian đã được chỉnh sửa");
      } else {
        await AdminService.createTimeline({
          eventId,
          ...formData,
          sortOrder: Number(formData.sortOrder),
        });
        success("Thêm thành công", "Mốc thời gian mới đã được thêm");
      }
      setIsModalOpen(false);
      fetchTimelines();
    } catch (err: any) {
      error("Lỗi lưu lịch trình", err.message);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Xác nhận xóa mốc "${title}"?`)) return;
    try {
      await AdminService.deleteTimeline(id);
      success("Đã xóa mốc thời gian");
      fetchTimelines();
    } catch (err: any) {
      error("Lỗi xóa mốc", err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className=" text-2xl font-bold text-slate-900">
            Lịch Trình Sự Kiện
          </h2>
          <p className="text-sm text-slate-500">
            Quản lý các mốc thời gian hiển thị trên thiệp mời
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-champagne-600 hover:bg-champagne-700 text-white font-medium text-sm shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Mốc Mới</span>
        </button>
      </div>

      {/* Timelines List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-slate-400">
            Đang tải lịch trình...
          </div>
        ) : timelines.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            Chưa có mốc thời gian nào
          </div>
        ) : (
          timelines.map((item) => (
            <div
              key={item.id}
              className="p-5 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="w-20 px-3 py-1.5 rounded-lg bg-champagne-100 text-champagne-800 font-mono font-bold text-xs text-center">
                  {item.time}
                </span>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.description}
                    </p>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono">
                    Icon: {item.icon} &bull; Thứ tự: {item.sortOrder}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingItem ? "Chỉnh Sửa Mốc Thời Gian" : "Thêm Mốc Thời Gian Mới"
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Thời gian (VD: 18:30) *
              </label>
              <input
                type="text"
                required
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Thứ tự sắp xếp *
              </label>
              <input
                type="number"
                required
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sortOrder: parseInt(e.target.value, 10) || 1,
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Tiêu đề hoạt động *
            </label>
            <input
              type="text"
              required
              placeholder="VD: Nghi thức trao bằng tốt nghiệp"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Mô tả chi tiết
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Icon đại diện
            </label>
            <select
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
              }
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-champagne-500 outline-none text-sm text-slate-800 bg-white"
            >
              <option value="camera">camera (Chụp ảnh lưu niệm)</option>
              <option value="sparkles">
                sparkles (Khai mạc / Sự kiện đặc biệt)
              </option>
              <option value="award">award (Trao bằng cử nhân)</option>
              <option value="film">film (Chiếu video kỷ niệm)</option>
              <option value="music">music (Âm nhạc &amp; Tiệc mừng)</option>
              <option value="coffee">coffee (Nghỉ ngơi / Teabreak)</option>
              <option value="clock">clock (Mặc định)</option>
            </select>
          </div>

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
              Lưu
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
