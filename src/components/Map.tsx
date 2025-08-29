// src/components/Map.tsx
"use client"

import React, {
  useEffect, useRef,  useCallback
  // useState,

} from "react"
import * as L from "leaflet"
import "leaflet/dist/leaflet.css"
import * as turf from "@turf/turf"

// Keep these GeoJSON types as they are fundamental
import type {
  Feature, FeatureCollection, GeoJsonProperties, Geometry,
  // Point
} from "geojson";

// >>>>>>>>>>>>>>>>>>>>>> CORRECTED IMPORT SHARED TYPES <<<<<<<<<<<<<<<<<<<<<<<
// We now only import the correctly defined and exported types
import type {
  PlantFeature, ZCTAFeature,
  // PlantProperties, ZCTAProperties
} from '../types';

import { createPlantMarker } from '../map/icons';
import { getZctaCodeFromFeature } from '../utils/geo';

export type GeoJSONLayerWithData = L.GeoJSON & {
  _geoJsonData?: FeatureCollection;
};

const PLANTS_GEOJSON_PATH = "/EnergyPlants.json"

// Removed all local type definitions here. They are now in src/types.ts.

const defaultZctaStyle = {
  color: "#702963",
  weight: 3,
  opacity: 0.7,
  fillColor: "#D2042D",
  fillOpacity: 0.1,
};

const highlightZctaStyle = {
  weight: 4,
  color: '#666',
  dashArray: '',
  fillOpacity: 0.5
};


interface MapComponentProps {
  initialCenter?: L.LatLngExpression
  initialZoom?: number
  onFeatureClick: (feature: ZCTAFeature, plantsInZcta: PlantFeature[]) => void;
  onZCTAHover: (feature: ZCTAFeature | null, plantsInZcta: PlantFeature[]) => void;
  programmaticZctaFeature?: ZCTAFeature | null;
  zctaGeojsonData: FeatureCollection | null;
}

