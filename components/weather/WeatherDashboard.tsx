"use client";

import { useState } from "react";
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

interface WeatherDashboardProps {
  initialLocation?: LocationData;
  className?: string;
}

export function WeatherDashboard({
  initialLocation = {
    name: "Beverly Hills",
    country: "USA",
    latitude: 34.07,
    longitude: -118.4,
  },
  className = "",
}: WeatherDashboardProps) {
  const [location, setLocation] = useState<LocationData>(initialLocation);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const { weather, loading, error, refetch } = useWeather(
    location.latitude,
    location.longitude,
    location.name,
    location.country
  );

  const handleSelectLocation = (loc: LocationData) => {
    setLocation(loc);
    setSelectedDayIndex(0);
    setIsSearchOpen(false);
  };

  return (
    <section className={`w-full py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}>
      {/* Top Search Bar (Styled as seen in mockup) */}
      <div className="w-full max-w-xl mx-auto mb-8">
        <LocationSearch
          onSelectLocation={handleSelectLocation}
          placeholder="Search for a city, place or location..."
        />
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
            onChangeLocationClick={() => setIsSearchOpen((prev) => !prev)}
          />

          {/* 2. 7-Day Forecast Carousel */}
          <ForecastCarousel
            daily={weather.daily}
            selectedIndex={selectedDayIndex}
            onSelectDay={(idx) => setSelectedDayIndex(idx)}
          />

          {/* 3. Bottom 2-Column Grid: Temperature Chart + Weather Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 7 cols: Hourly Trend Graph */}
            <div className="lg:col-span-7 flex">
              <TemperatureChart hourly={weather.hourly} daily={weather.daily} />
            </div>

            {/* Right 5 cols: Weather Details Panel */}
            <div className="lg:col-span-5 flex">
              <WeatherDetailsGrid current={weather.current} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
