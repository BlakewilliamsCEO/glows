"use client";

import { useEffect, useRef, useState } from "react";
import { Phone } from "lucide-react";
import { site, solutions } from "@/lib/config";
import {
  captureAttribution,
  capturePartial,
  HEAR_ABOUT,
  HOME_VALUES,
  isQualified,
  submitQuote,
  TIMELINES,
  type Attribution,
} from "@/lib/lead";
import { Button } from "@/components/ui/button";

const field =
  "h-12 w-full rounded-md border border-white/15 bg-white/[0.04] px-4 text-sm text-brand-cream placeholder:text-brand-cream/35 outline-none transition-colors focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/25";

export function QuoteForm() {
  const [attribution, setAttribution] = useState<Attribution>({});
  const [interests, setInterests] = useState<string[]>([]);
  const [homeValue, setHomeValue] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const partialSent = useRef(false);

  useEffect(() => {
    setAttribution(captureAttribution());
  }, []);

  /* Fire once we have something reachable, before they finish. */
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
      smsConsent: data.get("smsConsent") === "on",
      attribution,
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
          If you&rsquo;d rather not wait, the line below rings us directly.
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
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input name="firstName" required placeholder="First name" className={field} />
        <input name="lastName" required placeholder="Last name" className={field} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="Phone"
          className={field}
          onBlur={(e) => maybePartial("", e.target.value)}
        />
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email"
          className={field}
          onBlur={(e) => maybePartial(e.target.value, "")}
        />
      </div>

      {/* Street + zip are the property-data join key. Both required. */}
      <input
        name="street"
        required
        autoComplete="street-address"
        placeholder="Street address"
        className={field}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          name="city"
          required
          autoComplete="address-level2"
          placeholder="City"
          className={field}
        />
        <input
          name="zip"
          required
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="ZIP code"
          className={field}
        />
      </div>

      <div>
        <p className="mb-3 text-xs tracking-[0.14em] text-brand-cream/45 uppercase">
          What are you lighting?
        </p>
        <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {solutions.map((s) => (
            <label
              key={s.slug}
              className="flex cursor-pointer items-center gap-3 text-sm text-brand-cream/85"
            >
              <input
                type="checkbox"
                checked={interests.includes(s.slug)}
                onChange={() => toggle(s.slug)}
                className="size-4 rounded border-white/25 bg-transparent accent-brand-gold"
              />
              {s.name}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <select
          name="timeline"
          required
          defaultValue=""
          className={field}
          aria-label="Timeline"
        >
          <option value="" disabled>
            Timeline
          </option>
          {TIMELINES.map((t) => (
            <option key={t.value} value={t.value} className="bg-[#1E2A48]">
              {t.label}
            </option>
          ))}
        </select>

        <select
          name="homeValue"
          required
          value={homeValue}
          onChange={(e) => setHomeValue(e.target.value)}
          className={field}
          aria-label="Approximate home value"
        >
          <option value="" disabled>
            Approximate home value
          </option>
          {HOME_VALUES.map((v) => (
            <option key={v.value} value={v.value} className="bg-[#1E2A48]">
              {v.label}
            </option>
          ))}
        </select>
      </div>

      {/* Soft gate: sets expectations, still lets them through. */}
      {unqualified && (
        <p className="rounded-md border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-brand-cream/70">
          Most of our installs start above $500,000 in home value. Send it
          through anyway — we&rsquo;ll take a look and tell you straight
          whether we&rsquo;re the right fit.
        </p>
      )}

      <select
        name="hearAbout"
        required
        defaultValue=""
        className={field}
        aria-label="How did you hear about us"
      >
        <option value="" disabled>
          How did you hear about us?
        </option>
        {HEAR_ABOUT.map((h) => (
          <option key={h.value} value={h.value} className="bg-[#1E2A48]">
            {h.label}
          </option>
        ))}
      </select>

      <textarea
        name="notes"
        rows={3}
        placeholder="Anything else? Gate code, HOA rules, dogs, roof access."
        className={`${field} h-auto py-3 leading-relaxed`}
      />

      <label className="flex cursor-pointer items-start gap-3 text-sm text-brand-cream/75">
        <input
          type="checkbox"
          name="smsConsent"
          className="mt-0.5 size-4 rounded border-white/25 bg-transparent accent-brand-gold"
        />
        <span>
          Text me about my quote and install. Message and data rates may
          apply. Consent isn&rsquo;t a condition of purchase and you can opt
          out any time.
        </span>
      </label>

      {status === "error" && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Get my quote"}
      </Button>

      <p className="text-xs leading-relaxed text-brand-cream/40">
        By submitting, you authorize {site.name} to contact you by phone,
        email, or text about your project. We don&rsquo;t sell your
        information.
      </p>
    </form>
  );
}
