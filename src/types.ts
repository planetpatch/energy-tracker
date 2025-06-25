// src/types.ts

import type { Feature, Point, Geometry, GeoJsonProperties } from 'geojson';

// --- Energy Plant Types ---
// 1. Define an interface for ONLY the specific, known properties of your plant data.
export interface PlantKnownProperties {
  // Make 'name' explicitly required as it's used for display and as a key
  name: string; // Changed to required string (assuming your JSON always has a name)

  utilityName?: string | null;
  cityName?: string | null;
  techDesc?: string | null;
  primarySource?: string | null;
  sectorName?: string | null;
  installedMW?: number | null;
  totalMW?: number | null;
  // Do NOT include [key: string]: any; here, it will be covered by GeoJsonProperties
}

// 2. Create a type alias that combines your specific properties with GeoJsonProperties.
// This is the correct way to merge specific properties with a dynamic GeoJsonProperties type,
// avoiding the TypeScript error when extending directly.
export type PlantProperties = PlantKnownProperties & GeoJsonProperties;

// 3. Full Plant Feature type uses the new PlantProperties type.
export type PlantFeature = Feature<Point, PlantProperties>;


// --- ZCTA (ZIP Code Tabulation Area) Types ---
// 1. Define an interface for ONLY the specific, known properties of your ZCTA data.
export interface ZCTAKnownProperties {
  ZCTA5CE10?: string | null; // 2010 ZCTA code
  // Add any other specific ZCTA properties that might be in your GeoJSON here, e.g.:
  // population?: number | null;
  // landArea?: number | null;
}

// 2. Create a type alias that combines your specific properties with GeoJsonProperties.
export type ZCTAProperties = ZCTAKnownProperties & GeoJsonProperties;

// 3. Full ZCTA Feature type uses the new ZCTAProperties type.
export type ZCTAFeature = Feature<Geometry, ZCTAProperties>;