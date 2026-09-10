"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Send,
  Heart,
  Users,
  Sparkles,
  ImageIcon,
  MessageSquare,
  User,
} from "lucide-react";
import confetti from "canvas-confetti";
import { GuestData, RsvpStatus } from "@/types/invitation";
import { InvitationService } from "@/services/invitation.service";
import { useToast } from "@/components/ui/Toast";

interface RSVPSectionProps {
  token: string;
  guest: GuestData;
  graduateName: string;
  onRsvpSuccess: (updatedGuest: GuestData) => void;
}

export function RSVPSection({
  token,
  guest,
  graduateName,
  onRsvpSuccess,
}: RSVPSectionProps) {
  const { success, error } = useToast();
  const [currentStatus, setCurrentStatus] = useState<RsvpStatus>(
    guest.rsvpStatus,
  );
  const [numberOfGuests, setNumberOfGuests] = useState<number>(
    guest.numberOfGuests || 1,
  );
  const [guestName, setGuestName] = useState<string>(guest.name);
  const [rsvpMessage, setRsvpMessage] = useState<string>(
    guest.rsvpMessage || "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(
    guest.rsvpStatus !== "PENDING",
  );

  const handleSubmit = async (selectedStatus: RsvpStatus) => {
    setIsSubmitting(true);
    try {
      const updated = await InvitationService.submitRsvp(token, {
        rsvpStatus: selectedStatus,
        numberOfGuests: selectedStatus === "ATTENDING" ? numberOfGuests : 1,
        rsvpMessage: rsvpMessage.trim() || undefined,
        guestName: guestName.trim() || guest.name,
      });

      setCurrentStatus(selectedStatus);
      setHasSubmitted(true);
      onRsvpSuccess(updated);

      if (selectedStatus === "ATTENDING") {
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.7 },
            colors: ["#10B981", "#D4AF37", "#F4E8D0", "#3B82F6"],
          });
        } catch {}
        success(
          "Xác nhận thành công!",
          `Cảm ơn bạn đã nhận lời tham dự cùng ${graduateName}! ❤️`,
        );
      } else {
        success(
          "Đã ghi nhận phản hồi",
          "Cảm ơn bạn đã phản hồi. Quý rất trân trọng tình cảm của bạn! ❤️",
        );
      }
    } catch (err: any) {
      error("Không thể gửi phản hồi", err.message || "Vui lòng thử lại sau");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp-section" className="relative py-20 px-4">
      <div className="max-w-lg mx-auto">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          {/* Ornamental top rule */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-champagne-400/50" />
            <span className="text-champagne-400 text-sm leading-none select-none">
              ✦
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-champagne-400/50" />
          </div>

          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Tham dự buổi lễ tốt nghiệp
          </h3>

          <p className="text-sm md:text-base text-slate-400 italic font-light">
            Sự hiện diện của bạn là niềm vui lớn đối với mình
          </p>

          {/* Ornamental bottom rule */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className="h-px w-6 bg-champagne-300/60" />
            <div className="h-px w-12 bg-champagne-400/40" />
            <div className="h-px w-6 bg-champagne-300/60" />
          </div>
        </motion.div>

        {/* ── RSVP Card ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/90 backdrop-blur-md rounded-[2rem] border border-champagne-200/60 shadow-lg shadow-champagne-300/10 p-7 md:p-10"
        >
          {/* ── Status badge (only shown after submit) ── */}
          {hasSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className={`mb-8 py-5 px-6 rounded-2xl text-center ${
                currentStatus === "ATTENDING"
                  ? "bg-emerald-50/80 border border-emerald-200/50"
                  : "bg-rose-50/80 border border-rose-200/50"
              }`}
            >
              {currentStatus === "ATTENDING" ? (
                <>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 mb-3">
                    <Check className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="font-semibold text-emerald-800 text-base">
                    Bạn sẽ tham dự
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-100 mb-3">
                    <X className="w-5 h-5 text-rose-500" />
                  </div>
                  <p className="font-semibold text-rose-800 text-base">
                    Tiếc quá, bạn không thể đến
                  </p>
                </>
              )}
              <p className="text-xs text-slate-400 mt-3">
                Bạn có thể thay đổi câu trả lời bất kỳ lúc nào bên dưới
              </p>
            </motion.div>
          )}

          {/* ── RSVP choice buttons ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {/* Attending */}
            <button
              type="button"
              onClick={() => handleSubmit("ATTENDING")}
              disabled={isSubmitting}
              className={`flex flex-col items-center justify-center gap-1.5 py-5 px-4 rounded-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-400 ${
                currentStatus === "ATTENDING"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20 scale-[1.02]"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/50"
              }`}
            >
              <Check
                className={`w-5 h-5 transition-colors duration-200 ${
                  currentStatus === "ATTENDING"
                    ? "text-white"
                    : "text-emerald-500"
                }`}
              />
              <span className="text-sm font-semibold tracking-wide">
                Sẽ tham dự
              </span>
              <span
                className={`text-xs transition-colors duration-200 ${
                  currentStatus === "ATTENDING"
                    ? "text-emerald-100/80"
                    : "text-slate-400"
                }`}
              >
                Mình sẽ có mặt
              </span>
            </button>

            {/* Not attending */}
            <button
              type="button"
              onClick={() => handleSubmit("NOT_ATTENDING")}
              disabled={isSubmitting}
              className={`flex flex-col items-center justify-center gap-1.5 py-5 px-4 rounded-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-400 ${
                currentStatus === "NOT_ATTENDING"
                  ? "bg-slate-700 text-white shadow-md shadow-slate-600/20 scale-[1.02]"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-rose-200 hover:bg-rose-50/50"
              }`}
            >
              <X
                className={`w-5 h-5 transition-colors duration-200 ${
                  currentStatus === "NOT_ATTENDING"
                    ? "text-white"
                    : "text-rose-400"
                }`}
              />
              <span className="text-sm font-semibold tracking-wide">
                Không thể đến
              </span>
              <span
                className={`text-xs transition-colors duration-200 ${
                  currentStatus === "NOT_ATTENDING"
                    ? "text-slate-300"
                    : "text-slate-400"
                }`}
              >
                Tiếc khi vắng mặt
              </span>
            </button>
          </div>

          <div className="space-y-5 pt-6 border-t border-champagne-100/70">
            {/* Guest name */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-slate-500 mb-2">
                <User className="w-3.5 h-3.5 text-champagne-500" />
                Tên khách mời
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white/70 focus:border-champagne-400 focus:ring-2 focus:ring-champagne-200/40 outline-none text-sm text-slate-800 placeholder:text-slate-300 transition-all duration-200"
                placeholder="Nhập tên của bạn..."
              />
            </div>

            {/* Submit CTA */}
            <button
              type="button"
              onClick={() =>
                handleSubmit(
                  currentStatus === "NOT_ATTENDING"
                    ? "NOT_ATTENDING"
                    : "ATTENDING",
                )
              }
              disabled={isSubmitting}
              className="w-full py-4 mt-1 rounded-xl bg-navy-900 hover:bg-navy-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm tracking-widest uppercase flex items-center justify-center gap-2 shadow-md shadow-navy-900/15 hover:shadow-lg hover:shadow-navy-900/20 active:scale-[0.985] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-400"
            >
              <Send className="w-4 h-4 text-champagne-400" />
              <span>{isSubmitting ? "Đang cập nhật..." : "Gửi phản hồi"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
