"use client";

import { useCallback, useRef, useEffect } from "react";
import { useMapStore } from "@/stores/mapStore";
import { getZctaCodeFromFeature } from '../utils/geo';
import type { ZCTAFeature } from '../types';
import type { MapData } from "@/lib/data-loader";

// Import the new responsive components and the media query hook
import { useMediaQuery } from "@/hooks/useMediaQuery";
import DesktopMapWrapper from "./DesktopView/DesktopMapWrapper";
import MobileMapWrapper from "./MobileView/MobileMapWrapper";

interface MapAndDashboardWrapperProps {
  initialLocation?: string;
  mapData: MapData;
}

const MapAndDashboardWrapper: React.FC<MapAndDashboardWrapperProps> = ({ initialLocation, mapData }) => {
  // --- SHARED LOGIC ---

  // Ref to hold a map of all ZIP codes for quick lookups
  const allZctaFeaturesMapRef = useRef<Map<string, ZCTAFeature>>(new Map());
  
  // Custom hook to detect screen size
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // This function handles the submission from the Dashboard's search bar
  const handleZipCodeSubmit = useCallback((zipCode: string) => {
    const { setProgrammaticSelection } = useMapStore.getState();
    const zipMatch = zipCode.match(/\d{5}/);
    const searchKey = zipMatch ? zipMatch[0] : zipCode;
    const foundZcta = allZctaFeaturesMapRef.current.get(searchKey);

    if (foundZcta) {
      setProgrammaticSelection(foundZcta);
    } else {
      alert(`ZIP Code ${searchKey} not found in Dane County.`);
      setProgrammaticSelection(null);
    }
  }, []);

  // This effect populates the ZIP code map on initial load
  useEffect(() => {
    if (mapData?.zctaData) {
      const newMap = new Map<string, ZCTAFeature>();
      mapData.zctaData.features.forEach(feature => {
        const zctaCode = getZctaCodeFromFeature(feature);
        if (zctaCode) {
          newMap.set(zctaCode, feature);
        }
      });
      allZctaFeaturesMapRef.current = newMap;

      // Process initial location if provided
      if (initialLocation) {
        handleZipCodeSubmit(initialLocation);
      }
    }
  }, [initialLocation, mapData, handleZipCodeSubmit]);

  // Props to be passed down to both responsive components
  const sharedProps = {
    mapData,
    handleZipCodeSubmit,
  };

  // --- CONDITIONAL RENDER ---
  // Render the appropriate component based on the screen size
  return isDesktop ? (
    <DesktopMapWrapper {...sharedProps} />
  ) : (
    <MobileMapWrapper {...sharedProps} />
  );
};

export default MapAndDashboardWrapper;