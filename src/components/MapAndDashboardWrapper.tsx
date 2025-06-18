"use client"

import type React from "react"
import { useState, useCallback } from "react"
import dynamic from "next/dynamic"
import type { Feature, Geometry, GeoJsonProperties } from "geojson"

// Dynamically import MapComponent with SSR disabled
const DynamicMapComponent = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
})

import DashboardPanel from "./DashboardPanel"

type ZCTAFeature = Feature<Geometry, GeoJsonProperties>

const MapAndDashboardWrapper: React.FC = () => {
  const [selectedZcta, setSelectedZcta] = useState<ZCTAFeature | null>(null) // For clicked ZCTA
  const [hoveredZcta, setHoveredZcta] = useState<ZCTAFeature | null>(null)   // For hovered ZCTA
  const [plantsInHoveredZcta, setPlantsInHoveredZcta] = useState<string[]>([]) // Plant names in hovered ZCTA

  // Callback for when a ZCTA is CLICKED (updates dashboard with ZCTA code)
  const handleZCTAClick = useCallback((feature: ZCTAFeature) => {
    setSelectedZcta(feature)
    // When a ZCTA is clicked, we might want to clear any existing hover state
    setHoveredZcta(null);
    setPlantsInHoveredZcta([]);
  }, [])

  // Callback for when a ZCTA is HOVERED (updates dashboard with plant names)
  const handleZCTAHover = useCallback((feature: ZCTAFeature | null, plants: string[]) => {
    setHoveredZcta(feature);
    setPlantsInHoveredZcta(plants);
  }, []);

  return (
    <div className="map-dashboard-container">
      <div className="map-area">
        <DynamicMapComponent
          onFeatureClick={handleZCTAClick} // Pass click handler to MapComponent
          onZCTAHover={handleZCTAHover}   // Pass hover handler to MapComponent
        />
      </div>
      {/* DashboardPanel receives both clicked and hovered data */}
      <DashboardPanel
        selectedZcta={selectedZcta}
        hoveredZcta={hoveredZcta}
        plantsInHoveredZcta={plantsInHoveredZcta}
      />

      <style jsx>{`
        .map-dashboard-container {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 60px); /* Adjust based on your header/footer height */
          width: 100%;
          padding: 0;
          box-sizing: border-box;
          position: relative; /* Needed for dashboard's fixed/absolute positioning */
        }

        .map-area {
          flex-grow: 1;
          min-height: 100%;
          width: 100%;
        }
      `}</style>
    </div>
  )
}

export default MapAndDashboardWrapper