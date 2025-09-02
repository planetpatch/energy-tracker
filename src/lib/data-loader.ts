// src/lib/data-loader.ts
import fs from 'fs/promises';
import path from 'path';
import * as turf from '@turf/turf'

import type { 
    ZCTAFeatureCollection, 
    PlantFeatureCollection, 
    BorderFeatureCollection,
    PlantFeature,
    ZCTAFeature
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
        readGeoJSON<ZCTAFeatureCollection>('dane_zip_codes.json'),
        readGeoJSON<PlantFeatureCollection>('EnergyPlants.json'),
        readGeoJSON<BorderFeatureCollection>('mge_electric.json'),
        readGeoJSON<BorderFeatureCollection>('ae_borders.json')
    ]);

    // --- MODIFICATION: Pre-process the data on the server ---
    // This is where we perform the expensive spatial query, once.
    zctaData.features.forEach((zctaFeature: ZCTAFeature) => {
        // Initialize an empty array for the plants on each ZCTA's properties
        zctaFeature.properties.plants = [];

        const zctaPolygon = zctaFeature.geometry;
        if (zctaPolygon && (zctaPolygon.type === 'Polygon' || zctaPolygon.type === 'MultiPolygon')) {
            plantsData.features.forEach((plantFeature: PlantFeature) => {
                if (plantFeature.geometry && turf.booleanPointInPolygon(plantFeature.geometry, zctaPolygon)) {
                    zctaFeature.properties.plants?.push(plantFeature);
                }
            });
        }
    });


    return { zctaData, plantsData, mgeBordersData, alliantBordersData };



}