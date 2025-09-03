"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useMapStore } from '@/stores/mapStore';

interface ProgressBarProps {
  utilityName: string;
  renewablePercent: number;
  colorClass: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ utilityName, renewablePercent, colorClass }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-base font-medium text-gray-700">{utilityName}</span>
      <span className="text-sm font-medium text-gray-700">{renewablePercent}% Renewable</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-5">
      <div
        className={`${colorClass} h-5 rounded-full text-xs font-medium text-white text-center p-0.5 leading-none transition-all duration-500 ease-out`}
        style={{ width: `${renewablePercent}%` }}
      >
        {renewablePercent}%
      </div>
    </div>
  </div>
);

const FuelMixPanel: React.FC = () => {
  // store
  const isVisible      = useMapStore((s) => s.isFuelMixVisible);
  const activeUtility  = useMapStore((s) => s.activeUtility);
  const fuelMixData    = useMapStore((s) => s.fuelMixData);
  const hidePanel      = useMapStore((s) => s.hideFuelMix);
  const showPanel = useMapStore((s) => s.showFuelMix);

  
    // const selectedZcta         = useMapStore((s) => s.selectedZcta);
    // const plantsInSelectedZcta = useMapStore((s) => s.plantsInSelectedZcta);
    // const hoveredZcta          = useMapStore((s) => s.hoveredZcta);
    // const plantsInHoveredZcta  = useMapStore((s) => s.plantsInHoveredZcta);
    const isZctaVisible        = useMapStore((s) => s.isZctaVisible);
    const isMgeVisible         = useMapStore((s) => s.isMgeVisible);
    const isAlliantVisible     = useMapStore((s) => s.isAlliantVisible);
  const toggleLayerVisibility = useMapStore((s) => s.toggleLayerVisibility);
  

  // local UI state
  const [showMge, setShowMge] = useState(true);
  const [showAlliant, setShowAlliant] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    content: string;
    targetRef: React.RefObject<HTMLDivElement | null> | null;
  }>({ visible: false, content: '', targetRef: null });

  const focusInfoRef = useRef<HTMLDivElement>(null);
  const commentInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      const t = setTimeout(() => setIsMounted(true), 10);
      return () => clearTimeout(t);
    } else {
      setIsMounted(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (activeUtility === 'MGE') {
      setShowMge(true);
      setShowAlliant(false);
    } else if (activeUtility === 'Alliant') {
      setShowMge(false);
      setShowAlliant(true);
    } else {
      setShowMge(true);
      setShowAlliant(true);
    }
  }, [activeUtility]);

  const showTooltip = (content: string, targetRef: React.RefObject<HTMLDivElement | null>) =>
    setTooltip({ visible: true, content, targetRef });
  const hideTooltip = () => setTooltip({ visible: false, content: '', targetRef: null });

  // When hidden: render a bottom-left toggle button only
