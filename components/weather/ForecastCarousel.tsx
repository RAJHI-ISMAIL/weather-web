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
    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80&auto=format&fit=crop";
  }
  if (code === 0) {
    return "https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=900&q=80&auto=format&fit=crop";
  }
  if (code === 1 || code === 2) {
    return "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=900&q=80&auto=format&fit=crop";
  }
  if (code === 3 || code === 45 || code === 48) {
    return "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=900&q=80&auto=format&fit=crop";
  }
  if (code >= 51 && code <= 55) {
    return "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=900&q=80&auto=format&fit=crop";
  }
  if (code >= 71 && code <= 77) {
    return "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=900&q=80&auto=format&fit=crop";
  }
  if (code >= 61 && code <= 82) {
    return "https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=900&q=80&auto=format&fit=crop";
  }
  if (code >= 95) {
    return "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=900&q=80&auto=format&fit=crop";
  }
  return "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=900&q=80&auto=format&fit=crop";
};

const getWeatherAccent = (code: number, isHeatwave: boolean) => {
  if (isHeatwave) return { glow: "rgba(251,191,36,0.55)", text: "#fbbf24", pill: "rgba(251,191,36,0.18)" };
  if (code === 0) return { glow: "rgba(251,191,36,0.45)", text: "#fbbf24", pill: "rgba(251,191,36,0.15)" };
  if (code === 1 || code === 2) return { glow: "rgba(251,191,36,0.3)", text: "#f9a825", pill: "rgba(251,191,36,0.12)" };
  if (code >= 51 && code <= 55) return { glow: "rgba(34,211,238,0.4)", text: "#67e8f9", pill: "rgba(34,211,238,0.15)" };
  if (code >= 71 && code <= 77) return { glow: "rgba(186,230,253,0.45)", text: "#bae6fd", pill: "rgba(186,230,253,0.15)" };
  if (code >= 61 && code <= 82) return { glow: "rgba(56,189,248,0.45)", text: "#38bdf8", pill: "rgba(56,189,248,0.15)" };
  if (code >= 95) return { glow: "rgba(167,139,250,0.45)", text: "#c4b5fd", pill: "rgba(167,139,250,0.15)" };
  return { glow: "rgba(148,163,184,0.35)", text: "#cbd5e1", pill: "rgba(148,163,184,0.12)" };
};

