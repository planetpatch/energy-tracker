import { create } from 'zustand';
import type { ZCTAFeature, PlantFeature } from '../types';

// --- Stronger types ---
export type Provider = 'MGE' | 'Alliant';
export type ActiveUtility = Provider | 'Both' | null;

interface FuelMixEntry {
  renewable_percent: number;
  non_renewable_percent: number;
}
export type FuelMix = Partial<Record<Provider, FuelMixEntry>>;

interface MapState {
  selectedZcta: ZCTAFeature | null;
  plantsInSelectedZcta: PlantFeature[];
  hoveredZcta: ZCTAFeature | null;
  plantsInHoveredZcta: PlantFeature[];
  programmaticZctaFeature: ZCTAFeature | null;

  // Layer visibility
  isZctaVisible: boolean;
  isMgeVisible: boolean;
  isAlliantVisible: boolean;

  activeUtility: ActiveUtility;
  fuelMixData: FuelMix | null;
  activePanel: 'dashboard' | 'fuelMix' | null;
}

interface MapActions {
  selectZcta: (feature: ZCTAFeature, plants: PlantFeature[]) => void;
  hoverZcta: (feature: ZCTAFeature | null, plants: PlantFeature[]) => void;
  setProgrammaticSelection: (feature: ZCTAFeature | null) => void;
  clearProgrammaticFeature: () => void;
  clearSelection: () => void;

  toggleLayerVisibility: (layerName: 'zcta' | 'mge' | 'alliant') => void;
  showFuelMixForProvider: (provider: ActiveUtility, data: FuelMix) => void;
  togglePanel: (panel: 'dashboard' | 'fuelMix') => void;
}

export const useMapStore = create<MapState & MapActions>((set, get) => ({
  // --- INITIAL STATE ---
  selectedZcta: null,
  plantsInSelectedZcta: [],
  hoveredZcta: null,
  plantsInHoveredZcta: [],
  programmaticZctaFeature: null,

  // Default visibility
  isZctaVisible: true,
  isMgeVisible: true,
  isAlliantVisible: true,

  activeUtility: null,
  fuelMixData: null,
  activePanel: null,

  // --- ACTIONS ---
  selectZcta: (feature, plants) =>
    set({
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

  setProgrammaticSelection: (feature) =>
    set({
      programmaticZctaFeature: feature,
      selectedZcta: feature,
      plantsInSelectedZcta: feature?.properties.plants || [],
      hoveredZcta: null,
      plantsInHoveredZcta: [],
    }),

  clearProgrammaticFeature: () => set({ programmaticZctaFeature: null }),
  clearSelection: () => set({ selectedZcta: null, plantsInSelectedZcta: [] }),

  toggleLayerVisibility: (layerName) =>
    set((state) => {
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

  showFuelMixForProvider: (provider, data) =>
    set({
      activeUtility: provider,
      fuelMixData: data,
      activePanel: 'fuelMix',
    }),

  togglePanel: (panel) => {
    const { activePanel } = get();
    set({ activePanel: activePanel === panel ? null : panel });
  },
}));
