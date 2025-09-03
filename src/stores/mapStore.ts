import { create } from 'zustand';
import type { ZCTAFeature, PlantFeature } from '../types';

interface FuelMix {
  [key: string]: {
    renewable_percent: number;
    non_renewable_percent: number;
  };
}

interface MapState {
  selectedZcta: ZCTAFeature | null;
  plantsInSelectedZcta: PlantFeature[];
  hoveredZcta: ZCTAFeature | null;
  plantsInHoveredZcta: PlantFeature[];
  programmaticZctaFeature: ZCTAFeature | null;

  // Map layer visibility
  isZctaVisible: boolean;
  isMgeVisible: boolean;
  isAlliantVisible: boolean;

  // Fuel mix panel state
  activeUtility: 'MGE' | 'Alliant' | 'Both' | null;
  fuelMixData: FuelMix | null;
  isFuelMixVisible: boolean;

  // Dashboard panel visibility
  isDashboardVisible: boolean;
}

interface MapActions {
  selectZcta: (feature: ZCTAFeature, plants: PlantFeature[]) => void;
  hoverZcta: (feature: ZCTAFeature | null, plants: PlantFeature[]) => void;
  setProgrammaticSelection: (feature: ZCTAFeature | null) => void;
  clearProgrammaticFeature: () => void;
  clearSelection: () => void;

  toggleLayerVisibility: (layerName: 'zcta' | 'mge' | 'alliant') => void;

  showFuelMixForProvider: (provider: 'MGE' | 'Alliant' | 'Both', data: FuelMix) => void;
  showFuelMix: () => void;
  hideFuelMix: () => void;

  showDashboard: () => void;
  hideDashboard: () => void;
}

export const useMapStore = create<MapState & MapActions>((set, get) => ({
  // --- INITIAL STATE ---
  selectedZcta: null,
  plantsInSelectedZcta: [],
  hoveredZcta: null,
  plantsInHoveredZcta: [],
  programmaticZctaFeature: null,

  isZctaVisible: true,
  isMgeVisible: true,
  isAlliantVisible: true,

  activeUtility: null,
  fuelMixData: null,
  isFuelMixVisible: false,

  // NEW: dashboard visibility (default visible)
  isDashboardVisible: true,

  // --- ACTIONS IMPLEMENTATION ---
  selectZcta: (feature, plants) => set({
    selectedZcta: feature,
    plantsInSelectedZcta: plants,
    hoveredZcta: null,
    plantsInHoveredZcta: [],
  }),
  
  hoverZcta: (feature, plants) => {
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

  toggleLayerVisibility: (layerName) => set((state) => {
    switch (layerName) {
      case 'zcta':    return { isZctaVisible: !state.isZctaVisible };
      case 'mge':     return { isMgeVisible: !state.isMgeVisible };
      case 'alliant': return { isAlliantVisible: !state.isAlliantVisible };
      default:        return {};
    }
  }),

  showFuelMixForProvider: (provider, data) => set({
    activeUtility: provider,
    fuelMixData: data,
    isFuelMixVisible: true,
  }),

  showFuelMix: () => set({ isFuelMixVisible: true }),
  hideFuelMix: () => set({
    activeUtility: null,
    isFuelMixVisible: false,
    // keep fuelMixData cached
  }),

  // NEW: dashboard show/hide
  showDashboard: () => set({ isDashboardVisible: true }),
  hideDashboard: () => set({ isDashboardVisible: false }),
}));
