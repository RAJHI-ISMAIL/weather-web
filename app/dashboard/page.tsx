"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navigation/Navbar";
import { WeatherDashboard } from "@/components/weather/WeatherDashboard";
import { WeatherLoading } from "@/components/weather/WeatherLoading";
import { LocationData } from "@/types/location";

function DashboardContent() {
  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const city = searchParams.get("city") || "Beverly Hills";
  const country = searchParams.get("country") || "USA";

  const initialLocation: LocationData = {
    name: city,
    country: country,
    latitude: lat ? parseFloat(lat) : 34.07,
    longitude: lon ? parseFloat(lon) : -118.4,
  };

  return (
    <div className="relative min-h-screen bg-[#050B14] text-[#F8FAFC] stars-bg flex flex-col pt-24 pb-16">
      <Navbar activeTab="Forecast" />

      {/* Atmospheric Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <main className="flex-1 w-full flex flex-col">
        <WeatherDashboard initialLocation={initialLocation} />
      </main>

      <footer className="w-full py-8 px-4 text-center text-xs text-slate-500 border-t border-white/5">
        TEMPORA Weather Dashboard · Real-time Open-Meteo Observations & Forecasts
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
