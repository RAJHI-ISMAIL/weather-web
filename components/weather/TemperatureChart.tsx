"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Flame } from "lucide-react";
import { HourlyPoint, DailyForecastDay } from "@/types/weather";
import { ThemeTokens } from "@/lib/theme";

interface TemperatureChartProps {
  hourly: HourlyPoint[];
  daily: DailyForecastDay[];
  theme: ThemeTokens;
}

export function TemperatureChart({ hourly, daily, theme }: TemperatureChartProps) {
  const [filter, setFilter] = useState<"Today" | "Week" | "Month">("Today");

  const getChartData = () => {
    if (filter === "Today") {
      return hourly.map((h) => ({
        label: h.hourLabel,
        temp: h.temperature,
      }));
    }

    if (filter === "Week") {
      return daily.map((d) => ({
        label: d.dayName,
        temp: d.tempMax,
      }));
    }

    return daily.concat(daily).slice(0, 12).map((d, i) => ({
      label: `Day ${i * 2 + 1}`,
      temp: d.tempMax + ((i % 3) - 1),
    }));
  };

  const data = getChartData();

  return (
    <div
      className={`w-full rounded-3xl p-6 sm:p-7 ${theme.cardBg} ${theme.cardBorder} flex flex-col justify-between transition-colors duration-500`}
    >
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className={`flex items-center gap-2.5 font-bold text-base sm:text-lg ${theme.cardTextPrimary}`}>
          <div
            className="p-1.5 rounded-full"
            style={{
              backgroundColor: `${theme.accentColor}20`,
              color: theme.accentColor,
            }}
          >
            {theme.id === "heatwave" ? <Flame className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
          </div>
          <span>Temperature Trend</span>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center p-1 rounded-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-xs font-semibold">
          {(["Today", "Week", "Month"] as const).map((tab) => {
            const active = filter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                style={
                  active
                    ? {
                        backgroundColor: theme.accentColor,
                        color: theme.isDark ? "#050B14" : "#ffffff",
                      }
                    : {}
                }
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  active ? "shadow-md" : `${theme.cardTextSecondary} hover:opacity-100`
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-60 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="themeTempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.chartStroke} stopOpacity={0.45} />
                <stop offset="95%" stopColor={theme.chartStroke} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="label"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: theme.isDark ? "#1E293B" : "#E2E8F0" }}
            />

            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}°`}
              domain={["auto", "auto"]}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div
                      className={`px-3 py-1.5 rounded-xl border shadow-xl text-xs backdrop-blur-md ${
                        theme.isDark
                          ? "bg-[#050B14]/90 border-cyan-500/50 text-white"
                          : "bg-white/95 border-slate-200 text-slate-800"
                      }`}
                    >
                      <div className="opacity-70 font-mono">{payload[0].payload.label}</div>
                      <div
                        className="font-bold text-sm"
                        style={{ color: theme.accentColor }}
                      >
                        {payload[0].value}°C
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="temp"
              stroke={theme.chartStroke}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#themeTempGradient)"
              dot={{ r: 4, fill: theme.chartStroke, stroke: theme.isDark ? "#050B14" : "#ffffff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: theme.chartStroke, stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
