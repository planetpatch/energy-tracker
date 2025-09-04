"use client";

import React, { useState } from 'react';
import { useMapStore } from '@/stores/mapStore';
import type { MapData } from '@/lib/data-loader';
import { gemunuLibre } from '@/ui/fonts';

interface WelcomeModalProps {
  onStartTracking: (location: string) => void;
  mapData: MapData;
}

type ModalStep = 'zip_input' | 'provider_choice';
type ProviderOption = 'MGE' | 'Alliant' | 'Both';

export default function WelcomeModal({ onStartTracking, mapData }: WelcomeModalProps) {
  const [step, setStep] = useState<ModalStep>('zip_input');
  const [locationInput, setLocationInput] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<ProviderOption | null>(null);

  const showFuelMixForProvider = useMapStore((state) => state.showFuelMixForProvider);

  const goDirectlyToMap = () => {
    // Always show the panel and display BOTH providers when browsing
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
      // Ask user to choose; panel will open after selection
      setStep('provider_choice');
    } else {
      // Single or unknown → open panel for that provider (or Both) and proceed
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

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-2xl text-center">
        {step === 'zip_input' && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to the Energy Tracker</h1>
            <p className="mb-6 text-gray-600">
              Please input a Madison-area ZIP Code to begin
              <br />
              <span className="text-sm text-gray-500">(e.g., 53703, 53597, 53711)</span>
            </p>
            <form onSubmit={handleZipSubmit}>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="e.g., 53703"
                maxLength={5}
                className={`w-full text-black mb-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${gemunuLibre.className}`}
              />
              <button
                type="submit"
                disabled={!locationInput.trim()}
                 className="font-gemunu pixel-button-base pixel-button-primary"
              >
                Track My Energy
              </button>
            </form>

            {/* Skip to map: open panel with BOTH */}
            <p className="mt-3 text-xs text-gray-500 text-center">
              Prefer to browse?{' '}
              <button
                type="button"
                onClick={goDirectlyToMap}
                className="underline text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                Go Directly to Map
              </button>
            </p>
          </>
        )}

        {step === 'provider_choice' && (
          <>
            <h1 className="text-2xl font-bold mb-2 text-gray-800">Select Your Provider</h1>
            <p className="mb-6 text-gray-600">
              Your ZIP code falls within two electric service areas. Please select your provider.
            </p>
            <form onSubmit={handleProviderSubmit}>
              <div className="space-y-3 text-left mb-6">
                {(['MGE', 'Alliant', 'Both'] as const).map((provider) => (
                  <label
                    key={provider}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="provider"
                      value={provider}
                      checked={selectedProvider === provider}
                      onChange={() => setSelectedProvider(provider)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {provider === 'Both' ? 'Not Sure' : provider}
                    </span>
                  </label>
                              ))}
              </div>
              <button
                type="submit"
                disabled={!selectedProvider}
                className="font-gemunu pixel-button-base pixel-button-primary"
              >
                Continue
              </button>
            </form>
            {/* Keep skip here, too */}
            <p className="mt-3 text-xs text-gray-500 text-center">
              Prefer to browse?{' '}
              <button
                type="button"
                onClick={goDirectlyToMap}
                className="underline text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                Go Directly to Map
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
