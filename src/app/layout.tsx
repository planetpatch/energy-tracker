import type { Metadata } from "next";
import { Geist, Geist_Mono, Gemunu_Libre  } from "next/font/google";
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${gemunuLibre.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
