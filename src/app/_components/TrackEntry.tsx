"use client";
import { useEffect } from "react";

export default function TrackEntry() {
  useEffect(() => {
    if (sessionStorage.getItem("qr-src-tracked")) return; // dedupe per session

    const src = new URLSearchParams(window.location.search).get("src");
    if (src && typeof window !== "undefined" && "gtag" in window) {
      // @ts-ignore
      window.gtag("event", "qr_entry", { src }); // logs "qr_entry" with src param
      sessionStorage.setItem("qr-src-tracked", "1");
    }
  }, []);

  return null;
}
