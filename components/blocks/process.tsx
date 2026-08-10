import Link from "next/link";
import { site } from "@/lib/config";
import { Button } from "@/components/ui/button";

export function Process() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-foreground">Three steps, then never again.</h2>
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
