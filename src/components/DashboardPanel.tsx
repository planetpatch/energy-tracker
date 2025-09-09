"use client";

import React, { useState, useRef } from 'react';
import { useMapStore } from '@/stores/mapStore';

// Import the new components and hook
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DesktopDashboardPanel } from './DesktopView/DesktopDashboardPanel';
import { MobileDashboardPanel } from './MobileView/MobileDashboardPanel';

// --- Shared Types & Props ---
export interface DashboardPanelProps {
  isDashboardVisible: boolean;
  hideDashboard: () => void;
  selectedZcta: ReturnType<typeof useMapStore.getState>['selectedZcta'];
  hoveredZcta: ReturnType<typeof useMapStore.getState>['hoveredZcta'];
  isZctaVisible: boolean;
  isMgeVisible: boolean;
  isAlliantVisible: boolean;
  toggleLayerVisibility: (layer: 'zcta' | 'mge' | 'alliant') => void;
  zipCodeInput: string;
  setZipCodeInput: React.Dispatch<React.SetStateAction<string>>;
  isLegendOpen: boolean;
  setIsLegendOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isActionsOpen: boolean;
  setIsActionsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tooltip: { visible: boolean; content: string; targetRef: React.RefObject<HTMLDivElement | null> | null; };
  // CORRECTED: The ref's current property can be null
  focusInfoRef: React.RefObject<HTMLDivElement | null>;
  commentInfoRef: React.RefObject<HTMLDivElement | null>;
  followInfoRef: React.RefObject<HTMLDivElement | null>;
  showTooltip: (content: string, targetRef: React.RefObject<HTMLDivElement | null>) => void;
  hideTooltip: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  displayZcta: ReturnType<typeof useMapStore.getState>['selectedZcta'] | ReturnType<typeof useMapStore.getState>['hoveredZcta'];
  isHovering: boolean;
  tooltipPosition: DOMRect | undefined;
  onZipCodeSubmit: (zipCode: string) => void;
}

const DashboardPanel: React.FC<{onZipCodeSubmit: (zipCode: string) => void}> = ({ onZipCodeSubmit }) => {
  // --- STATE AND LOGIC ---
  const { 
    isDashboardVisible, 
    hideDashboard, 
    selectedZcta, 
    hoveredZcta, 
    isZctaVisible, 
    isMgeVisible, 
    isAlliantVisible, 
    toggleLayerVisibility 
  } = useMapStore();

  const [zipCodeInput, setZipCodeInput] = useState<string>("");
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(false);
  const [isActionsOpen, setIsActionsOpen] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    content: string;
    targetRef: React.RefObject<HTMLDivElement | null> | null;
  }>({ visible: false, content: '', targetRef: null });

  const focusInfoRef = useRef<HTMLDivElement>(null);
  const commentInfoRef = useRef<HTMLDivElement>(null);
  const followInfoRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const showTooltip = (content: string, targetRef: React.RefObject<HTMLDivElement | null>) =>
    setTooltip({ visible: true, content, targetRef });
  const hideTooltip = () => setTooltip({ visible: false, content: '', targetRef: null });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCodeInput.trim()) {
      onZipCodeSubmit(zipCodeInput.trim());
      setZipCodeInput("");
    }
  };

  const displayZcta = selectedZcta || hoveredZcta;
  const isHovering = !selectedZcta && !!hoveredZcta;
  const tooltipPosition = tooltip.targetRef?.current?.getBoundingClientRect();
  
  const panelProps = {
    isDashboardVisible,
    hideDashboard,
    selectedZcta,
    hoveredZcta,
    isZctaVisible,
    isMgeVisible,
    isAlliantVisible,
    toggleLayerVisibility,
    zipCodeInput,
    setZipCodeInput,
    isLegendOpen,
    setIsLegendOpen,
    isActionsOpen,
    setIsActionsOpen,
    tooltip,
    focusInfoRef,
    commentInfoRef,
    followInfoRef,
    showTooltip,
    hideTooltip,
    handleSubmit,
    displayZcta,
    isHovering,
    tooltipPosition,
    onZipCodeSubmit
  };

  // --- RENDER ---
  return isDesktop ? (
    <DesktopDashboardPanel {...panelProps} />
  ) : (
    <MobileDashboardPanel {...panelProps} />
  );
};

export default DashboardPanel;