if (!isVisible) return null;

  const tooltipPosition = tooltip.targetRef?.current?.getBoundingClientRect();

  return (
    <div
      className={`fixed bottom-5 left-5 right-5 z-[1000] transition-transform duration-300 ease-in-out ${
        isMounted ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ height: '20vh' }} // always 20% of viewport height
      role="region"
      aria-label="Fuel mix panel"
    >
      <div className="w-full h-full bg-white/90 backdrop-blur-md rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <h2 className="text-base font-semibold text-gray-800">Renewable vs. Non-Renewable Fuel Mix</h2>
          <button
            onClick={hidePanel}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800"
            aria-label="Close fuel mix panel"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-12 gap-6 px-4 pb-4 h-[calc(100%-50px)]">
          {/* Legend / toggles */}
{/* Legend / toggles (REPLACE THIS WHOLE BLOCK) */}
<div className="col-span-12 sm:col-span-3 overflow-y-auto">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
    {/* Toggle Progress Bar View (left) */}


    {/* Legend (right, reused from Dashboard) */}
    <div className="sm:border-l border-gray-200 sm:pl-4">
      <h3 className="text-sm font-medium text-gray-600 mb-1">Legend</h3>
      <div className="mt-2 space-y-2">
        <div className="flex items-center">
          <input
            id="zcta-toggle-fm"
            type="checkbox"
            checked={isZctaVisible}
            onChange={() => toggleLayerVisibility('zcta')}
            className="h-4 w-4 rounded border-gray-300 text-indigo-800 focus:ring-indigo-800"
          />
          <label htmlFor="zcta-toggle-fm" className="ml-3 block text-sm text-gray-900">
            Dane County ZIP Codes
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="mge-toggle-fm"
            type="checkbox"
            checked={isMgeVisible}
            onChange={() => toggleLayerVisibility('mge')}
            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <label htmlFor="mge-toggle-fm" className="ml-3 block text-sm text-gray-900">
            MGE Service Area
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="alliant-toggle-fm"
            type="checkbox"
            checked={isAlliantVisible}
            onChange={() => toggleLayerVisibility('alliant')}
            className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          <label htmlFor="alliant-toggle-fm" className="ml-3 block text-sm text-gray-900">
            Alliant Service Area
          </label>
        </div>
      </div>
              </div>
              
                  <div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">Toggle Progress Bar View</h3>
      <div className="space-y-2">
        <label className="flex items-center cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={showMge}
            onChange={() => setShowMge(!showMge)}
            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="ml-2 text-gray-800">MGE</span>
        </label>
        <label className="flex items-center cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={showAlliant}
            onChange={() => setShowAlliant(!showAlliant)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-gray-800">Alliant Energy</span>
        </label>
      </div>
              </div>
              
  </div>
</div>



          {/* Bars */}
          <div className="col-span-12 sm:col-span-6 border-x border-gray-200 px-4 overflow-y-auto">
            {fuelMixData && (
              <>
                {showMge && fuelMixData.MGE && (
                  <ProgressBar
                    utilityName="MGE"
                    renewablePercent={fuelMixData.MGE.renewable_percent}
                    colorClass="bg-green-600"
                  />
                )}
                {showAlliant && fuelMixData.Alliant && (
                  <ProgressBar
                    utilityName="Alliant Energy"
                    renewablePercent={fuelMixData.Alliant.renewable_percent}
                    colorClass="bg-blue-600"
                  />
                )}
              </>
            )}
          </div>

          {/* Actions */}
          <div className="col-span-12 sm:col-span-3 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Take Action</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <a
                  href="https://focusonenergy.com/residential/simple-energy-efficiency"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 font-semibold py-1.5 px-3 rounded-md shadow-sm transition-colors border border-gray-300 active:scale-95 active:bg-gray-300"
                >
                  Free Focus on Energy Box
                </a>
                <div
                  ref={focusInfoRef}
                  onMouseEnter={() =>
                    showTooltip(
                      "Focus on Energy is Wisconsin's statewide energy efficiency and renewable resource program. Click to learn more and get a free energy-saving kit for your home.",
                      focusInfoRef
                    )
                  }
                  onMouseLeave={hideTooltip}
                  className="ml-2 cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex items-center">
                <a
                  href="https://psc.wi.gov/Pages/PublicParticipation/PublicComments.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 font-semibold py-1.5 px-3 rounded-md shadow-sm transition-colors border border-gray-300 active:scale-95 active:bg-gray-300"
                >
                  Leave a Comment
                </a>
                <div
                  ref={commentInfoRef}
                  onMouseEnter={() =>
                    showTooltip(
                      "Share your thoughts with the Public Service Commission of Wisconsin, which regulates state utilities.",
                      commentInfoRef
                    )
                  }
                  onMouseLeave={hideTooltip}
                  className="ml-2 cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tooltip */}
        {tooltip.visible && tooltipPosition && (
          <div
            className="fixed z-[1001] max-w-xs rounded-lg bg-gray-800 px-3 py-2 text-sm font-normal text-white shadow-lg"
            style={{
              left: tooltipPosition.left + tooltipPosition.width / 2,
              bottom: window.innerHeight - tooltipPosition.top,
              transform: 'translateX(-50%) translateY(-0.5rem)',
            }}
          >
            {tooltip.content}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800" />
          </div>
        )}
      </div>
    </div>
  );
};

export default FuelMixPanel;
