"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
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
  // The isMenuOpen state is no longer needed

  const { isDashboardVisible, showDashboard, hideDashboard } = useMapStore();
  const { isFuelMixVisible, showFuelMix, hideFuelMix } = useMapStore();

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

      {/* --- A Single, Responsive Header --- */}
      <header
        className={`fixed top-0 left-0 right-0 z-[1001]
          flex items-center justify-between
          bg-white/90 backdrop-blur-md border-b border-gray-200
          px-4 h-16 shadow-md ${gemunuLibre.className}`}
      >
        {/* Left Side: Logo and Title (Visible on all screen sizes) */}
        <div className="flex items-center">
          <Image
            src="/planetpatch_logo_transparent.png"
            alt="PlanetPatch Logo"
            width={32}
            height={32}
            className="mr-3"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-green-800">
            Energy Tracker
          </h1>
        </div>

        {/* Right Side: Desktop Buttons (Visible on medium screens and up) */}
        {isStarted && (
          <div className="hidden md:flex items-center space-x-2">
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
      </header>
      
      {/* The mobile dropdown menu has been completely removed */}

      <div className={!isStarted ? 'blur-sm' : ''}>
        {/* Spacer for the fixed header */}
        <div className="h-16" /> 
        <MapAndDashboardWrapper mapData={mapData} initialLocation={initialLocation} />
      </div>

      {isStarted && <FuelMixPanel />}
    </div>
  );
}