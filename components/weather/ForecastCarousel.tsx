"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Sun, Cloud, CloudSun, CloudRain, CloudDrizzle, Snowflake, CloudLightning } from "lucide-react";
import { DailyForecastDay } from "@/types/weather";
import { ThemeTokens } from "@/lib/theme";

interface ForecastCarouselProps {
  daily: DailyForecastDay[];
  theme: ThemeTokens;
  selectedIndex?: number;
  onSelectDay?: (index: number) => void;
}

export function ForecastCarousel({
  daily,
  theme,
  selectedIndex = 0,
  onSelectDay,
}: ForecastCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -240 : 240;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const getDayIcon = (code: number) => {
    if (theme.id === "heatwave") {
      return <Sun className="w-8 h-8 text-amber-100 fill-amber-100/30" />;
    }
    if (code === 0) return <Sun className="w-8 h-8 text-amber-400 fill-amber-400/20" />;
    if (code === 1 || code === 2) return <CloudSun className="w-8 h-8 text-amber-300" />;
    if (code === 3) return <Cloud className="w-8 h-8 text-slate-400" />;
    if (code >= 51 && code <= 55) return <CloudDrizzle className="w-8 h-8 text-cyan-400" />;
    if (code >= 61 && code <= 82) return <CloudRain className="w-8 h-8 text-[#22D3EE]" />;
    if (code >= 71 && code <= 77) return <Snowflake className="w-8 h-8 text-sky-200" />;
    if (code >= 95) return <CloudLightning className="w-8 h-8 text-amber-400" />;
    return <Sun className="w-8 h-8 text-amber-400" />;
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto mb-10">
      {/* Scroll controls */}
      <button
        type="button"
        onClick={() => scroll("left")}
        className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 dark:bg-[#0A1628]/90 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-cyan-500 items-center justify-center shadow-lg transition-all focus:outline-none"
        aria-label="Previous forecast days"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => scroll("right")}
        className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 dark:bg-[#0A1628]/90 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-cyan-500 items-center justify-center shadow-lg transition-all focus:outline-none"
        aria-label="Next forecast days"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Cards container */}
      <div
        ref={scrollRef}
        className="flex items-center gap-3.5 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none snap-x snap-mandatory"
      >
        {daily.map((day, idx) => {
          const isActive = idx === selectedIndex;
          const bgClass = theme.forecastCardBg(isActive);
          const borderClass = theme.forecastCardBorder(isActive);

          return (
            <button
              key={`${day.date}-${idx}`}
              type="button"
              onClick={() => onSelectDay?.(idx)}
              className={`flex-1 min-w-[130px] sm:min-w-[140px] h-[190px] rounded-2xl p-5 flex flex-col justify-between items-start text-left transition-all duration-300 snap-start cursor-pointer focus:outline-none ${bgClass} ${borderClass} ${
                isActive ? "scale-[1.02]" : "hover:scale-[1.01]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between w-full mb-3">
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

                <div className="mb-2">{getDayIcon(day.weatherCode)}</div>

                <div
                  className={`text-xs font-medium line-clamp-1 ${
                    theme.id === "heatwave" ? "text-amber-100" : theme.cardTextSecondary
                  }`}
                >
                  {theme.id === "heatwave" ? "Blazing Sun" : day.condition}
                </div>
              </div>

              <div className="flex items-baseline gap-2 font-mono">
                <span className={`text-base sm:text-lg font-bold font-sans ${theme.forecastCardText}`}>
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
    </div>
  );
}
