'use client';

import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
  hasMusic: boolean;
}

export function AudioPlayer({ isPlaying, onToggle, hasMusic }: AudioPlayerProps) {
  if (!hasMusic) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none pointer-events-auto">
      {/* Soft golden breathing halo - strictly contained with pointer-events-none so it never causes scrollbar/hover jitter */}
      {isPlaying && (
        <span className="absolute inset-0 rounded-full bg-champagne-400/30 blur-sm animate-pulse pointer-events-none -z-10" />
      )}

      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onToggle}
        className={`relative flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md border transition-colors duration-300 touch-manipulation ${
          isPlaying
            ? 'bg-champagne-500 text-navy-950 border-champagne-300 shadow-[0_0_25px_rgba(212,175,55,0.6)]'
            : 'bg-white/90 text-slate-600 border-slate-200/80 hover:text-slate-900 shadow-md'
        }`}
        aria-label={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
        title={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
      >
        {isPlaying ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="flex items-center justify-center pointer-events-none"
          >
            <Volume2 className="w-5 h-5 text-navy-950" />
          </motion.div>
        ) : (
          <VolumeX className="w-5 h-5 pointer-events-none" />
        )}
      </motion.button>
    </div>
  );
}
