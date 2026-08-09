"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { heroSolutions, site, systemStats } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/utils";

/** "800+" → { value: 800, suffix: "+" } · "16M+" → { value: 16, suffix: "M+" } */
function parseStat(raw: string): { value: number; suffix: string } {
  const match = raw.match(/^([\d.]+)(.*)$/);
  if (!match) return { value: 0, suffix: raw };
  return { value: parseFloat(match[1]), suffix: match[2] };
}

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
          <source src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/hero-bg.mp4`} type="video/mp4" />
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

        {/* ---------- stats bar ---------- */}
        <div className="mt-12 lg:mt-16 border-t border-white/10 pt-8">
          <dl className="flex flex-wrap gap-x-12 gap-y-6 sm:gap-x-16">
            {systemStats.map((stat) => {
              const { value, suffix } = parseStat(stat.value);
              return (
                <div key={stat.label}>
                  <dt className="font-display text-3xl font-semibold text-brand-cream lg:text-4xl">
                    <CountUp to={value} duration={2} className="tabular-nums" />
                    {suffix}
                  </dt>
                  <dd className="mt-1 text-xs text-brand-cream/50 uppercase tracking-[0.12em]">
                    {stat.label}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
