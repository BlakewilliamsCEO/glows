"use client";

import { useState } from "react";
import { heroSolutions, site, systemStats } from "@/lib/config";
import { CountUp } from "@/components/ui/count-up";
import { GlowText } from "@/components/ui/glow-text";
import { NavBar } from "@/components/blocks/site-header";

/** "800+" → { value: 800, suffix: "+" } · "16M+" → { value: 16, suffix: "M+" } */
function parseStat(raw: string): { value: number; suffix: string } {
  const match = raw.match(/^([\d.]+)(.*)$/);
  if (!match) return { value: 0, suffix: raw };
  return { value: parseFloat(match[1]), suffix: match[2] };
}

/**
 * C2 — Hero scene switcher.
 *
 * Full-viewport hero with video background.
 * The nav bar sits at the very bottom of the hero and sticks
 * to the top of the viewport on scroll (Pink's pattern).
 */
export function HeroSceneSwitcher() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <section className="dark relative isolate w-full">
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#141C2F]/90 via-[#141C2F]/30 to-[#141C2F]/10" />
      </div>

      {/* ---------- copy ---------- */}
      <div className="mx-auto flex min-h-[38rem] max-w-7xl flex-col justify-end px-6 pb-8 pt-16 lg:min-h-[42rem] lg:pb-12">
        <div className="max-w-2xl">
          <h1 className="text-brand-cream">
            Turn off your porch light.
            <br />
            <span className="text-brand-gold"><GlowText>Forever.</GlowText></span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-brand-cream/75 lg:text-lg">
            Permanent architectural lighting for your home — invisible by day, stunning by night.
          </p>
        </div>

        {/* ---------- stats bar ---------- */}
        <div className="mt-12 lg:mt-16">
          <div className="border-t border-white/10 pt-8">
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
      </div>

      {/* ---------- nav bar — bottom of hero, sticks on scroll ---------- */}
      <NavBar open={navOpen} setOpen={setNavOpen} />
    </section>
  );
}
