"use client";

import React from 'react';
import type { DashboardPanelProps } from '../DashboardPanel';
import { useMapStore } from '@/stores/mapStore';

export const MobileDashboardPanel: React.FC<DashboardPanelProps> = ({
  isDashboardVisible,
  hideDashboard,
  isZctaVisible,
  isMgeVisible,
  isAlliantVisible,
  toggleLayerVisibility,
  zipCodeInput,
  setZipCodeInput,
  isLegendOpen,
  setIsLegendOpen,
  // isActionsOpen,
  // setIsActionsOpen,
  // focusInfoRef,
  // followInfoRef,
  // showTooltip,
  // hideTooltip,
  handleSubmit,
  displayZcta,
  isHovering,
  // tooltip, tooltipPosition
}) => {
    const { isTakeActionVisible, setTakeActionVisible } = useMapStore();
  if (!isDashboardVisible) return null;
  // const tooltipPadding = 16;




  return (
    <>
      <div
        className="fixed bottom-12 left-0 right-0 z-[1000] w-full rounded-t-xl bg-white/95 shadow-2xl backdrop-blur-md p-4 transition-transform duration-300 ease-in-out max-h-[80vh] overflow-y-auto"
        // This is a simple way to handle the slide-up, but a library like Framer Motion could make it draggable.
      >
        {/* Header with drag handle */}
        <div className="flex flex-col items-center pb-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full mb-2" />
            <div className="w-full flex items-center justify-between">
              <h2 className="text-xl font-gemunu text-gray-800 m-0">Dashboard</h2>
              <button
                onClick={hideDashboard}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800"
                aria-label="Close dashboard panel"
                type="button"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
        </div>
        
        {/* ZIP form */}
        <form onSubmit={handleSubmit} className="my-2">
          <div className="flex">
            <input
              type="text"
              id="zip-input-mobile"
              value={zipCodeInput}
              onChange={(e) => setZipCodeInput(e.target.value)}
              placeholder="Enter ZIP Code..."
              maxLength={5}
              className="block w-full flex-1 rounded-none rounded-l-md border border-gray-300 px-4 py-3 text-sm text-black"
            />
            <button
              type="submit"
              disabled={!zipCodeInput.trim()}
              className="font-gemunu rounded-sm pixel-button-base pixel-button-primary text-lg px-6"
            >
              Go
            </button>
          </div>
        </form>

        {/* Selected ZIP Code Display */}
           {displayZcta && (
          <div className="border-t border-gray-200 pt-4 pb-4">
              <p className={`text-sm font-bold font-gemunu text-gray-500 `}>
                Selected ZIP Code: <span className={` text-md ${isHovering ? 'text-gray-500' : 'text-green-800'}`}>{displayZcta.properties?.ZCTA5CE10} </span>
              </p>
          </div>
        )}
        
              {/* --- Collapsible Legend Section (Moved Down) --- */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <button onClick={() => setIsLegendOpen(!isLegendOpen)} className="flex justify-between items-center w-full text-left">
          <h3 className="text-lg font-gemunu font-bold text-gray-800">Legend</h3>
          <svg className={`w-5 h-5 transition-transform duration-200 ${isLegendOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        {isLegendOpen && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input id="zcta-toggle-db" type="checkbox" checked={isZctaVisible} onChange={() => toggleLayerVisibility('zcta')} className="h-4 w-4 rounded border-gray-300 text-indigo-800 focus:ring-indigo-800 accent-red-900 " />
              <label htmlFor="zcta-toggle-db" className="ml-3 block text-sm text-gray-900">Dane County ZIP Codes</label>
            </div>
            <div className="flex items-center">
              <input id="mge-toggle-db" type="checkbox" checked={isMgeVisible} onChange={() => toggleLayerVisibility('mge')} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 accent-green-800" />
              <label htmlFor="mge-toggle-db" className="ml-3 block text-sm text-gray-900">MGE Service Area</label>
            </div>
            <div className="flex items-center">
              <input id="alliant-toggle-db" type="checkbox" checked={isAlliantVisible} onChange={() => toggleLayerVisibility('alliant')} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 accent-orange-700" />
              <label htmlFor="alliant-toggle-db" className="ml-3 block text-sm text-gray-900">Alliant Service Area</label>
            </div>
          </div>
        )}
      </div>

      {/* --- Collapsible Take Action Section (Moved Up) --- */}
      <div className="border-t border-gray-200 pt-4 mb-4">
         <button onClick={() => setTakeActionVisible(!isTakeActionVisible)} className="flex justify-between items-center w-full text-left">
          <h3 className="text-lg font-gemunu font-bold text-gray-800">Take Action!</h3>
          <svg 
      // 2. UPDATE THIS CONDITIONAL CLASS
      className={`w-5 h-5 transition-transform duration-200 ${isTakeActionVisible ? 'rotate-180' : ''}`} 
      fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
        </button>
        {isTakeActionVisible && (
            <div className="mt-3 flex flex-col space-y-3">

        <div className="flex justify-around items-center h-12 p-2 space-x-2">
          <a
                  className={`w-full h-full flex items-center rounded-sm justify-center pixel-button-base-mobile`}
                  href="https://focusonenergy.com/residential/simple-energy-efficiency" target="_blank" rel="noopener noreferrer"
          >
            FREE Energy Kit
                </a>
                <a
                  href="https://instagram.com/planetpatch.dev" target="_blank" rel="noopener noreferrer"
            className={`w-full h-full flex items-center rounded-sm justify-center pixel-button-base-mobile`}
          >
           Follow PlanetPatch
                </a>
              </div>
              
                      <div className="flex justify-around items-center h-12 p-2 space-x-2">
          <a href="https://www.planetpatch.dev/projects/energy-tracker#renewable-credits" target="_blank" rel="noopener noreferrer"
            className={`w-full h-full flex items-center rounded-sm justify-center font-gemunu pixel-button-base-mobile`}
          >
            Renewable Credits
                </a>
          <a href="https://www.planetpatch.dev/projects/energy-tracker/" target="_blank" rel="noopener noreferrer"
            className={`w-full h-full flex items-center rounded-sm justify-center font-gemunu text-sm pixel-button-base-mobile`}
          >
           Learn More
                </a>
        </div>

          

            </div>

            
            
        )}
      </div>
      

      </div>
      
    </>
  );
};
