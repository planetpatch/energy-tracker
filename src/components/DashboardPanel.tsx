// src/components/DashboardPanel.tsx
"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image";
import type {
  ZCTAFeature, PlantFeature 
  //,PlantProperties
} from '../types';

// >>>>>>>>>>>>>>>>>>>>>> IMPORT ICON PATHS AGAIN <<<<<<<<<<<<<<<<<<<<<<<
import {
    SOLAR_ICON_PATH,
    NATURAL_GAS_ICON_PATH,
    WIND_ICON_PATH,
    PETROLEUM_ICON_PATH,
    COAL_ICON_PATH,
    INDUSTRIAL_BATTERY_ICON_PATH,
    HYDROELECTRIC_ICON_PATH
} from '../map/icon-paths'; 
// >>>>>>>>>>>>>>>>>>>>>> END IMPORT ICON PATHS <<<<<<<<<<<<<<<<<<<<<<<

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
  const [hoveredPlantIndex, setHoveredPlantIndex] = useState<number | null>(null);

  const getZctaCode = (feature: ZCTAFeature | null): string => {
    if (!feature) return "N/A"
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

  // >>>>>>>>>>>>>>>>>>>>>> HELPER TO GET ICON PATH (USING IMPORTED CONSTANTS) <<<<<<<<<<<<<<<<<<<<<<<
  const getSourceIconPath = (primarySource?: string | null): string | null => {
      switch (primarySource) {
          case "Solar": return SOLAR_ICON_PATH;
          case "Natural Gas": return NATURAL_GAS_ICON_PATH;
          case "Wind": return WIND_ICON_PATH;
          case "Petroleum": return PETROLEUM_ICON_PATH;
          case "Coal": return COAL_ICON_PATH;
          case "Battery Storage": return INDUSTRIAL_BATTERY_ICON_PATH; // Assuming this source name from your JSON
          case "Hydroelectric": return HYDROELECTRIC_ICON_PATH; // Assuming this source name from your JSON
          default: return null; // No icon for unknown source
      }
  };
  // >>>>>>>>>>>>>>>>>>>>>> END HELPER <<<<<<<<<<<<<<<<<<<<<<<

  const renderPlantList = (plants: PlantFeature[]) => {
    if (plants.length === 0) {
      return <p style={{ color: 'black' }}>No known energy plants in this ZCTA.</p>;
    }
    return (
      <ul>
        {plants.map((plant, index) => {
          const sourceIconPath = getSourceIconPath(plant.properties.primarySource);
          
          const plantContentBaseStyle: React.CSSProperties = {
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px',
            backgroundColor: '#007bff',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            width: '100%',
            boxSizing: 'border-box',
          };

          const plantContentHoverStyle: React.CSSProperties = hoveredPlantIndex === index ? {
            backgroundColor: '#0056b3',
          } : {};

          const combinedPlantContentStyle = { ...plantContentBaseStyle, ...plantContentHoverStyle };

          return (
            <li 
              key={plant.properties.name || `plant-${index}`} 
              style={{ marginBottom: '5px' }}
              onMouseEnter={() => setHoveredPlantIndex(index)}
              onMouseLeave={() => setHoveredPlantIndex(null)}
            >
              <div 
                onClick={() => handlePlantClick(index)} 
                style={combinedPlantContentStyle}
                className="plant-item-content"
              >
                {sourceIconPath && (
                 <Image 
                  src={sourceIconPath} 
                  alt={plant.properties.primarySource || 'Energy Source'} 
                  className="plant-source-icon"
                  width={18}
                  height={18}
                  style={{ 
                    borderRadius: '50%', // This makes the icon a circle
                    marginRight: '12px'
                  }}
                />
                )}
                <button type="button" style={{ 
                    background: 'none', 
                    border: 'none', 
                    padding: '0', 
                    margin: '0', 
                    font: 'inherit', 
                    color: 'white', 
                    textAlign: 'left', 
                    width: '100%', 
                    cursor: 'pointer',
                    flexGrow: 1, 
                }}>
                  {plant.properties.name || 'Unnamed Plant'}
                </button>
              </div>
              
              {expandedPlantIndex === index && (
                <div style={{ color: 'black' }}>
                  <p><strong>City:</strong> {plant.properties.cityName || 'N/A'}</p>
                  <p><strong>Utility:</strong> {plant.properties.utilityName || 'N/A'}</p>
                  <p><strong>Sector:</strong> {plant.properties.sectorName || 'N/A'}</p>
                  <p><strong>Technology:</strong> {plant.properties.techDesc || 'N/A'}</p>
                  <p><strong>Source:</strong> {plant.properties.primarySource || 'N/A'}</p>
                  <p><strong>Installed MW:</strong> {plant.properties.installedMW ?? 'N/A'}</p>
                  <p><strong>Total MW:</strong> {plant.properties.totalMW ?? 'N/A'}</p>
                </div>
              )}
            </li>
          );
        })}
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
        <div style={{ color: 'black' }}>
          <h3>Selected ZCTA: {getZctaCode(selectedZcta)}</h3>
          {renderPlantList(plantsInSelectedZcta)}
          <p className="instruction-text">Click on other ZCTAs or hover for plant info.</p>
        </div>
      ) : hoveredZcta ? (
        <div className="hover-info-section">
          <h3>Hovered ZCTA: {getZctaCode(hoveredZcta)}</h3>
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
                .plant-list-item { 
                    margin-bottom: 5px; 
                }

                .plant-item-content {
                    /* These styles are applied via inline style for dynamic hover, but keeping class for reference */
                    display: flex;
                    align-items: center;
                    padding: 8px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    width: 100%;
                    box-sizing: border-box;
                    /* Background color will be set dynamically via inline style */
                }

                .plant-source-icon {
                    margin-right: 8px;
                    object-fit: cover;
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    flex-shrink: 0;
                    /* border-radius is now applied inline to ensure it's a circle */
                }

                button { 
                    padding: 8px 12px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1em;
                    transition: background-color 0.2s;
                }
                button:hover {
                    background-color: #0056b3;
                }

                .plant-details button { 
                    background: none;
                    border: none;
                    padding: 0;
                    margin: 0;
                    font: inherit;
                    color: white;
                    text-align: left;
                    width: 100%;
                    flex-grow: 1;
                    cursor: pointer;
                }
                .plant-details button:focus { 
                    outline: none; 
                    box-shadow: none;
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
                    margin-top: 10px;
                }
                .plant-details {
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid #ccc;
                    font-size: 0.85em;
                    color: black;
                }
                .plant-details p {
                    margin-bottom: 3px;
                    color: black;
                }
                .no-plants-text {
                    color: black !important;
                }
            `}</style>
    </div>
  )
}

export default DashboardPanel