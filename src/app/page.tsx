// src/app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import MapAndDashboardWrapper from '@/components/MapAndDashboardWrapper';
import WelcomeModal from '@/components/WelcomeModal';

export default function HomePage() {
    const [isStarted, setIsStarted] = useState(false);
    const [initialLocation, setInitialLocation] = useState('');
    const [showModal, setShowModal] = useState(false); // New state to control modal visibility

    useEffect(() => {
        // Delay showing the modal slightly to allow the map component to mount and begin rendering.
        // This helps prevent the user from seeing a black/empty background behind the modal
        // before the map tiles have a chance to load.
        const timer = setTimeout(() => {
            if (!isStarted) {
                setShowModal(true);
            }
        }, 250); // A small delay is usually sufficient.

        return () => clearTimeout(timer); // Cleanup the timer if the component unmounts.
    }, [isStarted]);

    const handleStartTracking = (location: string) => {
        setInitialLocation(location);
        setIsStarted(true);
        setShowModal(false); // Also hide the modal immediately when tracking starts.
    };

    return (
        <div>
            {/* Conditionally render the modal based on the delayed state */}
            {showModal && <WelcomeModal onStartTracking={handleStartTracking} />}

            {/* The map wrapper is always rendered to allow it to load in the background.
                The blur is applied when the app hasn't "started" yet. */}
            <div className={!isStarted ? 'blur-sm' : ''}>
                <h1 className="text-2xl font-bold text-center py-4">Energy Tracker</h1>
                <MapAndDashboardWrapper initialLocation={initialLocation} />
            </div>
        </div>
    );
}

