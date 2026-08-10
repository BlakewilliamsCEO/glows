"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

export interface PhoneSlide {
  src: string;
  alt: string;
}

interface PhoneFanCarouselProps {
  slides: PhoneSlide[];
}

const MAX_VISIBLE = 5;
const HALF = 2;

const FAN_POSITIONS = [
  { rot: -18, scale: 0.78, x: -26, y: 6,   zIndex: 1 },
  { rot: -9,  scale: 0.88, x: -13, y: 2,   zIndex: 2 },
  { rot: 0,   scale: 1.0,  x: 0,   y: 0,   zIndex: 10 },
  { rot: 9,   scale: 0.88, x: 13,  y: 2,   zIndex: 2 },
  { rot: 18,  scale: 0.78, x: 26,  y: 6,   zIndex: 1 },
];

function getMultiplier(width: number) {
  if (width < 480) return 0.32;
  if (width < 640) return 0.45;
  if (width < 768) return 0.6;
  if (width < 1024) return 0.8;
  return 1.0;
}

const ARROW =
  "flex items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-brand-cream/60 hover:border-brand-gold/50 hover:text-brand-gold transition-colors duration-200 cursor-pointer outline-none";

/** CSS iPhone shell wrapping a screenshot */
function PhoneFrame({ src, alt }: PhoneSlide) {
  return (
    <div className="relative w-[11rem] select-none sm:w-[13rem] lg:w-[15rem]">
      {/* Outer shell */}
      <div className="relative rounded-[2.5rem] border-[3px] border-white/20 bg-[#1a1a1a] shadow-2xl ring-1 ring-black/40">
        {/* Side buttons */}
        <div className="absolute -left-[5px] top-[5.5rem] h-8 w-[3px] rounded-l-full bg-white/20" />
        <div className="absolute -left-[5px] top-[9rem] h-10 w-[3px] rounded-l-full bg-white/20" />
        <div className="absolute -left-[5px] top-[13.5rem] h-10 w-[3px] rounded-l-full bg-white/20" />
        <div className="absolute -right-[5px] top-[8rem] h-14 w-[3px] rounded-r-full bg-white/20" />

        {/* Screen area */}
        <div className="overflow-hidden rounded-[2.25rem] bg-black">
          {/* Notch / Dynamic Island */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-[1.1rem] w-[6rem] rounded-full bg-black ring-1 ring-white/10" />
          </div>

          {/* Screenshot */}
          <img
            src={src}
            alt={alt}
            className="w-full object-cover object-top"
            draggable={false}
          />

          {/* Home indicator */}
          <div className="flex justify-center py-2">
            <div className="h-1 w-10 rounded-full bg-white/30" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PhoneFanCarousel({ slides }: PhoneFanCarouselProps) {
  const total = slides.length;
  const needsPagination = total > MAX_VISIBLE;
  const [center, setCenter] = useState(needsPagination ? HALF : total >> 1);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const prevVisible = useRef<Set<number>>(new Set());

  const getVisibleMap = useCallback((c: number) => {
    const map = new Map<number, number>();
    if (!needsPagination) {
      slides.forEach((_, i) => map.set(i, i));
      return map;
    }
    for (let slot = 0; slot < MAX_VISIBLE; slot++) {
      map.set(((c + slot - HALF) % total + total) % total, slot);
    }
    return map;
  }, [total, needsPagination, slides]);

  const cycle = useCallback((dir: "left" | "right") => {
    if (isAnimating.current || !needsPagination) return;
    isAnimating.current = true;
    directionRef.current = dir;
    setCenter(prev => dir === "right" ? (prev + 1) % total : (prev - 1 + total) % total);
  }, [total, needsPagination]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !total) return;

    const cards = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));
    if (!cards.length) return;

    const visibleMap = getVisibleMap(center);
    const previouslyVisible = prevVisible.current;
    const direction = directionRef.current;
    const isFirstMount = !hasEntered.current;
    const mult = getMultiplier(window.innerWidth);
    const slotCount = needsPagination ? MAX_VISIBLE : total;

    const getPos = (slot: number) => {
      if (slotCount >= MAX_VISIBLE) return FAN_POSITIONS[slot];
      const c = slotCount >> 1;
      const d = slotCount > 1 ? (slot - c) / c : 0;
      const abs = Math.abs(d);
      return { rot: d * 18, scale: 1 - 0.22 * abs * abs, x: d * 26, y: abs * abs * 6, zIndex: 10 - Math.abs(slot - c) };
    };

    if (isFirstMount) isAnimating.current = true;
    let done = 0;
    const total_visible = visibleMap.size;
    const onDone = () => { if (++done >= total_visible) { isAnimating.current = false; if (isFirstMount) hasEntered.current = true; } };

    cards.forEach((card, i) => {
      const slot = visibleMap.get(i);
      const wasVisible = previouslyVisible.has(i);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = getPos(slot);
        const target = { x: `${x * mult}rem`, y: `${y}rem`, rotation: rot, scale, opacity: 1, zIndex };

        if (isFirstMount) {
          gsap.set(card, { x: 0, y: "10rem", rotation: 0, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 1.2, ease: "elastic.out(1.05,.78)", delay: 0.15 + slot * 0.07, onComplete: onDone });
        } else if (!wasVisible) {
          const ex = direction === "right" ? 36 : -36;
          gsap.set(card, { x: `${ex}rem`, y: `${y}rem`, rotation: direction === "right" ? 28 : -28, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 0.55, ease: "power2.out", onComplete: onDone });
        } else {
          gsap.to(card, { ...target, duration: 0.45, ease: "power2.out", onComplete: onDone });
        }
      } else if (wasVisible) {
        const ex = direction === "right" ? -36 : 36;
        gsap.to(card, { x: `${ex}rem`, opacity: 0, scale: 0.5, rotation: direction === "right" ? -28 : 28, duration: 0.35, ease: "power2.in", zIndex: 0 });
      } else if (isFirstMount) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible.current = new Set(visibleMap.keys());

    // Hover spread
    const entries: { el: HTMLElement; slot: number }[] = [];
    cards.forEach((el, i) => { const s = visibleMap.get(i); if (s !== undefined) entries.push({ el, slot: s }); });
    entries.sort((a, b) => a.slot - b.slot);

    let activeSlot: number | null = null;
    let leaveTimer: ReturnType<typeof setTimeout> | null = null;
    const cSlot = entries.length >> 1;

    const spread = (hovered: number | null) => {
      const m = getMultiplier(window.innerWidth);
      entries.forEach(({ el, slot }) => {
        const base = getPos(slot);
        let tx = base.x * m, ty = base.y, tr = base.rot, ts = base.scale, delay = 0;

        if (hovered !== null) {
          const dist = Math.abs(slot - hovered);
          delay = dist * 0.02;
          if (slot === hovered) { ty -= 2.5; ts *= 1.06; }
          else {
            const push = 7 * (1 - Math.abs((slot - cSlot) / (cSlot || 1))) * (1 + 0.15 * Math.max(0, 2 - dist));
            tx += (slot < hovered ? -push : push) * m;
            tr += slot < hovered ? -2 / (dist + 1) : 2 / (dist + 1);
          }
        } else {
          delay = Math.abs(slot - cSlot) * 0.02;
        }

        gsap.to(el, { x: `${tx}rem`, y: `${ty}rem`, rotation: tr, scale: ts, duration: 0.5, delay, ease: "elastic.out(1,.75)", overwrite: "auto" });
        gsap.set(el, { zIndex: base.zIndex });
      });
    };

    const handlers = entries.map(({ el, slot }) => {
      const h = () => { if (isAnimating.current) return; if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; } if (activeSlot !== slot) { activeSlot = slot; spread(slot); } };
      el.addEventListener("mouseenter", h);
      return { el, h };
    });

    const onLeave = () => { if (isAnimating.current) return; if (leaveTimer) clearTimeout(leaveTimer); leaveTimer = setTimeout(() => { activeSlot = null; spread(null); }, 50); };
    container.addEventListener("mouseleave", onLeave);
    const onResize = () => { if (!isAnimating.current) spread(activeSlot); };
    window.addEventListener("resize", onResize);

    return () => {
      handlers.forEach(({ el, h }) => el.removeEventListener("mouseenter", h));
      container.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [center, total, getVisibleMap, needsPagination]);

  if (!total) return null;

  return (
    <div className="flex flex-col items-center w-full">
      <div ref={containerRef} className="relative flex items-end justify-center w-full" style={{ height: "36rem" }}>
        {slides.map((slide, i) => (
          <div key={i} className="fan-card absolute" style={{ bottom: "2rem" }}>
            <PhoneFrame {...slide} />
          </div>
        ))}
      </div>

      {needsPagination && (
        <div className="flex items-center gap-4 mt-2">
          <button className={`${ARROW} size-9`} onClick={() => cycle("left")} aria-label="Previous">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <span key={i} className={`size-1.5 rounded-full transition-all duration-300 ${i === center ? "bg-brand-gold scale-125" : "bg-white/20"}`} />
            ))}
          </div>
          <button className={`${ARROW} size-9`} onClick={() => cycle("right")} aria-label="Next">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
