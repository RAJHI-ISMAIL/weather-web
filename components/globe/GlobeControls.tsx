"use client";

import { Plus, Minus, Compass, Play, Pause, Cloud, MapPin } from "lucide-react";

interface GlobeControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  isAutoRotating: boolean;
  onToggleAutoRotate: () => void;
  showClouds?: boolean;
  onToggleClouds?: () => void;
  showPins?: boolean;
  onTogglePins?: () => void;
  className?: string;
}

export function GlobeControls({
  onZoomIn,
  onZoomOut,
  onReset,
  isAutoRotating,
  onToggleAutoRotate,
  showClouds = true,
  onToggleClouds,
  showPins = true,
  onTogglePins,
  className = "",
}: GlobeControlsProps) {
  return (
    <aside
      aria-label="3D Globe interactive controls"
      className={`flex flex-col items-center gap-2 z-20 ${className}`}
    >
      {/* Zoom In */}
      <button
        type="button"
        onClick={onZoomIn}
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0A1628]/85 hover:bg-[#0F1E33] text-white border border-white/15 hover:border-cyan-400/60 shadow-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95 cursor-pointer backdrop-blur-md"
        aria-label="Zoom in on Earth"
        title="Zoom In"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* Zoom Out */}
      <button
        type="button"
        onClick={onZoomOut}
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0A1628]/85 hover:bg-[#0F1E33] text-white border border-white/15 hover:border-cyan-400/60 shadow-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95 cursor-pointer backdrop-blur-md"
        aria-label="Zoom out on Earth"
        title="Zoom Out"
      >
        <Minus className="w-4 h-4" />
      </button>

      {/* Reset Orientation */}
      <button
        type="button"
        onClick={onReset}
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0A1628]/85 hover:bg-[#0F1E33] text-cyan-400 border border-white/15 hover:border-cyan-400/60 shadow-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95 cursor-pointer backdrop-blur-md"
        aria-label="Reset Earth orientation"
        title="Reset Orientation"
      >
        <Compass className="w-4 h-4" />
      </button>

      {/* Auto Rotate Toggle */}
      <button
        type="button"
        onClick={onToggleAutoRotate}
        className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95 cursor-pointer backdrop-blur-md ${
          isAutoRotating
            ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
            : "bg-[#0A1628]/85 hover:bg-[#0F1E33] text-slate-400 border-white/15"
        }`}
        aria-label={isAutoRotating ? "Pause idle rotation" : "Resume idle rotation"}
        title={isAutoRotating ? "Pause Rotation" : "Resume Rotation"}
      >
        {isAutoRotating ? (
          <Pause className="w-3.5 h-3.5" />
        ) : (
          <Play className="w-3.5 h-3.5 translate-x-0.5" />
        )}
      </button>

      {/* Toggle Clouds Layer (Map vs Atmosphere) */}
      {onToggleClouds && (
        <button
          type="button"
          onClick={onToggleClouds}
          className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95 cursor-pointer backdrop-blur-md ${
            showClouds
              ? "bg-white/15 text-white border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              : "bg-[#0A1628]/85 hover:bg-[#0F1E33] text-slate-400 border-white/15"
          }`}
          aria-label={showClouds ? "Hide clouds layer" : "Show clouds layer"}
          title={showClouds ? "Map View (Hide Clouds)" : "Atmosphere View (Show Clouds)"}
        >
          <Cloud className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Toggle Global City Pins */}
      {onTogglePins && (
        <button
          type="button"
          onClick={onTogglePins}
          className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95 cursor-pointer backdrop-blur-md ${
            showPins
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
              : "bg-[#0A1628]/85 hover:bg-[#0F1E33] text-slate-400 border-white/15"
          }`}
          aria-label={showPins ? "Hide city pins" : "Show city pins"}
          title={showPins ? "Hide City Pins" : "Show City Pins"}
        >
          <MapPin className="w-3.5 h-3.5" />
        </button>
      )}
    </aside>
  );
}
