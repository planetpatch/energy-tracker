// src/components/MapAndDashboardWrapper.tsx
"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect as ReactUseEffect } from "react"
import dynamic from "next/dynamic"
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson"

// >>>>>>>>>>>>>>>>>>>>>> IMPORT SHARED TYPES <<<<<<<<<<<<<<<<<<<<<<<
import type { PlantFeature, ZCTAFeature, PlantProperties } from '../types';
import { getZctaCodeFromFeature } from '../utils/geo';

const ZCTA_GEOJSON_PATH = "/t.json"

const DynamicMapComponent = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
})

import DashboardPanel from "./DashboardPanel"

const MapAndDashboardWrapper: React.FC = () => {
  const [selectedZcta, setSelectedZcta] = useState<ZCTAFeature | null>(null)
  const [plantsInSelectedZcta, setPlantsInSelectedZcta] = useState<PlantFeature[]>([])

  const [hoveredZcta, setHoveredZcta] = useState<ZCTAFeature | null>(null)
  const [plantsInHoveredZcta, setPlantsInHoveredZcta] = useState<PlantFeature[]>([])

  const [programmaticZctaFeature, setProgrammaticZctaFeature] = useState<ZCTAFeature | null>(null)

  const selectedZctaRef = useRef(selectedZcta)
  ReactUseEffect(() => {
    selectedZctaRef.current = selectedZcta
  }, [selectedZcta])

  const [allZctaGeojsonData, setAllZctaGeojsonData] = useState<FeatureCollection | null>(null);
  const allZctaFeaturesMapRef = useRef<Map<string, ZCTAFeature>>(new Map());


  ReactUseEffect(() => {
    console.log("MapAndDashboardWrapper: Fetching ZCTA GeoJSON data...");
    fetch(ZCTA_GEOJSON_PATH)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data: Feature | FeatureCollection) => {
        let finalGeojsonData: FeatureCollection
        if (data.type === "Feature") {
          finalGeojsonData = {
            type: "FeatureCollection",
            features: [data as Feature<Geometry, GeoJsonProperties>],
          }
        } else {
          finalGeojsonData = data as FeatureCollection<Geometry, GeoJsonProperties>
        }
        setAllZctaGeojsonData(finalGeojsonData);

        finalGeojsonData.features.forEach(feature => {
            const zctaCode = getZctaCodeFromFeature(feature as ZCTAFeature);
            if (zctaCode) {
              allZctaFeaturesMapRef.current.set(zctaCode, feature as ZCTAFeature);
            }
        });
        console.log(`MapAndDashboardWrapper: ZCTA GeoJSON data loaded and lookup map populated with ${allZctaFeaturesMapRef.current.size} features.`);
      })
      .catch((error) => {
        console.error("MapAndDashboardWrapper: Error loading ZCTA GeoJSON for lookup:", error)
      })
  }, []);

  const handleZCTAClick = useCallback((feature: ZCTAFeature, plants: PlantFeature[]) => {
    console.log("MapAndDashboardWrapper: ZCTA Clicked:", getZctaCodeFromFeature(feature));
    setSelectedZcta(feature)
    setPlantsInSelectedZcta(plants)

    setHoveredZcta(null)
    setPlantsInHoveredZcta([])
    // Programmatic ZCTA feature should NOT be set to null on a manual click.
    // The Map component's internal logic for click handling will clear the highlight
    // of a *previously* programmatically highlighted ZCTA.
    // setProgrammaticZctaFeature(null) // <-- REMOVE THIS LINE
  }, [])

  const handleZCTAHover = useCallback(
    (feature: ZCTAFeature | null, plants: PlantFeature[]) => {
      if (!selectedZctaRef.current && !programmaticZctaFeature) {
        setHoveredZcta(feature)
        setPlantsInHoveredZcta(plants)
      }
    },
    [programmaticZctaFeature],
  )

  const handleZipCodeSubmit = useCallback((zipCode: string) => {
    const foundZcta = allZctaFeaturesMapRef.current.get(zipCode);

    console.log("MapAndDashboardWrapper: Searching for ZIP:", zipCode, "in map of size:", allZctaFeaturesMapRef.current.size);
    console.log("MapAndDashboardWrapper: Found ZCTA:", foundZcta);

    if (foundZcta) {
      setProgrammaticZctaFeature(foundZcta);
      setSelectedZcta(foundZcta);
      setPlantsInSelectedZcta([]);
      setHoveredZcta(null);
      setPlantsInHoveredZcta([]);
    } else {
      alert(`ZIP Code ${zipCode} not found in ZCTA data or not in Wisconsin.`);
      setProgrammaticZctaFeature(null);
      setSelectedZcta(null);
      setPlantsInSelectedZcta([]);
    }
  }, []);

  return (
    <div className="map-dashboard-container">
      <div className="map-area">
        <DynamicMapComponent
          onFeatureClick={handleZCTAClick}
          onZCTAHover={handleZCTAHover}
          programmaticZctaFeature={programmaticZctaFeature}
          zctaGeojsonData={allZctaGeojsonData}
        />
      </div>
      <DashboardPanel
        selectedZcta={selectedZcta}
        plantsInSelectedZcta={plantsInSelectedZcta}
        hoveredZcta={hoveredZcta}
        plantsInHoveredZcta={plantsInHoveredZcta}
        onZipCodeSubmit={handleZipCodeSubmit}
      />

      <style jsx>{`
        .map-dashboard-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
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