import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Script from "next/script";
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
      <head>
        <meta name="facebook-domain-verification" content="a4zqqfyy0c2wqu8ni2qw84rmtm4pt7" />
        <Script id="meta-pixel" strategy="beforeInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1583817830136366');
fbq('track', 'PageView');`}
        </Script>
        <noscript>
          <img height="1" width="1" style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1583817830136366&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body>
        <ScrollReveal />
        {children}
      </body>
    </html>
  );
}
