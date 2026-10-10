"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Sun, Cloud, CloudSun, CloudRain, CloudDrizzle, Snowflake, CloudLightning } from "lucide-react";
import { DailyForecastDay } from "@/types/weather";

interface ForecastCarouselProps {
  daily: DailyForecastDay[];
  selectedIndex?: number;
  onSelectDay?: (index: number) => void;
}

export function ForecastCarousel({
  daily,
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
    if (code === 0) return <Sun className="w-8 h-8 text-amber-400 fill-amber-400/20" />;
    if (code === 1 || code === 2) return <CloudSun className="w-8 h-8 text-amber-300" />;
    if (code === 3) return <Cloud className="w-8 h-8 text-slate-300 fill-slate-300/20" />;
    if (code >= 51 && code <= 55) return <CloudDrizzle className="w-8 h-8 text-cyan-400" />;
    if (code >= 61 && code <= 82) return <CloudRain className="w-8 h-8 text-[#22D3EE]" />;
    if (code >= 71 && code <= 77) return <Snowflake className="w-8 h-8 text-sky-200" />;
    if (code >= 95) return <CloudLightning className="w-8 h-8 text-amber-400" />;
    return <Sun className="w-8 h-8 text-amber-400" />;
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto mb-10">
      {/* Scroll controls for mobile / small desktop */}
      <button
        type="button"
        onClick={() => scroll("left")}
        className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#0A1628]/90 border border-white/10 hover:border-cyan-400/60 text-slate-300 hover:text-white items-center justify-center shadow-lg transition-all focus:outline-none"
        aria-label="Previous forecast days"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => scroll("right")}
        className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#0A1628]/90 border border-white/10 hover:border-cyan-400/60 text-slate-300 hover:text-white items-center justify-center shadow-lg transition-all focus:outline-none"
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
          return (
            <button
              key={`${day.date}-${idx}`}
              type="button"
              onClick={() => onSelectDay?.(idx)}
              className={`flex-1 min-w-[130px] sm:min-w-[140px] h-[190px] rounded-2xl p-5 flex flex-col justify-between items-start text-left transition-all duration-300 snap-start cursor-pointer focus:outline-none ${
                isActive
                  ? "bg-[#0A1628] border-2 border-[#22D3EE] shadow-[0_0_25px_rgba(34,211,238,0.25)] scale-[1.02]"
                  : "bg-[#0A1628]/50 hover:bg-[#0A1628]/80 border border-white/10 hover:border-white/25 hover:scale-[1.01]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="text-sm font-bold text-white font-sans">
                    {day.dayName}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
                  )}
                </div>

                <div className="mb-2">{getDayIcon(day.weatherCode)}</div>

                <div className="text-xs text-slate-400 font-medium line-clamp-1">
                  {day.condition}
                </div>
              </div>

              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-base sm:text-lg font-bold text-white font-sans">
                  {day.tempMax}°
                </span>
                <span className="text-xs font-semibold text-slate-400 font-sans">
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
