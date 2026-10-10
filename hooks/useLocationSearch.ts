"use client";

import { useState, useEffect, useRef } from "react";
import { LocationData } from "@/types/location";
import { searchLocations } from "@/lib/api/geocoding";

export function useLocationSearch(debounceMs = 300) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    timerRef.current = setTimeout(async () => {
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
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [query, debounceMs]);

  return {
    query,
    setQuery,
    results,
    loading,
    isOpen,
    setIsOpen,
    clearSearch: () => {
      setQuery("");
      setResults([]);
      setIsOpen(false);
    },
  };
}
