"use client";

import dynamic from "next/dynamic";
import DashboardPanel from "../DashboardPanel";
import type { MapData } from "@/lib/data-loader";

// Dynamically import the map component to avoid SSR issues with Leaflet
const DynamicMapComponent = dynamic(() => import("../Map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

// Define the props this component will receive from the orchestrator
interface DesktopMapWrapperProps {
  mapData: MapData;
  handleZipCodeSubmit: (zipCode: string) => void;
}

const DesktopMapWrapper: React.FC<DesktopMapWrapperProps> = ({ mapData, handleZipCodeSubmit }) => {
  return (
    <div className="relative flex w-full flex-col h-screen">
      <div className="w-full flex-grow">
        <DynamicMapComponent
          zctaGeojsonData={mapData.zctaData}
          mgeBordersData={mapData.mgeBordersData}
          alliantBordersData={mapData.alliantBordersData}
        />
      </div>
      {/* The DashboardPanel is rendered as a floating element on top of the map */}
      <DashboardPanel onZipCodeSubmit={handleZipCodeSubmit} />
    </div>
  );
};

export default DesktopMapWrapper;