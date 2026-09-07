"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Navigation,
  Shirt,
  CalendarDays,
} from "lucide-react";
import { EventData } from "@/types/invitation";

interface EventDetailsProps {
  event: EventData;
}

export function EventDetails({ event }: EventDetailsProps) {
  const eventDateObj = new Date(event.eventDate);
  const formattedDateString = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(eventDateObj);

  const handleOpenMap = () => {
    if (event.googleMapUrl) {
      window.open(event.googleMapUrl, "_blank", "noopener,noreferrer");
    } else {
      const query = encodeURIComponent(
        `${event.venueName}, ${event.venueAddress}`,
      );
      window.open(
        `https://maps.google.com/?q=${query}`,
        "_blank",
        "noopener,noreferrer",
      );
    }
  };

  return (
    <section className="relative py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-champagne-100/60 border border-champagne-300/60 text-champagne-700 text-xs uppercase tracking-widest font-semibold mb-3">
            <CalendarDays className="w-3.5 h-3.5" />
            THÔNG TIN BUỔI LỄ
          </div>
          <h3 className="text-3xl md:text-4xl text-slate-900 font-bold tracking-tight">
            Thời gian &amp; địa điểm
          </h3>
          <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto font-light">
            Trân trọng kính mời quý khách đến chung vui cùng Tân Cử nhân theo
            thông tin chi tiết dưới đây
          </p>
        </motion.div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Date Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/80 backdrop-blur-md border border-champagne-200 shadow-lg shadow-champagne-500/5 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-champagne-50 border border-champagne-200 flex items-center justify-center text-champagne-600 mb-5 shadow-inner">
              <Calendar className="w-7 h-7" />
            </div>
            <p className="text-lg tracking-widest text-champagne-600 font-semibold mb-1">
              Ngày tổ chức
            </p>
            <h4 className=" text-xl font-bold text-slate-800 capitalize mb-1">
              {formattedDateString}
            </h4>
            <p className="text-xs text-slate-500">Năm 2026</p>
          </motion.div>

          {/* Time Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/80 backdrop-blur-md border border-champagne-200 shadow-lg shadow-champagne-500/5 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-champagne-50 border border-champagne-200 flex items-center justify-center text-champagne-600 mb-5 shadow-inner">
              <Clock className="w-7 h-7" />
            </div>
            <p className="text-lg tracking-widest text-champagne-600 font-semibold mb-1">
              Giờ bắt đầu
            </p>
            <h4 className=" text-2xl font-bold text-slate-800 mb-1">
              {event.startTime}
            </h4>
            <p className="text-xs text-slate-500">
              {event.endTime
                ? `Kết thúc dự kiến: ${event.endTime}`
                : "Vui lòng đến đúng giờ"}
            </p>
          </motion.div>

          {/* Venue Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/80 backdrop-blur-md border border-champagne-200 shadow-lg shadow-champagne-500/5 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-champagne-50 border border-champagne-200 flex items-center justify-center text-champagne-600 mb-5 shadow-inner">
              <MapPin className="w-7 h-7" />
            </div>
            <p className="text-lg tracking-widest text-champagne-600 font-semibold mb-1">
              Địa điểm tổ chức
            </p>
            <h4 className="text-lg font-bold text-slate-800 mb-1 leading-snug">
              {event.venueName}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-2">
              {event.venueAddress}
            </p>
          </motion.div>
        </div>

        {/* Dress Code & Location Map Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-cream-100 via-white to-cream-100 border border-champagne-200 flex flex-col sm:flex-row items-center justify-center gap-6 shadow-sm"
        >
          <button
            onClick={handleOpenMap}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-medium text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all"
          >
            <Navigation className="w-4 h-4 text-champagne-400" />
            <span>XEM BẢN ĐỒ GOOGLE MAPS</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
