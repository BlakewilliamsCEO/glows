/**
 * Lead capture boundary.
 *
 * Everything the quote form knows about the outside world lives here, so
 * swapping the destination (Resend → HubSpot → whatever) is one file.
 *
 * Two things the payload carries that a plain contact form doesn't:
 *
 *   1. ATTRIBUTION — fbclid / gclid / utm_* captured at page load and
 *      persisted. Without the click ID you cannot send a conversion back
 *      to Meta or Google, which means no offline conversion import and no
 *      lookalike seeding off closed jobs. This is the difference between
 *      retargeting that works and a pixel that only sees pageviews.
 *
 *   2. ENRICHMENT KEYS — street + zip is the join key for property data
 *      (county assessor, ATTOM, Estated). Email + phone are the join keys
 *      for ad-platform customer match. Capture all four or the enrichment
 *      step has nothing to work with.
 */

export type QuotePayload = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  zip: string;
  homeValue: string;
  interests: string[];
  timeline: string;
  hearAbout: string;
  notes: string;
  coverage: string;
  stories: string;
  structures: string;
  gables: string;
  garage: string;
  smsConsent: boolean;
  attribution: Attribution;
  // Facebook cookie values captured client-side at form submit
  fbc?: string;
  fbp?: string;
  // Shared with Meta Pixel for CAPI deduplication
  eventId?: string;
};

export type Attribution = {
  fbclid?: string;
  fbc?: string;
  fbp?: string;
  gclid?: string;
  ttclid?: string;
  msclkid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landingPath?: string;
  referrer?: string;
};

const ATTRIBUTION_KEYS = [
  "fbclid",
  "gclid",
  "ttclid",
  "msclkid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const STORAGE_KEY = "glows_attr";

/** Read a single cookie by name. */
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/** Cryptographically random event ID for Meta CAPI deduplication. */
export function generateEventId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Read click IDs from the URL, merge over anything already stored, persist.
 *
 * Also reads _fbc / _fbp cookies which Facebook Pixel sets automatically.
 * These are required for Conversions API matching — without them Meta can
 * only match on email/phone hashes, which degrades match rate significantly.
 *
 * Merge order: first touch wins for utm_*, but a fresh click ID always
 * overwrites, because Meta matches on the most recent click.
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  let stored: Attribution = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    stored = {};
  }

  const params = new URLSearchParams(window.location.search);
  const fresh: Attribution = {};

  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key);
    if (value) fresh[key] = value;
  }

  const merged: Attribution = {
    ...stored,
    ...fresh,
    // Facebook browser cookies — always read fresh, they may be updated by Pixel
    fbc: getCookie("_fbc") ?? stored.fbc,
    fbp: getCookie("_fbp") ?? stored.fbp,
    landingPath: stored.landingPath ?? window.location.pathname,
    referrer: stored.referrer ?? document.referrer ?? undefined,
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    /* private mode — attribution degrades, form still works */
  }

  return merged;
}

/**
 * Partial capture. Fires once the visitor has given us a reachable
 * identifier, before they finish the form. Roughly half of form starts
 * never submit; without this those people are unreachable.
 */
export async function capturePartial(partial: {
  email?: string;
  phone?: string;
  attribution: Attribution;
}): Promise<void> {
  try {
    await fetch("/api/quote/partial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...partial,
        fbc: getCookie("_fbc"),
        fbp: getCookie("_fbp"),
      }),
      keepalive: true,
    });
  } catch {
    /* non-blocking by design — never let this break the form */
  }
}

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitQuote(
  payload: QuotePayload,
): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return { ok: false, error: "Something went wrong. Try again or call us." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Couldn't reach the server. Try again or call us." };
  }
}

/* ------------------------------------------------------------------ */
/* Form options                                                        */
/* ------------------------------------------------------------------ */

export const HOME_VALUES = [
  { value: "under-500", label: "Under $500,000", qualified: false },
  { value: "500-750", label: "$500,000 – $750,000", qualified: true },
  { value: "750-1m", label: "$750,000 – $1,000,000", qualified: true },
  { value: "1m-1.5m", label: "$1,000,000 – $1,500,000", qualified: true },
  { value: "over-1.5m", label: "Over $1,500,000", qualified: true },
] as const;

export const TIMELINES = [
  { value: "asap", label: "As soon as possible" },
  { value: "30-days", label: "Within 30 days" },
  { value: "before-holidays", label: "Before the holidays" },
  { value: "next-season", label: "Next season" },
  { value: "researching", label: "Just researching" },
] as const;

export const HEAR_ABOUT = [
  { value: "google", label: "Google" },
  { value: "facebook", label: "Facebook or Instagram" },
  { value: "neighbor", label: "Saw a neighbor's install" },
  { value: "referral", label: "Referred by someone" },
  { value: "mailer", label: "Got a personalized mailer" },
  { value: "yard-sign", label: "Yard sign or truck" },
  { value: "other", label: "Other" },
] as const;

export const isQualified = (homeValue: string) =>
  HOME_VALUES.find((v) => v.value === homeValue)?.qualified ?? true;
