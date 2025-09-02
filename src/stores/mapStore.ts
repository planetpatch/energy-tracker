import { create } from 'zustand';
import type { ZCTAFeature, PlantFeature } from '../types';

interface MapState {
  selectedZcta: ZCTAFeature | null;
  plantsInSelectedZcta: PlantFeature[];
  hoveredZcta: ZCTAFeature | null;
  plantsInHoveredZcta: PlantFeature[];
  programmaticZctaFeature: ZCTAFeature | null;
}

interface MapActions {
  selectZcta: (feature: ZCTAFeature, plants: PlantFeature[]) => void;
  hoverZcta: (feature: ZCTAFeature | null, plants: PlantFeature[]) => void;
  setProgrammaticSelection: (feature: ZCTAFeature | null) => void;
  clearProgrammaticFeature: () => void;
  clearSelection: () => void; // Action to clear manual selection
}

export const useMapStore = create<MapState & MapActions>((set, get) => ({
  // --- INITIAL STATE ---
  selectedZcta: null,
  plantsInSelectedZcta: [],
  hoveredZcta: null,
  plantsInHoveredZcta: [],
  programmaticZctaFeature: null,

  // --- ACTIONS IMPLEMENTATION ---
  selectZcta: (feature, plants) => set({
    selectedZcta: feature,
    plantsInSelectedZcta: plants,
    hoveredZcta: null,
    plantsInHoveredZcta: [],
  }),

  // --- MODIFICATION: This action is now "smarter" ---
  // It will not update the hover state if a ZCTA is already selected.
  hoverZcta: (feature, plants) => {
    // We use get() to check the current state before setting a new one.
    if (get().selectedZcta || get().programmaticZctaFeature) {
      // If something is already selected, do nothing.
      return;
    }
    set({
      hoveredZcta: feature,
      plantsInHoveredZcta: plants,
    });
  },
  
  setProgrammaticSelection: (feature) => set({
    programmaticZctaFeature: feature,
    selectedZcta: feature,
    plantsInSelectedZcta: [],
    hoveredZcta: null,
    plantsInHoveredZcta: [],
  }),

  clearProgrammaticFeature: () => set({
    programmaticZctaFeature: null,
  }),

  clearSelection: () => set({
    selectedZcta: null,
    plantsInSelectedZcta: [],
  }),
}));

