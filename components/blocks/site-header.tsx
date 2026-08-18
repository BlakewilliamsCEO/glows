"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Phone, X, MessageSquareText } from "lucide-react";
import { nav, site } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { SmokyButton } from "@/components/ui/smoky-button";
import { cn } from "@/lib/utils";

/**
 * C1 — Site header.
 *
 * Centered logo with nav links balanced left and right.
 * On hero pages: sits at the bottom of the hero, sticks on scroll.
 * On other pages (filled=true): fixed at top.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header>
      <NavBar open={open} setOpen={setOpen} />
      <MobileSheet open={open} setOpen={setOpen} />
    </header>
  );
}

// Split nav links into left and right groups around the centered logo
const leftNav = nav.slice(0, Math.ceil(nav.length / 2));
const rightNav = nav.slice(Math.ceil(nav.length / 2));

export function NavBar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <div className="sticky top-0 z-50 border-b border-[#E3E6EC] bg-white/90 backdrop-blur-md">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20">

        {/* Left nav links */}
        <nav className="hidden flex-1 items-center gap-8 lg:flex">
          {leftNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#14213D]/70 transition-colors hover:text-[#D4A017]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Center logo */}
        <Link href="/" className="group flex flex-col items-center justify-center leading-none lg:mx-8">
          <span className="font-display text-5xl font-bold italic tracking-tight text-[#14213D] transition-colors lg:text-6xl text-center">
            Glows<span className="text-[#D4A017] not-italic">.</span>
          </span>
          <span className="text-[0.5rem] font-sans font-medium uppercase tracking-[0.18em] text-[#6B7280] transition-colors group-hover:text-[#D4A017]/60 text-center">
            Permanent Lighting
          </span>
        </Link>

        {/* Right nav links + CTA */}
        <div className="hidden flex-1 items-center justify-end gap-8 lg:flex">
          {rightNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#14213D]/70 transition-colors hover:text-[#D4A017]"
            >
              {item.label}
            </Link>
          ))}
          <Link href={site.ctaHref} tabIndex={-1}>
            <SmokyButton>{site.cta}</SmokyButton>
          </Link>
        </div>

        {/* Mobile: phone + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={site.phoneHref}
            aria-label={`Call ${site.phone}`}
            className="flex size-10 items-center justify-center rounded-md border border-[#E3E6EC] text-[#14213D] transition-colors hover:border-[#D4A017] hover:text-[#D4A017]"
          >
            <Phone className="size-4" aria-hidden />
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="flex size-10 items-center justify-center rounded-md text-[#14213D] transition-colors hover:text-[#D4A017]"
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileSheet({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-[#141C2F] transition-opacity duration-200 lg:hidden",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
    >
      <div className="flex h-16 items-center justify-between px-6">
        <span className="flex flex-col items-center justify-center leading-none">
          <span className="font-display text-2xl font-semibold italic tracking-tight text-brand-cream text-center">
            Glows<span className="text-brand-gold not-italic">.</span>
          </span>
          <span className="text-[0.5rem] font-sans font-medium uppercase tracking-[0.18em] text-brand-cream/40 text-center">
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
  );
}
