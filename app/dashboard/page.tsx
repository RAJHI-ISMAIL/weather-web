"use client";

import { Suspense, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navigation/Navbar";
import { WeatherDashboard } from "@/components/weather/WeatherDashboard";
import { WeatherLoading } from "@/components/weather/WeatherLoading";
import { LocationData } from "@/types/location";
import { THEMES, ThemeId } from "@/lib/theme";
import { RainEffect } from "@/components/ui/RainEffect";

function DashboardContent() {
  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const city = searchParams.get("city") || "Beverly Hills";
  const country = searchParams.get("country") || "USA";

  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>("rainy");

  const initialLocation: LocationData = {
    name: city,
    country: country,
    latitude: lat ? parseFloat(lat) : 34.07,
    longitude: lon ? parseFloat(lon) : -118.4,
  };

  const handleThemeChange = useCallback((newTheme: ThemeId) => {
    setCurrentThemeId(newTheme);
  }, []);

  const theme = THEMES[currentThemeId];

  return (
    <div
      className={`relative min-h-screen transition-colors duration-700 flex flex-col pt-24 pb-16 overflow-x-hidden ${theme.pageBackground} ${
        theme.isDark ? "text-[#F8FAFC] stars-bg" : "text-[#0A1628]"
      }`}
    >
      <Navbar activeTab="Forecast" theme={theme} />

      {/* Rainy Dark Theme Additions: Realistic Falling Rain Simulation */}
      {currentThemeId === "rainy" && <RainEffect intensity="medium" />}

      {/* Atmospheric Background Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[140px] pointer-events-none -z-10 transition-colors duration-700"
        style={{
          backgroundColor: `${theme.accentColor}18`,
        }}
      />

      <main className="relative z-20 flex-1 w-full flex flex-col">
        <WeatherDashboard
          initialLocation={initialLocation}
          onThemeChange={handleThemeChange}
        />
      </main>

      <footer
        className={`relative z-20 w-full py-8 px-4 text-center text-xs border-t transition-colors duration-500 ${
          theme.isDark ? "text-slate-500 border-white/5" : "text-slate-400 border-slate-200/60"
        }`}
      >
        TEMPORA Weather Dashboard · Real-time Dynamic Atmospheric Themes
      </footer>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<WeatherLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
