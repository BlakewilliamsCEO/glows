"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CountUpProps {
  to: number;
  duration?: number;
  className?: string;
}

export function CountUp({ to, duration = 1.8, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          observer.disconnect();

          const startTime = performance.now();
          const durationMs = duration * 1000;

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * to));
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {value.toLocaleString()}
    </span>
  );
}

export default CountUp;
