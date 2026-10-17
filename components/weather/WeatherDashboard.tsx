"use client";

import { useState, useEffect } from "react";
import { WeatherHero } from "@/components/weather/WeatherHero";
import { ForecastCarousel } from "@/components/weather/ForecastCarousel";
import { TemperatureChart } from "@/components/weather/TemperatureChart";
import { WeatherDetailsGrid } from "@/components/weather/WeatherDetailsGrid";
import { WeatherAlert } from "@/components/weather/WeatherAlert";
import { WeatherLoading } from "@/components/weather/WeatherLoading";
import { WeatherError } from "@/components/weather/WeatherError";
import { LocationSearch } from "@/components/location/LocationSearch";
import { useWeather } from "@/hooks/useWeather";
import { LocationData } from "@/types/location";
import { THEMES, getAutoTheme, ThemeId } from "@/lib/theme";
import { Sun, CloudRain, Flame, Cloud } from "lucide-react";

interface WeatherDashboardProps {
  initialLocation?: LocationData;
  className?: string;
  onThemeChange?: (themeId: ThemeId) => void;
}

export function WeatherDashboard({
  initialLocation = {
    name: "Beverly Hills",
    country: "USA",
    latitude: 34.07,
    longitude: -118.4,
  },
  className = "",
  onThemeChange,
}: WeatherDashboardProps) {
  const [customLocation, setCustomLocation] = useState<LocationData | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Synchronize state with incoming initialLocation prop during render without effect cascade
  const [prevInitLocation, setPrevInitLocation] = useState(initialLocation);
  if (
    prevInitLocation.latitude !== initialLocation.latitude ||
    prevInitLocation.longitude !== initialLocation.longitude ||
    prevInitLocation.name !== initialLocation.name
  ) {
    setPrevInitLocation(initialLocation);
    setCustomLocation(null);
    setSelectedDayIndex(0);
  }

  const location = customLocation ?? initialLocation;

  const { weather, loading, error, refetch } = useWeather(
    location.latitude,
    location.longitude,
    location.name,
    location.country
  );

  // Automatically determine theme strictly based on live meteorological data
  const activeThemeId: ThemeId = weather
    ? getAutoTheme(
        weather.current.weatherCode,
        weather.current.temperature,
        weather.current.isDay,
        weather.alerts
      )
    : "rainy";

  // Synchronize parent page background with active weather theme
  useEffect(() => {
    if (onThemeChange) {
      onThemeChange(activeThemeId);
    }
  }, [activeThemeId, onThemeChange]);

  const theme = THEMES[activeThemeId];

  const handleSelectLocation = (loc: LocationData) => {
    setCustomLocation(loc);
    setSelectedDayIndex(0);
  };

  const getThemeBadge = () => {
    if (activeThemeId === "heatwave") {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-600 border border-orange-400/40 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
          <span>Active Atmosphere: Extreme Heatwave</span>
        </div>
      );
    }
    if (activeThemeId === "cloudy") {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/20 text-sky-200 border border-sky-400/30 text-xs font-semibold backdrop-blur-md">
          <Cloud className="w-3.5 h-3.5 text-sky-300" />
          <span>Active Atmosphere: Overcast / Cloudy</span>
        </div>
      );
    }
    if (activeThemeId === "sunny") {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 text-sky-700 border border-sky-400/30 text-xs font-semibold">
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Active Atmosphere: Sunny Daylight</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 text-xs font-semibold">
        <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
        <span>Active Atmosphere: Rainy / Night Glassmorphism</span>
      </div>
    );
  };

  return (
    <section className={`w-full py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors duration-500 ${className}`}>
      
      {/* Top Search Bar & Auto Atmosphere Status */}
      <div className="w-full max-w-xl mx-auto mb-8 flex flex-col items-center gap-3">
        <LocationSearch
          onSelectLocation={handleSelectLocation}
          placeholder="Search for a city, place or location..."
          theme={theme}
        />

        {/* Live Weather Theme Indicator Badge */}
        {!loading && weather && (
          <div className="flex items-center gap-2">
            {getThemeBadge()}
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && <WeatherLoading />}

      {/* Error state */}
      {!loading && error && <WeatherError message={error} onRetry={refetch} />}

      {/* Weather content */}
      {!loading && weather && (
        <div className="space-y-6">
          {/* Weather Alert if present */}
          <WeatherAlert alerts={weather.alerts} />

          {/* 1. Hero: Title + Big Temp & Condition */}
          <WeatherHero
            weather={weather}
            theme={theme}
          />

          {/* 2. 7-Day Forecast Carousel */}
          <ForecastCarousel
            daily={weather.daily}
            theme={theme}
            selectedIndex={selectedDayIndex}
            onSelectDay={(idx) => setSelectedDayIndex(idx)}
          />

          {/* 3. Bottom 2-Column Grid: Temperature Chart + Weather Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 7 cols: Hourly Trend Graph */}
            <div className="lg:col-span-7 flex">
              <TemperatureChart
                hourly={weather.hourly}
                daily={weather.daily}
                theme={theme}
              />
            </div>

            {/* Right 5 cols: Weather Details Panel */}
            <div className="lg:col-span-5 flex">
              <WeatherDetailsGrid
                current={weather.current}
                theme={theme}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
