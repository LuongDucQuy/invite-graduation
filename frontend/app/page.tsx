"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-navy-950 text-cream-50 flex flex-col justify-between relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(212,175,55,0.18)_0%,rgba(11,19,43,0.95)_60%,rgba(6,11,24,1)_100%)] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-champagne-500/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-champagne-500/20 border border-champagne-500/40 flex items-center justify-center text-champagne-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className=" font-bold text-lg text-cream-50">
              Graduation Invitation
            </span>
            <span className="text-xs text-champagne-300 block font-sans">
              Lương Đức Quý &bull; Class of 2026
            </span>
          </div>
        </div>

        <Link
          href="/admin/login"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-champagne-400/40 bg-champagne-500/10 hover:bg-champagne-500/20 text-champagne-300 text-xs font-semibold tracking-wider uppercase transition-all"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Admin Portal</span>
        </Link>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
        <h1
          className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight
    bg-clip-text bg-gradient-to-r via-champagne-300 to-cream-200
    mb-6 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Lễ tốt nghiệp Tân Cử Nhân
          <br />
          <span
            className="text-champagne-400"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Lương Đức Quý
          </span>
        </h1>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-6 text-center text-xs text-slate-400">
        <p>Graduation Invitation Platform</p>
      </footer>
    </div>
  );
}
