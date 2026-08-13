"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Upload, Loader2, ArrowRight, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { GlowText } from "@/components/ui/glow-text";
import { BorderRotate } from "@/components/ui/animated-gradient-border";

type Step = "address" | "preview" | "rendering" | "result";

const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

const RENDER_BEATS = [
  "You spent hundreds of thousands — or more — on your home.",
  "Because you had a vision for how your family lives.",
  "Those experiences deserve the most memorable setting.",
];

function RenderingSteps() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    // Show each beat every 6 seconds
    for (let i = 1; i < RENDER_BEATS.length; i++) {
      timers.push(setTimeout(() => setActiveStep(i), i * 6000));
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="relative">
        <Loader2 className="size-10 animate-spin text-brand-gold" />
        <div className="absolute inset-0 size-10 animate-ping rounded-full bg-brand-gold/20" />
      </div>

      <div className="min-h-[6rem] flex items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={activeStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-display text-xl font-semibold italic text-brand-cream/80 sm:text-2xl lg:text-3xl max-w-lg"
          >
            {RENDER_BEATS[activeStep]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Step dots */}
      <div className="flex gap-2">
        {RENDER_BEATS.map((_, i) => (
          <div
            key={i}
            className={`size-1.5 rounded-full transition-colors duration-500 ${
              i <= activeStep ? "bg-brand-gold" : "bg-white/15"
            }`}
          />
        ))}
        <div className="size-1.5 rounded-full bg-white/15 animate-pulse" />
      </div>

      <p className="text-xs text-brand-cream/30">
        AI is rendering your home with lights…
      </p>
    </div>
  );
}

