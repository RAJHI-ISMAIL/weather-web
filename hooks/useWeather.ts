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

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(latitude, longitude, cityName, country);
      if (!data) {
        setError("Unable to retrieve weather forecast for this location.");
      } else {
        setWeather(data);
      }
    } catch (err) {
      setError("An unexpected error occurred while connecting to the weather service.");
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude, cityName, country]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    weather,
    loading,
    error,
    refetch: load,
  };
}
