"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

/**
 * C4 — Discreet from the street.
 *
 * The objection that actually kills deals: "will I see it during the day?"
 * A FAQ line doesn't answer it — the same frame at noon and at night does.
 *
 * REQUIRES a locked-off pair: one address, tripod, two exposures. If the
 * framing shifts between shots the drag reads as two different houses and
 * the section proves the opposite of what it's meant to prove.
 */

const PAIR = {
  day: {
    src: "/discreet/day.jpg",
    alt: "Home in daylight with the lighting track barely visible under the eave",
  },
  night: {
    src: "/discreet/night.jpg",
    alt: "The same home at night with the roofline lit in warm white",
  },
};

/* Verify each against the dealer cut sheet before publishing. */
const CLAIMS = [
  "Track color-matched to your trim",
  "Wiring concealed inside the track",
  "No exterior power supplies",
];

export function DiscreetFromStreet() {
  const [pos, setPos] = useState(58);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const setFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    const next = ((clientX - left) / width) * 100;
    setPos(Math.min(100, Math.max(0, next)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => setFromClientX(e.clientX);
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragging, setFromClientX]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPos((p) => Math.max(0, p - step));
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setPos((p) => Math.min(100, p + step));
    }
    if (e.key === "Home") {
      e.preventDefault();
      setPos(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      setPos(100);
    }
  };

  return (
    <section className="dark bg-[#141C2F] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-brand-cream">
            Invisible until you turn it on.
          </h2>
          <p className="mt-5 text-base text-brand-cream/70 lg:text-lg">
            The track mounts under the eave and behind the trim, color-matched
            to your house. If your HOA has an opinion about exterior lighting,
            this is the part to show them.
          </p>
        </div>

        {/* ---------- comparison ---------- */}
        <div
          ref={frameRef}
          onPointerDown={(e) => {
            setDragging(true);
            setFromClientX(e.clientX);
          }}
          className="relative mt-12 aspect-16/10 w-full touch-none overflow-hidden rounded-xl bg-black select-none sm:aspect-2/1 lg:mt-16"
        >
          <Image
            src={PAIR.night.src}
            alt={PAIR.night.alt}
            fill
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover"
          />

          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          >
            <Image
              src={PAIR.day.src}
              alt={PAIR.day.alt}
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="object-cover"
            />
          </div>

          <span className="absolute left-4 top-4 rounded-md bg-black/50 px-2.5 py-1 text-xs font-medium tracking-wide text-white/90 backdrop-blur-sm">
            Daytime
          </span>
          <span className="absolute right-4 top-4 rounded-md bg-black/50 px-2.5 py-1 text-xs font-medium tracking-wide text-white/90 backdrop-blur-sm">
            Lights on
          </span>

          {/* ---------- handle ---------- */}
          <div
            className="absolute inset-y-0 w-0.5 bg-brand-gold"
            style={{ left: `${pos}%` }}
          >
            <button
              type="button"
              role="slider"
              aria-label="Compare daytime and lights on"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              aria-valuetext={`${Math.round(pos)}% daytime`}
              onKeyDown={onKeyDown}
              onPointerDown={(e) => {
                e.stopPropagation();
                setDragging(true);
              }}
              className="absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-brand-gold text-[#1E2A48] outline-none focus-visible:ring-4 focus-visible:ring-brand-gold/40"
            >
              <MoveHorizontal className="size-5" aria-hidden />
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs tracking-wide text-brand-cream/40">
          Drag to compare
        </p>

        {/* ---------- claims ---------- */}
        <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-3">
          {CLAIMS.map((claim) => (
            <li
              key={claim}
              className="bg-[#141C2F] px-6 py-5 text-sm text-brand-cream/80"
            >
              {claim}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
