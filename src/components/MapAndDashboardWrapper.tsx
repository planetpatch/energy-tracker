// src/components/MapAndDashboardWrapper.tsx
"use client"

import React, { useState, useCallback, useRef, useEffect as ReactUseEffect } from "react"
import dynamic from "next/dynamic"
import type { Feature, Geometry, GeoJsonProperties } from "geojson"

const DynamicMapComponent = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
})

import DashboardPanel from "./DashboardPanel"

type ZCTAFeature = Feature<Geometry, GeoJsonProperties>

const MapAndDashboardWrapper: React.FC = () => {
  const [selectedZcta, setSelectedZcta] = useState<ZCTAFeature | null>(null) // For clicked ZCTA
  // NEW STATE: To hold plants for the clicked ZCTA
  const [plantsInSelectedZcta, setPlantsInSelectedZcta] = useState<string[]>([]);

  const [hoveredZcta, setHoveredZcta] = useState<ZCTAFeature | null>(null)   // For hovered ZCTA
  const [plantsInHoveredZcta, setPlantsInHoveredZcta] = useState<string[]>([]) // Plant names in hovered ZCTA

  const selectedZctaRef = useRef(selectedZcta);
  ReactUseEffect(() => {
    selectedZctaRef.current = selectedZcta;
  }, [selectedZcta]);


  // Callback for when a ZCTA is CLICKED
  const handleZCTAClick = useCallback((feature: ZCTAFeature, plants: string[]) => {
    setSelectedZcta(feature)
    setPlantsInSelectedZcta(plants); // <--- Set the plants for the clicked ZCTA here!

    // When a ZCTA is clicked, clear any existing hover state to prioritize the click info
    setHoveredZcta(null);
    setPlantsInHoveredZcta([]); // Clear plants in hovered state
  }, []) // Empty dependency array: this function is stable

  // Callback for when a ZCTA is HOVERED
  const handleZCTAHover = useCallback((feature: ZCTAFeature | null, plants: string[]) => {
    // Only update hovered state if no ZCTA is currently selected.
    if (!selectedZctaRef.current) {
        setHoveredZcta(feature);
        setPlantsInHoveredZcta(plants);
    }
  }, []); // Empty dependency array: this function is now stable

  return (
    <div className="map-dashboard-container">
      <div className="map-area">
        <DynamicMapComponent
          onFeatureClick={handleZCTAClick}
          onZCTAHover={handleZCTAHover}
        />
      </div>
      {selectedZcta && (
        <DashboardPanel
          selectedZcta={selectedZcta}
          plantsInSelectedZcta={plantsInSelectedZcta} // <--- Pass the new state here!
          hoveredZcta={hoveredZcta}
          plantsInHoveredZcta={plantsInHoveredZcta}
        />
      )}

      <style jsx>{`
        .map-dashboard-container {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 60px);
          width: 100%;
          padding: 0;
          box-sizing: border-box;
          position: relative;
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