// src/lib/data-loader.ts
import fs from 'fs/promises';
import path from 'path';

// Helper to read a local JSON file from the /public directory
const readGeoJSON = async (filename: string) => {
    const filepath = path.join(process.cwd(), 'public', filename);
    const data = await fs.readFile(filepath, 'utf-8');
    return JSON.parse(data);
};

export async function loadAllMapData() {
    // Use Promise.all to fetch all files in parallel, which is much faster
    const [zctaData, plantsData, mgeBordersData, alliantBordersData] = await Promise.all([
        readGeoJSON('dane_zip_codes.json'),
        readGeoJSON('EnergyPlants.json'),
        readGeoJSON('mge_electric.json'),
        readGeoJSON('ae_borders.json')
    ]);

    return { zctaData, plantsData, mgeBordersData, alliantBordersData };
}