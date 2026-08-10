import Link from "next/link";
import { solutions } from "@/lib/config";
import { CarouselStacked } from "@/components/ui/carousel-stacked";

const slides = solutions.map((s) => ({
  image: s.scene.src,
  alt: s.scene.alt,
  title: s.name,
  description: s.blurb,
  badge: s.short,
  href: `/solutions/${s.slug}`,
}));

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
          <p className="eyebrow">What you&rsquo;re buying</p>
          <h2 className="mt-4 text-foreground">
            One system. Every reason you&rsquo;d want it.
          </h2>
          <p className="mt-5 text-base text-muted-foreground lg:text-lg">
            The track goes up once. What it does after that is a setting, not
            another install.
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
