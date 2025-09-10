// src/lib/data-loader.ts
import fs from 'fs/promises';
import path from 'path';
// import * as turf from '@turf/turf'

import type { 
    ZCTAFeatureCollection, 
    BorderFeatureCollection,
    // ZCTAFeature
} from '@/types';


interface FuelMixData {
  [key: string]: {
    renewable_percent: number;
    non_renewable_percent: number;
  };
}


export interface MapData {
    zctaData: ZCTAFeatureCollection;
    mgeBordersData: BorderFeatureCollection;
    alliantBordersData: BorderFeatureCollection;
    fuelMixData: FuelMixData;
}


// Helper to read a local JSON file from the /public directory
const readGeoJSON = async <T>(filename: string): Promise<T> => {
    const filepath = path.join(process.cwd(), 'public', filename);
    const data = await fs.readFile(filepath, 'utf-8');
    return JSON.parse(data) as T;
};

const readJSON = async <T>(filename: string): Promise<T> => {
    const filepath = path.join(process.cwd(), 'public', filename);
    const data = await fs.readFile(filepath, 'utf-8');
    return JSON.parse(data) as T;
};


export async function loadAllMapData(): Promise<MapData> {
const [zctaData, mgeBordersData, alliantBordersData, fuelMixData] = await Promise.all([
        readGeoJSON<ZCTAFeatureCollection>('dane_zip_codes.json'),
        readGeoJSON<BorderFeatureCollection>('mge_electric.json'),
        readGeoJSON<BorderFeatureCollection>('ae_borders.json'),
        readJSON<FuelMixData>('fuel_mix.json')
    ]);


    // 6. Return the fully enriched data object, including the new fuel mix data
    return { zctaData, mgeBordersData, alliantBordersData, fuelMixData };



}