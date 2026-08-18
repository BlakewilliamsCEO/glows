"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { GALLERY_ITEMS, type GalleryItem } from "@/lib/gallery";

function GalleryCard({ item, index, className = "" }: { item: GalleryItem; index: number; className?: string }) {
  const [view, setView] = useState<"elevated" | "before">("elevated");
  const isElevated = view === "elevated";
  const isLarge = className.includes("col-span");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.12, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-2xl ${className}`}
    >
      <div className="relative overflow-hidden bg-[#1A2438] w-full h-full">
        {(item.afterUrl && item.beforeUrl) ? (
          <img
            src={isElevated ? item.afterUrl : item.beforeUrl}
            alt={`${item.address}, ${item.city} — ${isElevated ? "with Glows lighting" : "before"}`}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#14213D] to-[#2A3757] flex items-center justify-center">
            <span className="text-white/20 text-sm font-medium">Coming soon</span>
          </div>
        )}

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
          isLarge ? "text-2xl lg:text-3xl" : "text-lg"
        } ${isElevated ? "text-[#D4A017]" : "text-white"}`}>
          {item.city}
        </span>
      </div>
    </motion.div>
  );
}

/**
 * Manually lay out the grid in repeating 5-row sections.
 * Each section uses 7 images:
 *   Section A: big-left(2x2) + 2 stacked right, then row of 3
 *   Section B: row of 3, then 2 stacked left + big-right(2x2)
 */
function buildSections(items: GalleryItem[]) {
  const sections: React.ReactNode[] = [];
  let i = 0;
  let sectionType: "A" | "B" = "A";

  while (i < items.length) {
    const remaining = items.length - i;

    if (sectionType === "A" && remaining >= 5) {
      // Big left + 2 stacked right (row of 2 tall)
      // Then row of 3
      sections.push(
        <div key={`section-${i}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Row 1-2: Big left + 2 stacked right */}
          <div className="lg:col-span-2 lg:row-span-2 aspect-[4/3] lg:aspect-auto">
            <GalleryCard item={items[i]} index={i} className="h-full" />
          </div>
          <div className="aspect-[4/3]">
            <GalleryCard item={items[i + 1]} index={i + 1} className="h-full" />
          </div>
          <div className="aspect-[4/3]">
            <GalleryCard item={items[i + 2]} index={i + 2} className="h-full" />
          </div>
          {/* Row 3: 3 equal */}
          <div className="aspect-[4/3]">
            <GalleryCard item={items[i + 3]} index={i + 3} className="h-full" />
          </div>
          <div className="aspect-[4/3]">
            <GalleryCard item={items[i + 4]} index={i + 4} className="h-full" />
          </div>
          {remaining >= 6 ? (
            <div className="aspect-[4/3]">
              <GalleryCard item={items[i + 5]} index={i + 5} className="h-full" />
            </div>
          ) : null}
        </div>
      );
      i += remaining >= 6 ? 6 : 5;
      sectionType = "B";
    } else if (sectionType === "B" && remaining >= 5) {
      // Row of 3, then 2 stacked left + big right
      sections.push(
        <div key={`section-${i}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Row 1: 3 equal */}
          {remaining >= 6 ? (
            <div className="aspect-[4/3]">
              <GalleryCard item={items[i]} index={i} className="h-full" />
            </div>
          ) : null}
          <div className="aspect-[4/3]">
            <GalleryCard item={items[remaining >= 6 ? i + 1 : i]} index={remaining >= 6 ? i + 1 : i} className="h-full" />
          </div>
          <div className="aspect-[4/3]">
            <GalleryCard item={items[remaining >= 6 ? i + 2 : i + 1]} index={remaining >= 6 ? i + 2 : i + 1} className="h-full" />
          </div>
          {/* Row 2-3: 2 stacked left + big right */}
          <div className="aspect-[4/3]">
            <GalleryCard item={items[remaining >= 6 ? i + 3 : i + 2]} index={remaining >= 6 ? i + 3 : i + 2} className="h-full" />
          </div>
          <div className="lg:col-span-2 lg:row-span-2 aspect-[4/3] lg:aspect-auto">
            <GalleryCard item={items[remaining >= 6 ? i + 4 : i + 3]} index={remaining >= 6 ? i + 4 : i + 3} className="h-full col-span-2" />
          </div>
          <div className="aspect-[4/3]">
            <GalleryCard item={items[remaining >= 6 ? i + 5 : i + 4]} index={remaining >= 6 ? i + 5 : i + 4} className="h-full" />
          </div>
        </div>
      );
      i += remaining >= 6 ? 6 : 5;
      sectionType = "A";
    } else {
      // Remaining items — just fill as a standard row
      sections.push(
        <div key={`section-${i}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.slice(i).map((item, j) => (
            <div key={item.id} className="aspect-[4/3]">
              <GalleryCard item={item} index={i + j} className="h-full" />
            </div>
          ))}
        </div>
      );
      break;
    }
  }

  return sections;
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

      <div className="space-y-4">
        {buildSections(GALLERY_ITEMS)}
      </div>
    </section>
  );
}
