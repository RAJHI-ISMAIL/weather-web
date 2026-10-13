"use client";

import { useEffect, useState } from "react";
import { LocationData } from "@/types/location";
import { WeatherData } from "@/types/weather";
import { fetchWeatherData } from "@/lib/api/weather";
import { MapPin, Navigation, ArrowRight, X, Loader2, Thermometer, Wind, Droplets } from "lucide-react";
import { getWeatherCondition } from "@/lib/weather";

interface GlobePlaceCardProps {
  location: LocationData;
  onClose: () => void;
  onOpenForecast: (loc: LocationData) => void;
  className?: string;
}

export function GlobePlaceCard({
  location,
  onClose,
  onOpenForecast,
  className = "",
}: GlobePlaceCardProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // Synchronize loading state when location changes during render
  const [prevLoc, setPrevLoc] = useState(location);
  if (
    prevLoc.latitude !== location.latitude ||
    prevLoc.longitude !== location.longitude ||
    prevLoc.name !== location.name
  ) {
    setPrevLoc(location);
    setLoading(true);
    setWeather(null);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadQuickWeather() {
      try {
        const data = await fetchWeatherData(
          location.latitude,
          location.longitude,
          location.name,
          location.country
        );
        if (isMounted) {
          setWeather(data);
          setLoading(false);
        }
      } catch {
        if (isMounted) setLoading(false);
      }
    }

    loadQuickWeather();
    return () => {
      isMounted = false;
    };
  }, [location.latitude, location.longitude, location.name, location.country]);

  const weatherCondition = weather
    ? getWeatherCondition(weather.current.weatherCode)
    : "Clear sky";

  return (
    <div
      className={`glass-card p-4 sm:p-5 rounded-3xl border border-white/20 shadow-[0_16px_40px_rgba(0,0,0,0.65)] backdrop-blur-2xl text-white max-w-xs sm:max-w-sm w-full animate-fadeIn select-none ${className}`}
    >
      {/* Header with City & Close */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-400 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base leading-tight truncate">
              {location.name}
            </h3>
            {location.country && (
              <p className="text-xs text-slate-300 truncate">{location.country}</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close card"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Coordinates pill */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-cyan-400 mb-3">
        <Navigation className="w-3 h-3 rotate-45" />
        <span>
          {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
        </span>
      </div>

      {/* Mini Weather Preview */}
      <div className="my-2 p-3 rounded-2xl bg-white/[0.04] border border-white/10">
        {loading ? (
          <div className="flex items-center justify-center py-3 gap-2 text-xs text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Fetching live weather...</span>
          </div>
        ) : weather ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans flex items-baseline gap-1">
                <span>{Math.round(weather.current.temperature)}</span>
                <span className="text-cyan-400 text-sm">°C</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {weatherCondition}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1 text-[11px] text-slate-300 font-mono">
              <span className="flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-cyan-400" />
                Feels {Math.round(weather.current.feelsLike)}°
              </span>
              <span className="flex items-center gap-1">
                <Wind className="w-3 h-3 text-cyan-400" />
                {Math.round(weather.current.windSpeed)} km/h
              </span>
              <span className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-cyan-400" />
                {weather.current.humidity}%
              </span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 text-center py-2">
            Weather data unavailable for this point
          </div>
        )}
      </div>

      {/* Action CTA Button */}
      <button
        type="button"
        onClick={() => onOpenForecast(location)}
        className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(34,211,238,0.35)] transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
      >
        <span>Open Forecast</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
