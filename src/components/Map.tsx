"use client";

// Tool Imports 
import React, { useEffect, useRef, useCallback, useState } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";

// --- Type Imports ---
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import type { PlantFeature, ZCTAFeature, PlantFeatureCollection, ZCTAFeatureCollection, BorderFeatureCollection } from '../types';

// Custom Function and Resource Import
import { createPlantMarker } from '../map/icons';
import { getZctaCodeFromFeature } from '../utils/geo';

export type GeoJSONLayerWithData = L.GeoJSON & {
  _geoJsonData?: FeatureCollection;
};


const defaultZctaStyle = {
  color: "#702963", weight: 1, opacity: 0.7, fillColor: "#D2042D", fillOpacity: 0.01,
};
const highlightZctaStyle = {
  weight: 4, color: '#666', dashArray: '', fillOpacity: 0.1
};
const mgeBorderStyle = {
  color: "green", weight: 2, opacity: 0.9, fillOpacity: 0.3, fillColor: "green", dashArray: '5, 5'
};
const alliantBorderStyle = {
  color: "orange", weight: 2, opacity: 0.9, fillOpacity: 0.3, fillColor: "orange", dashArray: '5, 5'
};


interface MapComponentProps {
  initialCenter?: L.LatLngExpression;
  initialZoom?: number;
  onFeatureClick: (feature: ZCTAFeature, plantsInZcta: PlantFeature[]) => void;
  onZCTAHover: (feature: ZCTAFeature | null, plantsInZcta: PlantFeature[]) => void;
  programmaticZctaFeature?: ZCTAFeature | null;
  zctaGeojsonData: ZCTAFeatureCollection | null;
  plantsData: PlantFeatureCollection | null;
  mgeBordersData: BorderFeatureCollection | null;
  alliantBordersData: BorderFeatureCollection | null;
}

const MapComponent: React.FC<MapComponentProps> = ({
  initialCenter = [43.073051, -89.401230],
  initialZoom = 10,
  onFeatureClick,
  onZCTAHover,
  programmaticZctaFeature,
  zctaGeojsonData,
  plantsData,
  mgeBordersData,
  alliantBordersData
}) => {
  // create map ref and set a state for the initial rendering of the map
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);


  const zctaLayerRef = useRef<GeoJSONLayerWithData | null>(null);
  const plantsLayerRef = useRef<L.GeoJSON | null>(null);
  const mgeBorderLayerRef = useRef<L.GeoJSON | null>(null);
  const alliantBorderLayerRef = useRef<L.GeoJSON | null>(null);
  const allPlantsRef = useRef<Feature<Geometry, GeoJsonProperties>[]>([]);
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
        (e.target as L.Path).setStyle(highlightZctaStyle).bringToFront();

        if (tooltipRef.current) {
          tooltipRef.current.innerText = `ZIP: ${zctaCode || 'N/A'}`;
          tooltipRef.current.style.display = 'block';
          tooltipRef.current.style.left = `${e.originalEvent.clientX + 15}px`;
          tooltipRef.current.style.top = `${e.originalEvent.clientY + 15}px`;
        }
        document.addEventListener('mousemove', updateTooltipPosition);

        const zctaPolygon = feature.geometry;
        const plantsInZcta: PlantFeature[] = [];
        if (allPlantsRef.current && zctaPolygon && (zctaPolygon.type === 'Polygon' || zctaPolygon.type === 'MultiPolygon')) {
          allPlantsRef.current.forEach(plantFeature => {
            if (plantFeature.geometry?.type === 'Point') {
              if (turf.booleanPointInPolygon(plantFeature.geometry, zctaPolygon)) {
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

        if (tooltipRef.current) tooltipRef.current.style.display = 'none';
        document.removeEventListener('mousemove', updateTooltipPosition);
      },
      click: (e: L.LeafletMouseEvent) => {
        if (currentProgrammaticHighlightLayerRef.current) {
           (currentProgrammaticHighlightLayerRef.current as L.Path).setStyle(defaultZctaStyle);
           currentProgrammaticHighlightLayerRef.current = null;
        }
        (e.target as L.Path).setStyle(highlightZctaStyle).bringToFront();

        const clickedZctaPolygon = feature.geometry;
        const plantsInClickedZcta: PlantFeature[] = [];
        if (allPlantsRef.current && clickedZctaPolygon && (clickedZctaPolygon.type === 'Polygon' || clickedZctaPolygon.type === 'MultiPolygon')) {
          allPlantsRef.current.forEach(plantFeature => {
            if (plantFeature.geometry?.type === 'Point') {
              if (turf.booleanPointInPolygon(plantFeature.geometry, clickedZctaPolygon)) {
                plantsInClickedZcta.push(plantFeature as PlantFeature);
              }
            }
          });
        }
        onFeatureClick(feature, plantsInClickedZcta);
      },
    });
  }, [onZCTAHover, onFeatureClick]);


  const handleProgrammaticZctaAction = useCallback((feature: ZCTAFeature) => {
    if (!map || zctaLayersMapRef.current.size === 0) return;

    if (currentProgrammaticHighlightLayerRef.current) {
        (currentProgrammaticHighlightLayerRef.current as L.Path).setStyle(defaultZctaStyle);
        currentProgrammaticHighlightLayerRef.current = null;
    }

    const targetZctaCode = getZctaCodeFromFeature(feature);
    if (!targetZctaCode) return;
    
    const layerToHighlight = zctaLayersMapRef.current.get(targetZctaCode);
    if (!layerToHighlight) return;

    (layerToHighlight as L.Path).setStyle(highlightZctaStyle).bringToFront();
    currentProgrammaticHighlightLayerRef.current = layerToHighlight;

    // --- FIX ---
    // 1. Removed `L.MultiPolygon` which does not exist as a class.
    // 2. `instanceof L.Polygon` correctly handles both Polygon and MultiPolygon
    //    geometries and acts as a type guard for the .getBounds() call.
    if (layerToHighlight instanceof L.Polygon) {
        const bounds = layerToHighlight.getBounds();
        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [80, 80] });
        }
    }
  }, [map]);

  // Programmatic ZCTA Use Effect

  useEffect(() => {
    if (programmaticZctaFeature) {
      handleProgrammaticZctaAction(programmaticZctaFeature);
    }
  }, [programmaticZctaFeature, handleProgrammaticZctaAction]);

