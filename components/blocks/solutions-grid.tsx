import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { solutions } from "@/lib/config";

/**
 * C3 — Solutions grid.
 *
 * The hero switcher shows four scenes; this section completes the set
 * (landscape, commercial) and is the routing layer into /solutions/[slug].
 *
 * Deliberately quiet. The hero is the signature element — this is a
 * disciplined grid that gets out of its way. Server component: no state,
 * no client JS.
 *
 * Cream background on purpose. The night photography carries more weight
 * against light than it does stacked under another dark section.
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

        <ul className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {solutions.map((solution) => (
            <li key={solution.slug}>
              <Link
                href={`/solutions/${solution.slug}`}
                className="group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={solution.scene.src}
                    alt={solution.scene.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                <div className="mt-5 flex items-start justify-between gap-4">
                  <h3 className="font-display text-lg font-semibold text-foreground lg:text-xl">
                    {solution.name}
                  </h3>
                  <ArrowUpRight
                    className="mt-1 size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-accent"
                    aria-hidden
                  />
                </div>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {solution.blurb}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
