"use client";

import React, { useEffect, useState } from 'react';
import { useMapStore } from '@/stores/mapStore';
import { gemunuLibre } from '@/ui/fonts';

interface ProgressBarProps {
  utilityName: string;
  renewablePercent: number;
  colorClass: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ utilityName, renewablePercent, colorClass }) => (
  <div className="mb-2">
    <div className="flex justify-between mb-1">
      <span className="text-xs font-semibold text-gray-700">{utilityName}</span>
      <span className="text-xs text-gray-600">{renewablePercent.toFixed(1)}% Renewable</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`${colorClass} h-2.5 rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${renewablePercent}%` }}
      />
    </div>
  </div>
);

const FuelMixPanel: React.FC = () => {
  const { isFuelMixVisible, hideFuelMix, activeUtility, fuelMixData } = useMapStore();
  const [isMounted, setIsMounted] = useState(false);
  const [showMge, setShowMge] = useState(true);
  const [showAlliant, setShowAlliant] = useState(true);

  useEffect(() => {
    if (isFuelMixVisible) {
      const t = setTimeout(() => setIsMounted(true), 10);
      return () => clearTimeout(t);
    } else {
      setIsMounted(false);
    }
  }, [isFuelMixVisible]);
  
  useEffect(() => {
    setShowMge(activeUtility === 'MGE' || activeUtility === 'Both');
    setShowAlliant(activeUtility === 'Alliant' || activeUtility === 'Both');
  }, [activeUtility]);

  if (!isFuelMixVisible) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 z-[1000] w-full max-w-sm rounded-lg bg-white/90 shadow-xl backdrop-blur-md p-4 transition-transform duration-300 ease-in-out ${
        isMounted ? 'translate-y-0' : 'translate-y-[150%]'
      }`}
      role="region"
      aria-label="Fuel mix panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <h2 className={`text-xl font-bold text-gray-800 ${gemunuLibre.className}`}>
          Utility Fuel Mix (Renewable vs. Non-Renewable)
        </h2>
        <button
          onClick={hideFuelMix}
          className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700"
          aria-label="Close fuel mix panel"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
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
                colorClass="bg-blue-500"
              />
            )}
          </div>
        )}
        
        {/* Toggles */}
        <div className="flex items-center space-x-4 border-t border-gray-200 pt-2">
          <label className="flex items-center cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={showMge}
              onChange={() => setShowMge(!showMge)}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="ml-2 font-medium text-gray-700">MGE</span>
          </label>
          <label className="flex items-center cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={showAlliant}
              onChange={() => setShowAlliant(!showAlliant)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 font-medium text-gray-700">Alliant Energy</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FuelMixPanel;