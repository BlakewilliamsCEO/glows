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

/**
 * /quote — split landing page.
 *
 * Deliberately stripped: no nav, no footer, no outbound links except the
 * phone and the wordmark. Every element that isn't the form or the phone
 * is a way to leave.
 *
 * Image left, form right, mirroring the Pink's layout. On mobile the image
 * collapses to a short banner so the first field is above the fold.
 */
export default function QuotePage() {
  return (
    <div className="dark min-h-screen bg-[#141C2F]">
      <SiteHeader />
      <div className="lg:grid lg:grid-cols-2">
      {/* ---------- image ---------- */}
      <div className="relative h-48 w-full lg:sticky lg:top-0 lg:h-screen">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/scenes/accent.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#141C2F]/70 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#141C2F]/40" />
      </div>

      {/* ---------- form ---------- */}
      <div className="px-6 py-12 sm:px-10 lg:px-14 lg:py-20">
        <div className="mx-auto max-w-xl">
          <p className="eyebrow">{site.qualifier}</p>
          <h1 className="mt-4 text-brand-cream">
            Get a quote.
          </h1>
          <p className="mt-4 text-base text-brand-cream/70">
            Tell us where the house is and what you want lit. We&rsquo;ll come
            measure the roofline and give you a fixed number — no charge, no
            obligation.
          </p>

          <a
            href={site.phoneHref}
            className="tabular mt-6 inline-flex items-center gap-2.5 text-lg font-semibold text-brand-gold transition-opacity hover:opacity-80"
          >
            <Phone className="size-5" aria-hidden />
            {site.phone}
          </a>

          <div className="mt-10">
            <QuoteForm />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
