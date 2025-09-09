"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import MapAndDashboardWrapper from '@/components/MapAndDashboardWrapper';
import FuelMixPanel from '@/components/FuelMixPanel';
import type { MapData } from '@/lib/data-loader';
import { useMapStore } from '@/stores/mapStore';
import { gemunuLibre } from '@/ui/fonts';
import Image from 'next/image';


const WelcomeModal = dynamic(() => import('@/components/WelcomeModal'), {
  ssr: false
});

interface AppShellProps {
  mapData: MapData;
}

export default function AppShell({ mapData }: AppShellProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [initialLocation, setInitialLocation] = useState('');
  const [showModal, setShowModal] = useState(false);

  const isDashboardVisible = useMapStore(s => s.isDashboardVisible);
  const showDashboard      = useMapStore(s => s.showDashboard);
  const hideDashboard      = useMapStore(s => s.hideDashboard);

  const isFuelMixVisible  = useMapStore(s => s.isFuelMixVisible);
  const showFuelMix       = useMapStore(s => s.showFuelMix);
  const hideFuelMix       = useMapStore(s => s.hideFuelMix);

  // Refactored tab-style button to work with your pixel button classes
  const tabBtn = (active: boolean) => active ? 'pixel-button-primary' : 'pixel-button-secondary';

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isStarted) setShowModal(true);
    }, 250);
    return () => clearTimeout(timer);
  }, [isStarted]);

  const handleStartTracking = (location: string) => {
    setInitialLocation(location);
    setIsStarted(true);
    setShowModal(false);
  };

  return (
    <div>
      {showModal && (
        <WelcomeModal onStartTracking={handleStartTracking} mapData={mapData} />
      )}

      {/* Fixed, translucent header pill with logo */}
      <div
        className={`fixed top-3 left-1/2 -translate-x-1/2 z-[1001]
                   flex items-center justify-center
                   bg-white/90 backdrop-blur-md border border-gray-200
                   px-4 py-2 rounded-md shadow-lg ${gemunuLibre.className}`}
      >
        <Image
          src="/planetpatch_logo_transparent.png"
          alt="PlanetPatch Logo"
          width={32}
          height={32}
          className="mr-3"
        />
        <h1 className="text-4xl font-bold text-green-800">
          Energy Tracker
        </h1>
      </div>

      {/* Top-right tab buttons with logo link */}
      {isStarted && (
        <div className="fixed top-5 right-5 z-[1001] border border-gray-200 bg-white/90 backdrop-blur-md rounded-md shadow-lg p-1 flex items-center space-x-1">
          <button
            type="button"
            className={`text-center text-xs font-gemunu pixel-button-base ${tabBtn(isDashboardVisible)}`}
            onClick={() => (isDashboardVisible ? hideDashboard() : showDashboard())}
            aria-pressed={isDashboardVisible}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={`text-center text-xs font-gemunu pixel-button-base ${tabBtn(isFuelMixVisible)}`}
            onClick={() => (isFuelMixVisible ? hideFuelMix() : showFuelMix())}
            aria-pressed={isFuelMixVisible}
          >
            Fuel Mix
          </button>
          <a
            href="https://www.planetpatch.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-md hover:bg-gray-200 transition-colors"
            aria-label="Visit PlanetPatch.dev"
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

      <div className={!isStarted ? 'blur-sm' : ''}>
        <MapAndDashboardWrapper mapData={mapData} initialLocation={initialLocation} />
      </div>

      <FuelMixPanel />
    </div>
  );
}