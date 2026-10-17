import { WeatherAlert } from "@/types/weather";

export type ThemeId = "sunny" | "cloudy" | "rainy" | "heatwave";

export interface ThemeTokens {
  id: ThemeId;
  name: string;
  isDark: boolean;
  pageBackground: string;
  navbarBg: string;
  navbarBorder: string;
  navbarText: string;
  heroTagColor: string;
  heroTitleColor: string;
  heroSubtextColor: string;
  heroTempColor: string;
  heroUnitColor: string;
  forecastCardBg: (isActive: boolean) => string;
  forecastCardBorder: (isActive: boolean) => string;
  forecastCardText: string;
  cardBg: string;
  cardBorder: string;
  cardTextPrimary: string;
  cardTextSecondary: string;
  chartStroke: string;
  chartGradient: string;
  accentColor: string;
}

export const THEMES: Record<ThemeId, ThemeTokens> = {
  sunny: {
    id: "sunny",
    name: "Sunny (Light)",
    isDark: false,
    pageBackground: "bg-transparent",
    navbarBg: "bg-white/20 backdrop-blur-xl",
    navbarBorder: "border-white/25",
    navbarText: "text-[#0A1628]",
    heroTagColor: "text-[#0284C7]",
    heroTitleColor: "text-[#0A1628]",
    heroSubtextColor: "text-slate-700",
    heroTempColor: "text-[#0A1628]",
    heroUnitColor: "text-[#0284C7]",
    forecastCardBg: (isActive) =>
      isActive
        ? "bg-white/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(255,255,255,0.25)]"
        : "bg-white/20 backdrop-blur-md hover:bg-white/35",
    forecastCardBorder: (isActive) =>
      isActive
        ? "border border-white/70 ring-1 ring-sky-300/40"
        : "border border-white/35 hover:border-white/55",
    forecastCardText: "text-[#0A1628]",
    cardBg: "bg-white/30 backdrop-blur-xl shadow-[0_12px_40px_rgba(255,255,255,0.15)]",
    cardBorder: "border border-white/30",
    cardTextPrimary: "text-[#0A1628]",
    cardTextSecondary: "text-slate-600",
    chartStroke: "#0EA5E9",
    chartGradient: "#0EA5E9",
    accentColor: "#0EA5E9",
  },

  cloudy: {
    id: "cloudy",
    name: "Cloudy & Overcast (Atmospheric)",
    isDark: true,
    pageBackground: "bg-[#0A1220]",
    navbarBg: "bg-[#0F1E33]/60 backdrop-blur-xl",
    navbarBorder: "border-slate-700/50",
    navbarText: "text-slate-100",
    heroTagColor: "text-sky-300",
    heroTitleColor: "text-white",
    heroSubtextColor: "text-slate-300",
    heroTempColor: "text-white",
    heroUnitColor: "text-sky-300",
    forecastCardBg: (isActive) =>
      isActive
        ? "bg-[#13233D] backdrop-blur-xl shadow-[0_0_25px_rgba(56,189,248,0.2)]"
        : "bg-[#0E1A2E]/60 backdrop-blur-md hover:bg-[#13233D]/70",
    forecastCardBorder: (isActive) =>
      isActive
        ? "border-2 border-sky-400/80"
        : "border border-slate-700/40 hover:border-slate-600/70",
    forecastCardText: "text-slate-100",
    cardBg: "bg-[#0E1A2E]/70 backdrop-blur-xl shadow-[0_14px_40px_rgba(0,0,0,0.5)]",
    cardBorder: "border border-slate-700/40",
    cardTextPrimary: "text-white",
    cardTextSecondary: "text-slate-300",
    chartStroke: "#38BDF8",
    chartGradient: "#0284C7",
    accentColor: "#38BDF8",
  },

  rainy: {
    id: "rainy",
    name: "Rainy Dark (Glass)",
    isDark: true,
    pageBackground: "bg-[#050B14]",
    navbarBg: "bg-white/[0.06] backdrop-blur-xl",
    navbarBorder: "border-white/10",
    navbarText: "text-white",
    heroTagColor: "text-[#22D3EE]",
    heroTitleColor: "text-white",
    heroSubtextColor: "text-slate-300",
    heroTempColor: "text-white",
    heroUnitColor: "text-[#22D3EE]",
    forecastCardBg: (isActive) =>
      isActive ? "bg-[#0A1628] shadow-[0_0_25px_rgba(34,211,238,0.25)]" : "bg-[#0A1628]/50 hover:bg-[#0A1628]/80",
    forecastCardBorder: (isActive) =>
      isActive ? "border-2 border-[#22D3EE]" : "border border-white/10 hover:border-white/20",
    forecastCardText: "text-white",
    cardBg: "bg-[#0A1628]/70 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.4)]",
    cardBorder: "border border-white/10",
    cardTextPrimary: "text-white",
    cardTextSecondary: "text-slate-400",
    chartStroke: "#22D3EE",
    chartGradient: "#22D3EE",
    accentColor: "#22D3EE",
  },

  heatwave: {
    id: "heatwave",
    name: "Extreme Heat (Alert)",
    isDark: false,
    pageBackground: "bg-transparent",
    navbarBg: "bg-white/20 backdrop-blur-xl",
    navbarBorder: "border-white/25",
    navbarText: "text-[#0A1628]",
    heroTagColor: "text-[#EA580C]",
    heroTitleColor: "text-[#0A1628]",
    heroSubtextColor: "text-slate-700",
    heroTempColor: "text-[#0A1628]",
    heroUnitColor: "text-[#EA580C]",
    forecastCardBg: (isActive) =>
      isActive
        ? "bg-amber-500/35 backdrop-blur-xl shadow-[0_8px_32px_rgba(245,158,11,0.25)]"
        : "bg-white/20 backdrop-blur-md hover:bg-white/35",
    forecastCardBorder: (isActive) =>
      isActive
        ? "border border-amber-300/80 ring-1 ring-amber-400/40"
        : "border border-white/35 hover:border-white/55",
    forecastCardText: "text-[#0A1628]",
    cardBg: "bg-white/30 backdrop-blur-xl shadow-[0_12px_40px_rgba(245,158,11,0.12)]",
    cardBorder: "border border-white/30",
    cardTextPrimary: "text-[#0A1628]",
    cardTextSecondary: "text-slate-600",
    chartStroke: "#EA580C",
    chartGradient: "#F97316",
    accentColor: "#EA580C",
  },
};

