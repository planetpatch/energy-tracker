"use client"

import { useState, useEffect } from 'react'
import MapAndDashboardWrapper from '@/components/MapAndDashboardWrapper'
import dynamic from 'next/dynamic'
import type { MapData } from '@/lib/data-loader'
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
            {showModal && <WelcomeModal onStartTracking={handleStartTracking} />}

            <div className={!isStarted ? 'blur-sm' : ''}>
                <h1 className="text-2xl font-bold text-center py-4">Energy Tracker</h1>
                {/* Now, when you pass mapData down, TypeScript knows its exact shape */}
                <MapAndDashboardWrapper 
                    mapData={mapData} 
                    initialLocation={initialLocation} 
                />
            </div>
        </div>
    );
}