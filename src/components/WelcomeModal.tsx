"use client";

import React, { useState } from 'react';
import { useMapStore } from '@/stores/mapStore';
import type { MapData } from '@/lib/data-loader'; // <-- Import MapData type

// --- 1. UPDATE THE PROPS INTERFACE ---
// The modal now needs the full mapData object to perform the ZIP code lookup.
interface WelcomeModalProps {
    onStartTracking: (location: string) => void;
    mapData: MapData;
}

// Define types for the modal's internal state
type ModalStep = 'zip_input' | 'provider_choice';
type ProviderOption = 'MGE' | 'Alliant' | 'Both';

export default function WelcomeModal({ onStartTracking, mapData }: WelcomeModalProps) {
    // --- 2. ADD INTERNAL STATE FOR MULTI-STEP LOGIC ---
    const [step, setStep] = useState<ModalStep>('zip_input');
    const [locationInput, setLocationInput] = useState('');
    const [selectedProvider, setSelectedProvider] = useState<ProviderOption | null>(null);

    // Get the actions we need from the Zustand store
    const showFuelMixForProvider = useMapStore((state) => state.showFuelMixForProvider);

    const handleZipSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedZip = locationInput.trim();
        if (!trimmedZip) return;

        // Find the GeoJSON feature for the entered ZIP code
        const zctaFeature = mapData.zctaData.features.find(
            (feature) => feature.properties.ZCTA5CE10 === trimmedZip
        );

        if (!zctaFeature || !zctaFeature.properties.serviceAreas) {
            alert("This ZIP code is not within the Dane County service area.");
            return;
        }

        const serviceAreas = zctaFeature.properties.serviceAreas;

        // --- 3. CORE LOGIC: Decide the next step based on the data ---
        if (serviceAreas.length === 2) {
            // If there are two providers, move to the choice step
            setStep('provider_choice');
        } else {
            // If there's one or zero providers, show the appropriate fuel mix and close
            const provider = serviceAreas.length === 1 ? (serviceAreas[0] as ProviderOption) : 'Both';
            showFuelMixForProvider(provider, mapData.fuelMixData);
            onStartTracking(trimmedZip);
        }
    };

    const handleProviderSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProvider) return;

        // Show the fuel mix for the selected provider and close
        showFuelMixForProvider(selectedProvider, mapData.fuelMixData);
        onStartTracking(locationInput.trim());
    };

    return (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-2xl text-center">
                
                {/* --- 4. CONDITIONAL UI RENDERING --- */}
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
                                className="w-full rounded-md border border-gray-300 px-4 py-2 mb-4 text-black transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={!locationInput.trim()}
                                className="w-full rounded-md bg-blue-600 py-2 px-4 font-bold text-white transition-colors duration-300 hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                Track My Energy
                            </button>
                        </form>
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
                                    <label key={provider} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
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
                                className="w-full rounded-md bg-blue-600 py-2 px-4 font-bold text-white transition-colors duration-300 hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                Continue
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}