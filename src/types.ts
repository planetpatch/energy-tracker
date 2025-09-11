// src/types.ts

import type {
  Feature,
  Geometry, GeoJsonProperties, FeatureCollection
} from 'geojson';



export interface ZCTAKnownProperties {
  ZCTA5CE10?: string | null;
  serviceAreas: string[];
}

export type ZCTAProperties = ZCTAKnownProperties & GeoJsonProperties;

export type ZCTAFeature = Feature<Geometry, ZCTAProperties>;

export type ZCTAFeatureCollection = FeatureCollection<Geometry, ZCTAProperties>;



export type BorderFeatureCollection = FeatureCollection<Geometry, GeoJsonProperties>;