// Map Initialization UseEffect
useEffect(() => {
    if (mapRef.current && !map) {
      const mapInstance = L.map(mapRef.current).setView(initialCenter, initialZoom);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapInstance);
      
      const tooltipDiv = document.createElement('div');
      tooltipDiv.className = 'zipcode-tooltip';
      tooltipDiv.style.position = 'fixed';
      tooltipDiv.style.color = 'white';
      tooltipDiv.style.padding = '5px 10px';
      tooltipDiv.style.borderRadius = '5px';
      tooltipDiv.style.pointerEvents = 'none';
      tooltipDiv.style.zIndex = '1000';
      document.body.appendChild(tooltipDiv);
      tooltipRef.current = tooltipDiv;

      setMap(mapInstance);
      setTimeout(() => mapInstance.invalidateSize(), 0);

      // This cleanup function is crucial. It's returned by the effect,
      // so it captures `mapInstance` from this specific render.
      // When the component unmounts (even in Strict Mode), this will be called.
      return () => {
        mapInstance.remove();
        if (tooltipRef.current) {
          document.body.removeChild(tooltipRef.current);
          tooltipRef.current = null;
        }
      };
    }
  }, []); // <-- Empty dependency array is correct and intentional.

  useEffect(() => {
    // Don't do anything until the map is initialized
    if (!map) return;
    // Clear existing layers to prevent duplicates when data changes
    if (plantsLayerRef.current) map.removeLayer(plantsLayerRef.current);
    if (mgeBorderLayerRef.current) map.removeLayer(mgeBorderLayerRef.current);
    if (alliantBorderLayerRef.current) map.removeLayer(alliantBorderLayerRef.current);
    if (zctaLayerRef.current) map.removeLayer(zctaLayerRef.current);
    
    // Add Plants Layer
    if (plantsData) {
      allPlantsRef.current = plantsData.features;
      plantsLayerRef.current = L.geoJSON(plantsData, {
        pointToLayer: createPlantMarker
      }).addTo(map);
    }
    
    // Add MGE Borders Layer
    if (mgeBordersData) {
      mgeBorderLayerRef.current = L.geoJSON(mgeBordersData, {
        style: mgeBorderStyle, interactive: false
      }).addTo(map);
    }
    
    // Add Alliant Borders Layer
    if (alliantBordersData) {
      alliantBorderLayerRef.current = L.geoJSON(alliantBordersData, {
        style: alliantBorderStyle, interactive: false
      }).addTo(map);
    }

    // Add ZCTA Layer
    if (zctaGeojsonData) {
      zctaLayersMapRef.current.clear(); // Clear the old lookup map
      const newZctaLayer = L.geoJSON(zctaGeojsonData, {
          style: defaultZctaStyle, onEachFeature: onEachZCTAFeature,
      }).addTo(map);
      zctaLayerRef.current = newZctaLayer;
    }

  }, [map, plantsData, mgeBordersData, alliantBordersData, zctaGeojsonData, onEachZCTAFeature]);



  return <div id="map" ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
}

export default React.memo(MapComponent);
