import Link from "next/link";
import { Mail, MessageSquareText, Phone } from "lucide-react";
import { cities, primarySystem, site, solutions } from "@/lib/config";

/**
 * C13 — Footer.
 *
 * Also the site's crawl surface: every /solutions/[slug] and /[city] route
 * is linked from every page, which is how the matrix gets discovered without
 * relying on the homepage alone.
 *
 * The dealer line sits in the legal bar on purpose. It's the equivalent of
 * the sign over the door — it establishes the relationship site-wide, once,
 * so nothing above it has to keep explaining itself.
 *
 * Server component.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="dark bg-[#0E1424] pt-20 pb-10 lg:pt-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* ---------- sign-off ---------- */}
        <p className="font-display max-w-3xl text-3xl leading-[1.1] font-semibold text-brand-cream sm:text-4xl lg:text-5xl">
          Light it once.
          <span className="block text-brand-gold">Leave it up forever.</span>
        </p>

        {/* ---------- columns ---------- */}
        <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 border-t border-white/10 pt-12 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <p className="font-display text-lg font-semibold text-brand-cream">
              Glow&rsquo;s<span className="text-brand-gold">.</span>
            </p>
            <p className="mt-3 text-sm text-brand-cream/50">
              {site.serviceArea}
            </p>

            <ul className="mt-6 space-y-3">
              <li>
                <a
                  href={site.phoneHref}
                  className="tabular flex items-center gap-2.5 text-sm text-brand-cream/80 transition-colors hover:text-brand-gold"
                >
                  <Phone className="size-4 shrink-0" aria-hidden />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={site.smsHref}
                  className="flex items-center gap-2.5 text-sm text-brand-cream/80 transition-colors hover:text-brand-gold"
                >
                  <MessageSquareText className="size-4 shrink-0" aria-hidden />
                  Text us
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-2.5 text-sm text-brand-cream/80 transition-colors hover:text-brand-gold"
                >
                  <Mail className="size-4 shrink-0" aria-hidden />
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          <FooterColumn
            title="Solutions"
            links={solutions.map((s) => ({
              label: s.name,
              href: `/solutions/${s.slug}`,
            }))}
          />

          <FooterColumn
            title="Service area"
            links={cities.map((c) => ({
              label: c.name,
              href: `/${c.slug}`,
            }))}
          />

          <FooterColumn
            title="Company"
            links={[
              { label: "About", href: "/about" },
              { label: "Gallery", href: "/gallery" },
              { label: "Book free measure", href: site.ctaHref },
            ]}
          />
        </div>

        {/* ---------- legal ---------- */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-brand-cream/40">
            &copy; {year} {site.name}. Authorized {primarySystem.brand} dealer.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-xs text-brand-cream/40 transition-colors hover:text-brand-cream/70"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-brand-cream/40 transition-colors hover:text-brand-cream/70"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-xs tracking-[0.18em] text-brand-cream/40 uppercase">
        {title}
      </p>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-brand-cream/70 transition-colors hover:text-brand-gold"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
