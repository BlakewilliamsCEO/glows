"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

export default function VisualizerTest() {
  const [address, setAddress] = useState("");
  const [streetViewUrl, setStreetViewUrl] = useState("");
  const [v1Image, setV1Image] = useState<string | null>(null);
  const [v2Image, setV2Image] = useState<string | null>(null);
  const [v1Loading, setV1Loading] = useState(false);
  const [v2Loading, setV2Loading] = useState(false);
  const [v1Error, setV1Error] = useState("");
  const [v2Error, setV2Error] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

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
        if (place?.formatted_address && place.geometry?.location) {
          setAddress(place.formatted_address);
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setStreetViewUrl(
            `https://maps.googleapis.com/maps/api/streetview?size=800x600&location=${lat},${lng}&fov=90&pitch=10&key=${GOOGLE_KEY}`
          );
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
  }, []);

  const runBoth = useCallback(async () => {
    if (!streetViewUrl) return;

    setV1Image(null);
    setV2Image(null);
    setV1Loading(true);
    setV2Loading(true);
    setV1Error("");
    setV2Error("");

    const payload = { image: streetViewUrl, address };

    // Fire both in parallel
    fetch("/api/visualizer/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setV1Image(d.imageUrl);
        else setV1Error("V1 render failed");
      })
      .catch(() => setV1Error("V1 render failed"))
      .finally(() => setV1Loading(false));

    fetch("/api/visualizer/render-v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setV2Image(d.imageUrl);
        else setV2Error("V2 render failed");
      })
      .catch(() => setV2Error("V2 render failed"))
      .finally(() => setV2Loading(false));
  }, [streetViewUrl, address]);

  return (
    <div className="dark min-h-screen bg-[#141C2F] p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold text-white mb-2">Render Comparison</h1>
        <p className="text-sm text-white/50 mb-8">Same house, two prompts side by side.</p>

        {/* Address input */}
        <div className="max-w-md mb-8">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/30" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter an address..."
              className="h-12 w-full rounded-lg border border-white/15 bg-white/[0.04] pl-11 pr-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Street View preview + fire button */}
        {streetViewUrl && (
          <div className="mb-8 space-y-4">
            <div className="max-w-md overflow-hidden rounded-lg border border-white/10">
              <img src={streetViewUrl} alt="Street View" className="w-full" />
            </div>
            <p className="text-sm text-white/40">{address}</p>
            <Button onClick={runBoth} size="lg" disabled={v1Loading || v2Loading}>
              {v1Loading || v2Loading ? "Rendering..." : "Run both prompts"}
            </Button>
          </div>
        )}

        {/* Side by side results */}
        {(v1Loading || v2Loading || v1Image || v2Image) && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* V1 */}
            <div>
              <h2 className="text-sm font-medium text-white/60 mb-3">V1 — Current Production Prompt</h2>
              <div className="overflow-hidden rounded-xl border border-white/10 aspect-[3/2] bg-white/[0.02] flex items-center justify-center">
                {v1Loading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-6 animate-spin text-amber-500" />
                    <span className="text-xs text-white/40">Rendering V1...</span>
                  </div>
                ) : v1Error ? (
                  <span className="text-sm text-red-400">{v1Error}</span>
                ) : v1Image ? (
                  <img src={v1Image} alt="V1 render" className="w-full h-full object-cover" />
                ) : null}
              </div>
            </div>

            {/* V2 */}
            <div>
              <h2 className="text-sm font-medium text-white/60 mb-3">V2 — Editorial Photography Prompt</h2>
              <div className="overflow-hidden rounded-xl border border-white/10 aspect-[3/2] bg-white/[0.02] flex items-center justify-center">
                {v2Loading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-6 animate-spin text-amber-500" />
                    <span className="text-xs text-white/40">Rendering V2...</span>
                  </div>
                ) : v2Error ? (
                  <span className="text-sm text-red-400">{v2Error}</span>
                ) : v2Image ? (
                  <img src={v2Image} alt="V2 render" className="w-full h-full object-cover" />
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
