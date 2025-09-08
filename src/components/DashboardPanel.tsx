"use client";

import React, { useState } from 'react';
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

  // --- Local State ---
  const [zipCodeInput, setZipCodeInput] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCodeInput.trim()) {
      onZipCodeSubmit(zipCodeInput.trim());
      setZipCodeInput("");
    }
  };

  // Determine which ZCTA to display (selected takes precedence over hovered)
  const displayZcta = selectedZcta || hoveredZcta;
  const isHovering = !selectedZcta && !!hoveredZcta;

  if (!isDashboardVisible) return null;

  return (
    <div
      className="absolute top-5 right-5 z-[1000] flex w-72 max-w-sm flex-col rounded-lg bg-white/95 p-5 mt-16 shadow-2xl max-h-[calc(100vh-40px)] overflow-y-auto"
      role="region"
      aria-label="Dashboard panel"
    >
      {/* Header with close button */}
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

      {/* Display Selected/Hovered ZIP Code */}
      <div className="flex-grow border-t border-gray-200 pt-4">
        {displayZcta ? (
          <h3 className={`text-xl font-bold font-gemunu ${isHovering ? 'text-gray-500' : 'text-blue-800'}`}>
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
    </div>
  );
};

export default DashboardPanel;