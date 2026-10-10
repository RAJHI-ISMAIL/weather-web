"use client";

import { useState, useMemo } from "react";
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
import { Sparkles, Sun, CloudRain, Flame } from "lucide-react";

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
  const [location, setLocation] = useState<LocationData>(initialLocation);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [themeMode, setThemeMode] = useState<ThemeId | "auto">("auto");

  const { weather, loading, error, refetch } = useWeather(
    location.latitude,
    location.longitude,
    location.name,
    location.country
  );

  // Compute active theme
  const activeThemeId: ThemeId = useMemo(() => {
    if (themeMode !== "auto") return themeMode;
    if (!weather) return "rainy";
    return getAutoTheme(
      weather.current.weatherCode,
      weather.current.temperature,
      weather.current.isDay,
      weather.alerts
    );
  }, [themeMode, weather]);

  const theme = THEMES[activeThemeId];

  const handleSelectLocation = (loc: LocationData) => {
    setLocation(loc);
    setSelectedDayIndex(0);
  };

  const handleSetTheme = (mode: ThemeId | "auto") => {
    setThemeMode(mode);
    if (mode !== "auto") {
      onThemeChange?.(mode);
    }
  };

  return (
    <section className={`w-full py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors duration-500 ${className}`}>
      
      {/* Search Bar & Theme Mode Switcher */}
      <div className="w-full max-w-3xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full flex-1">
          <LocationSearch
            onSelectLocation={handleSelectLocation}
            placeholder="Search for a city, place or location..."
          />
        </div>

        {/* Dynamic Theme Switcher Controls */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-xs font-semibold shrink-0 shadow-lg">
          <button
            type="button"
            onClick={() => handleSetTheme("auto")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              themeMode === "auto"
                ? "bg-[#22D3EE] text-[#050B14] shadow-md font-bold"
                : "text-slate-300 hover:text-white"
            }`}
            title="Auto detect theme from live weather conditions"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto</span>
          </button>

          <button
            type="button"
            onClick={() => handleSetTheme("sunny")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeThemeId === "sunny" && themeMode !== "auto"
                ? "bg-amber-400 text-[#050B14] shadow-md font-bold"
                : "text-slate-300 hover:text-white"
            }`}
            title="Theme A: Sunny Light Theme"
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sunny</span>
          </button>

          <button
            type="button"
            onClick={() => handleSetTheme("rainy")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeThemeId === "rainy" && themeMode !== "auto"
                ? "bg-cyan-400 text-[#050B14] shadow-md font-bold"
                : "text-slate-300 hover:text-white"
            }`}
            title="Theme B: Rainy Dark Glassmorphism"
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Rainy</span>
          </button>

          <button
            type="button"
            onClick={() => handleSetTheme("heatwave")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeThemeId === "heatwave" && themeMode !== "auto"
                ? "bg-orange-500 text-white shadow-md font-bold"
                : "text-slate-300 hover:text-white"
            }`}
            title="Theme C: Extreme Heatwave Alert"
          >
            <Flame className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Heat</span>
          </button>
        </div>
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
