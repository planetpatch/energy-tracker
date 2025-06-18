// src/components/ClientMapWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import React, { useCallback } from 'react'; // Make sure useCallback is imported
import { Feature, Geometry, GeoJsonProperties } from 'geojson';

const DynamicMapComponent = dynamic(() => import('./Map'), {
    ssr: false,
    loading: () => <p>Loading map...</p>,
});

const ClientMapWrapper: React.FC = () => {
    // This handler logs the clicked ZCTA to the console.
    const handleFeatureClick = useCallback((feature: Feature<Geometry, GeoJsonProperties>): void => {
        const zctaCode = (feature.properties as any)?.ZCTA5CE10 || (feature.properties as any)?.ZCTA5CE20;
        console.log('ZCTA clicked in ClientMapWrapper:', zctaCode);
    }, []); // Empty dependency array means this useCallback instance is stable

    // --- NEW: Handler for ZCTA hover events ---
    // This is required by MapComponentProps now. It will log hovered ZCTA and plants.
    const handleZCTAHover = useCallback((feature: Feature<Geometry, GeoJsonProperties> | null, plants: string[]): void => {
        if (feature) {
            const zctaCode = (feature.properties as any)?.ZCTA5CE10 || (feature.properties as any)?.ZCTA5CE20;
            console.log(`Hovered ZCTA: ${zctaCode}, Plants in ZCTA: ${plants.join(', ')}`);
        } else {
            console.log('Mouse left ZCTA boundary (hover cleared).');
        }
    }, []); // Empty dependency array means this useCallback instance is stable

    return (
        <DynamicMapComponent
            onFeatureClick={handleFeatureClick}
            onZCTAHover={handleZCTAHover} // <--- This is the newly added, required prop
        />
    );
};

export default ClientMapWrapper;