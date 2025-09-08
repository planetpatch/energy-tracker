// src/app/page.tsx
import AppShell from '@/components/AppShell';
import { loadAllMapData } from '@/lib/data-loader';

export default async function EnergyTracker() {
    //all map data loaded through data-loader.ts before page renders
    const mapData = await loadAllMapData();

    return (
        <main>
            <AppShell mapData={mapData} />
        </main>
    )
}