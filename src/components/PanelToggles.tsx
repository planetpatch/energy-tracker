"use client";

import React from 'react';
import { useMapStore } from '@/stores/mapStore';

const PanelToggles: React.FC = () => {
  const activePanel = useMapStore((state) => state.activePanel);
  const togglePanel = useMapStore((state) => state.togglePanel);

  const getButtonClass = (panelName: 'dashboard' | 'fuelMix') => {
    const isActive = activePanel === panelName;
    return `
      px-4 py-2 text-sm font-semibold rounded-md shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      ${isActive ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}
    `;
  };

  return (
    <div className="fixed z-[1001] bottom-5 left-5 flex items-end space-x-2">
      <button
        onClick={() => togglePanel('dashboard')}
        className={getButtonClass('dashboard')}
        aria-pressed={activePanel === 'dashboard'}
        aria-controls="dashboard-panel"
        type="button"
      >
        Dashboard
      </button>
      <button
        onClick={() => togglePanel('fuelMix')}
        className={getButtonClass('fuelMix')}
        aria-pressed={activePanel === 'fuelMix'}
        aria-controls="fuelmix-panel"
        type="button"
      >
        Fuel Mix
      </button>
    </div>
  );
};

export default PanelToggles;
