"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import MapAndDashboardWrapper from '@/components/MapAndDashboardWrapper';
import FuelMixPanel from '@/components/FuelMixPanel';
import type { MapData } from '@/lib/data-loader';
import { useMapStore } from '@/stores/mapStore';
import { gemunuLibre } from '@/ui/fonts';

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

  // tab-style button
  const tabBtn = (active: boolean) =>
    `px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
     ${active ? 'bg-blue-600 text-white shadow' : 'bg-transparent text-gray-800 hover:bg-gray-100'}`;

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

      {/* Fixed, translucent header pill */}
      <h1
        className={`fixed top-3 left-1/2 -translate-x-1/2 z-[1001]
                   text-4xl font-bold text-center text-green-800
                   bg-white/90 backdrop-blur-md border border-gray-200
                   px-4 py-2 rounded-md shadow-lg ${gemunuLibre.className}`}
      >
        Energy Tracker
      </h1>

      {/* Top-right tab buttons with translucent background (only after start) */}
      {isStarted && (
        <div className="fixed top-5 right-5 z-[1001] border border-gray-200 bg-white/90 backdrop-blur-md rounded-md shadow-lg p-1 flex space-x-1">
          <button
            type="button"
            className={`text-center text-xs font-gemunu pixel-button-base pixel-button-primary ${tabBtn(isDashboardVisible)}`}
            onClick={() => (isDashboardVisible ? hideDashboard() : showDashboard())}
            aria-pressed={isDashboardVisible}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={`text-center text-xs font-gemunu pixel-button-base pixel-button-primary ${tabBtn(isFuelMixVisible)}`}
            onClick={() => (isFuelMixVisible ? hideFuelMix() : showFuelMix())}
            aria-pressed={isFuelMixVisible}
          >
            Fuel Mix
          </button>
        </div>
      )}

      <div className={!isStarted ? 'blur-sm' : ''}>
        {/* Spacer so content doesn't sit under the fixed header on very small screens */}
        <div />
        <MapAndDashboardWrapper mapData={mapData} initialLocation={initialLocation} />
      </div>

      {/* Keep panels where they already are */}
      <FuelMixPanel />
    </div>
  );
}
