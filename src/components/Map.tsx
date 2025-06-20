// src/components/Map.tsx
"use client"

import React, { useEffect, useRef } from "react"
import * as L from "leaflet"
import "leaflet/dist/leaflet.css"
import * as turf from "@turf/turf"

import type { Feature, FeatureCollection, Geometry, GeoJsonProperties } from "geojson"

const ZCTA_GEOJSON_PATH = "/t.json"
const PLANTS_GEOJSON_PATH = "/EnergyPlants.json" // Path to your plants GeoJSON file

interface MapComponentProps {
  initialCenter?: L.LatLngExpression
  initialZoom?: number
  // CORRECTED: Add plantsInZcta to the onFeatureClick signature
  onFeatureClick: (feature: Feature, plantsInZcta: string[]) => void;
  onZCTAHover: (feature: Feature | null, plantsInZcta: string[]) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  initialCenter = [44.5, -89.5], // Centered on Wisconsin
  initialZoom = 7,                 // Zoomed out to see the state
  onFeatureClick,
  onZCTAHover,
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const zctaLayerRef = useRef<L.GeoJSON | null>(null)
  const plantsLayerRef = useRef<L.GeoJSON | null>(null)
  const allPlantsRef = useRef<Feature[]>([]);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  // Define updateTooltipPosition here, within the useEffect's scope
  // but accessible for cleanup. It needs to be defined outside the
  // `if (!leafletMapRef.current)` block.
  const updateTooltipPosition = (e: MouseEvent) => {
    if (tooltipRef.current) {
      tooltipRef.current.style.left = `${e.clientX + 15}px`;
      tooltipRef.current.style.top = `${e.clientY + 15}px`;
    }
  };

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
        if (mapRef.current.clientWidth === 0 || mapRef.current.clientHeight === 0) {
            console.warn("Map container has zero dimensions. Deferring map initialization.");
            return;
        }

        const currentLeafletMap = L.map(mapRef.current).setView(initialCenter as L.LatLngExpression, initialZoom as number)
        leafletMapRef.current = currentLeafletMap

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(currentLeafletMap)

        const tooltipDiv = document.createElement('div');
        tooltipDiv.className = 'zipcode-tooltip';
        tooltipDiv.style.position = 'fixed';
        tooltipDiv.style.background = 'rgba(0, 0, 0, 0.7)';
        tooltipDiv.style.color = 'white';
        tooltipDiv.style.padding = '5px 10px';
        tooltipDiv.style.borderRadius = '5px';
        tooltipDiv.style.pointerEvents = 'none';
        tooltipDiv.style.zIndex = '1000';
        tooltipDiv.style.display = 'none';
        document.body.appendChild(tooltipDiv);
        tooltipRef.current = tooltipDiv;

        // Function to create simple circle markers for plants
        const createPlantMarker = (feature: Feature, latlng: L.LatLng) => {
          return L.circleMarker(latlng, {
            radius: 5,
            fillColor: "#0078FF",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          }).bindTooltip(feature.properties?.name || 'Energy Plant');
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

              if (tooltipRef.current) {
                const zctaCode = (feature.properties?.ZCTA5CE10 || feature.properties?.ZCTA5CE20);
                tooltipRef.current.innerText = `ZIP: ${zctaCode || 'N/A'}`;
                tooltipRef.current.style.display = 'block';
                tooltipRef.current.style.left = `${e.originalEvent.clientX + 15}px`;
                tooltipRef.current.style.top = `${e.originalEvent.clientY + 15}px`;
              }
              document.addEventListener('mousemove', updateTooltipPosition);


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

              if (tooltipRef.current) {
                tooltipRef.current.style.display = 'none';
              }
              document.removeEventListener('mousemove', updateTooltipPosition);
            },
            click: (e: L.LeafletMouseEvent) => {
              // Recalculate plantsInZcta for the click (or reuse the one from mouseover if performance allows caching)
              const clickedZctaPolygon = feature.geometry;
              const plantsInClickedZcta: string[] = [];

              if (allPlantsRef.current && clickedZctaPolygon) {
                allPlantsRef.current.forEach(plantFeature => {
                  if (plantFeature.geometry && plantFeature.geometry.type === 'Point' && (clickedZctaPolygon.type === 'Polygon' || clickedZctaPolygon.type === 'MultiPolygon')) {
                    const plantPoint = turf.point(plantFeature.geometry.coordinates as [number, number]);
                    if (turf.booleanPointInPolygon(plantPoint, clickedZctaPolygon)) {
                      plantsInClickedZcta.push(plantFeature.properties?.name || 'Unnamed Plant');
                    }
                  }
                });
              }
              onFeatureClick(feature, plantsInClickedZcta); // Pass plants with the click
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
                pointToLayer: createPlantMarker
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
    }

    // Cleanup function
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        zctaLayerRef.current = null;
        plantsLayerRef.current = null;
      }
      if (tooltipRef.current) {
        document.body.removeChild(tooltipRef.current);
        tooltipRef.current = null;
      }
      // Always remove the mousemove listener during cleanup
      document.removeEventListener('mousemove', updateTooltipPosition);
    };
  }, [initialCenter, initialZoom, onFeatureClick, onZCTAHover]); // Dependencies for useEffect

  return <div id="map" ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
}

export default React.memo(MapComponent)