// src/components/DashboardPanel.tsx
"use client"

import type React from "react"
import { useState } from "react"
// Removed direct geojson imports. Point is used within PlantFeature in types.ts.
// import type { Feature, Geometry, GeoJsonProperties, Point } from "geojson"

// >>>>>>>>>>>>>>>>>>>>>> IMPORT SHARED TYPES <<<<<<<<<<<<<<<<<<<<<<<
import type { ZCTAFeature, PlantFeature, PlantProperties } from '../types'; // Import from types.ts

interface DashboardPanelProps {
  selectedZcta: ZCTAFeature | null
  plantsInSelectedZcta: PlantFeature[]
  hoveredZcta: ZCTAFeature | null
  plantsInHoveredZcta: PlantFeature[]
  onZipCodeSubmit: (zipCode: string) => void
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({
  selectedZcta,
  plantsInSelectedZcta,
  hoveredZcta,
  plantsInHoveredZcta,
  onZipCodeSubmit,
}) => {
  const [zipCodeInput, setZipCodeInput] = useState<string>("")
  const [expandedPlantIndex, setExpandedPlantIndex] = useState<number | null>(null);

  // Helper function to get ZCTA code from feature
  const getZctaCode = (feature: ZCTAFeature | null): string => {
    if (!feature) return "N/A"
    // Cast properties to MyZCTASpecificProperties if needed for specific properties
    const properties = feature.properties as PlantProperties; // This type is wrong, should be ZCTAProperties
    // Correction based on ZCTA type:
    const zctaProperties = feature.properties as ZCTAFeature['properties'];
    return zctaProperties?.ZCTA5CE10 || zctaProperties?.ZCTA5CE20 || "N/A"
  }


  const handleSubmit = () => {
    if (zipCodeInput.trim()) {
      onZipCodeSubmit(zipCodeInput.trim())
    }
  }

  const handlePlantClick = (index: number) => {
    setExpandedPlantIndex(expandedPlantIndex === index ? null : index);
  };

  const renderPlantList = (plants: PlantFeature[]) => {
    if (plants.length === 0) {
      return <p>No known energy plants in this ZCTA.</p>;
    }
    return (
      <ul>
        {plants.map((plant, index) => (
          <li key={plant.properties.name || `plant-${index}`} onClick={() => handlePlantClick(index)} className="plant-item">
            {/* Properties are now guaranteed to conform to MyPlantSpecificProperties */}
            <strong>{plant.properties.name || 'Unnamed Plant'}</strong>
            {expandedPlantIndex === index && (
              <div className="plant-details">
                <p><strong>Utility:</strong> {plant.properties.utilityName || 'N/A'}</p>
                <p><strong>City:</strong> {plant.properties.cityName || 'N/A'}</p>
                <p><strong>Technology:</strong> {plant.properties.techDesc || 'N/A'}</p>
                <p><strong>Source:</strong> {plant.properties.primarySource || 'N/A'}</p>
                <p><strong>Sector:</strong> {plant.properties.sectorName || 'N/A'}</p>
                <p><strong>Installed MW:</strong> {plant.properties.installedMW ?? 'N/A'}</p>
                <p><strong>Total MW:</strong> {plant.properties.totalMW ?? 'N/A'}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };


  return (
    <div className="dashboard-panel">
      <h2>Energy Dashboard</h2>

      <div className="zip-input-section">
        <h3>Find by ZIP Code</h3>
        <input
          type="text"
          placeholder="Enter 5-digit ZIP"
          value={zipCodeInput}
          onChange={(e) => setZipCodeInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSubmit()
            }
          }}
          maxLength={5}
        />
        <button onClick={handleSubmit}>Go to ZIP</button>
      </div>

      {selectedZcta ? (
        <div className="selected-info-section">
          <h3>Selected ZCTA: {getZctaCode(selectedZcta)}</h3>
          <h4>Energy Plants:</h4>
          {renderPlantList(plantsInSelectedZcta)}
          <p className="instruction-text">Click on other ZCTAs or hover for plant info.</p>
        </div>
      ) : hoveredZcta ? (
        <div className="hover-info-section">
          <h3>Hovered ZCTA: {getZctaCode(hoveredZcta)}</h3>
          <h4>Energy Plants:</h4>
          {renderPlantList(plantsInHoveredZcta)}
          <p className="instruction-text">Click to select this ZCTA.</p>
        </div>
      ) : null }

      <style jsx>{`
                .dashboard-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 280px;
                    max-height: calc(100vh - 40px);
                    background-color: rgba(255, 255, 255, 0.95);
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    z-index: 1000;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }
                h2 {
                    margin-top: 0;
                    margin-bottom: 15px;
                    color: #333;
                    font-size: 1.5em;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 10px;
                }
                h3 {
                    margin-top: 10px;
                    margin-bottom: 8px;
                    color: #0056b3;
                    font-size: 1.1em;
                    font-weight: bold;
                }
                h4 {
                    margin-top: 10px;
                    margin-bottom: 5px;
                    color: #555;
                    font-size: 1.0em;
                }
                p {
                    margin-bottom: 5px;
                    font-size: 0.9em;
                    color: #666;
                }
                .instruction-text {
                    font-style: italic;
                    color: #888;
                    margin-top: 15px;
                }
                ul {
                    list-style-type: none;
                    padding: 0;
                    margin: 10px 0 0 0;
                }
                li {
                    background-color: #e9e9e9;
                    margin-bottom: 5px;
                    padding: 8px;
                    border-radius: 4px;
                    font-size: 0.9em;
                    color: #333;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                li:hover {
                    background-color: #e0e0e0;
                }
                .hover-info-section, .selected-info-section {
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px dashed #ddd;
                }
                .selected-info-section:last-child, .hover-info-section:last-child {
                    border-bottom: none;
                }

                .zip-input-section {
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #ddd;
                }
                .zip-input-section input {
                    width: calc(100% - 70px);
                    padding: 8px;
                    margin-right: 5px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 1em;
                    color: black;
                }
                .zip-input-section input::placeholder {
                    color: #555;
                }
                .zip-input-section button {
                    padding: 8px 12px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1em;
                    margin-top: 10px;
                }
                .zip-input-section button:hover {
                    background-color: #0056b3;
                }
                .plant-details {
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid #ccc;
                    font-size: 0.85em;
                    color: #555;
                }
                .plant-details p {
                    margin-bottom: 3px;
                }
            `}</style>
    </div>
  )
}

export default DashboardPanel