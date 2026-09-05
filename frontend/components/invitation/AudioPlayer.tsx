'use client';

import React from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
  hasMusic: boolean;
}

export function AudioPlayer({ isPlaying, onToggle, hasMusic }: AudioPlayerProps) {
  if (!hasMusic) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className={`relative flex items-center justify-center w-12 h-12 rounded-full shadow-xl backdrop-blur-md border transition-all duration-300 ${
          isPlaying
            ? 'bg-champagne-500 text-navy-950 border-champagne-300 shadow-champagne-500/40'
            : 'bg-white/80 text-slate-600 border-slate-200/80 hover:text-slate-900'
        }`}
        aria-label={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
        title={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
      >
        {isPlaying ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="flex items-center justify-center"
          >
            <Volume2 className="w-5 h-5 text-navy-950" />
          </motion.div>
        ) : (
          <VolumeX className="w-5 h-5" />
        )}

        {/* Pulse ring when playing */}
        {isPlaying && (
          <span className="absolute -inset-1 rounded-full border border-champagne-400 animate-ping opacity-75" />
        )}
      </motion.button>
    </div>
  );
}
