"use client";

import { useMapStore } from '@/stores/mapStore';
import React from 'react';
import { gemunuLibre } from '@/ui/fonts';
import type { FuelMixPanelProps, ProgressBarProps } from '../FuelMixPanel'; // Shared types

const ProgressBar: React.FC<ProgressBarProps> = ({ utilityName, renewablePercent, colorClass }) => {
  // 👇 1. CALCULATE the non-renewable percentage here
  const nonRenewablePercent = 100 - renewablePercent;

  return (
    <div className="mb-2">
      <div className="flex justify-between mb-1">
        <span className="text-s font-semibold text-gray-700">{utilityName}</span>
        <div className="flex space-x-2"> {/* Wrapper for alignment */}
          <span className="text-xs font-bold text-green-700">{renewablePercent.toFixed(1)}% Renewable</span>
          {/* 👇 2. DISPLAY the calculated value */}
          <span className="text-xs font-bold text-gray-800">/ {nonRenewablePercent.toFixed(1)}% Non-Renewable</span>
        </div>
      </div>
      <div className="w-full bg-gray-500 rounded-full h-3.5">
        <div
          className={`${colorClass} h-3.5 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${renewablePercent}%` }}
        />
      </div>
    </div>
  );
};

export const MobileFuelMixPanel: React.FC<FuelMixPanelProps> = ({
  isMounted,
  hideFuelMix,
  fuelMixData,
  // showMge,
  // setShowMge,
  // showAlliant,
  // setShowAlliant,
}) => {

    const { showMge, setShowMge, showAlliant, setShowAlliant } = useMapStore();
  return (
    <div
      className={`fixed bottom-12 left-0 right-0 z-[1000] w-full rounded-t-xl bg-white/90 shadow-2xl backdrop-blur-md p-4 transition-transform duration-300 ease-in-out ${
        isMounted ? 'translate-y-0' : 'translate-y-full'
      }`}
      role="region"
      aria-label="Fuel mix panel"
    >
      {/* Header with a "drag handle" affordance */}
      <div className="flex flex-col items-center pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full mb-2" />
          <div className="w-full flex items-center justify-between">
            <h2 className={`text-lg font-bold text-gray-800 ${gemunuLibre.className}`}>
              Renewable Progress Bar / Fuel Mix 
            </h2>
            <button
              onClick={hideFuelMix}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700"
              aria-label="Close fuel mix panel"
              type="button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>
        
      </div>


      {/* Content */}
      <div className="pt-3">
        {fuelMixData && (
          <div className="space-y-3 mb-3">
            {showMge && fuelMixData.MGE && (
              <ProgressBar
                utilityName="MGE"
                renewablePercent={fuelMixData.MGE.renewable_percent}
                colorClass="bg-green-500"
              />
            )}
            {showAlliant && fuelMixData.Alliant && (
              <ProgressBar
                utilityName="Alliant Energy"
                renewablePercent={fuelMixData.Alliant.renewable_percent}
                colorClass="bg-orange-500"
              />
            )}
          </div>
        )}
        
        {/* Toggles */}
        <div className="flex items-center justify-around border-t border-gray-200 pt-3">
          <label className="flex items-center cursor-pointer text-base">
            <input
              type="checkbox"
              checked={showMge}
              onChange={() => setShowMge(!showMge)}
              className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="ml-2 font-medium text-gray-700">MGE</span>
          </label>
          <label className="flex items-center cursor-pointer text-base">
            <input
              type="checkbox"
              checked={showAlliant}
              onChange={() => setShowAlliant(!showAlliant)}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 font-medium text-gray-700">Alliant Energy</span>
          </label>
        </div>
      </div>
    </div>
  );
};
