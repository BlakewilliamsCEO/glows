"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        // Element must cross 80px above the bottom edge before firing
        rootMargin: "0px 0px -80px 0px",
      },
    );

    // Small delay so the page has fully laid out before we start observing
    const timer = setTimeout(() => {
      els.forEach((el) => observer.observe(el));
    }, 150);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return null;
}
