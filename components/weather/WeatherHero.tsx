"use client";

import { MapPin, ChevronDown, Sun, Cloud, CloudRain, CloudLightning, CloudDrizzle, CloudSun, Snowflake, Flame } from "lucide-react";
import { WeatherData } from "@/types/weather";
import { ThemeTokens } from "@/lib/theme";

interface WeatherHeroProps {
  weather: WeatherData;
  theme: ThemeTokens;
  onChangeLocationClick?: () => void;
}

export function WeatherHero({ weather, theme, onChangeLocationClick }: WeatherHeroProps) {
  const { current, city, country } = weather;

  const renderWeatherIcon = () => {
    if (theme.id === "heatwave") {
      return <Sun className="w-16 h-16 text-amber-500 fill-amber-500/20 animate-spin-slow" />;
    }
    const code = current.weatherCode;
    if (code === 0) return <Sun className="w-16 h-16 text-amber-400 fill-amber-400/20" />;
    if (code === 1 || code === 2) return <CloudSun className="w-16 h-16 text-amber-400" />;
    if (code === 3) return <Cloud className="w-16 h-16 text-slate-400" />;
    if (code >= 51 && code <= 55) return <CloudDrizzle className="w-16 h-16 text-cyan-400" />;
    if (code >= 61 && code <= 82) return <CloudRain className="w-16 h-16 text-[#22D3EE]" />;
    if (code >= 71 && code <= 77) return <Snowflake className="w-16 h-16 text-sky-200" />;
    if (code >= 95) return <CloudLightning className="w-16 h-16 text-amber-400" />;
    return <Sun className="w-16 h-16 text-amber-400" />;
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-10 pt-4 transition-colors duration-500">
      {/* Left Column: Heading & Tag */}
      <div className="space-y-3 max-w-xl">
        <div className={`flex items-center gap-2.5 text-xs font-bold tracking-[0.2em] uppercase ${theme.heroTagColor}`}>
          <span>
            {theme.id === "heatwave" ? "HEATWAVE ALERT: STAY COOL 💧" : "TODAY'S WEATHER"}
          </span>
          <span className="w-8 h-px bg-current opacity-60 inline-block" />
        </div>

        <h1 className={`text-4xl sm:text-5xl md:text-6xl font-serif font-bold leading-[1.1] tracking-tight ${theme.heroTitleColor}`}>
          {theme.id === "heatwave" ? "Prepare for Extreme Temperatures" : "Discover the Weather Around You"}
        </h1>

        <p className={`text-sm sm:text-base font-normal leading-relaxed ${theme.heroSubtextColor}`}>
          {theme.id === "heatwave"
            ? "Essential Heatwave Safety & Forecast."
            : "Accurate forecasts, beautiful insights, and a clearer view of what's ahead."}
        </p>
      </div>

      {/* Right Column: Temperature, Location & Condition */}
      <div className="flex flex-col items-start md:items-end text-left md:text-right space-y-2">
        {/* Clickable Location Pill */}
        <button
          type="button"
          onClick={onChangeLocationClick}
          className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer group ${
            theme.isDark ? "text-slate-300 hover:text-[#22D3EE]" : "text-slate-700 hover:text-[#0EA5E9]"
          }`}
        >
          <MapPin className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-current" />
          <span>{city}{country ? `, ${country}` : ""}</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:translate-y-0.5 transition-transform" />
        </button>

        {/* Big Temperature Hero Number + Icon */}
        <div className="flex items-center gap-4">
          <div className="shrink-0">{renderWeatherIcon()}</div>
          <div className={`flex items-start text-7xl sm:text-8xl font-sans font-bold tracking-tight leading-none ${theme.heroTempColor}`}>
            <span>{current.temperature}</span>
            <span className={`text-4xl sm:text-5xl font-sans -top-1 relative ml-1 ${theme.heroUnitColor}`}>
              °C
            </span>
          </div>
        </div>

        {/* Condition label and High/Low */}
        <div className="space-y-0.5">
          <div className={`text-base sm:text-lg font-semibold ${theme.heroTitleColor}`}>
            {theme.id === "heatwave" ? "Blazing Sun" : current.condition}
          </div>
          <div className={`text-xs sm:text-sm font-medium ${theme.heroSubtextColor}`}>
            H: {current.high}° <span className="mx-1 opacity-50">•</span> L: {current.low}°
          </div>
        </div>
      </div>
    </div>
  );
}
