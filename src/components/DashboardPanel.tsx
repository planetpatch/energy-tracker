"use client";

import React from 'react';
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
  const activePanel           = useMapStore((state) => state.activePanel);
  const selectedZcta          = useMapStore((state) => state.selectedZcta);
  const plantsInSelectedZcta  = useMapStore((state) => state.plantsInSelectedZcta);
  const isZctaVisible         = useMapStore((state) => state.isZctaVisible);
  const isMgeVisible          = useMapStore((state) => state.isMgeVisible);
  const isAlliantVisible      = useMapStore((state) => state.isAlliantVisible);
  const toggleLayerVisibility = useMapStore((state) => state.toggleLayerVisibility);

  if (activePanel !== 'dashboard') return null;

  const idZcta = "layer-zcta";
  const idMge = "layer-mge";
  const idAlliant = "layer-alliant";

  return (
    <div
      id="dashboard-panel"
      role="region"
      aria-labelledby="dashboard-title"
      className="fixed bottom-5 left-5 right-5 z-[1000] md:h-[15vh] h-auto transition-opacity duration-500 ease-in-out animate-fade-in"
    >
      <div className="relative w-full h-full bg-white/80 backdrop-blur-md rounded-lg shadow-2xl p-4 pt-4">
        <div className="flex h-full w-full items-start justify-between gap-6">

          <div className="flex-1 h-full overflow-y-auto">
            {selectedZcta ? (
              <div>
                <h3 id="dashboard-title" className="text-base font-bold text-blue-800">
                  Plants in ZIP: {selectedZcta.properties?.ZCTA5CE10}
                </h3>
                {plantsInSelectedZcta.length === 0 ? (
                  <p className="text-xs text-gray-600 mt-1">No known energy plants in this area.</p>
                ) : (
                  <ul className="mt-1 list-none space-y-1 p-0">
                    {plantsInSelectedZcta.map((plant, index) => {
                      const sourceIconPath = getSourceIconPath(plant.properties.primarySource);
                      return (
                        <li key={plant.properties.name || `plant-${index}`}>
                          <div className="flex w-full items-center rounded bg-blue-600 p-1 text-white">
                            {sourceIconPath && (
                              <Image
                                src={sourceIconPath}
                                alt={plant.properties.primarySource || 'Energy'}
                                width={14}
                                height={14}
                                className="mr-2 flex-shrink-0 rounded-full"
                              />
                            )}
                            <span className="flex-grow text-left text-xs font-medium">
                              {plant.properties.name || 'Unnamed Plant'}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-sm text-gray-500">
                  Click a ZIP code on the map<br />to see plant details.
                </p>
              </div>
            )}
          </div>

          <div className="w-1/4 max-w-xs h-full border-l border-gray-200 pl-8">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Map Layers</h3>
            <div className="space-y-1">
              <div className="flex items-center text-xs">
                <input
                  id={idZcta}
                  type="checkbox"
                  checked={isZctaVisible}
                  onChange={() => toggleLayerVisibility('zcta')}
                  className="h-3 w-3 rounded-sm border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor={idZcta} className="ml-2 text-gray-800 cursor-pointer">
                  ZIP Code Areas
                </label>
              </div>
              <div className="flex items-center text-xs">
                <input
                  id={idMge}
                  type="checkbox"
                  checked={isMgeVisible}
                  onChange={() => toggleLayerVisibility('mge')}
                  className="h-3 w-3 rounded-sm border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor={idMge} className="ml-2 text-gray-800 cursor-pointer">
                  MGE Service Area
                </label>
              </div>
              <div className="flex items-center text-xs">
                <input
                  id={idAlliant}
                  type="checkbox"
                  checked={isAlliantVisible}
                  onChange={() => toggleLayerVisibility('alliant')}
                  className="h-3 w-3 rounded-sm border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor={idAlliant} className="ml-2 text-gray-800 cursor-pointer">
                  Alliant Service Area
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;
