import { primarySystem } from "@/lib/config";

/**
 * C7 — Spec block.
 *
 * The hardware, deliberately placed low. Consumers buy the night, not the
 * track — but somewhere before the form they want proof that what's going
 * on the house is real equipment. This is that proof and nothing more.
 *
 * Renders entirely from `primarySystem`. The manufacturer name appears here
 * and nowhere else on the page. Adding a second line means adding an array
 * entry and mapping this section, not restructuring the site.
 */
export function SpecBlock() {
  const system = primarySystem;

  return (
    <section className="dark bg-[#141C2F] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="eyebrow">The hardware</p>
          <h2 className="mt-4 text-brand-cream">
            What actually goes on the house.
          </h2>
          <p className="mt-5 text-base text-brand-cream/70 lg:text-lg">
            We install {system.brand} — an engineered track system, not a
            strand of lights stapled to a fascia board.
          </p>
        </div>

        <dl className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {system.specs.map((spec) => (
            <div key={spec.label} className="bg-[#141C2F] px-6 py-7">
              <dt className="text-xs tracking-[0.14em] text-brand-cream/40 uppercase">
                {spec.label}
              </dt>
              <dd className="tabular font-display mt-2.5 text-lg font-semibold text-brand-cream">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
