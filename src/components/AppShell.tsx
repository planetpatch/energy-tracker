"use client"

import { useState, useEffect } from 'react'
import MapAndDashboardWrapper from '@/components/MapAndDashboardWrapper'
import WelcomeModal from '@/components/WelcomeModal'

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
            {showModal && <WelcomeModal onStartTracking={handleStartTracking} />}
            <div className={!isStarted ? 'blur-sm' : ''}>
                {/* The h1 is now part of the client shell */}
                <h1 className="text-2xl font-bold text-center py-4">Energy Tracker</h1>
                <MapAndDashboardWrapper initialLocation={initialLocation} />
            </div>
        </div>
    )
}
