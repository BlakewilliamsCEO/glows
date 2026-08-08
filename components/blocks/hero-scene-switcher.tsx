"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { heroSolutions, site } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * C2 — Hero scene switcher.
 *
 * The thesis of the whole site: one house, four nights, one tap each.
 * The headline is fixed; the blurb swaps with the scene, so the copy is
 * part of the demo rather than a caption underneath it.
 *
 * All four scenes are the SAME address shot in one session with four
 * programs run. If the houses differ, the mechanic reads as a gallery
 * and the point is lost.
 */
export function HeroSceneSwitcher() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Roving tabindex: arrows move between scenes, Home/End jump to the ends.
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const last = heroSolutions.length - 1;
      let next: number | null = null;

      if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
      if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
      if (e.key === "Home") next = 0;
      if (e.key === "End") next = last;

      if (next !== null) {
        e.preventDefault();
        setActive(next);
        tabRefs.current[next]?.focus();
      }
    },
    [active],
  );

  return (
    <section className="dark relative isolate min-h-[42rem] w-full overflow-hidden lg:min-h-[46rem]">
      {/* ---------- background video ---------- */}
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Legibility scrim. Heavy at the bottom for text, light at the top. */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141C2F]/90 via-[#141C2F]/30 to-[#141C2F]/10" />
      </div>

      {/* ---------- copy ---------- */}
      <div className="mx-auto flex min-h-[42rem] max-w-7xl flex-col justify-end px-6 pb-8 pt-32 lg:min-h-[46rem] lg:pb-12">
        <div className="max-w-2xl">
          <p className="eyebrow">
            {site.serviceArea} &middot; {site.qualifier}
          </p>

          <h1 className="mt-4 text-brand-cream">
            One install.
            <br />
            Every night after.
          </h1>

          {/* Swaps with the active scene — the copy is part of the demo. */}
          <p
            key={heroSolutions[active].slug}
            className="mt-6 max-w-xl text-base text-brand-cream/75 lg:text-lg"
          >
            {heroSolutions[active].blurb}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={site.ctaHref}>{site.cta}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/25 text-brand-cream hover:border-brand-gold hover:bg-transparent hover:text-brand-gold"
            >
              <Link href={`/solutions/${heroSolutions[active].slug}`}>
                About {heroSolutions[active].short.toLowerCase()} lighting
              </Link>
            </Button>
          </div>
        </div>

        {/* ---------- scene switcher ---------- */}
        <div className="mt-12 lg:mt-16">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-brand-cream/40">
            Same house — pick the night
          </p>

          <div
            role="tablist"
            aria-label="Lighting scenes"
            onKeyDown={onKeyDown}
            className="-mx-6 flex gap-1 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:mx-0 sm:gap-2 sm:px-0"
          >
            {heroSolutions.map((solution, i) => {
              const isActive = i === active;
              return (
                <button
                  key={solution.slug}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`scene-tab-${solution.slug}`}
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={cn(
                    "font-display relative shrink-0 border-b-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors sm:px-6 sm:text-base",
                    isActive
                      ? "border-brand-gold text-brand-cream"
                      : "border-white/15 text-brand-cream/50 hover:border-white/40 hover:text-brand-cream/80",
                  )}
                >
                  {solution.short}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
