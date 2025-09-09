"use client";

import React from 'react';
import { gemunuLibre } from '@/ui/fonts';
import type { WelcomeModalProps, ModalStep, ProviderOption } from '../WelcomeModal'; // We'll create this type file next

interface DesktopWelcomeModalProps extends WelcomeModalProps {
  step: ModalStep;
  setStep: React.Dispatch<React.SetStateAction<ModalStep>>;
  locationInput: string;
  setLocationInput: React.Dispatch<React.SetStateAction<string>>;
  selectedProvider: ProviderOption | null;
  setSelectedProvider: React.Dispatch<React.SetStateAction<ProviderOption | null>>;
  goDirectlyToMap: () => void;
  handleZipSubmit: (e: React.FormEvent) => void;
  handleProviderSubmit: (e: React.FormEvent) => void;
}

export const DesktopWelcomeModal: React.FC<DesktopWelcomeModalProps> = ({
  step,
  locationInput,
  setLocationInput,
  selectedProvider,
  setSelectedProvider,
  goDirectlyToMap,
  handleZipSubmit,
  handleProviderSubmit,
}) => {
  return (
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
          <p className="mt-3 text-xs text-gray-500 text-center">
            Prefer to browse?{' '}
            <button type="button" onClick={goDirectlyToMap} className="underline text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
              Go Directly to Map
            </button>
            <br/><br/>Created by&nbsp;
            <a className='underline text-blue-500 font-bold' href='https://www.planetpatch.dev' target="_blank" rel="noopener noreferrer">
              PlanetPatch Inc.
            </a>
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
              className="font-gemunu pixel-button-base pixel-button-primary"
            >
              Continue
            </button>
          </form>
          <p className="mt-3 text-xs text-gray-500 text-center">
            Prefer to browse?{' '}
            <button type="button" onClick={goDirectlyToMap} className="underline text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
              Go Directly to Map
            </button>
          </p>
        </>
      )}
    </div>
  );
};
