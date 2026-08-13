import type { Metadata } from "next";
import { SiteHeader } from "@/components/blocks/site-header";
import { SiteFooter } from "@/components/blocks/site-footer";
import { Visualizer } from "@/components/blocks/visualizer";

export const metadata: Metadata = {
  title: "See Your Home Lit | Glow's Lighting Services",
  description:
    "Enter your address and see what permanent lighting looks like on your home — free, instant, powered by AI.",
};

export default function VisualizerPage() {
  return (
    <div className="dark bg-[#141C2F] min-h-screen">
      <SiteHeader filled />

      <main className="pt-24 pb-20">
        <Visualizer />
      </main>

      <SiteFooter />
    </div>
  );
}
