import Link from "next/link";
import { solutions } from "@/lib/config";
import { CarouselStacked } from "@/components/ui/carousel-stacked";

const slides = [
  ...solutions.map((s) => ({
    image: s.scene.src,
    alt: s.scene.alt,
    title: s.name,
    description: s.blurb,
    badge: s.short,
    href: `/solutions/${s.slug}`,
  })),
  {
    image: "/carousel-music.mp4",
    alt: "Music sync lighting",
    title: "Music sync",
    description: "Your lights pulse with the beat. Party mode, game day, or just the right song at the right moment.",
    badge: "Music",
  },
];

/**
 * C3 — Solutions carousel.
 *
 * Replaced static grid with a stacked drag-carousel so each scene gets
 * full visual weight. The same six solutions, now with depth and motion.
 */
export function SolutionsGrid() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-foreground">
            Living life well-lit is a family experience.
          </h2>
          <p className="mt-5 text-base text-muted-foreground lg:text-lg">
            The track goes up once. What it does after that is a setting for memories.
          </p>
        </div>

        <div className="mt-16 lg:mt-20">
          <CarouselStacked slides={slides} />
        </div>

        {/* Solution link strip below carousel */}
        <ul className="mt-16 flex flex-wrap justify-center gap-3">
          {solutions.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/solutions/${s.slug}`}
                className="inline-flex items-center rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                {s.short}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
