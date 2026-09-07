"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Heart, Sparkles, User } from "lucide-react";
import { MessageItem } from "@/types/invitation";
import { InvitationService } from "@/services/invitation.service";
import { useToast } from "@/components/ui/Toast";
import { formatDateTime } from "@/lib/utils";

interface WishesWallProps {
  token: string;
  initialMessages: MessageItem[];
  defaultGuestName: string;
  graduateName: string;
}

const PRESET_WISHES = [
  "Chúc mừng Tân cử nhân! 🎉",
  "Chúc bạn luôn rực rỡ và thành công trên chặng đường mới! 🚀",
  "Tự hào về cậu rất nhiều! ❤️",
  "Chúc Quý vạn dặm bình an, tiền đồ xán lạn! 🎓",
  "Chúc Quý 8386 🎓",
];

export function WishesWall({
  token,
  initialMessages,
  defaultGuestName,
  graduateName,
}: WishesWallProps) {
  const { success, error } = useToast();
  const [messages, setMessages] = useState<MessageItem[]>(
    initialMessages || [],
  );
  const [content, setContent] = useState("");
  const [customName, setCustomName] = useState(defaultGuestName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const newMessage = await InvitationService.postMessage(
        token,
        content.trim(),
        customName.trim() || defaultGuestName,
      );
      setMessages((prev) => [newMessage, ...prev]);
      setContent("");
      success(
        "Đã gửi lời chúc!",
        `Lời chúc của bạn đã được gửi đến ${graduateName}! 🎉`,
      );
    } catch (err: any) {
      error("Lỗi gửi lời chúc", err.message || "Vui lòng thử lại sau");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyPreset = (preset: string) => {
    setContent(preset);
  };

  return (
    <section className="relative py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-100/70 border border-champagne-200 text-champagne-800 text-xs font-semibold uppercase tracking-widest mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-champagne-600" />
            SỔ LƯU BÚT CHÚC MỪNG
          </div>
          <h3 className=" text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Gửi lời chúc đến {graduateName}
          </h3>
          <p className="text-slate-500 text-sm mt-1 font-light">
            Hãy để lại những dòng nhắn gửi yêu thương và kỷ niệm đẹp
          </p>
        </motion.div>

        {/* Wish Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-md rounded-3xl border border-champagne-200 shadow-xl shadow-champagne-500/5 p-6 md:p-8 mb-10"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-champagne-600" /> Tên người
                gửi
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-champagne-500 focus:ring-2 focus:ring-champagne-200 outline-none text-sm text-slate-800"
                placeholder="Tên của bạn"
                required
              />
            </div>

            {/* Quick preset pills */}
            <div>
              <p className="text-xs text-slate-400 mb-2">
                Gợi ý lời chúc nhanh:
              </p>
              <div className="flex flex-wrap gap-2">
                {PRESET_WISHES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="text-xs px-3 py-1.5 rounded-full bg-champagne-50 hover:bg-champagne-100 text-champagne-800 border border-champagne-200 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wider text-slate-600 mb-1.5">
                Nội dung lời chúc
              </label>
              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-champagne-500 focus:ring-2 focus:ring-champagne-200 outline-none text-sm text-slate-800 resize-none"
                placeholder="Viết lời chúc của bạn tại đây..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-champagne-600 to-amber-600 hover:from-champagne-700 hover:to-amber-700 text-white font-medium text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Đang gửi..." : "GỬI LỜI CHÚC"}</span>
            </button>
          </form>
        </motion.div>

        {/* Message List */}
        <div className="space-y-4">
          <h4 className=" text-xl font-bold text-slate-800 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            Lời chúc từ mọi người
          </h4>

          <AnimatePresence>
            {messages.length === 0 ? (
              <p className="text-center py-8 text-slate-400 text-sm font-light">
                Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc đến{" "}
                {graduateName}!
              </p>
            ) : (
              messages.map((msg, index) => (
                <motion.div
                  key={msg.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-champagne-200/80 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-champagne-100 text-champagne-800  font-bold text-sm flex items-center justify-center">
                        {msg.guestName
                          ? msg.guestName.charAt(0).toUpperCase()
                          : "G"}
                      </div>
                      <span className=" font-bold text-slate-900 text-sm">
                        {msg.guestName}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {formatDateTime(msg.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 font-light leading-relaxed pl-10">
                    {msg.content}
                  </p>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
