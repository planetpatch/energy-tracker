// src/lib/data-loader.ts
import fs from 'fs/promises';
import path from 'path';
import type { 
    ZCTAFeatureCollection, 
    PlantFeatureCollection, 
    BorderFeatureCollection 
} from '@/types';

export interface MapData {
    zctaData: ZCTAFeatureCollection;
    plantsData: PlantFeatureCollection;
    mgeBordersData: BorderFeatureCollection;
    alliantBordersData: BorderFeatureCollection;
}


// Helper to read a local JSON file from the /public directory
const readGeoJSON = async <T>(filename: string): Promise<T> => {
    const filepath = path.join(process.cwd(), 'public', filename);
    const data = await fs.readFile(filepath, 'utf-8');
    return JSON.parse(data) as T;
};

export async function loadAllMapData(): Promise<MapData> {
    const [zctaData, plantsData, mgeBordersData, alliantBordersData] = await Promise.all([
        // Pass the specific collection type to the generic helper function
        readGeoJSON<ZCTAFeatureCollection>('dane_zip_codes.json'),
        readGeoJSON<PlantFeatureCollection>('EnergyPlants.json'),
        readGeoJSON<BorderFeatureCollection>('mge_electric.json'),
        readGeoJSON<BorderFeatureCollection>('ae_borders.json')
    ]);

    return { zctaData, plantsData, mgeBordersData, alliantBordersData };
}