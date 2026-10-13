"use client";

import { useMemo, useState, useCallback } from "react";
import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudDrizzle,
  Snowflake,
  CloudLightning,
  Orbit,
  List,
} from "lucide-react";
import { DailyForecastDay } from "@/types/weather";
import { ThemeTokens } from "@/lib/theme";
import CircularCarousel, { CarouselItem } from "@/components/ui/CircularCarousel";

interface ForecastCarouselProps {
  daily: DailyForecastDay[];
  theme: ThemeTokens;
  selectedIndex?: number;
  onSelectDay?: (index: number) => void;
}

const getWeatherPhoto = (code: number, isHeatwave: boolean) => {
  if (isHeatwave) {
    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop";
  }
  if (code === 0) {
    return "https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=800&q=80&auto=format&fit=crop";
  }
  if (code === 1 || code === 2) {
    return "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80&auto=format&fit=crop";
  }
  if (code === 3 || code === 45 || code === 48) {
    return "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=800&q=80&auto=format&fit=crop";
  }
  if (code >= 51 && code <= 55) {
    return "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80&auto=format&fit=crop";
  }
  if (code >= 61 && code <= 82) {
    return "https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=800&q=80&auto=format&fit=crop";
  }
  if (code >= 71 && code <= 77) {
    return "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800&q=80&auto=format&fit=crop";
  }
  if (code >= 95) {
    return "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&q=80&auto=format&fit=crop";
  }
  return "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80&auto=format&fit=crop";
};

