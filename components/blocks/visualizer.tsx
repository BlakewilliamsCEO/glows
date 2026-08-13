"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Upload, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowText } from "@/components/ui/glow-text";

type Step = "address" | "preview" | "rendering" | "result";

const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

export function Visualizer() {
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState("");
  const [streetViewUrl, setStreetViewUrl] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [renderedImage, setRenderedImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Google Places Autocomplete
  useEffect(() => {
    if (!GOOGLE_KEY) return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => {
      if (!inputRef.current) return;
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        componentRestrictions: { country: "us" },
      });
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          setAddress(place.formatted_address);
          handleAddressSelect(place);
        }
      });
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
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
        body: JSON.stringify({
          image: imageSource,
          address,
        }),
      });

      if (!res.ok) {
        throw new Error("Render failed");
      }

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
  };

  return (
    <div className="mx-auto max-w-3xl px-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-brand-cream">
          See your home{" "}
          <span className="text-brand-gold"><GlowText>lit.</GlowText></span>
        </h1>
        <p className="mt-4 text-base text-brand-cream/60 lg:text-lg">
          Enter your address or upload a photo. We&rsquo;ll show you what permanent lighting looks like on your home — free, instant.
        </p>
      </div>

      {/* Step: Address input */}
      {step === "address" && (
        <div className="mt-12 space-y-6">
          {/* Address search */}
          <div>
            <label className="mb-2 block text-sm font-medium text-brand-cream/50">
              Search your address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-cream/30" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Start typing your address…"
                className="h-12 w-full rounded-lg border border-white/15 bg-white/[0.04] pl-10 pr-4 text-sm text-brand-cream placeholder:text-brand-cream/30 outline-none transition-colors focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/25"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-brand-cream/30 uppercase tracking-widest">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Upload */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-dashed border-white/15 bg-white/[0.02] px-6 py-8 text-brand-cream/50 transition-colors hover:border-brand-gold/40 hover:text-brand-cream/70"
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
      )}

      {/* Step: Preview */}
      {step === "preview" && (
        <div className="mt-12 space-y-6">
          <div className="overflow-hidden rounded-xl border border-white/10">
            <img
              src={uploadedImage || streetViewUrl}
              alt="Your home"
              className="w-full"
            />
          </div>

          {address && (
            <p className="text-center text-sm text-brand-cream/50">{address}</p>
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

      {/* Step: Rendering */}
      {step === "rendering" && (
        <div className="mt-24 flex flex-col items-center gap-4 text-center">
          <Loader2 className="size-8 animate-spin text-brand-gold" />
          <p className="text-brand-cream/70">
            AI is rendering your home with lights — this takes about 30 seconds…
          </p>
        </div>
      )}

      {/* Step: Result */}
      {step === "result" && renderedImage && (
        <div className="mt-12 space-y-6">
          <div className="overflow-hidden rounded-xl border border-brand-gold/30">
            <img
              src={renderedImage}
              alt="Your home with permanent lighting"
              className="w-full"
            />
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold text-brand-cream">
              This is your home with Glows.
            </p>
            <p className="mt-1 text-sm text-brand-cream/50">
              Ready to make it real? Get a free measure and quote.
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={reset}>
              Try another
            </Button>
            <Button asChild size="lg">
              <a href="/quote">
                Get my quote
                <ArrowRight className="ml-2 size-4" />
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
