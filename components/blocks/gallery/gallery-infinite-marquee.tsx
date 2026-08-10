"use client"

import { motion } from "framer-motion"

interface GalleryItem {
  id: string
  title: string
  color: string
  image: string
}

const galleryItems: GalleryItem[] = [
  {
    id: "1",
    title: "Brand A",
    color: "bg-blue-500/10",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Brand B",
    color: "bg-purple-500/10",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Brand C",
    color: "bg-green-500/10",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Brand D",
    color: "bg-orange-500/10",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop",
  },
  {
    id: "5",
    title: "Brand E",
    color: "bg-pink-500/10",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop",
  },
  {
    id: "6",
    title: "Brand F",
    color: "bg-cyan-500/10",
    image:
      "https://images.unsplash.com/photo-1518173946687-a544bf02a536?w=800&auto=format&fit=crop",
  },
  {
    id: "7",
    title: "Brand G",
    color: "bg-amber-500/10",
    image:
      "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&auto=format&fit=crop",
  },
  {
    id: "8",
    title: "Brand H",
    color: "bg-rose-500/10",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
  },
]

export default function GalleryInfiniteMarquee() {
  return (
    <section className="mx-auto w-full max-w-2xl p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-lg border bg-card"
      >
        <div className="border-b px-4 py-3">
          <h2 className="font-medium text-sm">Infinite Marquee Gallery</h2>
          <p className="mt-0.5 text-muted-foreground text-xs">
            Continuous scrolling in opposite directions
          </p>
        </div>

        <div className="space-y-6 p-4">
          {/* First marquee row - scrolling left */}
          <div className="relative overflow-hidden">
            <div className="flex animate-marquee-left gap-4">
              {[...galleryItems, ...galleryItems].map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="h-24 w-32 shrink-0 overflow-hidden rounded-md"
                >
                  <img src={item.image} alt={item.title} className="size-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Second marquee row - scrolling right */}
          <div className="relative overflow-hidden">
            <div className="flex animate-marquee-right gap-4">
              {[...galleryItems, ...galleryItems].reverse().map((item, index) => (
                <div
                  key={`${item.id}-reverse-${index}`}
                  className="h-24 w-32 shrink-0 overflow-hidden rounded-md"
                >
                  <img src={item.image} alt={item.title} className="size-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-md bg-muted/50 p-3">
            <div className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
            <p className="text-muted-foreground text-xs">
              Continuous infinite scroll with CSS animations
            </p>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
				@keyframes marquee-left {
					0% {
						transform: translateX(0);
					}
					100% {
						transform: translateX(-50%);
					}
				}

				@keyframes marquee-right {
					0% {
						transform: translateX(-50%);
					}
					100% {
						transform: translateX(0);
					}
				}

				.animate-marquee-left {
					animation: marquee-left 30s linear infinite;
				}

				.animate-marquee-right {
					animation: marquee-right 30s linear infinite;
				}

				.animate-marquee-left:hover,
				.animate-marquee-right:hover {
					animation-play-state: paused;
				}
			`}</style>
    </section>
  )
}
