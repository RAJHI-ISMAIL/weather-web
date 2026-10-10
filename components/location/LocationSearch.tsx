"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Loader2, X, Compass } from "lucide-react";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import { LocationData } from "@/types/location";

interface LocationSearchProps {
  onSelectLocation: (loc: LocationData) => void;
  placeholder?: string;
  className?: string;
}

export function LocationSearch({
  onSelectLocation,
  placeholder = "Search for a city, place or location...",
  className = "",
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
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (loc: LocationData) => {
    onSelectLocation(loc);
    clearSearch();
    inputRef.current?.blur();
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-xl mx-auto ${className}`}>
      {/* Search Bar Input Container */}
      <div className="relative flex items-center h-12 md:h-14 px-4 md:px-5 rounded-full bg-[#0A1628]/80 backdrop-blur-xl border border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.4)] focus-within:border-[#22D3EE] focus-within:shadow-[0_0_25px_rgba(34,211,238,0.35)] transition-all duration-300">
        <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#22D3EE]/80 shrink-0 mr-3" />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
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
          className="w-full bg-transparent text-white placeholder-slate-400 text-sm md:text-base outline-none pr-3"
        />

        {/* Clear or loading indicator */}
        {loading ? (
          <Loader2 className="w-4 h-4 text-[#22D3EE] animate-spin shrink-0 mr-2" />
        ) : query ? (
          <button
            type="button"
            onClick={clearSearch}
            className="p-1 text-slate-400 hover:text-white rounded-full mr-2 transition-colors focus:outline-none"
            aria-label="Clear search input"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}

        {/* Cyan Search Button Icon */}
        <button
          type="button"
          onClick={() => {
            if (results.length > 0) handleSelect(results[0]);
          }}
          className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#22D3EE] text-[#050B14] hover:bg-[#67E8F9] hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] shrink-0"
          aria-label="Search"
        >
          <Search className="w-4 h-4 font-bold" />
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 mt-2 py-2 rounded-2xl bg-[#0A1628]/95 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.8)] z-50 max-h-72 overflow-y-auto divide-y divide-white/5"
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
                  isHighlighted ? "bg-[#22D3EE]/15 text-white" : "text-slate-200 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-full bg-white/5 border border-white/10 text-[#22D3EE]">
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-white">
                      {loc.name}
                      {loc.admin1 && (
                        <span className="text-slate-400 font-normal ml-1">
                          , {loc.admin1}
                        </span>
                      )}
                    </div>
                    {loc.country && (
                      <div className="text-xs text-slate-400">{loc.country}</div>
                    )}
                  </div>
                </div>

                <div className="text-[11px] font-mono text-cyan-400/80 shrink-0 pl-2">
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
