import Link from "next/link";
import { site } from "@/lib/config";
import { Button } from "@/components/ui/button";

/**
 * C6 — The recurring cost.
 *
 * Rewritten off the ladder-and-tangled-strands version. That narrative
 * assumes the homeowner does the work themselves, which is the wrong
 * assumption for this audience — they already hire it out. The pain isn't
 * labor, it's paying every year for a result they don't control and never
 * own.
 *
 * Which makes it arithmetic. Five seasons of hired seasonal install is the
 * permanent system, and the permanent system doesn't end.
 *
 * The math strip is deliberately not a calculator. A number the visitor can
 * adjust invites them to argue with it; a stated comparison they can check
 * against their own invoice is harder to dismiss. The real numbers belong in
 * the measure, not on the homepage.
 */

const COMPARISON = [
  {
    label: "Hired every season",
    lines: [
      "A new crew most years, working from no plan",
      "Install and takedown billed separately",
      "Clips and strands replaced at your cost",
      "Two scheduling windows a year, in weather",
      "Nothing owned at the end of it",
    ],
  },
  {
    label: "Installed once",
    lines: [
      "One crew, one design, measured to your roofline",
      "One number, quoted by the linear foot",
      "Engineered track rated for years of service",
      "One day, once",
      "A system that stays with the house",
    ],
  },
];

export function RecurringCost() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="eyebrow">The arithmetic</p>
          <h2 className="mt-4 text-foreground">
            You&rsquo;re already paying for this every year.
          </h2>
          <p className="mt-5 text-base text-muted-foreground lg:text-lg">
            Most homes on our street pay someone to hang lights in November and
            pay again to take them down in January. Do that five times and
            you&rsquo;ve spent what a permanent system costs — except at the end
            of it you own a bin of strands instead of a system.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:mt-16">
          {COMPARISON.map((column, i) => (
            <div
              key={column.label}
              className={
                i === 0
                  ? "bg-muted/40 px-7 py-8 lg:px-9 lg:py-10"
                  : "bg-card px-7 py-8 lg:px-9 lg:py-10"
              }
            >
              <p
                className={
                  i === 0
                    ? "font-display text-sm font-semibold tracking-wide text-muted-foreground"
                    : "font-display text-sm font-semibold tracking-wide text-accent"
                }
              >
                {column.label}
              </p>
              <ul className="mt-6 space-y-4">
                {column.lines.map((line) => (
                  <li
                    key={line}
                    className={
                      i === 0
                        ? "border-b border-border/60 pb-4 text-sm leading-relaxed text-muted-foreground last:border-0 last:pb-0"
                        : "border-b border-border/60 pb-4 text-sm leading-relaxed text-foreground last:border-0 last:pb-0"
                    }
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Button asChild size="lg">
            <Link href={site.ctaHref}>{site.cta}</Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            Bring last year&rsquo;s invoice. We&rsquo;ll do the comparison with
            your actual numbers.
          </p>
        </div>
      </div>
    </section>
  );
}
