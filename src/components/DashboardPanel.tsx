"use client";

import React, { useState } from 'react';
import Image from "next/image";
import { useMapStore } from '@/stores/mapStore';
import {
  SOLAR_ICON_PATH, NATURAL_GAS_ICON_PATH, WIND_ICON_PATH,
  PETROLEUM_ICON_PATH, COAL_ICON_PATH, INDUSTRIAL_BATTERY_ICON_PATH,
  HYDROELECTRIC_ICON_PATH
} from '../map/icon-paths';

interface DashboardPanelProps {
  onZipCodeSubmit: (zipCode: string) => void;
}

const getSourceIconPath = (primarySource?: string | null): string | null => {
  switch (primarySource) {
    case "Solar": return SOLAR_ICON_PATH;
    case "Natural Gas": return NATURAL_GAS_ICON_PATH;
    case "Wind": return WIND_ICON_PATH;
    case "Petroleum": return PETROLEUM_ICON_PATH;
    case "Coal": return COAL_ICON_PATH;
    case "Battery Storage": return INDUSTRIAL_BATTERY_ICON_PATH;
    case "Hydroelectric": return HYDROELECTRIC_ICON_PATH;
    default: return null;
  }
};

const DashboardPanel: React.FC<DashboardPanelProps> = ({ onZipCodeSubmit }) => {
  // store state
  const isDashboardVisible   = useMapStore((s) => s.isDashboardVisible);
  // const showDashboard        = useMapStore((s) => s.showDashboard);
  const hideDashboard        = useMapStore((s) => s.hideDashboard);

  const selectedZcta         = useMapStore((s) => s.selectedZcta);
  const plantsInSelectedZcta = useMapStore((s) => s.plantsInSelectedZcta);
  const hoveredZcta          = useMapStore((s) => s.hoveredZcta);
  const plantsInHoveredZcta  = useMapStore((s) => s.plantsInHoveredZcta);
  const isZctaVisible        = useMapStore((s) => s.isZctaVisible);
  // const isMgeVisible         = useMapStore((s) => s.isMgeVisible);
  // const isAlliantVisible     = useMapStore((s) => s.isAlliantVisible);
  // const toggleLayerVisibility= useMapStore((s) => s.toggleLayerVisibility);

  // local state
  const [zipCodeInput, setZipCodeInput] = useState<string>("");
  const [expandedPlantIndex, setExpandedPlantIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCodeInput.trim()) {
      onZipCodeSubmit(zipCodeInput.trim());
    }
  };

  const handlePlantClick = (index: number) => {
    setExpandedPlantIndex(expandedPlantIndex === index ? null : index);
  };

  const displayZcta   = selectedZcta || hoveredZcta;
  const displayPlants = selectedZcta ? plantsInSelectedZcta : plantsInHoveredZcta;
  const isHovering    = !selectedZcta && !!hoveredZcta;

  // When hidden: show a fixed button in the top-right of the screen
