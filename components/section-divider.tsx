/**
 * SVG wave divider placed between sections.
 * bg    = the section above (the wave is drawn IN this color so it bleeds)
 * fill  = the section below (the wave appears to "reveal" this color)
 */
export function SectionDivider({
  bg,
  fill,
  flip = false,
}: {
  bg: string;
  fill: string;
  flip?: boolean;
}) {
  return (
    <div
      className="relative -mt-1 -mb-1 w-full overflow-hidden leading-none"
      style={{ background: bg }}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block w-full"
        style={{
          height: 80,
          transform: flip ? "scaleX(-1)" : undefined,
        }}
      >
        <path
          d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