export function Visualizer() {
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState("");
  const [streetViewUrl, setStreetViewUrl] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [renderedImage, setRenderedImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [fullScreen, setFullScreen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Google Places Autocomplete
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

    if (window.google?.maps?.places) {
      initAutocomplete();
      return;
    }

    const existing = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existing) {
      existing.addEventListener("load", initAutocomplete);
      return;
    }

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
    if (!lat || !lng) {
      setError("Couldn't locate that address. Try another or upload a photo.");
      return;
    }

    const url =
      `https://maps.googleapis.com/maps/api/streetview?` +
      `size=800x600&location=${lat},${lng}&fov=90&pitch=10&key=${GOOGLE_KEY}`;

    setStreetViewUrl(url);
    setUploadedImage(null);
    setStep("preview");
    setError("");

    // Capture the address
    if (place.formatted_address) {
      fetch("/api/visualizer/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: place.formatted_address }),
        keepalive: true,
      }).catch(() => {});
    }
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
      setStreetViewUrl("");
      setStep("preview");
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleRender = async () => {
    setStep("rendering");
    setError("");

    const imageSource = uploadedImage || streetViewUrl;

    try {
      const res = await fetch("/api/visualizer/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageSource, address }),
      });

      if (!res.ok) throw new Error("Render failed");

      const data = await res.json();
      setRenderedImage(data.imageUrl);
      setStep("result");
    } catch {
      setError("Rendering failed — try again or upload a different photo.");
      setStep("preview");
    }
  };

  const reset = () => {
    setStep("address");
    setAddress("");
    setStreetViewUrl("");
    setUploadedImage(null);
    setRenderedImage(null);
    setError("");
    setFullScreen(false);
  };

  // ---------- Full-screen result ----------
  if (step === "result" && renderedImage && fullScreen) {
    return (
      <div className="fixed inset-0 z-50">
        <img
          src={renderedImage}
          alt="Your home with permanent lighting"
          className="h-full w-full object-cover"
        />
        <button
          type="button"
          onClick={() => setFullScreen(false)}
          className="absolute top-6 right-6 flex items-center gap-2 rounded-lg bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/60"
        >
          <Minimize2 className="size-4" />
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[90rem] px-6">

      {/* ---------- ADDRESS STEP ---------- */}
      {step === "address" && (
        <div className="mx-auto max-w-xl">
          <div className="text-center">
            <h1 className="text-brand-cream">
              See your home{" "}
              <span className="text-brand-gold"><GlowText>lit.</GlowText></span>
            </h1>
            <p className="mt-4 text-base text-brand-cream/50 lg:text-lg">
              Type your address. We&rsquo;ll pull up your home and show you what it looks like with permanent lighting — free, in&nbsp;seconds.
            </p>
          </div>

          <div className="mt-12 space-y-6">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand-cream/30" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Start typing your address…"
                className="h-14 w-full rounded-xl border border-white/15 bg-white/[0.04] pl-11 pr-4 text-base text-brand-cream placeholder:text-brand-cream/30 outline-none transition-colors focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/25"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-brand-cream/25 uppercase tracking-widest">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-8 text-brand-cream/40 transition-colors hover:border-brand-gold/40 hover:text-brand-cream/60"
            >
              <Upload className="size-5" />
              <span className="text-sm font-medium">Upload a photo of your home</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />

            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        </div>
      )}

      {/* ---------- PREVIEW STEP ---------- */}
      {step === "preview" && (
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-brand-cream">Is this your home?</h2>
          </div>

          <BorderRotate
            animationSpeed={6}
            borderWidth={3}
            borderRadius={16}
            backgroundColor="#141C2F"
            gradientColors={{
              primary: "#584827",
              secondary: "#E7B969",
              accent: "#f9de90",
            }}
            className="w-full"
          >
            <div className="overflow-hidden rounded-[13px]">
              <img
                src={uploadedImage || streetViewUrl}
                alt="Your home"
                className="w-full"
              />
            </div>
          </BorderRotate>

          {address && (
            <p className="text-center text-sm text-brand-cream/40">{address}</p>
          )}

          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={reset}>
              Start over
            </Button>
            <Button onClick={handleRender} size="lg">
              Light it up
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>

          {error && <p className="text-center text-sm text-red-400">{error}</p>}
        </div>
      )}

      {/* ---------- RENDERING STEP ---------- */}
      {step === "rendering" && (
        <div className="flex min-h-[24rem] items-center justify-center">
          <RenderingSteps />
        </div>
      )}

      {/* ---------- RESULT STEP ---------- */}
      {step === "result" && renderedImage && (
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          {/* Left: rendered image — 3/4 */}
          <div className="lg:w-3/4">
            <BorderRotate
              animationSpeed={6}
              borderWidth={3}
              borderRadius={16}
              backgroundColor="#141C2F"
              gradientColors={{
                primary: "#584827",
                secondary: "#E7B969",
                accent: "#f9de90",
              }}
              className="w-full"
            >
              <div className="overflow-hidden rounded-[13px]">
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  src={renderedImage}
                  alt="Your home with permanent lighting"
                  className="w-full"
                />
              </div>
            </BorderRotate>
          </div>

          {/* Right: copy — 1/3 */}
          <div className="flex flex-col justify-center lg:w-1/4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="space-y-6"
            >
              <h2 className="font-display text-3xl font-semibold italic text-brand-cream lg:text-4xl">
                This is your home with{" "}
                <span className="text-brand-gold"><GlowText>Glows.</GlowText></span>
              </h2>

              <p className="text-sm leading-relaxed text-brand-cream/50">
                Permanent architectural lighting — installed once, controlled from your phone, built to last. No ladders. No storage bins. No seasonal takedown.
              </p>

              <div className="space-y-3 border-t border-white/10 pt-6">
                <Button asChild size="lg" className="w-full">
                  <a href="/quote">
                    Get a free quote
                    <ArrowRight className="ml-2 size-4" />
                  </a>
                </Button>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={reset}>
                    Try another home
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setFullScreen(true)}
                  >
                    <Maximize2 className="size-4" />
                    Full screen
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
