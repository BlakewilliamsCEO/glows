"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Upload, Loader2, ArrowRight, Maximize2, Minimize2, Check, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { SCENES } from "@/lib/scenes";
import { calculateEstimate, type Estimate } from "@/lib/pricing";

type Step = "address" | "preview" | "scene" | "gate" | "reveal";

const STEPS: Step[] = ["address", "preview", "scene", "gate", "reveal"];

const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

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

const SCENE_GRADIENTS: Record<string, string> = {
  "warm-white": "linear-gradient(160deg, #F5E6C8, #E8C87A)",
  christmas: "linear-gradient(160deg, #1B4332, #C1121F)",
  halloween: "linear-gradient(160deg, #2B2118, #E07A1F)",
  gameday: "linear-gradient(160deg, #14213D, #3A5BA0)",
};

export function Visualizer() {
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState("");
  const [streetViewUrl, setStreetViewUrl] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [renderedImage, setRenderedImage] = useState<string | null>(null);
  const [renderReady, setRenderReady] = useState(false);
  const [error, setError] = useState("");
  const [fullScreen, setFullScreen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [stickySmall, setStickySmall] = useState(false);
  const [showQuote, setShowQuote] = useState(false);

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
  const sentinelRef = useRef<HTMLDivElement>(null);
  const ioRef = useRef<IntersectionObserver | null>(null);

  const stepIndex = STEPS.indexOf(step);

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

  // Sticky collapse observer for gate step
  useEffect(() => {
    if (ioRef.current) { ioRef.current.disconnect(); ioRef.current = null; }
    if (step !== "gate" || !sentinelRef.current) return;
    ioRef.current = new IntersectionObserver(
      (entries) => setStickySmall(!entries[0].isIntersecting),
      { threshold: 0, rootMargin: "-100px 0px 0px 0px" }
    );
    ioRef.current.observe(sentinelRef.current);
    return () => { ioRef.current?.disconnect(); };
  }, [step]);

  // ---------- Gate form submit -> reveal ----------
  const handleGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    const est = calculateEstimate({ stories, coverage, gables, garage });
    setEstimate(est);

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
    setFormSubmitted(false); setEstimate(null); setSelectedScene(null);
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

  const selectedSceneObj = SCENES.find((s) => s.id === selectedScene) ?? SCENES[0];

  // ---------- Full-screen overlay ----------
  if (step === "reveal" && renderedImage && fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <img src={renderedImage} alt="Your home with permanent lighting" className="h-full w-full object-cover" />
        <button type="button" onClick={() => setFullScreen(false)} className="absolute top-6 right-6 flex items-center gap-2 rounded-lg bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/60">
          <Minimize2 className="size-4" /> Back
        </button>
      </div>
    );
  }

  // ---------- Shared UI helpers ----------
  const OptionButton = ({ selected, onClick, children, multi = false, popular = false }: { selected: boolean; onClick: () => void; children: React.ReactNode; multi?: boolean; popular?: boolean }) => (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-full items-center justify-between min-h-[60px] px-5 mb-3 rounded-xl border text-left text-base font-medium transition-all ${
        selected
          ? "border-2 border-[#14213D] text-[#14213D]"
          : "border-[#E3E6EC] text-[#0F1420] hover:border-[#C5C9D2]"
      }`}
    >
      <span className="flex items-center gap-2.5">
        {children}
        {popular && <span className="text-[11px] font-semibold uppercase tracking-wide text-[#D4A017] bg-[#D4A017]/10 px-2 py-0.5 rounded-full">Most popular</span>}
      </span>
      <span className={`flex-shrink-0 size-6 ${multi ? "rounded-md" : "rounded-full"} border relative ${
        selected ? "bg-[#14213D] border-[#14213D]" : "border-[#E3E6EC]"
      }`}>
        {selected && (
          <svg className="absolute left-[7px] top-[3px] size-[11px]" viewBox="0 0 11 11" fill="none">
            <path d="M1 5.5L4 8.5L10 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </button>
  );

  const SegButton = ({ selected, onClick, children, popular = false }: { selected: boolean; onClick: () => void; children: React.ReactNode; popular?: boolean }) => (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex-1 min-h-[60px] rounded-xl border text-base font-medium transition-all ${
        selected
          ? "border-2 border-[#14213D] text-[#14213D]"
          : "border-[#E3E6EC] text-[#0F1420] hover:border-[#C5C9D2]"
      }`}
    >
      {children}
      {popular && <span className="block text-[10px] font-semibold uppercase tracking-wide text-[#D4A017] mt-0.5">Most popular</span>}
    </button>
  );

  return (
    <div className="px-5 pb-16 pt-5 max-w-[560px] mx-auto md:my-8 md:border md:border-[#E3E6EC] md:rounded-2xl md:px-10 md:py-10">

      {/* Logo */}
      <div className="text-center mb-6">
        <span className="font-display text-2xl font-semibold italic tracking-tight text-[#14213D]">
          Glows<span className="text-[#D4A017] not-italic">.</span>
        </span>
        <span className="block text-[0.5rem] font-sans font-medium uppercase tracking-[0.28em] text-[#6B7280]">
          Permanent Lighting
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className={`flex-1 h-[3px] rounded-full transition-colors ${i <= stepIndex ? "bg-[#14213D]" : "bg-[#E3E6EC]"}`} />
        ))}
      </div>

      {/* ======= STEP 1: ADDRESS ======= */}
      {step === "address" && (
        <section>
          <h1 className="text-[28px] leading-[1.25] font-semibold text-center text-[#0F1420] md:text-[32px] md:leading-[1.2]">
            See your home lit up before you spend a dollar.
          </h1>
          <p className="text-base leading-relaxed text-[#6B7280] text-center mt-3">
            Enter your address and we&rsquo;ll show you what permanent lighting looks like on your actual house.
          </p>

          <div className="mt-7">
            <div className="relative">
              <MapPin className="absolute left-5 top-1/2 size-[18px] -translate-y-1/2 text-[#9CA3AF]" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Start typing your address\u2026"
                className="w-full h-[60px] pl-12 pr-5 rounded-xl border border-[#E3E6EC] text-base text-[#0F1420] placeholder:text-[#9CA3AF] outline-none focus:outline-2 focus:outline-[#14213D] focus:-outline-offset-2"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep("preview")}
            className="w-full h-14 mt-8 rounded-xl bg-[#14213D] text-white text-[17px] font-semibold disabled:opacity-40"
          >
            Continue
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="block w-full text-center text-[15px] text-[#6B7280] mt-4 cursor-pointer"
          >
            Upload a photo of your home
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

          <p className="text-center text-[13px] text-[#6B7280] mt-6 leading-relaxed">
            Serving Carmel, Fishers, Westfield, Noblesville, and Zionsville.
          </p>

          {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
        </section>
      )}

      {/* ======= STEP 2: CONFIRM HOME ======= */}
      {step === "preview" && (
        <section>
          <h1 className="text-[28px] leading-[1.25] font-semibold text-center text-[#0F1420] md:text-[32px] md:leading-[1.2]">
            Is this your home?
          </h1>
          <p className="text-base text-[#6B7280] text-center mt-3">
            We&rsquo;ll use this view to build your preview.
          </p>

          <div className="mt-7">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-[#9AA7B8] to-[#5C6B80]">
              {(uploadedImage || streetViewUrl) ? (
                <img src={uploadedImage || streetViewUrl} alt="Your home" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-white text-sm">Street View</div>
              )}
            </div>
          </div>

          {address && <p className="text-center text-sm text-[#6B7280] mt-3">{address}</p>}

          <button
            type="button"
            onClick={() => setStep("scene")}
            className="w-full h-14 mt-8 rounded-xl bg-[#14213D] text-white text-[17px] font-semibold"
          >
            Yes, that&rsquo;s it
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="block w-full text-center text-[15px] text-[#6B7280] mt-4 cursor-pointer"
          >
            Not my home &mdash; upload a photo instead
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

          {error && <p className="text-center text-sm text-red-500 mt-4">{error}</p>}
        </section>
      )}

      {/* ======= STEP 3: SCENE SELECTION ======= */}
      {step === "scene" && (
        <section>
          <h1 className="text-[28px] leading-[1.25] font-semibold text-center text-[#0F1420] md:text-[32px] md:leading-[1.2]">
            Pick a scene.
          </h1>
          <p className="text-base text-[#6B7280] text-center mt-3">
            One set of lights. Every scene below. Pick the one you want to see first.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-7">
            {SCENES.map((scene) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => setSelectedScene(scene.id)}
                className={`rounded-xl overflow-hidden border-2 transition-all text-left ${
                  selectedScene === scene.id ? "border-[#14213D]" : "border-[#E3E6EC]"
                }`}
              >
                <span
                  className="block aspect-[4/3]"
                  style={{ background: SCENE_GRADIENTS[scene.id] || "#ccc" }}
                />
                <span className="block bg-[#14213D] text-white text-sm font-medium py-3 px-2 text-center">
                  {scene.name}
                </span>
              </button>
            ))}
          </div>

          <p className="text-[15px] leading-relaxed text-[#6B7280] text-center mt-4 min-h-[45px]">
            {selectedScene ? selectedSceneObj.description : "Tap a scene to see it described."}
          </p>

          <button
            type="button"
            onClick={handleSceneConfirm}
            disabled={!selectedScene}
            className="w-full h-14 mt-6 rounded-xl bg-[#14213D] text-white text-[17px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Render my home
          </button>

          <p className="text-center text-[13px] text-[#6B7280] mt-6 leading-relaxed">
            Every scene above runs on the same lights. You install once, then change it from your phone.
          </p>
        </section>
      )}

      {/* ======= STEP 4: GATE (STICKY PREVIEW + FORM) ======= */}
      {step === "gate" && (
        <section>
          <div ref={sentinelRef} className="h-px" />

          {/* Sticky collapsing preview */}
          <div className={`sticky top-0 z-10 bg-white mx-[-20px] px-5 pb-3 md:mx-[-40px] md:px-10 transition-all`}>
            <div
              className={`relative rounded-xl overflow-hidden transition-[height] duration-200 ease-out ${
                stickySmall ? "h-14" : "h-[180px]"
              }`}
            >
              <div className={`absolute inset-0 ${renderReady ? "bg-gradient-to-br from-[#2A3448] to-[#14213D]" : "bg-gradient-to-br from-[#8C99AB] to-[#39445C] blur-[3px]"}`} />
              <div className={`absolute left-3 right-3 text-center text-white text-sm transition-all duration-200 ${stickySmall ? "bottom-[19px]" : "bottom-4"}`} style={{ textShadow: "0 1px 4px rgba(0,0,0,.7)" }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={renderReady ? "ready" : tickerIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                  >
                    {renderReady ? "Your preview is ready \u2014 finish to unlock" : STATUS_TICKERS[tickerIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <h1 className="text-[28px] leading-[1.25] font-semibold text-center text-[#0F1420] mt-5 md:text-[32px] md:leading-[1.2]">
            A few details about your home.
          </h1>
          <p className="text-base text-[#6B7280] text-center mt-3">
            These change the price, so it&rsquo;s worth 30 seconds.
          </p>

          <form onSubmit={handleGateSubmit} className="mt-6">
            {/* Stories */}
            <p className="text-base font-medium text-[#0F1420] mb-3 mt-6">How many stories?</p>
            <div className="flex gap-2 mb-3">
              <SegButton selected={stories === "1"} onClick={() => setStories("1")}>1</SegButton>
              <SegButton selected={stories === "2"} onClick={() => setStories("2")} popular>2</SegButton>
              <SegButton selected={stories === "3"} onClick={() => setStories("3")}>3+</SegButton>
            </div>

            {/* Gables */}
            <p className="text-base font-medium text-[#0F1420] mb-3 mt-6">Roofline peaks and gables</p>
            <OptionButton selected={gables === "simple"} onClick={() => setGables("simple")}>Simple (1&ndash;2)</OptionButton>
            <OptionButton selected={gables === "average"} onClick={() => setGables("average")} popular>Average (3&ndash;4)</OptionButton>
            <OptionButton selected={gables === "complex"} onClick={() => setGables("complex")}>Complex (5+)</OptionButton>
            <OptionButton selected={gables === "unsure"} onClick={() => setGables("unsure")}>Not sure</OptionButton>

            {/* Garage */}
            <p className="text-base font-medium text-[#0F1420] mb-3 mt-6">Attached garage?</p>
            <div className="flex gap-2 mb-3">
              <SegButton selected={garage === "yes"} onClick={() => setGarage("yes")} popular>Yes</SegButton>
              <SegButton selected={garage === "no"} onClick={() => setGarage("no")}>No</SegButton>
              <SegButton selected={garage === "detached"} onClick={() => setGarage("detached")}>Detached</SegButton>
            </div>

            {/* Coverage */}
            <p className="text-base font-medium text-[#0F1420] mb-3 mt-6">Where should the lights run?</p>
            <OptionButton selected={coverage === "front"} onClick={() => setCoverage("front")}>Front only</OptionButton>
            <OptionButton selected={coverage === "front-sides"} onClick={() => setCoverage("front-sides")} popular>Front &amp; sides</OptionButton>
            <OptionButton selected={coverage === "full"} onClick={() => setCoverage("full")}>Full perimeter</OptionButton>

            {/* Extras */}
            <p className="text-base font-medium text-[#0F1420] mb-3 mt-6">Anything else to light? <span className="font-normal text-[#6B7280]">(optional, pick any)</span></p>
            {EXTRAS_OPTIONS.map((opt) => (
              <OptionButton key={opt.value} selected={extras.includes(opt.value)} onClick={() => toggleExtra(opt.value)} multi>{opt.label}</OptionButton>
            ))}

            {/* Timeline */}
            <p className="text-base font-medium text-[#0F1420] mb-3 mt-6">Timeline</p>
            <OptionButton selected={timeline === "asap"} onClick={() => setTimeline("asap")}>ASAP</OptionButton>
            <OptionButton selected={timeline === "holidays"} onClick={() => setTimeline("holidays")} popular>Before the holidays</OptionButton>
            <OptionButton selected={timeline === "spring"} onClick={() => setTimeline("spring")}>Next spring</OptionButton>
            <OptionButton selected={timeline === "exploring"} onClick={() => setTimeline("exploring")}>Just exploring</OptionButton>

            {/* Contact */}
            <p className="text-[13px] uppercase tracking-[0.08em] text-[#6B7280] font-medium mt-7 mb-3">Where to send it</p>
            <input name="fullName" required placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full h-[60px] px-5 mb-3 rounded-xl border border-[#E3E6EC] text-base text-[#0F1420] placeholder:text-[#9CA3AF] outline-none focus:outline-2 focus:outline-[#14213D] focus:-outline-offset-2" />
            <input name="email" type="email" inputMode="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-[60px] px-5 mb-3 rounded-xl border border-[#E3E6EC] text-base text-[#0F1420] placeholder:text-[#9CA3AF] outline-none focus:outline-2 focus:outline-[#14213D] focus:-outline-offset-2" />
            <input name="phone" type="tel" inputMode="tel" required placeholder="Phone" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} className="w-full h-[60px] px-5 mb-3 rounded-xl border border-[#E3E6EC] text-base text-[#0F1420] placeholder:text-[#9CA3AF] outline-none focus:outline-2 focus:outline-[#14213D] focus:-outline-offset-2" />

            {/* SMS consent */}
            <OptionButton selected={smsConsent} onClick={() => setSmsConsent(!smsConsent)} multi>Text me my preview</OptionButton>
            <p className="text-xs leading-relaxed text-[#6B7280] -mt-1 mb-3">
              By checking this box, you agree to receive recurring automated promotional and personalized marketing text messages from Glow&rsquo;s Permanent Lighting at the phone number provided. Consent is not a condition of purchase. Msg &amp; data rates may apply. Reply STOP to cancel.
            </p>

            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

            {formSubmitted && !renderReady && (
              <div className="flex items-center justify-center gap-2 text-sm text-[#6B7280] my-4">
                <Loader2 className="size-4 animate-spin text-[#D4A017]" />
                Finishing up&hellip;
              </div>
            )}

            <button
              type="submit"
              disabled={!stories || !coverage || !gables || !garage || !fullName || !email || !phone}
              className="w-full h-14 mt-6 rounded-xl bg-[#14213D] text-white text-[17px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Unlock my preview
            </button>

            <p className="text-center text-[13px] text-[#6B7280] mt-4 leading-relaxed">
              By submitting you authorize Glow&rsquo;s Permanent Lighting to contact you by phone, email, or text. We don&rsquo;t sell your information.
            </p>
          </form>
        </section>
      )}

      {/* ======= STEP 5: REVEAL + PRICING ======= */}
      {step === "reveal" && renderedImage && estimate && (
        <section>
          {/* Rendered image with gold sheen border */}
          <div className="rounded-2xl p-[3px] bg-[length:200%_100%] animate-[sheen_3s_linear_infinite]" style={{ backgroundImage: "linear-gradient(90deg, #D4A017, #F5E6C8, #D4A017)" }}>
            <div className="aspect-[4/3] rounded-[13px] overflow-hidden bg-gradient-to-br from-[#1A2438] to-[#3E5378]">
              <motion.img
                initial={{ filter: "blur(20px)", opacity: 0 }}
                animate={{ filter: "blur(0px)", opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                src={renderedImage}
                alt="Your home with permanent lighting"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button type="button" onClick={() => setFullScreen(true)} className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#0F1420]">
              <Maximize2 className="size-3.5" /> Full screen
            </button>
          </div>

          {/* CTA to reveal quote */}
          {!showQuote && (
            <button
              type="button"
              onClick={() => setShowQuote(true)}
              className="w-full h-14 mt-6 rounded-xl bg-[#14213D] text-white text-[17px] font-semibold flex items-center justify-center gap-2"
            >
              See your personalized quote <ArrowRight className="size-4" />
            </button>
          )}

          {/* Quote + Calendar (revealed after CTA tap) */}
          {showQuote && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

              {/* Pricing */}
              <h1 className="text-[28px] leading-[1.25] font-bold text-center text-[#0F1420] mt-8 md:text-[32px] md:leading-[1.2]">
                Your Estimate
              </h1>
              <p className="text-base text-[#6B7280] text-center mt-3">
                Or as low as {formatCurrency(estimate.monthlyLow)}/mo with 0% financing.
              </p>

              <div className="mt-6 space-y-3">
                {/* Low */}
                <div className="rounded-xl border border-[#E3E6EC] p-5 text-center">
                  <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#6B7280]">Low</p>
                  <p className="text-[32px] font-semibold text-[#0F1420] mt-1.5 tabular">
                    {formatCurrency(estimate.monthlyLow)}<span className="text-base font-normal text-[#6B7280]">/mo</span>
                  </p>
                  <p className="text-[15px] text-[#6B7280] tabular">{formatCurrency(estimate.low)} total</p>
                </div>

                {/* Mid (featured) */}
                <div className="rounded-xl border-2 border-[#14213D] p-5 text-center relative mt-5">
                  <span className="absolute -top-[10px] left-1/2 -translate-x-1/2 bg-[#14213D] text-white text-xs font-bold px-3 py-1 rounded-full">Most homes</span>
                  <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#6B7280]">Estimate</p>
                  <p className="text-[32px] font-semibold text-[#0F1420] mt-1.5 tabular">
                    {formatCurrency(estimate.monthlyMid)}<span className="text-base font-normal text-[#6B7280]">/mo</span>
                  </p>
                  <p className="text-[15px] text-[#6B7280] tabular">{formatCurrency(estimate.mid)} total</p>
                </div>

                {/* High */}
                <div className="rounded-xl border border-[#E3E6EC] p-5 text-center">
                  <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#6B7280]">High</p>
                  <p className="text-[32px] font-semibold text-[#0F1420] mt-1.5 tabular">
                    {formatCurrency(estimate.monthlyHigh)}<span className="text-base font-normal text-[#6B7280]">/mo</span>
                  </p>
                  <p className="text-[15px] text-[#6B7280] tabular">{formatCurrency(estimate.high)} total</p>
                </div>
              </div>

              <p className="text-[13px] text-[#6B7280] leading-relaxed mt-4">
                Payments shown at {estimate.financingTerm} months, 0% APR through Enhancify. Subject to credit approval.
                <br /><br />
                Based on approximately {estimate.linearFeet} ft of roofline, {stories} {Number(stories) === 1 ? "story" : "stories"}, {COVERAGE_LABELS[coverage] || coverage}.
              </p>

              {/* Accuracy block */}
              <div className="bg-[#F6F7F9] rounded-xl p-5 mt-6">
                <h2 className="text-[18px] font-bold text-[#0F1420] leading-snug">
                  This is an estimate. The real number comes from your driveway.
                </h2>
                <p className="text-[15px] leading-relaxed text-[#6B7280] mt-2.5">
                  Rooflines hide things satellites can&rsquo;t see &mdash; soffit depth, fascia condition, where power actually runs. A 20-minute walkthrough gets you an exact price.
                </p>
                <div className="mt-3 space-y-3">
                  <div className="flex items-start gap-3 text-[15px]"><span className="text-[#D4A017] font-bold">&#10003;</span><span><strong>Exact pricing</strong></span></div>
                  <div className="flex items-start gap-3 text-[15px]"><span className="text-[#D4A017] font-bold">&#10003;</span><span><strong>Flexible financing</strong></span></div>
                  <div className="flex items-start gap-3 text-[15px]"><span className="text-[#D4A017] font-bold">&#10003;</span><span><strong>We&rsquo;ll show you the app</strong></span></div>
                  <div className="flex items-start gap-3 text-[15px]"><span className="text-[#D4A017] font-bold">&#10003;</span><span><strong>Free, no obligation</strong></span></div>
                </div>
              </div>

              {/* Inline Cal.com booking — always visible */}
              <div className="mt-10">
                <h2 className="text-[24px] font-bold text-[#0F1420] text-center leading-snug md:text-[28px]">
                  Pick a day &amp; time for your design consult.
                </h2>
                <p className="text-base text-[#6B7280] text-center mt-2 mb-6">
                  30 minutes, free, no obligation.
                </p>
                <Cal
                  calLink="get-glows-lights/30min"
                  config={{
                    name: fullName,
                    email: email,
                    phone: phone.replace(/\D/g, ""),
                    notes: `Address: ${address}\nScene: ${selectedScene}\nStories: ${stories}\nCoverage: ${COVERAGE_LABELS[coverage] || coverage}\nGables: ${gables}\nGarage: ${garage}\nEstimate: ${estimate ? formatCurrency(estimate.mid) : "N/A"}`,
                    layout: "month_view",
                    theme: "light",
                  }}
                  style={{ width: "100%", height: "100%", overflow: "auto" }}
                />
              </div>

              <button
                type="button"
                onClick={tryAnotherScene}
                className="block w-full text-center text-[15px] text-[#6B7280] mt-6 cursor-pointer"
              >
                Try another scene
              </button>
            </motion.div>
          )}
        </section>
      )}
    </div>
  );
}
