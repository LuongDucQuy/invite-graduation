'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Heart } from 'lucide-react';
import { EventData, GuestData } from '@/types/invitation';

interface PersonalizedGreetingProps {
  event: EventData;
  guest: GuestData;
}

export function PersonalizedGreeting({ event, guest }: PersonalizedGreetingProps) {
  return (
    <section className="relative py-16 md:py-24 px-4 overflow-hidden text-center">
      {/* Subtle top decoration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-champagne-400" />
          <Heart className="w-4 h-4 text-champagne-400 fill-champagne-400/30" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-champagne-400" />
        </div>

        {/* Guest Personalized Salutation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-sm md:text-base tracking-[0.25em] uppercase text-champagne-600 font-sans font-medium">
            SPECIAL INVITATION TO
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-medium text-slate-900 mt-2 tracking-tight">
            Thân mời <span className="text-champagne-700 font-bold">{guest.name}</span>
          </h2>
          {guest.relationship && (
            <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-champagne-100/80 text-champagne-800 border border-champagne-200">
              {guest.relationship}
            </span>
          )}
        </motion.div>

        {/* Emotional Quote Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mt-8 p-8 md:p-10 rounded-3xl bg-white/70 backdrop-blur-md border border-champagne-200/60 shadow-xl shadow-champagne-500/5"
        >
          <Quote className="w-10 h-10 text-champagne-300 mx-auto mb-4 opacity-50 rotate-180" />

          <p className="font-serif italic text-lg md:text-xl text-slate-700 leading-relaxed">
            &ldquo;{event.graduateMessage || 'Quý rất vui khi được chia sẻ một cột mốc đặc biệt này cùng bạn.'}&rdquo;
          </p>

          {event.description && (
            <p className="text-sm md:text-base text-slate-600 mt-4 leading-relaxed font-sans font-light">
              {event.description}
            </p>
          )}

          <div className="mt-8 flex items-center justify-center gap-4 pt-6 border-t border-champagne-100">
            {event.avatarImage && (
              <img
                src={event.avatarImage}
                alt={event.graduateName}
                className="w-12 h-12 rounded-full object-cover border-2 border-champagne-300 shadow-sm"
              />
            )}
            <div className="text-left">
              <p className="font-serif font-bold text-slate-900 text-sm">{event.graduateName}</p>
              <p className="text-xs text-champagne-600 tracking-wider uppercase">Tân Cử Nhân</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
