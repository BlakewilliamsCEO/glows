"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { GALLERY_ITEMS, type GalleryItem } from "@/lib/gallery";

function GalleryCard({ item, index }: { item: GalleryItem; index: number }) {
  const [view, setView] = useState<"elevated" | "before">("elevated");
  const isElevated = view === "elevated";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.15, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl group"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-[#1A2438]">
        <img
          src={isElevated ? item.afterUrl : item.beforeUrl}
          alt={`${item.address}, ${item.city} — ${isElevated ? "with Glows lighting" : "before"}`}
          className="w-full h-full object-cover transition-opacity duration-500"
        />

        {/* Bottom gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Before / Elevated buttons — bottom left */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          <button
            type="button"
            onClick={() => setView("before")}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all backdrop-blur-sm ${
              !isElevated
                ? "bg-white text-[#0F1420]"
                : "bg-white/20 text-white/70 hover:bg-white/30 hover:text-white"
            }`}
          >
            Before
          </button>
          <button
            type="button"
            onClick={() => setView("elevated")}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all backdrop-blur-sm ${
              isElevated
                ? "bg-[#D4A017]/90 text-white"
                : "bg-white/20 text-white/70 hover:bg-white/30 hover:text-white"
            }`}
          >
            Elevated
          </button>
        </div>

        {/* City name — bottom right */}
        <span className={`absolute bottom-5 right-5 text-sm font-semibold tracking-wide transition-colors duration-500 ${
          isElevated ? "text-[#D4A017]" : "text-white"
        }`}>
          {item.city}
        </span>
      </div>
    </motion.div>
  );
}

export function GalleryWall() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-[36px] font-bold text-[#0F1420] md:text-[48px] leading-tight">
          Real homes. Real neighborhoods.
        </h1>
        <p className="text-base text-[#6B7280] mt-3 max-w-lg mx-auto">
          Every home below is in your area. One install, every scene, controlled from your phone.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GALLERY_ITEMS.map((item, i) => (
          <GalleryCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
