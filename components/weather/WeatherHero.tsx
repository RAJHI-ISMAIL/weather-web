"use client";

import { MapPin, ChevronDown, Sun, Cloud, CloudRain, CloudLightning, CloudDrizzle, CloudSun, Snowflake } from "lucide-react";
import { WeatherData } from "@/types/weather";

interface WeatherHeroProps {
  weather: WeatherData;
  onChangeLocationClick?: () => void;
}

export function WeatherHero({ weather, onChangeLocationClick }: WeatherHeroProps) {
  const { current, city, country } = weather;

  // Icon mapping helper
  const renderWeatherIcon = () => {
    const code = current.weatherCode;
    if (code === 0) return <Sun className="w-14 h-14 text-amber-400 fill-amber-400/20" />;
    if (code === 1 || code === 2) return <CloudSun className="w-14 h-14 text-amber-300" />;
    if (code === 3) return <Cloud className="w-14 h-14 text-slate-300 fill-slate-300/20" />;
    if (code >= 51 && code <= 55) return <CloudDrizzle className="w-14 h-14 text-cyan-400" />;
    if (code >= 61 && code <= 82) return <CloudRain className="w-14 h-14 text-[#22D3EE]" />;
    if (code >= 71 && code <= 77) return <Snowflake className="w-14 h-14 text-sky-200" />;
    if (code >= 95) return <CloudLightning className="w-14 h-14 text-amber-400" />;
    return <Sun className="w-14 h-14 text-amber-400" />;
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-10 pt-4">
      {/* Left Column: Heading & Tag */}
      <div className="space-y-3 max-w-xl">
        <div className="flex items-center gap-2.5 text-xs font-bold tracking-[0.2em] text-[#22D3EE] uppercase">
          <span>TODAY&apos;S WEATHER</span>
          <span className="w-8 h-px bg-[#22D3EE]/60 inline-block" />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white leading-[1.1] tracking-tight">
          Discover the <br />
          Weather Around You
        </h1>

        <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
          Accurate forecasts, beautiful insights, and a clearer view of what&apos;s ahead.
        </p>
      </div>

      {/* Right Column: Temperature, Location & Condition */}
      <div className="flex flex-col items-start md:items-end text-left md:text-right space-y-2">
        {/* Clickable Location Pill */}
        <button
          type="button"
          onClick={onChangeLocationClick}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-[#22D3EE] transition-colors cursor-pointer group"
        >
          <MapPin className="w-3.5 h-3.5 text-[#22D3EE] group-hover:scale-110 transition-transform" />
          <span>{city}{country ? `, ${country}` : ""}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
        </button>

        {/* Big Temperature Hero Number + Icon */}
        <div className="flex items-center gap-4">
          <div className="shrink-0">{renderWeatherIcon()}</div>
          <div className="flex items-start text-7xl sm:text-8xl font-sans font-bold text-white tracking-tight leading-none">
            <span>{current.temperature}</span>
            <span className="text-4xl sm:text-5xl font-sans text-[#22D3EE] -top-1 relative ml-1">
              °C
            </span>
          </div>
        </div>

        {/* Condition label and High/Low */}
        <div className="space-y-0.5">
          <div className="text-base sm:text-lg font-semibold text-white">
            {current.condition}
          </div>
          <div className="text-xs sm:text-sm font-medium text-slate-400">
            H: {current.high}° <span className="mx-1 text-slate-600">•</span> L: {current.low}°
          </div>
        </div>
      </div>
    </div>
  );
}
