import {
  glowsTestimonials,
  hasOwnReviews,
  sourceLabel,
  systemStats,
  systemTestimonials,
} from "@/lib/config";

/**
 * C10 — Proof.
 *
 * Two tiers, one component.
 *
 *   systemTestimonials — manufacturer customers, used under dealer
 *     authorization. Proves the hardware works and that it works across
 *     five markets, which is more than any single dealer can claim.
 *
 *   glowsTestimonials  — our own installs. Empty until Hamilton County
 *     jobs close. The second block simply doesn't render until then.
 *
 * Every quote carries a source label. That's the only thing separating
 * "here's proof the system works" from "here's proof we work" — and once
 * our own reviews land, the contrast does real selling on its own.
 *
 * To render everything unlabeled, delete the <cite> line. One place.
 */
export function Proof() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="eyebrow">Proof</p>
          <h2 className="mt-4 text-foreground">
            Installed on thousands of homes.
          </h2>
        </div>

        {/* ---------- manufacturer stats ---------- */}
        <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
          {systemStats.map((stat) => (
            <div key={stat.label} className="bg-card px-7 py-8">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="tabular font-display block text-3xl font-semibold text-foreground lg:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-2 block text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        {/* ---------- system reviews ---------- */}
        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {systemTestimonials.map((t) => (
            <li
              key={t.author}
              className="flex flex-col rounded-xl border border-border bg-card px-7 py-7"
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
                  className="flex flex-col rounded-xl border border-accent/30 bg-card px-7 py-7"
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
