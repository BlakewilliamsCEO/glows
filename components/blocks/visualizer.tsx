"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Upload, Loader2, ArrowRight, Maximize2, Minimize2, Lock, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { GlowText } from "@/components/ui/glow-text";
import { BorderRotate } from "@/components/ui/animated-gradient-border";
import { SCENES } from "@/lib/scenes";
import { calculateEstimate, type Estimate } from "@/lib/pricing";

type Step = "address" | "preview" | "scene" | "gate" | "reveal";

const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

const f =
  "h-10 w-full rounded-md border border-white/15 bg-white/[0.04] px-3 text-sm text-brand-cream placeholder:text-brand-cream/35 outline-none transition-colors focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/25";

const STATUS_TICKERS = [
  "Reading your roofline\u2026",
  "Mapping peaks and gables\u2026",
  "Placing fixtures\u2026",
  "Setting the scene\u2026",
  "Rendering your home\u2026",
  "Almost there.",
];

const COVERAGE_LABELS: Record<string, string> = {
  front: "front only",
  "front-sides": "front and sides",
  full: "full perimeter",
};

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const EXTRAS_OPTIONS = [
  { value: "detached-garage", label: "Detached garage" },
  { value: "pergola", label: "Pergola" },
  { value: "landscape", label: "Landscape" },
  { value: "fence", label: "Fence" },
  { value: "pool-deck", label: "Pool deck" },
];

