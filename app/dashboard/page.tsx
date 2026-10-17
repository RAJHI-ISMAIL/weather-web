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
      {/* Sunny Theme: Full-screen video background */}
      {currentThemeId === "sunny" && (
        <>
          <video
            key="sunny-bg"
            autoPlay
            muted
            loop
            playsInline
            className="fixed inset-0 w-full h-full object-cover -z-20 pointer-events-none"
            src="/sunny-bg.mp4"
          />
          {/* Vignette: darken edges so center video is vivid, content readable */}
          <div className="fixed inset-0 -z-10 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(255,255,255,0.18) 65%, rgba(255,255,255,0.55) 100%),
                           linear-gradient(to bottom, rgba(14,165,233,0.08) 0%, transparent 40%, rgba(255,255,255,0.35) 100%)`
            }}
          />
          {/* Animated golden sun-shimmer ring */}
          <div
            className="fixed pointer-events-none -z-10 hidden lg:block"
            style={{
              top: '8%',
              right: '8%',
              width: 260,
              height: 260,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(251,191,36,0.55) 0%, rgba(251,191,36,0.18) 45%, transparent 70%)',
              animation: 'sun-pulse 4s ease-in-out infinite',
              filter: 'blur(2px)',
            }}
          />
          <style>{`
            @keyframes sun-pulse {
              0%, 100% { transform: scale(1); opacity: 0.8; }
              50% { transform: scale(1.12); opacity: 1; }
            }
          `}</style>
        </>
      )}

      {/* Heatwave Theme: Full-screen video background */}
      {currentThemeId === "heatwave" && (
        <>
          <video
            key="heatwave-bg"
            autoPlay
            muted
            loop
            playsInline
            className="fixed inset-0 w-full h-full object-cover -z-20 pointer-events-none"
            src="/heatwave-bg.mp4"
          />
          {/* Warm vignette: keeps center video vivid while keeping white/glass cards and text readable */}
          <div
            className="fixed inset-0 -z-10 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 40%, transparent 25%, rgba(255,247,237,0.2) 60%, rgba(255,237,213,0.5) 100%),
                           linear-gradient(to bottom, rgba(234,88,12,0.06) 0%, transparent 35%, rgba(255,237,213,0.35) 100%)`
            }}
          />
          {/* Heat haze thermal glow orb */}
          <div
            className="fixed pointer-events-none -z-10 hidden lg:block"
            style={{
              top: '6%',
              right: '8%',
              width: 280,
              height: 280,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(249,115,22,0.45) 0%, rgba(234,88,12,0.18) 45%, transparent 70%)',
              animation: 'heat-pulse 3.8s ease-in-out infinite',
              filter: 'blur(3px)',
            }}
          />
          <style>{`
            @keyframes heat-pulse {
              0%, 100% { transform: scale(1); opacity: 0.75; }
              50% { transform: scale(1.15); opacity: 1; }
            }
          `}</style>
        </>
      )}

      {/* Cloudy / Overcast Theme: Soft misty atmospheric cloud layers */}
      {currentThemeId === "cloudy" && (
        <>
          <div
            className="fixed inset-0 -z-20 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 20%, rgba(56, 189, 248, 0.15) 0%, transparent 60%),
                           radial-gradient(ellipse at 80% 60%, rgba(148, 163, 184, 0.12) 0%, transparent 50%),
                           linear-gradient(to bottom, #0F1E33 0%, #0A1424 50%, #050B14 100%)`,
            }}
          />
          {/* Drifting soft overcast cloud haze */}
          <div
            className="fixed pointer-events-none -z-10"
            style={{
              top: "-10%",
              left: "10%",
              width: "80vw",
              height: "450px",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(148, 163, 184, 0.14) 0%, rgba(56, 189, 248, 0.08) 45%, transparent 75%)",
              filter: "blur(60px)",
              animation: "cloud-drift 18s ease-in-out infinite alternate",
            }}
          />
          <style>{`
            @keyframes cloud-drift {
              0% { transform: translate(-30px, 0) scale(1); }
              100% { transform: translate(30px, 15px) scale(1.08); }
            }
          `}</style>
        </>
      )}

      <Navbar activeTab="Forecast" theme={theme} />

      {/* Rainy Dark Theme: Realistic Falling Rain Simulation */}
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
          key={`${initialLocation.name}-${initialLocation.latitude}-${initialLocation.longitude}`}
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
