import { create } from 'zustand';
import type { ZCTAFeature} from '../types';

interface FuelMix {
  [key: string]: {
    renewable_percent: number;
    non_renewable_percent: number;
  };
}

interface MapState {
  selectedZcta: ZCTAFeature | null;
  hoveredZcta: ZCTAFeature | null;
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
  isTakeActionVisible: boolean;

  //fuelmix progress bar persistence
    showMge: boolean;
  showAlliant: boolean;
}

interface MapActions {
  selectZcta: (feature: ZCTAFeature) => void;
  hoverZcta: (feature: ZCTAFeature | null) => void;
  setProgrammaticSelection: (feature: ZCTAFeature | null) => void;
  clearProgrammaticFeature: () => void;
  clearSelection: () => void;
  toggleLayerVisibility: (layerName: 'zcta' | 'mge' | 'alliant') => void;

  showFuelMixForProvider: (provider: 'MGE' | 'Alliant' | 'Both', data: FuelMix) => void;
  showFuelMix: () => void;
  hideFuelMix: () => void;

  showDashboard: () => void;
  hideDashboard: () => void;
  setTakeActionVisible: (isVisible: boolean) => void;
   setShowMge: (isVisible: boolean) => void; 
  setShowAlliant: (isVisible: boolean) => void; 
}

export const useMapStore = create<MapState & MapActions>((set, get) => ({
  // --- INITIAL STATE ---
  selectedZcta: null,
  hoveredZcta: null,
  programmaticZctaFeature: null,

  isZctaVisible: true,
  isMgeVisible: true,
  isAlliantVisible: true,

  activeUtility: null,
  fuelMixData: null,
  isFuelMixVisible: false,

  isDashboardVisible: false,
  isTakeActionVisible: false, 
      showMge: true, 
  showAlliant: true,

  // --- ACTIONS IMPLEMENTATION ---
  selectZcta: (feature) => set({
    selectedZcta: feature,
    hoveredZcta: null,
  }),
  
  hoverZcta: (feature) => {
    if (!get().selectedZcta) {
      set({
        hoveredZcta: feature,
      });
    }
  },

  setProgrammaticSelection: (feature) => set({
    programmaticZctaFeature: feature,
    selectedZcta: feature,
    hoveredZcta: null,
  }),

  clearProgrammaticFeature: () => set({ programmaticZctaFeature: null }),
  clearSelection: () => set({ selectedZcta: null }),

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
  }),

  showDashboard: () => set({ isDashboardVisible: true }),
  hideDashboard: () => set({ isDashboardVisible: false }),
  setTakeActionVisible: (isVisible) => set({ isTakeActionVisible: isVisible }),
    setShowMge: (isVisible) => set({ showMge: isVisible }), 
  setShowAlliant: (isVisible) => set({ showAlliant: isVisible }), 
}));