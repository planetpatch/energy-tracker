"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import MapAndDashboardWrapper from '@/components/MapAndDashboardWrapper';

// --- 1. IMPORT THE NEW FUEL MIX PANEL ---
import FuelMixPanel from '@/components/FuelMixPanel';
import type { MapData } from '@/lib/data-loader';


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
            {/* --- 2. PASS MAPDATA TO THE WELCOME MODAL --- */}
            {/* The modal now requires this prop to check the 'serviceAreas' for the user's ZIP code. */}
            {showModal && (
                <WelcomeModal 
                    onStartTracking={handleStartTracking} 
                    mapData={mapData} 
                />
            )}

            <div className={!isStarted ? 'blur-sm' : ''}>
                <h1 className="text-2xl font-bold text-center py-4">Energy Tracker</h1>
                <MapAndDashboardWrapper 
                    mapData={mapData} 
                    initialLocation={initialLocation} 
                />
            </div>
            
            {/* --- 3. RENDER THE NEW FUEL MIX PANEL --- */}
            {/* This component will manage its own visibility by listening to the Zustand store. */}
            <FuelMixPanel />
        </div>
    );
}
