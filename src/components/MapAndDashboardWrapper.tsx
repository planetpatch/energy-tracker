// src/components/MapAndDashboardWrapper.tsx
"use client"

// TOOLS IMPORTS
import type React from "react"
import { useState, useCallback, useRef, useEffect} from "react"
import dynamic from "next/dynamic"

// CUSTOM COMPONENT & FUNCTION IMPORTS
import DashboardPanel from "./DashboardPanel"
import { getZctaCodeFromFeature } from '../utils/geo';

// TYPE IMPORTS
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson"
import type { PlantFeature, ZCTAFeature } from '../types';
import type { MapData } from "@/lib/data-loader";


const DynamicMapComponent = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
})



interface MapAndDashboardWrapperProps {
  initialLocation?: string;
  mapData: MapData;
}

const MapAndDashboardWrapper: React.FC<MapAndDashboardWrapperProps> = ({ initialLocation, mapData }) => {
  // State for user interactions (selection and hover) remains here
  const [selectedZcta, setSelectedZcta] = useState<ZCTAFeature | null>(null);
  const [plantsInSelectedZcta, setPlantsInSelectedZcta] = useState<PlantFeature[]>([]);
  const [hoveredZcta, setHoveredZcta] = useState<ZCTAFeature | null>(null);
  const [plantsInHoveredZcta, setPlantsInHoveredZcta] = useState<PlantFeature[]>([]);
  const [programmaticZctaFeature, setProgrammaticZctaFeature] = useState<ZCTAFeature | null>(null);

  const selectedZctaRef = useRef(selectedZcta);
  useEffect(() => {
    selectedZctaRef.current = selectedZcta;
  }, [selectedZcta]);

  const allZctaFeaturesMapRef = useRef<Map<string, ZCTAFeature>>(new Map());

  const handleZipCodeSubmit = useCallback((zipCode: string) => {
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

  useEffect(() => {
    if (mapData && mapData.zctaData) {
      const newMap = new Map<string, ZCTAFeature>();
      mapData.zctaData.features.forEach(feature => {
        const zctaCode = getZctaCodeFromFeature(feature);
        if (zctaCode) {
          newMap.set(zctaCode, feature);
        }
      });
      allZctaFeaturesMapRef.current = newMap;
      console.log(`MADW: ZCTA lookup map populated with ${newMap.size} features from props.`);

      // If there's an initial location, process it now that the data is ready.
      if (initialLocation) {
        handleZipCodeSubmit(initialLocation);
      }
    }
  }, [initialLocation, mapData, handleZipCodeSubmit]);



  const handleZCTAClick = useCallback((feature: ZCTAFeature, plants: PlantFeature[]) => {
    setSelectedZcta(feature);
    setPlantsInSelectedZcta(plants);
    setHoveredZcta(null);
    setPlantsInHoveredZcta([]);
  }, []);

  const handleZCTAHover = useCallback(
    (feature: ZCTAFeature | null, plants: PlantFeature[]) => {
      if (!selectedZctaRef.current && !programmaticZctaFeature) {
        setHoveredZcta(feature);
        setPlantsInHoveredZcta(plants);
      }
    },
    [programmaticZctaFeature],
  );

  return (
    <div className="map-dashboard-container">
      <div className="map-area">
        <DynamicMapComponent
          onFeatureClick={handleZCTAClick}
          onZCTAHover={handleZCTAHover}
          programmaticZctaFeature={programmaticZctaFeature}
          zctaGeojsonData={mapData.zctaData}
          plantsData={mapData.plantsData}
          mgeBordersData={mapData.mgeBordersData}
          alliantBordersData={mapData.alliantBordersData}
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
