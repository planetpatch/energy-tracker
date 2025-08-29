// src/components/WelcomeModal.tsx
"use client";

import { useState } from 'react';

interface WelcomeModalProps {
    onStartTracking: (location: string) => void;
}

export default function WelcomeModal({ onStartTracking }: WelcomeModalProps) {
    const [locationInput, setLocationInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (locationInput.trim()) {
            onStartTracking(locationInput.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full text-center">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to the Energy Tracker</h1>
                <p className="mb-6 text-gray-600">
                    Please input your Madison address or a Madison zip code to begin.
                    <br />
                    <span className="text-sm text-gray-500">(We do not collect or store this information)</span>
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        placeholder="e.g., 123 State St or 53703"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        style={{ color: 'black' }}
                    />
                    <button
                        type="submit"
                        disabled={!locationInput.trim()}
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-300"
                    >
                        Track My Energy
                    </button>
                </form>
            </div>
        </div>
    );
}
