import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { site } from "@/lib/config";
import { QuoteForm } from "@/components/blocks/quote-form";
import { SiteHeader } from "@/components/blocks/site-header";

export const metadata: Metadata = {
  title: "Get a quote",
  description:
    "Book a free measure for permanent outdoor lighting across Hamilton County and north Indianapolis.",
};

export default function QuotePage() {
  return (
    <div className="dark bg-[#141C2F]">
      <SiteHeader filled />

      <div className="flex min-h-screen">
        {/* ---------- sticky photo — left half ---------- */}
        <div className="hidden lg:block lg:w-1/2 sticky top-0 h-screen shrink-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          >
            <source src="/scenes/accent.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#141C2F]/60" />
        </div>

        {/* ---------- form — right half ---------- */}
        <div className="w-full lg:w-1/2 px-6 pt-20 pb-6 sm:px-8 lg:px-10 lg:pt-24">
          <div className="mx-auto max-w-2xl">

            <h1 className="text-brand-cream">Get a quote.</h1>
            <a
              href={site.phoneHref}
              className="tabular mt-3 inline-flex items-center gap-2 text-base font-semibold text-brand-gold transition-opacity hover:opacity-80"
            >
              <Phone className="size-4" aria-hidden />
              {site.phone}
            </a>

            <div className="mt-6">
              <QuoteForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
