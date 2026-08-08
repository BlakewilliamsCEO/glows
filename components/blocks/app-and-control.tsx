"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalendarClock,
  LayoutGrid,
  Mic,
  Palette,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { primarySystem, site } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * C5 — App & control.
 *
 * The install is the purchase; the app is why people don't regret it.
 * Bosso ships it free with no subscription, which is a real differentiator
 * against seasonal-install competitors and worth stating plainly.
 *
 * The phone mockup is live rather than a screenshot: tapping a preset
 * changes the swatch row, which is the same interaction the real app has.
 * Screenshots go stale on every app update; this doesn't.
 */

const PRESETS = [
  { name: "Warm white", colors: ["#FFE6B8", "#FFD98F", "#FFE6B8", "#FFDFA3"] },
  { name: "Holiday", colors: ["#E2453F", "#3FBF6A", "#E2453F", "#3FBF6A"] },
  { name: "Gameday", colors: ["#3B6FD4", "#F0B429", "#3B6FD4", "#F0B429"] },
  { name: "Security", colors: ["#DCEBFF", "#FFFFFF", "#DCEBFF", "#F2F8FF"] },
];

const FEATURES = [
  {
    icon: Palette,
    title: "Every color",
    body: "16 million of them, plus the full range of warm-to-cool whites for everyday use.",
  },
  {
    icon: LayoutGrid,
    title: "Zones",
    body: "Front elevation, garage, back patio — controlled separately or together.",
  },
  {
    icon: CalendarClock,
    title: "Schedules",
    body: "Set the year once. Holidays, game days, and everyday dusk-to-bed run themselves.",
  },
  {
    icon: Sparkles,
    title: "Presets",
    body: "Hundreds built in, so decorating for a holiday takes about four seconds.",
  },
  {
    icon: Mic,
    title: "Voice",
    body: "Works with Alexa, Google Assistant, Siri, and Control4.",
  },
  {
    icon: Smartphone,
    title: "Geofencing",
    body: "Lights respond as you pull in the driveway or leave for the week.",
  },
];

export function AppAndControl() {
  const [preset, setPreset] = useState(0);
  const app = primarySystem.app;

  return (
    <section className="dark bg-[#141C2F] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* ---------- copy ---------- */}
          <div>
            <p className="eyebrow">
              {app?.subscription === false && "Free app · No subscription"}
            </p>
            <h2 className="mt-4 text-brand-cream">
              The part you&rsquo;ll actually use.
            </h2>
            <p className="mt-5 text-base text-brand-cream/70 lg:text-lg">
              Installation takes a day. After that the whole system lives in
              your phone — colors, zones, schedules, and every holiday already
              programmed.
            </p>

            <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <div key={title}>
                  <dt className="flex items-center gap-2.5">
                    <Icon className="size-4 text-brand-gold" aria-hidden />
                    <span className="font-display text-sm font-semibold text-brand-cream">
                      {title}
                    </span>
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-brand-cream/60">
                    {body}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={site.ctaHref}>{site.cta}</Link>
              </Button>
              {app?.ios && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/25 text-brand-cream hover:border-brand-gold hover:bg-transparent hover:text-brand-gold"
                >
                  <a href={app.ios} target="_blank" rel="noopener noreferrer">
                    See the {app.name} app
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* ---------- live phone ---------- */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[19rem] rounded-[2rem] border border-white/15 bg-[#1E2A48] p-3 shadow-2xl">
              <div className="overflow-hidden rounded-[1.5rem] bg-[#0E1424]">
                <div className="flex items-center justify-between px-5 pt-6 pb-4">
                  <span className="font-display text-sm font-semibold text-brand-cream">
                    Front elevation
                  </span>
                  <span className="rounded-full bg-brand-gold/15 px-2.5 py-1 text-[0.6875rem] font-medium text-brand-gold">
                    On
                  </span>
                </div>

                {/* roofline preview */}
                <div className="mx-5 flex h-16 items-center justify-between rounded-lg bg-black/40 px-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span
                      key={i}
                      className="size-2 rounded-full transition-colors duration-300"
                      style={{
                        backgroundColor: PRESETS[preset].colors[i % 4],
                      }}
                    />
                  ))}
                </div>

                <div className="px-5 pt-6 pb-7">
                  <p className="mb-3 text-[0.6875rem] tracking-[0.18em] text-brand-cream/40 uppercase">
                    Presets
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((p, i) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => setPreset(i)}
                        aria-pressed={i === preset}
                        className={cn(
                          "rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition-colors",
                          i === preset
                            ? "border-brand-gold/50 bg-brand-gold/10 text-brand-cream"
                            : "border-white/10 text-brand-cream/55 hover:border-white/25",
                        )}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
