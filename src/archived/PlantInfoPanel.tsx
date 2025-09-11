// src/components/PlantInfoPanel.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useMapStore } from './mapStore_plants';
// import {
//   SOLAR_ICON_PATH, NATURAL_GAS_ICON_PATH, WIND_ICON_PATH,
//   PETROLEUM_ICON_PATH, COAL_ICON_PATH, INDUSTRIAL_BATTERY_ICON_PATH,
//   HYDROELECTRIC_ICON_PATH
// } from '../map/icon-paths';
// import Image from "next/image";


// const getSourceIconPath = (primarySource?: string | null): string | null => {
//   switch (primarySource) {
//     case "Solar": return SOLAR_ICON_PATH;
//     case "Natural Gas": return NATURAL_GAS_ICON_PATH;
//     case "Wind": return WIND_ICON_PATH;
//     case "Petroleum": return PETROLEUM_ICON_PATH;
//     case "Coal": return COAL_ICON_PATH;
//     case "Battery Storage": return INDUSTRIAL_BATTERY_ICON_PATH;
//     case "Hydroelectric": return HYDROELECTRIC_ICON_PATH;
//     default: return null;
//   }
// };



const PlantInfoPanel: React.FC = () => {

    
  // --- Store State ---
  const selectedPlant = useMapStore((s) => s.selectedPlant);

  // --- Local State ---
    const [isVisible, setIsVisible] = useState<boolean>(true);
      //const [expandedPlantIndex, setExpandedPlantIndex] = useState<number | null>(null);
  //const [isPlantPanelVisible, setIsPlantPanelVisible] = useState<boolean>(true);

  // When a new plant is selected, make sure the panel is visible
  useEffect(() => {
    if (selectedPlant) {
      setIsVisible(true);
    }
  }, [selectedPlant]);

  // If no plant is selected, or the panel is manually closed, render nothing
  if (!selectedPlant || !isVisible) {
    return null;
  }

  return (
    <div className="absolute top-24 right-5 z-[1000] flex w-72 max-w-sm flex-col rounded-lg bg-white/95 p-5 shadow-2xl">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
        <h3 className="text-lg font-bold font-gemunu text-green-800">Selected Plant</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800"
          aria-label="Close selected plant panel"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="mt-2 pt-2 pl-2 text-xs text-black">
        <p><strong>Name:</strong> {selectedPlant.properties.name || 'N/A'}</p>
        <p><strong>City:</strong> {selectedPlant.properties.cityName || 'N/A'}</p>
        <p><strong>Utility:</strong> {selectedPlant.properties.utilityName || 'N/A'}</p>
        <p><strong>Sector:</strong> {selectedPlant.properties.sectorName || 'N/A'}</p>
        <p><strong>Technology:</strong> {selectedPlant.properties.techDesc || 'N/A'}</p>
        <p><strong>Source:</strong> {selectedPlant.properties.primarySource || 'N/A'}</p>
        <p><strong>Installed MW:</strong> {selectedPlant.properties.installedMW ?? 'N/A'}</p>
        <p><strong>Total MW:</strong> {selectedPlant.properties.totalMW ?? 'N/A'}</p>
      </div>
    </div>
  );
};

export default PlantInfoPanel;