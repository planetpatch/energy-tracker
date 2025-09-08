import type { Metadata } from "next";
import { Geist, Geist_Mono, Gemunu_Libre } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import TrackEntry from "./_components/TrackEntry";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gemunuLibre = Gemunu_Libre({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-gemunu-libre',
});


export const metadata: Metadata = {
  title: "Energy Tracker | PlanetPatch",
  description: "Dane County Energy Tracker to show residents their electric utility's fuel mix and take action.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-9CKG8ZWVEC"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9CKG8ZWVEC', { send_page_view: true });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${gemunuLibre.variable} antialiased`}
      >
        <TrackEntry />
        {children}
         <Analytics />
      </body>
    </html>
  );
}
