
import React from 'react';

export const RotateDeviceOverlay = () => {
  return (
    <div className="orientation-lock">
      <div className="text-center text-white p-4">
        {/* Simple SVG icon for rotation */}
        <svg
          className="mx-auto h-16 w-16 mb-4 animate-pulse"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2zM5 10h.01M5 14h.01M19 10h.01M19 14h.01"
          />
        </svg>
        <h1 className="text-2xl font-bold">Please Rotate Your Device</h1>
              <p className="mt-2 text-lg">This app is best viewed in portrait mode.</p>
              <p className="mt-2 text-xs">It looks broken on landscape mode :/</p>
      </div>
    </div>
  );
};