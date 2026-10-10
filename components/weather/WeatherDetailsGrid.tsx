"use client";

import { Thermometer, Droplets, Wind, Sun, Eye, Gauge, Compass } from "lucide-react";
import { CurrentWeather } from "@/types/weather";
import { ThemeTokens } from "@/lib/theme";

interface WeatherDetailsGridProps {
  current: CurrentWeather;
  theme: ThemeTokens;
}

export function WeatherDetailsGrid({ current, theme }: WeatherDetailsGridProps) {
  const getUvDescription = (uv: number) => {
    if (uv <= 2) return `${uv} (low)`;
    if (uv <= 5) return `${uv} (moderate)`;
    if (uv <= 7) return `${uv} (high)`;
    return `${uv} extreme`;
  };

  const rows = [
    {
      icon: <Thermometer className="w-4 h-4 text-amber-500" />,
      label: "Feels Like",
      value: `${current.feelsLike}°C`,
    },
    {
      icon: <Droplets className="w-4 h-4 text-cyan-500" />,
      label: "Humidity",
      value: `${current.humidity}%`,
    },
    {
      icon: <Wind className="w-4 h-4 text-teal-500" />,
      label: "Wind Speed",
      value: `${current.windSpeed} km/h`,
    },
    {
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      label: "UV Index",
      value: getUvDescription(current.uvIndex),
    },
    {
      icon: <Eye className="w-4 h-4 text-indigo-500" />,
      label: "Visibility",
      value: `${current.visibility} km`,
    },
    {
      icon: <Gauge className="w-4 h-4 text-emerald-500" />,
      label: "Pressure",
      value: `${current.pressure} hPa`,
    },
  ];

  return (
    <div
      className={`w-full rounded-3xl p-6 sm:p-7 ${theme.cardBg} ${theme.cardBorder} flex flex-col justify-between transition-colors duration-500`}
    >
      {/* Header */}
      <div className={`flex items-center gap-2.5 font-bold text-base sm:text-lg mb-4 ${theme.cardTextPrimary}`}>
        <div
          className="p-1.5 rounded-full"
          style={{
            backgroundColor: `${theme.accentColor}20`,
            color: theme.accentColor,
          }}
        >
          <Compass className="w-4 h-4" />
        </div>
        <span>Weather Details</span>
      </div>

      {/* Metric Rows */}
      <div className={`divide-y ${theme.isDark ? "divide-white/5" : "divide-slate-100"} space-y-1`}>
        {rows.map((row) => (
          <div
            key={row.label}
            className={`flex items-center justify-between py-3 px-2 rounded-xl transition-colors ${
              theme.isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50"
            }`}
          >
            <div className={`flex items-center gap-3 text-xs sm:text-sm font-medium ${theme.cardTextSecondary}`}>
              <span className={`p-1.5 rounded-lg border ${theme.isDark ? "bg-white/5 border-white/5" : "bg-slate-100/70 border-slate-200/60"}`}>
                {row.icon}
              </span>
              <span>{row.label}</span>
            </div>

            <div className={`font-bold text-sm sm:text-base font-sans tracking-tight ${theme.cardTextPrimary}`}>
              {row.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
