import Link from "next/link";
import { site } from "@/lib/config";
import { Button } from "@/components/ui/button";

/**
 * C8 — Process.
 *
 * Numbered here, unlike C6, because this genuinely is a sequence: the
 * measure has to happen before the design, and the design before the
 * install. The numbers carry information the reader needs.
 *
 * Three steps, not five. Every step listed is a step the customer has to
 * imagine themselves getting through, so padding this out costs conversions.
 */

const STEPS: { n: string; title: string; body: string; note?: boolean }[] = [
  {
    n: "01",
    title: "Free measure",
    body: "We come out, walk the property, and measure the roofline. You get a fixed number, not a range — pricing is by the linear foot, so there's nothing to guess at.",
    note: true,
  },
  {
    n: "02",
    title: "Design",
    body: "We map the runs, the zones, and where the track disappears into your trim. You see the plan before anyone gets on a ladder.",
  },
  {
    n: "03",
    title: "Install",
    body: "One day, one crew. We set up the app with you before we leave, and the ladder goes back on our truck for good.",
  },
];

export function Process() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-4 text-foreground">Three steps, then never again.</h2>
        </div>

        <ol className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8 lg:mt-16">
          {STEPS.map((step) => (
            <li key={step.n} className="border-t border-border pt-6">
              <span className="tabular font-display text-sm font-semibold text-accent">
                {step.n}
              </span>
              <h3 className="mt-3 text-foreground">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
              {step.note && (
                <p className="mt-3 text-sm text-muted-foreground/70">
                  {site.qualifier}.
                </p>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <Button asChild size="lg">
            <Link href={site.ctaHref}>{site.cta}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
