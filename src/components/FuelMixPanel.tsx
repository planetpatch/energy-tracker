"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useMapStore } from '@/stores/mapStore';

const clampPercent = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

interface ProgressBarProps {
  utilityName: string;
  renewablePercent: number | null;
  colorClass: string;
}
const ProgressBar: React.FC<ProgressBarProps> = ({ utilityName, renewablePercent, colorClass }) => {
  if (renewablePercent == null) {
    return (
      <div className="mb-2">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{utilityName}</span>
          <span className="text-xs font-medium text-gray-500">Data unavailable</span>
        </div>
        <div className="w-full bg-gray-200/70 rounded-full h-4" />
      </div>
    );
  }
  const pct = clampPercent(renewablePercent);
  return (
    <div className="mb-2" title={`${utilityName}: ${pct}% renewable`}>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{utilityName}</span>
        <span className="text-xs font-medium text-gray-700">{pct}% Renewable</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4" aria-hidden>
        <div
          className={`${colorClass} h-4 rounded-full text-xs font-medium text-white text-center leading-none`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-label={`${utilityName} renewable percentage`}
        />
      </div>
    </div>
  );
};

const FuelMixPanel: React.FC = () => {
  // ✅ All hooks come first
  const activePanel        = useMapStore((s) => s.activePanel);
  const activeUtility      = useMapStore((s) => s.activeUtility);
  const fuelMixData        = useMapStore((s) => s.fuelMixData);
  const isZctaVisible      = useMapStore((s) => s.isZctaVisible);
  const isMgeVisible       = useMapStore((s) => s.isMgeVisible);
  const isAlliantVisible   = useMapStore((s) => s.isAlliantVisible);
  const toggleVisibility   = useMapStore((s) => s.toggleLayerVisibility);

  const [tooltip, setTooltip] = useState<{ visible: boolean; content: string; targetRef: React.RefObject<HTMLButtonElement | null> | null }>({ visible: false, content: '', targetRef: null });
  const [tooltipCoords, setTooltipCoords] = useState<{ left: number; bottom: number } | null>(null);

  const focusInfoRef = useRef<HTMLButtonElement>(null);
  const commentInfoRef = useRef<HTMLButtonElement>(null);

  // ✅ Only now, optionally bail
  if (activePanel !== 'fuelMix') return null;

  const showTooltip = (content: string, targetRef: React.RefObject<HTMLButtonElement | null>) =>
    setTooltip({ visible: true, content, targetRef });
  const hideTooltip = () => setTooltip({ visible: false, content: '', targetRef: null });

  const recalcTooltipCoords = () => {
    if (!tooltip.targetRef?.current) return setTooltipCoords(null);
    const rect = tooltip.targetRef.current.getBoundingClientRect();
    if (typeof window === 'undefined') return setTooltipCoords(null);
    const left = rect.left + rect.width / 2;
    const bottom = window.innerHeight - rect.top;
    setTooltipCoords({ left, bottom });
  };

  useEffect(() => {
    if (!tooltip.visible) {
      setTooltipCoords(null);
      return;
    }
    recalcTooltipCoords();
    const handler = () => recalcTooltipCoords();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, [tooltip.visible, tooltip.targetRef]);

  // Decide which providers we want to show (based on WelcomeModal choice)
  const wantMge = activeUtility === 'MGE' || activeUtility === 'Both' || activeUtility == null;
  const wantAlliant = activeUtility === 'Alliant' || activeUtility === 'Both' || activeUtility == null;

  const mgePct = fuelMixData?.MGE?.renewable_percent ?? null;
  const alliantPct = fuelMixData?.Alliant?.renewable_percent ?? null;

  // ✅ Render a bar only when wanted + visible. If wanted+visible but missing, show “Data unavailable”.
  const shouldRenderMge = wantMge && isMgeVisible;
  const shouldRenderAlliant = wantAlliant && isAlliantVisible;

  const idMge = "legend-mge";
  const idAlliant = "legend-alliant";
  const idZcta = "legend-zcta";

  return (
    <div
      id="fuelmix-panel"
      role="region"
      aria-labelledby="fuelmix-title"
      className="fixed bottom-5 left-5 right-5 z-[1000] md:h-[15vh] h-auto transition-opacity duration-500 ease-in-out animate-fade-in"
    >
      <h3 id="fuelmix-title" className="sr-only">Fuel mix panel</h3>
      <div className="relative w-full h-full bg-white/80 backdrop-blur-md rounded-lg shadow-2xl p-4 pt-4">
        <div className="flex h-full w-full items-start gap-4 md:gap-6">
          {/* Legend */}
          <div className="w-1/3 md:w-1/4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Legend</h4>
            <div className="space-y-1">
              <div className="flex items-center text-xs">
                <input
                  id={idMge}
                  type="checkbox"
                  checked={isMgeVisible}
                  onChange={() => toggleVisibility('mge')}
                  className="h-3 w-3 rounded-sm border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor={idMge} className="ml-2 text-gray-800 cursor-pointer">
                  MGE Fuel Mix
                </label>
              </div>
              <div className="flex items-center text-xs">
                <input
                  id={idAlliant}
                  type="checkbox"
                  checked={isAlliantVisible}
                  onChange={() => toggleVisibility('alliant')}
                  className="h-3 w-3 rounded-sm border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor={idAlliant} className="ml-2 text-gray-800 cursor-pointer">
                  Alliant Fuel Mix
                </label>
              </div>
              <div className="flex items-center text-xs pt-1">
                <input
                  id={idZcta}
                  type="checkbox"
                  checked={isZctaVisible}
                  onChange={() => toggleVisibility('zcta')}
                  className="h-3 w-3 rounded-sm border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor={idZcta} className="ml-2 text-gray-800 cursor-pointer">
                  ZIP Code Areas
                </label>
              </div>
            </div>
          </div>

          {/* Bars */}
          <div className="flex-1 border-l border-r border-gray-200 px-4 md:px-6">
            {fuelMixData ? (
              <>
                {shouldRenderMge && (
                  <ProgressBar
                    utilityName="MGE"
                    renewablePercent={mgePct}
                    colorClass="bg-green-600"
                  />
                )}
                {shouldRenderAlliant && (
                  <ProgressBar
                    utilityName="Alliant Energy"
                    renewablePercent={alliantPct}
                    colorClass="bg-orange-500"
                  />
                )}
                {/* If neither provider is rendered, optional message: */}
                {!shouldRenderMge && !shouldRenderAlliant && (
                  <p className="text-xs text-gray-600 mt-1">No providers selected.</p>
                )}
              </>
            ) : (
              <p className="text-xs text-gray-600 mt-1">Fuel mix data not available.</p>
            )}
          </div>

          {/* Actions */}
          <div className="w-1/3 md:w-1/5 pl-2 md:pl-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Take Action</h4>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center">
                <a
                  href="https://focusonenergy.com/residential/simple-energy-efficiency"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 font-semibold py-1 px-2 rounded-md shadow-sm transition-colors border border-gray-300 active:scale-95 active:bg-gray-300"
                >
                  Free Energy Box
                </a>
                <button
                  ref={focusInfoRef}
                  onMouseEnter={() => showTooltip("Focus on Energy is Wisconsin's statewide program for energy efficiency and renewable energy. Click to learn more.", focusInfoRef)}
                  onMouseLeave={hideTooltip}
                  onFocus={() => showTooltip("Focus on Energy is Wisconsin's statewide program for energy efficiency and renewable energy. Click to learn more.", focusInfoRef)}
                  onBlur={hideTooltip}
                  className="ml-2 text-gray-400 hover:text-gray-600 outline-none"
                  aria-describedby="fuelmix-tooltip"
                  type="button"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-center">
                <a
                  href="https://psc.wi.gov/Pages/PublicParticipation/PublicComments.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 font-semibold py-1 px-2 rounded-md shadow-sm transition-colors border border-gray-300 active:scale-95 active:bg-gray-300"
                >
                  Leave a Comment
                </a>
                <button
                  ref={commentInfoRef}
                  onMouseEnter={() => showTooltip("Share your thoughts with the Public Service Commission of Wisconsin, which regulates state utilities.", commentInfoRef)}
                  onMouseLeave={hideTooltip}
                  onFocus={() => showTooltip("Share your thoughts with the Public Service Commission of Wisconsin, which regulates state utilities.", commentInfoRef)}
                  onBlur={hideTooltip}
                  className="ml-2 text-gray-400 hover:text-gray-600 outline-none"
                  aria-describedby="fuelmix-tooltip"
                  type="button"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {tooltip.visible && tooltipCoords && (
          <div
            id="fuelmix-tooltip"
            className="pointer-events-none fixed z-[1001] max-w-xs rounded-lg bg-gray-800 px-3 py-2 text-sm font-normal text-white shadow-lg"
            style={{ left: tooltipCoords.left, bottom: tooltipCoords.bottom, transform: 'translateX(-50%) translateY(-0.5rem)' }}
            role="tooltip"
          >
            {tooltip.content}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800" />
          </div>
        )}
      </div>
    </div>
  );
};

export default FuelMixPanel;
