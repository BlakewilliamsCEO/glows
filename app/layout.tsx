import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { ScrollReveal } from "@/components/scroll-reveal";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Glow's Lighting Services | Permanent Outdoor Lighting",
    template: "%s | Glow's Lighting Services",
  },
  description:
    "Permanent outdoor lighting installed once for Hamilton County homes. No ladders, no storage bins, no seasonal takedown.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <ScrollReveal />
        {children}
      </body>
    </html>
  );
}
