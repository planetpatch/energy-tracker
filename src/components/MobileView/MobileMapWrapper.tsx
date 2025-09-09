"use client";

import dynamic from "next/dynamic";
import DashboardPanel from "../DashboardPanel";
import FuelMixPanel from "../FuelMixPanel";
import { useMapStore } from "@/stores/mapStore";
import type { MapData } from "@/lib/data-loader";

// Dynamically import the map component
const DynamicMapComponent = dynamic(() => import("../Map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

// Define the props this component will receive from the orchestrator
interface MobileMapWrapperProps {
  mapData: MapData;
  handleZipCodeSubmit: (zipCode: string) => void;
}

const MobileMapWrapper: React.FC<MobileMapWrapperProps> = ({ mapData, handleZipCodeSubmit }) => {
  // Get state and actions from the Zustand store
  const {
    isDashboardVisible,
    showDashboard,
    hideDashboard,
    isFuelMixVisible,
    showFuelMix,
    hideFuelMix,
  } = useMapStore();

  // --- Handlers for the new tab bar ---

  const handleDashboardTabClick = () => {
    if (isDashboardVisible) {
      hideDashboard();
    } else {
      showDashboard();
      hideFuelMix();
    }
  };

  const handleFuelMixTabClick = () => {
    if (isFuelMixVisible) {
      hideFuelMix();
    } else {
      showFuelMix();
      hideDashboard();
    }
  };
  
  const tabBtn = (active: boolean) => active ? 'pixel-button-primary' : 'pixel-button-secondary';

  return (
    <div className="relative w-full h-screen">
      <div className="w-full h-full">
        <DynamicMapComponent
          zctaGeojsonData={mapData.zctaData}
          plantsData={mapData.plantsData}
          mgeBordersData={mapData.mgeBordersData}
          alliantBordersData={mapData.alliantBordersData}
        />
      </div>

      <DashboardPanel onZipCodeSubmit={handleZipCodeSubmit} />
      <FuelMixPanel />

      {/* --- Mobile Bottom Tab Bar --- */}
      <div className="fixed bottom-0 left-0 right-0 z-[1001] bg-white/90 backdrop-blur-md border-t border-gray-300 shadow-lg">
        <div className="flex justify-around items-center h-12 p-2 space-x-2">
          <button
            onClick={handleDashboardTabClick}
            className={`w-full h-full flex items-center rounded-sm justify-center font-gemunu text-sm ${tabBtn(isDashboardVisible)} pixel-button-base`}
          >
            Dashboard
          </button>
          <button
            onClick={handleFuelMixTabClick}
            className={`w-full h-full flex items-center rounded-sm justify-center font-gemunu text-sm ${tabBtn(isFuelMixVisible)} pixel-button-base`}
          >
            Fuel Mix
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMapWrapper;