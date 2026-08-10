"use client";

import { useEffect, useRef, useState } from "react";
import { Phone } from "lucide-react";
import { site, solutions } from "@/lib/config";
import {
  captureAttribution,
  capturePartial,
  generateEventId,
  HEAR_ABOUT,
  HOME_VALUES,
  isQualified,
  submitQuote,
  TIMELINES,
  type Attribution,
} from "@/lib/lead";
import { Button } from "@/components/ui/button";

const f =
  "h-10 w-full rounded-md border border-white/15 bg-white/[0.04] px-3 text-sm text-brand-cream placeholder:text-brand-cream/35 outline-none transition-colors focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/25";

export function QuoteForm() {
  const [attribution, setAttribution] = useState<Attribution>({});
  const [interests, setInterests] = useState<string[]>([]);
  const [homeValue, setHomeValue] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const partialSent = useRef(false);
  const eventIdRef = useRef<string>("");

  useEffect(() => {
    setAttribution(captureAttribution());
    eventIdRef.current = generateEventId();
  }, []);

  const maybePartial = (email: string, phone: string) => {
    if (partialSent.current) return;
    if (!email && !phone) return;
    partialSent.current = true;
    void capturePartial({ email, phone, attribution });
  };

  const toggle = (slug: string) =>
    setInterests((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const data = new FormData(e.currentTarget);
    const result = await submitQuote({
      firstName: String(data.get("firstName") ?? ""),
      lastName: String(data.get("lastName") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      street: String(data.get("street") ?? ""),
      city: String(data.get("city") ?? ""),
      zip: String(data.get("zip") ?? ""),
      homeValue,
      interests,
      timeline: String(data.get("timeline") ?? ""),
      hearAbout: String(data.get("hearAbout") ?? ""),
      notes: String(data.get("notes") ?? ""),
      coverage: String(data.get("coverage") ?? ""),
      stories: String(data.get("stories") ?? ""),
      structures: String(data.get("structures") ?? ""),
      smsConsent: data.get("smsConsent") === "on",
      attribution,
      fbc: attribution.fbc,
      fbp: attribution.fbp,
      eventId: eventIdRef.current,
    });
    if (result.ok) {
      setStatus("done");
    } else {
      setStatus("error");
      setError(result.error);
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-xl border border-brand-gold/30 bg-white/[0.03] px-8 py-12 text-center">
        <h2 className="text-brand-cream">Got it.</h2>
        <p className="mx-auto mt-4 max-w-md text-brand-cream/70">
          We&rsquo;ll call within one business day to schedule the measure.
          If you&rsquo;d rather not wait, call us directly.
        </p>
        <a
          href={site.phoneHref}
          className="tabular mt-6 inline-flex items-center gap-2 font-display text-lg font-semibold text-brand-gold"
        >
          <Phone className="size-4" aria-hidden />
          {site.phone}
        </a>
      </div>
    );
  }

  const unqualified = homeValue !== "" && !isQualified(homeValue);

  return (
    <form onSubmit={onSubmit} className="space-y-3">

      {/* Row 1: First / Last / Phone */}
      <div className="grid grid-cols-3 gap-3">
        <input name="firstName" required placeholder="First name" className={f} />
        <input name="lastName" required placeholder="Last name" className={f} />
        <input
          name="phone" type="tel" required autoComplete="tel"
          placeholder="Phone" className={f}
          onBlur={(e) => maybePartial("", e.target.value)}
        />
      </div>

      {/* Row 2: Email / Street */}
      <div className="grid grid-cols-2 gap-3">
        <input
          name="email" type="email" required autoComplete="email"
          placeholder="Email" className={f}
          onBlur={(e) => maybePartial(e.target.value, "")}
        />
        <input
          name="street" required autoComplete="street-address"
          placeholder="Street address" className={f}
        />
      </div>

      {/* Row 3: City / ZIP */}
      <div className="grid grid-cols-2 gap-3">
        <input
          name="city" required autoComplete="address-level2"
          placeholder="City" className={f}
        />
        <input
          name="zip" required inputMode="numeric" autoComplete="postal-code"
          placeholder="ZIP" className={f}
        />
      </div>

      {/* Coverage */}
      <div>
        <p className="mb-2 text-[0.65rem] font-medium tracking-[0.14em] text-brand-cream/40 uppercase">
          Which sides of the home?
        </p>
        <div className="flex gap-2">
          {[
            { value: "front", label: "Front only" },
            { value: "front-back", label: "Front & back" },
            { value: "360", label: "360°" },
          ].map(({ value, label }) => (
            <label key={value} className="flex-1 cursor-pointer">
              <input type="radio" name="coverage" value={value} className="sr-only peer" />
              <span className="block rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-center text-xs font-medium text-brand-cream/60 transition-all peer-checked:border-brand-gold peer-checked:bg-brand-gold/10 peer-checked:text-brand-gold hover:border-white/30">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Stories */}
      <div>
        <p className="mb-2 text-[0.65rem] font-medium tracking-[0.14em] text-brand-cream/40 uppercase">
          How many stories?
        </p>
        <div className="flex gap-2">
          {[
            { value: "1", label: "One" },
            { value: "2", label: "Two" },
            { value: "3", label: "Three" },
          ].map(({ value, label }) => (
            <label key={value} className="flex-1 cursor-pointer">
              <input type="radio" name="stories" value={value} className="sr-only peer" />
              <span className="block rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-center text-xs font-medium text-brand-cream/60 transition-all peer-checked:border-brand-gold peer-checked:bg-brand-gold/10 peer-checked:text-brand-gold hover:border-white/30">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Detached structures */}
      <input
        name="structures"
        placeholder="Other structures? Pool house, extra garage, pergola…"
        className={f}
      />

      {/* What are you lighting */}
      <div>
        <p className="mb-2 text-[0.65rem] font-medium tracking-[0.14em] text-brand-cream/40 uppercase">
          What are you lighting?
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
          {solutions.map((s) => (
            <label key={s.slug} className="flex cursor-pointer items-center gap-2 text-sm text-brand-cream/80">
              <input
                type="checkbox"
                checked={interests.includes(s.slug)}
                onChange={() => toggle(s.slug)}
                className="size-3.5 rounded border-white/25 bg-transparent accent-brand-gold"
              />
              {s.short}
            </label>
          ))}
        </div>
      </div>

      {/* Row 3: Timeline / Home value / Hear about */}
      <div className="grid grid-cols-3 gap-3">
        <select name="timeline" required defaultValue="" className={f} aria-label="Timeline">
          <option value="" disabled>Timeline</option>
          {TIMELINES.map((t) => (
            <option key={t.value} value={t.value} className="bg-[#1E2A48]">{t.label}</option>
          ))}
        </select>
        <select
          name="homeValue" required value={homeValue}
          onChange={(e) => setHomeValue(e.target.value)}
          className={f} aria-label="Home value"
        >
          <option value="" disabled>Home value</option>
          {HOME_VALUES.map((v) => (
            <option key={v.value} value={v.value} className="bg-[#1E2A48]">{v.label}</option>
          ))}
        </select>
        <select name="hearAbout" required defaultValue="" className={f} aria-label="How did you hear about us">
          <option value="" disabled>How&rsquo;d you hear about us?</option>
          {HEAR_ABOUT.map((h) => (
            <option key={h.value} value={h.value} className="bg-[#1E2A48]">{h.label}</option>
          ))}
        </select>
      </div>

      {unqualified && (
        <p className="rounded-md border border-white/15 bg-white/[0.03] px-3 py-2 text-xs text-brand-cream/70">
          Most of our installs start above $500k. Send it through — we&rsquo;ll tell you straight if we&rsquo;re the right fit.
        </p>
      )}

      {/* SMS consent */}
      <label className="flex cursor-pointer items-start gap-2.5 text-xs text-brand-cream/60">
        <input
          type="checkbox" name="smsConsent"
          className="mt-0.5 size-3.5 rounded border-white/25 bg-transparent accent-brand-gold"
        />
        <span>
          Text me about my quote. Msg &amp; data rates may apply. Not a condition of purchase.
        </span>
      </label>

      {/* Notes */}
      <textarea
        name="notes"
        rows={1}
        placeholder="Anything else? Gate code, HOA, dogs, roof access."
        className={`${f} h-auto py-2 leading-relaxed`}
      />

      {status === "error" && <p className="text-sm text-red-400">{error}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Get my quote"}
      </Button>

      <p className="text-[0.65rem] leading-relaxed text-brand-cream/30">
        By submitting you authorize {site.name} to contact you by phone, email, or text. We don&rsquo;t sell your information.
      </p>
    </form>
  );
}
