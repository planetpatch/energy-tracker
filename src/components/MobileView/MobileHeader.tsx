"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useMapStore } from '@/stores/mapStore';
import { gemunuLibre } from '@/ui/fonts';

interface HeaderProps {
  isStarted: boolean;
}

export const MobileHeader: React.FC<HeaderProps> = ({ isStarted }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDashboardVisible, showDashboard, hideDashboard } = useMapStore();
  const { isFuelMixVisible, showFuelMix, hideFuelMix } = useMapStore();

  const tabBtn = (active: boolean) => active ? 'pixel-button-primary' : 'pixel-button-secondary';

  const handleMenuClick = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[1001]
                   flex items-center justify-between
                   bg-white/90 backdrop-blur-md border-b border-gray-200
                   px-4 h-16 shadow-md ${gemunuLibre.className}`}
      >
        <div className="flex items-center text-center justify-center">
          <Image
            src="/planetpatch_logo_transparent.png"
            alt="PlanetPatch Logo"
            width={56}
            height={56}
            className="mr-3"
          />
          <h1 className="text-2xl font-bold text-green-800">
            Energy Tracker
          </h1>
        </div>
        {isStarted && (
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-200"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        )}
      </header>
      
      {isMenuOpen && isStarted && (
        <div
          className={`fixed top-16 left-0 right-0 z-[1000]
                     bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200
                     p-4 flex flex-col space-y-3 ${gemunuLibre.className}`}
        >
          <button
            type="button"
            className={`w-full text-center text-lg font-gemunu pixel-button-base ${tabBtn(isDashboardVisible)}`}
            onClick={() => handleMenuClick(() => isDashboardVisible ? hideDashboard() : showDashboard())}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={`w-full text-center text-lg font-gemunu pixel-button-base ${tabBtn(isFuelMixVisible)}`}
            onClick={() => handleMenuClick(() => isFuelMixVisible ? hideFuelMix() : showFuelMix())}
          >
            Fuel Mix
          </button>
          <a
            href="https://www.planetpatch.dev"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center text-lg font-gemunu pixel-button-base pixel-button-secondary`}
            onClick={() => setIsMenuOpen(false)}
          >
            <Image src="/planetpatch_logo_transparent.png" alt="PlanetPatch Logo" width={24} height={24} className="mr-2" />
            PlanetPatch.dev
          </a>
        </div>
      )}
    </>
  );
};
