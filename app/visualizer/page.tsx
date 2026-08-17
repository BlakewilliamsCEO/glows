import type { Metadata } from "next";
import { Visualizer } from "@/components/blocks/visualizer";

export const metadata: Metadata = {
  title: "See Your Home Lit | Glow's Lighting Services",
  description:
    "Enter your address and see what permanent lighting looks like on your home — free, instant, powered by AI.",
};

export default function VisualizerPage() {
  return (
    <div className="bg-white min-h-screen">
      <main>
        <Visualizer />
      </main>
    </div>
  );
}
