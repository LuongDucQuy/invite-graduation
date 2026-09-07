"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Mail,
  Sparkles,
  ExternalLink,
} from "lucide-react";

const DEMO_GUESTS = [
  {
    name: "Nguyễn Văn A",
    role: "Bạn thân Đại học",
    token: "a8K2x9",
    status: "ATTENDING",
  },
  {
    name: "Trần Văn B",
    role: "Đồng nghiệp",
    token: "b7L3y1",
    status: "PENDING",
  },
  { name: "Lê Thị C", role: "Gia đình", token: "c6M4z2", status: "ATTENDING" },
  {
    name: "Phạm Văn D",
    role: "Thầy cô / Mentor",
    token: "d5N5w3",
    status: "NOT_ATTENDING",
  },
  {
    name: "Hoàng Thị E",
    role: "Bạn cấp 3",
    token: "e4P6v4",
    status: "PENDING",
  },
];

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

      {/* Hero Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className=" text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cream-100 via-champagne-300 to-cream-200 mb-6 leading-tight">
          Lễ Tốt Nghiệp Cử Nhân
          <br />
          <span className="text-champagne-400 font-extrabold uppercase">
            Lương Đức Quý
          </span>
        </h1>

        {/* Demo Guest Links Section */}
        <div className="bg-[#121C33]/90 backdrop-blur-xl border border-champagne-500/30 rounded-3xl p-6 md:p-8 shadow-2xl text-left max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4 border-b border-champagne-500/20 pb-3">
            <h3 className=" text-lg font-bold text-champagne-300 flex items-center gap-2">
              <Mail className="w-5 h-5 text-champagne-400" />
              Chọn Khách Mời Demo Để Trải Nghiệm Thiệp:
            </h3>
          </div>

          <div className="space-y-3">
            {DEMO_GUESTS.map((guest) => (
              <Link
                key={guest.token}
                href={`/invite/${guest.token}`}
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-navy-950/60 border border-slate-800 hover:border-champagne-400/60 hover:bg-navy-900 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-cream-50 text-sm group-hover:text-champagne-300 transition-colors">
                      {guest.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {guest.role}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono mt-0.5 block">
                    /invite/{guest.token}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-champagne-400 text-xs font-semibold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  <span>Mở Thiệp</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-6 text-center text-xs text-slate-400">
        <p>Graduation Invitation Platform</p>
      </footer>
    </div>
  );
}
