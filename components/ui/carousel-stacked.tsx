"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface CarouselSlide {
  image: string;
  alt: string;
  title: string;
  description: string;
  badge: string;
  href?: string;
}

interface CarouselConfig {
  distanceDivisor: number;
  velocityDivisor: number;
  sensitivity: number;
  xMultiplier: number;
  yMultiplier: number;
  rotationMultiplier: number;
  scaleReduction: number;
}

function getConfig(width: number): CarouselConfig {
  if (width < 640) {
    return {
      distanceDivisor: 120,
      velocityDivisor: 500,
      sensitivity: 180,
      xMultiplier: 90,
      yMultiplier: 20,
      rotationMultiplier: 8,
      scaleReduction: 0.06,
    };
  }
  if (width < 1024) {
    return {
      distanceDivisor: 160,
      velocityDivisor: 650,
      sensitivity: 220,
      xMultiplier: 130,
      yMultiplier: 30,
      rotationMultiplier: 10,
      scaleReduction: 0.09,
    };
  }
  return {
    distanceDivisor: 200,
    velocityDivisor: 800,
    sensitivity: 250,
    xMultiplier: 170,
    yMultiplier: 40,
    rotationMultiplier: 12,
    scaleReduction: 0.12,
  };
}

interface CardProps {
  slide: CarouselSlide;
  index: number;
  total: number;
  progress: MotionValue<number>;
  config: CarouselConfig;
}

function Card({ slide, index, total, progress, config }: CardProps) {
  const offset = useTransform(progress, (p) => {
    let diff = (index - p) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  });

  const x = useTransform(offset, (o) => o * config.xMultiplier);
  const rotate = useTransform(offset, (o) =>
    Math.abs(o) < 0.05 ? 0 : o * config.rotationMultiplier,
  );
  const y = useTransform(offset, (o) =>
    Math.abs(o) < 0.05 ? 0 : Math.abs(o) * config.yMultiplier,
  );
  const scale = useTransform(
    offset,
    (o) => 1 - Math.abs(o) * config.scaleReduction,
  );
  const opacity = useTransform(
    offset,
    [-total / 2, -total / 2 + 0.5, 0, total / 2 - 0.5, total / 2],
    [0, 1, 1, 1, 0],
  );
  const zIndex = useTransform(offset, (o) =>
    Math.round(100 - Math.abs(o) * 10),
  );
  const overlayOpacity = useTransform(
    offset,
    [-2, -0.5, 0, 0.5, 2],
    [0.5, 0.2, 0, 0.2, 0.5],
  );
  const textOpacity = useTransform(offset, [-0.5, 0, 0.5], [0, 1, 0]);

  return (
    <motion.div
      style={{ x, rotate, y, scale, opacity, zIndex }}
      className={cn(
        "absolute rounded-2xl overflow-hidden bg-muted group pointer-events-none",
        "w-60 h-72 sm:w-72 sm:h-[22rem] lg:w-80 lg:h-[30rem]",
      )}
    >
      {slide.image.endsWith(".mp4") ? (
        <video
          src={slide.image}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      ) : (
        <img
          src={slide.image}
          alt={slide.alt}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      )}

      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-black pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-brand-gold/90 text-[0.6875rem] font-semibold uppercase tracking-widest text-[#141C2F]">
        {slide.badge}
      </span>

      <div className="absolute bottom-6 left-5 right-5 text-white">
        <motion.p
          style={{ opacity: textOpacity }}
          className="text-lg font-display font-semibold leading-tight mb-1 drop-shadow-md lg:text-xl"
        >
          {slide.title}
        </motion.p>
        <motion.p
          style={{ opacity: textOpacity }}
          className="text-xs text-white/70 leading-relaxed"
        >
          {slide.description}
        </motion.p>
      </div>
    </motion.div>
  );
}

function DotIndicator({
  index,
  progress,
  total,
}: {
  index: number;
  progress: MotionValue<number>;
  total: number;
}) {
  const opacity = useTransform(progress, (p) => {
    let diff = (index - p) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return Math.abs(diff) < 0.5 ? 1 : 0.3;
  });

  return (
    <motion.span
      style={{ opacity }}
      className="size-1.5 rounded-full bg-accent"
    />
  );
}

interface CarouselStackedProps {
  slides: CarouselSlide[];
  className?: string;
}

export function CarouselStacked({ slides, className }: CarouselStackedProps) {
  const scrollProgress = useMotionValue(0);
  const startProgress = React.useRef(0);
  const [windowWidth, setWindowWidth] = React.useState(0);
  const total = slides.length;

  React.useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const config = React.useMemo(() => getConfig(windowWidth), [windowWidth]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distanceShift = -info.offset.x / config.distanceDivisor;
    const velocityShift = -info.velocity.x / config.velocityDivisor;
    const totalShift = Math.max(-3, Math.min(3, Math.round(distanceShift + velocityShift)));
    animate(scrollProgress, Math.round(startProgress.current) + totalShift, {
      type: "spring",
      stiffness: 200,
      damping: 30,
      mass: 1,
    });
  };

  return (
    <div className={cn("relative w-full h-80 sm:h-[24rem] lg:h-[32rem] flex items-center justify-center", className)}>
      {slides.map((slide, i) => (
        <Card
          key={slide.title}
          slide={slide}
          index={i}
          total={total}
          progress={scrollProgress}
          config={config}
        />
      ))}

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={() => { startProgress.current = scrollProgress.get(); }}
        onDrag={(_, info) => {
          scrollProgress.set(scrollProgress.get() - info.delta.x / config.sensitivity);
        }}
        onDragEnd={handleDragEnd}
        className="absolute inset-0 z-50 cursor-grab active:cursor-grabbing"
      />

      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, i) => (
          <DotIndicator key={i} index={i} progress={scrollProgress} total={total} />
        ))}
      </div>
    </div>
  );
}
