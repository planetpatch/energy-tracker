// src/data/pois.ts (add these new types and data)
import { LatLngExpression } from 'leaflet';

export interface PointOfInterest {
    id: string;
    name: string;
    latlng: LatLngExpression;
    description: string;
    category?: string;
}

export interface Neighborhood {
    id: string;
    name: string;
    coordinates: L.LatLngExpression[][]; // Array of arrays for polygon coordinates
    info: string;
    color: string; // To differentiate visually
}

export const POIS: PointOfInterest[] = [
    { id: '1', name: 'State Capitol', latlng: [43.0746, -89.3840], description: 'Wisconsin State Capitol Building, a beautiful landmark in Madison.', category: 'Landmark' },
    { id: '2', name: 'UW-Madison Memorial Union', latlng: [43.0760, -89.3984], description: 'Popular student union on Lake Mendota, famous for its Terrace.', category: 'Education' },
    { id: '3', name: 'Monona Terrace', latlng: [43.0725, -89.3808], description: 'Convention center and community cultural arts facility designed by Frank Lloyd Wright.', category: 'Architecture' },
    { id: '4', name: 'Olbrich Botanical Gardens', latlng: [43.0900, -89.3360], description: '16 acres of outdoor gardens & tropical conservatory.', category: 'Nature' },
];

// Example Madison Neighborhoods (simplified boundaries)
export const NEIGHBORHOODS: Neighborhood[] = [
    {
        id: 'central-madison',
        name: 'Central Madison',
        coordinates: [
            [[43.0800, -89.4050], [43.0800, -89.3800], [43.0650, -89.3800], [43.0650, -89.4050], [43.0800, -89.4050]]
        ],
        info: 'The bustling heart of Madison, including the Capitol and State Street.',
        color: '#FF6347' // Tomato
    },
    {
        id: 'near-east-side',
        name: 'Near East Side',
        coordinates: [
            [[43.0950, -89.3750], [43.0950, -89.3400], [43.0750, -89.3400], [43.0750, -89.3750], [43.0950, -89.3750]]
        ],
        info: 'Known for its historic homes, local businesses, and community vibe.',
        color: '#4682B4' // SteelBlue
    }
];