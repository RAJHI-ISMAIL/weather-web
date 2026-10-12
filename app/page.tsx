"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navigation/Navbar";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";
import { GlobePlaceholder } from "@/components/globe/GlobePlaceholder";
import { UseMyLocationButton } from "@/components/location/UseMyLocationButton";
import { LocationSearch } from "@/components/location/LocationSearch";
import { LocationData } from "@/types/location";
import { WeatherData } from "@/types/weather";
import { fetchWeatherData } from "@/lib/api/weather";
import { useRouter } from "next/navigation";
import { Globe, ChevronRight, X, Compass, Radio, Activity, Clock } from "lucide-react";
import Shuffle from "@/components/ui/Shuffle";

export default function Home() {
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState<LocationData>({
    name: "Zhengzhou",
    country: "China",
    latitude: 34.75,
    longitude: 113.66,
  });

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [utcTime, setUtcTime] = useState<string>("");

  // Live UTC Planetary Clock
  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + " UTC");
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch real-time weather data for current location
  useEffect(() => {
    let isMounted = true;
    async function loadWeather() {
      const data = await fetchWeatherData(
        currentLocation.latitude,
        currentLocation.longitude,
        currentLocation.name,
        currentLocation.country
      );
      if (isMounted && data) {
        setWeatherData(data);
      }
    }
    loadWeather();
    return () => {
      isMounted = false;
    };
  }, [currentLocation]);

  const handleSelectLocation = (loc: LocationData) => {
    setCurrentLocation(loc);
  };

  const handleGetForecast = (targetLoc?: LocationData) => {
    const loc = targetLoc || currentLocation;
    router.push(
      `/dashboard?lat=${loc.latitude}&lon=${loc.longitude}&city=${encodeURIComponent(
        loc.name
      )}&country=${encodeURIComponent(loc.country || "")}`
    );
  };

  return (
    <div className="relative min-h-screen bg-[#050B14] text-[#F8FAFC] overflow-x-hidden flex flex-col font-sans selection:bg-cyan-500/30">
      
      {/* 1. Floating Pill Navigation */}
      <Navbar
        onTabChange={(tab) => {
          if (tab === "Discover") setIsExplorerOpen(false);
          if (tab === "Forecast") handleGetForecast();
          if (tab === "Climate") setIsExplorerOpen(true);
        }}
        onSelectLocation={(loc) => handleGetForecast(loc)}
      />

      {/* 2. Hero Section with 4K Earth Video Background & Text Animations */}
      <section className="relative z-10 w-full min-h-[85vh] lg:min-h-[92vh] flex flex-col justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-12 overflow-hidden">
        
        {/* Full-bleed 4K Planet Earth Background Video */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <video
            src="/earth-spin.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center lg:object-[65%_center] scale-105"
          />

          {/* Cinematic Vignettes & Contrast Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B14] via-[#050B14]/75 to-transparent lg:w-3/4" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-transparent to-[#050B14]/85" />
          <div className="absolute inset-0 bg-[#050B14]/25" />

          {/* Atmospheric Cyan Rim Light */}
          <div className="absolute top-1/4 right-1/4 w-[520px] h-[520px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        </div>

        {/* Hero Content Container */}
        <div className="max-w-7xl mx-auto w-full flex flex-col justify-center items-start z-10 space-y-6">
          
          {/* Live Orbit Badge with Animation */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.06] border border-white/15 text-cyan-400 text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-[0_0_25px_rgba(34,211,238,0.25)]"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>LIVE WEATHER · 4K GLOBAL VIEW</span>
          </motion.div>

          {/* Main Headline with Stagger & Shimmer */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="space-y-1"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white font-serif leading-[1.05] max-w-3xl drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
              <Shuffle
                text="Feel the world"
                tag="span"
                className="block"
                shuffleDirection="right"
                duration={0.4}
                animationMode="evenodd"
                shuffleTimes={2}
                ease="power3.out"
                stagger={0.03}
                threshold={0.1}
                triggerOnce={true}
                triggerOnHover={true}
                textAlign="left"
              />
              <Shuffle
                text="around you."
                tag="span"
                className="block text-shimmer italic font-serif"
                shuffleDirection="right"
                duration={0.4}
                animationMode="evenodd"
                shuffleTimes={2}
                ease="power3.out"
                stagger={0.03}
                threshold={0.1}
                triggerOnce={true}
                triggerOnHover={true}
                textAlign="left"
              />
            </h1>
          </motion.div>

          {/* Subtitle with Soft Fade */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl text-slate-200 font-normal max-w-xl leading-relaxed drop-shadow-md"
          >
            Explore real-time conditions and forecasts across a living, rotating Earth in 4K resolution.
          </motion.p>

          {/* Action Button & Telemetry Pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
            className="pt-2 flex flex-wrap items-center gap-4"
          >
            <button
              type="button"
              onClick={() => setIsExplorerOpen(true)}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.18] text-white font-semibold text-sm md:text-base border border-white/25 hover:border-cyan-400/80 shadow-[0_0_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_35px_rgba(34,211,238,0.45)] backdrop-blur-md transition-all duration-300 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95"
            >
              <span>Explore the globe</span>
              <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1.5 transition-transform" />
            </button>

            {/* Target telemetry pill */}
            <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Target: <strong className="text-white">{currentLocation.name}</strong></span>
              <span className="text-cyan-400 font-mono">
                ({currentLocation.latitude.toFixed(1)}°, {currentLocation.longitude.toFixed(1)}°)
              </span>
            </div>

            {/* Planetary UTC Clock */}
            {utcTime && (
              <div className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-xs font-mono text-slate-400">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{utcTime}</span>
              </div>
            )}
          </motion.div>

        </div>
      </section>

      {/* 3. Floating Search & Quick Weather Bar */}
      <div className="relative z-30 -mt-10 sm:-mt-12 md:-mt-14 mb-20 sm:mb-28">
        <HomeSearchBar
          currentLocation={currentLocation}
          weatherData={weatherData}
          onSelectLocation={handleSelectLocation}
          onGetForecast={handleGetForecast}
        />
      </div>

      {/* 5. Interactive 3D Earth Explorer Modal */}
      {isExplorerOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label="Interactive 3D Earth Explorer"
          className="fixed inset-0 z-50 bg-[#050B14] stars-bg flex flex-col justify-between p-4 sm:p-6 overflow-hidden"
        >
          {/* Top Bar with Navbar & Close Button */}
          <div className="relative w-full flex items-center justify-between max-w-7xl mx-auto z-30">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-400">
                <Globe className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm tracking-[0.18em] text-white uppercase">
                TEMPORA EXPLORER
              </span>
            </div>

            {/* Close Explorer Button */}
            <button
              type="button"
              onClick={() => setIsExplorerOpen(false)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer hover:border-cyan-400/50"
            >
              <X className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>

          {/* Centered Search Bar */}
          <div className="relative z-30 w-full max-w-xl mx-auto my-2">
            <LocationSearch onSelectLocation={handleSelectLocation} />
          </div>

          {/* Central Globe with Zoom & Drag Controls */}
          <div className="relative z-20 flex-1 flex items-center justify-center my-4">
            <GlobePlaceholder selectedLocation={currentLocation} />
          </div>

          {/* Bottom Neon "USE YOUR LOCATION" button & instructions */}
          <div className="relative z-30 flex flex-col items-center gap-3 pb-6">
            <UseMyLocationButton onLocationFound={handleSelectLocation} />

            <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide flex items-center gap-2 text-center">
              <span>Drag to rotate Earth</span>
              <span className="text-cyan-400">•</span>
              <span>Click pin to target destination</span>
            </p>
          </div>
        </motion.div>
      )}

      {/* 6. Footer */}
      <footer className="relative z-10 w-full py-8 px-4 bg-[#050B14] border-t border-white/10 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-widest text-white uppercase font-sans">TEMPORA</span>
            <span>—</span>
            <span>Your world. In every forecast.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" /> Open-Meteo Weather API
            </span>
            <span>•</span>
            <span>Next.js App Router</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
