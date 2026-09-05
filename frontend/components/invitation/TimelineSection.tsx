'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Sparkles, Award, Film, Music, Clock, Heart, Coffee, CheckCircle } from 'lucide-react';
import { TimelineItem } from '@/types/invitation';

interface TimelineSectionProps {
  timelines: TimelineItem[];
}

const iconMap: Record<string, React.ReactNode> = {
  camera: <Camera className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />,
  award: <Award className="w-5 h-5" />,
  film: <Film className="w-5 h-5" />,
  music: <Music className="w-5 h-5" />,
  clock: <Clock className="w-5 h-5" />,
  heart: <Heart className="w-5 h-5" />,
  coffee: <Coffee className="w-5 h-5" />,
};

export function TimelineSection({ timelines }: TimelineSectionProps) {
  if (!timelines || timelines.length === 0) return null;

  return (
    <section className="relative py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-100/70 border border-champagne-200 text-champagne-800 text-xs font-semibold uppercase tracking-widest mb-2">
            <Clock className="w-3.5 h-3.5" />
            LỊCH TRÌNH CHƯƠNG TRÌNH
          </div>
          <h3 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Chương Trình Buổi Lễ
          </h3>
          <p className="text-slate-500 text-xs md:text-sm mt-1 uppercase tracking-widest font-sans">
            EVENT TIMELINE
          </p>
        </motion.div>

        {/* Timeline Path Container */}
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-gradient-to-b from-champagne-300 via-champagne-400 to-champagne-200/40 pointer-events-none" />

          <div className="space-y-8">
            {timelines.map((item, index) => {
              const isEven = index % 2 === 0;
              const icon = iconMap[item.icon || 'clock'] || <CheckCircle className="w-5 h-5" />;

              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex items-center flex-row ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content card */}
                  <div
                    className={`w-[calc(100%-4rem)] ml-14 md:ml-0 md:w-[calc(50%-2.5rem)] ${
                      isEven ? 'md:text-left' : 'md:text-right'
                    }`}
                  >
                    <div className="p-5 md:p-6 rounded-2xl bg-white/85 backdrop-blur-sm border border-champagne-200/80 shadow-md shadow-champagne-500/5 hover:border-champagne-400 transition-all duration-300">
                      <span className="inline-block px-3 py-1 rounded-full bg-champagne-100 text-champagne-800 text-xs font-bold font-mono tracking-wider mb-2">
                        {item.time}
                      </span>
                      <h4 className="font-serif text-lg font-bold text-slate-900 mb-1">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-xs md:text-sm text-slate-600 font-light leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Center Node Icon */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-tr from-champagne-500 to-amber-300 text-navy-950 shadow-md shadow-champagne-500/30 z-10 border-2 border-white">
                    {icon}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
