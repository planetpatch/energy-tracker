"use client";

import React, { useState, useRef } from 'react';
import { useMapStore } from '@/stores/mapStore';

interface DashboardPanelProps {
  onZipCodeSubmit: (zipCode: string) => void;
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({ onZipCodeSubmit }) => {
  // --- Store State ---
  const isDashboardVisible = useMapStore((s) => s.isDashboardVisible);
  const hideDashboard      = useMapStore((s) => s.hideDashboard);
  const selectedZcta       = useMapStore((s) => s.selectedZcta);
  const hoveredZcta        = useMapStore((s) => s.hoveredZcta);
  
  const { 
    isZctaVisible, 
    isMgeVisible, 
    isAlliantVisible, 
    toggleLayerVisibility 
  } = useMapStore();

  // --- Local State ---
  const [zipCodeInput, setZipCodeInput] = useState<string>("");
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(false);
  const [isActionsOpen, setIsActionsOpen] = useState<boolean>(false); // State for the new caret

  // --- Tooltip State (moved from FuelMixPanel) ---
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    content: string;
    targetRef: React.RefObject<HTMLDivElement | null> | null;
  }>({ visible: false, content: '', targetRef: null });

  const focusInfoRef = useRef<HTMLDivElement>(null);
  const commentInfoRef = useRef<HTMLDivElement>(null);

  const showTooltip = (content: string, targetRef: React.RefObject<HTMLDivElement | null>) =>
    setTooltip({ visible: true, content, targetRef });
  const hideTooltip = () => setTooltip({ visible: false, content: '', targetRef: null });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCodeInput.trim()) {
      onZipCodeSubmit(zipCodeInput.trim());
      setZipCodeInput("");
    }
  };

  const displayZcta = selectedZcta || hoveredZcta;
  const isHovering = !selectedZcta && !!hoveredZcta;
  const tooltipPosition = tooltip.targetRef?.current?.getBoundingClientRect();


  if (!isDashboardVisible) return null;

  return (
    <>
      <div
        className="absolute top-5 right-5 z-[1000] flex w-72 max-w-sm flex-col rounded-lg bg-white/95 p-5 mt-16 shadow-2xl max-h-[calc(100vh-40px)] overflow-y-auto"
        role="region"
        aria-label="Dashboard panel"
      >
        {/* Header */}
        <div className="mb-4 mt-0 border-b border-gray-200 pb-2.5 flex items-center justify-between">
          <h2 className="text-2xl font-gemunu text-gray-800 m-0">ZIP Code Search</h2>
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
        <form onSubmit={handleSubmit} className="mb-5">
          <div className="mt-1 flex">
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
              className="font-gemunu rounded-l-none pixel-button-base pixel-button-primary text-sm px-4"
            >
              Go
            </button>
          </div>
        </form>

        {/* Selected ZIP Code Display */}
        <div className="flex-grow border-t border-gray-200 pt-4 pb-4">
          {displayZcta ? (
            <h3 className={`text-xl font-bold font-gemunu ${isHovering ? 'text-gray-500' : 'text-green-800'}`}>
              ZIP Code: {displayZcta.properties?.ZCTA5CE10}
              {isHovering && <span className="text-sm font-normal"> (Hovering)</span>}
            </h3>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-center text-gray-500">
                Select or search for a ZIP code.
              </p>
            </div>
          )}
        </div>

        {/* Collapsible Legend Section */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <button
            onClick={() => setIsLegendOpen(!isLegendOpen)}
            className="flex justify-between items-center w-full text-left"
          >
            <h3 className="text-lg font-gemunu font-bold text-gray-800">Legend</h3>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${isLegendOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        {isLegendOpen && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                id="zcta-toggle-db"
                type="checkbox"
                checked={isZctaVisible}
                onChange={() => toggleLayerVisibility('zcta')}
                className="h-4 w-4 rounded border-gray-300 text-indigo-800 focus:ring-indigo-800 accent-red-900 "
              />
              <label htmlFor="zcta-toggle-db" className="ml-3 block text-sm text-gray-900">
                Dane County ZIP Codes
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="mge-toggle-db"
                type="checkbox"
                checked={isMgeVisible}
                onChange={() => toggleLayerVisibility('mge')}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 accent-green-800"
              />
              <label htmlFor="mge-toggle-db" className="ml-3 block text-sm text-gray-900">
                MGE Service Area
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="alliant-toggle-db"
                type="checkbox"
                checked={isAlliantVisible}
                onChange={() => toggleLayerVisibility('alliant')}
                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 accent-orange-700"
              />
              <label htmlFor="alliant-toggle-db" className="ml-3 block text-sm text-gray-900">
                Alliant Service Area
              </label>
            </div>
          </div>
        )}
        </div>

        {/* --- New Collapsible Take Action Section --- */}
        <div className="border-t border-b border-gray-200 pt-4 pb-2">
          <button
            onClick={() => setIsActionsOpen(!isActionsOpen)}
            className="flex justify-between items-center w-full text-left"
          >
            <h3 className="text-lg font-gemunu font-bold text-gray-800">Take Action!</h3>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${isActionsOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isActionsOpen && (
            <div className="mt-4 flex flex-col space-y-3">

              <div className="flex justify-center items-center">
                                <div
                  ref={focusInfoRef}
                  onMouseEnter={() => showTooltip("Focus on Energy is Wisconsin's statewide program for energy efficiency and renewables. Click to learn more and get a free energy-saving kit.", focusInfoRef)}
                  onMouseLeave={hideTooltip}
                  className=" cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                </div>
                <a
                  href="https://focusonenergy.com/residential/simple-energy-efficiency"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center text-xs font-gemunu pixel-button-base pixel-button-primary"
                >
                  Free Energy Box
                </a>

              </div>
              <div className="flex justify-center items-center">
                                <div
                  ref={commentInfoRef}
                  onMouseEnter={() => showTooltip("Share your thoughts with the Public Service Commission of Wisconsin, which regulates state utilities.", commentInfoRef)}
                  onMouseLeave={hideTooltip}
                  className=" cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                </div>
                <a
                  href="https://psc.wi.gov/Pages/PublicParticipation/PublicComments.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center text-xs font-gemunu pixel-button-base pixel-button-primary"
                >
                  Leave a Comment
                </a>

              </div>

                                          <div className="flex justify-center items-center">
                                <div
                  ref={focusInfoRef}
                  onMouseEnter={() => showTooltip("Focus on Energy is Wisconsin's statewide program for energy efficiency and renewables. Click to learn more and get a free energy-saving kit.", focusInfoRef)}
                  onMouseLeave={hideTooltip}
                  className=" cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                </div>
                <a
                  href="https://instagram.com/planetpatch.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center text-xs font-gemunu pixel-button-base pixel-button-primary"
                >
                  Follow PlanetPatch
                </a>

              </div>

            </div>
          )}
        </div>
        <div className="text-center pt-2">
            Created by <br/>
        <a className='underline text-blue-500 font-bold'href='www.planetpatch.dev'>
         PlanetPatch Inc.
        </a> 
         </div>

      </div>

      {/* --- Tooltip Rendering --- */}
      {tooltip.visible && tooltipPosition && (
        <div
          className="fixed z-[1001] max-w-xs rounded-lg bg-gray-800 px-3 py-2 text-sm font-normal text-white shadow-lg"
          style={{
            top: tooltipPosition.top - 10,
            left: tooltipPosition.left + tooltipPosition.width / 2,
            transform: 'translateX(-50%) translateY(-100%)',
          }}
        >
          {tooltip.content}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800" />
        </div>
      )}
    </>
  );
};

export default DashboardPanel;