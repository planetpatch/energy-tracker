"use client";

import React from 'react';
import Image from 'next/image';
import { useMapStore } from '@/stores/mapStore';
import { gemunuLibre } from '@/ui/fonts';

interface HeaderProps {
  isStarted: boolean;
}

export const DesktopHeader: React.FC<HeaderProps> = ({ isStarted }) => {
  const { isDashboardVisible, showDashboard, hideDashboard } = useMapStore();
  const { isFuelMixVisible, showFuelMix, hideFuelMix } = useMapStore();

  const tabBtn = (active: boolean) => active ? 'pixel-button-primary' : 'pixel-button-secondary';

  return (
    <>
      {/* Centered Title Pill */}
      <div
        className={`fixed top-3 left-1/2 -translate-x-1/2 z-[1001]
                   flex items-center justify-center
                   bg-white/90 backdrop-blur-md border border-gray-200
                   px-4 py-2 rounded-md shadow-lg ${gemunuLibre.className}`}
      >
        <Image
          src="/planetpatch_logo_transparent.png"
          alt="PlanetPatch Logo"
          width={56}
          height={56}
          className="mr-3"
        />
        <h1 className="text-4xl font-bold text-green-800">
          Energy Tracker
        </h1>
      </div>

      {/* Top-right Buttons */}
      {isStarted && (
        <div className="fixed top-5 right-5 z-[1001] border border-gray-200 bg-white/90 backdrop-blur-md rounded-md shadow-lg p-1 flex items-center space-x-1">
          <button
            type="button"
            className={`text-center text-xs font-gemunu pixel-button-base ${tabBtn(isDashboardVisible)}`}
            onClick={() => (isDashboardVisible ? hideDashboard() : showDashboard())}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={`text-center text-xs font-gemunu pixel-button-base ${tabBtn(isFuelMixVisible)}`}
            onClick={() => (isFuelMixVisible ? hideFuelMix() : showFuelMix())}
          >
            Fuel Mix
          </button>
          <a
            href="https://www.planetpatch.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Image
              src="/planetpatch_logo_transparent.png"
              alt="PlanetPatch Logo"
              width={24}
              height={24}
            />
          </a>
        </div>
      )}
    </>
  );
};
