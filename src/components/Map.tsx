"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useMapStore } from "@/stores/mapStore";
import type { ZCTAFeature, PlantFeatureCollection, ZCTAFeatureCollection, BorderFeatureCollection, PlantFeature } from '../types';
import { createPlantMarker } from '../map/icons';
import { getZctaCodeFromFeature } from '../utils/geo';

type LeafletMapElement = HTMLDivElement & {
  _leaflet_id?: number;
}

const defaultZctaStyle = { color: "#702963", weight: 1, opacity: 0.7, fillColor: "#D2042D", fillOpacity: 0.01 };
const highlightZctaStyle = { weight: 4, color: '#666', dashArray: '', fillOpacity: 0.1 };
const mgeBorderStyle = { color: "green", weight: 2, opacity: 0.9, fillOpacity: 0.3, fillColor: "green", dashArray: '5, 5' };
const alliantBorderStyle = { color: "orange", weight: 2, opacity: 0.9, fillOpacity: 0.3, fillColor: "orange", dashArray: '5, 5' };


interface MapComponentProps {
  initialCenter?: L.LatLngExpression;
  initialZoom?: number;
  zctaGeojsonData: ZCTAFeatureCollection | null;
  plantsData: PlantFeatureCollection | null;
  mgeBordersData: BorderFeatureCollection | null;
  alliantBordersData: BorderFeatureCollection | null;
}

