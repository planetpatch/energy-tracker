// src/map/icons.ts

import * as L from "leaflet";
import type { Feature } from "geojson"; // Import Feature type if not already globally available
import {
    SOLAR_ICON_PATH,
    NATURAL_GAS_ICON_PATH,
    WIND_ICON_PATH,
    PETROLEUM_ICON_PATH,
    COAL_ICON_PATH,
    INDUSTRIAL_BATTERY_ICON_PATH,
    HYDROELECTRIC_ICON_PATH
} from './icon-paths'; 

/**
 * Creates a standardized Leaflet DivIcon for custom image markers.
 * Applies the 'custom-plant-icon' class for circular styling via global CSS.
 * @param imgPath The URL path to the image.
 * @param name A descriptive name for the icon's alt text.
 * @returns A Leaflet DivIcon instance.
 */
export const createCustomIcon = (imgPath: string, name: string) => L.divIcon({
  className: 'custom-plant-icon', // This class is defined in src/app/globals.css
  html: `<img src="${imgPath}" alt="${name} icon" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`,
  iconSize: [20, 20], // Dimensions of the icon container (div)
  iconAnchor: [10, 10], // Point of the icon that corresponds to the marker's location (center)
  popupAnchor: [0, -10] // Adjust as needed for popup positioning
});

// Initialize all specific icons using the helper
const solarIcon = createCustomIcon(SOLAR_ICON_PATH, 'Solar');
const naturalGasIcon = createCustomIcon(NATURAL_GAS_ICON_PATH, 'Natural Gas');
const windIcon = createCustomIcon(WIND_ICON_PATH, 'Wind');
const petroleumIcon = createCustomIcon(PETROLEUM_ICON_PATH, 'Petroleum');
const coalIcon = createCustomIcon(COAL_ICON_PATH, 'Coal');
const industrialBatteryIcon = createCustomIcon(INDUSTRIAL_BATTERY_ICON_PATH, 'Industrial Battery');
const hydroelectricIcon = createCustomIcon(HYDROELECTRIC_ICON_PATH, 'Hydroelectric');

/**
 * Determines and creates the appropriate Leaflet marker (image-based or circle)
 * for a given energy plant feature.
 * @param feature The GeoJSON Feature object representing the plant.
 * @param latlng The Leaflet LatLng object for the plant's location.
 * @returns A Leaflet Marker or CircleMarker instance.
 */
export const createPlantMarker = (feature: Feature, latlng: L.LatLng) => {
  const primarySource = feature.properties?.primarySource;
  let iconToUse: L.DivIcon | undefined;
  let tooltipName = feature.properties?.name || 'Energy Plant'; // Default tooltip name

  switch (primarySource) {
    case "Solar":
      iconToUse = solarIcon;
      tooltipName = feature.properties?.name || 'Solar Energy Plant';
      break;
    case "Natural Gas":
      iconToUse = naturalGasIcon;
      tooltipName = feature.properties?.name || 'Natural Gas Energy Plant';
      break;
    case "Wind":
      iconToUse = windIcon;
      tooltipName = feature.properties?.name || 'Wind Energy Plant';
      break;
    case "Petroleum":
      iconToUse = petroleumIcon;
      tooltipName = feature.properties?.name || 'Petroleum Energy Plant';
      break;
    case "Coal":
      iconToUse = coalIcon;
      tooltipName = feature.properties?.name || 'Coal Energy Plant';
      break;
    case "Battery Storage": // Ensure this matches your JSON exactly for battery plants
      iconToUse = industrialBatteryIcon;
      tooltipName = feature.properties?.name || 'Battery Storage Plant';
      break;
    case "Hydroelectric": // Ensure this matches your JSON exactly for hydroelectric plants
      iconToUse = hydroelectricIcon;
      tooltipName = feature.properties?.name || 'Hydroelectric Power Plant';
      break;
    default:
      // Fallback to a plain circle marker for any unrecognized or missing primarySource
      return L.circleMarker(latlng, {
        radius: 5,
        fillColor: "#0078FF", // A default color for unknown types
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).bindTooltip(tooltipName);
  }

  // If an icon was assigned (i.e., not the default circle fallback)
  if (iconToUse) {
    return L.marker(latlng, { icon: iconToUse }).bindTooltip(tooltipName);
  } else {
     // This else block should ideally not be reached if the default case above handles all non-image cases
     // But it's here as a safeguard to ensure a marker is always returned.
     return L.circleMarker(latlng, {
        radius: 5,
        fillColor: "#0078FF",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).bindTooltip(tooltipName);
  }
};