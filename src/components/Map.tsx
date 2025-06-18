// src/components/Map.tsx
"use client"

import React, { useEffect, useRef } from "react"
import * as L from "leaflet"
import "leaflet/dist/leaflet.css"
import * as turf from "@turf/turf"

import type { Feature, FeatureCollection, Geometry, GeoJsonProperties } from "geojson"

const ZCTA_GEOJSON_PATH = "/Wisc.JSON"
const PLANTS_GEOJSON_PATH = "/EnergyPlants.json" // Path to your plants GeoJSON file

interface MapComponentProps {
  initialCenter?: L.LatLngExpression
  initialZoom?: number
  onFeatureClick: (feature: Feature) => void // For clicked ZCTA (dashboard update)
  onZCTAHover: (feature: Feature | null, plantsInZcta: string[]) => void // For hovered ZCTA and plants
}

const MapComponent: React.FC<MapComponentProps> = ({
  initialCenter = [44.5, -89.5], // Centered on Wisconsin
  initialZoom = 7,                 // Zoomed out to see the state
  onFeatureClick,
  onZCTAHover, // New prop for hover events
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const zctaLayerRef = useRef<L.GeoJSON | null>(null)
  const plantsLayerRef = useRef<L.GeoJSON | null>(null) // Ref for plants layer
  const allPlantsRef = useRef<Feature[]>([]); // To store all loaded plant features for spatial analysis

  // Removed the useEffect for L.Icon.Default.mergeOptions as we are now using L.circleMarker.

  // Main useEffect for map initialization and feature handling
  useEffect(() => {
    const zctaStyle = {
      color: "#8B0000",
      weight: 2,
      opacity: 0.7,
      fillColor: "#CD5C5C",
      fillOpacity: 0.2,
    }

    if (mapRef.current && typeof window !== "undefined") {
      if (!leafletMapRef.current) {
        // Added check for container dimensions for robustness
        if (mapRef.current.clientWidth === 0 || mapRef.current.clientHeight === 0) {
            console.warn("Map container has zero dimensions. Deferring map initialization.");
            return; // Exit early, useEffect will re-run on next render cycle
        }

        const currentLeafletMap = L.map(mapRef.current).setView(initialCenter as L.LatLngExpression, initialZoom as number)
        leafletMapRef.current = currentLeafletMap

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(currentLeafletMap)

        // Function to create simple circle markers for plants
        const createPlantMarker = (feature: Feature, latlng: L.LatLng) => {
          return L.circleMarker(latlng, { // Using L.circleMarker for simple dots
            radius: 5,                   // Size of the dot
            fillColor: "#0078FF",        // Blue fill color
            color: "#000",               // Black outline
            weight: 1,                   // Outline thickness
            opacity: 1,                  // Outline opacity
            fillOpacity: 0.8             // Fill opacity
          }).bindTooltip(feature.properties?.name || 'Energy Plant'); // Add tooltip for plant name on hover
        };

        const onEachZCTAFeature = (feature: Feature, layer: L.Layer) => {
          layer.on({
            mouseover: (e: L.LeafletMouseEvent) => {
              const highlightLayer = e.target;
              highlightLayer.setStyle({
                weight: 4,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.5
              });
              if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                highlightLayer.bringToFront();
              }

              const zctaPolygon = feature.geometry;
              const plantsInZcta: string[] = [];

              if (allPlantsRef.current && zctaPolygon) {
                allPlantsRef.current.forEach(plantFeature => {
                  if (plantFeature.geometry && plantFeature.geometry.type === 'Point' && (zctaPolygon.type === 'Polygon' || zctaPolygon.type === 'MultiPolygon')) {
                    const plantPoint = turf.point(plantFeature.geometry.coordinates as [number, number]);
                    if (turf.booleanPointInPolygon(plantPoint, zctaPolygon)) {
                      plantsInZcta.push(plantFeature.properties?.name || 'Unnamed Plant');
                    }
                  }
                });
              }
              onZCTAHover(feature, plantsInZcta);
            },
            mouseout: (e: L.LeafletMouseEvent) => {
              (e.target as L.Path).setStyle(zctaStyle);
              onZCTAHover(null, []);
            },
            click: (e: L.LeafletMouseEvent) => {
              onFeatureClick(feature);
            },
          })
        }

        fetch(ZCTA_GEOJSON_PATH)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            return response.json()
          })
          .then((data: Feature | FeatureCollection) => {
            if (currentLeafletMap) {
              let finalGeojsonData: FeatureCollection
              if (data.type === "Feature") {
                finalGeojsonData = {
                  type: "FeatureCollection",
                  features: [data as Feature<Geometry, GeoJsonProperties>],
                }
              } else {
                finalGeojsonData = data as FeatureCollection<Geometry, GeoJsonProperties>
              }

              zctaLayerRef.current = L.geoJSON(finalGeojsonData, {
                style: zctaStyle,
                onEachFeature: onEachZCTAFeature,
              }).addTo(currentLeafletMap)
            }
          })
          .catch((error) => {
            console.error("Error loading ZCTA GeoJSON:", error)
          })

        fetch(PLANTS_GEOJSON_PATH)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data: FeatureCollection) => {
            allPlantsRef.current = data.features as Feature[];
            if (currentLeafletMap) {
              plantsLayerRef.current = L.geoJSON(data, {
                pointToLayer: createPlantMarker // Use custom circle marker function
              }).addTo(currentLeafletMap);
            }
          })
          .catch(error => {
            console.error('Error loading Plants GeoJSON:', error);
          });

        setTimeout(() => {
          currentLeafletMap.invalidateSize();
        }, 0);

      }
      // This 'else' block remains empty.
    }

    // Cleanup function for when the component unmounts
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        zctaLayerRef.current = null;
        plantsLayerRef.current = null;
      }
    };
  }, [initialCenter, initialZoom, onFeatureClick, onZCTAHover]);

  return <div id="map" ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
}

export default React.memo(MapComponent)