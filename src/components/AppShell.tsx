// appshell.tsx
"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import MapAndDashboardWrapper from '@/components/MapAndDashboardWrapper';
import FuelMixPanel from '@/components/FuelMixPanel';
import PanelToggles from '@/components/PanelToggles';
// ⬇️ ADD THIS IMPORT
// import DashboardPanel from '@/components/DashboardPanel';
import type { MapData } from '@/lib/data-loader';

const WelcomeModal = dynamic(() => import('@/components/WelcomeModal'), { ssr: false });

interface AppShellProps {
  mapData: MapData;
}

export default function AppShell({ mapData }: AppShellProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [initialLocation, setInitialLocation] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => { if (!isStarted) setShowModal(true); }, 250);
    return () => clearTimeout(timer);
  }, [isStarted]);

  const handleStartTracking = (location: string) => {
    setInitialLocation(location);
    setIsStarted(true);
    setShowModal(false);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {showModal && (
        <WelcomeModal onStartTracking={handleStartTracking} mapData={mapData} />
      )}

      <div className={`h-full w-full transition ${!isStarted ? 'blur-sm' : ''}`}>
        <h1 className="absolute top-0 left-1/2 -translate-x-1/2 z-10 text-2xl font-bold text-center py-4 bg-white/50 px-4 rounded-b-lg">
          Energy Tracker
        </h1>
        <MapAndDashboardWrapper mapData={mapData} initialLocation={initialLocation} />
      </div>

      {isStarted && (
        <>
          <PanelToggles />
          {/* ⬇️ MOUNT BOTH PANELS (each self-hides via activePanel) */}
          <FuelMixPanel />
        </>
      )}
    </div>
  );
}
