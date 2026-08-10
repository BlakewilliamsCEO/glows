import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cities, site } from "@/lib/config";

/**
 * C9 — Service area.
 *
 * Two jobs: reassure a local visitor that we actually cover them, and give
 * the homepage a real internal link into every /[city] route. Both matter,
 * and the second one is why this can't be a paragraph of city names.
 *
 * The map is a stylised constellation, not cartography — cities rendered as
 * points of light, which is the one place the brand metaphor earns itself.
 * Coordinates are eyeballed for relative position within the metro; this is
 * a diagram, not a geographic claim.
 *
 * Server component. No state, no client JS.
 */

const POINTS: Record<string, { x: number; y: number }> = {
  "sheridan-in": { x: 108, y: 58 },
  "westfield-in": { x: 198, y: 112 },
  "noblesville-in": { x: 302, y: 104 },
  "carmel-in": { x: 204, y: 186 },
  "fishers-in": { x: 312, y: 192 },
  "zionsville-in": { x: 104, y: 196 },
  "indianapolis-in": { x: 214, y: 286 },
};

export function ServiceArea() {
  const counties = [...new Set(cities.map((c) => c.county))];

  return (
    <section className="dark bg-[#141C2F] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          {/* ---------- copy + map ---------- */}
          <div className="lg:col-span-5">
            <h2 className="mt-4 text-brand-cream">We work where we live.</h2>
            <p className="mt-5 text-base text-brand-cream/70 lg:text-lg">
              We install across {new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(counties)}. If you&rsquo;re just
              outside the line, call anyway — we schedule around the map more
              often than not.
            </p>

            <svg
              viewBox="0 0 400 340"
              className="mt-10 w-full max-w-sm"
              role="img"
              aria-label={`Stylised map showing ${cities.length} cities we serve across the Indianapolis metro`}
            >
              {cities.map((city) => {
                const p = POINTS[city.slug];
                if (!p) return null;
                return (
                  <g key={city.slug}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="22"
                      fill="#E7B969"
                      opacity="0.08"
                    />
                    <circle cx={p.x} cy={p.y} r="4.5" fill="#E7B969" />
                    <text
                      x={p.x + 14}
                      y={p.y + 4}
                      fill="#FFFFFF"
                      fillOpacity="0.75"
                      fontSize="13"
                      fontWeight="500"
                    >
                      {city.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* ---------- city links ---------- */}
          <div className="lg:col-span-7">
            <ul className="border-t border-white/10">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/${city.slug}`}
                    className="group flex items-center justify-between gap-6 border-b border-white/10 py-5 outline-none focus-visible:bg-white/[0.03]"
                  >
                    <span className="font-display text-[2.85rem] font-semibold leading-none text-brand-cream transition-colors group-hover:text-brand-gold sm:text-[3.5625rem] lg:text-[4.275rem]">
                      {city.name}
                    </span>
                    <ArrowUpRight
                      className="size-5 shrink-0 text-brand-cream/30 transition-colors group-hover:text-brand-gold"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