/**
 * Determine dynamic theme based on meteorological conditions.
 *
 * Rules:
 * - Extreme heat condition (temp >= 35°C or active heat alert) -> 'heatwave'
 * - Night condition (!isDay) -> 'rainy' (night glassmorphism)
 * - Precipitation & storms (weatherCode 50-99) -> 'rainy'
 * - Overcast, cloudy, foggy (weatherCode 2, 3, 45, 48) -> 'cloudy' (NOT sunny!)
 * - Clear skies & mainly clear daylight (weatherCode 0, 1) -> 'sunny'
 */
export function getAutoTheme(
  weatherCode: number,
  temperature: number,
  isDay: boolean,
  alerts?: WeatherAlert[]
): ThemeId {
  // 1. Extreme heat condition
  if (temperature >= 35 || (alerts && alerts.some((a) => a.severity === "extreme"))) {
    return "heatwave";
  }

  // 2. Nighttime: always night / dark glassmorphism
  if (!isDay) {
    return "rainy";
  }

  // 3. Precipitation: drizzle, rain, snow, showers, thunderstorms (WMO 50 - 99)
  if (weatherCode >= 50 && weatherCode <= 99) {
    return "rainy";
  }

  // 4. Overcast (3), Fog (45, 48), or Partly Cloudy (2)
  if (weatherCode === 3 || weatherCode === 2 || weatherCode === 45 || weatherCode === 48) {
    return "cloudy";
  }

  // 5. Clear sky (0) or mainly clear (1)
  if (weatherCode === 0 || weatherCode === 1) {
    return "sunny";
  }

  // Safe fallback: cloudy if daylight
  return "cloudy";
}
