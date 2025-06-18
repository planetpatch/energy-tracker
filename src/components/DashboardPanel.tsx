// src/components/DashboardPanel.tsx
import React from 'react';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';

type ZCTAFeature = Feature<Geometry, GeoJsonProperties>;

interface DashboardPanelProps {
    selectedZcta: ZCTAFeature | null;
    hoveredZcta: ZCTAFeature | null;
    plantsInHoveredZcta: string[];
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({ selectedZcta, hoveredZcta, plantsInHoveredZcta }) => {
    // Determine which ZCTA to display primary info for (clicked takes precedence over hover for primary ZCTA info)
    const displayPrimaryZcta = selectedZcta || hoveredZcta;
    const displayPrimaryZctaCode = displayPrimaryZcta ? (displayPrimaryZcta.properties as any)?.ZCTA5CE10 || (displayPrimaryZcta.properties as any)?.ZCTA5CE20 : null;

    return (
        <div className="dashboard-panel">
            <h2>Details</h2>

            {/* Section for Plants in Hovered ZCTA */}
            {hoveredZcta && plantsInHoveredZcta.length > 0 ? (
                <div className="hover-info-section">
                    <h3>Plants in ZCTA {displayPrimaryZctaCode || 'N/A'} (Hovered)</h3>
                    <ul>
                        {plantsInHoveredZcta.map((plantName, index) => (
                            <li key={index}>{plantName}</li>
                        ))}
                    </ul>
                </div>
            ) : hoveredZcta ? (
                <div className="hover-info-section">
                    <h3>Hovered ZCTA: {displayPrimaryZctaCode || 'N/A'}</h3>
                    <p>No plants found in this ZCTA.</p>
                </div>
            ) : null}

            {/* Section for Clicked ZCTA Info */}
            {selectedZcta ? (
                <div className="selected-info-section">
                    <h3>Selected ZCTA: {displayPrimaryZctaCode || 'N/A'}</h3>
                    {/* You can add more details for the clicked ZCTA here if desired, e.g., land/water area */}
                    <p>Click on other ZCTAs or hover for plant info.</p>
                </div>
            ) : (
                // Initial message or if nothing is selected/hovered
                <p>Click a ZIP Code boundary to see its number, or hover to see plants within.</p>
            )}

            <style jsx>{`
                .dashboard-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 280px; /* Increased width to accommodate plant names */
                    max-height: calc(100vh - 40px); /* Adjust max-height */
                    background-color: rgba(255, 255, 255, 0.95); /* Slightly less transparent */
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    z-index: 1000;
                    overflow-y: auto; /* Allow scrolling for many plants */
                }
                h2 {
                    margin-top: 0;
                    margin-bottom: 15px;
                    color: #333;
                    font-size: 1.2em;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 10px;
                }
                h3 {
                    margin-top: 10px;
                    margin-bottom: 8px;
                    color: #0056b3;
                    font-size: 1.4em;
                    font-weight: bold;
                }
                p {
                    margin-bottom: 5px;
                    font-size: 0.9em;
                    color: #666;
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
                }
                .hover-info-section, .selected-info-section {
                    margin-bottom: 20px; /* Space between sections */
                    padding-bottom: 15px;
                    border-bottom: 1px dashed #ddd; /* Separator */
                }
                .selected-info-section:last-child, .hover-info-section:last-child {
                    border-bottom: none; /* No border for the last section */
                }
            `}</style>
        </div>
    );
};

export default DashboardPanel;