const MapComponent: React.FC<MapComponentProps> = ({
  initialCenter = [43.073051, -89.401230],
  initialZoom = 10,
  onFeatureClick,
  onZCTAHover,
  programmaticZctaFeature,
  zctaGeojsonData,
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const zctaLayerRef = useRef<GeoJSONLayerWithData | null>(null);
  const plantsLayerRef = useRef<L.GeoJSON | null>(null)
  // Ensure allPlantsRef is Feature[], but its contents will match MyPlantSpecificProperties for plants
  const allPlantsRef = useRef<Feature<Geometry, GeoJsonProperties>[]>([]); // GeoJSON.Feature is the base
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const zctaLayersMapRef = useRef<Map<string, L.Layer>>(new Map());
  const currentProgrammaticHighlightLayerRef = useRef<L.Layer | null>(null);


  const updateTooltipPosition = (e: MouseEvent) => {
    if (tooltipRef.current) {
      tooltipRef.current.style.left = `${e.clientX + 15}px`;
      tooltipRef.current.style.top = `${e.clientY + 15}px`;
    }
  };

  const onEachZCTAFeature = useCallback((feature: ZCTAFeature, layer: L.Layer) => {
    const zctaCode = getZctaCodeFromFeature(feature);
    if (zctaCode) {
      zctaLayersMapRef.current.set(zctaCode, layer);
    }
    layer.on({
      mouseover: (e: L.LeafletMouseEvent) => {
        if (currentProgrammaticHighlightLayerRef.current === e.target) return;

        const highlightLayer = e.target;
        (highlightLayer as L.Path).setStyle(highlightZctaStyle);
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          (highlightLayer as L.Path).bringToFront();
        }

        if (tooltipRef.current) {
          tooltipRef.current.innerText = `ZIP: ${zctaCode || 'N/A'}`;
          tooltipRef.current.style.display = 'block';
          tooltipRef.current.style.left = `${e.originalEvent.clientX + 15}px`;
          tooltipRef.current.style.top = `${e.originalEvent.clientY + 15}px`;
        }
        document.addEventListener('mousemove', updateTooltipPosition);

        const zctaPolygon = feature.geometry;
        const plantsInZcta: PlantFeature[] = [];
        if (allPlantsRef.current && zctaPolygon) {
          allPlantsRef.current.forEach(plantFeature => {
            // Ensure plantFeature is correctly typed when pushed
            if (plantFeature.geometry && plantFeature.geometry.type === 'Point' && (zctaPolygon.type === 'Polygon' || zctaPolygon.type === 'MultiPolygon')) {
              const plantPoint = turf.point(plantFeature.geometry.coordinates as [number, number]);
              if (turf.booleanPointInPolygon(plantPoint, zctaPolygon)) {
                plantsInZcta.push(plantFeature as PlantFeature);
              }
            }
          });
        }
        onZCTAHover(feature, plantsInZcta);
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        if (currentProgrammaticHighlightLayerRef.current !== e.target) {
          (e.target as L.Path).setStyle(defaultZctaStyle);
        }
        onZCTAHover(null, []);

        if (tooltipRef.current) {
          tooltipRef.current.style.display = 'none';
        }
        document.removeEventListener('mousemove', updateTooltipPosition);
      },
      click: (e: L.LeafletMouseEvent) => {
        if (currentProgrammaticHighlightLayerRef.current) {
           const prevZctaCode = getZctaCodeFromFeature((currentProgrammaticHighlightLayerRef.current as L.GeoJSON).feature as ZCTAFeature);
           const prevLayerInCurrentMap = prevZctaCode ? zctaLayersMapRef.current.get(prevZctaCode) : null;
           if (prevLayerInCurrentMap) {
               (prevLayerInCurrentMap as L.Path).setStyle(defaultZctaStyle);
           }
           currentProgrammaticHighlightLayerRef.current = null;
           console.log("Map: Manual click cleared previous programmatic highlight.");
        }

        (e.target as L.Path).setStyle(highlightZctaStyle);
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          (e.target as L.Path).bringToFront();
        }

        const clickedZctaPolygon = feature.geometry;
        const plantsInClickedZcta: PlantFeature[] = [];
        if (allPlantsRef.current && clickedZctaPolygon) {
          allPlantsRef.current.forEach(plantFeature => {
            if (plantFeature.geometry && plantFeature.geometry.type === 'Point' && (clickedZctaPolygon.type === 'Polygon' || clickedZctaPolygon.type === 'MultiPolygon')) {
              const plantPoint = turf.point(plantFeature.geometry.coordinates as [number, number]);
              if (turf.booleanPointInPolygon(plantPoint, clickedZctaPolygon)) {
                plantsInClickedZcta.push(plantFeature as PlantFeature);
              }
            }
          });
        }
        onFeatureClick(feature, plantsInClickedZcta);
      },
    })
  }, [currentProgrammaticHighlightLayerRef, zctaLayersMapRef, tooltipRef, allPlantsRef, onZCTAHover, onFeatureClick]);


  const handleProgrammaticZctaAction = useCallback((feature: ZCTAFeature, attempt = 1) => {
    if (currentProgrammaticHighlightLayerRef.current) {
        const prevZctaCode = getZctaCodeFromFeature((currentProgrammaticHighlightLayerRef.current as L.GeoJSON).feature as ZCTAFeature);
        const prevLayerInCurrentMap = prevZctaCode ? zctaLayersMapRef.current.get(prevZctaCode) : null;
        if (prevLayerInCurrentMap) {
            (prevLayerInCurrentMap as L.Path).setStyle(defaultZctaStyle);
            console.log(`Programmatic Action: Cleared previous highlight for ${prevZctaCode} (Attempt ${attempt}).`);
        } else {
            console.warn(`Programmatic Action: Attempted to clear previous highlight but layer ${prevZctaCode || 'N/A'} was not found in current map references.`);
        }
        currentProgrammaticHighlightLayerRef.current = null;
    }

    if (!leafletMapRef.current || !zctaLayerRef.current || zctaLayersMapRef.current.size === 0) {
        console.warn(`Attempt ${attempt}: Map, ZCTA GeoJSON layer, or layers map not ready. Retrying programmatic action.`);
        if (attempt < 10) {
            setTimeout(() => handleProgrammaticZctaAction(feature, attempt + 1), 200 * attempt);
        } else {
            console.error(`Max retries reached for programmatic ZCTA action. Map or ZCTA layer never became ready.`);
        }
        return;
    }

    const targetZctaCode = getZctaCodeFromFeature(feature);
    if (!targetZctaCode) {
        console.warn(`Attempt ${attempt}: Programmatic ZCTA feature has no valid ZCTA code.`);
        return;
    }

    let layerToHighlight: L.Layer | null | undefined = null;

    layerToHighlight = zctaLayersMapRef.current.get(targetZctaCode);

    if (!layerToHighlight) {
        console.warn(`Attempt ${attempt}: Layer for programmatic ZCTA ${targetZctaCode} NOT FOUND. Retrying... Current zctaLayersMapRef.current.size: ${zctaLayersMapRef.current.size}. Keys in map (first 5):`, Array.from(zctaLayersMapRef.current.keys()).slice(0, 5));
        if (attempt < 10) {
            setTimeout(() => handleProgrammaticZctaAction(feature, attempt + 1), 200 * attempt);
        } else {
            console.error(`Max retries reached for programmatic ZCTA ${targetZctaCode}. Layer could not be found.`);
        }
        return;
    }

    console.log(`Attempt ${attempt}: Programmatic ZCTA action for: ${targetZctaCode}. Layer FOUND:`, layerToHighlight);

    (layerToHighlight as L.Path).setStyle(highlightZctaStyle);
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      (layerToHighlight as L.Path).bringToFront();
    }
    currentProgrammaticHighlightLayerRef.current = layerToHighlight;

    if (layerToHighlight instanceof L.Polygon) {
      const bounds = layerToHighlight.getBounds();
      console.log(`Attempt ${attempt}: Bounds for ZCTA ${targetZctaCode}:`, bounds);
      if (bounds.isValid()) {
          leafletMapRef.current.fitBounds(bounds, { padding: [80, 80] });
          console.log(`Attempt ${attempt}: Map successfully fit to bounds for ZCTA ${targetZctaCode}.`);
      } else {
          console.warn(`Attempt ${attempt}: Invalid bounds for ZCTA ${targetZctaCode}. Cannot fit map to bounds. Falling back to view at center.`);
          if ((layerToHighlight as L.Polygon).getCenter) {
              leafletMapRef.current.setView((layerToHighlight as L.Polygon).getCenter(), 10);
          } else {
              leafletMapRef.current.setZoom(10);
          }
      }
    } else {
        console.warn(`Attempt ${attempt}: Layer for ZCTA ${targetZctaCode} is not a polygon. Cannot use getBounds.`);
    }

    const zctaPolygon = feature.geometry;
    const plantsInZcta: PlantFeature[] = [];
    if (allPlantsRef.current && zctaPolygon) {
      allPlantsRef.current.forEach(plantFeature => {
        if (plantFeature.geometry && plantFeature.geometry.type === 'Point' && (zctaPolygon.type === 'Polygon' || zctaPolygon.type === 'MultiPolygon')) {
          const plantPoint = turf.point(plantFeature.geometry.coordinates as [number, number]);
          if (turf.booleanPointInPolygon(plantPoint, zctaPolygon)) {
            plantsInZcta.push(plantFeature as PlantFeature);
          }
        }
      });
    }
    onFeatureClick(feature, plantsInZcta);
  }, [onFeatureClick, allPlantsRef, leafletMapRef, zctaLayersMapRef, zctaLayerRef]);


  useEffect(() => {
    if (programmaticZctaFeature) {
      handleProgrammaticZctaAction(programmaticZctaFeature);
    } else {
      if (currentProgrammaticHighlightLayerRef.current) {
        const prevZctaCode = getZctaCodeFromFeature((currentProgrammaticHighlightLayerRef.current as L.GeoJSON).feature as ZCTAFeature);
        const prevLayerInCurrentMap = prevZctaCode ? zctaLayersMapRef.current.get(prevZctaCode) : null;
        if (prevLayerInCurrentMap) {
            (prevLayerInCurrentMap as L.Path).setStyle(defaultZctaStyle);
        }
        currentProgrammaticHighlightLayerRef.current = null;
        console.log("Programmatic Effect: Cleared highlight because programmaticZctaFeature is null.");
      }
    }
  }, [programmaticZctaFeature, handleProgrammaticZctaAction, zctaLayersMapRef]);


  useEffect(() => {
    if (mapRef.current && typeof window !== "undefined") {
      if (!leafletMapRef.current) {
        const currentLeafletMap = L.map(mapRef.current).setView(initialCenter as L.LatLngExpression, initialZoom as number)
        leafletMapRef.current = currentLeafletMap;
        console.log("Map: Initial Leaflet map created and set to default view.");

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(currentLeafletMap);

        const tooltipDiv = document.createElement('div');
        tooltipDiv.className = 'zipcode-tooltip';
        tooltipDiv.style.position = 'fixed';
        tooltipDiv.style.background = 'rgba(0, 0, 0, 0.7)';
        tooltipDiv.style.color = 'white';
        tooltipDiv.style.padding = '5px 10px';
        tooltipDiv.style.borderRadius = '5px';
        tooltipDiv.style.pointerEvents = 'none';
        tooltipDiv.style.zIndex = '1000';
        document.body.appendChild(tooltipDiv);
        tooltipRef.current = tooltipDiv;

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
              console.log("Map: Energy Plant layers added.");
            }
          })
          .catch(error => {
            console.error('Error loading Plants GeoJSON:', error);
          });

        setTimeout(() => {
          currentLeafletMap.invalidateSize();
          console.log("Map: Invalidated map size.");
        }, 0);

      } // End if (!leafletMapRef.current) block

      // ZCTA LAYERS: Always check if data is available and layer needs to be added/re-added
      if (zctaGeojsonData && leafletMapRef.current) {
          // Check if zctaLayerRef.current doesn't exist OR if the zctaGeojsonData reference has changed
          // We use a custom property `_geoJsonData` to store the reference to the data that created the layer
          if (!zctaLayerRef.current || (zctaLayerRef.current._geoJsonData !== zctaGeojsonData)) {
              // If zctaLayerRef.current already exists, remove its layers to avoid duplicates/staleness
              if (zctaLayerRef.current) {
                  leafletMapRef.current.removeLayer(zctaLayerRef.current);
                  zctaLayerRef.current = null;
                  zctaLayersMapRef.current.clear(); // Crucial: Clear old ZCTA layer map
                  console.log("Map: Removed existing ZCTA layers and cleared map ref due to new/changed zctaGeojsonData.");
              }

              const newZctaLayer = L.geoJSON(zctaGeojsonData, {
                  style: defaultZctaStyle,
                  onEachFeature: onEachZCTAFeature,
              });
              newZctaLayer.addTo(leafletMapRef.current);
              zctaLayerRef.current = newZctaLayer;

              // Store a reference to the original zctaGeojsonData on the layer for comparison
              zctaLayerRef.current._geoJsonData = zctaGeojsonData;
              console.log("Map: ZCTA GeoJSON layers added/re-added to map.");
          }
      } else if (!zctaGeojsonData && zctaLayerRef.current && leafletMapRef.current) {
          // If zctaGeojsonData becomes null but there's a layer, remove it
          leafletMapRef.current.removeLayer(zctaLayerRef.current);
          zctaLayerRef.current = null;
          zctaLayersMapRef.current.clear();
          console.log("Map: ZCTA GeoJSON data became null. Removed ZCTA layers.");
      }
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        zctaLayerRef.current = null;
        plantsLayerRef.current = null;
        console.log("Map: Cleanup - Leaflet map removed.");
      }
      if (tooltipRef.current) {
        document.body.removeChild(tooltipRef.current);
        tooltipRef.current = null;
      }
      document.removeEventListener('mousemove', updateTooltipPosition);
    };
  }, [initialCenter, initialZoom, onFeatureClick, onZCTAHover, zctaGeojsonData, onEachZCTAFeature]);

  return <div id="map" ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
}

export default React.memo(MapComponent)