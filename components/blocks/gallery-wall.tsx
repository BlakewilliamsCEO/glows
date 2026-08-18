"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { GALLERY_ITEMS, type GalleryItem } from "@/lib/gallery";

/**
 * Layout pattern (repeats every 7 items on desktop):
 *
 * Row 1-2:  [  BIG (2x2)  ] [ small ]
 *                            [ small ]
 * Row 3:    [ small ] [ small ] [ small ]
 * Row 4-5:  [ small ] [  BIG (2x2)  ]
 *           [ small ]
 */

// Grid placement classes for the repeating 7-item pattern
const PATTERN: string[] = [
  "lg:col-span-2 lg:row-span-2", // 0: big left
  "",                              // 1: small top-right
  "",                              // 2: small bottom-right
  "",                              // 3: row of 3
  "",                              // 4: row of 3
  "",                              // 5: row of 3
  "lg:col-span-2 lg:row-span-2 lg:col-start-2", // 6: big right
];

// Items at index 0 and 6 in each group are the hero images — no fixed aspect ratio
const HERO_INDICES = new Set([0, 6]);

function GalleryCard({ item, index, isHero }: { item: GalleryItem; index: number; isHero: boolean }) {
  const [view, setView] = useState<"elevated" | "before">("elevated");
  const isElevated = view === "elevated";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.12, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl"
    >
      <div className={`relative overflow-hidden bg-[#1A2438] ${isHero ? "aspect-auto h-full min-h-[300px]" : "aspect-[4/3]"}`}>
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
        <span className={`absolute bottom-5 right-5 font-display font-semibold italic tracking-tight transition-colors duration-500 ${
          isHero ? "text-2xl lg:text-3xl" : "text-lg"
        } ${isElevated ? "text-[#D4A017]" : "text-white"}`}>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[minmax(200px,auto)]">
        {GALLERY_ITEMS.map((item, i) => {
          const patternIndex = i % 7;
          const spanClass = PATTERN[patternIndex];
          const isHero = HERO_INDICES.has(patternIndex);

          return (
            <div key={item.id} className={spanClass}>
              <GalleryCard item={item} index={i} isHero={isHero} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
