"use client";

import Link from "next/link";
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
import { PhoneFanCarousel } from "@/components/ui/phone-fan-carousel";

const APP_SCREENS = [
  { src: "/app/presets.webp", alt: "Bosso app presets screen" },
  { src: "/app/controls.webp", alt: "Bosso app controls screen" },
  { src: "/app/colors.webp", alt: "Bosso app color picker" },
  { src: "/app/schedule.webp", alt: "Bosso app schedule screen" },
  { src: "/app/premium.webp", alt: "Bosso app premium features" },
];

const FEATURES = [
  { icon: Palette,      title: "Every color" },
  { icon: LayoutGrid,   title: "Zones" },
  { icon: CalendarClock,title: "Schedules" },
  { icon: Sparkles,     title: "Presets" },
  { icon: Mic,          title: "Voice" },
  { icon: Smartphone,   title: "Geofencing" },
];

export function AppAndControl() {
  const app = primarySystem.app;

  return (
    <section className="dark bg-[#141C2F] py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6 text-center">

        {/* ---------- copy ---------- */}
        <p className="eyebrow">Free app · No subscription</p>
        <h2 className="mt-4 text-brand-cream">
          The part you&rsquo;ll actually use.
        </h2>
        <p className="mt-5 text-base text-brand-cream/70 lg:text-lg max-w-xl mx-auto">
          Colors, zones, schedules, and every holiday already programmed.
          From your phone, Siri, Alexa, and Google Voice.
        </p>

        {/* ---------- feature pills ---------- */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {FEATURES.map(({ icon: Icon, title }) => (
            <span
              key={title}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium text-brand-cream/70"
            >
              <Icon className="size-3.5 text-brand-gold" aria-hidden />
              {title}
            </span>
          ))}
        </div>

        {/* ---------- phone fan ---------- */}
        <div className="mt-10">
          <PhoneFanCarousel slides={APP_SCREENS} />
        </div>

        {/* ---------- CTAs ---------- */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
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
    </section>
  );
}
