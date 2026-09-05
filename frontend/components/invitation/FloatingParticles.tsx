'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export function FloatingParticles({ count = 25 }: { count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-tr from-champagne-300 via-champagne-400 to-amber-200"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `${p.y}%`,
            boxShadow: '0 0 8px rgba(212, 175, 55, 0.6)',
          }}
          animate={{
            y: ['0%', '-40%', '0%'],
            x: ['0%', `${(p.id % 2 === 0 ? 1 : -1) * 20}%`, '0%'],
            opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
