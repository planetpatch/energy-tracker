// src/components/MapAndDashboardWrapper.tsx
"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect as ReactUseEffect } from "react"
import dynamic from "next/dynamic"
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson"

// >>>>>>>>>>>>>>>>>>>>>> IMPORT SHARED TYPES <<<<<<<<<<<<<<<<<<<<<<<
import type {
  PlantFeature, ZCTAFeature
  // PlantProperties,
 } from '../types';
import { getZctaCodeFromFeature } from '../utils/geo';

const ZCTA_GEOJSON_PATH = "/dc.json"

const DynamicMapComponent = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
})

import DashboardPanel from "./DashboardPanel"

interface MapAndDashboardWrapperProps {
  initialLocation?: string;
}

const MapAndDashboardWrapper: React.FC<MapAndDashboardWrapperProps> = ({ initialLocation }) => {
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


  const handleZipCodeSubmit = useCallback((zipCode: string) => {
    // We can extract a 5-digit zip from a longer address string if needed
    const zipMatch = zipCode.match(/\d{5}/);
    const searchKey = zipMatch ? zipMatch[0] : zipCode;

    const foundZcta = allZctaFeaturesMapRef.current.get(searchKey);

    console.log("MapAndDashboardWrapper: Searching for ZIP:", searchKey, "in map of size:", allZctaFeaturesMapRef.current.size);
    console.log("MapAndDashboardWrapper: Found ZCTA:", foundZcta);

    if (foundZcta) {
      setProgrammaticZctaFeature(foundZcta);
      setSelectedZcta(foundZcta);
      setPlantsInSelectedZcta([]);
      setHoveredZcta(null);
      setPlantsInHoveredZcta([]);
    } else {
      alert(`ZIP Code ${searchKey} not found in ZCTA data or not in Wisconsin.`);
      setProgrammaticZctaFeature(null);
      setSelectedZcta(null);
      setPlantsInSelectedZcta([]);
    }
  }, []);

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

        const newMap = new Map<string, ZCTAFeature>();
        finalGeojsonData.features.forEach(feature => {
            const zctaCode = getZctaCodeFromFeature(feature as ZCTAFeature);
            if (zctaCode) {
              newMap.set(zctaCode, feature as ZCTAFeature);
            }
        });
        allZctaFeaturesMapRef.current = newMap;
        console.log(`MapAndDashboardWrapper: ZCTA GeoJSON data loaded and lookup map populated with ${allZctaFeaturesMapRef.current.size} features.`);
        
        // If there's an initial location, process it after the data is loaded.
        if (initialLocation) {
          handleZipCodeSubmit(initialLocation);
        }
      })
      .catch((error) => {
        console.error("MapAndDashboardWrapper: Error loading ZCTA GeoJSON for lookup:", error)
      })
  }, [initialLocation, handleZipCodeSubmit]); // Rerun if initialLocation changes (though it shouldn't)

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
          height: calc(100vh - 64px); /* Adjust height for the header */
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
