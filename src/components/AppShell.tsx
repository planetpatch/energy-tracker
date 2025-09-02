"use client"

import { useState, useEffect } from 'react'
import MapAndDashboardWrapper from '@/components/MapAndDashboardWrapper'
import dynamic from 'next/dynamic'

const WelcomeModal = dynamic(() => import('@/components/WelcomeModal'), { 
    ssr: false 
});

export default function AppShell() {
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
            {/* The way you render the component doesn't change at all */}
            {showModal && <WelcomeModal onStartTracking={handleStartTracking} />}

            <div className={!isStarted ? 'blur-sm' : ''}>
                <h1 className="text-2xl font-bold text-center py-4">Energy Tracker</h1>
                <MapAndDashboardWrapper initialLocation={initialLocation} />
            </div>
        </div>
    );
}
