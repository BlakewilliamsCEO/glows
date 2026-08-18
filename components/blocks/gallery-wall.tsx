"use client";

import { motion } from "motion/react";
import { GALLERY_ITEMS, type GalleryItem } from "@/lib/gallery";

function GalleryCard({ item, index, className = "" }: { item: GalleryItem; index: number; className?: string }) {
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
        <img
          src={item.afterUrl}
          alt={`${item.address}, ${item.city} — with Glows lighting`}
          className="w-full h-full object-cover"
        />

        {/* Bottom gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

        {/* City name — bottom right */}
        <span className={`absolute bottom-5 right-5 font-display font-semibold italic tracking-tight text-[#D4A017] ${
          isLarge ? "text-2xl lg:text-3xl" : "text-lg"
        }`}>
          {item.city}
        </span>
      </div>
    </motion.div>
  );
}

function buildSections(items: GalleryItem[]) {
  const sections: React.ReactNode[] = [];
  let i = 0;
  let sectionType: "A" | "B" = "A";

  while (i < items.length) {
    const remaining = items.length - i;

    if (sectionType === "A" && remaining >= 5) {
      const count = remaining >= 6 ? 6 : 5;
      sections.push(
        <div key={`section-${i}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 lg:row-span-2 aspect-[4/3] lg:aspect-auto">
            <GalleryCard item={items[i]} index={i} className="h-full col-span-2" />
          </div>
          <div className="aspect-[4/3]">
            <GalleryCard item={items[i + 1]} index={i + 1} className="h-full" />
          </div>
          <div className="aspect-[4/3]">
            <GalleryCard item={items[i + 2]} index={i + 2} className="h-full" />
          </div>
          <div className="aspect-[4/3]">
            <GalleryCard item={items[i + 3]} index={i + 3} className="h-full" />
          </div>
          <div className="aspect-[4/3]">
            <GalleryCard item={items[i + 4]} index={i + 4} className="h-full" />
          </div>
          {count === 6 && (
            <div className="aspect-[4/3]">
              <GalleryCard item={items[i + 5]} index={i + 5} className="h-full" />
            </div>
          )}
        </div>
      );
      i += count;
      sectionType = "B";
    } else if (sectionType === "B" && remaining >= 5) {
      const count = remaining >= 6 ? 6 : 5;
      sections.push(
        <div key={`section-${i}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {count === 6 && (
            <div className="aspect-[4/3]">
              <GalleryCard item={items[i]} index={i} className="h-full" />
            </div>
          )}
          <div className="aspect-[4/3]">
            <GalleryCard item={items[count === 6 ? i + 1 : i]} index={count === 6 ? i + 1 : i} className="h-full" />
          </div>
          <div className="aspect-[4/3]">
            <GalleryCard item={items[count === 6 ? i + 2 : i + 1]} index={count === 6 ? i + 2 : i + 1} className="h-full" />
          </div>
          <div className="aspect-[4/3]">
            <GalleryCard item={items[count === 6 ? i + 3 : i + 2]} index={count === 6 ? i + 3 : i + 2} className="h-full" />
          </div>
          <div className="lg:col-span-2 lg:row-span-2 aspect-[4/3] lg:aspect-auto">
            <GalleryCard item={items[count === 6 ? i + 4 : i + 3]} index={count === 6 ? i + 4 : i + 3} className="h-full col-span-2" />
          </div>
          <div className="aspect-[4/3]">
            <GalleryCard item={items[count === 6 ? i + 5 : i + 4]} index={count === 6 ? i + 5 : i + 4} className="h-full" />
          </div>
        </div>
      );
      i += count;
      sectionType = "A";
    } else {
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
          AI Renders. Real Homes. Your Neighborhood.
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
