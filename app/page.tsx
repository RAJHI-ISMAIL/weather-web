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
import {
  Globe,
  ChevronRight,
  X,
  Compass,
  Radio,
  Clock,
  Loader2,
  Navigation,
  MapPin,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Shuffle from "@/components/ui/Shuffle";
import SpecularButton from "@/components/ui/SpecularButton";
import { AtmosphericIntro } from "@/components/ui/AtmosphericIntro";
import { WeatherMascot } from "@/components/ui/WeatherMascot";

// ─── GPS Permission Modal ─────────────────────────────────────────────────────
function GpsPermissionModal({ onRequest, onCancel }: { onRequest: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      style={{ background: "rgba(4,8,18,0.88)", backdropFilter: "blur(20px)" }}
    >
      <div
        className="absolute w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.18) 0%, transparent 70%)" }}
      />

      <motion.div
        initial={{ scale: 0.88, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.88, y: 24 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="relative max-w-md w-full flex flex-col items-center text-center gap-6 rounded-3xl p-8 sm:p-10"
        style={{
          background: "linear-gradient(160deg, rgba(13,22,40,0.98) 0%, rgba(7,14,28,0.98) 100%)",
          border: "1.5px solid rgba(34,211,238,0.25)",
          boxShadow:
            "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-30"
            style={{ background: "rgba(34,211,238,0.4)", transform: "scale(1.3)" }}
          />
          <div
            className="relative flex items-center justify-center w-20 h-20 rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(34,211,238,0.2), rgba(56,189,248,0.1))",
              border: "2px solid rgba(34,211,238,0.5)",
              boxShadow: "0 0 40px rgba(34,211,238,0.35)",
            }}
          >
            <MapPin className="w-9 h-9 text-cyan-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Enable GPS to continue
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed max-w-xs mx-auto">
            We need access to your location to pull your real-time local forecast.
            Click{" "}
            <strong className="text-cyan-300">Allow</strong>{" "}
            when your browser asks.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            type="button"
            onClick={onRequest}
            className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-bold text-sm text-white transition-all duration-200 cursor-pointer hover:brightness-110 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #06b6d4, #0284c7)",
              boxShadow: "0 0 30px rgba(6,182,212,0.45)",
            }}
          >
            <Navigation className="w-4 h-4" />
            Activate GPS
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3.5 px-6 rounded-2xl font-semibold text-sm text-slate-300 hover:text-white transition-all duration-200 cursor-pointer hover:bg-white/10"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            Not now
          </button>
        </div>

        <p className="text-[11px] text-slate-500 leading-tight">
          Your location is only used for weather data and is never stored.
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── GPS Locating Screen ──────────────────────────────────────────────────────
function GpsLocatingScreen({ onCancel }: { onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-6 text-center"
      style={{ background: "rgba(4,8,18,0.92)", backdropFilter: "blur(24px)" }}
    >
      <div
        className="absolute w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)" }}
      />
      <div className="relative flex flex-col items-center max-w-sm mx-auto space-y-6">
        {/* 3D GPS Gyroscope Orbit & Scanning Weather Mascot */}
        <div className="relative">
          <WeatherMascot mode="gps" size="md" />
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-cyan-950/90 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.4)] backdrop-blur-md">
            SATELLITE BEACON SCAN
          </span>
        </div>

        <div className="space-y-2">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest"
            style={{
              background: "rgba(34,211,238,0.1)",
              border: "1px solid rgba(34,211,238,0.3)",
              color: "#22d3ee",
            }}
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            GPS 3D Triangulation Active
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Locking onto your coordinates…
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed max-w-xs mx-auto">
            Interrogating orbital constellation to calibrate your local atmospheric telemetry.
          </p>
        </div>

        <div
          className="w-64 h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          <motion.div
            className="h-full rounded-full"
            initial={{ width: "8%" }}
            animate={{ width: "94%" }}
            transition={{ duration: 5, ease: "easeInOut" }}
            style={{ background: "linear-gradient(90deg, #22d3ee, #38bdf8, #6366f1)" }}
          />
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
        >
          Cancel and return
        </button>
      </div>
    </motion.div>
  );
}

