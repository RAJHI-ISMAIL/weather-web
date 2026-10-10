"use client";

import { Navigation, Loader2, ChevronRight, AlertCircle } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { LocationData } from "@/types/location";
import { useEffect } from "react";

interface UseMyLocationButtonProps {
  onLocationFound: (loc: LocationData) => void;
  className?: string;
}

export function UseMyLocationButton({ onLocationFound, className = "" }: UseMyLocationButtonProps) {
  const { loading, error, location, requestLocation, clearError } = useGeolocation();

  useEffect(() => {
    if (location) {
      onLocationFound(location);
    }
  }, [location, onLocationFound]);

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={requestLocation}
        disabled={loading}
        className="relative group flex items-center justify-center gap-2.5 px-7 py-3 rounded-full bg-[#0A1628]/90 text-white font-medium text-xs md:text-sm uppercase tracking-[0.14em] border border-[#22D3EE]/50 shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:border-[#22D3EE] hover:shadow-[0_0_35px_rgba(34,211,238,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]"
        aria-label="Use current location"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

        {loading ? (
          <Loader2 className="w-4 h-4 text-[#22D3EE] animate-spin" />
        ) : (
          <Navigation className="w-4 h-4 text-[#22D3EE] group-hover:rotate-45 transition-transform duration-300" />
        )}

        <span className="relative z-10 text-white font-semibold">
          {loading ? "Locating..." : "Use Your Location"}
        </span>

        <ChevronRight className="w-4 h-4 text-[#22D3EE]/80 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/30 text-red-200 text-xs animate-fade-in"
        >
          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>{error}</span>
          <button
            type="button"
            onClick={clearError}
            className="ml-1 text-red-400 hover:text-white"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
