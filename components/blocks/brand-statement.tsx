import Image from "next/image";
import { Clock, Shield, Award, Leaf } from "lucide-react";
import { BorderRotate } from "@/components/ui/animated-gradient-border";

const PROOF_POINTS = [
  {
    icon: Clock,
    title: "Quoted in a day",
    body: "Send photos or have us walk the property — either way you get a real number within one business day, not a range and a follow-up call. Free on every job, no deposit to get one.",
  },
  {
    icon: Shield,
    title: "Fully insured",
    body: "Covered up to $1MM per occurrence and $2MM aggregate, plus full workers\u2019 comp. We\u2019re on ladders against your house. That\u2019s not the place to find out someone cut a corner.",
  },
  {
    icon: Award,
    title: "Built to outlast the trend",
    body: "Commercial-grade track and diodes, multi-year warranty on parts and labor. If a section goes dark, you call us and we come out. You\u2019re not filing a claim with a manufacturer in another state.",
  },
  {
    icon: Leaf,
    title: "We leave no trace",
    body: "Track is color-matched to your fascia and mounted to disappear. We clean up every clip, every offcut, every footprint in the mulch. The only thing that should look different when we leave is the house at night.",
  },
];

export function BrandStatement() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">

        {/* ---------- top split ---------- */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* image */}
          <BorderRotate
            animationSpeed={6}
            borderWidth={3}
            borderRadius={16}
            backgroundColor="#F1EDE8"
            gradientColors={{
              primary: "#584827",
              secondary: "#E7B969",
              accent: "#f9de90",
            }}
            className="w-full"
          >
            <div className="relative aspect-square overflow-hidden rounded-[13px] lg:aspect-[4/3]">
              <Image
                src="/truck.png"
                alt="Glows. permanent lighting service truck"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center"
                priority
              />
            </div>
          </BorderRotate>

          {/* copy */}
          <div>
            <p className="eyebrow">Who we are</p>
            <h2 className="mt-4 text-foreground">
              Make your vision, reality.
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground lg:text-lg">
              <p>
                Glow&rsquo;s was built on one idea: the light on your house should look like it was part of the plan. Not something you drag out of the garage after Thanksgiving and take down in January. Not two bulbs by the door doing the bare minimum.
              </p>
              <p>
                We install permanent architectural lighting &mdash; fit to your rooflines, invisible in daylight, and run from your phone. Warm white every night of the year, any color you want on the nights that call for it. And since we&rsquo;re on your fascia with a drill, we treat the house like we&rsquo;ll be driving past it for the next ten years. Because we will.
              </p>
            </div>

          </div>
        </div>

        {/* ---------- proof points ---------- */}
        <div className="mt-20 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:mt-24">
          {PROOF_POINTS.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <Icon className="size-6 text-accent" aria-hidden />
              <h3 className="mt-4 text-foreground">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-border" />

      </div>
    </section>
  );
}
