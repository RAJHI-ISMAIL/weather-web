"use client";

import { useState } from "react";
import { Plus, Minus, Compass, MapPin } from "lucide-react";
import { LocationData } from "@/types/location";

interface GlobePlaceholderProps {
  selectedLocation?: LocationData | null;
  onExploreClick?: () => void;
  className?: string;
}

export function GlobePlaceholder({
  selectedLocation,
  onExploreClick,
  className = "",
}: GlobePlaceholderProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotationOffset, setRotationOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.15, 1.6));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.15, 0.75));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setRotationOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX - rotationOffset);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setRotationOffset(e.clientX - startX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Outer Atmospheric Halo Glow */}
      <div className="absolute w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] md:w-[580px] md:h-[580px] rounded-full bg-radial from-[#22D3EE]/25 via-[#22D3EE]/5 to-transparent blur-2xl pointer-events-none animate-pulse-glow" />

      {/* Atmospheric Rim Rings */}
      <div className="absolute w-[310px] h-[310px] sm:w-[420px] sm:h-[420px] md:w-[530px] md:h-[530px] rounded-full border border-cyan-400/20 shadow-[0_0_80px_rgba(34,211,238,0.35)] pointer-events-none" />
      <div className="absolute w-[330px] h-[330px] sm:w-[450px] sm:h-[450px] md:w-[570px] md:h-[570px] rounded-full border border-cyan-500/10 pointer-events-none" />

      {/* Earth Sphere Container */}
      <div
        className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[480px] md:h-[480px] rounded-full overflow-hidden shadow-[inset_-30px_-30px_70px_rgba(0,0,0,0.9),0_0_90px_rgba(34,211,238,0.45)] cursor-grab active:cursor-grabbing transition-transform duration-200 border border-cyan-300/30"
        style={{
          transform: `scale(${zoomLevel}) rotate(${rotationOffset * 0.05}deg)`,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onDoubleClick={onExploreClick}
      >
        {/* Cinematic Spinning Earth Video Asset */}
        <video
          src="/earth-spin.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-[1.08] pointer-events-none"
        />

        {/* Realistic Sphere Shading Overlays (Day/Night rim terminator) */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/85 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 rounded-full shadow-[inset_10px_10px_35px_rgba(34,211,238,0.3),inset_-25px_-25px_60px_rgba(5,11,20,0.95)] pointer-events-none" />

        {/* Selected Location Target Pin Marker if selected */}
        {selectedLocation && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none animate-bounce">
            <div className="relative flex items-center justify-center">
              <span className="w-8 h-8 rounded-full bg-[#22D3EE]/30 animate-ping absolute" />
              <div className="p-2 rounded-full bg-[#050B14] border border-[#22D3EE] shadow-[0_0_15px_#22D3EE]">
                <MapPin className="w-4 h-4 text-[#22D3EE]" />
              </div>
            </div>
            <div className="mt-1 px-2.5 py-1 rounded-full bg-[#050B14]/90 border border-cyan-400/40 backdrop-blur-md text-[11px] font-semibold text-white tracking-wider whitespace-nowrap shadow-lg">
              {selectedLocation.name}
            </div>
          </div>
        )}
      </div>

      {/* Floating Zoom & Orientation Controls (Right Side) */}
      <aside
        aria-label="Globe view controls"
        className="absolute right-0 sm:-right-8 md:-right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-20"
      >
        <button
          type="button"
          onClick={handleZoomIn}
          className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0A1628]/80 hover:bg-[#0F1E33] text-white border border-white/10 hover:border-cyan-400/60 shadow-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label="Zoom in on Earth"
          title="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleZoomOut}
          className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0A1628]/80 hover:bg-[#0F1E33] text-white border border-white/10 hover:border-cyan-400/60 shadow-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label="Zoom out on Earth"
          title="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0A1628]/80 hover:bg-[#0F1E33] text-cyan-400 border border-white/10 hover:border-cyan-400/60 shadow-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label="Reset Earth position and zoom"
          title="Reset orientation"
        >
          <Compass className="w-4 h-4" />
        </button>
      </aside>
    </div>
  );
}