// ─── GPS Success Popup ────────────────────────────────────────────────────────
function GpsSuccessPopup({ cityName }: { cityName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-6"
      style={{ background: "rgba(4,8,18,0.85)", backdropFilter: "blur(20px)" }}
    >
      <div
        className="absolute w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(52,211,153,0.22) 0%, transparent 70%)" }}
      />

      <motion.div
        initial={{ scale: 0.75, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.75, y: 30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative max-w-sm w-full flex flex-col items-center text-center gap-4 rounded-3xl p-8 sm:p-9"
        style={{
          background: "linear-gradient(160deg, rgba(5,30,20,0.98) 0%, rgba(5,20,15,0.98) 100%)",
          border: "1.5px solid rgba(52,211,153,0.35)",
          boxShadow:
            "0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(52,211,153,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Celebratory Mascot */}
        <div className="relative">
          <WeatherMascot mode="success" size="md" />
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-emerald-950/90 text-emerald-300 border border-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.4)] backdrop-blur-md">
            COORDINATES LOCKED
          </span>
        </div>

        <div className="space-y-1.5 pt-1">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-2xl font-extrabold text-white tracking-tight"
          >
            Location Confirmed!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-slate-300 text-sm leading-relaxed"
          >
            You&apos;re in <strong className="text-emerald-300">{cityName}</strong>.
            <br />
            Synchronizing live atmospheric forecast…
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-1.5"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
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
  const [showIntro, setShowIntro] = useState(false);

  // GPS state machine: idle | permission | locating | success | error
  const [gpsState, setGpsState] = useState<"idle" | "permission" | "locating" | "success" | "error">("idle");
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [foundLocation, setFoundLocation] = useState<LocationData | null>(null);

  const [utcTime, setUtcTime] = useState<string>("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + " UTC");
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("explore") === "true") setIsExplorerOpen(true);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    async function load() {
      const data = await fetchWeatherData(
        currentLocation.latitude,
        currentLocation.longitude,
        currentLocation.name,
        currentLocation.country
      );
      if (alive && data) setWeatherData(data);
    }
    load();
    return () => { alive = false; };
  }, [currentLocation]);

  const handleSelectLocation = (loc: LocationData) => setCurrentLocation(loc);

  const navigateToForecast = (loc: LocationData) => {
    setIsExplorerOpen(false);
    router.push(
      `/dashboard?lat=${loc.latitude}&lon=${loc.longitude}&city=${encodeURIComponent(loc.name)}&country=${encodeURIComponent(loc.country || "")}`
    );
  };

  const handleGetForecast = (targetLoc?: LocationData) => {
    navigateToForecast(targetLoc || currentLocation);
  };

  // Step 1: show GPS permission modal
  const handleUseMyLocation = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGpsError("Geolocation is not supported by your browser.");
      setGpsState("error");
      return;
    }
    setGpsState("permission");
  };

  // Step 2: user clicked Activate GPS
  const handleActivateGps = () => {
    setGpsState("locating");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const loc = await reverseGeocode(latitude, longitude);
          setFoundLocation(loc);
          setCurrentLocation(loc);
          setGpsState("success");
          setTimeout(() => navigateToForecast(loc), 2700);
        } catch {
          const fallback: LocationData = {
            name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
            latitude,
            longitude,
          };
          setFoundLocation(fallback);
          setCurrentLocation(fallback);
          setGpsState("success");
          setTimeout(() => navigateToForecast(fallback), 2700);
        }
      },
      (err) => {
        setGpsState("error");
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError(
            "GPS access was denied. Please enable location permissions in your browser settings, then try again."
          );
        } else {
          setGpsError("Unable to get your location. Check your network and try again.");
        }
      },
      { timeout: 14000, enableHighAccuracy: true }
    );
  };

  const resetGps = () => {
    setGpsState("idle");
    setGpsError(null);
    setFoundLocation(null);
  };

  // Suppress unused warning
  void weatherData;

  return (
    <div className="relative min-h-screen bg-[#050B14] text-[#F8FAFC] overflow-x-hidden flex flex-col font-sans selection:bg-cyan-500/30">
      <AtmosphericIntro
        forceShow={showIntro}
        onComplete={() => setShowIntro(false)}
      />

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

      {/* Hero */}
      <section className="relative z-10 w-full min-h-[85vh] lg:min-h-[92vh] flex flex-col justify-center pt-24 pb-16 px-4 sm:pt-28 sm:pb-20 sm:px-6 lg:px-12 overflow-hidden">

        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <video
            src="/background-vd.mp4"
            autoPlay loop muted playsInline
            className="w-full h-full object-cover object-center scale-105 hidden lg:block"
          />
          <video
            src="/background-vd.mp4"
            autoPlay loop muted playsInline
            className="w-full h-full object-cover object-center scale-105 lg:hidden"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B14] via-[#050B14]/80 to-transparent lg:w-3/4" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-transparent to-[#050B14]/75" />
          <div className="absolute inset-0 bg-[#050B14]/20" />
          <div className="absolute top-1/4 right-1/4 w-[520px] h-[520px] rounded-full blur-[140px] pointer-events-none hidden lg:block"
            style={{ background: "rgba(34,211,238,0.1)" }} />
        </div>

        <div className="max-w-7xl mx-auto w-full flex flex-col justify-center items-start z-10 space-y-6">

          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-cyan-400 text-xs font-semibold tracking-wider uppercase backdrop-blur-md"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 0 25px rgba(34,211,238,0.25)",
            }}
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>LIVE WEATHER · GLOBAL ATMOSPHERIC VIEW</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="space-y-1"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white font-serif leading-[1.05] max-w-3xl drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
              <Shuffle text="Feel the world" tag="span" className="block"
                shuffleDirection="right" duration={0.4} animationMode="evenodd"
                shuffleTimes={2} ease="power3.out" stagger={0.03}
                threshold={0.1} triggerOnce={true} triggerOnHover={true} textAlign="left" />
              <Shuffle text="around you." tag="span" className="block text-shimmer italic font-serif"
                shuffleDirection="right" duration={0.4} animationMode="evenodd"
                shuffleTimes={2} ease="power3.out" stagger={0.03}
                threshold={0.1} triggerOnce={true} triggerOnHover={true} textAlign="left" />
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl text-slate-200 font-normal max-w-xl leading-relaxed drop-shadow-md"
          >
            Explore real-time conditions and 7-day forecasts across a living, rotating Earth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
            className="pt-2 flex flex-col sm:flex-row items-center gap-4"
          >
            {/* Button 1: Use My Location — cyan specular */}
            <SpecularButton
              size="lg"
              radius={20}
              tint="#050B14"
              tintOpacity={0.85}
              blur={14}
              textColor="#e0f2fe"
              lineColor="#67e8f9"
              baseColor="#164e63"
              intensity={1.4}
              idleIntensity={0.55}
              shineSize={14}
              shineFade={42}
              thickness={1.5}
              glow={1.3}
              followMouse
              proximity={280}
              onClick={handleUseMyLocation}
              className="min-w-[220px]"
            >
              <Navigation className="w-5 h-5 shrink-0" />
              <span className="flex flex-col items-start">
                <span className="text-[10px] font-mono uppercase tracking-wider opacity-70">GPS Telemetry</span>
                <span className="text-base font-bold leading-tight">Use my location</span>
              </span>
              <ChevronRight className="w-4 h-4 opacity-60 ml-1" />
            </SpecularButton>

            {/* Button 2: 3D Climate — emerald specular */}
            <SpecularButton
              size="lg"
              radius={20}
              tint="#050B14"
              tintOpacity={0.85}
              blur={14}
              textColor="#d1fae5"
              lineColor="#6ee7b7"
              baseColor="#064e3b"
              intensity={1.4}
              idleIntensity={0.55}
              shineSize={14}
              shineFade={42}
              thickness={1.5}
              glow={1.3}
              followMouse
              proximity={280}
              onClick={() => setIsExplorerOpen(true)}
              className="min-w-[220px]"
            >
              <Globe className="w-5 h-5 shrink-0" />
              <span className="flex flex-col items-start">
                <span className="text-[10px] font-mono uppercase tracking-wider opacity-70">Atmospheric Observatory</span>
                <span className="text-base font-bold leading-tight">3D Climate</span>
              </span>
              <ChevronRight className="w-4 h-4 opacity-60 ml-1" />
            </SpecularButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
            className="pt-2 flex flex-wrap items-center gap-3"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs text-slate-300 backdrop-blur-md"
              style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Target: <strong className="text-white">{currentLocation.name}</strong></span>
              <span className="text-cyan-400 font-mono">({currentLocation.latitude.toFixed(1)}°, {currentLocation.longitude.toFixed(1)}°)</span>
            </div>
            {utcTime && (
              <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-mono text-slate-400 backdrop-blur-md"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{utcTime}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowIntro(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-mono text-cyan-300 hover:text-white bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/40 backdrop-blur-md transition-all cursor-pointer active:scale-95 shadow-sm"
              title="Replay Deep Space Orbital Descent Intro"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Replay Intro</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* 3D Explorer Modal */}
      {isExplorerOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          role="dialog" aria-modal="true" aria-label="3D Climate Explorer"
          className="fixed inset-0 z-50 bg-[#050B14] stars-bg flex flex-col justify-between p-2 sm:p-4 lg:p-6 overflow-y-auto lg:overflow-hidden max-h-screen"
        >
          <div className="relative w-full flex items-center justify-between max-w-7xl mx-auto z-30">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl overflow-hidden border border-white/20 shadow-[0_0_12px_rgba(34,211,238,0.4)]">
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover scale-[1.05]" />
              </div>
              <div>
                <span className="font-bold text-sm tracking-[0.18em] text-white uppercase block">TEMPORA 3D CLIMATE EXPLORER</span>
                <span className="text-[10px] font-mono text-cyan-400 hidden sm:block">Live Global Atmospheric Grid · Real-time Rendering</span>
              </div>
            </div>
            <button type="button" onClick={() => setIsExplorerOpen(false)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-semibold transition-all cursor-pointer hover:bg-white/20"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <X className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>

          <div className="relative z-30 w-full max-w-xl mx-auto my-2">
            <LocationSearch onSelectLocation={handleSelectLocation} placeholder="Search city or location in 3D Earth..." />
          </div>

          <div className="relative z-20 flex-1 flex items-center justify-center my-1 w-full min-h-[380px] sm:min-h-[460px] max-h-[60vh] sm:max-h-[68vh]">
            <GlobeScene selectedLocation={currentLocation} onSelectLocation={handleSelectLocation} onOpenForecast={(loc) => handleGetForecast(loc)} className="w-full h-full" />
          </div>

          <div className="relative z-30 flex flex-col items-center gap-3 pb-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <UseMyLocationButton onLocationFound={handleSelectLocation} />
              <button type="button" onClick={() => handleGetForecast(currentLocation)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-xs sm:text-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
                style={{ background: "rgba(34,211,238,0.2)", color: "#67e8f9", border: "1px solid rgba(34,211,238,0.5)", boxShadow: "0 0 20px rgba(34,211,238,0.3)" }}>
                <span>View {currentLocation.name} Forecast</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide flex items-center gap-2 text-center">
              <span>Drag to rotate Earth</span>
              <span className="text-cyan-400">•</span>
              <span>Scroll or pinch to zoom & reveal more places</span>
              <span className="text-cyan-400">•</span>
              <span>Click markers to view live forecast</span>
            </p>
          </div>
        </motion.div>
      )}

      {/* GPS Modals */}
      <AnimatePresence>
        {gpsState === "permission" && (
          <GpsPermissionModal key="gps-permission" onRequest={handleActivateGps} onCancel={resetGps} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gpsState === "locating" && (
          <GpsLocatingScreen key="gps-locating" onCancel={resetGps} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gpsState === "success" && foundLocation && (
          <GpsSuccessPopup key="gps-success" cityName={foundLocation.name} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gpsState === "error" && gpsError && (
          <motion.div
            key="gps-error"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 z-50 max-w-lg mx-auto inset-x-4 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs backdrop-blur-xl shadow-2xl"
            style={{ background: "rgba(69,10,10,0.92)", border: "1px solid rgba(239,68,68,0.4)", color: "white" }}
          >
            <span className="text-rose-300">{gpsError}</span>
            <button type="button" onClick={resetGps}
              className="p-1 rounded-full hover:bg-white/10 text-slate-300 hover:text-white shrink-0 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 px-4 border-t border-white/10 text-slate-400 text-xs" style={{ background: "#050B14" }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md overflow-hidden border border-white/20 shadow-[0_0_8px_rgba(34,211,238,0.3)]">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover scale-[1.05]" />
            </div>
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
