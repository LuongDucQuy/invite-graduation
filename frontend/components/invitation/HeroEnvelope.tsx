"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, MailOpen } from "lucide-react";
import confetti from "canvas-confetti";
import { EventData, GuestData } from "@/types/invitation";

interface HeroEnvelopeProps {
  event: EventData;
  guest: GuestData;
  onOpen: () => void;
  isOpen: boolean;
}

export function HeroEnvelope({
  event,
  guest,
  onOpen,
  isOpen,
}: HeroEnvelopeProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);

    // Trigger celebratory gold confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#F4E8D0", "#C5A059", "#1C2541", "#FFFFFF"],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      onOpen();
    }, 900);
  };

  if (isOpen) return null;

  const eventDateObj = new Date(event.eventDate);
  const formattedDay = eventDateObj.getDate().toString().padStart(2, "0");
  const formattedMonth = (eventDateObj.getMonth() + 1)
    .toString()
    .padStart(2, "0");
  const formattedYear = eventDateObj.getFullYear();

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.05,
        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950 px-4 select-none overflow-hidden"
    >
      {/* Background ambient light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,rgba(11,19,43,0.95)_70%,rgba(6,11,24,1)_100%)] pointer-events-none" />

      {/* Decorative Golden Borders */}
      <div className="absolute inset-6 md:inset-12 border border-champagne-500/20 rounded-3xl pointer-events-none" />
      <div className="absolute inset-8 md:inset-14 border border-champagne-500/10 rounded-2xl pointer-events-none" />

      {/* Corner Ornaments */}
      <div className="absolute top-8 left-8 md:top-14 md:left-14 w-8 h-8 border-t-2 border-l-2 border-champagne-400/40 pointer-events-none" />
      <div className="absolute top-8 right-8 md:top-14 md:right-14 w-8 h-8 border-t-2 border-r-2 border-champagne-400/40 pointer-events-none" />
      <div className="absolute bottom-8 left-8 md:bottom-14 md:left-14 w-8 h-8 border-b-2 border-l-2 border-champagne-400/40 pointer-events-none" />
      <div className="absolute bottom-8 right-8 md:bottom-14 md:right-14 w-8 h-8 border-b-2 border-r-2 border-champagne-400/40 pointer-events-none" />

      {/* Envelope Card Container */}
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.96 }}
        animate={{
          y: isOpening ? -40 : 0,
          opacity: isOpening ? 0.3 : 1,
          scale: isOpening ? 1.05 : 1,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-lg w-full bg-gradient-to-b from-[#162238] via-[#0E1726] to-[#0B132B] rounded-3xl p-8 md:p-12 text-center border border-champagne-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.15)] backdrop-blur-xl"
      >
        {/* Floating Sparkle icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="mx-auto w-12 h-12 rounded-full bg-champagne-500/10 border border-champagne-400/30 flex items-center justify-center mb-6 text-champagne-300"
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>

        {/* Small subtitle */}
        <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-champagne-300/80 font-medium mb-3">
          YOU ARE CORDIALLY INVITED
        </p>

        {/* Graduation cap emoji / icon */}
        <div className="text-4xl md:text-5xl mb-3">🎓</div>

        {/* Main Title */}
        <h1 className=" text-2xl md:text-4xl text-cream-50 font-medium tracking-wide uppercase leading-tight mb-2">
          Lễ Tốt Nghiệp
        </h1>

        <p className=" italic text-base md:text-lg text-champagne-300/90 mb-4 font-light">
          Graduation Ceremony
        </p>

        {/* Graduate Name */}
        <div className="my-5 py-3 border-y border-champagne-500/20">
          <h2 className="text-2xl md:text-3xl  font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F4E8D0] via-[#D4AF37] to-[#DEC087] tracking-wider uppercase">
            {event.graduateName}
          </h2>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mt-1 font-sans">
            Class of 2026
          </p>
        </div>

        {/* Dedicated Guest Badge */}
        <div className="mb-6 inline-block bg-champagne-500/10 border border-champagne-400/20 px-4 py-1.5 rounded-full">
          <span className="text-xs text-champagne-200/90 tracking-wider">
            Thân mời:{" "}
            <strong className="text-champagne-300 font-semibold">
              {guest.name}
            </strong>
          </span>
        </div>

        {/* Date & Time */}
        <div className="text-sm md:text-base text-slate-300 mb-8 font-light tracking-wide space-y-1">
          <p className=" text-champagne-200 text-lg">
            {formattedDay}.{formattedMonth}.{formattedYear}
          </p>
          <p className="text-slate-400 text-xs tracking-widest">
            {event.startTime}
          </p>
        </div>

        {/* Open Button */}
        <motion.button
          whileHover={{
            scale: 1.04,
            boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)",
          }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpenClick}
          disabled={isOpening}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#DEC087] to-[#C5A059] text-navy-950 font-medium text-sm md:text-base tracking-widest uppercase shadow-lg shadow-champagne-500/20 transition-all duration-300 overflow-hidden"
        >
          <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <MailOpen className="w-4 h-4 text-navy-950 transition-transform group-hover:rotate-12" />
          <span>{isOpening ? "Đang Mở..." : "MỞ THIỆP MỜI"}</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
