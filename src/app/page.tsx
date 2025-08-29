// src/app/page.tsx
// This remains a Server Component by default

import MapAndDashboardWrapper from '@/components/MapAndDashboardWrapper'; // Import the new wrapper

export default function HomePage() {
    return (
        <div>
            <h1>Energy Tracker</h1>
            <MapAndDashboardWrapper />
        </div>
    );
}