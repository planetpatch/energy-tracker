import { create } from 'zustand';
import type { ZCTAFeature, PlantFeature } from '../types';

interface MapState {
  selectedZcta: ZCTAFeature | null;
  plantsInSelectedZcta: PlantFeature[];
  hoveredZcta: ZCTAFeature | null;
  plantsInHoveredZcta: PlantFeature[];
  programmaticZctaFeature: ZCTAFeature | null;
  // --- NEW: Add state for layer visibility ---
  isZctaVisible: boolean;
  isMgeVisible: boolean;
  isAlliantVisible: boolean;
}

interface MapActions {
  selectZcta: (feature: ZCTAFeature, plants: PlantFeature[]) => void;
  hoverZcta: (feature: ZCTAFeature | null, plants: PlantFeature[]) => void;
  setProgrammaticSelection: (feature: ZCTAFeature | null) => void;
  clearProgrammaticFeature: () => void;
  clearSelection: () => void;
  // --- NEW: Add an action to toggle layers ---
  toggleLayerVisibility: (layerName: 'zcta' | 'mge' | 'alliant') => void;
}

export const useMapStore = create<MapState & MapActions>((set, get) => ({
  // --- INITIAL STATE ---
  selectedZcta: null,
  plantsInSelectedZcta: [],
  hoveredZcta: null,
  plantsInHoveredZcta: [],
  programmaticZctaFeature: null,
  // --- NEW: Set default visibility to true ---
  isZctaVisible: true,
  isMgeVisible: true,
  isAlliantVisible: true,

  // --- ACTIONS IMPLEMENTATION ---
  selectZcta: (feature, plants) => set({
    selectedZcta: feature,
    plantsInSelectedZcta: plants,
    hoveredZcta: null,
    plantsInHoveredZcta: [],
  }),
  
  hoverZcta: (feature, plants) => {
    // Only update hover state if nothing is actively selected
    if (!get().selectedZcta) {
      set({
        hoveredZcta: feature,
        plantsInHoveredZcta: plants,
      });
    }
  },

  setProgrammaticSelection: (feature) => set({
    programmaticZctaFeature: feature,
    selectedZcta: feature,
    plantsInSelectedZcta: feature?.properties.plants || [],
    hoveredZcta: null,
    plantsInHoveredZcta: [],
  }),

  clearProgrammaticFeature: () => set({ programmaticZctaFeature: null }),
  clearSelection: () => set({ selectedZcta: null, plantsInSelectedZcta: [] }),

  // --- NEW: Implement the toggle action ---
  toggleLayerVisibility: (layerName) => set((state) => {
    switch (layerName) {
        case 'zcta':
            return { isZctaVisible: !state.isZctaVisible };
        case 'mge':
            return { isMgeVisible: !state.isMgeVisible };
        case 'alliant':
            return { isAlliantVisible: !state.isAlliantVisible };
        default:
            return {};
    }
  }),
}));

