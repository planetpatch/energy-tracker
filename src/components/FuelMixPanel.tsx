"use client";

import React, { useEffect, useState } from 'react';
import { useMapStore } from '@/stores/mapStore';

// Import the new components and hook
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DesktopFuelMixPanel } from './DesktopView/DesktopFuelMixPanel';
import { MobileFuelMixPanel } from './MobileView/MobileFuelMixPanel';

// --- Shared Types & Props ---
export interface ProgressBarProps {
  utilityName: string;
  renewablePercent: number;
  colorClass: string;
}

export interface FuelMixPanelProps {
  isMounted: boolean;
  hideFuelMix: () => void;
  fuelMixData: { [key: string]: { renewable_percent: number; non_renewable_percent: number; } } | null;
  // showMge: boolean;
  // setShowMge: React.Dispatch<React.SetStateAction<boolean>>;
  // showAlliant: boolean;
  // setShowAlliant: React.Dispatch<React.SetStateAction<boolean>>;
}

const FuelMixPanel: React.FC = () => {
  // --- STATE AND LOGIC ---
  const { isFuelMixVisible,
    hideFuelMix,
    fuelMixData,
    activeUtility, 
    setShowMge, 
    setShowAlliant } = useMapStore();
  
  const [isMounted, setIsMounted] = useState(false);
  // const [showMge, setShowMge] = useState(true);
  // const [showAlliant, setShowAlliant] = useState(true);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    if (isFuelMixVisible) {
      const t = setTimeout(() => setIsMounted(true), 10);
      return () => clearTimeout(t);
    } else {
      setIsMounted(false);
    }
  }, [isFuelMixVisible]);
  
  useEffect(() => {
    setShowMge(activeUtility === 'MGE' || activeUtility === 'Both');
    setShowAlliant(activeUtility === 'Alliant' || activeUtility === 'Both');
  }, [activeUtility, setShowMge, setShowAlliant]);

  if (!isFuelMixVisible) return null;
  
  const panelProps = {
    isMounted,
    hideFuelMix,
    fuelMixData,
    // showMge,
    // setShowMge,
    // showAlliant,
    // setShowAlliant
  };

  // --- RENDER ---
  return isDesktop ? (
    <DesktopFuelMixPanel {...panelProps} />
  ) : (
    <MobileFuelMixPanel {...panelProps} />
  );
};

export default FuelMixPanel;
