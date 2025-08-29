// src/utils/geo.ts
import type { ZCTAFeature } from '@/types';
import type {
  Point, Polygon, MultiPolygon,
  //Feature, GeoJsonProperties, Geometry
} from 'geojson'; // Added Feature and GeoJsonProperties

/**
 * Checks if a point is inside a polygon.
 * This function uses the ray-casting algorithm.
 *
 * @param point - The GeoJSON Point feature.
 * @param polygon - The GeoJSON Polygon or MultiPolygon feature.
 * @returns true if the point is inside the polygon, false otherwise.
 */
export function isPointInPolygon(point: Point, polygon: Polygon | MultiPolygon): boolean {
  const [x, y] = point.coordinates;

  if (polygon.type === 'Polygon') {
    return isPointInSinglePolygon(x, y, polygon.coordinates);
  } else if (polygon.type === 'MultiPolygon') {
    // For MultiPolygon, check if the point is in any of its constituent polygons
    for (const singlePolygonCoords of polygon.coordinates) {
      if (isPointInSinglePolygon(x, y, singlePolygonCoords)) {
        return true;
      }
    }
    return false;
  }
  return false; // Should not happen with valid GeoJSON types
}

/**
 * Helper function for the ray-casting algorithm for a single polygon.
 * @param x - X coordinate of the point.
 * @param y - Y coordinate of the point.
 * @param polygonCoords - Array of linear ring coordinate arrays. The first ring is the exterior, subsequent rings are holes.
 */
function isPointInSinglePolygon(x: number, y: number, polygonCoords: number[][][]): boolean {
  let inside = false;
  // Iterate over each ring (first is exterior, others are holes)
  for (let i = 0; i < polygonCoords.length; i++) {
    const ring = polygonCoords[i];
    const isExteriorRing = (i === 0);

    for (let j = 0, k = ring.length - 1; j < ring.length; k = j++) {
      const xi = ring[j][0], yi = ring[j][1];
      const xk = ring[k][0], yk = ring[k][1];

      // Check if point is on the horizontal line of an edge
      if (yi === yk && yi === y && x > Math.min(xi, xk) && x < Math.max(xi, xk)) {
        return true; // Point is on an edge, consider it inside
      }

      // Ray-casting algorithm
      const intersect = ((yi > y) !== (yk > y)) &&
                        (x < (xk - xi) * (y - yi) / (yk - yi) + xi);

      if (intersect) {
        inside = !inside;
      }
    }
    // For holes, if inside becomes true, it means the point is inside the hole,
    // which means it's NOT inside the overall polygon.
    if (!isExteriorRing && inside) {
      return false; // Point is inside a hole, so it's outside the main polygon area
    }
  }

  return inside;
}

/**
 * Extracts the ZCTA code from a ZCTA GeoJSON Feature.
 * @param feature - The ZCTA GeoJSON Feature.
 * @returns The 5-digit ZCTA code or "N/A" if not found.
 */
// Renamed to getZctaCodeFromFeature to match your desired import name.
export function getZctaCodeFromFeature(feature: ZCTAFeature | null): string {
  if (!feature) return "N/A";
  const properties = feature.properties; // Using 'any' as GeoJsonProperties is generic
  return properties?.ZCTA5CE10 || properties?.ZCTA5CE20 || "N/A";
}