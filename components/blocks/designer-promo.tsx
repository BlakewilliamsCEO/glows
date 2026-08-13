"use client";

import Link from "next/link";
import { Sparkles, Zap, DollarSign, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BokehBackground } from "@/components/ui/bokeh";
import { GlowText } from "@/components/ui/glow-text";

const TRUST_PILLS = [
  { icon: Sparkles, label: "AI-Powered" },
  { icon: Zap, label: "Instant Results" },
  { icon: DollarSign, label: "100% Free" },
  { icon: Eye, label: "No Visit Needed" },
];

export function DesignerPromo() {
  return (
    <BokehBackground className="dark bg-[#141C2F] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-brand-cream">
            See your home in{" "}
            <span className="text-brand-gold"><GlowText>Glow&rsquo;s lights.</GlowText></span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-brand-cream/50 lg:text-lg">
            Enter your address and see what permanent lighting looks like on your home — no appointment, no waiting, no cost.
          </p>

          {/* Trust pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {TRUST_PILLS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-brand-cream/60"
              >
                <Icon className="size-3.5 text-brand-gold" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Sample render + estimate */}
        <div className="mt-14 flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
          {/* Sample image */}
          <div className="w-full lg:w-3/5">
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <img
                src="/scenes/accent.mp4"
                alt="Sample home with permanent lighting"
                className="w-full"
                style={{ aspectRatio: "3/2", objectFit: "cover" }}
              />
              {/* Fallback: use a video still or rendered image once available */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full"
                style={{ aspectRatio: "3/2", objectFit: "cover" }}
              >
                <source src="/scenes/accent.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Sample estimate card */}
          <div className="w-full lg:w-2/5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-brand-gold">
                Sample Estimate
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-xs text-brand-cream/40">Linear Footage</p>
                  <p className="font-display text-2xl font-semibold text-brand-cream">~130 ft</p>
                </div>
                <div>
                  <p className="text-xs text-brand-cream/40">Style</p>
                  <p className="font-display text-2xl font-semibold text-brand-cream">Warm White Permanent</p>
                </div>
                <div>
                  <p className="text-xs text-brand-cream/40">Estimated Range</p>
                  <p className="font-display text-2xl font-semibold text-brand-gold">$6,200 – $8,400</p>
                </div>
              </div>

              <p className="mt-4 text-[0.6875rem] leading-relaxed text-brand-cream/30">
                Based on ~130 ft of permanent LED roofline lighting with warm white. Actual pricing confirmed after free measure.
              </p>

              <Button asChild size="lg" className="mt-6 w-full">
                <Link href="/visualizer">See Your Home Lit</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BokehBackground>
  );
}
