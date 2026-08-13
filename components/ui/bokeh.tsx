"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface BokehBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  count?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  colors?: string[];
}

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  pulseOffset: number;
  pulseSpeed: number;
}

const GLOWS_COLORS = [
  "rgba(231, 185, 105, 0.25)",
  "rgba(249, 222, 144, 0.2)",
  "rgba(200, 160, 80, 0.2)",
  "rgba(255, 220, 150, 0.15)",
  "rgba(180, 140, 60, 0.2)",
];

export function BokehBackground({
  className,
  children,
  count = 18,
  minSize = 60,
  maxSize = 180,
  speed = 0.6,
  colors = GLOWS_COLORS,
}: BokehBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    let width = rect.width;
    let height = rect.height;
    canvas.width = width;
    canvas.height = height;

    let animationId: number;
    let tick = 0;

    const createOrb = (): Orb => {
      const size = minSize + Math.random() * (maxSize - minSize);
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3 * speed,
        vy: (Math.random() - 0.5) * 0.3 * speed,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.1 + Math.random() * 0.15,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.01,
      };
    };

    const orbs: Orb[] = Array.from({ length: count }, createOrb);
    orbs.sort((a, b) => a.size - b.size);

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    const animate = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      for (const orb of orbs) {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -orb.size / 2) orb.x = width + orb.size / 2;
        if (orb.x > width + orb.size / 2) orb.x = -orb.size / 2;
        if (orb.y < -orb.size / 2) orb.y = height + orb.size / 2;
        if (orb.y > height + orb.size / 2) orb.y = -orb.size / 2;

        const pulse = Math.sin(tick * orb.pulseSpeed + orb.pulseOffset) * 0.1 + 1;
        const currentSize = orb.size * pulse;

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, currentSize / 2);
        gradient.addColorStop(0, orb.color.replace(/[\d.]+\)$/, `${orb.opacity * 1.2})`));
        gradient.addColorStop(0.4, orb.color.replace(/[\d.]+\)$/, `${orb.opacity})`));
        gradient.addColorStop(0.7, orb.color.replace(/[\d.]+\)$/, `${orb.opacity * 0.5})`));
        gradient.addColorStop(1, orb.color.replace(/[\d.]+\)$/, "0)"));

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, currentSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      ro.disconnect();
    };
  }, [count, minSize, maxSize, speed, colors]);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
