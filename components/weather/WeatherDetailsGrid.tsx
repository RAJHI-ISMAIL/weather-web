"use client";

import { Thermometer, Droplets, Wind, Sun, Eye, Gauge, Compass } from "lucide-react";
import { CurrentWeather } from "@/types/weather";

interface WeatherDetailsGridProps {
  current: CurrentWeather;
}

export function WeatherDetailsGrid({ current }: WeatherDetailsGridProps) {
  const getUvDescription = (uv: number) => {
    if (uv <= 2) return `${uv} (low)`;
    if (uv <= 5) return `${uv} (moderate)`;
    if (uv <= 7) return `${uv} (high)`;
    return `${uv} (very high)`;
  };

  const rows = [
    {
      icon: <Thermometer className="w-4 h-4 text-amber-400" />,
      label: "Feels Like",
      value: `${current.feelsLike}°C`,
    },
    {
      icon: <Droplets className="w-4 h-4 text-cyan-400" />,
      label: "Humidity",
      value: `${current.humidity}%`,
    },
    {
      icon: <Wind className="w-4 h-4 text-teal-400" />,
      label: "Wind Speed",
      value: `${current.windSpeed} km/h`,
    },
    {
      icon: <Sun className="w-4 h-4 text-amber-400" />,
      label: "UV Index",
      value: getUvDescription(current.uvIndex),
    },
    {
      icon: <Eye className="w-4 h-4 text-indigo-400" />,
      label: "Visibility",
      value: `${current.visibility} km`,
    },
    {
      icon: <Gauge className="w-4 h-4 text-emerald-400" />,
      label: "Pressure",
      value: `${current.pressure} hPa`,
    },
  ];

  return (
    <div className="w-full rounded-3xl p-6 sm:p-7 bg-[#0A1628]/70 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg mb-4">
        <div className="p-1.5 rounded-full bg-cyan-500/20 text-[#22D3EE]">
          <Compass className="w-4 h-4" />
        </div>
        <span>Weather Details</span>
      </div>

      {/* Metric Rows */}
      <div className="divide-y divide-white/5 space-y-1">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between py-3 hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3 text-slate-300 text-xs sm:text-sm font-medium">
              <span className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                {row.icon}
              </span>
              <span>{row.label}</span>
            </div>

            <div className="text-white font-bold text-sm sm:text-base font-sans tracking-tight">
              {row.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
