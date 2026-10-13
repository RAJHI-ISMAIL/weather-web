"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Sun, Loader2, X, Compass, ChevronRight } from "lucide-react";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import { LocationData } from "@/types/location";
import { WeatherData } from "@/types/weather";

interface HomeSearchBarProps {
  currentLocation: LocationData;
  weatherData: WeatherData | null;
  onSelectLocation: (loc: LocationData) => void;
  onGetForecast: (loc?: LocationData) => void;
  className?: string;
}

export function HomeSearchBar({
  currentLocation,
  weatherData,
  onSelectLocation,
  onGetForecast,
  className = "",
}: HomeSearchBarProps) {
  const { query, setQuery, results, loading, isOpen, setIsOpen, clearSearch } = useLocationSearch();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  const handleSelect = (loc: LocationData) => {
    onSelectLocation(loc);
    clearSearch();
  };

  const handleForecastClick = () => {
    if (isOpen && results.length > 0) {
      const topLoc = results[0];
      handleSelect(topLoc);
      onGetForecast(topLoc);
    } else {
      onGetForecast(currentLocation);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleForecastClick();
    }
  };

  const temp = weatherData ? `${weatherData.current.temperature}°` : "24°";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      ref={containerRef}
      className={`relative w-full max-w-4xl mx-auto px-4 ${className}`}
    >
      {/* Floating White Pill Container */}
      <div className="relative flex flex-col md:flex-row items-stretch md:items-center justify-between p-2.5 rounded-3xl md:rounded-full bg-white text-slate-800 shadow-[0_16px_50px_rgba(10,22,40,0.18)] border border-slate-100 hover:border-cyan-300/60 hover:shadow-[0_20px_60px_rgba(34,211,238,0.22)] transition-all duration-300 gap-2.5 md:gap-0">
        
        {/* Left Section: Search Input */}
        <div className="flex items-center flex-1 pl-3 md:pl-4 pr-2">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search city or location"
            aria-label="Search city or location"
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm md:text-base outline-none pr-2 font-normal"
          />

          {loading ? (
            <Loader2 className="w-4 h-4 text-cyan-600 animate-spin shrink-0" />
          ) : query ? (
            <button
              type="button"
              onClick={clearSearch}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {/* Divider 1 */}
        <div className="hidden md:block w-px h-8 bg-slate-200 mx-2" />

        {/* Mobile Sub-row for Location and Weather / Desktop Contents */}
        <div className="flex items-center justify-between md:contents px-2 md:px-0">
          {/* Middle Section: Active City / Country */}
          <button
            type="button"
            onClick={() => inputRef.current?.focus()}
            className="flex items-center gap-1.5 px-2 md:px-4 py-1 md:py-0 text-left hover:bg-slate-50 md:rounded-full transition-colors cursor-pointer group min-w-0"
            title="Click to search another location"
          >
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate group-hover:text-cyan-700 max-w-[140px] sm:max-w-[200px] md:max-w-none">
              {currentLocation.name}
              {currentLocation.country ? `, ${currentLocation.country}` : ""}
            </span>
          </button>

          {/* Divider 2 */}
          <div className="hidden md:block w-px h-8 bg-slate-200 mx-2" />

          {/* Weather Quick Stat: Sun + Temp */}
          <div className="flex items-center gap-1.5 px-2 md:px-4 py-1 md:py-0 shrink-0">
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0 fill-amber-500/20 animate-spin-slow" />
            <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-sans">
              {temp}
            </span>
          </div>
        </div>

        {/* Right CTA Button: Blue Pill "Get forecast >" */}
        <button
          type="button"
          onClick={handleForecastClick}
          className="flex items-center justify-center gap-2 px-6 py-2.5 md:py-3 rounded-full bg-[#52B1E4] hover:bg-[#43A0D3] active:scale-95 text-white font-semibold text-xs sm:text-sm transition-all duration-200 shadow-[0_4px_16px_rgba(82,177,228,0.4)] shrink-0 cursor-pointer group"
        >
          <span>Get forecast</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && results.length > 0 && (
        <ul
          role="listbox"
          className="absolute left-4 right-4 mt-2 py-2 rounded-2xl bg-white text-slate-800 border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.25)] z-50 max-h-72 overflow-y-auto divide-y divide-slate-100"
        >
          {results.map((loc, idx) => (
            <li
              key={`${loc.id}-${idx}`}
              role="option"
              aria-selected={false}
              onClick={() => handleSelect(loc)}
              className="px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-cyan-50 text-cyan-600">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-800">
                    {loc.name}
                    {loc.admin1 && (
                      <span className="text-slate-500 font-normal ml-1">
                        , {loc.admin1}
                      </span>
                    )}
                  </div>
                  {loc.country && (
                    <div className="text-xs text-slate-400">{loc.country}</div>
                  )}
                </div>
              </div>
              <div className="text-xs font-mono text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full">
                {loc.latitude.toFixed(1)}°, {loc.longitude.toFixed(1)}°
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
