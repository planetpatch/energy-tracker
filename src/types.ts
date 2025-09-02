// src/types.ts

import type { Feature, Point, Geometry, GeoJsonProperties, FeatureCollection } from 'geojson';

// --- Energy Plant Types ---
// 1. Define an interface for ONLY the specific, known properties of your plant data.
export interface PlantKnownProperties {
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

// --- Energy Production Plants Types ---
// 2. Create a type alias that combines your specific properties with GeoJsonProperties.
export type PlantProperties = PlantKnownProperties & GeoJsonProperties;
// 3. Full Plant Feature type uses the new PlantProperties type.
export type PlantFeature = Feature<Point, PlantProperties>;
// 4. PlantFeatureCollection
export type PlantFeatureCollection = FeatureCollection<Point, PlantProperties>;

// --- ZCTA (ZIP Code Tabulation Area) Types ---
// 1. Define an interface for ONLY the specific, known properties of your ZCTA data.
export interface ZCTAKnownProperties {
  ZCTA5CE10?: string | null;
  plants?: PlantFeature[];
}
// 2. Create a type alias that combines your specific properties with GeoJsonProperties.
export type ZCTAProperties = ZCTAKnownProperties & GeoJsonProperties;
// 3. Full ZCTA Feature type uses the new ZCTAProperties type.
export type ZCTAFeature = Feature<Geometry, ZCTAProperties>;
// 4. ZCTA Feature Collection
export type ZCTAFeatureCollection = FeatureCollection<Geometry, ZCTAProperties>;


// --- Border Feature Types - For Alliant, MGE Borders ---
export type BorderFeatureCollection = FeatureCollection<Geometry, GeoJsonProperties>;