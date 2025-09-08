// e.g., app/_components/TrackEntry.tsx
"use client";
import { useEffect } from "react";
import { track } from "@vercel/analytics";

export default function TrackEntry() {
  useEffect(() => {
    // only fire once per tab/session
    if (sessionStorage.getItem("pp-src-tracked")) return;

    const params = new URLSearchParams(window.location.search);
    const src = params.get("src");
    if (src) {
      track("qr_entry", { src });      // e.g., "qrA" or "qrB"
      sessionStorage.setItem("pp-src-tracked", "1");
    }
  }, []);
  return null;
}
