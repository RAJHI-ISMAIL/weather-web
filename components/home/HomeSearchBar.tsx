"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Sun, Loader2, X, Compass, ChevronRight, Sparkles } from "lucide-react";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import { LocationData } from "@/types/location";
import { WeatherData } from "@/types/weather";

interface HomeSearchBarProps {
  currentLocation: LocationData;
  weatherData: WeatherData | null;
  onSelectLocation: (loc: LocationData) => void;
  onGetForecast: () => void;
  className?: string;
}

const POPULAR_CITIES: LocationData[] = [
  { name: "Tokyo", country: "Japan", latitude: 35.68, longitude: 139.76 },
  { name: "Paris", country: "France", latitude: 48.85, longitude: 2.35 },
  { name: "New York", country: "United States", latitude: 40.71, longitude: -74.0 },
  { name: "Reykjavik", country: "Iceland", latitude: 64.14, longitude: -21.94 },
  { name: "Dubai", country: "United Arab Emirates", latitude: 25.2, longitude: 55.27 },
  { name: "Zhengzhou", country: "China", latitude: 34.75, longitude: 113.66 },
];

export function HomeSearchBar({
  currentLocation,
  weatherData,
  onSelectLocation,
  onGetForecast,
  className = "",
}: HomeSearchBarProps) {
  const { query, setQuery, results, loading, isOpen, setIsOpen, clearSearch } = useLocationSearch();
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsEditingLocation(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  const handleSelect = (loc: LocationData) => {
    onSelectLocation(loc);
    clearSearch();
    setIsEditingLocation(false);
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
      <div className="relative flex flex-col md:flex-row items-stretch md:items-center justify-between p-2 md:p-2.5 rounded-3xl md:rounded-full bg-white text-slate-800 shadow-[0_16px_50px_rgba(10,22,40,0.18)] border border-slate-100 hover:border-cyan-300/60 hover:shadow-[0_20px_60px_rgba(34,211,238,0.22)] transition-all duration-300 gap-3 md:gap-0">
        
        {/* Left Section: Search Input */}
        <div className="flex items-center flex-1 pl-3 md:pl-4 pr-2">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsEditingLocation(true);
            }}
            onFocus={() => {
              setIsEditingLocation(true);
              if (results.length > 0) setIsOpen(true);
            }}
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

        {/* Middle Section: Active City / Country */}
        <button
          type="button"
          onClick={() => {
            inputRef.current?.focus();
            setIsEditingLocation(true);
          }}
          className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-0 text-left hover:bg-slate-50 md:rounded-full transition-colors cursor-pointer group"
          title="Click to search another location"
        >
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-slate-700 whitespace-nowrap group-hover:text-cyan-700">
            {currentLocation.name}
            {currentLocation.country ? `, ${currentLocation.country}` : ""}
          </span>
          <span className="text-slate-400 text-xs font-mono ml-0.5">/</span>
        </button>

        {/* Divider 2 */}
        <div className="hidden md:block w-px h-8 bg-slate-200 mx-2" />

        {/* Weather Quick Stat: Sun + Temp */}
        <div className="flex items-center gap-2 px-3 md:px-4 py-1 md:py-0 shrink-0">
          <Sun className="w-5 h-5 text-amber-500 shrink-0 fill-amber-500/20 animate-spin-slow" />
          <span className="text-lg font-bold text-slate-900 tracking-tight font-sans">
            {temp}
          </span>
        </div>

        {/* Right CTA Button: Blue Pill "Get forecast >" */}
        <button
          type="button"
          onClick={onGetForecast}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#52B1E4] hover:bg-[#43A0D3] active:scale-95 text-white font-medium text-sm transition-all duration-200 shadow-[0_4px_16px_rgba(82,177,228,0.4)] shrink-0 cursor-pointer group"
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

      {/* Quick City Suggestion Chips (Enhancement) */}
      <div className="mt-3 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Popular:
        </span>
        {POPULAR_CITIES.map((city) => {
          const isSelected = city.name.toLowerCase() === currentLocation.name.toLowerCase();
          return (
            <button
              key={city.name}
              type="button"
              onClick={() => handleSelect(city)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border cursor-pointer ${
                isSelected
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                  : "bg-white/10 hover:bg-white/20 text-slate-300 border-white/10 hover:border-white/30"
              }`}
            >
              {city.name}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
