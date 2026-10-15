"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Loader2, X, Compass } from "lucide-react";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import { LocationData } from "@/types/location";
import { ThemeTokens } from "@/lib/theme";

interface LocationSearchProps {
  onSelectLocation: (loc: LocationData) => void;
  placeholder?: string;
  className?: string;
  theme?: ThemeTokens;
  autoFocus?: boolean;
}

export function LocationSearch({
  onSelectLocation,
  placeholder = "Search for a city, place or location...",
  className = "",
  theme,
  autoFocus = false,
}: LocationSearchProps) {
  const { query, setQuery, results, loading, isOpen, setIsOpen, clearSearch } = useLocationSearch();
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = selectedIndex >= 0 ? results[selectedIndex] : results[0];
      if (target) {
        handleSelect(target);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (loc: LocationData) => {
    onSelectLocation(loc);
    clearSearch();
    inputRef.current?.blur();
  };

  const isDark = theme ? theme.isDark : true;
  const isHeatwave = theme?.id === "heatwave";

  // Dynamic Theme Classes
  const containerClasses = isDark
    ? "bg-[#0A1628]/85 backdrop-blur-xl border border-white/15 text-white shadow-[0_4px_24px_rgba(0,0,0,0.5)] focus-within:border-[#22D3EE] focus-within:shadow-[0_0_25px_rgba(34,211,238,0.35)]"
    : isHeatwave
    ? "bg-white text-slate-800 border border-amber-200/80 shadow-[0_8px_30px_rgba(234,88,12,0.1)] focus-within:border-amber-500 focus-within:shadow-[0_0_25px_rgba(245,158,11,0.25)]"
    : "bg-white text-slate-800 border border-slate-200 shadow-[0_8px_30px_rgba(10,22,40,0.08)] focus-within:border-[#0EA5E9] focus-within:shadow-[0_0_25px_rgba(14,165,233,0.25)]";

  const pinColor = isDark
    ? "text-[#22D3EE]"
    : isHeatwave
    ? "text-amber-500"
    : "text-[#0EA5E9]";

  const buttonClasses = isDark
    ? "bg-[#22D3EE] text-[#050B14] hover:bg-[#67E8F9] shadow-[0_0_15px_rgba(34,211,238,0.4)]"
    : isHeatwave
    ? "bg-[#F97316] text-white hover:bg-[#EA580C] shadow-[0_4px_16px_rgba(249,115,22,0.4)]"
    : "bg-[#0EA5E9] text-white hover:bg-[#0284C7] shadow-[0_4px_16px_rgba(14,165,233,0.35)]";

  const dropdownClasses = isDark
    ? "bg-[#0A1628]/95 border-cyan-500/30 text-slate-200 divide-white/5"
    : isHeatwave
    ? "bg-white border-amber-200 text-slate-800 divide-amber-50 shadow-2xl"
    : "bg-white border-slate-200 text-slate-800 divide-slate-100 shadow-2xl";

  return (
    <div ref={containerRef} className={`relative w-full max-w-xl mx-auto transition-all duration-500 ${className}`}>
      {/* Search Bar Input Container */}
      <div className={`relative flex items-center h-12 md:h-14 px-4 md:px-5 rounded-full transition-all duration-300 ${containerClasses}`}>
        <MapPin className={`w-4 h-4 md:w-5 md:h-5 shrink-0 mr-3 transition-colors ${pinColor}`} />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search city or location"
          className="w-full bg-transparent placeholder-slate-400 text-sm md:text-base outline-none pr-3 font-normal"
        />

        {/* Clear or loading indicator */}
        {loading ? (
          <Loader2 className={`w-4 h-4 animate-spin shrink-0 mr-2 ${pinColor}`} />
        ) : query ? (
          <button
            type="button"
            onClick={clearSearch}
            className="p-1 text-slate-400 hover:opacity-100 rounded-full mr-2 transition-opacity focus:outline-none"
            aria-label="Clear search input"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}

        {/* Action Button */}
        <button
          type="button"
          onClick={() => {
            if (results.length > 0) handleSelect(results[0]);
          }}
          className={`flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer ${buttonClasses}`}
          aria-label="Search"
        >
          <Search className="w-4 h-4 font-bold" />
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <ul
          role="listbox"
          className={`absolute left-0 right-0 mt-2 py-2 rounded-2xl border shadow-2xl z-50 max-h-72 overflow-y-auto divide-y backdrop-blur-2xl transition-all ${dropdownClasses}`}
        >
          {results.map((loc, idx) => {
            const isHighlighted = idx === selectedIndex;
            return (
              <li
                key={`${loc.id}-${idx}`}
                role="option"
                aria-selected={isHighlighted}
                onMouseEnter={() => setSelectedIndex(idx)}
                onClick={() => handleSelect(loc)}
                className={`px-4 py-3 cursor-pointer flex items-center justify-between text-left transition-colors ${
                  isHighlighted
                    ? isDark
                      ? "bg-[#22D3EE]/15 text-white"
                      : "bg-slate-100 text-slate-900"
                    : isDark
                    ? "hover:bg-white/5"
                    : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-full border ${
                      isDark
                        ? "bg-white/5 border-white/10 text-[#22D3EE]"
                        : isHeatwave
                        ? "bg-amber-50 border-amber-200 text-amber-600"
                        : "bg-sky-50 border-sky-200 text-[#0EA5E9]"
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {loc.name}
                      {loc.admin1 && (
                        <span className="opacity-70 font-normal ml-1">
                          , {loc.admin1}
                        </span>
                      )}
                    </div>
                    {loc.country && (
                      <div className="text-xs opacity-60">{loc.country}</div>
                    )}
                  </div>
                </div>

                <div
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                    isDark
                      ? "text-cyan-400 bg-cyan-950/40"
                      : isHeatwave
                      ? "text-amber-700 bg-amber-100"
                      : "text-sky-700 bg-sky-100"
                  }`}
                >
                  {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
