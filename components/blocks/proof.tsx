import {
  glowsTestimonials,
  hasOwnReviews,
  sourceLabel,
  systemTestimonials,
} from "@/lib/config";

export function Proof() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">Proof</p>
          <h2 className="mt-4 text-foreground">
            Installed on thousands of homes.
          </h2>
        </div>

        {/* ---------- system reviews ---------- */}
        <ul className="reveal mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {systemTestimonials.map((t) => (
            <li
              key={t.author}
              className="card-hover flex flex-col rounded-xl border border-border bg-card px-7 py-7"
            >
              <blockquote className="flex-1 text-base leading-relaxed text-foreground">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <footer className="mt-6 border-t border-border pt-4">
                <p className="font-display text-sm font-semibold text-foreground">
                  {t.author}
                </p>
                <cite className="mt-0.5 block text-xs not-italic text-muted-foreground">
                  {sourceLabel(t)}
                </cite>
              </footer>
            </li>
          ))}
        </ul>

        {/* ---------- our installs ---------- */}
        {hasOwnReviews && (
          <div className="mt-20">
            <h3 className="text-foreground">From our own installs</h3>
            <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {glowsTestimonials.map((t) => (
                <li
                  key={t.author}
                  className="card-hover flex flex-col rounded-xl border border-accent/30 bg-card px-7 py-7"
                >
                  <blockquote className="flex-1 text-base leading-relaxed text-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <footer className="mt-6 border-t border-border pt-4">
                    <p className="font-display text-sm font-semibold text-foreground">
                      {t.author}
                    </p>
                    <cite className="mt-0.5 block text-xs not-italic text-accent">
                      {sourceLabel(t)}
                    </cite>
                  </footer>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
