"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import MapAndDashboardWrapper from '@/components/MapAndDashboardWrapper';

// --- 1. IMPORT THE NEW FUEL MIX PANEL ---
import FuelMixPanel from '@/components/FuelMixPanel';
import type { MapData } from '@/lib/data-loader';
import { useMapStore } from '@/stores/mapStore';

const WelcomeModal = dynamic(() => import('@/components/WelcomeModal'), { 
    ssr: false 
});

interface AppShellProps{
    mapData: MapData
}

export default function AppShell({ mapData }: AppShellProps) {
    const [isStarted, setIsStarted] = useState(false)
    const [initialLocation, setInitialLocation] = useState('')
    const [showModal, setShowModal] = useState(false)

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
            if (!isStarted) {
                setShowModal(true)
            }
        }, 250)

        return () => clearTimeout(timer)

    }, [isStarted])

    const handleStartTracking = (location: string) => {
        setInitialLocation(location)
        setIsStarted(true)
        setShowModal(false)
    }
return (
  <div>
    {showModal && (
      <WelcomeModal onStartTracking={handleStartTracking} mapData={mapData} />
    )}

    {/* ADD THIS: top-left toggle buttons (only after start) */}
    {isStarted && (
  <div className="fixed top-5 right-5 z-[1001] border border-gray-200 bg-white/90 backdrop-blur-md rounded-md shadow-lg p-1 flex space-x-1">
    <button
      type="button"
      className={tabBtn(isDashboardVisible)}
      onClick={() => (isDashboardVisible ? hideDashboard() : showDashboard())}
      aria-pressed={isDashboardVisible}
    >
      Dashboard
    </button>
    <button
      type="button"
      className={tabBtn(isFuelMixVisible)}
      onClick={() => (isFuelMixVisible ? hideFuelMix() : showFuelMix())}
      aria-pressed={isFuelMixVisible}
    >
      Fuel Mix
    </button>
  </div>
)}
    <div className={!isStarted ? 'blur-sm' : ''}>
      <h1 className="text-2xl font-bold text-center py-4 pt-2">Energy Tracker</h1>
      <MapAndDashboardWrapper mapData={mapData} initialLocation={initialLocation} />
    </div>

    {/* keep panels where they already are */}
    <FuelMixPanel />
  </div>
);
}