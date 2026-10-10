"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { HourlyPoint, DailyForecastDay } from "@/types/weather";

interface TemperatureChartProps {
  hourly: HourlyPoint[];
  daily: DailyForecastDay[];
}

export function TemperatureChart({ hourly, daily }: TemperatureChartProps) {
  const [filter, setFilter] = useState<"Today" | "Week" | "Month">("Today");

  // Format data based on active tab
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

    // Month (simulated trajectory around weekly trend)
    return daily.concat(daily).slice(0, 12).map((d, i) => ({
      label: `Day ${i * 2 + 1}`,
      temp: d.tempMax + ((i % 3) - 1),
    }));
  };

  const data = getChartData();

  return (
    <div className="w-full rounded-3xl p-6 sm:p-7 bg-[#0A1628]/70 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl flex flex-col justify-between">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg">
          <div className="p-1.5 rounded-full bg-cyan-500/20 text-[#22D3EE]">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span>Temperature Trend</span>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center p-1 rounded-full bg-black/40 border border-white/10 text-xs font-semibold">
          {(["Today", "Week", "Month"] as const).map((tab) => {
            const active = filter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  active
                    ? "bg-[#22D3EE] text-[#050B14] shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                    : "text-slate-400 hover:text-white"
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
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="label"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#1E293B" }}
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
                    <div className="px-3 py-1.5 rounded-xl bg-[#050B14]/90 border border-[#22D3EE]/50 text-white text-xs shadow-xl backdrop-blur-md">
                      <div className="text-slate-400 font-mono">{payload[0].payload.label}</div>
                      <div className="font-bold text-[#22D3EE] text-sm">
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
              stroke="#22D3EE"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#tempGradient)"
              dot={{ r: 4, fill: "#22D3EE", stroke: "#050B14", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#67E8F9", stroke: "#22D3EE", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
