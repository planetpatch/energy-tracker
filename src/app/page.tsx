"use client";

import { useState, useEffect } from 'react';
import MapAndDashboardWrapper from '@/components/MapAndDashboardWrapper';
import WelcomeModal from '@/components/WelcomeModal';
import IntroAnimation from '@/components/IntroAnimation'; // Assuming this component exists

export default function HomePage() {
    // State to manage the cinematic intro
    const [introComplete, setIntroComplete] = useState(false);

    // Your existing state for the modal and application start
    const [isStarted, setIsStarted] = useState(false);
    const [initialLocation, setInitialLocation] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Your existing useEffect to delay the modal, but now it only runs AFTER the intro is complete.
    useEffect(() => {
        // If the intro is not complete, do nothing.
        if (!introComplete) return;

        // Once the intro is complete, start the timer for the modal.
        const timer = setTimeout(() => {
            if (!isStarted) {
                setShowModal(true);
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [introComplete, isStarted]); // This effect now depends on introComplete

    // Callback for the animation component to call when it's done
    const handleIntroComplete = () => {
        setIntroComplete(true);
    };

    const handleStartTracking = (location: string) => {
        setInitialLocation(location);
        setIsStarted(true);
        setShowModal(false);
    };

    return (
        <>
            {/* 1. Render the Intro Animation first, if it's not complete */}
            {!introComplete && <IntroAnimation onComplete={handleIntroComplete} />}

            {/* 2. Once the intro is complete, render the main application */}
            {introComplete && (
                <div>
                    {/* The modal is rendered based on its delayed state */}
                    {showModal && <WelcomeModal onStartTracking={handleStartTracking} />}

                    {/* The map wrapper is always rendered to allow it to load in the background. */}
                    <div className={!isStarted ? 'blur-sm' : ''}>
                        <h1 className="text-2xl font-bold text-center py-4">Energy Tracker</h1>
                        <MapAndDashboardWrapper initialLocation={initialLocation} />
                    </div>
                </div>
            )}
        </>
    );
}