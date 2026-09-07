"use client";

import React from "react";
import { motion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import { Sparkles, Hourglass } from "lucide-react";

interface CountdownTimerProps {
  targetDate: string | Date;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  const timeUnits = [
    { label: "NGÀY", value: days },
    { label: "GIỜ", value: hours },
    { label: "PHÚT", value: minutes },
    { label: "GIÂY", value: seconds },
  ];

  return (
    <section className="relative py-14 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-100/70 border border-champagne-200 text-champagne-800 text-xs font-semibold uppercase tracking-widest mb-2">
            <Hourglass className="w-3.5 h-3.5 text-champagne-600 animate-spin-slow" />
            ĐẾM NGƯỢC THỜI GIAN
          </div>
          <h3 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Khoảnh khắc đang đến gần
          </h3>
        </motion.div>

        {isExpired ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-8 rounded-3xl bg-gradient-to-r from-[#1C2541] to-[#0B132B] text-cream-50 border border-champagne-400 shadow-2xl max-w-xl mx-auto"
          >
            <Sparkles className="w-10 h-10 text-champagne-300 mx-auto mb-3" />
            <h4 className=" text-2xl md:text-3xl font-bold text-champagne-300">
              THE DAY HAS ARRIVED 🎓
            </h4>
            <p className="text-slate-300 text-sm mt-2 font-light">
              Buổi lễ tốt nghiệp đang diễn ra. Chúc mừng Tân Cử nhân!
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto">
            {timeUnits.map((unit, index) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center justify-center p-3 md:p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-champagne-200/80 shadow-lg shadow-champagne-500/5 group hover:border-champagne-400 transition-colors"
              >
                <span className=" text-2xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-champagne-800">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-widest text-champagne-700 uppercase mt-1">
                  {unit.label}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
