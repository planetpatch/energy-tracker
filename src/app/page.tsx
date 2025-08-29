// src/app/page.tsx
"use client";

import { useState } from 'react';
import MapAndDashboardWrapper from '@/components/MapAndDashboardWrapper';
import WelcomeModal from '@/components/WelcomeModal';

export default function HomePage() {
    const [isStarted, setIsStarted] = useState(false);
    const [initialLocation, setInitialLocation] = useState('');

    const handleStartTracking = (location: string) => {
        setInitialLocation(location);
        setIsStarted(true);
    };

    return (
        <div>
            {!isStarted && <WelcomeModal onStartTracking={handleStartTracking} />}
            <div className={!isStarted ? 'blur-sm' : ''}>
                <h1 className="text-2xl font-bold text-center py-4">Energy Tracker</h1>
                <MapAndDashboardWrapper initialLocation={initialLocation} />
            </div>
        </div>
    );
}
