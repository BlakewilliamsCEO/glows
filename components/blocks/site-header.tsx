"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, MessageSquareText, Phone, X } from "lucide-react";
import { nav, site } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { SmokyButton } from "@/components/ui/smoky-button";
import { cn } from "@/lib/utils";

/**
 * C1 — Site header.
 *
 * Two rows on desktop, one on mobile.
 *
 *   Utility bar  · service area (left) · phone + SMS (right)
 *   Nav bar      · wordmark · links · Book free measure
 *
 * The utility bar scrolls away; the nav bar sticks and gains a background
 * once the hero is behind it. Over a full-bleed night hero the nav starts
 * transparent with cream type, so it has to be a client component.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [heroCtaVisible, setHeroCtaVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Watch the hero CTA — when it scrolls behind the nav, upgrade the nav button.
  useEffect(() => {
    const el = document.getElementById("hero-cta");
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setHeroCtaVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="dark absolute inset-x-0 top-0 z-50">
      {/* ---------- utility bar ---------- */}
      <div className="hidden border-b border-white/10 md:block">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-6 text-xs">
          <span className="text-brand-cream/60">
            Now serving: {site.serviceArea} &middot; {site.qualifier}
          </span>

          <div className="flex items-center gap-6">
            <a
              href={site.smsHref}
              className="flex items-center gap-1.5 text-brand-cream/70 transition-colors hover:text-brand-gold"
            >
              <MessageSquareText className="size-3.5" aria-hidden />
              Text us
            </a>
            <a
              href={site.phoneHref}
              className="tabular flex items-center gap-1.5 font-medium text-brand-cream transition-colors hover:text-brand-gold"
            >
              <Phone className="size-3.5" aria-hidden />
              {site.phone}
            </a>
          </div>
        </div>
      </div>

      {/* ---------- nav bar ---------- */}
      <div
        className={cn(
          "transition-colors duration-300",
          scrolled
            ? "fixed inset-x-0 top-0 border-b border-white/10 bg-[#141C2F]/90 backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20">
          <Link href="/" className="group flex flex-col leading-none">
            <span className="font-display text-2xl font-semibold italic tracking-tight text-brand-cream transition-colors group-hover:text-brand-cream lg:text-3xl">
              Glows<span className="text-brand-gold not-italic">.</span>
            </span>
            <span className="hidden text-[0.5rem] font-sans font-medium uppercase tracking-[0.28em] text-brand-cream/40 transition-colors group-hover:text-brand-gold/60 lg:block">
              Permanent Lighting
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-brand-cream/80 transition-colors hover:text-brand-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Phone is the mobile primary — thumb-reachable, no form. */}
            <a
              href={site.phoneHref}
              aria-label={`Call ${site.phone}`}
              className="flex size-10 items-center justify-center rounded-md border border-white/15 text-brand-cream transition-colors hover:border-brand-gold hover:text-brand-gold md:hidden"
            >
              <Phone className="size-4" aria-hidden />
            </a>

            {heroCtaVisible ? (
              <Button asChild size="lg" className="hidden sm:inline-flex">
                <Link href={site.ctaHref}>{site.cta}</Link>
              </Button>
            ) : (
              <Link href={site.ctaHref} className="hidden sm:inline-flex" tabIndex={-1}>
                <SmokyButton>{site.cta}</SmokyButton>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="flex size-10 items-center justify-center rounded-md text-brand-cream transition-colors hover:text-brand-gold lg:hidden"
            >
              <Menu className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* ---------- mobile sheet ---------- */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-[#141C2F] transition-opacity duration-200 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <span className="flex flex-col leading-none">
            <span className="font-display text-2xl font-semibold italic tracking-tight text-brand-cream">
              Glows<span className="text-brand-gold not-italic">.</span>
            </span>
            <span className="text-[0.5rem] font-sans font-medium uppercase tracking-[0.28em] text-brand-cream/40">
              Permanent Lighting
            </span>
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex size-10 items-center justify-center rounded-md text-brand-cream hover:text-brand-gold"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-6 pt-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display border-b border-white/10 py-4 text-2xl font-semibold text-brand-cream transition-colors hover:text-brand-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex flex-col gap-3 px-6">
          <Button asChild size="lg" className="w-full">
            <Link href={site.ctaHref} onClick={() => setOpen(false)}>
              {site.cta}
            </Link>
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button asChild variant="outline" size="lg">
              <a href={site.phoneHref}>
                <Phone className="size-4" aria-hidden />
                Call
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={site.smsHref}>
                <MessageSquareText className="size-4" aria-hidden />
                Text
              </a>
            </Button>
          </div>

          <p className="tabular pt-2 text-center text-sm text-brand-cream/50">
            {site.phone}
          </p>
        </div>
      </div>
    </header>
  );
}
