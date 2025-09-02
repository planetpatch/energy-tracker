"use client";

import React, { useEffect, useState } from 'react';
import { useMapStore } from '@/stores/mapStore';

// --- Reusable ProgressBar Sub-Component ---
// This small component handles the visual representation of the fuel mix.
interface ProgressBarProps {
  utilityName: string;
  renewablePercent: number;
  colorClass: string; // e.g., 'bg-green-600'
}

const ProgressBar: React.FC<ProgressBarProps> = ({ utilityName, renewablePercent, colorClass }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-base font-medium text-gray-700">{utilityName}</span>
      <span className="text-sm font-medium text-gray-700">{renewablePercent}% Renewable</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-5">
      <div 
        className={`${colorClass} h-5 rounded-full text-xs font-medium text-white text-center p-0.5 leading-none`} 
        style={{ width: `${renewablePercent}%` }}
      >
        {renewablePercent}%
      </div>
    </div>
  </div>
);


// --- Main FuelMixPanel Component ---
const FuelMixPanel: React.FC = () => {
  // 1. Subscribe to the necessary state and actions from the Zustand store.
  const isVisible = useMapStore((state) => state.isFuelMixVisible);
  const activeUtility = useMapStore((state) => state.activeUtility);
  const fuelMixData = useMapStore((state) => state.fuelMixData);
  const hidePanel = useMapStore((state) => state.hideFuelMix);

  // Local state to manage the mount animation for a smoother slide-in effect.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This ensures the slide-in animation plays after the component is in the DOM.
    if (isVisible) {
      const timer = setTimeout(() => setIsMounted(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isVisible]);

  // If the panel shouldn't be visible, render nothing.
  if (!isVisible) {
    return null;
  }

  return (
    // 2. The main container uses Tailwind classes for positioning and animation.
    // The `transform` and `translate-y` classes control the slide-up animation.
    <div className={`fixed bottom-0 left-0 right-0 z-[1000] bg-white p-4 pb-6 shadow-[0_-4px_12px_-1px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out
      ${isMounted ? 'translate-y-0' : 'translate-y-full'}`
    }>
      <div className="max-w-4xl mx-auto">
        {/* Panel Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Renewable vs. Non-Renewable Fuel Mix
          </h2>
          <button 
            onClick={hidePanel}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800"
            aria-label="Close fuel mix panel"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* 3. Conditionally render the progress bars based on the active utility. */}
        <div className="border-t border-gray-200 pt-4">
          {fuelMixData && (
            <>
              {(activeUtility === 'MGE' || activeUtility === 'Both') && (
                <ProgressBar
                  utilityName="MGE"
                  renewablePercent={fuelMixData.MGE.renewable_percent}
                  colorClass="bg-green-600"
                />
              )}
              {(activeUtility === 'Alliant' || activeUtility === 'Both') && (
                <ProgressBar
                  utilityName="Alliant Energy"
                  renewablePercent={fuelMixData.Alliant.renewable_percent}
                  colorClass="bg-blue-600"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FuelMixPanel;