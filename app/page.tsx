"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navigation/Navbar";
import { GlobeScene } from "@/components/globe/GlobeScene";
import { UseMyLocationButton } from "@/components/location/UseMyLocationButton";
import { LocationSearch } from "@/components/location/LocationSearch";
import { LocationData } from "@/types/location";
import { WeatherData } from "@/types/weather";
import { fetchWeatherData } from "@/lib/api/weather";
import { reverseGeocode } from "@/lib/api/geocoding";
import { useRouter } from "next/navigation";
import { Globe, ChevronRight, X, Compass, Radio, Clock, Loader2, Navigation, AlertCircle } from "lucide-react";
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
  const [isLocating, setIsLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);
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

  // Check URL query parameters to open 3D Explorer if requested
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("explore") === "true") {
        setIsExplorerOpen(true);
      }
    }
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
    setIsExplorerOpen(false);
    router.push(
      `/dashboard?lat=${loc.latitude}&lon=${loc.longitude}&city=${encodeURIComponent(
        loc.name
      )}&country=${encodeURIComponent(loc.country || "")}`
    );
  };

  // 1. "Use My Location" handler: Trigger GPS, screen loading, reverse-geocode & navigate to forecast
  const handleUseMyLocation = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setLocateError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocateError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const loc = await reverseGeocode(latitude, longitude);
          setCurrentLocation(loc);
          handleGetForecast(loc);
        } catch {
          const fallbackLoc: LocationData = {
            name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
            latitude,
            longitude,
          };
          setCurrentLocation(fallbackLoc);
          handleGetForecast(fallbackLoc);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocateError("Location access was denied. Please enable location permissions in your browser or explore via 3D Climate.");
        } else {
          setLocateError("Unable to retrieve your location. Please check your network or try again.");
        }
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="relative min-h-screen bg-[#050B14] text-[#F8FAFC] overflow-x-hidden flex flex-col font-sans selection:bg-cyan-500/30">
      
      {/* 1. Floating Pill Navigation */}
      <Navbar
        activeTab={isExplorerOpen ? "Globe" : "Discover"}
        onTabChange={(tab) => {
          if (tab === "Discover") {
            setIsExplorerOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (tab === "Forecast") {
            handleGetForecast();
          } else if (tab === "Globe") {
            setIsExplorerOpen(true);
          }
        }}
        onSelectLocation={(loc) => handleGetForecast(loc)}
      />

      {/* 2. Hero Section with 4K Earth Video Background & Text Animations */}
      <section className="relative z-10 w-full min-h-[85vh] lg:min-h-[92vh] flex flex-col justify-center pt-24 pb-16 px-4 sm:pt-28 sm:pb-20 sm:px-6 lg:px-12 overflow-hidden">
        
        {/* Full-bleed 4K Planet Earth Background Video */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <video
            src="/earth-spin.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center lg:object-[65%_center] scale-105 hidden lg:block"
          />
          <video
            src="/earth-spin.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center scale-105 lg:hidden"
          />

          {/* Cinematic Vignettes & Contrast Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B14] via-[#050B14]/75 to-transparent lg:w-3/4" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-transparent to-[#050B14]/85" />
          <div className="absolute inset-0 bg-[#050B14]/25" />

          {/* Atmospheric Cyan Rim Light */}
          <div className="absolute top-1/4 right-1/4 w-[520px] h-[520px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none hidden lg:block" />
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white font-serif leading-[1.05] max-w-3xl drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
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

          {/* Dual Action Buttons: Use My Location & 3D Climate */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
            className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
          >
            {/* Button 1: Use My Location -> Screen Loading -> Forecast */}
            <button
              type="button"
              onClick={handleUseMyLocation}
              className="group relative flex items-center justify-between sm:justify-start gap-4 px-6 sm:px-7 py-4 rounded-2xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/20 hover:border-cyan-400/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.35)] backdrop-blur-xl transition-all duration-300 text-left cursor-pointer active:scale-95"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/30 transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <Navigation className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  GPS Telemetry
                </span>
                <span className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-200 transition-colors">
                  Use my location
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all ml-2" />
            </button>

            {/* Button 2: 3D Climate -> Opens 3D Earth Explorer with Search Bar & Manual 3D search */}
            <button
              type="button"
              onClick={() => setIsExplorerOpen(true)}
              className="group relative flex items-center justify-between sm:justify-start gap-4 px-6 sm:px-7 py-4 rounded-2xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/20 hover:border-emerald-400/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(52,211,153,0.35)] backdrop-blur-xl transition-all duration-300 text-left cursor-pointer active:scale-95"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/30 group-hover:rotate-12 transition-all duration-500 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                <Globe className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  Atmospheric Observatory
                </span>
                <span className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-200 transition-colors">
                  3D Climate
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all ml-2" />
            </button>
          </motion.div>

          {/* Telemetry Pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
            className="pt-2 flex flex-wrap items-center gap-3"
          >
            {/* Target telemetry pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Target: <strong className="text-white">{currentLocation.name}</strong></span>
              <span className="text-cyan-400 font-mono">
                ({currentLocation.latitude.toFixed(1)}°, {currentLocation.longitude.toFixed(1)}°)
              </span>
            </div>

            {/* Planetary UTC Clock */}
            {utcTime && (
              <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-xs font-mono text-slate-400">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{utcTime}</span>
              </div>
            )}
          </motion.div>

        </div>
      </section>


      {/* 5. Interactive 3D Earth & Climate Explorer Modal */}
      {isExplorerOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label="3D Climate Explorer"
          className="fixed inset-0 z-50 bg-[#050B14] stars-bg flex flex-col justify-between p-2 sm:p-4 lg:p-6 overflow-y-auto lg:overflow-hidden max-h-screen"
        >
          {/* Top Bar with Navbar & Close Button */}
          <div className="relative w-full flex items-center justify-between max-w-7xl mx-auto z-30">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-400">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm tracking-[0.18em] text-white uppercase block">
                  TEMPORA 3D CLIMATE EXPLORER
                </span>
                <span className="text-[10px] font-mono text-cyan-400 hidden sm:block">
                  Live Global Atmospheric Grid · Real-time Rendering
                </span>
              </div>
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

          {/* Centered Search Bar in 3D Climate */}
          <div className="relative z-30 w-full max-w-xl mx-auto my-2">
            <LocationSearch
              onSelectLocation={(loc) => {
                handleSelectLocation(loc);
              }}
              placeholder="Search city or location in 3D Earth..."
            />
          </div>

          {/* Central 3D Globe with Real Earth Rendering, Inertia Drag & Zoom */}
          <div className="relative z-20 flex-1 flex items-center justify-center my-2 w-full max-h-[50vh] sm:max-h-[62vh]">
            <GlobeScene
              selectedLocation={currentLocation}
              onSelectLocation={handleSelectLocation}
              onOpenForecast={(loc) => handleGetForecast(loc)}
              className="w-full h-full"
            />
          </div>

          {/* Bottom Controls: USE YOUR LOCATION, View Forecast & instructions */}
          <div className="relative z-30 flex flex-col items-center gap-3 pb-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <UseMyLocationButton onLocationFound={handleSelectLocation} />

              <button
                type="button"
                onClick={() => handleGetForecast(currentLocation)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-300 font-semibold text-xs sm:text-sm border border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>View {currentLocation.name} Forecast</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide flex items-center gap-2 text-center">
              <span>Search city above or drag to rotate Earth</span>
              <span className="text-cyan-400">•</span>
              <span>Pinch or scroll to zoom</span>
              <span className="text-cyan-400">•</span>
              <span>Click markers to view forecast</span>
            </p>
          </div>
        </motion.div>
      )}

      {/* Full-Screen Atmospheric Telemetry Geolocation Loading Screen */}
      <AnimatePresence>
        {isLocating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#040812]/92 backdrop-blur-2xl text-center"
          >
            {/* Ambient atmospheric glow */}
            <div className="absolute w-[450px] h-[450px] rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none -z-10" />

            <div className="relative flex flex-col items-center max-w-md mx-auto space-y-6">
              {/* Radar pulse radar ring */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                <span className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping" />
                <span className="absolute inset-3 rounded-full border border-cyan-400/50 animate-pulse" />
                <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-500/10 blur-md" />
                
                {/* Center Satellite / Navigation Icon */}
                <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-[#071324] border-2 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.6)]">
                  <Navigation className="w-8 h-8 text-cyan-400 animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>GPS Triangulation Active</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Detecting Your Location
                </h3>
                <p className="text-sm text-slate-300 font-normal leading-relaxed max-w-sm">
                  Connecting to atmospheric satellite network to retrieve your real-time local forecast...
                </p>
              </div>

              {/* Progress bar simulation */}
              <div className="w-64 h-1.5 rounded-full bg-white/10 overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 rounded-full"
                  initial={{ width: "10%" }}
                  animate={{ width: "95%" }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                />
              </div>

              <button
                type="button"
                onClick={() => setIsLocating(false)}
                className="text-xs text-slate-400 hover:text-white underline underline-offset-4 transition-colors pt-2 cursor-pointer"
              >
                Cancel and return
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Geolocation Error Alert Notification */}
      <AnimatePresence>
        {locateError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 z-50 max-w-lg mx-auto inset-x-4 p-4 rounded-2xl bg-rose-950/90 border border-rose-500/40 text-white shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{locateError}</span>
            </div>
            <button
              type="button"
              onClick={() => setLocateError(null)}
              className="p-1 hover:bg-white/10 rounded-full text-slate-300 hover:text-white shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
