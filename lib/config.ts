/**
 * Single source of truth for Glow's.
 *
 * TWO routed axes — both ours, both survive a manufacturer change:
 *   solutions — what the customer is actually buying. /solutions/[solution]
 *   cities    — where we install.                     /[city]
 *
 * Manufacturer lines are NOT an axis. Consumers don't shop for a brand of
 * track; they shop for the night they want. `systems` stays here as a data
 * lookup only — it feeds the spec block (C7) and nothing else. It has no
 * route, no nav entry, and no presence above the fold.
 */

export const site = {
  name: "Glow's Lighting Services",
  tagline: "Permanent outdoor lighting, installed once.",
  phone: "(317) 555-0100", // TODO: real tracking number, not a cell
  phoneHref: "tel:+13175550100",
  /* Prefilled SMS — outconverts a form on mobile, which is most of the traffic. */
  smsHref:
    "sms:+13175550100?&body=" +
    encodeURIComponent(
      "Hi — I'd like a quote on permanent lighting for my home.",
    ),
  email: "hello@glowslighting.com",
  cta: "Get a quote",
  ctaHref: "/quote",
  serviceArea: "Hamilton County & north Indianapolis",
  /**
   * Qualifier. Stated in exactly three places — the hero eyebrow, the
   * measure step, and the quote form. Exclusivity reads as a standard when
   * it's mentioned once and as a velvet rope when it's mentioned everywhere.
   */
  qualifier: "Homes from the $500s",
  /** Minimum home value we quote, in dollars. Drives the form's select. */
  minHomeValue: 500000,
} as const;

/* ------------------------------------------------------------------ */
/* SOLUTIONS — routed axis                                             */
/* ------------------------------------------------------------------ */

export type Solution = {
  slug: string;
  name: string;
  /** Tab label in the hero switcher. One word. */
  short: string;
  /** The night this buys you. Present tense, second person. */
  blurb: string;
  /** Hero scene switcher (C2). Exactly four. */
  hero: boolean;
  /** Same house, this program. Shot in one session, four takes. */
  scene: { src: string; alt: string };
};

export const solutions: Solution[] = [
  {
    slug: "accent-lighting",
    name: "Accent Lighting",
    short: "Accent",
    blurb:
      "Warm white on the peaks, columns, and gables. This is what the house looks like every ordinary Tuesday.",
    hero: true,
    scene: {
      src: "/scenes/accent.jpg",
      alt: "Home at night lit in warm white along the roofline and columns",
    },
  },
  {
    slug: "holiday-lighting",
    name: "Holiday Lighting",
    short: "Holiday",
    blurb:
      "Every holiday already programmed. Nothing to hang in November, nothing to pull down in January.",
    hero: true,
    scene: {
      src: "/scenes/holiday.jpg",
      alt: "The same home at night in red and green holiday colors",
    },
  },
  {
    slug: "security-lighting",
    name: "Security Lighting",
    short: "Security",
    blurb:
      "Cool white across the full property on a schedule, without floodlight glare into the bedrooms.",
    hero: true,
    scene: {
      src: "/scenes/security.jpg",
      alt: "The same home at night in bright cool white security lighting",
    },
  },
  {
    slug: "gameday-lighting",
    name: "Gameday Lighting",
    short: "Gameday",
    blurb:
      "Team colors on a schedule. Set it once in September and leave it until the season ends.",
    hero: true,
    scene: {
      src: "/scenes/gameday.jpg",
      alt: "The same home at night in alternating team colors",
    },
  },
  {
    slug: "landscape-lighting",
    name: "Landscape Lighting",
    short: "Landscape",
    blurb:
      "Uplighting on trees, beds, and pathways so the property reads past the front elevation.",
    hero: false,
    scene: {
      src: "/scenes/landscape.jpg",
      alt: "Mature trees and a walkway lit from below",
    },
  },
  {
    slug: "commercial-lighting",
    name: "Commercial Lighting",
    short: "Commercial",
    blurb:
      "Storefronts, offices, and HOA common areas lit for visibility and year-round curb appeal.",
    hero: false,
    scene: {
      src: "/scenes/commercial.jpg",
      alt: "A commercial storefront lit along the roofline at dusk",
    },
  },
];

export const heroSolutions = solutions.filter((s) => s.hero);

/* ------------------------------------------------------------------ */
/* CITIES — routed axis                                                */
/* ------------------------------------------------------------------ */

export type City = {
  slug: string;
  name: string;
  county: string;
  /** Rewrite after the first real install there. Generic here = doorway page. */
  blurb: string;
};

