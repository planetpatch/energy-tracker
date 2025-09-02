import { create } from 'zustand';
import type { ZCTAFeature, PlantFeature } from '../types';

// 1. Define an interface for the state's properties.
// This includes all the data that needs to be shared between components.
interface MapState {
  selectedZcta: ZCTAFeature | null;
  plantsInSelectedZcta: PlantFeature[];
  hoveredZcta: ZCTAFeature | null;
  plantsInHoveredZcta: PlantFeature[];
  programmaticZctaFeature: ZCTAFeature | null;
}

// 2. Define an interface for the actions (functions) that can change the state.
interface MapActions {
  // Action for when a user manually clicks a ZCTA on the map
  selectZcta: (feature: ZCTAFeature, plants: PlantFeature[]) => void;
  // Action for when a user hovers over a ZCTA
  hoverZcta: (feature: ZCTAFeature | null, plants: PlantFeature[]) => void;
  // Action for when a ZCTA is selected via code (e.g., ZIP code search)
  setProgrammaticSelection: (feature: ZCTAFeature | null) => void;
  // Action to clear the programmatic selection, e.g., after a manual click
  clearProgrammaticFeature: () => void;
}

// 3. Create the store using the `create` function from Zustand.
// The store combines both the state and the actions.
export const useMapStore = create<MapState & MapActions>((set) => ({
  // --- INITIAL STATE ---
  // All initial values are set to null or empty arrays.
  selectedZcta: null,
  plantsInSelectedZcta: [],
  hoveredZcta: null,
  plantsInHoveredZcta: [],
  programmaticZctaFeature: null,

  // --- ACTIONS IMPLEMENTATION ---
  // Each action uses the `set` function to update the state immutably.
  selectZcta: (feature, plants) => set({
    selectedZcta: feature,
    plantsInSelectedZcta: plants,
    // When a ZCTA is selected, we clear any hover state.
    hoveredZcta: null,
    plantsInHoveredZcta: [],
  }),

  hoverZcta: (feature, plants) => set({
    hoveredZcta: feature,
    plantsInHoveredZcta: plants,
  }),
  
  setProgrammaticSelection: (feature) => set({
    programmaticZctaFeature: feature,
    // Also update the main selection state when a programmatic selection occurs
    selectedZcta: feature,
    plantsInSelectedZcta: [], // Plants will be calculated later if needed
    hoveredZcta: null,
    plantsInHoveredZcta: [],
  }),

  clearProgrammaticFeature: () => set({
    programmaticZctaFeature: null,
  }),
}));
