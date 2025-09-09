"use client";

import React, { useState } from 'react';
import { useMapStore } from '@/stores/mapStore';
import type { MapData } from '@/lib/data-loader';

// Import the new components and hook
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DesktopWelcomeModal } from './DesktopView/DesktopWelcomeModal';
import { MobileWelcomeModal } from './MobileView/MobileWelcomeModal';

// Define shared types and props
export type ModalStep = 'zip_input' | 'provider_choice';
export type ProviderOption = 'MGE' | 'Alliant' | 'Both';

export interface WelcomeModalProps {
  onStartTracking: (location: string) => void;
  mapData: MapData;
}

export default function WelcomeModal({ onStartTracking, mapData }: WelcomeModalProps) {
  // --- STATE AND LOGIC ---
  const [step, setStep] = useState<ModalStep>('zip_input');
  const [locationInput, setLocationInput] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<ProviderOption | null>(null);
  const showFuelMixForProvider = useMapStore((state) => state.showFuelMixForProvider);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const goDirectlyToMap = () => {
    showFuelMixForProvider('Both', mapData.fuelMixData);
    onStartTracking('');
  };

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedZip = locationInput.trim();
    if (!trimmedZip) return;

    const zctaFeature = mapData.zctaData.features.find(
      (feature) => feature.properties.ZCTA5CE10 === trimmedZip
    );

    if (!zctaFeature || !zctaFeature.properties.serviceAreas) {
      alert("This ZIP code is not within the Dane County service area.");
      return;
    }

    const serviceAreas = zctaFeature.properties.serviceAreas;
    if (serviceAreas.length === 2) {
      setStep('provider_choice');
    } else {
      const provider = serviceAreas.length === 1 ? (serviceAreas[0] as ProviderOption) : 'Both';
      showFuelMixForProvider(provider, mapData.fuelMixData);
      onStartTracking(trimmedZip);
    }
  };

  const handleProviderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider) return;
    showFuelMixForProvider(selectedProvider, mapData.fuelMixData);
    onStartTracking(locationInput.trim());
  };

  // --- RENDER ---
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {isDesktop ? (
        <DesktopWelcomeModal
          onStartTracking={onStartTracking}
          mapData={mapData}
          step={step}
          setStep={setStep}
          locationInput={locationInput}
          setLocationInput={setLocationInput}
          selectedProvider={selectedProvider}
          setSelectedProvider={setSelectedProvider}
          goDirectlyToMap={goDirectlyToMap}
          handleZipSubmit={handleZipSubmit}
          handleProviderSubmit={handleProviderSubmit}
        />
      ) : (
        <MobileWelcomeModal
          onStartTracking={onStartTracking}
          mapData={mapData}
          step={step}
          setStep={setStep}
          locationInput={locationInput}
          setLocationInput={setLocationInput}
          selectedProvider={selectedProvider}
          setSelectedProvider={setSelectedProvider}
          goDirectlyToMap={goDirectlyToMap}
          handleZipSubmit={handleZipSubmit}
          handleProviderSubmit={handleProviderSubmit}
        />
      )}
    </div>
  );
}