export function ForecastCarousel({
  daily,
  theme,
  selectedIndex = 0,
  onSelectDay,
}: ForecastCarouselProps) {
  const [viewMode, setViewMode] = useState<"3d" | "strip">("3d");

  const getDayIcon = useCallback((code: number, className = "w-7 h-7") => {
    if (theme.id === "heatwave") {
      return <Sun className={`${className} text-amber-300 fill-amber-300/30`} />;
    }
    if (code === 0) return <Sun className={`${className} text-amber-400 fill-amber-400/20`} />;
    if (code === 1 || code === 2) return <CloudSun className={`${className} text-amber-300`} />;
    if (code === 3) return <Cloud className={`${className} text-slate-300`} />;
    if (code >= 51 && code <= 55) return <CloudDrizzle className={`${className} text-cyan-300`} />;
    if (code >= 61 && code <= 82) return <CloudRain className={`${className} text-[#22D3EE]`} />;
    if (code >= 71 && code <= 77) return <Snowflake className={`${className} text-sky-200`} />;
    if (code >= 95) return <CloudLightning className={`${className} text-amber-300`} />;
    return <Sun className={`${className} text-amber-400`} />;
  }, [theme.id]);

  // Convert daily forecast into 3D CircularCarousel items
  const carouselItems: CarouselItem[] = useMemo(() => {
    return daily.map((day, idx) => {
      const isHeatwave = theme.id === "heatwave";
      const src = getWeatherPhoto(day.weatherCode, isHeatwave);
      const isSelected = idx === selectedIndex;

      return {
        src,
        alt: `${day.dayName}: ${day.condition}, high ${day.tempMax}°, low ${day.tempMin}°`,
        title: `${day.dayName} · ${day.tempMax}° / ${day.tempMin}°`,
        subtitle: isHeatwave ? "Extreme Heat" : day.condition,
        cardContent: (
          <div className="flex flex-col justify-between h-full p-4 select-none">
            {/* Top row: Day Name & Date */}
            <div className="flex items-center justify-between w-full">
              <span className="text-base font-bold font-sans tracking-wide text-white drop-shadow-md">
                {day.dayName}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full backdrop-blur-md border ${
                  isSelected
                    ? "bg-cyan-500/30 text-cyan-200 border-cyan-400/40"
                    : "bg-black/40 text-white/80 border-white/20"
                }`}
              >
                {day.date.slice(5)}
              </span>
            </div>

            {/* Middle: Weather Icon & Condition */}
            <div className="flex flex-col items-center justify-center my-auto py-2">
              <div className="p-2.5 rounded-2xl bg-black/35 backdrop-blur-md border border-white/15 shadow-xl mb-2">
                {getDayIcon(day.weatherCode, "w-8 h-8")}
              </div>
              <span className="text-xs font-medium text-slate-100 text-center drop-shadow-sm line-clamp-1">
                {isHeatwave ? "Blazing Heat" : day.condition}
              </span>
            </div>

            {/* Bottom: Temperatures */}
            <div className="flex items-center justify-between pt-2.5 border-t border-white/20">
              <div className="flex items-baseline gap-1.5 font-sans">
                <span className="text-xl font-extrabold text-white drop-shadow-md">
                  {day.tempMax}°
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  {day.tempMin}°
                </span>
              </div>
              <span className="text-[11px] font-medium text-cyan-300 drop-shadow-sm">
                Forecast Day {idx + 1}
              </span>
            </div>
          </div>
        ),
      };
    });
  }, [daily, theme.id, selectedIndex, getDayIcon]);

  const fadeColor = theme.isDark ? "#050B14" : theme.id === "heatwave" ? "#FFF8F0" : "#E0F2FE";

  return (
    <div className="relative w-full max-w-6xl mx-auto mb-10">
      {/* Header bar with title and View Mode toggle */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div>
          <h3 className={`text-sm font-semibold tracking-wide uppercase ${theme.heroTagColor}`}>
            7-Day Atmospheric Forecast
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
            Grab and rotate the 3D ring to explore daily conditions
          </p>
        </div>

        <div className="flex items-center gap-1 bg-black/20 dark:bg-white/5 backdrop-blur-md p-1 rounded-full border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setViewMode("3d")}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
              viewMode === "3d"
                ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/30 font-semibold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>3D Ring</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("strip")}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
              viewMode === "strip"
                ? "bg-white/20 text-white border border-white/20 font-semibold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Classic Strip</span>
          </button>
        </div>
      </div>

      {/* 3D Circular Carousel Mode */}
      {viewMode === "3d" ? (
        <div className="relative w-full h-[400px] sm:h-[460px] lg:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 p-2">
          <CircularCarousel
            items={carouselItems}
            preset="cylinder"
            intro="rise"
            cardWidth={160}
            aspectRatio={0.75}
            gap={20}
            speed={8}
            curve={0}
            tilt={-6}
            perspective={2000}
            autoplay="drift"
            pauseOnHover={true}
            focusOnClick={true}
            captions={true}
            fadeColor={fadeColor}
            depthFade={0.5}
            cornerRadius={14}
            onChange={(idx) => onSelectDay?.(idx)}
            onItemClick={(_item, idx) => onSelectDay?.(idx)}
          />
        </div>
      ) : (
        /* Classic Flat Horizontal Strip Mode */
        <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 px-2 scrollbar-none snap-x snap-mandatory">
          {daily.map((day, idx) => {
            const isActive = idx === selectedIndex;
            const bgClass = theme.forecastCardBg(isActive);
            const borderClass = theme.forecastCardBorder(isActive);

            return (
              <button
                key={`${day.date}-${idx}`}
                type="button"
                onClick={() => onSelectDay?.(idx)}
                className={`flex-1 min-w-[120px] sm:min-w-[130px] md:min-w-[140px] h-[170px] sm:h-[190px] rounded-2xl p-4 sm:p-5 flex flex-col justify-between items-start text-left transition-all duration-300 snap-start cursor-pointer focus:outline-none ${bgClass} ${borderClass} ${
                  isActive ? "scale-[1.02]" : "hover:scale-[1.01]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className={`text-sm font-bold font-sans ${theme.forecastCardText}`}>
                      {day.dayName}
                    </span>
                    {isActive && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                    )}
                  </div>

                  <div className="mb-2">{getDayIcon(day.weatherCode, "w-6 h-6")}</div>

                  <div
                    className={`text-xs font-medium line-clamp-1 ${
                      theme.id === "heatwave" ? "text-amber-100" : theme.cardTextSecondary
                    }`}
                  >
                    {theme.id === "heatwave" ? "Blazing Sun" : day.condition}
                  </div>
                </div>

                <div className="flex items-baseline gap-2 font-mono">
                  <span className={`text-sm sm:text-base font-bold font-sans ${theme.forecastCardText}`}>
                    {day.tempMax}°
                  </span>
                  <span
                    className={`text-xs font-semibold font-sans ${
                      theme.id === "heatwave" ? "text-amber-200/80" : theme.cardTextSecondary
                    }`}
                  >
                    {day.tempMin}°
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
