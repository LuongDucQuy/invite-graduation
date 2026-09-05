'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Send, Heart, Users, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GuestData, RsvpStatus } from '@/types/invitation';
import { InvitationService } from '@/services/invitation.service';
import { useToast } from '@/components/ui/Toast';

interface RSVPSectionProps {
  token: string;
  guest: GuestData;
  graduateName: string;
  onRsvpSuccess: (updatedGuest: GuestData) => void;
}

export function RSVPSection({ token, guest, graduateName, onRsvpSuccess }: RSVPSectionProps) {
  const { success, error } = useToast();
  const [currentStatus, setCurrentStatus] = useState<RsvpStatus>(guest.rsvpStatus);
  const [numberOfGuests, setNumberOfGuests] = useState<number>(guest.numberOfGuests || 1);
  const [guestName, setGuestName] = useState<string>(guest.name);
  const [rsvpMessage, setRsvpMessage] = useState<string>(guest.rsvpMessage || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(guest.rsvpStatus !== 'PENDING');

  const handleSubmit = async (selectedStatus: RsvpStatus) => {
    setIsSubmitting(true);
    try {
      const updated = await InvitationService.submitRsvp(token, {
        rsvpStatus: selectedStatus,
        numberOfGuests: selectedStatus === 'ATTENDING' ? numberOfGuests : 1,
        rsvpMessage: rsvpMessage.trim() || undefined,
        guestName: guestName.trim() || guest.name,
      });

      setCurrentStatus(selectedStatus);
      setHasSubmitted(true);
      onRsvpSuccess(updated);

      if (selectedStatus === 'ATTENDING') {
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.7 },
            colors: ['#10B981', '#D4AF37', '#F4E8D0', '#3B82F6'],
          });
        } catch {}
        success('Xác nhận thành công!', `Cảm ơn bạn đã nhận lời tham dự cùng ${graduateName}! ❤️`);
      } else {
        success('Đã ghi nhận phản hồi', 'Cảm ơn bạn đã phản hồi. Quý rất trân trọng tình cảm của bạn! ❤️');
      }
    } catch (err: any) {
      error('Không thể gửi phản hồi', err.message || 'Vui lòng thử lại sau');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp-section" className="relative py-16 px-4">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-100/70 border border-champagne-200 text-champagne-800 text-xs font-semibold uppercase tracking-widest mb-2">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/30" />
            XÁC NHẬN THAM DỰ
          </div>
          <h3 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Will You Join Us?
          </h3>
          <p className="text-slate-500 text-sm mt-1 font-light">
            Sự hiện diện của bạn là niềm vinh dự lớn đối với {graduateName}
          </p>
        </motion.div>

        {/* RSVP Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-white/90 backdrop-blur-md rounded-3xl border border-champagne-200 shadow-xl shadow-champagne-500/10 p-6 md:p-8"
        >
          {/* Status Badge if already submitted */}
          {hasSubmitted && (
            <div className="mb-6 p-4 rounded-2xl bg-champagne-50 border border-champagne-200/80 text-center">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                TRẠNG THÁI HIỆN TẠI CỦA BẠN
              </p>
              <div className="inline-flex items-center gap-2 font-serif font-bold text-base md:text-lg">
                {currentStatus === 'ATTENDING' ? (
                  <span className="text-emerald-700 flex items-center gap-1.5">
                    <Check className="w-5 h-5" /> Bạn sẽ tham dự ({numberOfGuests} người)
                  </span>
                ) : (
                  <span className="text-rose-600 flex items-center gap-1.5">
                    <X className="w-5 h-5" /> Tiếc quá, bạn không thể đến
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                (Bạn có thể thay đổi câu trả lời bất kỳ lúc nào bên dưới)
              </p>
            </div>
          )}

          {/* Action Choice Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => handleSubmit('ATTENDING')}
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-medium text-sm md:text-base transition-all duration-300 shadow-sm ${
                currentStatus === 'ATTENDING'
                  ? 'bg-emerald-600 text-white shadow-emerald-500/25 shadow-lg scale-[1.02]'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100/80'
              }`}
            >
              <Check className="w-5 h-5" />
              <span>SẼ THAM DỰ</span>
            </button>

            <button
              type="button"
              onClick={() => handleSubmit('NOT_ATTENDING')}
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-medium text-sm md:text-base transition-all duration-300 shadow-sm ${
                currentStatus === 'NOT_ATTENDING'
                  ? 'bg-slate-700 text-white shadow-slate-500/25 shadow-lg scale-[1.02]'
                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100/80'
              }`}
            >
              <X className="w-5 h-5" />
              <span>KHÔNG THỂ ĐẾN</span>
            </button>
          </div>

          {/* Extended fields for Plus-ones & Message */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Tên khách mời
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-champagne-500 focus:ring-2 focus:ring-champagne-200 outline-none text-sm text-slate-800"
                placeholder="Nhập tên của bạn"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-champagne-600" /> Số lượng người tham dự
                </span>
                <span className="text-champagne-700 font-bold">{numberOfGuests} người</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setNumberOfGuests(num)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      numberOfGuests === num
                        ? 'bg-champagne-600 text-white border-champagne-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Lời nhắn gửi đến {graduateName} (tuỳ chọn)
              </label>
              <textarea
                rows={3}
                value={rsvpMessage}
                onChange={(e) => setRsvpMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-champagne-500 focus:ring-2 focus:ring-champagne-200 outline-none text-sm text-slate-800 resize-none"
                placeholder="Gửi lời chúc mừng hoặc dặn dò đặc biệt..."
              />
            </div>

            <button
              type="button"
              onClick={() => handleSubmit(currentStatus === 'NOT_ATTENDING' ? 'NOT_ATTENDING' : 'ATTENDING')}
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-medium text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Send className="w-4 h-4 text-champagne-400" />
              <span>{isSubmitting ? 'Đang cập nhật...' : 'LƯU PHẢN HỒI'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
