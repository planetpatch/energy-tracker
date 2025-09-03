"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useMapStore } from '@/stores/mapStore';

// --- (ProgressBar Sub-Component remains unchanged) ---
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
  const isVisible = useMapStore((state) => state.isFuelMixVisible);
  const activeUtility = useMapStore((state) => state.activeUtility);
  const fuelMixData = useMapStore((state) => state.fuelMixData);
  const hidePanel = useMapStore((state) => state.hideFuelMix);

  const [showMge, setShowMge] = useState(true);
  const [showAlliant, setShowAlliant] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // --- 1. UPDATE THE TOOLTIP STATE TYPE ---
  // The targetRef should match the type returned by useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    content: string;
    targetRef: React.RefObject<HTMLDivElement | null> | null;
  }>({ visible: false, content: '', targetRef: null });

  const focusInfoRef = useRef<HTMLDivElement>(null);
  const commentInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsMounted(true), 10);
      return () => clearTimeout(timer);
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

  // --- 2. UPDATE THE FUNCTION SIGNATURE ---
  // The targetRef parameter now correctly accepts the type from the useRef hook.
  const showTooltip = (content: string, targetRef: React.RefObject<HTMLDivElement | null>) => {
    setTooltip({ visible: true, content, targetRef });
  };

  const hideTooltip = () => {
    setTooltip({ visible: false, content: '', targetRef: null });
  };


  if (!isVisible) {
    return null;
  }

  const tooltipPosition = tooltip.targetRef?.current?.getBoundingClientRect();

  return (
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

        {/* Progress Bars Section */}
        <div className="border-t border-gray-200 pt-4">
          {fuelMixData && (
            <>
              {showMge && fuelMixData.MGE && (
                <ProgressBar utilityName="MGE" renewablePercent={fuelMixData.MGE.renewable_percent} colorClass="bg-green-600" />
              )}
              {showAlliant && fuelMixData.Alliant && (
                <ProgressBar utilityName="Alliant Energy" renewablePercent={fuelMixData.Alliant.renewable_percent} colorClass="bg-blue-600" />
              )}
            </>
          )}
        </div>
        
        {/* Toggle View Section */}
        <div className="mt-2 pt-3 border-t border-gray-200 flex items-center space-x-6">
            <span className="text-sm font-medium text-gray-600">Toggle View:</span>
            <label className="flex items-center cursor-pointer">
                <input type="checkbox" checked={showMge} onChange={() => setShowMge(!showMge)} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                <span className="ml-2 text-sm text-gray-800">MGE</span>
            </label>
            <label className="flex items-center cursor-pointer">
                <input type="checkbox" checked={showAlliant} onChange={() => setShowAlliant(!showAlliant)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-800">Alliant Energy</span>
            </label>
        </div>

        {/* "Take Action" Section */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Take Action</h3>
          <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            {/* Action 1: Focus on Energy */}
            <div className="flex-1 flex items-center">
              <a href="https://focusonenergy.com/residential/simple-energy-efficiency" target="_blank" rel="noopener noreferrer" className="w-full text-center text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors">
                Free Focus on Energy Box
              </a>
              <div 
                ref={focusInfoRef}
                onMouseEnter={() => showTooltip("Focus on Energy is Wisconsin's statewide energy efficiency and renewable resource program. Click to learn more and get a free energy-saving kit for your home.", focusInfoRef)}
                onMouseLeave={hideTooltip}
                className="ml-2 cursor-pointer text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
              </div>
            </div>

            {/* Action 2: Leave a Comment */}
            <div className="flex-1 flex items-center">
              <a href="https://psc.wi.gov/Pages/PublicParticipation/PublicComments.aspx" target="_blank" rel="noopener noreferrer" className="w-full text-center text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors">
                Leave a Comment
              </a>
               <div 
                ref={commentInfoRef}
                onMouseEnter={() => showTooltip("Share your thoughts with the Public Service Commission of Wisconsin, which regulates state utilities.", commentInfoRef)}
                onMouseLeave={hideTooltip}
                className="ml-2 cursor-pointer text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tooltip Render */}
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
           <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

export default FuelMixPanel;