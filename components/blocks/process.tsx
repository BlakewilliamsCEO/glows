import Link from "next/link";
import { Ruler, PenLine, Zap } from "lucide-react";
import { site } from "@/lib/config";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    n: "01",
    icon: Ruler,
    title: "Free measure",
    body: "We come out, walk the property, and measure the roofline. You get a fixed number, not a range — pricing is by the linear foot, so there's nothing to guess at.",
  },
  {
    n: "02",
    icon: PenLine,
    title: "Design",
    body: "We map the runs, the zones, and where the track disappears into your trim. You see the plan before anyone gets on a ladder.",
  },
  {
    n: "03",
    icon: Zap,
    title: "Install",
    body: "One day, one crew. We set up the app with you before we leave, and the ladder goes back on our truck for good.",
  },
];

export function Process() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-4 text-foreground">Three steps, then never again.</h2>
          <p className="mt-5 text-base text-muted-foreground lg:text-lg">
            The measure is free. The install takes one day. After that, it runs itself.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:mt-16">
          {STEPS.map(({ n, icon: Icon, title, body }) => (
            <div
              key={n}
              className="card-hover relative flex flex-col rounded-2xl border border-border bg-card p-8"
            >
              {/* Step number — large background numeral */}
              <span className="font-display absolute right-6 top-5 text-6xl font-bold text-accent/10 select-none">
                {n}
              </span>

              {/* Icon */}
              <span className="flex size-12 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
                <Icon className="size-5 text-accent" aria-hidden />
              </span>

              <h3 className="mt-6 text-foreground">{title}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button asChild size="lg">
            <Link href={site.ctaHref}>{site.cta}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
