"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, ZoomIn } from "lucide-react";
import { GalleryItem } from "@/types/invitation";
import { Lightbox } from "./Lightbox";

interface GalleryMasonryProps {
  galleries: GalleryItem[];
}

export function GalleryMasonry({ galleries }: GalleryMasonryProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  if (!galleries || galleries.length === 0) return null;

  return (
    <section className="relative py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-100/70 border border-champagne-200 text-champagne-800 text-xs font-semibold uppercase tracking-widest mb-2">
            <ImageIcon className="w-3.5 h-3.5" />
            KỶ NIỆM ĐÁNG NHỚ
          </div>
          <h3 className=" text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Khoảnh khắc thanh xuân
          </h3>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {galleries.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              onClick={() => setActivePhotoIndex(index)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-100 border border-champagne-200/60 shadow-sm aspect-[4/3] hover:shadow-xl hover:border-champagne-400 transition-all duration-300"
            >
              <img
                src={item.imageUrl}
                alt={item.caption || `Graduation memory ${index + 1}`}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Hover overlay with zoom icon & caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                <div className="flex items-center justify-between">
                  <p className="text-xs md:text-sm font-medium line-clamp-1">
                    {item.caption || "Xem chi tiết"}
                  </p>
                  <div className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        images={galleries}
        currentIndex={activePhotoIndex}
        onClose={() => setActivePhotoIndex(null)}
        onNavigate={(idx) => setActivePhotoIndex(idx)}
      />
    </section>
  );
}
