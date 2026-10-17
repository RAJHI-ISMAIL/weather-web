"use client";

import { useState, useEffect, useCallback } from "react";
import { WeatherData } from "@/types/weather";
import { fetchWeatherData } from "@/lib/api/weather";

export function useWeather(
  latitude: number,
  longitude: number,
  cityName = "Selected City",
  country = ""
) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWeatherData(latitude, longitude, cityName, country);
        if (ignore) return;
        if (!data) {
          setError("Unable to retrieve weather forecast for this location.");
        } else {
          setWeather(data);
          setError(null);
        }
      } catch (err) {
        if (ignore) return;
        console.error("useWeather error:", err);
        setError("An unexpected error occurred while connecting to the weather service.");
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [latitude, longitude, cityName, country, refetchIndex]);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setRefetchIndex((prev) => prev + 1);
  }, []);

  return {
    weather,
    loading,
    error,
    refetch,
  };
}
