import type { Metadata } from "next";
import { SiteHeader } from "@/components/blocks/site-header";
import { SiteFooter } from "@/components/blocks/site-footer";
import { GalleryWall } from "@/components/blocks/gallery-wall";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "See real homes in Carmel, Fishers, Westfield, Noblesville, and Zionsville with permanent lighting — before and after.",
};

export default function GalleryPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-white min-h-screen">
        <GalleryWall />
      </main>
      <SiteFooter />
    </>
  );
}
