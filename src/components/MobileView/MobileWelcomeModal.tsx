"use client";

import React from 'react';
import { gemunuLibre } from '@/ui/fonts';
import type { WelcomeModalProps, ModalStep, ProviderOption } from '../WelcomeModal'

interface MobileWelcomeModalProps extends WelcomeModalProps {
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

export const MobileWelcomeModal: React.FC<MobileWelcomeModalProps> = ({
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
    <div className="w-full mx-4 max-w-md rounded-lg bg-white p-6 shadow-2xl text-center">
      {step === 'zip_input' && (
        <>
          <h1 className="text-2xl font-bold mb-3 text-gray-800">Welcome!</h1>
          <p className="mb-5 text-gray-600 text-sm">
            Enter a Madison-area ZIP Code to start.
          </p>
          <form onSubmit={handleZipSubmit}>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="e.g., 53703"
              maxLength={5}
              className={`w-full text-black mb-4 px-4 py-3 border border-gray-300 rounded-md shadow-sm text-lg ${gemunuLibre.className}`}
            />
            <button
              type="submit"
              disabled={!locationInput.trim()}
              className="w-full font-gemunu pixel-button-base pixel-button-primary text-lg"
            >
              Track My Energy
            </button>
          </form>
          <p className="mt-4 text-xs text-gray-500 text-center">
            Or{' '}
            <button type="button" onClick={goDirectlyToMap} className="underline text-blue-600">
              Browse the Map
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
          <form onSubmit={handleProviderSubmit}>
            <div className="space-y-3 text-left my-5">
              {(['MGE', 'Alliant', 'Both'] as const).map((provider) => (
                <label key={provider} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="provider"
                    value={provider}
                    checked={selectedProvider === provider}
                    onChange={() => setSelectedProvider(provider)}
                    className="h-5 w-5 text-blue-600 border-gray-300"
                  />
                  <span className="ml-4 text-base font-medium text-gray-900">
                    {provider === 'Both' ? 'Not Sure' : provider}
                  </span>
                </label>
              ))}
            </div>
            <button
              type="submit"
              disabled={!selectedProvider}
              className="w-full font-gemunu pixel-button-base pixel-button-primary text-lg"
            >
              Continue
            </button>
          </form>
        </>
      )}
    </div>
  );
};
