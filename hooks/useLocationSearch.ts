"use client";

import { useState, useEffect, useCallback } from "react";
import { LocationData } from "@/types/location";
import { searchLocations } from "@/lib/api/geocoding";

export function useLocationSearch(debounceMs = 300) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      const clearTimer = setTimeout(() => {
        setResults([]);
        setLoading(false);
        setIsOpen(false);
      }, 0);
      return () => clearTimeout(clearTimer);
    }

    const searchTimer = setTimeout(async () => {
      setLoading(true);
      try {
        const locations = await searchLocations(trimmed);
        setResults(locations);
        setIsOpen(locations.length > 0);
      } catch (err) {
        console.error("Search hook error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(searchTimer);
    };
  }, [query, debounceMs]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    isOpen,
    setIsOpen,
    clearSearch,
  };
}