if (!isDashboardVisible) return null;

  return (
    <div
      className="absolute top-5 right-5 z-[1000] flex w-72 max-w-sm flex-col rounded-lg bg-white/95 p-5 shadow-2xl max-h-[calc(100vh-40px)] overflow-y-auto"
      role="region"
      aria-label="Dashboard panel"
    >
      {/* Header with close button */}
      <div className="mb-4 mt-0 border-b border-gray-200 pb-2.5 flex items-center justify-between">
        <h2 className="text-2xl text-gray-800 m-0">Energy Dashboard</h2>
        <button
          onClick={hideDashboard}
          className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800"
          aria-label="Close dashboard panel"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ZIP form */}
      <form onSubmit={handleSubmit} className="mb-5 border-b border-gray-300 pb-4">
        <label htmlFor="zip-input" className="block text-sm font-medium text-gray-700">
          Find by ZIP Code
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            id="zip-input"
            value={zipCodeInput}
            onChange={(e) => setZipCodeInput(e.target.value)}
            placeholder="e.g., 53703"
            maxLength={5}
            className="block w-full flex-1 rounded-none rounded-l-md border border-gray-300 px-3 py-2 text-black placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <button
            type="submit"
            disabled={!zipCodeInput.trim()}
            className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Go
          </button>
        </div>
      </form>

      {/* Legend and Layer Toggles */}
      {/* <div className="mb-5 border-b border-gray-300 pb-4">
        <h3 className="text-base font-medium text-gray-800">Legend</h3>
        <p className="text-sm text-gray-600">Click Checkbox below to turn map layer on and off </p>
        <div className="mt-2 space-y-2">
          <div className="flex items-center">
            <input
              id="zcta-toggle" type="checkbox"
              checked={isZctaVisible}
              onChange={() => toggleLayerVisibility('zcta')}
              className="h-4 w-4 rounded border-gray-300 text-indigo-800 focus:ring-indigo-800"
            />
            <label htmlFor="zcta-toggle" className="ml-3 block text-sm text-gray-900">
              Dane County ZIP Codes
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="mge-toggle" type="checkbox"
              checked={isMgeVisible}
              onChange={() => toggleLayerVisibility('mge')}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="mge-toggle" className="ml-3 block text-sm text-gray-900">
              MGE Service Area
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="alliant-toggle" type="checkbox"
              checked={isAlliantVisible}
              onChange={() => toggleLayerVisibility('alliant')}
              className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="alliant-toggle" className="ml-3 block text-sm text-gray-900">
              Alliant Service Area
            </label>
          </div>
        </div>
      </div> */}

      {/* ZCTA / Plants */}
      <div className="flex-grow">
        {displayZcta && isZctaVisible ? (
          <div>
            <h3 className={`text-lg font-bold ${isHovering ? 'text-gray-500' : 'text-blue-800'}`}>
              ZIP Code: {displayZcta.properties?.ZCTA5CE10}
              {isHovering && <span className="text-sm font-normal"> (Hovering)</span>}
            </h3>

            {displayPlants.length === 0 ? (
              <p className="text-sm text-gray-600 mt-2">No known energy plants in this area.</p>
            ) : (
              <ul className="mt-2 list-none space-y-1.5 p-0">
                {displayPlants.map((plant, index) => {
                  const sourceIconPath = getSourceIconPath(plant.properties.primarySource);
                  return (
                    <li key={plant.properties.name || `plant-${index}`}>
                      <div
                        onClick={() => handlePlantClick(index)}
                        className="flex w-full cursor-pointer items-center rounded bg-blue-600 p-2 text-white transition-colors duration-200 hover:bg-blue-800"
                      >
                        {sourceIconPath && (
                          <Image
                            src={sourceIconPath}
                            alt={plant.properties.primarySource || 'Energy'}
                            width={18}
                            height={18}
                            className="mr-3 flex-shrink-0 rounded-full border border-white/50 object-cover"
                          />
                        )}
                        <span className="flex-grow text-left text-sm font-medium">
                          {plant.properties.name || 'Unnamed Plant'}
                        </span>
                      </div>

                      {expandedPlantIndex === index && (
                        <div className="mt-2 border-t border-gray-200 pt-2 pl-2 text-xs text-black">
                          <p><strong>City:</strong> {plant.properties.cityName || 'N/A'}</p>
                          <p><strong>Utility:</strong> {plant.properties.utilityName || 'N/A'}</p>
                          <p><strong>Sector:</strong> {plant.properties.sectorName || 'N/A'}</p>
                          <p><strong>Technology:</strong> {plant.properties.techDesc || 'N/A'}</p>
                          <p><strong>Source:</strong> {plant.properties.primarySource || 'N/A'}</p>
                          <p><strong>Installed MW:</strong> {plant.properties.installedMW ?? 'N/A'}</p>
                          <p><strong>Total MW:</strong> {plant.properties.totalMW ?? 'N/A'}</p>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center pt-10">
            <p className="text-center text-gray-500">
              {isZctaVisible
                ? "Click or hover on a ZIP code to see energy plant details."
                : "Enable the 'ZIP Code Areas' layer to view plant details."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPanel;