export const cities: City[] = [
  {
    slug: "carmel-in",
    name: "Carmel",
    county: "Hamilton County",
    blurb:
      "Brick and deep eaves. Carmel installs live or die on track color-matched to trim rather than bolted over it.",
  },
  {
    slug: "fishers-in",
    name: "Fishers",
    county: "Hamilton County",
    blurb:
      "Newer construction with steep pitches and long uninterrupted rooflines that light evenly.",
  },
  {
    slug: "westfield-in",
    name: "Westfield",
    county: "Hamilton County",
    blurb:
      "Wide lots and setback homes, where the front elevation carries the entire display.",
  },
  {
    slug: "noblesville-in",
    name: "Noblesville",
    county: "Hamilton County",
    blurb:
      "Historic downtown facades and new subdivisions need different mounting approaches.",
  },
  {
    slug: "zionsville-in",
    name: "Zionsville",
    county: "Boone County",
    blurb:
      "Mature trees and older architecture, where landscape uplighting does as much work as the roofline.",
  },
  {
    slug: "sheridan-in",
    name: "Sheridan",
    county: "Hamilton County",
    blurb:
      "Acreage and outbuildings, where lighting has to cover distance and not just the house.",
  },
  {
    slug: "indianapolis-in",
    name: "Indianapolis",
    county: "Marion County",
    blurb:
      "Meridian-Kessler through Geist, with installs matched to the age and material of the home.",
  },
];

/* ------------------------------------------------------------------ */
/* SYSTEM — data only, no route                                        */
/* ------------------------------------------------------------------ */

export type SystemSpec = { label: string; value: string };

export type System = {
  id: string;
  /** Only rendered inside the spec block. Never in nav, never in the hero. */
  brand: string;
  /** Manufacturer spec. Authorized dealer use. */
  specs: SystemSpec[];
  app?: { name: string; ios?: string; android?: string; subscription: boolean };
};

/** The line we currently install. Adding another is an array entry. */
export const systems: System[] = [
  {
    id: "bosso",
    brand: "Bosso Smart Lighting",
    specs: [
      { label: "Color range", value: "16,000,000+ colors" },
      { label: "White temperatures", value: "Warm through cool white" },
      { label: "Control", value: "App, voice, and geofencing" },
      { label: "Smart home", value: "Alexa, Google Assistant, Siri, Control4" },
      { label: "Track", value: "Color-matched to trim, hidden wiring" },
      { label: "App subscription", value: "None" },
    ],
    app: {
      name: "Bosso Lights",
      ios: "https://apps.apple.com/us/app/bosso-lights/id6467633027",
      android:
        "https://play.google.com/store/apps/details?id=com.bossolighting",
      subscription: false,
    },
  },
];

export const primarySystem = systems[0];

/* ------------------------------------------------------------------ */
/* TESTIMONIALS                                                        */
/* ------------------------------------------------------------------ */

export type Testimonial = {
  quote: string;
  author: string;
  location: string;
  /**
   * Who this customer actually bought from.
   *   "system" — a manufacturer customer. Proves the hardware works.
   *   "glows"  — our own install. Proves WE work.
   * Rendered as visible attribution, not metadata. Keeps the two claims
   * separate without needing two components.
   */
  source: "system" | "glows";
};

/**
 * Manufacturer reviews, used under dealer authorization.
 * Pull the full set from the Bosso marketing kit — keep reviewer name and
 * city intact so the label renders correctly.
 */
export const systemTestimonials: Testimonial[] = [
  {
    quote:
      "They cannot be seen at all during the day. We have an HOA who would write us up instantly if they were visible.",
    author: "Kim W.",
    location: "Boise, ID",
    source: "system",
  },
  {
    quote:
      "My husband is 75 and should not be on ladders. It's a relief to have lights without the work.",
    author: "Sarah R.",
    location: "Salt Lake City, UT",
    source: "system",
  },
  {
    quote:
      "The installers were quick, professional and friendly. The app is easy to use as well.",
    author: "Marty P.",
    location: "Denver, CO",
    source: "system",
  },
];

/** Manufacturer-wide proof. Authorized dealer use. */
export const systemStats = [
  { value: "800+", label: "Google reviews across installations" },
  { value: "5", label: "Markets served" },
  { value: "16M+", label: "Colors on every system" },
] as const;

/** Our installs. Empty until Hamilton County jobs close — that's fine. */
export const glowsTestimonials: Testimonial[] = [];

export const hasOwnReviews = glowsTestimonials.length > 0;

/** Attribution label rendered under each quote. */
export const sourceLabel = (t: Testimonial) =>
  t.source === "glows"
    ? `Glow's install · ${t.location}`
    : `${primarySystem.brand.split(" ")[0]} owner · ${t.location}`;
export const getSystem = (id: string) => systems.find((s) => s.id === id);

/* ------------------------------------------------------------------ */
/* Lookups + static params                                             */
/* ------------------------------------------------------------------ */

export const solutionSlugs = solutions.map((s) => s.slug);
export const citySlugs = cities.map((c) => c.slug);

export const getSolution = (slug: string) =>
  solutions.find((s) => s.slug === slug);
export const getCity = (slug: string) => cities.find((c) => c.slug === slug);

export const nav = [
  { label: "Solutions", href: "/solutions" },
  { label: "Gallery", href: "/gallery" },
  { label: "Service Area", href: "/service-area" },
  { label: "About", href: "/about" },
] as const;

export const allRoutes = [
  "/",
  "/solutions",
  "/gallery",
  "/service-area",
  "/about",
  "/book",
  ...solutionSlugs.map((s) => `/solutions/${s}`),
  ...citySlugs.map((c) => `/${c}`),
];