const MapComponent: React.FC<MapComponentProps> = ({
  initialCenter = [43.073051, -89.401230],
  initialZoom = 10,
  zctaGeojsonData,
  plantsData,
  mgeBordersData,
  alliantBordersData
}) => {
  const mapRef = useRef<LeafletMapElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const { selectPlant } = useMapStore();

  const zctaLayerRef = useRef<L.GeoJSON | null>(null);
  const plantsLayerRef = useRef<L.GeoJSON | null>(null);
  const mgeBorderLayerRef = useRef<L.GeoJSON | null>(null);
  const alliantBorderLayerRef = useRef<L.GeoJSON | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const zctaLayersMapRef = useRef<Map<string, L.Layer>>(new Map());
  const currentSelectedLayerRef = useRef<L.Layer | null>(null);

  const selectedZcta = useMapStore((state) => state.selectedZcta);
  const programmaticZctaFeature = useMapStore((state) => state.programmaticZctaFeature);
  const isZctaVisible = useMapStore((state) => state.isZctaVisible);
  const isMgeVisible = useMapStore((state) => state.isMgeVisible);
  const isAlliantVisible = useMapStore((state) => state.isAlliantVisible);

  const onEachPlantFeature = (feature: PlantFeature, layer: L.Layer) => {
    layer.on({
      click: () => {
        selectPlant(feature);
      },
    });
  };
  
const onEachZCTAFeature = useCallback((feature: ZCTAFeature, layer: L.Layer) => {
    const { selectZcta, hoverZcta, clearProgrammaticFeature, clearSelection } = useMapStore.getState();
    const zctaCode = getZctaCodeFromFeature(feature);
    if (zctaCode) {
      zctaLayersMapRef.current.set(zctaCode, layer);
    }

    layer.on({
      mouseover: (e: L.LeafletMouseEvent) => {
        const targetLayer = e.target as L.Path;
        // Keep hover styles for immediate feedback, but don't set currentSelectedLayerRef
        if (currentSelectedLayerRef.current !== targetLayer) {
          targetLayer.setStyle(highlightZctaStyle);
        }
        if (tooltipRef.current) {
          tooltipRef.current.innerText = `ZIP: ${zctaCode || 'N/A'}`;
          tooltipRef.current.classList.remove('hidden');
        }
        hoverZcta(feature);
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        const targetLayer = e.target as L.Path;
        // Only reset style if it's not the currently selected layer
        if (currentSelectedLayerRef.current !== targetLayer) {
          targetLayer.setStyle(defaultZctaStyle);
        }
        hoverZcta(null);
        if (tooltipRef.current) tooltipRef.current.classList.add('hidden');
      },
      // --- SIMPLIFIED CLICK HANDLER ---
      // This handler now ONLY updates the central state.
      click: () => {
        // If the clicked layer is already selected, clear the selection.
        if (currentSelectedLayerRef.current === layer) {
          clearSelection();
          return;
        }
        // Otherwise, select the new ZCTA.
        if (programmaticZctaFeature) clearProgrammaticFeature();
        selectZcta(feature);
      },
    });
  }, [programmaticZctaFeature]); 

  // const handleProgrammaticZctaAction = useCallback((feature: ZCTAFeature) => {
  //   if (!map) return;
  //   if (currentSelectedLayerRef.current) {
  //       (currentSelectedLayerRef.current as L.Path).setStyle(defaultZctaStyle);
  //   }
  //   const targetZctaCode = getZctaCodeFromFeature(feature);
  //   const layerToHighlight = targetZctaCode ? zctaLayersMapRef.current.get(targetZctaCode) : null;
  //   if (!layerToHighlight) return;
  //   (layerToHighlight as L.Path).setStyle(highlightZctaStyle).bringToFront();
  //   currentSelectedLayerRef.current = layerToHighlight;
  //   if (layerToHighlight instanceof L.Polygon) {
  //       const bounds = layerToHighlight.getBounds();
  //       if (bounds.isValid()) map.fitBounds(bounds, { padding: [80, 80] });
  //   }
  // }, [map]);

  // useEffect(() => {
  //   if (programmaticZctaFeature) {
  //     handleProgrammaticZctaAction(programmaticZctaFeature);
  //   }
  // }, [programmaticZctaFeature, handleProgrammaticZctaAction]);
  
  // useEffect(() => {
  //   if (!selectedZcta && currentSelectedLayerRef.current) {
  //     (currentSelectedLayerRef.current as L.Path).setStyle(defaultZctaStyle);
  //     currentSelectedLayerRef.current = null;
  //   }
  // }, [selectedZcta]);
  
    useEffect(() => {
    // 1. Reset the previously highlighted layer
    if (currentSelectedLayerRef.current) {
      (currentSelectedLayerRef.current as L.Path).setStyle(defaultZctaStyle);
      currentSelectedLayerRef.current = null;
    }

    // 2. If there's a new selected ZCTA, find and highlight its layer
    if (selectedZcta && map) {
      const targetZctaCode = getZctaCodeFromFeature(selectedZcta);
      const layerToHighlight = targetZctaCode ? zctaLayersMapRef.current.get(targetZctaCode) : null;

      if (layerToHighlight) {
        (layerToHighlight as L.Path).setStyle(highlightZctaStyle).bringToFront();
        currentSelectedLayerRef.current = layerToHighlight;

        // Also zoom to the area if it was selected programmatically
        if (programmaticZctaFeature && layerToHighlight instanceof L.Polygon) {
            const bounds = layerToHighlight.getBounds();
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [80, 80] });
            }
        }
      }
    }
  }, [selectedZcta, map, programmaticZctaFeature]); // Reacts to any change in the selected ZCTA



 useEffect(() => {
    if (mapRef.current && !(mapRef.current._leaflet_id)) {
      const mapInstance = L.map(mapRef.current).setView(initialCenter, initialZoom);
      
 L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapInstance);
      
      const tooltipDiv = document.createElement('div');
      tooltipDiv.className = 'fixed hidden rounded bg-black/70 px-2.5 py-1 text-white pointer-events-none z-[1000]';
      document.body.appendChild(tooltipDiv);
      tooltipRef.current = tooltipDiv;
      
      mapInstance.on('mousemove', (e) => {
        if (tooltipRef.current) {
          tooltipRef.current.style.left = `${e.originalEvent.clientX + 15}px`;
          tooltipRef.current.style.top = `${e.originalEvent.clientY + 15}px`;
        }
      });

      setMap(mapInstance);
    }
 }, [initialCenter, initialZoom]);
  
  useEffect(() => {
    return () => {
      if (map) {
        map.remove();
        if (tooltipRef.current && tooltipRef.current.parentNode) {
            tooltipRef.current.parentNode.removeChild(tooltipRef.current);
            tooltipRef.current = null;
        }
      }
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;
    if (zctaLayerRef.current) map.removeLayer(zctaLayerRef.current);
    if (mgeBorderLayerRef.current) map.removeLayer(mgeBorderLayerRef.current);
    if (alliantBorderLayerRef.current) map.removeLayer(alliantBorderLayerRef.current);
    if (plantsLayerRef.current) map.removeLayer(plantsLayerRef.current);

    if (isZctaVisible && zctaGeojsonData) {
      zctaLayersMapRef.current.clear();
      const newZctaLayer = L.geoJSON(zctaGeojsonData, { style: defaultZctaStyle, onEachFeature: onEachZCTAFeature }).addTo(map);
      zctaLayerRef.current = newZctaLayer;
    }

    if (isMgeVisible && mgeBordersData) {
      mgeBorderLayerRef.current = L.geoJSON(mgeBordersData, { style: mgeBorderStyle, interactive: false }).addTo(map);
    }

    if (isAlliantVisible && alliantBordersData) {
      alliantBorderLayerRef.current = L.geoJSON(alliantBordersData, { style: alliantBorderStyle, interactive: false }).addTo(map);
    }

    if (plantsData) {
      plantsLayerRef.current = L.geoJSON(plantsData, { 
        pointToLayer: createPlantMarker,
        onEachFeature: onEachPlantFeature 
      }).addTo(map);
    }
  }, [map, plantsData, mgeBordersData, alliantBordersData, zctaGeojsonData, onEachZCTAFeature, isZctaVisible, isMgeVisible, isAlliantVisible, selectPlant]);
  
  return <div id="map" ref={mapRef} className="h-full w-full"></div>;
}

export default React.memo(MapComponent);