export function ForecastCarousel({
  daily,
  theme,
  selectedIndex = 0,
  onSelectDay,
}: ForecastCarouselProps) {
  const [viewMode, setViewMode] = useState<"3d" | "strip">("3d");

  const getDayIcon = useCallback((code: number, className = "w-9 h-9") => {
    if (theme.id === "heatwave") {
      return <Sun className={`${className} text-amber-300 fill-amber-300/30`} />;
    }
    if (code === 0) return <Sun className={`${className} text-amber-400 fill-amber-400/20`} />;
    if (code === 1 || code === 2) return <CloudSun className={`${className} text-amber-300`} />;
    if (code === 3) return <Cloud className={`${className} text-slate-300`} />;
    if (code >= 51 && code <= 55) return <CloudDrizzle className={`${className} text-cyan-300`} />;
    if (code >= 71 && code <= 77) return <Snowflake className={`${className} text-sky-200`} />;
    if (code >= 61 && code <= 82) return <CloudRain className={`${className} text-sky-300`} />;
    if (code >= 95) return <CloudLightning className={`${className} text-violet-300`} />;
    return <Sun className={`${className} text-amber-400`} />;
  }, [theme.id]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return dateStr.slice(5);
    }
  };

  const allMax = useMemo(() => Math.max(...daily.map((d) => d.tempMax)), [daily]);
  const allMin = useMemo(() => Math.min(...daily.map((d) => d.tempMin)), [daily]);
  const tempRange = useMemo(() => allMax - allMin || 1, [allMax, allMin]);
  const barWidth = useCallback(
    (val: number) => Math.max(8, Math.round(((val - allMin) / tempRange) * 100)),
    [allMin, tempRange]
  );

  const carouselItems: CarouselItem[] = useMemo(() => {
    return daily.map((day, idx) => {
      const isHeatwave = theme.id === "heatwave";
      const src = getWeatherPhoto(day.weatherCode, isHeatwave);
      const isSelected = idx === selectedIndex;
      const accent = getWeatherAccent(day.weatherCode, isHeatwave);
      const maxBar = barWidth(day.tempMax);
      const minBar = barWidth(day.tempMin);

      return {
        src,
        alt: `${day.dayName}: ${day.condition}, high ${day.tempMax}°, low ${day.tempMin}°`,
        title: `${day.dayName} · ${day.tempMax}° / ${day.tempMin}°`,
        subtitle: isHeatwave ? "Extreme Heat" : day.condition,
        cardContent: (
          <div
            className="flex flex-col justify-between h-full select-none"
            style={{ padding: "18px 16px 14px" }}
          >
            {/* TOP: Day name + date pill */}
            <div className="flex items-center justify-between w-full">
              <span className="text-[15px] font-extrabold tracking-tight text-white drop-shadow-md leading-none">
                {day.dayName}
              </span>
              <span
                className="text-[11px] font-mono px-2 py-0.5 rounded-full border backdrop-blur-md"
                style={{
                  background: isSelected ? accent.pill : "rgba(0,0,0,0.4)",
                  color: isSelected ? accent.text : "rgba(255,255,255,0.75)",
                  borderColor: isSelected ? `${accent.text}55` : "rgba(255,255,255,0.15)",
                }}
              >
                {formatDate(day.date)}
              </span>
            </div>

            {/* MIDDLE: Glowing icon + condition */}
            <div className="flex flex-col items-center justify-center gap-2.5 my-auto py-3">
              <div
                className="relative flex items-center justify-center rounded-2xl"
                style={{
                  width: 68,
                  height: 68,
                  background: "rgba(0,0,0,0.38)",
                  border: "1.5px solid rgba(255,255,255,0.14)",
                  boxShadow: `0 0 24px 6px ${accent.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
                  backdropFilter: "blur(8px)",
                }}
              >
                {getDayIcon(day.weatherCode, "w-9 h-9")}
              </div>
              <span
                className="text-[12px] font-semibold text-center leading-tight line-clamp-2 px-1"
                style={{
                  color: "rgba(255,255,255,0.88)",
                  textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                }}
              >
                {isHeatwave ? "Extreme Heat" : day.condition}
              </span>
            </div>

            {/* BOTTOM: Temps + bars */}
            <div
              className="flex flex-col gap-1.5"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.12)",
                paddingTop: 10,
              }}
            >
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-[26px] font-black leading-none text-white"
                    style={{ textShadow: `0 0 12px ${accent.glow}` }}
                  >
                    {day.tempMax}°
                  </span>
                  <span className="text-[13px] font-medium text-white/55">{day.tempMin}°</span>
                </div>
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{
                    color: accent.text,
                    background: accent.pill,
                    border: `1px solid ${accent.text}44`,
                  }}
                >
                  Day {idx + 1}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-white/40 w-5 text-right">H</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${maxBar}%`,
                        background: `linear-gradient(90deg, ${accent.text}88, ${accent.text})`,
                        boxShadow: `0 0 6px ${accent.glow}`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-white/40 w-5 text-right">L</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${minBar}%`, background: "rgba(148,163,184,0.5)" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
      };
    });
  }, [daily, theme.id, selectedIndex, getDayIcon, barWidth]);

  const fadeColor = theme.isDark
    ? "#050B14"
    : theme.id === "heatwave"
    ? "#FFF8F0"
    : "#E0F2FE";

  return (
    <div className="relative w-full max-w-7xl mx-auto mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 px-2">
        <div>
          <h3 className={`text-sm font-bold tracking-widest uppercase ${theme.heroTagColor}`}>
            7-Day Atmospheric Forecast
          </h3>
          <p className="text-xs text-slate-400/80 mt-0.5 hidden sm:block">
            Drag or rotate the 3D ring · click a card to select that day
          </p>
        </div>
        <div className="flex items-center gap-1 bg-black/25 backdrop-blur-md p-1 rounded-full border border-white/10 text-xs shadow-lg">
          <button
            type="button"
            onClick={() => setViewMode("3d")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-200 font-medium ${
              viewMode === "3d"
                ? "bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.25)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>3D Ring</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("strip")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-200 font-medium ${
              viewMode === "strip"
                ? "bg-white/15 text-white border border-white/25 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* 3D Circular Carousel */}
      {viewMode === "3d" ? (
        <div
          className="relative w-full rounded-3xl overflow-hidden border border-white/[0.08]"
          style={{
            height: "clamp(460px, 56vh, 640px)",
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 50%, transparent 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.08), 0 32px 80px rgba(0,0,0,0.45)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(56,189,248,0.07) 0%, transparent 70%)",
            }}
          />
          <CircularCarousel
            items={carouselItems}
            preset="cylinder"
            intro="rise"
            cardWidth={200}
            aspectRatio={0.67}
            gap={22}
            speed={7}
            curve={0}
            tilt={-6}
            perspective={2200}
            autoplay="off"
            pauseOnHover={true}
            focusOnClick={true}
            captions={false}
            fadeColor={fadeColor}
            depthFade={0.45}
            cornerRadius={20}
            onChange={(idx) => onSelectDay?.(idx)}
            onItemClick={(_item, idx) => onSelectDay?.(idx)}
          />
        </div>
      ) : (
        /* Classic Strip */
        <div className="flex items-stretch gap-3 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none snap-x snap-mandatory">
          {daily.map((day, idx) => {
            const isActive = idx === selectedIndex;
            const isHeatwave = theme.id === "heatwave";
            const accent = getWeatherAccent(day.weatherCode, isHeatwave);
            const maxBar = barWidth(day.tempMax);

            return (
              <button
                key={`${day.date}-${idx}`}
                type="button"
                onClick={() => onSelectDay?.(idx)}
                className="flex-shrink-0 snap-start focus:outline-none"
                style={{ minWidth: 152 }}
              >
                <div
                  className="flex flex-col justify-between rounded-2xl p-5 text-left transition-all duration-300 relative overflow-hidden"
                  style={{
                    height: 230,
                    background: isActive
                      ? `linear-gradient(145deg, ${accent.pill}, rgba(0,0,0,0.55))`
                      : "rgba(10,18,36,0.55)",
                    border: isActive
                      ? `1.5px solid ${accent.text}55`
                      : "1px solid rgba(255,255,255,0.1)",
                    boxShadow: isActive
                      ? `0 0 28px ${accent.glow}, inset 0 1px 0 rgba(255,255,255,0.12)`
                      : "0 4px 24px rgba(0,0,0,0.35)",
                    backdropFilter: "blur(12px)",
                    transform: isActive
                      ? "translateY(-4px) scale(1.02)"
                      : "translateY(0) scale(1)",
                  }}
                >
                  {isActive && (
                    <div
                      className="absolute inset-0 pointer-events-none rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${accent.text}12 0%, transparent 60%)`,
                      }}
                    />
                  )}
                  {isActive && (
                    <div
                      className="absolute top-3 right-3 w-2 h-2 rounded-full animate-pulse"
                      style={{
                        background: accent.text,
                        boxShadow: `0 0 8px ${accent.glow}`,
                      }}
                    />
                  )}

                  <div>
                    <span
                      className="block text-[14px] font-extrabold tracking-tight mb-0.5"
                      style={{ color: isActive ? accent.text : "rgba(248,250,252,0.9)" }}
                    >
                      {day.dayName}
                    </span>
                    <span className="block text-[10px] font-mono text-white/40">
                      {formatDate(day.date)}
                    </span>
                  </div>

                  <div className="flex flex-col items-start gap-1.5 my-2">
                    <div
                      className="flex items-center justify-center rounded-xl transition-all duration-300"
                      style={{
                        width: 52,
                        height: 52,
                        background: isActive ? accent.pill : "rgba(255,255,255,0.06)",
                        border: `1px solid ${
                          isActive ? `${accent.text}44` : "rgba(255,255,255,0.08)"
                        }`,
                        boxShadow: isActive ? `0 0 16px ${accent.glow}` : "none",
                      }}
                    >
                      {getDayIcon(day.weatherCode, "w-7 h-7")}
                    </div>
                    <span className="text-[11px] font-medium text-white/60 leading-tight line-clamp-2">
                      {isHeatwave ? "Extreme Heat" : day.condition}
                    </span>
                  </div>

                  <div
                    className="flex flex-col gap-1.5"
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.1)",
                      paddingTop: 8,
                    }}
                  >
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="text-[22px] font-black leading-none"
                        style={{
                          color: "white",
                          textShadow: isActive ? `0 0 10px ${accent.glow}` : "none",
                        }}
                      >
                        {day.tempMax}°
                      </span>
                      <span className="text-[12px] font-medium text-white/45">{day.tempMin}°</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${maxBar}%`,
                          background: `linear-gradient(90deg, ${accent.text}88, ${accent.text})`,
                          boxShadow: isActive ? `0 0 6px ${accent.glow}` : "none",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected Day Info Bar */}
      {daily[selectedIndex] && (
        <div
          className="mt-4 mx-1 flex flex-wrap items-center gap-3 px-5 py-3 rounded-2xl"
          style={{
            background: "rgba(10,18,36,0.5)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-center gap-2 text-xs font-medium text-white/70">
            {getDayIcon(daily[selectedIndex].weatherCode, "w-4 h-4")}
            <span className="font-bold text-white/90">{daily[selectedIndex].dayName}</span>
            <span className="text-white/40">·</span>
            <span>{daily[selectedIndex].condition}</span>
          </div>
          <div className="ml-auto flex items-center gap-4 text-xs">
            <span className="font-semibold text-white/80">
              High {daily[selectedIndex].tempMax}°
            </span>
            <span className="font-semibold text-white/80">
              Low {daily[selectedIndex].tempMin}°
            </span>
          </div>
        </div>
      )}
    </div>
  );
}