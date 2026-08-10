/**
 * C7 — Blue Collar Elevated.
 *
 * Two-row infinite photo marquee at a slight diagonal.
 * Top row scrolls right, bottom row scrolls left.
 * Replace the image paths below with real job-site photos.
 */

// ── Drop real job photos here ───────────────────────────────────────────────
const ROW_ONE = [
  { src: "/truck.png",              alt: "Glows. service truck" },
  { src: "/app/presets.webp",      alt: "Bosso app presets" },
  { src: "/app/controls.webp",     alt: "Bosso app controls" },
  { src: "/app/colors.webp",       alt: "Bosso app colors" },
  { src: "/app/schedule.webp",     alt: "Bosso app schedule" },
  { src: "/app/premium.webp",      alt: "Bosso app premium" },
  { src: "/app/dashboard.webp",    alt: "Bosso app dashboard" },
];

const ROW_TWO = [
  { src: "/app/settings.webp",     alt: "Bosso app settings" },
  { src: "/app/subscription.webp", alt: "Bosso app subscription" },
  { src: "/app/colors.webp",       alt: "Bosso app colors" },
  { src: "/truck.png",             alt: "Glows. service truck" },
  { src: "/app/controls.webp",     alt: "Bosso app controls" },
  { src: "/app/presets.webp",      alt: "Bosso app presets" },
  { src: "/app/premium.webp",      alt: "Bosso app premium" },
];
// ────────────────────────────────────────────────────────────────────────────

function MarqueeRow({
  items,
  direction,
  speed = 40,
}: {
  items: { src: string; alt: string }[];
  direction: "left" | "right";
  speed?: number;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <div
        className="flex gap-4"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
          width: "max-content",
        }}
      >
        {doubled.map((img, i) => (
          <div
            key={i}
            className="h-52 w-72 shrink-0 overflow-hidden rounded-2xl lg:h-60 lg:w-80"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="size-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SpecBlock() {
  return (
    <section className="bg-background py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="eyebrow">The crew</p>
          <h2 className="mt-4 text-foreground">
            Blue collar, elevated.
          </h2>
          <p className="mt-5 text-base text-muted-foreground lg:text-lg">
            We show up in a wrapped truck, work clean, and leave the job site the way we found it. The only thing that changes is the house at night.
          </p>
        </div>
      </div>

      {/* Angled marquee strip */}
      <div
        className="mt-14 space-y-4 lg:mt-16"
        style={{ transform: "rotate(-3deg)", transformOrigin: "center" }}
      >
        <MarqueeRow items={ROW_ONE} direction="right" speed={35} />
        <MarqueeRow items={ROW_TWO} direction="left"  speed={40} />
      </div>
    </section>
  );
}
