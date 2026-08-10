import Link from "next/link";
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

        <div className="mt-12 flex justify-center">
          <Button asChild size="lg">
            <Link href={site.ctaHref}>{site.cta}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
