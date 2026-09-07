"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Heart } from "lucide-react";
import { EventData, GuestData } from "@/types/invitation";

interface ClosingNoteProps {
  event: EventData;
  guest: GuestData;
}

export function ClosingNote({ event, guest }: ClosingNoteProps) {
  return (
    <footer className="relative py-20 px-4 text-center overflow-hidden">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-[#1C2541] to-[#0B132B] text-cream-50 border border-champagne-500/30 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-champagne-500/10 rounded-full blur-3xl pointer-events-none" />

          <GraduationCap className="w-12 h-12 text-champagne-400 mx-auto mb-4" />

          <h4 className=" text-2xl md:text-3xl font-medium tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-champagne-200 via-champagne-400 to-champagne-100 mb-3">
            Hẹn gặp Bạn!
          </h4>

          <p className="text-slate-300 text-sm md:text-base font-light leading-relaxed max-w-md mx-auto mb-6">
            Cảm ơn{" "}
            <strong className="text-champagne-300 font-medium">
              {guest.name}
            </strong>{" "}
            đã luôn đồng hành, yêu thương và ủng hộ mình suốt những năm tháng
            qua.
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-champagne-300/80 uppercase tracking-widest font-sans pt-4 border-t border-champagne-500/20">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>for {event.graduateName} &bull; 2026</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
