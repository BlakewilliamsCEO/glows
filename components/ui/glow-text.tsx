"use client";

import { cn } from "@/lib/utils";

/**
 * Illuminated glow text effect using SVG feGaussianBlur filters.
 * Warm amber glow that looks like the lights are on.
 */
export function GlowText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <>
      <span
        className={cn("relative inline-block", className)}
        style={{ filter: "url(#glow-filter)" }}
      >
        <span
          className="absolute inset-0 animate-[glow-fade-in_1.5s_ease-out_forwards] opacity-0 bg-[linear-gradient(0deg,#e7b969_0%,#f9de90_50%)] bg-clip-text text-transparent"
          aria-hidden="true"
        >
          {children}
        </span>
        {children}
      </span>

      <svg
        className="absolute -z-10 h-0 w-0"
        width="0"
        height="0"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <filter
            id="glow-filter"
            colorInterpolationFilters="sRGB"
            x="-50%"
            y="-200%"
            width="200%"
            height="500%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur4" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur12" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="24" result="blur24" />
            <feColorMatrix
              in="blur4"
              result="glow-tight"
              type="matrix"
              values="1 0 0 0 0
                      0 0.85 0 0 0
                      0 0 0.6 0 0
                      0 0 0 0.7 0"
            />
            <feOffset in="glow-tight" result="glow-tight-off" dx="0" dy="0" />
            <feColorMatrix
              in="blur12"
              result="glow-mid"
              type="matrix"
              values="0.9 0 0 0 0
                      0 0.55 0 0 0
                      0 0 0.25 0 0
                      0 0 0 0.8 0"
            />
            <feOffset in="glow-mid" result="glow-mid-off" dx="0" dy="2" />
            <feColorMatrix
              in="blur24"
              result="glow-wide"
              type="matrix"
              values="0.5 0 0 0 0
                      0 0.22 0 0 0
                      0 0 0.08 0 0
                      0 0 0 0.6 0"
            />
            <feOffset in="glow-wide" result="glow-wide-off" dx="0" dy="8" />
            <feMerge>
              <feMergeNode in="glow-wide-off" />
              <feMergeNode in="glow-mid-off" />
              <feMergeNode in="glow-tight-off" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </>
  );
}
