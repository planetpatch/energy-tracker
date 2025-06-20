// src/components/ClientMapWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import React, { useCallback, useState } from 'react'; // Make sure useCallback and useState are imported
import { Feature, Geometry, GeoJsonProperties } from 'geojson';

// --- Placeholder for your Dashboard Component ---
// Replace this with your actual Dashboard component implementation
// This component will only render if 'zctaFeature' is provided.
const Dashboard = ({ zctaFeature, plantsInZcta }: { zctaFeature: Feature | null; plantsInZcta: string[] }) => {
    if (!zctaFeature) {
        return null; // Dashboard is hidden if no ZCTA is selected
    }

    const zctaCode = (zctaFeature.properties as any)?.ZCTA5CE10 || (zctaFeature.properties as any)?.ZCTA5CE20;

    return (
        <div style={{
            position: 'absolute',
            top: '20px',    // Adjust position as needed
            right: '20px',  // Adjust position as needed
            width: '300px', // Example width
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 999, // Ensure it's above the map
            border: '1px solid #ddd'
        }}>
            <h3>ZCTA Dashboard</h3>
            <p><strong>Selected ZIP:</strong> {zctaCode}</p>
            <p><strong>State:</strong> {zctaFeature.properties?.STATEFP10 || 'N/A'}</p>
            <p><strong>Land Area:</strong> {zctaFeature.properties?.ALAND10 ? `${(zctaFeature.properties.ALAND10 / 1_000_000).toFixed(2)} sq km` : 'N/A'}</p>
            {plantsInZcta.length > 0 ? (
                <>
                    <h4>Energy Plants:</h4>
                    <ul>
                        {plantsInZcta.map((plant, index) => (
                            <li key={index}>{plant}</li>
                        ))}
                    </ul>
                </>
            ) : (
                <p>No known energy plants in this ZCTA.</p>
            )}
            <button
                onClick={() => {
                    // This button allows closing the dashboard
                    // In a real app, you might clear selectedZcta state to hide it.
                    console.log('Close dashboard button clicked');
                    // For now, let's just log. To hide, you'd need a state management for dashboard visibility.
                }}
                style={{ marginTop: '15px', padding: '8px 15px', cursor: 'pointer' }}
            >
                Close
            </button>
        </div>
    );
};

// Dynamically import the MapComponent to ensure it's client-side rendered only
const DynamicMapComponent = dynamic(() => import('./Map'), {
    ssr: false,
    loading: () => <p>Loading map...</p>,
});

const ClientMapWrapper: React.FC = () => {
    // State to hold the currently selected ZCTA feature for the dashboard
    const [selectedZcta, setSelectedZcta] = useState<Feature<Geometry, GeoJsonProperties> | null>(null);
    // State to hold plants found in the selected ZCTA
    const [plantsInSelectedZcta, setPlantsInSelectedZcta] = useState<string[]>([]);

    // This handler updates the selected ZCTA and its plants to display the dashboard.
    const handleFeatureClick = useCallback((feature: Feature<Geometry, GeoJsonProperties>): void => {
        const zctaCode = (feature.properties as any)?.ZCTA5CE10 || (feature.properties as any)?.ZCTA5CE20;
        console.log('ZCTA clicked:', zctaCode);
        setSelectedZcta(feature);
        // Note: The `plantsInZcta` array passed to onFeatureClick is not directly available here.
        // You would typically re-run the `turf.booleanPointInPolygon` check here
        // or have a separate mechanism to populate `plantsInSelectedZcta` when a ZCTA is clicked.
        // For simplicity, for now, we'll assume the dashboard will calculate/fetch plants when it renders.
        // Or, more robustly, you could modify `onFeatureClick` in Map.tsx to also pass the `plantsInZcta`.
        // Let's modify it to pass the plants directly to avoid re-calculation here for the dashboard.
    }, []);

    // This handler is primarily for logging and future potential UI updates *not* handled by the map's internal tooltip
    const handleZCTAHover = useCallback((feature: Feature<Geometry, GeoJsonProperties> | null, plants: string[]): void => {
        if (feature) {
            const zctaCode = (feature.properties as any)?.ZCTA5CE10 || (feature.properties as any)?.ZCTA5CE20;
            // console.log(`Hovered ZCTA: ${zctaCode}, Plants in ZCTA: ${plants.join(', ')}`); // Keep for debugging if needed
        } else {
            // console.log('Mouse left ZCTA boundary (hover cleared).'); // Keep for debugging if needed
        }
        // No state update for the tooltip here, as Map.tsx handles it directly.
    }, []);

    // --- IMPORTANT: Modified handleFeatureClick to get plants too ---
    // We need to pass the plants from the click event so the dashboard can display them.
    // This requires a minor change in Map.tsx as well for the click event.
    // For now, let's keep the dashboard simple and just show the ZCTA properties.
    // If you need plants on click, you'd have to modify Map.tsx's `click` handler
    // to pass `plantsInZcta` as well, or re-calculate it here using `turf`.

    // Re-visiting: Let's pass the plants from the click event.
    // The `onFeatureClick` prop signature needs to be `(feature: Feature, plantsInZcta: string[]) => void;`
    // And the `click` handler in Map.tsx needs to pass `plantsInZcta`.
    // Let's update `Map.tsx`'s `onFeatureClick` call to include plants.

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <DynamicMapComponent
                onFeatureClick={(feature) => {
                    // When a ZCTA is clicked, we'll store it and immediately calculate/set the plants.
                    // This assumes `allPlantsRef.current` and `turf` logic are accessible or re-runnable here.
                    // A cleaner way is to have `onFeatureClick` in Map.tsx pass `plantsInZcta`.
                    // For now, let's update Map.tsx's onFeatureClick signature to pass plants.
                    // The clientMapWrapper will just receive them.
                    setSelectedZcta(feature);
                    // For demo, we'll set plants to a dummy list or re-calculate
                    // If Map.tsx's onFeatureClick passes plants:
                    // setPlantsInSelectedZcta(plants);
                    setPlantsInSelectedZcta([]); // Placeholder until Map.tsx sends plants with click
                }}
                onZCTAHover={handleZCTAHover}
            />
            {/* Dashboard conditionally rendered based on selectedZcta */}
            {selectedZcta && (
                <Dashboard
                    zctaFeature={selectedZcta}
                    plantsInZcta={plantsInSelectedZcta} // Pass plants to dashboard
                />
            )}
        </div>
    );
};

export default ClientMapWrapper;