export function Visualizer() {
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState("");
  const [streetViewUrl, setStreetViewUrl] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedScene, setSelectedScene] = useState(SCENES[0].id);
  const [renderedImage, setRenderedImage] = useState<string | null>(null);
  const [renderReady, setRenderReady] = useState(false);
  const [error, setError] = useState("");
  const [fullScreen, setFullScreen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [estimate, setEstimate] = useState<Estimate | null>(null);

  // Gate form state
  const [stories, setStories] = useState("");
  const [coverage, setCoverage] = useState("");
  const [gables, setGables] = useState("");
  const [garage, setGarage] = useState("");
  const [extras, setExtras] = useState<string[]>([]);
  const [timeline, setTimeline] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---------- Google Places ----------
  useEffect(() => {
    if (!GOOGLE_KEY) return;

    function initAutocomplete() {
      if (!inputRef.current || !window.google?.maps?.places) return;
      if (autocompleteRef.current) return;
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        componentRestrictions: { country: "us" },
        fields: ["formatted_address", "geometry"],
      });
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          setAddress(place.formatted_address);
          handleAddressSelect(place);
        }
      });
    }

    if (window.google?.maps?.places) { initAutocomplete(); return; }
    const existing = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existing) { existing.addEventListener("load", initAutocomplete); return; }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`;
    script.async = true;
    script.onload = initAutocomplete;
    document.head.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddressSelect = useCallback((place: google.maps.places.PlaceResult) => {
    const lat = place.geometry?.location?.lat();
    const lng = place.geometry?.location?.lng();
    if (!lat || !lng) { setError("Couldn\u2019t locate that address. Try another or upload a photo."); return; }
    setStreetViewUrl(`https://maps.googleapis.com/maps/api/streetview?size=800x600&location=${lat},${lng}&fov=90&pitch=10&key=${GOOGLE_KEY}`);
    setUploadedImage(null);
    setStep("preview");
    setError("");
    if (place.formatted_address) {
      fetch("/api/visualizer/capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: place.formatted_address }), keepalive: true }).catch(() => {});
    }
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setUploadedImage(reader.result as string); setStreetViewUrl(""); setStep("preview"); setError(""); };
    reader.readAsDataURL(file);
  };

  // ---------- Fire render on scene select -> move to gate ----------
  const handleSceneConfirm = () => {
    setStep("gate");
    setRenderReady(false);
    setRenderedImage(null);
    setTickerIndex(0);

    const imageSource = uploadedImage || streetViewUrl;
    fetch("/api/visualizer/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageSource, address, sceneId: selectedScene }),
    })
      .then((r) => r.json())
      .then((d) => { if (d.ok) { setRenderedImage(d.imageUrl); setRenderReady(true); } else { setError("Render failed \u2014 try again."); } })
      .catch(() => setError("Render failed \u2014 try again."));
  };

  // Status ticker rotation
  useEffect(() => {
    if (step !== "gate" || renderReady) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % STATUS_TICKERS.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [step, renderReady]);

  // ---------- Gate form submit -> reveal ----------
  const handleGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    const est = calculateEstimate({ stories, coverage, gables, garage });
    setEstimate(est);

    // Fire lead capture to /api/quote
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Fire Meta Lead conversion event
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "Lead", {
        content_name: `Visualizer - ${selectedScene}`,
        content_category: "permanent_lighting",
        value: 0,
        currency: "USD",
      });
    }

    try {
      await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          email,
          street: address,
          city: "",
          zip: "",
          homeValue: "",
          interests: extras,
          coverage,
          stories,
          structures: "",
          gables,
          garage,
          timeline,
          hearAbout: "visualizer",
          notes: `Scene: ${selectedScene}`,
          smsConsent,
          attribution: {},
        }),
        keepalive: true,
      });
    } catch {
      /* non-blocking */
    }

    // If render is ready, reveal immediately. Otherwise wait.
    if (renderReady) setStep("reveal");
  };

  // Watch for render to finish after form submitted
  useEffect(() => {
    if (formSubmitted && renderReady && step === "gate") {
      const est = calculateEstimate({ stories, coverage, gables, garage });
      setEstimate(est);
      setStep("reveal");
    }
  }, [formSubmitted, renderReady, step, stories, coverage, gables, garage]);

  const reset = () => {
    setStep("address"); setAddress(""); setStreetViewUrl(""); setUploadedImage(null);
    setRenderedImage(null); setRenderReady(false); setError(""); setFullScreen(false);
    setFormSubmitted(false); setEstimate(null); setSelectedScene(SCENES[0].id);
    setStories(""); setCoverage(""); setGables(""); setGarage(""); setExtras([]); setTimeline("");
    setFullName(""); setEmail(""); setPhone(""); setSmsConsent(false);
  };

  const tryAnotherScene = () => {
    setStep("scene");
    setRenderReady(false);
    setRenderedImage(null);
    setFormSubmitted(false);
    setEstimate(null);
  };

  const toggleExtra = (value: string) => {
    setExtras((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
  };

  // ---------- Full-screen ----------
  if (step === "reveal" && renderedImage && fullScreen) {
    return (
      <div className="fixed inset-0 z-50">
        <img src={renderedImage} alt="Your home with permanent lighting" className="h-full w-full object-cover" />
        <button type="button" onClick={() => setFullScreen(false)} className="absolute top-6 right-6 flex items-center gap-2 rounded-lg bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/60">
          <Minimize2 className="size-4" /> Back
        </button>
      </div>
    );
  }

  const selectedSceneObj = SCENES.find((s) => s.id === selectedScene) ?? SCENES[0];

  const radioBtn = (name: string, value: string, label: string, selected: string, setter: (v: string) => void) => (
    <label key={value} className="flex-1 cursor-pointer">
      <input type="radio" name={name} value={value} checked={selected === value} onChange={() => setter(value)} className="sr-only peer" />
      <span className="block rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-center text-xs font-medium text-brand-cream/60 transition-all peer-checked:border-brand-gold peer-checked:bg-brand-gold/10 peer-checked:text-brand-gold hover:border-white/30">
        {label}
      </span>
    </label>
  );

  return (
    <div className="mx-auto max-w-[90rem] px-6">

      {/* ======= STEP 1: ADDRESS ======= */}
      {step === "address" && (
        <div className="mx-auto max-w-xl">
          <div className="text-center">
            <h1 className="text-brand-cream">
              See your home{" "}
              <span className="text-brand-gold"><GlowText>lit up</GlowText></span>{" "}
              before you spend a dollar.
            </h1>
            <p className="mt-4 text-base text-brand-cream/50 lg:text-lg">
              Enter your address and we&rsquo;ll show you what permanent lighting looks like on your actual house &mdash; not a stock photo.
            </p>
          </div>

          <div className="mt-12 space-y-6">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand-cream/30" />
              <input ref={inputRef} type="text" placeholder="Start typing your address\u2026" className="h-14 w-full rounded-xl border border-white/15 bg-white/[0.04] pl-11 pr-4 text-base text-brand-cream placeholder:text-brand-cream/30 outline-none transition-colors focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/25" />
            </div>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-brand-cream/25 uppercase tracking-widest">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex w-full items-center justify-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-8 text-brand-cream/40 transition-colors hover:border-brand-gold/40 hover:text-brand-cream/60">
              <Upload className="size-5" />
              <span className="text-sm font-medium">Upload a photo of your home</span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

            <p className="text-center text-xs text-brand-cream/30">
              Serving Carmel, Fishers, Westfield, Noblesville, and Zionsville.
            </p>

            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        </div>
      )}

      {/* ======= STEP 2: CONFIRM HOME ======= */}
      {step === "preview" && (
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-brand-cream">Is this your home?</h2>
            <p className="mt-1 text-sm text-brand-cream/40">We&rsquo;ll use this view to build your preview.</p>
          </div>

          <BorderRotate animationSpeed={6} borderWidth={3} borderRadius={16} backgroundColor="#141C2F" gradientColors={{ primary: "#584827", secondary: "#E7B969", accent: "#f9de90" }} className="w-full">
            <div className="overflow-hidden rounded-[13px]">
              <img src={uploadedImage || streetViewUrl} alt="Your home" className="w-full" />
            </div>
          </BorderRotate>

          {address && <p className="text-center text-sm text-brand-cream/40">{address}</p>}

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => setStep("scene")} size="lg">
              Yes, that&rsquo;s it <ArrowRight className="ml-2 size-4" />
            </Button>
            <button type="button" onClick={() => { fileInputRef.current?.click(); }} className="text-sm text-brand-cream/40 underline underline-offset-4 transition-colors hover:text-brand-cream/60">
              Not my home &mdash; upload a photo instead
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

          {error && <p className="text-center text-sm text-red-400">{error}</p>}
        </div>
      )}

      {/* ======= STEP 3: SCENE SELECTION ======= */}
      {step === "scene" && (
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-brand-cream">Pick a scene.</h2>
            <p className="mt-1 text-sm text-brand-cream/40">Your lights do all of these. Start with whichever one you want to see first.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {SCENES.map((scene) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => setSelectedScene(scene.id)}
                className={`group relative rounded-xl border p-5 text-left transition-all ${
                  selectedScene === scene.id
                    ? "border-brand-gold bg-brand-gold/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                {selectedScene === scene.id && (
                  <div className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-brand-gold">
                    <Check className="size-3 text-[#141C2F]" />
                  </div>
                )}
                <span className="text-2xl">{scene.emoji}</span>
                <h3 className="mt-3 text-sm font-semibold text-brand-cream">{scene.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-brand-cream/40">{scene.description}</p>
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-brand-cream/30">
            Every scene above runs on the same lights. You install once, then change it from your phone.
          </p>

          <div className="flex justify-center">
            <Button onClick={handleSceneConfirm} size="lg">
              Render my home <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ======= STEP 4: GATE (RENDER + FORM) ======= */}
      {step === "gate" && (
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">

            {/* Left: locked render preview */}
            <div className="lg:w-1/2">
              <div className="overflow-hidden rounded-xl border border-white/10">
                {renderedImage ? (
                  <div className="relative">
                    <img src={renderedImage} alt="Preview" className="w-full blur-xl brightness-75" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <Lock className="size-8 text-brand-gold" />
                      <p className="text-sm font-medium text-brand-cream">Your preview is ready</p>
                      <p className="text-xs text-brand-cream/40">Complete the form to unlock</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex aspect-[3/2] flex-col items-center justify-center gap-4 bg-white/[0.02]">
                    <Loader2 className="size-8 animate-spin text-brand-gold" />
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={tickerIndex}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="text-sm text-brand-cream/60"
                      >
                        {STATUS_TICKERS[tickerIndex]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {formSubmitted && !renderReady && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-brand-cream/60">
                  <Loader2 className="size-4 animate-spin text-brand-gold" />
                  Finishing up&hellip;
                </div>
              )}
            </div>

            {/* Right: install prefs + contact form */}
            <div className="lg:w-1/2">
              <h2 className="text-xl font-semibold text-brand-cream">A few details about your home.</h2>
              <p className="mt-1 text-sm text-brand-cream/40">These change the price, so it&rsquo;s worth 30 seconds.</p>

              <form onSubmit={handleGateSubmit} className="mt-6 space-y-4">
                {/* Stories */}
                <div>
                  <p className="mb-2 text-xs font-medium text-brand-cream/40">How many stories?</p>
                  <div className="flex gap-2">
                    {radioBtn("stories", "1", "1", stories, setStories)}
                    {radioBtn("stories", "2", "2", stories, setStories)}
                    {radioBtn("stories", "3", "3+", stories, setStories)}
                  </div>
                </div>

                {/* Gables */}
                <div>
                  <p className="mb-2 text-xs font-medium text-brand-cream/40">Roofline peaks and gables</p>
                  <div className="flex gap-2">
                    {radioBtn("gables", "simple", "Simple (1-2)", gables, setGables)}
                    {radioBtn("gables", "average", "Average (3-4)", gables, setGables)}
                    {radioBtn("gables", "complex", "Complex (5+)", gables, setGables)}
                    {radioBtn("gables", "unsure", "Not sure", gables, setGables)}
                  </div>
                </div>

                {/* Garage */}
                <div>
                  <p className="mb-2 text-xs font-medium text-brand-cream/40">Attached garage?</p>
                  <div className="flex gap-2">
                    {radioBtn("garage", "yes", "Yes", garage, setGarage)}
                    {radioBtn("garage", "no", "No", garage, setGarage)}
                    {radioBtn("garage", "detached", "Detached", garage, setGarage)}
                  </div>
                </div>

                {/* Coverage */}
                <div>
                  <p className="mb-2 text-xs font-medium text-brand-cream/40">Where should the lights run?</p>
                  <div className="flex gap-2">
                    {radioBtn("coverage", "front", "Front only", coverage, setCoverage)}
                    {radioBtn("coverage", "front-sides", "Front & sides", coverage, setCoverage)}
                    {radioBtn("coverage", "full", "Full perimeter", coverage, setCoverage)}
                  </div>
                </div>

                {/* Extras */}
                <div>
                  <p className="mb-2 text-xs font-medium text-brand-cream/40">Anything else to light? <span className="text-brand-cream/25">(optional)</span></p>
                  <div className="flex flex-wrap gap-2">
                    {EXTRAS_OPTIONS.map((opt) => (
                      <label key={opt.value} className="cursor-pointer">
                        <input type="checkbox" checked={extras.includes(opt.value)} onChange={() => toggleExtra(opt.value)} className="sr-only peer" />
                        <span className="block rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-center text-xs font-medium text-brand-cream/60 transition-all peer-checked:border-brand-gold peer-checked:bg-brand-gold/10 peer-checked:text-brand-gold hover:border-white/30">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <p className="mb-2 text-xs font-medium text-brand-cream/40">Timeline</p>
                  <div className="flex gap-2 flex-wrap">
                    {radioBtn("timeline", "asap", "ASAP", timeline, setTimeline)}
                    {radioBtn("timeline", "holidays", "Before the holidays", timeline, setTimeline)}
                    {radioBtn("timeline", "spring", "Next spring", timeline, setTimeline)}
                    {radioBtn("timeline", "exploring", "Just exploring", timeline, setTimeline)}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 pt-4" />

                {/* Contact */}
                <input name="fullName" required placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={f} />
                <input name="email" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={f} />
                <input name="phone" type="tel" required placeholder="Phone" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} className={f} />

                {/* SMS consent */}
                <label className="flex cursor-pointer items-start gap-2.5 text-xs text-brand-cream/50">
                  <input type="checkbox" checked={smsConsent} onChange={(e) => setSmsConsent(e.target.checked)} className="mt-0.5 size-3.5 rounded border-white/25 bg-transparent accent-brand-gold" />
                  <span>By checking this box, you agree to receive recurring automated promotional and personalized marketing text messages from Glow&rsquo;s Lighting Services at the phone number provided. Consent is not a condition of purchase. Msg &amp; data rates may apply. Reply STOP to cancel.</span>
                </label>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <Button type="submit" size="lg" className="w-full" disabled={!stories || !coverage || !gables || !garage || !fullName || !email || !phone}>
                  Unlock my preview <ArrowRight className="ml-2 size-4" />
                </Button>

                <p className="text-[0.6rem] leading-relaxed text-brand-cream/25">
                  By submitting you authorize Glow&rsquo;s Lighting Services to contact you by phone, email, or text. We don&rsquo;t sell your information.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ======= STEP 5: REVEAL + PRICING ======= */}
      {step === "reveal" && renderedImage && estimate && (
        <div className="space-y-12">
          {/* Render reveal */}
          <div className="mx-auto max-w-4xl">
            <BorderRotate animationSpeed={6} borderWidth={3} borderRadius={16} backgroundColor="#141C2F" gradientColors={{ primary: "#584827", secondary: "#E7B969", accent: "#f9de90" }} className="w-full">
              <div className="overflow-hidden rounded-[13px]">
                <motion.img initial={{ filter: "blur(20px)", opacity: 0 }} animate={{ filter: "blur(0px)", opacity: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} src={renderedImage} alt="Your home with permanent lighting" className="w-full" />
              </div>
            </BorderRotate>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setFullScreen(true)}>
                <Maximize2 className="mr-1 size-3.5" /> Full screen
              </Button>
            </div>
          </div>

          {/* Pricing */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.5 }} className="mx-auto max-w-3xl">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-brand-cream">Your estimate</h3>
              <p className="mt-1 text-sm text-brand-cream/50">
                Or as low as {formatCurrency(estimate.monthlyLow)}/mo with 0% financing.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { label: "Low", monthly: estimate.monthlyLow, total: estimate.low, highlight: false },
                { label: "Estimate", monthly: estimate.monthlyMid, total: estimate.mid, highlight: true },
                { label: "High", monthly: estimate.monthlyHigh, total: estimate.high, highlight: false },
              ].map(({ label, monthly, total, highlight }) => (
                <div key={label} className={`rounded-xl border p-6 text-center ${highlight ? "border-brand-gold/30 bg-brand-gold/[0.06]" : "border-white/10 bg-white/[0.03]"}`}>
                  <p className="text-xs text-brand-cream/40 uppercase tracking-wider">{label}</p>
                  <p className={`mt-2 font-display text-3xl font-semibold lg:text-4xl ${highlight ? "text-brand-gold" : "text-brand-cream"}`}>
                    {formatCurrency(monthly)}<span className="text-lg text-brand-cream/40">/mo</span>
                  </p>
                  <p className="mt-1 text-sm text-brand-cream/30">{formatCurrency(total)} total</p>
                </div>
              ))}
            </div>

            <p className="mt-4 text-center text-xs text-brand-cream/30">
              Payments shown at {estimate.financingTerm} months, 0% APR through Enhancify. Subject to credit approval.
            </p>

            <p className="mt-2 text-center text-xs text-brand-cream/30">
              Based on approximately {estimate.linearFeet} ft of roofline, {stories} {Number(stories) === 1 ? "story" : "stories"}, {COVERAGE_LABELS[coverage] || coverage}.
            </p>

            <p className="mt-2 text-center text-sm text-brand-cream/50 italic">
              {selectedSceneObj.name} &mdash; {selectedSceneObj.description}
            </p>

            {/* Accuracy block */}
            <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <h4 className="font-semibold text-brand-cream">This is an estimate. The real number comes from your driveway.</h4>
              <p className="mt-2 text-sm text-brand-cream/50">
                Rooflines hide things satellites can&rsquo;t see &mdash; soffit depth, fascia condition, where power actually runs. A 20-minute walkthrough gets you an exact price.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-brand-cream/70">
                <div className="flex items-center gap-2"><Check className="size-4 text-brand-gold" /> Exact pricing</div>
                <div className="flex items-center gap-2"><Check className="size-4 text-brand-gold" /> Flexible financing</div>
                <div className="flex items-center gap-2"><Check className="size-4 text-brand-gold" /> We&rsquo;ll show you the app</div>
                <div className="flex items-center gap-2"><Check className="size-4 text-brand-gold" /> Free, no obligation</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <Button size="lg" className="px-12">
                Book your free measure <ArrowRight className="ml-2 size-4" />
              </Button>
              <button type="button" onClick={tryAnotherScene} className="text-sm text-brand-cream/40 underline underline-offset-4 transition-colors hover:text-brand-cream/60">
                Try another scene
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
